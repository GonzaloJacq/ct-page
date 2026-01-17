'use client';

import { useState, useEffect } from 'react';
import { Player, CreatePlayerInput } from '../types';

interface PlayerFormProps {
  onSubmit: (data: CreatePlayerInput) => Promise<void>;
  initialData?: Player | null;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function PlayerForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: PlayerFormProps) {
  const [formData, setFormData] = useState<CreatePlayerInput>(
    initialData
      ? {
          name: initialData.name,
          age: initialData.age,
          phone: initialData.phone,
          shirtNumber: initialData.shirtNumber,
        }
      : { name: '', age: 0, phone: '', shirtNumber: 0 }
  );

  // Sync form data when initialData changes (e.g. switching between players)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        age: initialData.age,
        phone: initialData.phone,
        shirtNumber: initialData.shirtNumber,
      });
    } else {
      setFormData({ name: '', age: 0, phone: '', shirtNumber: 0 });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'shirtNumber' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg border border-white/5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Ej: Juan García"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            Edad *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="18"
            max="80"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="shirtNumber" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
            # Camiseta *
          </label>
          <input
            type="number"
            id="shirtNumber"
            name="shirtNumber"
            value={formData.shirtNumber}
            onChange={handleChange}
            required
            min="1"
            max="99"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider">
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="+34 123 456 789"
        />
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
