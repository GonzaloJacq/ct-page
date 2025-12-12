'use client';

import { useCallback, useState } from 'react';
import { Player, CreatePlayerInput, UpdatePlayerInput } from '../types';

export const usePlayer = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback((): void => {
    setError(null);
  }, []);

  const setErrorState = useCallback((message: string): void => {
    setError(message);
  }, []);

  const fetchPlayers = useCallback(async (): Promise<void> => {
    setLoading(true);
    resetError();

    try {
      const response = await fetch('/api/players');
      const data = await response.json();

      if (!data.success) {
        setErrorState(data.error || 'Error al cargar jugadores');
        return;
      }

      setPlayers(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar';
      setErrorState(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [resetError, setErrorState]);

  const createPlayer = useCallback(
    async (input: CreatePlayerInput): Promise<Player | null> => {
      setLoading(true);
      resetError();

      try {
        const response = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!data.success) {
          setErrorState(data.error || 'Error al crear jugador');
          return null;
        }

        setPlayers((prev) => [data.data, ...prev]);
        return data.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al conectar';
        setErrorState(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [resetError, setErrorState]
  );

  const updatePlayer = useCallback(
    async (id: string, input: UpdatePlayerInput): Promise<Player | null> => {
      setLoading(true);
      resetError();

      try {
        const response = await fetch(`/api/players/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!data.success) {
          setErrorState(data.error || 'Error al actualizar');
          return null;
        }

        setPlayers((prev) => prev.map((p) => (p.id === id ? data.data : p)));
        return data.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al conectar';
        setErrorState(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [resetError, setErrorState]
  );

  const deletePlayer = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      resetError();

      try {
        const response = await fetch(`/api/players/${id}`, { method: 'DELETE' });
        const data = await response.json();

        if (!data.success) {
          setErrorState(data.error || 'Error al eliminar');
          return false;
        }

        setPlayers((prev) => prev.filter((p) => p.id !== id));
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al conectar';
        setErrorState(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [resetError, setErrorState]
  );

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
