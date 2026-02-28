export interface Match {
  readonly id: string;
  readonly date: Date;
  readonly opponent: string;
  readonly location?: string | null;
  readonly time?: string | null;
  readonly resultNosotros: number | null;
  readonly resultEllos: number | null;
  readonly ourScorerIds: readonly string[]; // IDs of players who scored our goals
  readonly yellowCardPlayerIds: readonly string[];
  readonly redCardPlayerIds: readonly string[];
  readonly playerIds: readonly string[];
  readonly galleryFolderId?: string | null; // optional drive folder ID for match photos
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateMatchInput {
  readonly date: Date;
  readonly opponent: string;
  readonly location?: string | null;
  readonly time?: string | null;
  readonly playerIds: readonly string[];
  readonly galleryFolderId?: string | null;
  readonly resultNosotros?: number | null;
  readonly resultEllos?: number | null;
  readonly ourScorerIds?: readonly string[];
  readonly yellowCardPlayerIds?: readonly string[];
  readonly redCardPlayerIds?: readonly string[];
}

export interface UpdateMatchInput {
  readonly date?: Date;
  readonly opponent?: string;
  readonly location?: string | null;
  readonly time?: string | null;
  readonly playerIds?: readonly string[];
  readonly galleryFolderId?: string | null;
  readonly resultNosotros?: number | null;
  readonly resultEllos?: number | null;
  readonly ourScorerIds?: readonly string[];
  readonly yellowCardPlayerIds?: readonly string[];
  readonly redCardPlayerIds?: readonly string[];
}

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
}
