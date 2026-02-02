'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  options: string[];
}

export default function CrearVotacion() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    options: ['', ''],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to API
    console.log('Votación a crear:', formData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Plus className="w-8 h-8 text-primary" />
          <h1 className="text-4xl text-white font-display uppercase">Crear Votación</h1>
        </div>
        <p className="text-foreground-muted">Crea una nueva votación general para el equipo</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="dashboard-card">
          <label className="block text-sm font-medium text-white mb-2 uppercase tracking-wider">
            Título de la Votación
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ej: ¿Mejor uniforme para la próxima temporada?"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground-muted/50 focus:border-primary focus:bg-white/10 transition-all outline-none"
            required
          />
        </div>

        {/* Description */}
        <div className="dashboard-card">
          <label className="block text-sm font-medium text-white mb-2 uppercase tracking-wider">
            Descripción (Opcional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Añade detalles sobre la votación..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground-muted/50 focus:border-primary focus:bg-white/10 transition-all outline-none resize-none"
          />
        </div>

        {/* Options */}
        <div className="dashboard-card space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white uppercase tracking-wider">
              Opciones de Voto
            </label>
            <span className="text-xs text-foreground-muted">Mínimo 2</span>
          </div>

          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opción ${index + 1}`}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground-muted/50 focus:border-primary focus:bg-white/10 transition-all outline-none text-sm"
                  required
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOption}
            className="w-full px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar Opción
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-primary to-accent text-white font-medium hover:opacity-90 transition-opacity uppercase tracking-wider"
          >
            Crear Votación
          </button>
        </div>
      </form>
    </div>
  );
}
