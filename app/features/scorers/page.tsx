'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScorers } from './hooks/useScorers';
import { useMatches } from '@/app/features/matches/hooks/useMatches';
import { usePlayer } from '@/app/features/players/hooks/usePlayer';
import { ScorerList } from './components';
import { CreateScorerInput } from './types';

export default function ScorersPage() {
  const { scorers, loading, error, fetchScorers, createScorer } = useScorers();
  const { matches, fetchMatches } = useMatches();
  const { players, fetchPlayers } = usePlayer();

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [goalsCount, setGoalsCount] = useState<number>(1);

  useEffect(() => {
    fetchScorers();
    fetchMatches();
    fetchPlayers();
  }, [fetchScorers, fetchMatches, fetchPlayers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !selectedPlayer) return;

    setFormLoading(true);
    try {
      const match = matches.find((m) => m.id === selectedMatch);
      const player = players.find((p) => p.id === selectedPlayer);

      if (!match || !player) return;

      const data: CreateScorerInput = {
        matchId: match.id,
        playerId: player.id,
        playerName: player.name,
        goalsCount,
        matchDate: match.date,
        opponent: match.opponent,
      };

      await createScorer(data);
      setShowForm(false);
      setSelectedMatch('');
      setSelectedPlayer('');
      setGoalsCount(1);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl text-gray-400 group-hover:text-gray-200 transition">←</span>
            <h1 className="text-4xl font-bold text-gray-100">Top Goleadores</h1>
          </Link>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              + Registrar Gol
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-100 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Registrar Gol</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="match" className="block text-sm font-medium text-gray-100 mb-1">
                  Partido *
                </label>
                <select
                  id="match"
                  value={selectedMatch}
                  onChange={(e) => setSelectedMatch(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un partido</option>
                  {matches.map((match) => (
                    <option key={match.id} value={match.id}>
                      {new Date(match.date).toLocaleDateString('es-ES')} - {match.opponent}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="player" className="block text-sm font-medium text-gray-100 mb-1">
                  Jugador *
                </label>
                <select
                  id="player"
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un jugador</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} (#{player.shirtNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-gray-100 mb-1">
                  Número de goles *
                </label>
                <input
                  type="number"
                  id="goals"
                  value={goalsCount}
                  onChange={(e) => setGoalsCount(parseInt(e.target.value) || 1)}
                  required
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading || !selectedMatch || !selectedPlayer}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 transition"
                >
                  {formLoading ? 'Registrando...' : 'Registrar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedMatch('');
                    setSelectedPlayer('');
                    setGoalsCount(1);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Goleadores</h2>
          <ScorerList scorers={scorers} isLoading={loading && !showForm} />
        </div>
      </div>
    </div>
  );
}
