# 🚀 Workflow de Desarrollo y Deploy en Vercel

## 📋 Flujo Completo (Dev → GitHub → Vercel)

```
Tu Máquina Local
    ↓ (editas código)
    ↓
Git Commit
    ↓ (git push)
    ↓
GitHub Repo
    ↓ (webhook automático)
    ↓
Vercel Build
    ↓ (compila y deploy)
    ↓
Live en Producción
```

---

## 1️⃣ EDITAR CODE LOCALMENTE

### Opción A: En VS Code
```
1. Abre el proyecto en VS Code
2. Edita los archivos que necesites
3. Verás los cambios en tiempo real (si tienes `yarn dev` corriendo)
```

### Opción B: Desde Terminal
```powershell
# Iniciar servidor de desarrollo
cd d:\repos\ct-page\ct-page
yarn dev

# Accede a http://localhost:3000
```

---

## 2️⃣ CAMBIOS COMUNES Y DÓNDE HACERLOS

### Agregar un nuevo Jugador (Programáticamente)

**Archivo**: `app/features/players/hooks/usePlayer.ts`
```typescript
export const usePlayer = () => {
  // Este hook maneja la lógica de crear, leer, actualizar, eliminar
  // Los cambios automáticamente se reflejan en la UI
};
```

### Cambiar Textos/UI

**Archivos**: `app/features/*/components/*.tsx`
```typescript
// Ejemplo: cambiar texto del botón
<button>Crear Nuevo Jugador</button>  // ← edita aquí
```

### Agregar Variables de Entorno

**Archivo**: `.env.local` (local) o Dashboard de Vercel (producción)
```env
DATABASE_URL="..." # Ya está configurada
NUEVA_VARIABLE="valor"
```

### Cambiar Lógica de API

**Archivos**: `app/api/*/route.ts`
```typescript
// Ejemplo: modificar validación
if (!body.name || body.name.trim() === '') {
  return NextResponse.json(...);
}
```

### Cambiar Base de Datos

**Archivo**: `prisma/schema.prisma`
```prisma
model Player {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(255)
  // Agrega campos aquí...
}
```
Luego ejecuta:
```powershell
yarn prisma:migrate "descripcion_del_cambio"
```

---

## 3️⃣ HACER COMMITS Y PUSH

### Flujo Básico (Lo que harás siempre)

```powershell
cd d:\repos\ct-page\ct-page

# 1. Ver cambios
git status

# 2. Agregar cambios
git add .                    # Todos los cambios
# O específicos:
git add app/features/players/

# 3. Hacer commit
git commit -m "Descripción clara del cambio"

# 4. Push a GitHub
git push origin main
```

### Ejemplo Real
```powershell
# Editaste 3 archivos
git status
# On branch main
# Changes not staged for commit:
#   modified:   app/features/players/components/PlayerForm.tsx
#   modified:   app/features/players/hooks/usePlayer.ts
#   new file:   app/features/players/README.md

# Agregamos todo
git add .

# Commit con mensaje descriptivo
git commit -m "Feat: Add validation for shirt number uniqueness"

# Push
git push origin main
```

---

## 4️⃣ VERCEL AUTO-DEPLOY (Automático)

Cuando haces `git push origin main`, Vercel **automáticamente**:

1. **Detecta el push** en GitHub
2. **Clona el código** nuevo
3. **Corre el build** (`prisma generate && next build`)
4. **Deploy a producción** si todo está OK
5. **URL sigue igual** (https://ct-page-ejs71ifbm-gonzalos-projects1.vercel.app)

### Ver Estado del Deploy

**Opción A: Terminal (Vercel CLI)**
```powershell
vercel logs --tail
```

**Opción B: Dashboard Vercel**
1. Ve a https://vercel.com/gonzalos-projects1/ct-page
2. Click en **Deployments** (tab superior)
3. Verás todos los deploys con status:
   - 🔵 Building
   - 🟢 Ready (éxito)
   - 🔴 Failed (error)

---

## 5️⃣ CAMBIOS EN LA BASE DE DATOS

Si necesitas **agregar campos** al modelo:

### Paso 1: Editar `schema.prisma`

```prisma
model Player {
  id              String   @id @default(cuid())
  name            String   @db.VarChar(255)
  age             Int
  phone           String   @db.VarChar(20)
  shirtNumber     Int      @unique
  dateOfBirth     DateTime  // ← NUEVO CAMPO
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  fees    Fee[]
  scorers Scorer[]
  
  @@index([name])
  @@map("players")
}
```

### Paso 2: Crear Migración

```powershell
# Crea la migración localmente (requiere DATABASE_URL en .env)
$env:DATABASE_URL='postgres://...' ; yarn prisma:migrate "add_dateOfBirth_to_player"
```

Esto genera:
```
prisma/migrations/[timestamp]_add_dateOfBirth_to_player/migration.sql
```

### Paso 3: Commit y Push

```powershell
git add prisma/migrations/
git commit -m "feat: Add dateOfBirth field to Player model"
git push origin main
```

Vercel automáticamente:
1. Genera Prisma Client
2. Corre las migraciones en Producción
3. Deploy exitoso ✅

---

## 6️⃣ SI ALGO SALE MAL

### Error en Compilación

**Ver logs**:
```powershell
vercel logs --tail
```

**Soluciones comunes**:
- TypeScript error → Arregla y haz nuevo push
- Migración fallida → Revierte cambios y prueba local primero
- Variable env faltante → Agrega en Vercel Dashboard

### Error en Producción (App corriendo pero con error)

1. Abre las DevTools del navegador (F12)
2. Ve a la tab de **Console** para ver errores JavaScript
3. Ve a la tab de **Network** para ver errores de API

### Revertir Cambios

```powershell
# Si hiciste cambios pero NO hiciste commit aún
git checkout -- app/features/players/

# Si ya hiciste commit pero NO push
git reset --soft HEAD~1  # Vuelve el commit, pero mantiene cambios

# Si ya hiciste push (revert completo)
git revert HEAD  # Crea un nuevo commit que "deshace" el anterior
git push origin main
```

---

## 7️⃣ CHECKLIST ANTES DE HACER PUSH

```
[ ] Código edita localmente
[ ] Prueba en http://localhost:3000 (yarn dev)
[ ] Compila sin errores (yarn build)
[ ] TypeScript sin errores (yarn build)
[ ] Cambios relacionados con esquema? → Migración creada
[ ] Tests pasan (si aplica)
[ ] Commit message es descriptivo
[ ] Git status está limpio (git status)
[ ] Push a origin main
[ ] Vercel deploy verde en dashboard
```

---

## 8️⃣ COMANDOS FRECUENTES

### Desarrollo Local
```powershell
# Iniciar servidor
yarn dev

# Compilar sin correr
yarn build

# Ver estructura de la BD
yarn prisma:studio

# Crear migración (requiere DATABASE_URL)
$env:DATABASE_URL='...' ; yarn prisma:migrate "nombre_migracion"

# Ver estado de migraciones
yarn prisma:deploy
```

### Git
```powershell
# Ver cambios
git status
git diff

# Hacer commit
git add .
git commit -m "mensaje"
git push origin main

# Ver historial
git log --oneline

# Crear branch nuevo (opcional)
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad
# Después hacer Pull Request en GitHub
```

### Vercel
```powershell
# Ver logs en tiempo real
vercel logs --tail

# Deploy manual
vercel deploy --prod

# Información del proyecto
vercel env list
```

---

## 9️⃣ EJEMPLO COMPLETO: Agregar Campo a Player

### Paso 1: Editar schema.prisma

```prisma
model Player {
  // ... campos existentes
  nationality String @db.VarChar(100)  // ← NUEVO
  // ...
}
```

### Paso 2: Crear migración

```powershell
$env:DATABASE_URL='postgres://86ea...sslmode=require' ; yarn prisma:migrate "add_nationality_to_player"
```

Output:
```
✔ Name of migration … add_nationality_to_player
✔ Database synced to the new schema.
✔ Generated Prisma Client (v5.21.1)
```

### Paso 3: Actualizar componentes (si necesitas mostrar el campo)

Edita: `app/features/players/components/PlayerForm.tsx`

```typescript
const PlayerForm = ({ onSubmit, initialData, isLoading, onCancel }: PlayerFormProps) => {
  const [formData, setFormData] = useState<CreatePlayerInput>({
    name: initialData?.name ?? '',
    age: initialData?.age ?? 18,
    phone: initialData?.phone ?? '',
    shirtNumber: initialData?.shirtNumber ?? 1,
    nationality: initialData?.nationality ?? '', // ← NUEVO
  });

  return (
    // ... form inputs
    <input
      type="text"
      placeholder="Nacionalidad"
      value={formData.nationality}
      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
    />
  );
};
```

### Paso 4: Actualizar tipos

Edita: `app/features/players/types/index.ts`

```typescript
export interface CreatePlayerInput {
  readonly name: string;
  readonly age: number;
  readonly phone: string;
  readonly shirtNumber: number;
  readonly nationality: string; // ← NUEVO
}

export interface Player extends CreatePlayerInput {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
```

### Paso 5: Commit y Push

```powershell
git add .
git commit -m "feat: Add nationality field to Player"
git push origin main
```

**Vercel automáticamente**:
1. Corre migración en Producción
2. Compila Next.js
3. Deploy exitoso ✅

---

## 🔟 BRANCHES Y PULL REQUESTS (Opcional - Para Equipos)

Si trabajas en equipo:

```powershell
# Crear branch para nueva feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: implementar X"

# Push el branch
git push origin feature/nueva-funcionalidad

# En GitHub: Abre Pull Request
# - Revisa cambios
# - Merge a main
# - Vercel deploy automático
```

---

## 📊 Resumen Rápido

| Acción | Comando | Auto-Deploy? |
|--------|---------|--------------|
| Editar código | VS Code | ❌ Solo local |
| Commit local | `git commit` | ❌ Solo local |
| Push a GitHub | `git push` | ✅ Auto en Vercel |
| Ver deploy | Dashboard Vercel | — |
| Revertir cambios | `git revert` | ✅ Auto |

---

## 🎯 Tu Workflow Típico

```
1. Terminal:      yarn dev
2. VS Code:       Edita archivos
3. Browser:       http://localhost:3000 (prueba)
4. Terminal:      git add . && git commit -m "..."
5. Terminal:      git push origin main
6. Browser:       Dashboard Vercel (observa deploy)
7. Browser:       https://ct-page-ejs71...app (verifica cambios)
```

---

## ❓ FAQ

**P: ¿Se actualiza la web automáticamente después de push?**
A: Sí, en 1-3 minutos después de `git push origin main`

**P: ¿Necesito hacer `vercel deploy`?**
A: NO, Vercel detecta automáticamente los pushes a GitHub

**P: ¿Puedo tener múltiples versiones?**
A: Sí, usa branches y Vercel crea URLs preview automáticas

**P: ¿Cómo deshago un deploy?**
A: Con `git revert` + nuevo `git push origin main`

**P: ¿Puedo deployar manualmente?**
A: Sí: `vercel deploy --prod` (pero mejor usar git push)

---

¿Necesitas ayuda con alguno de estos pasos? 🚀
