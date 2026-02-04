'use client';

import { Trophy } from 'lucide-react';
import type { Player } from '@prisma/client';

interface MVPSectionProps {
  mvpPlayer?: Player | null;
}

export default function MVPSection({ mvpPlayer }: MVPSectionProps) {
  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-display text-white uppercase tracking-wider">
          MVP de la Semana
        </h2>
      </div>

      {mvpPlayer ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary/50 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-display font-bold text-white">
              {mvpPlayer.number}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-foreground-muted font-sans text-sm uppercase tracking-wider mb-1">
              Jugador Destacado
            </p>
            <p className="text-3xl font-display font-bold text-white uppercase">
              {mvpPlayer.name}
            </p>
            <p className="text-foreground-muted font-sans text-sm mt-2">
              {mvpPlayer.position}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-foreground-muted">
          <p className="text-sm font-sans">No hay MVP definido para esta semana</p>
        </div>
      )}
    </div>
  );
}
