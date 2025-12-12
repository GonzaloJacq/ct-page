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
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow">
      <div>
        <label htmlFor="playerId" className="block text-sm font-medium text-gray-100 mb-1">
          Jugador *
        </label>
        <select
          id="playerId"
          name="playerId"
          value={formData.playerId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="month" className="block text-sm font-medium text-gray-100 mb-1">
            Mes *
          </label>
          <input
            type="month"
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-100 mb-1">
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 transition"
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
