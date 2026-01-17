'use client';

import { useState } from 'react';
import { Fee, CreateFeeInput } from '../types';

interface FeeFormProps {
  onSubmit: (data: CreateFeeInput) => Promise<void>;
  initialData?: Fee | null;
  isLoading?: boolean;
  onCancel?: () => void;
  players: Array<{ id: string; name: string }>;
}

export default function FeeForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
  players,
}: FeeFormProps) {
  const [formData, setFormData] = useState<CreateFeeInput>(
    initialData
      ? {
          playerId: initialData.playerId,
          month: initialData.month,
          amount: initialData.amount,
        }
      : { playerId: '', month: '', amount: 0 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg border border-white/5">
      <div>
        <label htmlFor="playerId" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
          Jugador *
        </label>
        <select
          id="playerId"
          name="playerId"
          value={formData.playerId}
          onChange={handleChange}
          required
          className="input-field"
        >
          <option value="">Selecciona un jugador</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Mes *
          </label>
          <input
            type="month"
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Monto €*
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="input-field"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-primary"
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
