import { useState, useCallback } from 'react';
import { Scorer, CreateScorerInput, UpdateScorerInput } from '../types';

export const useScorers = () => {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScorers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/scorers');
      const data = await response.json();
      if (data.success) setScorers(data.data);
      else setError(data.error || 'Error al cargar goleadores');
    } catch {
      setError('Error al conectar');
    } finally {
      setLoading(false);
    }
  }, []);

  const createScorer = useCallback(async (input: CreateScorerInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/scorers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (data.success) {
        setScorers((prev) => [...prev, data.data]);
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

  const updateScorer = useCallback(async (id: string, input: UpdateScorerInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/scorers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (data.success) {
        setScorers((prev) => prev.map((s) => (s.id === id ? data.data : s)));
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

  const deleteScorer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/scorers/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setScorers((prev) => prev.filter((s) => s.id !== id));
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

  return { scorers, loading, error, fetchScorers, createScorer, updateScorer, deleteScorer };
};
