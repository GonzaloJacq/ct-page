export interface Estadistica {
  readonly playerId: string;
  readonly playerName: string;
  readonly totalGoals: number;
  readonly totalYellowCards: number;
  readonly totalRedCards: number;
  readonly totalMatches: number;
  readonly totalMVPs: number;
}

export interface CreateEstadisticaInput {
  readonly matchId: string;
  readonly playerId: string;
  readonly playerName: string;
  readonly goalsCount: number;
  readonly matchDate: Date;
  readonly opponent: string;
}

export interface UpdateEstadisticaInput {
  readonly goalsCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
