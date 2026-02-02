'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { MatchWithPlayers } from '../types';

interface VotarMVPProps {
  matches: MatchWithPlayers[];
}

export default function VotarMVP({ matches }: VotarMVPProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [votingState, setVotingState] = useState<'selecting' | 'confirming' | 'success'>('selecting');

  const currentMatch = selectedMatch ? matches.find(m => m.id === selectedMatch) : null;

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    setVotingState('confirming');
  };

  const handleConfirmVote = () => {
    if (selectedPlayer && selectedMatch) {
      // TODO: Send vote to API
      setVotingState('success');
      setTimeout(() => {
        setSelectedMatch(null);
        setSelectedPlayer(null);
        setVotingState('selecting');
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-accent" />
          <h1 className="text-4xl text-white font-display uppercase">Votar MVP</h1>
        </div>
        <p className="text-foreground-muted">Selecciona un partido y elige al MVP</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Matches Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-display font-bold text-white uppercase">Partidos Jugados</h2>
          
          {matches.length === 0 ? (
            <div className="dashboard-card text-center py-12">
              <p className="text-foreground-muted">No hay partidos registrados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => {
                    setSelectedMatch(match.id);
                    setSelectedPlayer(null);
                    setVotingState('selecting');
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedMatch === match.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-foreground-muted hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium">{match.title}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(match.date).toLocaleDateString('es-ES')}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Players Selection */}
        <div className="lg:col-span-2">
          {!selectedMatch ? (
            <div className="dashboard-card text-center py-16">
              <Trophy className="w-16 h-16 text-foreground-muted/30 mx-auto mb-4" />
              <p className="text-foreground-muted text-lg">Selecciona un partido para ver los jugadores</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="dashboard-card bg-white/5 border-white/5">
                <h3 className="text-2xl font-display font-bold text-white uppercase mb-4">
                  {currentMatch?.title}
                </h3>
                <p className="text-sm text-foreground-muted">
                  Elige al MVP de este partido
                </p>
              </div>

              {currentMatch && currentMatch.players.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-lg font-display font-bold text-white uppercase">Jugadores</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentMatch.players.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => handlePlayerSelect(player.id)}
                        className={`p-4 rounded-lg border transition-all text-left group ${
                          selectedPlayer === player.id
                            ? 'border-accent bg-accent/20 text-white'
                            : 'border-white/10 bg-white/5 text-foreground-muted hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium group-hover:text-white transition-colors">
                              {player.name}
                            </p>
                            <p className="text-xs opacity-75 mt-0.5">
                              #{player.number} - {player.position}
                            </p>
                          </div>
                          {selectedPlayer === player.id && (
                            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="dashboard-card text-center py-12">
                  <p className="text-foreground-muted">No hay jugadores registrados para este partido</p>
                </div>
              )}

              {/* Confirmation & Result */}
              {votingState === 'confirming' && selectedPlayer && (
                <div className="dashboard-card bg-accent/10 border-accent/30">
                  <div className="text-center space-y-4">
                    <p className="text-white font-medium">
                      ¿Confirmar voto para <span className="text-accent font-bold">{currentMatch?.players.find(p => p.id === selectedPlayer)?.name}</span>?
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSelectedPlayer(null);
                          setVotingState('selecting');
                        }}
                        className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-foreground-muted hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirmVote}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-accent to-primary text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        Confirmar Voto
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {votingState === 'success' && (
                <div className="dashboard-card bg-emerald-500/10 border-emerald-500/30">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <p className="text-white font-medium">¡Voto registrado correctamente!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
