'use client';

import { useState } from 'react';
import { Estadistica } from '../types';

interface EstadisticaListProps {
  readonly estadisticas: Estadistica[];
  readonly isLoading?: boolean;
}

type FilterType = 'goals' | 'yellow' | 'red' | 'mvp' | 'none';

export default function EstadisticaList({ estadisticas, isLoading = false }: EstadisticaListProps) {
  const [filter, setFilter] = useState<FilterType>('none');
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  const getSortedEstadisticas = () => {
    let sorted = [...estadisticas];
    if (filter === 'goals') {
      sorted.sort((a, b) => b.totalGoals - a.totalGoals);
    } else if (filter === 'yellow') {
      sorted.sort((a, b) => b.totalYellowCards - a.totalYellowCards);
    } else if (filter === 'red') {
      sorted.sort((a, b) => b.totalRedCards - a.totalRedCards);
    } else if (filter === 'mvp') {
      sorted.sort((a, b) => b.totalMVPs - a.totalMVPs);
    } else {
      sorted.sort(
        (a, b) =>
          b.totalMVPs - a.totalMVPs ||
          b.totalGoals - a.totalGoals ||
          b.totalYellowCards - a.totalYellowCards ||
          b.totalRedCards - a.totalRedCards,
      );
    }
    return sorted;
  };

  const sortedEstadisticas = getSortedEstadisticas();

  if (sortedEstadisticas.length === 0) {
    return (
      <div className="text-center py-8 bg-surface rounded-lg border border-white/5">
        <p className="text-foreground-muted">No hay estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('none')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === 'none'
              ? 'bg-primary text-white'
              : 'bg-white/10 text-gray-200 hover:bg-white/20'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('goals')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === 'goals'
              ? 'bg-primary text-white'
              : 'bg-white/10 text-gray-200 hover:bg-white/20'
          }`}
        >
          Por Goles
        </button>
        <button
          onClick={() => setFilter('yellow')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === 'yellow'
              ? 'bg-primary text-white'
              : 'bg-white/10 text-gray-200 hover:bg-white/20'
          }`}
        >
          Por Amarillas
        </button>
        <button
          onClick={() => setFilter('red')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === 'red'
              ? 'bg-primary text-white'
              : 'bg-white/10 text-gray-200 hover:bg-white/20'
          }`}
        >
          Por Rojas
        </button>
        <button
          onClick={() => setFilter('mvp')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === 'mvp'
              ? 'bg-primary text-white'
              : 'bg-white/10 text-gray-200 hover:bg-white/20'
          }`}
        >
          Por MVP
        </button>
      </div>
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
            <th className="px-4 py-3 text-center text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Amarillas
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Partidos
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              MVPs
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white font-display border-b border-white/10 uppercase tracking-wider">
              Rojas
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEstadisticas.map((estadistica, index) => (
            <tr  key={estadistica.playerId} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="px-4 py-3 text-sm text-foreground-muted font-semibold">
                #{index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">{estadistica.playerName}</td>
              <td className="px-4 py-3 text-center text-sm font-bold text-primary">
                {estadistica.totalGoals}
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-yellow-500">
                {estadistica.totalYellowCards}
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-foreground-muted">
                {estadistica.totalMatches}
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-accent">
                {estadistica.totalMVPs}
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-red-500">
                {estadistica.totalRedCards}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
