import { NextResponse } from 'next/server';

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Returns a standardized success response.
 * @param data The payload to return.
 * @param status HTTP status code (default: 200).
 */
export function apiResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Returns a standardized error response.
 * @param message Error message.
 * @param status HTTP status code (default: 500).
 */
export function apiError(message: string, status = 500): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: message }, { status });
}
