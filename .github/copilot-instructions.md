applyTo: '/*.js,/.jsx,**/.ts,/*.tsx,/.json,**/.md'
# AI Copilot Instructions - CLAN TEAM FC Management System

**Equipo de fútbol amateur de amigos - Sistema de gestión integral**

Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4

## 🎯 Code Generation Priorities

- **TypeScript-first**: Always use TypeScript with strict mode enabled
- **Dark mode**: All UI in dark theme by default (bg-gray-900, text-gray-100)
- **Feature-driven**: Organize code by feature, not by type
- **Minimize nesting**: Use early returns and extracted functions
- **Reusable types**: Define once in types/index.ts, use everywhere

## 📁 Project Structure - CLAN TEAM FC

```
app/
├── features/
│   ├── players/           # Gestión de jugadores
│   │   ├── types/index.ts
│   │   ├── hooks/usePlayer.ts
│   │   ├── components/{PlayerForm, PlayerList, index}
│   │   └── page.tsx
│   ├── fees/              # Gestión de cuotas
│   │   ├── types/index.ts
│   │   ├── hooks/useFees.ts
│   │   ├── components/{FeeForm, FeeList, index}
│   │   └── page.tsx
│   ├── matches/           # Historial de partidos
│   │   ├── types/index.ts
│   │   ├── hooks/useMatches.ts
│   │   ├── components/{MatchForm, MatchList, index}
│   │   └── page.tsx
│   └── scorers/           # Estadísticas de goleadores
│       ├── types/index.ts
│       ├── hooks/useScorers.ts
│       ├── components/{ScorerList, index}
│       └── page.tsx
├── api/
│   ├── players/[route.ts, [id]/route.ts]
│   ├── fees/[route.ts, [id]/route.ts]
│   ├── matches/[route.ts, [id]/route.ts]
│   └── scorers/route.ts
├── page.tsx, layout.tsx, globals.css
lib/db/
├── players.ts, fees.ts, matches.ts, scorers.ts
```

**Import Alias**: Use `@/` for all imports from root

## ⚛️ Data Models

### Player
```typescript
interface Player {
  id: string;
  name: string;
  age: number;
  phone: string;
  shirtNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreatePlayerInput {
  name: string;
  age: number;
  phone: string;
  shirtNumber: number;
}

interface UpdatePlayerInput {
  name?: string;
  age?: number;
  phone?: string;
  shirtNumber?: number;
}
```

### Fee
```typescript
interface Fee {
  id: string;
  playerId: string;
  playerName: string;
  month: string; // "2025-12"
  amount: number;
  paid: boolean;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateFeeInput {
  playerId: string;
  month: string;
  amount: number;
}

interface UpdateFeeInput {
  amount?: number;
  paid?: boolean;
  paidDate?: Date;
}
```

### Match
```typescript
interface Match {
  id: string;
  date: Date;
  opponent: string;
  playerIds: string[];
  result?: string; // "3-2" or description
  createdAt: Date;
  updatedAt: Date;
}

interface CreateMatchInput {
  date: Date;
  opponent: string;
  playerIds: string[];
  result?: string;
}

interface UpdateMatchInput {
  date?: Date;
  opponent?: string;
  playerIds?: string[];
  result?: string;
}
```

### Scorer
```typescript
interface Scorer {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  goalsCount: number;
  matchDate: Date;
  opponent: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateScorerInput {
  matchId: string;
  playerId: string;
  goalsCount: number;
}
```

## 🔄 Critical Patterns

### 1. Feature Structure (Apply to each module)
Every feature has:
- `types/index.ts` - All TypeScript interfaces for this feature
- `hooks/use[Feature].ts` - Custom hook with state + API calls
- `components/` - Reusable form/list components
- `page.tsx` - Feature page (uses hook + components)

### 2. Hook Pattern
```typescript
export const usePlayer = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      if (data.success) {
        setPlayers(data.data);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  // Similar pattern: createPlayer, updatePlayer, deletePlayer
  // Each returns data/null and updates local state
  
  return { players, loading, error, fetchPlayers, createPlayer, updatePlayer, deletePlayer };
};
```

### 3. Component Props Pattern
Presentational components are data-agnostic:
```typescript
interface PlayerListProps {
  readonly players: Player[];
  readonly onEdit: (player: Player) => void;
  readonly onDelete: (id: string) => void;
  readonly isLoading?: boolean;
}

// Components don't fetch - container page.tsx handles hooks
```

### 4. Form Components (Create + Edit)
```typescript
interface PlayerFormProps {
  readonly onSubmit: (data: CreatePlayerInput) => Promise<void>;
  readonly initialData?: Player | null;
  readonly isLoading?: boolean;
  readonly onCancel?: () => void;
}

// Form works in both create and edit mode based on initialData
```

### 5. Feature Page Pattern
```typescript
'use client';

export default function PlayersPage() {
  const { players, loading, createPlayer, updatePlayer, deletePlayer, fetchPlayers } = usePlayer();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleSubmit = async (data: CreatePlayerInput) => {
    if (editing) {
      await updatePlayer(editing.id, data);
    } else {
      await createPlayer(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  // Render form + list with data + callbacks
}
```

### 6. API Response Format (Standard)
All endpoints return:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### 7. API Route Validation
Validate at API level:
```typescript
if (!body.name || body.name.trim() === '') {
  return NextResponse.json(
    { success: false, error: 'El nombre es requerido' },
    { status: 400 }
  );
}
```

## 💾 Database Layer (lib/db)

Each file (players.ts, fees.ts, matches.ts, scorers.ts) exports:
- `get*()` - fetch all
- `get*ById(id)` - fetch by id
- `create*(input)` - create (auto-generates id)
- `update*(id, input)` - update
- `delete*(id)` - delete

Currently in-memory using Map. **Migration to Prisma**: Same function signatures, just swap implementation.

## 🎨 Dark Mode Styling

**Globals.css**:
```css
:root {
  color-scheme: dark;
}

body {
  @apply bg-gray-950 text-gray-100;
}
```

**Tailwind patterns**:
- Backgrounds: `bg-gray-900`, `bg-gray-800`, `bg-gray-950`
- Text: `text-gray-100`, `text-gray-200`, `text-gray-400`
- Borders: `border-gray-700`, `border-gray-600`
- Accent: `bg-blue-600 hover:bg-blue-700`
- Destructive: `bg-red-600 hover:bg-red-700`
- Table header: `bg-gray-800`

## 📋 UI Components

**All use 'use client' directive**

### PlayerForm/FeeForm/MatchForm
- Controlled inputs
- Form validation messages
- Submit + Cancel buttons
- Works in create and edit mode

### PlayerList/FeeList/MatchList
- Table with data rows
- Edit/Delete buttons per row
- Empty state message
- Loading indicator

### ScorerList
- View-only table (no edit/delete)
- Sorted by goalsCount DESC
- Shows match context (date, opponent)

## 🛠️ Development Workflow

```bash
yarn dev       # Start dev server
yarn build     # Check TS errors
yarn lint      # ESLint
```

## ✅ Common Tasks

### Add new feature
1. Create `app/features/newfeature/` with structure
2. Define types in `types/index.ts`
3. Create hook `hooks/useNewFeature.ts`
4. Create components `components/{Form, List}`
5. Create API routes `app/api/newfeature/`
6. Create DB functions `lib/db/newfeature.ts`
7. Add link to homepage

### Add field to Player
1. Update `types/index.ts` (Player, CreatePlayerInput)
2. Update form inputs in `PlayerForm.tsx`
3. Update validation in `app/api/players/route.ts`
4. Update `lib/db/players.ts` data model

### Handle Matches ↔ Players
- Matches store playerIds array
- When creating Match, select players (multi-select)
- When displaying Match, resolve playerIds → player names

### Handle Scorers ↔ Matches
- Scorer references matchId
- Create Scorers after Match is created
- Display match context in Scorers (date, opponent)

## 🚨 Patterns to Follow

✅ Use early returns in conditional logic
✅ Extract long functions into smaller pieces
✅ Use descriptive variable/function names
✅ Handle errors robustly (try/catch in hooks)
✅ Type everything with interfaces (no `any`)
✅ Use `@/` path alias for imports
✅ All UI in dark mode
✅ Validate input at API level
✅ Return data/null from hook operations
✅ Manage loading/error states in hooks

❌ Don't call hooks conditionally
❌ Don't use inline event handlers in lists (performance)
❌ Don't fetch in components - use hooks
❌ Don't skip error states
❌ Don't use untyped responses
❌ Don't hardcode API URLs
