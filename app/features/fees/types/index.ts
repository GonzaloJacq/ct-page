export interface Fee {
  readonly id: string;
  readonly playerId: string;
  readonly playerName: string;
  readonly month: string;
  readonly amount: number;
  readonly paid: boolean;
  readonly paidDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateFeeInput {
  readonly playerId: string;
  readonly month: string;
  readonly amount: number;
}

export interface UpdateFeeInput {
  readonly amount?: number;
  readonly paid?: boolean;
  readonly paidDate?: Date | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
