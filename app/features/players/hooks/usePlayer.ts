'use client';

import { useCallback, useState } from 'react';
import { Player, CreatePlayerInput, UpdatePlayerInput, ApiResponse } from '../types';

export const usePlayer = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => setError(null), []);

  /**
   * Generic helper for API requests to reduce boilerplate
   */
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

  const fetchPlayers = useCallback(async () => {
    const data = await request<Player[]>('/api/players');
    if (data) setPlayers(data);
  }, [request]);

  const createPlayer = useCallback(async (input: CreatePlayerInput) => {
    const data = await request<Player>('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (data) {
      setPlayers((prev) => [data, ...prev]);
      return data;
    }
    return null;
  }, [request]);

  const updatePlayer = useCallback(async (id: string, input: UpdatePlayerInput) => {
    const data = await request<Player>(`/api/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (data) {
      setPlayers((prev) => prev.map((p) => (p.id === id ? data : p)));
      return data;
    }
    return null;
  }, [request]);

  const deletePlayer = useCallback(async (id: string) => {
    // Delete typically returns null data on success, we just check for success flag (handled in request)
    // However, our API might return null data. 
    // We need to differentiate "error" (return null) vs "success with null data".
    // The generic request returns null on error. 
    // To properly handle boolean success, we might need to tweak request or just check if data !== null if strict.
    // But since DELETE returns null data on success, `request` returns null. This is ambiguous.
    // Let's rely on the fact that if request fails, error state is set.
    
    // Actually, let's adjust the DELETE endpoint response or generic request to return strict wrapper if needed.
    // For simplicity, let's just check if error is null after request.
    
    // Better approach: Request returns T | null. If success but T is void/null, it returns null.
    // If error, it returns null AND sets error.
    
    setLoading(true);
    resetError();
    try {
       const response = await fetch(`/api/players/${id}`, { method: 'DELETE' });
       const data: ApiResponse<null> = await response.json();
       
       if (!data.success) {
         setError(data.error || 'Error al eliminar');
         return false;
       }
       
       setPlayers((prev) => prev.filter((p) => p.id !== id));
       return true;
    } catch (err) {
       setError(err instanceof Error ? err.message : 'Error de conexión');
       return false;
    } finally {
       setLoading(false);
    }
  }, [resetError]);

  return {
    players,
    loading,
    error,
    fetchPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
  };
};
