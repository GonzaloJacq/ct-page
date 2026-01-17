"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePlayer } from "./hooks/usePlayer";
import { PlayerForm, PlayerList } from "./components";
import { Player, CreatePlayerInput } from "./types";

export default function PlayersPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const {
    players,
    loading,
    error,
    fetchPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
  } = usePlayer();

  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleSubmit = async (data: CreatePlayerInput) => {
    setFormLoading(true);
    try {
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, data);
      } else {
        await createPlayer(data);
      }
      setShowForm(false);
      setEditingPlayer(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este jugador?")) {
      await deletePlayer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-white">
            GESTIÓN DE JUGADORES
          </h1>
          <p className="text-slate-400 text-sm mt-1">Administra la plantilla del equipo</p>
        </div>
        
        {isAuthenticated && !showForm && (
          <button
            onClick={() => {
              setEditingPlayer(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            <span>+ Nuevo Jugador</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="dashboard-card mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}
          </h2>
          <PlayerForm
            onSubmit={handleSubmit}
            initialData={editingPlayer}
            isLoading={formLoading}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div>
        {!showForm && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-slate-400 mt-4">Cargando...</p>
              </div>
            ) : (
              <PlayerList
                players={players}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={loading}
                isAuthenticated={isAuthenticated}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
