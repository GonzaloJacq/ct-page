"use client";

import { useState } from "react";
import { Match } from "../types";
import React, { Fragment } from "react";

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
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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
            <React.Fragment key={match.id}>
              <tr
                className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                onClick={() => toggle(match.id)}
              >
                <td className="px-4 py-3 text-sm text-foreground-muted">
                  {new Date(match.date).toLocaleDateString("es-ES")}
                </td>
                <td className="px-4 py-3 text-sm text-foreground font-medium">
                  {match.opponent}
                </td>
                <td className="px-4 py-3 text-sm text-foreground-muted">
                  {match.playerIds.length}{" "}
                  {match.playerIds.length === 1 ? "jugador" : "jugadores"}
                </td>
                <td className="px-4 py-3 text-sm text-foreground-muted">
                  {typeof match.resultNosotros === "number" &&
                  typeof match.resultEllos === "number"
                    ? `${match.resultNosotros} - ${match.resultEllos}`
                    : "-"}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(match);
                      }}
                      className="cursor-pointer px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 transition mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(match.id);
                      }}
                      className="cursor-pointer px-3 py-1 text-xs bg-red-600/20 text-red-500 border border-red-600/50 rounded hover:bg-red-600/30 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
              {expanded.includes(match.id) && (
                <tr className="bg-surface/20">
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="px-4 py-3 text-sm text-foreground-muted"
                  >
                    <div className="space-y-2">
                      {match.location && <div>Cancha: {match.location}</div>}
                      {match.time && <div>Horario: {match.time}</div>}
                      {match.yellowCardPlayerIds &&
                        match.yellowCardPlayerIds.length > 0 && (
                          <div>
                            Amarillas: {match.yellowCardPlayerIds.length}
                          </div>
                        )}
                      {match.redCardPlayerIds &&
                        match.redCardPlayerIds.length > 0 && (
                          <div>Rojas: {match.redCardPlayerIds.length}</div>
                        )}
                      {match.playerIds && match.playerIds.length > 0 && (
                        <div>Convocados: {match.playerIds.length}</div>
                      )}
                      {match.galleryFolderId && (
                        <div>
                          <a
                            href={`https://drive.google.com/drive/folders/${match.galleryFolderId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-primary"
                          >
                            Ver galería
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
