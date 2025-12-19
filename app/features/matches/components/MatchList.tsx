'use client';

import { Match } from '../types';

interface MatchListProps {
  readonly matches: Match[];
  readonly onEdit: (match: Match) => void;
  readonly onDelete: (id: string) => void;
  readonly isLoading?: boolean;
  readonly isAuthenticated?: boolean;
}

export default function MatchList({
  matches,
  onEdit,
  onDelete,
  isLoading = false,
  isAuthenticated = false,
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
      <div className="text-center py-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No hay partidos registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Rival
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Jugadores
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Resultado
            </th>
            {isAuthenticated && (
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-100 border-b border-gray-700">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
              <td className="px-4 py-3 text-sm text-gray-100">
                {new Date(match.date).toLocaleDateString('es-ES')}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">{match.opponent}</td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {match.playerIds.length} {match.playerIds.length === 1 ? 'jugador' : 'jugadores'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {match.result || '-'}
              </td>
              {isAuthenticated && (
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(match)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(match.id)}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
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
