# Sistema ABM de Productos

Una estructura completa y moderna para un sistema ABM (Alta, Baja, Modificación / CRUD) en Next.js 16.

## 🏗️ Estructura del Proyecto

```
ct-page/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts           # GET (listar), POST (crear)
│   │       └── [id]/
│   │           └── route.ts       # GET (obtener), PUT (actualizar), DELETE (eliminar)
│   │
│   ├── features/
│   │   └── products/
│   │       ├── components/
│   │       │   ├── ProductForm.tsx    # Formulario reutilizable
│   │       │   ├── ProductList.tsx    # Tabla de productos
│   │       │   └── index.ts           # Exportaciones
│   │       │
│   │       ├── hooks/
│   │       │   └── useProducts.ts     # Lógica de productos
│   │       │
│   │       ├── types/
│   │       │   └── index.ts           # Interfaces TypeScript
│   │       │
│   │       └── page.tsx               # Página principal del ABM
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── lib/
│   └── db/
│       └── mock.ts                # Base de datos simulada
│
└── package.json
```

## 📦 Tipos de Datos

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateProductInput / UpdateProductInput
```typescript
interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
```

## 🎯 Funcionalidades

### 1. **Listar Productos**
- Endpoint: `GET /api/products`
- Componente: `ProductList.tsx`
- Hook: `useProducts().fetchProducts()`

### 2. **Crear Producto**
- Endpoint: `POST /api/products`
- Componente: `ProductForm.tsx`
- Hook: `useProducts().createProduct()`

### 3. **Obtener Producto**
- Endpoint: `GET /api/products/[id]`
- Hook: `useProducts().fetchProducts()`

### 4. **Actualizar Producto**
- Endpoint: `PUT /api/products/[id]`
- Componente: `ProductForm.tsx` (modo edición)
- Hook: `useProducts().updateProduct()`

### 5. **Eliminar Producto**
- Endpoint: `DELETE /api/products/[id]`
- Hook: `useProducts().deleteProduct()`

## 🚀 Uso

### Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Acceder al ABM
Navega a [http://localhost:3000/features/products](http://localhost:3000/features/products)

## 🧪 Ejemplo de Uso del Hook

```typescript
'use client';

import { useEffect } from 'react';
import { useProducts } from '@/app/features/products/hooks/useProducts';

export default function MyComponent() {
  const { products, loading, error, fetchProducts, createProduct } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async () => {
    await createProduct({
      name: 'Nuevo Producto',
      description: 'Descripción',
      price: 99.99,
      stock: 10,
    });
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleCreate}>Crear Producto</button>
    </div>
  );
}
```

## 🔄 Componentes Principales

### ProductForm
Formulario reutilizable para crear y editar productos.

**Props:**
- `onSubmit: (data: CreateProductInput) => Promise<void>` - Callback al enviar
- `initialData?: Product | null` - Datos iniciales (para edición)
- `isLoading?: boolean` - Mostrar estado de carga
- `onCancel?: () => void` - Callback para cancelar

### ProductList
Tabla con listado de productos y acciones.

**Props:**
- `products: Product[]` - Lista de productos
- `onEdit: (product: Product) => void` - Callback al editar
- `onDelete: (id: string) => void` - Callback al eliminar
- `isLoading?: boolean` - Mostrar estado de carga

## 📡 API Responses

Todas las respuestas siguen el formato:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Ejemplo exitoso:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Laptop",
    "description": "Laptop de alta performance",
    "price": 999.99,
    "stock": 10,
    "createdAt": "2025-12-11T...",
    "updatedAt": "2025-12-11T..."
  }
}
```

**Ejemplo con error:**
```json
{
  "success": false,
  "error": "El nombre es requerido"
}
```

## 🛠️ Próximos Pasos

### Migrar a Base de Datos Real
1. Instalar Prisma: `npm install @prisma/client`
2. Reemplazar `lib/db/mock.ts` con implementación de Prisma
3. Actualizar las rutas de API

### Agregar Más Features
- Búsqueda y filtrado
- Paginación
- Validación más robusta
- Autenticación
- Autorización

### Mejorar Componentes
- Agregar paginación en `ProductList`
- Agregar confirmaciones de eliminación
- Mejorar estilos y diseño
- Agregar feedback visual

## 📝 Notas

- La base de datos actual es de mock. Los datos se pierden al reiniciar el servidor.
- Para producción, reemplaza `lib/db/mock.ts` con una base de datos real.
- Todos los componentes usan Tailwind CSS para estilos.
- El proyecto está completamente tipado con TypeScript.

## 🔐 Validaciones Actuales

- **Nombre**: Requerido, no puede estar vacío
- **Precio**: No puede ser negativo
- **Stock**: No puede ser negativo
- **Descripción**: Opcional
