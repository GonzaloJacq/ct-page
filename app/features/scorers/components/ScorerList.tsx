'use client';

import { Scorer } from '../types';

interface ScorerListProps {
  readonly scorers: Scorer[];
  readonly isLoading?: boolean;
}

export default function ScorerList({ scorers, isLoading = false }: ScorerListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  const sortedScorers = [...scorers].sort((a, b) => b.goalsCount - a.goalsCount);

  if (sortedScorers.length === 0) {
    return (
      <div className="text-center py-8 bg-surface rounded-lg border border-white/5">
        <p className="text-foreground-muted">No hay registros de goles</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface border-b border-white/5">
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Posición
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Jugador
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Goles
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Rival
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedScorers.map((scorer, index) => (
            <tr  key={scorer.id ?? `${scorer.playerId}-${index}`} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="px-4 py-3 text-sm text-foreground-muted font-semibold">
                #{index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">{scorer.playerName}</td>
              <td className="px-4 py-3 text-center text-sm font-bold text-primary">
                {scorer.goalsCount}
              </td>
              <td className="px-4 py-3 text-sm text-foreground-muted">{scorer.opponent}</td>
              <td className="px-4 py-3 text-sm text-foreground-muted">
                {new Date(scorer.matchDate).toLocaleDateString('es-ES')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
