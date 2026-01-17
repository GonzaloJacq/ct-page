"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useScorers } from "./hooks/useScorers";
import { useMatches } from "@/app/features/matches/hooks/useMatches";
import { usePlayer } from "@/app/features/players/hooks/usePlayer";
import { ScorerList } from "./components";
import { CreateScorerInput } from "./types";


export default function ScorersPage() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.isAdmin;
  const { scorers, loading, error, fetchScorers, createScorer } = useScorers();
  const { matches, fetchMatches } = useMatches();
  const { players, fetchPlayers } = usePlayer();

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
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
      setSelectedMatch("");
      setSelectedPlayer("");
      setGoalsCount(1);
    } finally {
      setFormLoading(false);
    }
  };

  return (
 
    <div className="space-y-6">

          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl text-foreground-muted group-hover:text-white transition">
                ←
              </span>
              <h1 className="text-4xl font-bold text-white font-display uppercase tracking-wide">
                Top Goleadores
              </h1>
            </Link>
            {isAdmin && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary px-4 py-2 cursor-pointer"
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
            <div className="mb-8 bg-surface p-6 rounded-lg border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-wide">
                Registrar Gol
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="match"
                    className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider"
                  >
                    Partido *
                  </label>
                  <select
                    id="match"
                    value={selectedMatch}
                    onChange={(e) => setSelectedMatch(e.target.value)}
                    required
                    className="input-field"
                  >
                    <option value="">Selecciona un partido</option>
                    {matches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {new Date(match.date).toLocaleDateString("es-ES")} -{" "}
                        {match.opponent}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="player"
                    className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider"
                  >
                    Jugador *
                  </label>
                  <select
                    id="player"
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    required
                    className="input-field"
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
                  <label
                    htmlFor="goals"
                    className="block text-sm font-medium text-foreground-muted mb-1 font-display uppercase tracking-wider"
                  >
                    Número de goles *
                  </label>
                  <input
                    type="number"
                    id="goals"
                    value={goalsCount}
                    onChange={(e) =>
                      setGoalsCount(parseInt(e.target.value) || 1)
                    }
                    required
                    min="1"
                    max="10"
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading || !selectedMatch || !selectedPlayer}
                    className="flex-1 btn-primary"
                  >
                    {formLoading ? "Registrando..." : "Registrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedMatch("");
                      setSelectedPlayer("");
                      setGoalsCount(1);
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-wide">
              Goleadores
            </h2>
            <ScorerList scorers={scorers} isLoading={loading && !showForm} />
          </div>

      </div>
 
  );
}
