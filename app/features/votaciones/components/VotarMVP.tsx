'use client';

import { useState } from 'react';
import { Trophy, ArrowLeft, Check, CheckCircle } from 'lucide-react';
import { MatchWithPlayers } from '../types';

interface VotarMVPProps {
  matches: MatchWithPlayers[];
}

export default function VotarMVP({ matches: initialMatches }: VotarMVPProps) {
  const [step, setStep] = useState<'matches' | 'voting' | 'success'>('matches');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [matchesWithVotes, setMatchesWithVotes] = useState<MatchWithPlayers[]>(initialMatches);

  const currentMatch = selectedMatch ? matchesWithVotes.find(m => m.id === selectedMatch) : null;
  const hasAlreadyVoted = currentMatch?.userVote !== undefined;

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatch(matchId);
    const match = matchesWithVotes.find(m => m.id === matchId);
    // Pre-select the current vote if exists
    setSelectedPlayer(match?.userVote?.playerId ?? null);
    setStep('voting');
  };

  const handleVote = async () => {
    if (selectedPlayer && selectedMatch) {
      try {
        const response = await fetch('/api/mvp-votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchId: selectedMatch,
            playerId: selectedPlayer,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al guardar el voto');
        }

        // Actualizar el estado local con el nuevo voto
        const currentMatchData = matchesWithVotes.find(m => m.id === selectedMatch);
        if (currentMatchData) {
          const votedPlayer = currentMatchData.players.find(p => p.id === selectedPlayer);
          if (votedPlayer) {
            setMatchesWithVotes(prevMatches =>
              prevMatches.map(match =>
                match.id === selectedMatch
                  ? {
                      ...match,
                      userVote: {
                        playerId: selectedPlayer,
                        playerName: votedPlayer.name,
                      },
                    }
                  : match
              )
            );
          }
        }

        setStep('success');
        setTimeout(() => {
          setSelectedMatch(null);
          setSelectedPlayer(null);
          setStep('matches');
        }, 2500);
      } catch (error) {
        console.error('Error voting:', error);
      }
    }
  };

  const handleBack = () => {
    setSelectedMatch(null);
    setSelectedPlayer(null);
    setStep('matches');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-accent" />
          <h1 className="text-4xl text-white font-display uppercase">Votar MVP</h1>
        </div>
        <p className="text-foreground-muted">
          {step === 'matches' && 'Selecciona un partido'}
          {step === 'voting' && 'Elige al MVP del partido'}
          {step === 'success' && '¡Voto registrado!'}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        {/* Step 1: Select Match */}
        {step === 'matches' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {matchesWithVotes.length === 0 ? (
              <div className="dashboard-card text-center py-16">
                <Trophy className="w-16 h-16 text-foreground-muted/30 mx-auto mb-4" />
                <p className="text-foreground-muted text-lg">No hay partidos registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchesWithVotes.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleSelectMatch(match.id)}
                    className={`w-full text-left dashboard-card transition-all group cursor-pointer ${
                      match.userVote
                        ? 'border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                        : 'hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-display font-bold text-white group-hover:text-accent transition-colors">
                            {match.title}
                          </h3>
                          {match.userVote && (
                            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-1.5 rounded-full text-xs font-semibold">
                              <CheckCircle className="w-4 h-4" />
                              Ya votaste
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-foreground-muted">
                          {new Date(match.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>

                        {match.userVote && (
                          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">
                              Tu MVP:
                            </p>
                            <p className="text-base font-display font-bold text-emerald-300">
                              {match.userVote.playerName}
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-foreground-muted mt-2">
                          {match.players.length} jugadores disponibles
                        </p>
                      </div>
                      <div className={`transition-colors ml-4 shrink-0 ${
                        match.userVote
                          ? 'text-emerald-400'
                          : 'text-accent/30 group-hover:text-accent/60'
                      }`}>
                        <Trophy className="w-6 h-6" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Vote for MVP */}
        {step === 'voting' && currentMatch && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Match Info Card */}
            <div className={`dashboard-card border-2 ${
              hasAlreadyVoted 
                ? 'bg-linear-to-r from-emerald-500/10 to-accent/10 border-emerald-500/30' 
                : 'bg-linear-to-r from-primary/10 to-accent/10 border-primary/30'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-2">
                    {currentMatch.title}
                  </h2>
                  <p className="text-foreground-muted">
                    {new Date(currentMatch.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                {hasAlreadyVoted && (
                  <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Ya votado
                  </div>
                )}
              </div>
            </div>

            {/* Players Grid */}
            {currentMatch.players.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold text-white uppercase">
                  {hasAlreadyVoted ? 'Cambiar MVP' : 'Selecciona al MVP'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentMatch.players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayer(player.id)}
                      className={`p-4 rounded-lg border-2 transition-all group ${
                        selectedPlayer === player.id
                          ? 'border-accent bg-accent/20 shadow-lg shadow-accent/30'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className={`text-3xl font-display font-bold transition-colors ${
                            selectedPlayer === player.id ? 'text-accent' : 'text-white'
                          }`}>
                            #{player.number}
                          </div>
                        </div>
                        <p className="font-medium text-white text-center truncate">
                          {player.name}
                        </p>
                        {selectedPlayer === player.id && (
                          <div className="flex justify-center pt-1">
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 text-foreground-muted hover:text-white transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                onClick={handleVote}
                disabled={!selectedPlayer}
                className={`flex-1 py-3 rounded-lg font-medium font-display uppercase transition-all ${
                  selectedPlayer
                    ? 'bg-linear-to-r from-accent to-primary text-white hover:opacity-90 cursor-pointer'
                    : 'bg-white/10 text-foreground-muted cursor-not-allowed opacity-50'
                }`}
              >
                {hasAlreadyVoted ? 'Actualizar Voto' : 'Votar MVP'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="dashboard-card bg-emerald-500/10 border-emerald-500/30 text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                ¡{hasAlreadyVoted ? 'Voto Actualizado' : 'Voto Registrado'}!
              </h2>
              <p className="text-foreground-muted">
                Tu voto por {currentMatch?.players.find(p => p.id === selectedPlayer)?.name} ha sido {hasAlreadyVoted ? 'actualizado' : 'guardado'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
