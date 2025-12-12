export interface Scorer {
  readonly id: string;
  readonly matchId: string;
  readonly playerId: string;
  readonly playerName: string;
  readonly goalsCount: number;
  readonly matchDate: Date;
  readonly opponent: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateScorerInput {
  readonly matchId: string;
  readonly playerId: string;
  readonly playerName: string;
  readonly goalsCount: number;
  readonly matchDate: Date;
  readonly opponent: string;
}

export interface UpdateScorerInput {
  readonly goalsCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
