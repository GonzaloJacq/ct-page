import { NextRequest } from 'next/server';
import { getScorers, createScorer } from '@/lib/db/scorers';
import { Scorer, CreateScorerInput } from '@/app/features/scorers/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, ValidationError } from '@/lib/validation';

export async function GET() {
  try {
    const scorers = await getScorers();
    return apiResponse<Scorer[]>(scorers);
  } catch (error) {
    console.error('GET /api/scorers error:', error);
    return apiError('Error al obtener goleadores', 500);
  }
}

function validateCreateScorer(body: CreateScorerInput): void {
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
    const body = (await request.json()) as CreateScorerInput;

    validateCreateScorer(body);

    const scorer = await createScorer(body);
    return apiResponse<Scorer>(scorer, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('POST /api/scorers error:', error);
    return apiError('Error al crear registro de goles', 500);
  }
}
