'use client';

import { Vote } from 'lucide-react';

export default function VotacionesGenerales() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Vote className="w-8 h-8 text-primary" />
          <h1 className="text-4xl text-white font-display uppercase">Votaciones Generales</h1>
        </div>
        <p className="text-foreground-muted">Participa en las votaciones del equipo</p>
      </div>

      {/* Empty State */}
      <div className="dashboard-card text-center py-16">
        <Vote className="w-16 h-16 text-foreground-muted/30 mx-auto mb-4" />
        <p className="text-foreground-muted text-lg mb-2">No hay votaciones activas</p>
        <p className="text-sm text-foreground-muted/70">Las votaciones generales aparecerán aquí</p>
      </div>
    </div>
  );
}
