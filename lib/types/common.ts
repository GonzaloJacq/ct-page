/**
 * Tipos comunes y utilidades para toda la aplicación
 */

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly statusCode: number;
}

export class AppError extends Error {
  constructor(
    readonly code: string,
    readonly statusCode: number = 500,
    message: string = 'Error interno del servidor'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
