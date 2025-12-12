# 🚀 Guía de Configuración - ABM Sistema de Productos

## Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

3. **Abrir en el navegador**
```
http://localhost:3000
```

## 📍 URLs Principales

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000` | Página de inicio con enlaces |
| `http://localhost:3000/features/products` | Sistema ABM de productos |
| `http://localhost:3000/api/products` | API REST (GET, POST) |
| `http://localhost:3000/api/products/[id]` | API REST (GET, PUT, DELETE) |

## 🎯 Cómo Usar el Sistema

### 1. Listar Productos
- Ve a `http://localhost:3000/features/products`
- Verás una tabla con los productos iniciales (Laptop y Mouse)

### 2. Crear Producto
- Click en "Nuevo Producto"
- Completa el formulario:
  - Nombre: *Requerido
  - Descripción: *Opcional
  - Precio: *Requerido (sin negativos)
  - Stock: *Requerido (sin negativos)
- Click en "Guardar"

### 3. Editar Producto
- Click en "Editar" en la fila del producto
- El formulario se llenará con los datos actuales
- Modifica los campos necesarios
- Click en "Guardar"

### 4. Eliminar Producto
- Click en "Eliminar" en la fila del producto
- Confirma la acción
- El producto se eliminará de la tabla

## 🔌 Uso Programático del Hook

### Ejemplo en un Cliente
```typescript
'use client';

import { useEffect } from 'react';
import { useProducts } from '@/app/features/products/hooks';
import { CreateProductInput } from '@/app/features/products/types';

export default function MiComponente() {
  const {
    products,      // Array de productos
    loading,       // true mientras se carga
    error,         // Mensaje de error si existe
    fetchProducts, // Función para obtener productos
    createProduct, // Función para crear producto
    updateProduct, // Función para actualizar
    deleteProduct, // Función para eliminar
  } = useProducts();

  useEffect(() => {
    fetchProducts(); // Cargar productos al montar
  }, [fetchProducts]);

  const handleCreate = async () => {
    const newProduct: CreateProductInput = {
      name: 'Teclado',
      description: 'Teclado mecánico',
      price: 149.99,
      stock: 25,
    };
    
    const result = await createProduct(newProduct);
    if (result) {
      console.log('Producto creado:', result);
    }
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleCreate}>Crear Producto</button>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}
```

## 🛠️ Estructura de Carpetas

```
app/
├── features/products/          # Feature de productos
│   ├── components/
│   │   ├── ProductForm.tsx     # Formulario (crear/editar)
│   │   ├── ProductList.tsx     # Tabla de productos
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useProducts.ts      # Hook principal
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript
│   └── page.tsx                # Página del feature
│
├── api/products/
│   ├── route.ts                # GET /api/products, POST /api/products
│   └── [id]/
│       └── route.ts            # GET/PUT/DELETE /api/products/[id]
│
├── layout.tsx
├── page.tsx
└── globals.css

lib/
└── db/
    └── mock.ts                 # Base de datos simulada
```

## 📝 API Endpoints

### GET /api/products
Obtiene todos los productos.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "Laptop de alta performance",
      "price": 999.99,
      "stock": 10,
      "createdAt": "2025-12-11T...",
      "updatedAt": "2025-12-11T..."
    }
  ]
}
```

### POST /api/products
Crea un nuevo producto.

**Body:**
```json
{
  "name": "Monitor",
  "description": "Monitor 4K",
  "price": 599.99,
  "stock": 5
}
```

**Response:** Producto creado (mismo formato que GET)

### GET /api/products/[id]
Obtiene un producto específico.

**Response:** Producto individual (mismo formato que GET)

### PUT /api/products/[id]
Actualiza un producto (campos opcionales).

**Body:**
```json
{
  "name": "Monitor 4K Ultra",
  "price": 649.99
}
```

**Response:** Producto actualizado

### DELETE /api/products/[id]
Elimina un producto.

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Producto eliminado correctamente"
}
```

## 🔧 Validaciones

El sistema valida automáticamente:
- ✅ Nombre no puede estar vacío
- ✅ Precio no puede ser negativo
- ✅ Stock no puede ser negativo
- ✅ Descripción puede estar vacía

## 💾 Base de Datos

**Nota:** Actualmente usa una base de datos simulada en memoria.
- Los datos se pierden al reiniciar el servidor
- Los datos iniciales se cargan automáticamente

### Para migrar a una BD Real:

1. Instalar Prisma:
```bash
npm install @prisma/client @prisma/cli
```

2. Configurar Prisma (ver documentación oficial)

3. Reemplazar `lib/db/mock.ts` con operaciones de Prisma

## 🎨 Estilos

El proyecto usa **Tailwind CSS v4** para todos los estilos.

Archivos relevantes:
- `app/globals.css` - Estilos globales
- `postcss.config.mjs` - Configuración PostCSS
- `tailwind.config.ts` - Configuración Tailwind (si existe)

## 🐛 Troubleshooting

### Error: "Módulo no encontrado"
```bash
npm install
npm run dev
```

### El servidor no inicia
```bash
# Limpiar cache
rm -rf .next
npm run dev
```

### Puerto 3000 en uso
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

## 📚 Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🚀 Próximos Pasos

1. **Agregar Paginación**
   - Implementar en ProductList
   - Actualizar API

2. **Agregar Búsqueda**
   - Input de búsqueda
   - Filtrado en API

3. **Validación Avanzada**
   - Usar librerías como `zod` o `yup`
   - Validar en cliente y servidor

4. **Autenticación**
   - NextAuth.js
   - Proteger rutas

5. **Base de Datos Real**
   - Prisma ORM
   - PostgreSQL o MySQL

6. **Testing**
   - Jest para unit tests
   - React Testing Library para componentes
   - Cypress para E2E

## 📄 Licencia

Este es un proyecto de template. Úsalo como base para tus proyectos.
