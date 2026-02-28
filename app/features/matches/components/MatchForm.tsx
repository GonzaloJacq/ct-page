'use client';

import { useState } from 'react';
import { Match, CreateMatchInput } from '../types';
import CustomSelect from '@/app/components/CustomSelect';

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
          // ensure date is a Date object (API returns ISO string)
          date: typeof initialData.date === 'string' ? new Date(initialData.date) : initialData.date,
          opponent: initialData.opponent,
          location: initialData.location ?? null,
          time: initialData.time ?? null,
          playerIds: initialData.playerIds,
          galleryFolderId: initialData.galleryFolderId ?? null,
          resultNosotros: initialData.resultNosotros,
          resultEllos: initialData.resultEllos,
          ourScorerIds: initialData.ourScorerIds ?? [],
          yellowCardPlayerIds: initialData.yellowCardPlayerIds ?? [],
          redCardPlayerIds: initialData.redCardPlayerIds ?? [],
        }
      : {
          date: new Date(),
          opponent: '',
          location: null,
          time: null,
          playerIds: [],
          galleryFolderId: null,
          resultNosotros: null,
          resultEllos: null,
          ourScorerIds: [],
          yellowCardPlayerIds: [],
          redCardPlayerIds: [],
        }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsed: any = value;
    if (name === 'date') {
      parsed = new Date(value);
    } else if (name === 'galleryFolderId') {
      // if user pastes full Drive URL, extract folder ID
      const match = value.match(/[-\w]{25,}(?=[^\w]|$)/);
      if (match) parsed = match[0];
    } else if (name === 'resultNosotros' || name === 'resultEllos' || name === 'yellowCards' || name === 'redCards') {
      parsed = value === '' ? null : parseInt(value, 10);
    }

    setFormData((prev) => {
      const next: any = { ...prev, [name]: parsed };

      if (name === 'resultNosotros') {
        // adjust ourScorerIds length to match new # of goals
        const count = parsed ?? 0;
        const existing = prev.ourScorerIds ? [...prev.ourScorerIds] : [];
        const trimmed = existing.slice(0, count);
        while (trimmed.length < count) trimmed.push('');
        next.ourScorerIds = trimmed;
      }
      if (name === 'galleryFolderId') {
        // nothing special
      }
      if (name === 'yellowCards') {
        const count = parsed ?? 0;
        const existing = prev.yellowCardPlayerIds ? [...prev.yellowCardPlayerIds] : [];
        const trimmed = existing.slice(0, count);
        while (trimmed.length < count) trimmed.push('');
        next.yellowCardPlayerIds = trimmed;
      }
      if (name === 'redCards') {
        const count = parsed ?? 0;
        const existing = prev.redCardPlayerIds ? [...prev.redCardPlayerIds] : [];
        const trimmed = existing.slice(0, count);
        while (trimmed.length < count) trimmed.push('');
        next.redCardPlayerIds = trimmed;
      }

      if (name === 'playerIds') {
        // handled separately by handlePlayerToggle
      }

      return next;
    });
  };

  const handlePlayerToggle = (playerId: string) => {
    setFormData((prev) => {
      const newPlayerIds = prev.playerIds.includes(playerId)
        ? prev.playerIds.filter((id) => id !== playerId)
        : [...prev.playerIds, playerId];
      // drop any scorer ids or card ids that are no longer part of the roster
      const ourScorers = (prev.ourScorerIds || []).filter((id) => newPlayerIds.includes(id));
      const yellows = (prev.yellowCardPlayerIds || []).filter((id) => newPlayerIds.includes(id));
      const reds = (prev.redCardPlayerIds || []).filter((id) => newPlayerIds.includes(id));
      return {
        ...prev,
        playerIds: newPlayerIds,
        ourScorerIds: ourScorers,
        yellowCardPlayerIds: yellows,
        redCardPlayerIds: reds,
      };
    });
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Cancha
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location ?? ''}
            onChange={handleChange}
            className="input-field"
            placeholder="Ej: Estadio Central"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Horario
          </label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time ?? ''}
            onChange={handleChange}
            className="input-field"
            placeholder="Ej: 19:30"
          />
        </div>
        <div>
          <label htmlFor="galleryFolderId" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            ID carpeta de fotos (Drive)
          </label>
          <input
            type="text"
            id="galleryFolderId"
            name="galleryFolderId"
            value={formData.galleryFolderId ?? ''}
            onChange={handleChange}
            className="input-field"
            placeholder="1a2B3c..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="resultNosotros" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Goles Nosotros
          </label>
          <input
            type="number"
            min="0"
            id="resultNosotros"
            name="resultNosotros"
            value={formData.resultNosotros ?? ''}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="resultEllos" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Goles Ellos
          </label>
          <input
            type="number"
            min="0"
            id="resultEllos"
            name="resultEllos"
            value={formData.resultEllos ?? ''}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>
      {formData.resultNosotros && formData.resultNosotros > 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">
            Goleadores (nosotros)
          </p>
          {Array.from({ length: formData.resultNosotros }, (_, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <label className="text-sm text-foreground-muted">Gol {idx + 1}</label>
              <CustomSelect
                value={formData.ourScorerIds?.[idx] ?? ''}
                onChange={(val) => {
                  setFormData((prev) => {
                    const arr = prev.ourScorerIds ? [...prev.ourScorerIds] : [];
                    arr[idx] = val;
                    return { ...prev, ourScorerIds: arr };
                  });
                }}
                options={[
                  { value: '', label: '--' },
                  ...availablePlayers
                    .filter((p) => formData.playerIds.includes(p.id))
                    .map((p) => ({ value: p.id, label: p.name })),
                ]}
                className="flex-1"
              />
            </div>
          ))}
          {formData.ourScorerIds &&
            (formData.ourScorerIds.length !== formData.resultNosotros ||
              formData.ourScorerIds.some((id) => !id)) && (
              <p className="text-error text-sm">Selecciona un goleador válido para cada gol</p>
            )}
        </div>
      )}
      {/* card counts */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="yellowCards" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Amarillas
          </label>
          <input
            type="number"
            min="0"
            id="yellowCards"
            name="yellowCards"
            value={formData.yellowCardPlayerIds ? formData.yellowCardPlayerIds.length : ''}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="redCards" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Rojas
          </label>
          <input
            type="number"
            min="0"
            id="redCards"
            name="redCards"
            value={formData.redCardPlayerIds ? formData.redCardPlayerIds.length : ''}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>
      {formData.yellowCardPlayerIds && formData.yellowCardPlayerIds.length > 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">
            Jugadores amonestados
          </p>
          {formData.yellowCardPlayerIds.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <label className="text-sm text-foreground-muted">A.{idx + 1}</label>
              <CustomSelect
                value={formData.yellowCardPlayerIds?.[idx] ?? ''}
                onChange={(val) => {
                  setFormData((prev) => {
                    const arr = prev.yellowCardPlayerIds ? [...prev.yellowCardPlayerIds] : [];
                    arr[idx] = val;
                    return { ...prev, yellowCardPlayerIds: arr };
                  });
                }}
                options={[
                  { value: '', label: '--' },
                  ...availablePlayers
                    .filter((p) => formData.playerIds.includes(p.id))
                    .map((p) => ({ value: p.id, label: p.name })),
                ]}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      )}
      {formData.redCardPlayerIds && formData.redCardPlayerIds.length > 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">
            Jugadores expulsados
          </p>
          {formData.redCardPlayerIds.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <label className="text-sm text-foreground-muted">R.{idx + 1}</label>
              <CustomSelect
                value={formData.redCardPlayerIds?.[idx] ?? ''}
                onChange={(val) => {
                  setFormData((prev) => {
                    const arr = prev.redCardPlayerIds ? [...prev.redCardPlayerIds] : [];
                    arr[idx] = val;
                    return { ...prev, redCardPlayerIds: arr };
                  });
                }}
                options={[
                  { value: '', label: '--' },
                  ...availablePlayers
                    .filter((p) => formData.playerIds.includes(p.id))
                    .map((p) => ({ value: p.id, label: p.name })),
                ]}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-3 font-display uppercase tracking-wider">
          Jugadores convocados *
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
          disabled={
            isLoading ||
            formData.playerIds.length === 0 ||
            (formData.resultNosotros &&
              (!formData.ourScorerIds ||
                formData.ourScorerIds.length !== formData.resultNosotros ||
                formData.ourScorerIds.some((id) => !id))) ||
            (formData.yellowCardPlayerIds && formData.yellowCardPlayerIds.some((id) => !id)) ||
            (formData.redCardPlayerIds && formData.redCardPlayerIds.some((id) => !id))
          }
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
