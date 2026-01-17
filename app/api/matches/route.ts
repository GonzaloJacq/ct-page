import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { getMatches, createMatch } from '@/lib/db/matches';
import { Match, CreateMatchInput } from '@/app/features/matches/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, ValidationError } from '@/lib/validation';

export async function GET() {
  try {
    const matches = await getMatches();
    return apiResponse<Match[]>(matches);
  } catch (error) {
    console.error('GET /api/matches error:', error);
    return apiError('Error al obtener partidos', 500);
  }
}

function validateCreateMatch(body: CreateMatchInput): void {
  if (isMissing(body.opponent)) {
    throw new ValidationError('El rival es requerido');
  }

  if (!body.date) {
    throw new ValidationError('La fecha es requerida');
  }

  if (!body.playerIds || body.playerIds.length === 0) {
    throw new ValidationError('Debe seleccionar al menos un jugador');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }
    const body = (await request.json()) as CreateMatchInput;

    validateCreateMatch(body);

    const match = await createMatch(body);
    return apiResponse<Match>(match, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('POST /api/matches error:', error);
    return apiError('Error al crear partido', 500);
  }
}
