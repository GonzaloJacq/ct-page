'use client';

import { Calendar, MapPin, Users } from 'lucide-react';
import type { Match } from '@prisma/client';

interface NextMatchSectionProps {
  nextMatch?: Match | null;
}

export default function NextMatchSection({ nextMatch }: NextMatchSectionProps) {
  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-display text-white uppercase tracking-wider">
          Próximo Partido
        </h2>
      </div>

      {nextMatch ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground-muted font-sans text-sm uppercase tracking-wider mb-1">
                Rival
              </p>
              <p className="text-2xl font-display font-bold text-white uppercase">
                {nextMatch.opponent || 'Por definir'}
              </p>
            </div>
            <span className="text-4xl font-display text-primary">VS</span>
            <div className="text-right">
              <p className="text-foreground-muted font-sans text-sm uppercase tracking-wider mb-1">
                CLAN TEAM
              </p>
              <p className="text-2xl font-display font-bold text-white">FC</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/10" />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-foreground-muted">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-sans">
                {new Date(nextMatch.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-foreground-muted">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-sans">Hora: {new Date(nextMatch.date).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>
            {nextMatch.playerIds && nextMatch.playerIds.length > 0 && (
              <div className="flex items-center gap-3 text-foreground-muted">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-sans">
                  {nextMatch.playerIds.length} jugadores convocados
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-foreground-muted">
          <p className="text-sm font-sans">No hay partidos programados</p>
        </div>
      )}
    </div>
  );
}
