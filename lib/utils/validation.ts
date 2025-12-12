/**
 * Utilidades de validación reutilizables
 */

import { AppError, ERROR_CODES, HTTP_STATUS } from '@/lib/types/common';

export const validateString = (
  value: unknown,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 255
): string => {
  if (typeof value !== 'string') {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} debe ser texto`
    );
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} es requerido`
    );
  }

  if (trimmed.length > maxLength) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} no puede exceder ${maxLength} caracteres`
    );
  }

  return trimmed;
};

export const validateNumber = (
  value: unknown,
  fieldName: string,
  min: number = 0,
  max: number = Infinity
): number => {
  const num = typeof value === 'string' ? parseInt(value, 10) : Number(value);

  if (isNaN(num)) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} debe ser un número`
    );
  }

  if (num < min || num > max) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} debe estar entre ${min} y ${max}`
    );
  }

  return num;
};

export const validatePhone = (phone: unknown): string => {
  const phoneStr = validateString(phone, 'Teléfono', 7, 20);

  if (!/^[\d\s+\-()]+$/.test(phoneStr)) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      'Teléfono inválido'
    );
  }

  return phoneStr;
};

export const validateAge = (age: unknown): number => {
  return validateNumber(age, 'Edad', 13, 100);
};

export const validateShirtNumber = (number: unknown): number => {
  return validateNumber(number, 'Número de camiseta', 1, 99);
};

export const validateDate = (value: unknown, fieldName: string): Date => {
  if (!(value instanceof Date) && typeof value !== 'string') {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} inválida`
    );
  }

  const date = typeof value === 'string' ? new Date(value) : value;

  if (isNaN(date.getTime())) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} inválida`
    );
  }

  return date;
};

export const validateMonthString = (month: unknown): string => {
  const monthStr = validateString(month, 'Mes', 7, 7);

  if (!/^\d{4}-\d{2}$/.test(monthStr)) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      'Formato de mes inválido (usar YYYY-MM)'
    );
  }

  return monthStr;
};

export const validatePositiveNumber = (
  value: unknown,
  fieldName: string = 'Monto',
  maxValue: number = 10000
): number => {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(num) || num <= 0) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} debe ser mayor a 0`
    );
  }

  if (num > maxValue) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} no puede exceder ${maxValue}`
    );
  }

  return num;
};

export const validateArrayOfIds = (ids: unknown, fieldName: string = 'IDs'): string[] => {
  if (!Array.isArray(ids)) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} debe ser un array`
    );
  }

  const validIds = ids.filter((id) => typeof id === 'string' && id.trim().length > 0);

  if (validIds.length === 0) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      `${fieldName} no puede estar vacío`
    );
  }

  return validIds;
};
