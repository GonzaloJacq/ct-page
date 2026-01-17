/**
 * Checks if a string is missing or empty (whitespace only).
 */
export function isMissing(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Validates if a number is within a specific range.
 */
export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}
