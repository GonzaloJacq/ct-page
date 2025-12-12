import { useState, useCallback } from 'react';
import { Product, CreateProductInput, UpdateProductInput } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || 'Error al cargar productos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (input: CreateProductInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success) {
        setProducts((prev) => [...prev, data.data]);
        return data.data;
      } else {
        setError(data.error || 'Error al crear producto');
        return null;
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, input: UpdateProductInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success) {
        setProducts((prev) =>
          prev.map((product) => (product.id === id ? data.data : product))
        );
        return data.data;
      } else {
        setError(data.error || 'Error al actualizar producto');
        return null;
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
        return true;
      } else {
        setError(data.error || 'Error al eliminar producto');
        return false;
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
