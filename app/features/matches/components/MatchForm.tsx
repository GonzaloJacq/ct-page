'use client';

import { useState } from 'react';
import { Match, CreateMatchInput } from '../types';

interface MatchFormProps {
  onSubmit: (data: CreateMatchInput) => Promise<void>;
  initialData?: Match | null;
  isLoading?: boolean;
  onCancel?: () => void;
  availablePlayers: Array<{ id: string; name: string }>;
}

export default function MatchForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
  availablePlayers,
}: MatchFormProps) {
  const [formData, setFormData] = useState<CreateMatchInput>(
    initialData
      ? {
          date: initialData.date,
          opponent: initialData.opponent,
          playerIds: initialData.playerIds,
          result: initialData.result,
        }
      : { date: new Date(), opponent: '', playerIds: [], result: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'date' ? new Date(value) : value,
    }));
  };

  const handlePlayerToggle = (playerId: string) => {
    setFormData((prev) => ({
      ...prev,
      playerIds: prev.playerIds.includes(playerId)
        ? prev.playerIds.filter((id) => id !== playerId)
        : [...prev.playerIds, playerId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const dateValue = formData.date instanceof Date 
    ? formData.date.toISOString().split('T')[0]
    : formData.date;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-100 mb-1">
          Fecha *
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={dateValue}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="opponent" className="block text-sm font-medium text-gray-100 mb-1">
          Rival *
        </label>
        <input
          type="text"
          id="opponent"
          name="opponent"
          value={formData.opponent}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: FC Barcelona"
        />
      </div>

      <div>
        <label htmlFor="result" className="block text-sm font-medium text-gray-100 mb-1">
          Resultado
        </label>
        <input
          type="text"
          id="result"
          name="result"
          value={formData.result || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 3-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-100 mb-3">
          Jugadores participantes *
        </label>
        <div className="bg-gray-700 border border-gray-600 rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
          {availablePlayers.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay jugadores disponibles</p>
          ) : (
            availablePlayers.map((player) => (
              <label key={player.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.playerIds.includes(player.id)}
                  onChange={() => handlePlayerToggle(player.id)}
                  className="w-4 h-4 bg-gray-600 border-gray-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-100 text-sm">{player.name}</span>
              </label>
            ))
          )}
        </div>
        {formData.playerIds.length === 0 && (
          <p className="text-red-400 text-sm mt-1">Selecciona al menos un jugador</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || formData.playerIds.length === 0}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 transition"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
