"use client";

import { Player } from "../../players/types";
import { Formation } from "../types";

interface FormationsListProps {
  formations: Formation[];
  players: Player[];
  loading: boolean;
  isAuthenticated: boolean;
  onEdit: (formation: Formation) => void;
  onDelete: (id: string) => void;
}

export function FormationsList({
  formations,
  players,
  loading,
  isAuthenticated,
  onEdit,
  onDelete,
}: FormationsListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Cargando formaciones...</p>
      </div>
    );
  }

  if (formations.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-lg border border-white/5">
        <p className="text-foreground-muted text-lg mb-2">No hay formaciones guardadas</p>
        <p className="text-foreground-muted/60">Crea tu primera formación arrastrando jugadores a la cancha</p>
      </div>
    );
  }

  const getPlayerById = (id: string) => players.find((p) => p.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formations.map((formation) => {
        const playersData = formation.formationData?.players || {};
        const playersCount = Object.keys(playersData).length;
        const hasDrawings = (formation.formationData?.drawings?.length || 0) > 0;

        return (
          <div
            key={formation.id}
            className="bg-surface rounded-lg overflow-hidden border border-white/5 hover:border-primary/50 transition duration-300"
          >
            {/* Preview de la cancha */}
            <div className="relative w-full aspect-[2/3] bg-green-700">
              <div className="absolute inset-0">
                {/* Líneas básicas */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30 -translate-y-1/2" />
                <div className="absolute inset-2 border border-white/30 rounded" />
              </div>

              {/* Jugadores en miniatura */}
              {Object.entries(playersData).map(([playerId, pos]) => {
                const player = getPlayerById(playerId);
                if (!player) return null;

                return (
                  <div
                    key={playerId}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-white shadow-md">
                      {player.shirtNumber}
                    </div>
                  </div>
                );
              })}

              {/* Indicator for drawings */}
              {hasDrawings && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                  ✏️ Con dibujos
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-wide">
                {formation.name}
              </h3>
              <p className="text-foreground-muted text-sm mb-4">
                {playersCount} jugador{playersCount !== 1 ? "es" : ""}
                {hasDrawings && " • Incluye anotaciones"}
              </p>

              {isAuthenticated && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(formation)}
                    className="flex-1 px-3 py-2 btn-primary text-sm cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(formation.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}