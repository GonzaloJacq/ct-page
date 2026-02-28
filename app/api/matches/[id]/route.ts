import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { getMatchById, updateMatch, deleteMatch } from '@/lib/db/matches';
import { UpdateMatchInput } from '@/app/features/matches/types';
import { apiResponse, apiError } from '@/lib/api-utils';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await getMatchById(id);

    if (!match) {
      return apiError('Partido no encontrado', 404);
    }

    return apiResponse(match);
  } catch (error) {
    console.error('GET /api/matches/[id] error:', error);
    return apiError('Error al obtener partido', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateMatchInput;

    // Optionally validate similar constraints as creation
    if (body.ourScorerIds && body.resultNosotros !== undefined) {
      if (body.ourScorerIds.length !== body.resultNosotros) {
        return apiError('La cantidad de goleadores debe coincidir con los goles de nosotros', 400);
      }
      if (body.playerIds) {
        for (const sid of body.ourScorerIds) {
          if (!body.playerIds.includes(sid)) {
            return apiError('Los goleadores deben ser jugadores convocados', 400);
          }
        }
      }
    }
    if (body.yellowCardPlayerIds && body.playerIds) {
      for (const sid of body.yellowCardPlayerIds) {
        if (!body.playerIds.includes(sid)) {
          return apiError('Los amonestados deben ser jugadores convocados', 400);
        }
      }
    }
    if (body.redCardPlayerIds && body.playerIds) {
      for (const sid of body.redCardPlayerIds) {
        if (!body.playerIds.includes(sid)) {
          return apiError('Los expulsados deben ser jugadores convocados', 400);
        }
      }
    }

    const match = await updateMatch(id, body);

    if (!match) {
      return apiError('Partido no encontrado', 404);
    }

    return apiResponse(match);
  } catch (error) {
    console.error('PUT /api/matches/[id] error:', error);
    return apiError('Error al actualizar partido', 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const { id } = await params;
    const deleted = await deleteMatch(id);

    if (!deleted) {
      return apiError('Partido no encontrado', 404);
    }

    return apiResponse(null, 200);
  } catch (error) {
    console.error('DELETE /api/matches/[id] error:', error);
    return apiError('Error al eliminar partido', 500);
  }
}
