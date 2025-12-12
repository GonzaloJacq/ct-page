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
      <div className="text-center py-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No hay registros de goles</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Posición
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Jugador
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-100 border-b border-gray-700">
              Goles
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Rival
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 border-b border-gray-700">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedScorers.map((scorer, index) => (
            <tr  key={scorer.id ?? `${scorer.playerId}-${index}`} className="border-b border-gray-700 hover:bg-gray-750 transition">
              <td className="px-4 py-3 text-sm text-gray-100 font-semibold">
                #{index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">{scorer.playerName}</td>
              <td className="px-4 py-3 text-center text-sm font-bold text-blue-400">
                {scorer.goalsCount}
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">{scorer.opponent}</td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {new Date(scorer.matchDate).toLocaleDateString('es-ES')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
