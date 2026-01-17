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
  const isAdmin = !!session?.user?.isAdmin;
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
  
    
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center gap-3 group mb-2 w-fit">
            <span className="text-foreground-muted group-hover:text-white transition">← Volver</span>
          </Link>
          <h1 className="text-3xl font-display text-white">
            GESTIÓN DE PARTIDOS
          </h1>
          <p className="text-foreground-muted text-sm mt-1">Registra y administra los encuentros</p>
        </div>
        
        {isAdmin && !showForm && (
          <button
            onClick={() => {
              setEditingMatch(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            <span>+ Nuevo Partido</span>
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
        {!showForm && (
          <MatchList
            matches={matches}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  
  );
}
