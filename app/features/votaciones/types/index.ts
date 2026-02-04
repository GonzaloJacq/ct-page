export interface Votacion {
  id: string;
  title: string;
  description: string;
  type: 'general' | 'mvp';
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'closed';
}

export interface Voto {
  id: string;
  votacionId: string;
  votadoId: string;
  votanteName: string;
  createdAt: Date;
}

export interface VotoMVP extends Voto {
  matchId: string;
  position?: string;
}

export interface MatchPlayer {
  id: string;
  name: string;
  position: string;
  number: number;
}

export interface MatchWithPlayers {
  id: string;
  title: string;
  date: Date;
  opponent?: string;
  players: MatchPlayer[];
  userVote?: {
    playerId: string;
    playerName: string;
  };
}
