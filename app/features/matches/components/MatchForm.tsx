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
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg border border-white/5">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
          Fecha *
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={dateValue}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="opponent" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
          Rival *
        </label>
        <input
          type="text"
          id="opponent"
          name="opponent"
          value={formData.opponent}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Ej: FC Barcelona"
        />
      </div>

      <div>
        <label htmlFor="result" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
          Resultado
        </label>
        <input
          type="text"
          id="result"
          name="result"
          value={formData.result || ''}
          onChange={handleChange}
          className="input-field"
          placeholder="Ej: 3-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-3 font-display uppercase tracking-wider">
          Jugadores participantes *
        </label>
        <div className="bg-background/50 border border-white/10 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
          {availablePlayers.length === 0 ? (
            <p className="text-foreground-muted text-sm">No hay jugadores disponibles</p>
          ) : (
            availablePlayers.map((player) => (
              <label key={player.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.playerIds.includes(player.id)}
                  onChange={() => handlePlayerToggle(player.id)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-primary focus:ring-primary transition"
                />
                <span className="ml-2 text-foreground-muted group-hover:text-white transition text-sm">{player.name}</span>
              </label>
            ))
          )}
        </div>
        {formData.playerIds.length === 0 && (
          <p className="text-error text-sm mt-1">Selecciona al menos un jugador</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || formData.playerIds.length === 0}
          className="flex-1 btn-primary"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
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
