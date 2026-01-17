import { NextRequest } from 'next/server';
import { getPlayerById, updatePlayer, deletePlayer } from '@/lib/db/players';
import { UpdatePlayerInput } from '@/app/features/players/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, isWithinRange, ValidationError } from '@/lib/validation';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await getPlayerById(id);

    if (!player) {
      return apiError('Jugador no encontrado', 404);
    }

    return apiResponse(player);
  } catch (error) {
    console.error('GET /api/players/[id] error:', error);
    return apiError('Error al obtener jugador', 500);
  }
}

function validateUpdatePlayer(body: UpdatePlayerInput): void {
  if (body.name !== undefined && isMissing(body.name)) {
    throw new ValidationError('El nombre no puede estar vacío');
  }

  if (body.age !== undefined && !isWithinRange(body.age, 18, 100)) {
    throw new ValidationError('La edad debe estar entre 18 y 100');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdatePlayerInput;

    validateUpdatePlayer(body);

    const player = await updatePlayer(id, body);

    if (!player) {
      return apiError('Jugador no encontrado', 404);
    }

    return apiResponse(player);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('PUT /api/players/[id] error:', error);
    return apiError('Error al actualizar jugador', 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deletePlayer(id);

    if (!success) {
      return apiError('Jugador no encontrado', 404);
    }

    return apiResponse(null, 200);
  } catch (error) {
    console.error('DELETE /api/players/[id] error:', error);
    return apiError('Error al eliminar jugador', 500);
  }
}
