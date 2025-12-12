// Mock database - En producción reemplazar con una BD real
import { Product, CreateProductInput, UpdateProductInput } from '@/app/features/products/types';

const products: Map<string, Product> = new Map();
let productCounter = 1;

// Datos iniciales
export const initializeDb = () => {
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'Laptop de alta performance',
      price: 999.99,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Mouse',
      description: 'Mouse inalámbrico',
      price: 25.99,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  sampleProducts.forEach((product) => {
    products.set(product.id, product);
    productCounter = Math.max(productCounter, parseInt(product.id) + 1);
  });
};

initializeDb();

export const getProducts = (): Product[] => {
  return Array.from(products.values());
};

export const getProductById = (id: string): Product | null => {
  return products.get(id) || null;
};

export const createProduct = (input: CreateProductInput): Product => {
  const id = productCounter.toString();
  productCounter++;

  const product: Product = {
    id,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  products.set(id, product);
  return product;
};

export const updateProduct = (id: string, input: UpdateProductInput): Product | null => {
  const product = products.get(id);
  if (!product) return null;

  const updated: Product = {
    ...product,
    ...input,
    updatedAt: new Date(),
  };

  products.set(id, updated);
  return updated;
};

export const deleteProduct = (id: string): boolean => {
  return products.delete(id);
};
