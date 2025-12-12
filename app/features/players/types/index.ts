export interface Player {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly phone: string;
  readonly shirtNumber: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreatePlayerInput {
  readonly name: string;
  readonly age: number;
  readonly phone: string;
  readonly shirtNumber: number;
}

export interface UpdatePlayerInput {
  readonly name?: string;
  readonly age?: number;
  readonly phone?: string;
  readonly shirtNumber?: number;
}

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
}
