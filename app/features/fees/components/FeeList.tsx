'use client';

import { Fee } from '../types';

interface FeeListProps {
  fees: Fee[];
  onEdit: (fee: Fee) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export default function FeeList({
  fees,
  onEdit,
  onDelete,
  isLoading = false,
  isAuthenticated = false,
}: FeeListProps) {
  if (fees.length === 0) {
    return (
      <div className="text-center py-8 bg-surface rounded-lg shadow border border-white/5">
        <p className="text-foreground-muted">No hay cuotas registradas</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface rounded-lg shadow border border-white/5">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-surface">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Jugador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Mes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Estado
            </th>
            {isAuthenticated && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {fees.map((fee) => (
            <tr key={fee.id} className="hover:bg-gray-700 transition">
              <td className="px-6 py-4 text-sm font-medium text-gray-100">
                {fee.playerName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {fee.month}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                €{fee.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    fee.paid
                      ? 'bg-green-900 text-green-200'
                      : 'bg-yellow-900 text-yellow-200'
                  }`}
                >
                  {fee.paid ? 'Pagado' : 'Pendiente'}
                </span>
              </td>
              {isAuthenticated && (
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(fee)}
                    disabled={isLoading}
                    className="cursor-pointer text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(fee.id)}
                    disabled={isLoading}
                    className="cursor-pointer text-red-400 hover:text-red-300 disabled:text-gray-600 transition"
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
