import { useState, useCallback } from 'react';
import { Estadistica, ApiResponse } from '../types';

export const useEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);
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

  const fetchEstadisticas = useCallback(async () => {
    const data = await request<Estadistica[]>('/api/estadisticas');
    if (data) setEstadisticas(data);
  }, [request]);

  return { estadisticas, loading, error, fetchEstadisticas };
};
