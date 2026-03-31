import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { getEstadisticas, createEstadistica } from '@/lib/db/estadisticas';
import { Estadistica, CreateEstadisticaInput } from '@/app/features/estadisticas/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, ValidationError } from '@/lib/validation';

export async function GET() {
  try {
    const estadisticas = await getEstadisticas();
    return apiResponse<Estadistica[]>(estadisticas);
  } catch (error) {
    console.error('GET /api/estadisticas error:', error);
    return apiError('Error al obtener estadísticas', 500);
  }
}

function validateCreateEstadistica(body: CreateEstadisticaInput): void {
  if (isMissing(body.matchId)) {
    throw new ValidationError('El partido es requerido');
  }

  if (isMissing(body.playerId)) {
    throw new ValidationError('El jugador es requerido');
  }

  if (isMissing(body.playerName)) {
    throw new ValidationError('El nombre del jugador es requerido');
  }

  if (body.goalsCount < 1) {
    throw new ValidationError('El número de goles debe ser mayor a 0');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const body = (await request.json()) as CreateEstadisticaInput;

    validateCreateEstadistica(body);

    const estadistica = await createEstadistica(body);
    return apiResponse<Estadistica>(estadistica, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('POST /api/estadisticas error:', error);
    return apiError('Error al crear registro de estadísticas', 500);
  }
}
