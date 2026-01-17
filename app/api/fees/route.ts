import { NextRequest } from 'next/server';
import { getFees, createFee } from '@/lib/db/fees';
import { Fee, CreateFeeInput } from '@/app/features/fees/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, ValidationError } from '@/lib/validation';

export async function GET() {
  try {
    const fees = await getFees();
    return apiResponse<Fee[]>(fees);
  } catch (error) {
    console.error('GET /api/fees error:', error);
    return apiError('Error al obtener cuotas', 500);
  }
}

function validateCreateFee(body: CreateFeeInput): void {
  if (isMissing(body.playerId)) {
    throw new ValidationError('Selecciona un jugador');
  }

  if (isMissing(body.month)) {
    throw new ValidationError('Selecciona un mes');
  }

  if (body.amount <= 0) {
    throw new ValidationError('El monto debe ser mayor a 0');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateFeeInput;

    validateCreateFee(body);

    const fee = await createFee(body);
    return apiResponse<Fee>(fee, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('POST /api/fees error:', error);
    return apiError('Error al crear cuota', 500);
  }
}
