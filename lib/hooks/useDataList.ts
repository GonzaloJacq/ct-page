/**
 * Hook personalizado para manejo de estado de lista de datos
 * Principio SOLID: Single Responsibility - Responsabilidad única
 */

'use client';

import { useCallback, useState } from 'react';
import { ApiResponse } from '@/lib/types/common';

interface UseDataListState<T> {
  readonly items: T[];
  readonly loading: boolean;
  readonly error: string | null;
}

interface UseDataListActions<T, CreateInput, UpdateInput> {
  readonly fetch: () => Promise<void>;
  readonly create: (input: CreateInput) => Promise<boolean>;
  readonly update: (id: string, input: UpdateInput) => Promise<boolean>;
  readonly delete: (id: string) => Promise<boolean>;
  readonly clearError: () => void;
}

export const useDataList = <T extends { id: string }, CreateInput, UpdateInput>(
  endpoint: string
): UseDataListState<T> & UseDataListActions<T, CreateInput, UpdateInput> => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setErrorState = useCallback((message: string): void => {
    setError(message);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const fetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await global.fetch(endpoint);
      const data = (await response.json()) as ApiResponse<T[]>;

      if (!data.success) {
        setErrorState(data.error || 'Error al cargar datos');
        return;
      }

      setItems(data.data || []);
    } catch (err) {
      setErrorState(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [endpoint, clearError, setErrorState]);

  const create = useCallback(
    async (input: CreateInput): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        const response = await global.fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const data = (await response.json()) as ApiResponse<T>;

        if (!data.success) {
          setErrorState(data.error || 'Error al crear');
          return false;
        }

        if (data.data) {
          setItems((prev) => [data.data as T, ...prev]);
        }
        return true;
      } catch (err) {
        setErrorState(err instanceof Error ? err.message : 'Error de conexión');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, clearError, setErrorState]
  );

  const update = useCallback(
    async (id: string, input: UpdateInput): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        const response = await global.fetch(`${endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const data = (await response.json()) as ApiResponse<T>;

        if (!data.success) {
          setErrorState(data.error || 'Error al actualizar');
          return false;
        }

        if (data.data) {
          setItems((prev) =>
            prev.map((item) => (item.id === id ? data.data as T : item))
          );
        }
        return true;
      } catch (err) {
        setErrorState(err instanceof Error ? err.message : 'Error de conexión');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, clearError, setErrorState]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        const response = await global.fetch(`${endpoint}/${id}`, {
          method: 'DELETE',
        });

        const data = (await response.json()) as ApiResponse<void>;

        if (!data.success) {
          setErrorState(data.error || 'Error al eliminar');
          return false;
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err) {
        setErrorState(err instanceof Error ? err.message : 'Error de conexión');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, clearError, setErrorState]
  );

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    delete: deleteItem,
    clearError,
  };
};
