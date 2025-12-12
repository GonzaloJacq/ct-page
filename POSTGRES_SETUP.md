# Configuración de PostgreSQL + Prisma para Vercel

## 📋 Paso 1: Instalar dependencias

```bash
yarn add @prisma/client
yarn add -D prisma
```

**✅ YA COMPLETADO** - Instaladas versiones 5.21.1

## 📦 Paso 2: Configurar base de datos

### 🔴 PRÓXIMO PASO: Tener PostgreSQL corriendo

## 🔴 PRÓXIMO PASO: Tener PostgreSQL corriendo

### Opción 1: PostgreSQL Local (Windows)
1. Descargar desde: https://www.postgresql.org/download/windows/
2. Ejecutar instalador (guardar contraseña de `postgres`)
3. Confirmar que escucha en `localhost:5432`
4. Crear base de datos:
```bash
psql -U postgres
CREATE DATABASE clanteamfc;
\q
```

### Opción 2: Docker (Más rápido)
```bash
# Instalar Docker desde: https://www.docker.com/products/docker-desktop

# Ejecutar PostgreSQL
docker run --name clanteamfc-db \
  -e POSTGRES_DB=clanteamfc \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

### Opción 3: Nube (Vercel/Railway/Neon)
- Vercel Postgres: https://vercel.com/dashboard/databases
- Neon: https://neon.tech (Free tier)
- Railway: https://railway.app

### Local: PostgreSQL

### En .env.local
```
DATABASE_URL="postgresql://clanteamfc_user:TU_CONTRASEÑA@localhost:5432/clanteamfc"
```

## 🔧 Paso 3: Crear migraciones (Una vez que PostgreSQL esté corriendo)

```bash
# Crear primera migración
yarn prisma:migrate

# Ver estado de migraciones
yarn prisma:migrate:status

# En producción (Vercel)
yarn prisma:deploy
```

**Actualmente hay error porque PostgreSQL no está disponible en `localhost:5432`. Una vez lo instales/configures, ejecuta estos comandos.**

## 📊 Paso 5: Verificar datos (opcional)

```bash
# Abrir Prisma Studio para ver/editar datos
yarn prisma:studio
```

## 🌐 Paso 6: Desplegar en Vercel

1. **Conectar base de datos PostgreSQL**
   - Crear proyecto en [Vercel](https://vercel.com)
   - Opción 1: Usar Postgres de Vercel (https://vercel.com/dashboard/databases)
   - Opción 2: Usar Neon (https://neon.tech)
   - Opción 3: Railway (https://railway.app)

2. **Agregar variable de entorno en Vercel**
   - En Vercel Dashboard → Settings → Environment Variables
   - Agregar `DATABASE_URL` con la connection string

3. **Subir código**
   ```bash
   git push origin main
   ```

4. **Las migraciones se ejecutan automáticamente en el build**

## 📝 Estructura de datos

### Players (Jugadores)
```
id: string (UUID)
name: varchar(255)
age: integer
phone: varchar(20)
shirtNumber: integer (único)
createdAt: timestamp
updatedAt: timestamp
```

### Fees (Cuotas)
```
id: string (UUID)
playerId: string (FK)
playerName: varchar(255)
month: varchar(7) - formato "2025-12"
amount: float
paid: boolean
paidDate: timestamp (nullable)
createdAt: timestamp
updatedAt: timestamp
```

### Matches (Partidos)
```
id: string (UUID)
date: timestamp
opponent: varchar(255)
playerIds: string[] - array de IDs de jugadores
result: varchar(50) nullable
createdAt: timestamp
updatedAt: timestamp
```

### Scorers (Goleadores)
```
id: string (UUID)
matchId: string (FK)
playerId: string (FK)
playerName: varchar(255)
goalsCount: integer
matchDate: timestamp
opponent: varchar(255)
createdAt: timestamp
updatedAt: timestamp
```

## 🔄 Cambios en el código

Los archivos `lib/db/*-prisma.ts` ya contienen las funciones de base de datos usando Prisma.

**Para cambiar del mock al Prisma, renombra los archivos:**

```bash
# En PowerShell
Move-Item lib/db/players.ts lib/db/players-mock.ts
Move-Item lib/db/players-prisma.ts lib/db/players.ts
Move-Item lib/db/fees.ts lib/db/fees-mock.ts
Move-Item lib/db/fees-prisma.ts lib/db/fees.ts
Move-Item lib/db/matches.ts lib/db/matches-mock.ts
Move-Item lib/db/matches-prisma.ts lib/db/matches.ts
Move-Item lib/db/scorers.ts lib/db/scorers-mock.ts
Move-Item lib/db/scorers-prisma.ts lib/db/scorers.ts
```

O actualiza los imports en los API routes manualmente.

## 🐛 Troubleshooting

**Error: Cannot find module '@prisma/client'**
```bash
yarn install
```

**Error de migración**
```bash
# Resetear la base de datos (SOLO EN DESARROLLO)
yarn prisma migrate reset

# Forzar sincronización del schema
yarn prisma db push
```

**Vercel: Error de comando**
```bash
# En vercel.json agregar:
{
  "buildCommand": "prisma generate && next build"
}
```

## ✅ Listo para producción

Con esto tu app estará lista para:
- ✅ Funcionar con PostgreSQL en Vercel
- ✅ Escalabilidad y performance
- ✅ Migraciones automáticas
- ✅ Relaciones de datos intactas
- ✅ Backups y recovery
