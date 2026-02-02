# Sistema de Votaciones - Documentación

## Estructura Implementada

Se ha creado un nuevo módulo de votaciones integrado en el sidebar y con acceso mediante `/features/votaciones`.

### 📁 Estructura de Carpetas

```
app/features/votaciones/
├── page.tsx (Página principal de votaciones)
├── layout.tsx
├── crear/
│   └── page.tsx (Crear nueva votación)
├── generales/
│   └── page.tsx (Votaciones generales)
├── mvp/
│   └── page.tsx (Votar MVP)
├── components/
│   ├── VotacionesHome.tsx (Página de inicio)
│   ├── CrearVotacion.tsx (Formulario crear votación)
│   ├── VotacionesGenerales.tsx (Mostrar votaciones)
│   ├── VotarMVP.tsx (Sistema de votación MVP)
│   └── index.ts
├── types/
│   └── index.ts (Tipos TypeScript)
├── hooks/
│   └── (Para hooks personalizados - vacío por ahora)
```

### 🎯 Funcionalidades Implementadas

#### 1. **Página Principal de Votaciones** (`/features/votaciones`)
- Dashboard con 3 opciones principales
- Acceso a crear votación, votaciones generales y votar MVP

#### 2. **Crear Votación** (`/features/votaciones/crear`)
- Formulario para crear votaciones generales
- Campo de título y descripción
- Sistema dinámico de opciones (añadir/eliminar)
- Validación de mínimo 2 opciones

#### 3. **Votaciones Generales** (`/features/votaciones/generales`)
- Mostrar votaciones activas (actualmente sin votaciones - ready para API)
- Estado vacío con placeholder

#### 4. **Votar MVP** (`features/votaciones/mvp`) ✨ **COMPLETO**
- **Carga de partidos**: Obtiene los partidos jugados de la BD
- **Selección de partido**: Grid interactivo con todos los partidos
- **Visualización de jugadores**: Muestra jugadores que jugaron en el partido
- **Sistema de votación**: 
  - Seleccionar jugador MVP
  - Confirmación antes de votar
  - Feedback visual de éxito
- **Interfaz responsiva**: Diseño mobile-first

### 🔧 Tipos TypeScript (types/index.ts)

```typescript
- Votacion: Estructura de votación general
- Voto: Estructura del voto
- VotoMVP: Estructura del voto MVP (extends Voto)
- MatchWithPlayers: Partidos con jugadores incluidos
```

### 🎨 Componentes Destacados

**VotarMVP.tsx** - Sistema completo de votación MVP con:
- ✅ Selección interactiva de partidos
- ✅ Carga de jugadores por partido
- ✅ Estado de confirmación
- ✅ Feedback visual
- ✅ Diseño responsivo

### 🔗 Integración en Sidebar

Se agregó la opción "Votaciones" en el menu lateral:
- Icono: `Vote` (lucide-react)
- Posición: Después de "Goleadores", antes de "Cuotas"
- Ruta: `/features/votaciones`

### 📋 Estados del Sistema

| Componente | Estado | Notas |
|-----------|--------|-------|
| Crear Votación | ✅ Implementado | Falta conexión a API |
| Votaciones Generales | ✅ Diseño listo | Falta lógica de visualización |
| Votar MVP | ✅ Implementado | Falta conexión a API para guardar votos |
| Sidebar | ✅ Actualizado | Integración completa |

### 🚀 Próximos Pasos

1. **Crear rutas API** para:
   - POST `/api/votaciones` - Crear votación
   - GET `/api/votaciones` - Listar votaciones
   - POST `/api/votaciones/[id]/votos` - Registrar voto

2. **Base de datos** - Agregar modelos en Prisma:
   - Votacion model
   - Voto model

3. **Conexiones**: Conectar componentes con APIs

4. **Persistencia**: Guardar votos en BD

## 📖 Cómo Usar

### Acceder al Sistema
1. Click en "Votaciones" en el sidebar
2. Elige entre:
   - Crear Votación
   - Votaciones Generales
   - Votar MVP

### Votar MVP
1. Ve a "Votar MVP"
2. Selecciona un partido de la lista izquierda
3. Los jugadores del partido aparecen en el lado derecho
4. Haz click en el jugador que deseas como MVP
5. Confirma el voto
6. Listo! Tu voto fue registrado

## 🎯 Próximas Funcionalidades

- Historial de votos
- Ver resultados de votaciones
- Exportar estadísticas
- Editar/eliminar votaciones
