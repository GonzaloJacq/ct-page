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
  // ensure date is valid
  if (typeof body.date === 'string') {
    const d = new Date(body.date);
    if (isNaN(d.getTime())) {
      throw new ValidationError('Fecha inválida');
    }
  }

  if (!body.playerIds || body.playerIds.length === 0) {
    throw new ValidationError('Debe seleccionar al menos un jugador');
  }

  if (body.resultNosotros === undefined || body.resultEllos === undefined) {
    throw new ValidationError('Debes registrar los goles de ambos equipos');
  }

  if (body.galleryFolderId !== undefined && body.galleryFolderId !== null) {
    if (typeof body.galleryFolderId !== 'string') {
      throw new ValidationError('ID de galería inválido');
    }
    // simple sanity: typical Drive IDs are 10-60 chars
    if (body.galleryFolderId.length > 200) {
      throw new ValidationError('ID de galería demasiado largo');
    }
  }

  if (body.ourScorerIds) {
    if (!Array.isArray(body.ourScorerIds)) {
      throw new ValidationError('ourScorerIds debe ser un arreglo');
    }
    if (body.resultNosotros !== null && body.ourScorerIds.length !== body.resultNosotros) {
      throw new ValidationError('La cantidad de goleadores debe coincidir con los goles de nosotros');
    }
    for (const id of body.ourScorerIds) {
      if (!body.playerIds.includes(id)) {
        throw new ValidationError('Los goleadores deben ser jugadores convocados');
      }
    }
  }

  if (body.yellowCardPlayerIds) {
    if (!Array.isArray(body.yellowCardPlayerIds)) {
      throw new ValidationError('yellowCardPlayerIds debe ser un arreglo');
    }
    for (const id of body.yellowCardPlayerIds) {
      if (!body.playerIds.includes(id)) {
        throw new ValidationError('Los amonestados deben ser jugadores convocados');
      }
    }
  }

  if (body.redCardPlayerIds) {
    if (!Array.isArray(body.redCardPlayerIds)) {
      throw new ValidationError('redCardPlayerIds debe ser un arreglo');
    }
    for (const id of body.redCardPlayerIds) {
      if (!body.playerIds.includes(id)) {
        throw new ValidationError('Los expulsados deben ser jugadores convocados');
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }
    const raw = (await request.json()) as CreateMatchInput;
    // work with a mutable copy since input type is readonly
    const body: any = { ...raw };

    // normalize galleryFolderId if provided
    if (body.galleryFolderId && typeof body.galleryFolderId === 'string') {
      const m = body.galleryFolderId.match(/[-\w]{25,}(?=[^\w]|$)/);
      if (m) body.galleryFolderId = m[0];
    }

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
