/**
 * Utilidades para respuestas API consistentes
 */

import { NextResponse } from 'next/server';
import { ApiResponse, AppError, HTTP_STATUS } from '@/lib/types/common';

export const createSuccessResponse = <T>(
  data: T,
  statusCode: number = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    { success: true, data },
    { status: statusCode }
  );
};

export const createErrorResponse = (
  error: unknown,
  defaultMessage: string = 'Error al procesar la solicitud'
): NextResponse<ApiResponse<never>> => {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || defaultMessage,
      },
      { status: HTTP_STATUS.INTERNAL_ERROR }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
    },
    { status: HTTP_STATUS.INTERNAL_ERROR }
  );
};

export const withErrorHandling = <T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): (() => Promise<NextResponse<ApiResponse<T>>>) => {
  return async () => {
    try {
      return await handler();
    } catch (error) {
      return createErrorResponse(error);
    }
  };
};
