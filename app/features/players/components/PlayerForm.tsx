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
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Juan García"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-100 mb-1">
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="shirtNumber" className="block text-sm font-medium text-gray-100 mb-1">
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-1">
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+34 123 456 789"
        />
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
