'use client';

import { Match } from '../types';

interface MatchListProps {
  readonly matches: Match[];
  readonly onEdit: (match: Match) => void;
  readonly onDelete: (id: string) => void;
  readonly isLoading?: boolean;
  readonly isAdmin?: boolean;
}

export default function MatchList({
  matches,
  onEdit,
  onDelete,
  isLoading = false,
  isAdmin = false,
}: MatchListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 bg-surface rounded-lg border border-white/5">
        <p className="text-foreground-muted">No hay partidos registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface border-b border-white/5">
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Rival
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Jugadores
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Resultado
            </th>
            {isAdmin && (
              <th className="px-4 py-3 text-center text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="px-4 py-3 text-sm text-foreground-muted">
                {new Date(match.date).toLocaleDateString('es-ES')}
              </td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">{match.opponent}</td>
              <td className="px-4 py-3 text-sm text-foreground-muted">
                {match.playerIds.length} {match.playerIds.length === 1 ? 'jugador' : 'jugadores'}
              </td>
              <td className="px-4 py-3 text-sm text-foreground-muted">
                {match.result || '-'}
              </td>
              {isAdmin && (
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(match)}
                    className="cursor-pointer px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 transition mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(match.id)}
                    className="cursor-pointer px-3 py-1 text-xs bg-red-600/20 text-red-500 border border-red-600/50 rounded hover:bg-red-600/30 transition"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
