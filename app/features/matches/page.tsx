'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMatches } from './hooks/useMatches';
import { usePlayer } from '@/app/features/players/hooks/usePlayer';
import { MatchForm, MatchList } from './components';
import { Match, CreateMatchInput } from './types';


export default function MatchesPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const {
    matches,
    loading,
    error,
    fetchMatches,
    createMatch,
    updateMatch,
    deleteMatch,
  } = useMatches();

  const { players, fetchPlayers } = usePlayer();

  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
    fetchPlayers();
  }, [fetchMatches, fetchPlayers]);

  const handleSubmit = async (data: CreateMatchInput) => {
    setFormLoading(true);
    try {
      if (editingMatch) {
        await updateMatch(editingMatch.id, data);
      } else {
        await createMatch(data);
      }
      setShowForm(false);
      setEditingMatch(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMatch(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este partido?')) {
      await deleteMatch(id);
    }
  };

  return (
  
    
      <div className="min-h-screen bg-gray-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl text-gray-400 group-hover:text-gray-200 transition">←</span>
              <h1 className="text-4xl font-bold text-gray-100">Gestión de Partidos</h1>
            </Link>
            {isAuthenticated && !showForm && (
              <button
                onClick={() => {
                  setEditingMatch(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                + Nuevo Partido
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
                {editingMatch ? 'Editar Partido' : 'Nuevo Partido'}
              </h2>
              <MatchForm
                onSubmit={handleSubmit}
                initialData={editingMatch}
                isLoading={formLoading}
                onCancel={handleCancel}
                availablePlayers={players}
              />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Partidos</h2>
            <MatchList
              matches={matches}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loading && !showForm}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>
  
  );
}
