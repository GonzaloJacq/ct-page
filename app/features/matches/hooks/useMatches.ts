import { useState, useCallback } from 'react';
import { Match, CreateMatchInput, UpdateMatchInput } from '../types';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/matches');
      const data = await response.json();
      if (data.success) setMatches(data.data);
      else setError(data.error || 'Error al cargar partidos');
    } catch {
      setError('Error al conectar');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMatch = useCallback(async (input: CreateMatchInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (data.success) {
        setMatches((prev) => [...prev, data.data]);
        return data.data;
      }
      setError(data.error);
      return null;
    } catch {
      setError('Error al conectar');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMatch = useCallback(async (id: string, input: UpdateMatchInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (data.success) {
        setMatches((prev) => prev.map((m) => (m.id === id ? data.data : m)));
        return data.data;
      }
      setError(data.error);
      return null;
    } catch {
      setError('Error al conectar');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMatch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/matches/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setMatches((prev) => prev.filter((m) => m.id !== id));
        return true;
      }
      setError(data.error);
      return false;
    } catch {
      setError('Error al conectar');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { matches, loading, error, fetchMatches, createMatch, updateMatch, deleteMatch };
};
