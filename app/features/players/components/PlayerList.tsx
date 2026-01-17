'use client';

import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export default function PlayerList({
  players,
  onEdit,
  onDelete,
  isLoading = false,
  isAuthenticated = false,
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-8 bg-surface rounded-lg shadow border border-white/5">
        <p className="text-foreground-muted">No hay jugadores registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface rounded-lg shadow border border-white/5">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-surface">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
              Edad
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
              Camiseta
            </th>
            {isAuthenticated && (
              <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {players.map((player) => (
            <tr key={player.id} className="hover:bg-white/5 transition">
              <td className="px-6 py-4 text-sm font-medium text-foreground">
                {player.name}
              </td>
              <td className="px-6 py-4 text-sm text-foreground-muted">
                {player.age}
              </td>
              <td className="px-6 py-4 text-sm text-foreground-muted">
                {player.phone}
              </td>
              <td className="px-6 py-4 text-sm text-foreground-muted font-mono">
                #{player.shirtNumber}
              </td>
              {isAuthenticated && (
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(player)}
                    disabled={isLoading}
                    className="text-primary hover:text-white disabled:text-gray-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(player.id)}
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300 disabled:text-gray-600 transition"
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
