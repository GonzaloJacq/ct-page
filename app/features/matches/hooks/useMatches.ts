import { useState, useCallback } from 'react';
import { Match, CreateMatchInput, UpdateMatchInput, ApiResponse } from '../types';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
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

  const fetchMatches = useCallback(async () => {
    const data = await request<Match[]>('/api/matches');
    if (data) {
      // ensure date is a JS Date
      const normalized = data.map((m) => ({ ...m, date: new Date(m.date) }));
      setMatches(normalized);
    }
  }, [request]);

  const createMatch = useCallback(async (input: CreateMatchInput) => {
    // sanitize gallery folder id (extract just ID if full URL provided)
    const clone = { ...input } as any;
    if (clone.galleryFolderId && typeof clone.galleryFolderId === 'string') {
      const match = clone.galleryFolderId.match(/[-\w]{25,}(?=[^\w]|$)/);
      if (match) clone.galleryFolderId = match[0];
    }
    const data = await request<Match>('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clone),
    });
    if (data) {
      setMatches((prev) => [...prev, { ...data, date: new Date(data.date) }]);
      return data;
    }
    return null;
  }, [request]);

  const updateMatch = useCallback(async (id: string, input: UpdateMatchInput) => {
    const clone = { ...input } as any;
    if (clone.galleryFolderId && typeof clone.galleryFolderId === 'string') {
      const match = clone.galleryFolderId.match(/[-\w]{25,}(?=[^\w]|$)/);
      if (match) clone.galleryFolderId = match[0];
    }
    const data = await request<Match>(`/api/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clone),
    });
    if (data) {
      const normalized = { ...data, date: new Date(data.date) };
      setMatches((prev) => prev.map((m) => (m.id === id ? normalized : m)));
      return data;
    }
    return null;
  }, [request]);

  const deleteMatch = useCallback(async (id: string) => {
    // Rely on request handling errors. Success means we can remove it.
    // Note: If generic request returns null on success (data: null), it returns null.
    // We need to differentiate error from success-null.
    // Current generic request returns null on error. 
    // We can assume if error state is set, it failed.
    
    setLoading(true);
    resetError();
    try {
      const response = await fetch(`/api/matches/${id}`, { method: 'DELETE' });
      const data: ApiResponse<null> = await response.json();
      if (!data.success) {
        setError(data.error || 'Error al eliminar');
        return false;
      }
      setMatches((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar');
      return false;
    } finally {
      setLoading(false);
    }
  }, [resetError]);

  return { matches, loading, error, fetchMatches, createMatch, updateMatch, deleteMatch };
};
