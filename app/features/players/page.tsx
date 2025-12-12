'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePlayer } from './hooks/usePlayer';
import { PlayerForm, PlayerList } from './components';
import { Player, CreatePlayerInput } from './types';

export default function PlayersPage() {
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
    if (confirm('¿Estás seguro de que deseas eliminar este jugador?')) {
      await deletePlayer(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl text-gray-400 group-hover:text-gray-200 transition">←</span>
            <h1 className="text-4xl font-bold text-gray-100">Gestión de Jugadores</h1>
          </Link>
          {!showForm && (
            <button
              onClick={() => {
                setEditingPlayer(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              + Nuevo Jugador
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-100 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              {editingPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}
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
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Jugadores</h2>
          {loading && !showForm ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Cargando...</p>
            </div>
          ) : (
            <PlayerList
              players={players}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
