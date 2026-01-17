import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { createFormation, getFormations } from '@/lib/db/formations';
import { Formation, CreateFormationInput } from '@/app/features/formations/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, isWithinRange, ValidationError } from '@/lib/validation';

export async function GET() {
  try {
    const formations = await getFormations();
    return apiResponse<Formation[]>(formations);
  } catch (error) {
    console.error('GET /api/formations error:', error);
    return apiError('Error al obtener formaciones', 500);
  }
}

function validateCreateFormation(body: CreateFormationInput): void {
  if (isMissing(body.name)) {
    throw new ValidationError('El nombre es requerido');
  }

  if (body.name.length > 100) {
    throw new ValidationError('El nombre no puede exceder 100 caracteres');
  }

  if (!body.formationData || !body.formationData.players || Object.keys(body.formationData.players).length === 0) {
    throw new ValidationError('Debes agregar al menos un jugador a la formación');
  }

  // Validar posiciones
  for (const [playerId, position] of Object.entries(body.formationData.players)) {
    if (
      !isWithinRange(position.x, 0, 100) ||
      !isWithinRange(position.y, 0, 100)
    ) {
      throw new ValidationError(`Posición inválida para el jugador ${playerId}`);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return apiError('No autorizado', 401);
    }

    const body = (await request.json()) as CreateFormationInput;

    validateCreateFormation(body);

    const formation = await createFormation(body);
    return apiResponse<Formation>(formation, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('POST /api/formations error:', error);
    return apiError('Error al crear formación', 500);
  }
}