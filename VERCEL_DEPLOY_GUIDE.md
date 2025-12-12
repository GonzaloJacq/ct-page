# 🚀 Guía de Deploy en Vercel - CLAN TEAM FC

## Estado Actual
✅ **Database**: Prisma Postgres creada y migraciones aplicadas  
✅ **Code**: Build compila sin errores  
✅ **Prisma Client**: Generado correctamente  
✅ **Environment**: `.env` configurado localmente  

## Pasos para Deploy en Vercel

### 1️⃣ Inicializar Git (si aún no lo has hecho)

```powershell
cd d:\repos\ct-page\ct-page
git init
git add .
git commit -m "Initial commit: CLAN TEAM FC with Prisma Postgres"
git branch -M main
```

### 2️⃣ Crear Repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Crea un repo llamado `ct-page`
3. NO inicialices con README (ya lo tienes local)
4. Copia el comando: `git remote add origin https://github.com/TU_USUARIO/ct-page.git`

```powershell
git remote add origin https://github.com/TU_USUARIO/ct-page.git
git push -u origin main
```

### 3️⃣ Instalar Vercel CLI

```powershell
npm install -g @vercel/cli
# o
yarn global add @vercel/cli
```

### 4️⃣ Login en Vercel

```powershell
vercel login
```

### 5️⃣ Hacer Deploy

```powershell
cd d:\repos\ct-page\ct-page
vercel
```

**Responde las preguntas:**
- `Set up and deploy "D:\repos\ct-page\ct-page"? (Y/n)` → **Y**
- `Which scope do you want to deploy to?` → Tu usuario personal
- `Link to existing project? (y/N)` → **N**
- `What's your project's name?` → **ct-page** (presiona Enter)
- `In which directory is your code located?` → **.** (presiona Enter)
- `Want to override the settings? (y/N)` → **N**

### 6️⃣ Agregar DATABASE_URL en Vercel Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `ct-page`
3. Ve a **Settings** → **Environment Variables**
4. Click **"Add New"**
   - **Name**: `DATABASE_URL`
   - **Value**: (copia la URL completa de Prisma Postgres)
   - **Environments**: Selecciona **Production**, **Preview**, **Development**
5. Click **"Save"**

### 7️⃣ Triggear Redeploy

Una vez agregada la variable de entorno:

**Opción A: Desde Terminal**
```powershell
git commit --allow-empty -m "Trigger redeploy with DATABASE_URL"
git push origin main
```

**Opción B: Desde Dashboard**
1. Ve a **Deployments**
2. Click en el último deployment
3. Click **"Redeploy"**

## ✅ Verificar que Funciona

Una vez desplegado, deberías poder acceder a:

- **URL del Sitio**: `https://ct-page.vercel.app`
- **API Players**: `https://ct-page.vercel.app/api/players`
- **Features Pages**:
  - `https://ct-page.vercel.app/features/players`
  - `https://ct-page.vercel.app/features/fees`
  - `https://ct-page.vercel.app/features/matches`
  - `https://ct-page.vercel.app/features/scorers`

## 🔗 Conexiones de Base de Datos

| Entorno | Base de Datos | DATABASE_URL |
|---------|---------------|--------------|
| **Local** | Prisma Postgres (desarrollo) | En `.env` (no commiteado) |
| **Production (Vercel)** | Prisma Postgres (mismo) | En Vercel Dashboard → Environment Variables |

## 📝 Datos de Conexión Prisma Postgres

```
Host: db.prisma.io
Puerto: 5432
Usuario: [en DATABASE_URL]
Contraseña: [en DATABASE_URL]
Database: postgres
SSL: require
```

## 🚨 Si Algo Sale Mal

**Error: "DATABASE_URL is not set"**
- Verifica que agregaste la variable en Vercel Dashboard → Settings → Environment Variables
- Espera 5 minutos a que se propague
- Redeploy manual

**Error: "P1001 - Can't reach database server"**
- Verifica que la DATABASE_URL está correcta (sin espacios, URL completa)
- Verifica que `sslmode=require` está en la URL

**Error: "Migration failed"**
- Las migraciones se aplican automáticamente en build (vercel.json lo hace)
- Si falla, revisa los logs de Vercel Dashboard → Deployments → View Logs

## 📊 Próximos Pasos

1. ✅ Test en producción (crear un jugador desde la web)
2. ⏳ Configurar dominio personalizado (opcional)
3. ⏳ Configurar CI/CD avanzado
4. ⏳ Agregar testing automatizado

---

**¿Necesitas ayuda?** Consulta [Vercel Docs](https://vercel.com/docs) o [Prisma Docs](https://www.prisma.io/docs/)
