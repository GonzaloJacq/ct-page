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
      <div className="text-center py-8 bg-gray-800 rounded-lg shadow">
        <p className="text-gray-400">No hay jugadores registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Edad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Camiseta
            </th>
            {isAuthenticated && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {players.map((player) => (
            <tr key={player.id} className="hover:bg-gray-700 transition">
              <td className="px-6 py-4 text-sm font-medium text-gray-100">
                {player.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {player.age}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {player.phone}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                #{player.shirtNumber}
              </td>
              {isAuthenticated && (
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(player)}
                    disabled={isLoading}
                    className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition"
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
