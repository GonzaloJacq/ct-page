export interface Match {
  readonly id: string;
  readonly date: Date;
  readonly opponent: string;
  readonly playerIds: readonly string[];
  readonly result: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateMatchInput {
  readonly date: Date;
  readonly opponent: string;
  readonly playerIds: readonly string[];
  readonly result?: string | null;
}

export interface UpdateMatchInput {
  readonly date?: Date;
  readonly opponent?: string;
  readonly playerIds?: readonly string[];
  readonly result?: string | null;
}

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
}
