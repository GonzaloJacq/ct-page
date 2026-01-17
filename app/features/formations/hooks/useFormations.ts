import { useState, useCallback } from 'react';
import { Formation, CreateFormationInput, UpdateFormationInput, ApiResponse } from '../types';

export const useFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
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

  const fetchFormations = useCallback(async () => {
    const data = await request<Formation[]>('/api/formations');
    if (data) setFormations(data);
  }, [request]);

  const createFormation = useCallback(async (input: CreateFormationInput) => {
    const data = await request<Formation>('/api/formations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (data) {
      setFormations((prev) => [...prev, data]);
      return data;
    }
    return null;
  }, [request]);

  const updateFormation = useCallback(async (id: string, input: UpdateFormationInput) => {
    const data = await request<Formation>(`/api/formations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (data) {
      setFormations((prev) => prev.map((f) => (f.id === id ? data : f)));
      return data;
    }
    return null;
  }, [request]);

  const deleteFormation = useCallback(async (id: string) => {
    setLoading(true);
    resetError();
    try {
      const response = await fetch(`/api/formations/${id}`, { method: 'DELETE' });
      const data: ApiResponse<null> = await response.json();
      if (!data.success) {
        setError(data.error || 'Error al eliminar');
        return false;
      }
      setFormations((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar');
      return false;
    } finally {
      setLoading(false);
    }
  }, [resetError]);

  return { formations, loading, error, fetchFormations, createFormation, updateFormation, deleteFormation };
};
