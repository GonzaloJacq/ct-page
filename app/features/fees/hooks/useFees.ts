import { useState, useCallback } from 'react';
import { Fee, CreateFeeInput, UpdateFeeInput } from '../types';

export const useFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fees');
      const data = await response.json();
      if (data.success) {
        setFees(data.data);
      } else {
        setError(data.error || 'Error al cargar cuotas');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFee = useCallback(async (input: CreateFeeInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (data.success) {
        setFees((prev) => [...prev, data.data]);
        return data.data;
      }
      setError(data.error || 'Error al crear cuota');
      return null;
    } catch {
      setError('Error al conectar con el servidor');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFee = useCallback(async (id: string, input: UpdateFeeInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (data.success) {
        setFees((prev) =>
          prev.map((fee) => (fee.id === id ? data.data : fee))
        );
        return data.data;
      }
      setError(data.error || 'Error al actualizar cuota');
      return null;
    } catch {
      setError('Error al conectar con el servidor');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFee = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fees/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setFees((prev) => prev.filter((fee) => fee.id !== id));
        return true;
      }
      setError(data.error || 'Error al eliminar cuota');
      return false;
    } catch {
      setError('Error al conectar con el servidor');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fees, loading, error, fetchFees, createFee, updateFee, deleteFee };
};
