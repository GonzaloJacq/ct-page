import { useState, useCallback } from 'react';
import { Fee, CreateFeeInput, UpdateFeeInput, ApiResponse } from '../types';

export const useFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const request = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    setLoading(true);
    resetError();
    try {
      const response = await fetch(endpoint, options);
      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Error desconocido');
        return null;
      }
      return data.data || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de conexión';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [resetError]);

  const fetchFees = useCallback(async () => {
    const data = await request<Fee[]>('/api/fees');
    if (data) setFees(data);
  }, [request]);

  const createFee = useCallback(async (input: CreateFeeInput) => {
    const data = await request<Fee>('/api/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (data) {
      setFees((prev) => [...prev, data]);
      return data;
    }
    return null;
  }, [request]);

  const updateFee = useCallback(async (id: string, input: UpdateFeeInput) => {
    const data = await request<Fee>(`/api/fees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (data) {
      setFees((prev) => prev.map((fee) => (fee.id === id ? data : fee)));
      return data;
    }
    return null;
  }, [request]);

  const deleteFee = useCallback(async (id: string) => {
    setLoading(true);
    resetError();
    try {
      const response = await fetch(`/api/fees/${id}`, { method: 'DELETE' });
      const data: ApiResponse<null> = await response.json();
      if (!data.success) {
        setError(data.error || 'Error al eliminar');
        return false;
      }
      setFees((prev) => prev.filter((fee) => fee.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar');
      return false;
    } finally {
      setLoading(false);
    }
  }, [resetError]);

  return { fees, loading, error, fetchFees, createFee, updateFee, deleteFee };
};
