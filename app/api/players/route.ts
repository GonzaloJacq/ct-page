import { NextRequest } from 'next/server';
import { getPlayers, createPlayer } from '@/lib/db/players';
import { ApiResponse, Player, CreatePlayerInput } from '@/app/features/players/types';
import { apiResponse, apiError } from '@/lib/api-utils';
import { isMissing, isWithinRange, ValidationError } from '@/lib/validation';

export async function GET() {
  try {
    const players = await getPlayers();
    return apiResponse<Player[]>(players);
  } catch (error) {
    console.error('GET /api/players error:', error);
    return apiError('Error al obtener jugadores', 500);
  }
}

function validateCreatePlayer(body: CreatePlayerInput): void {
  if (isMissing(body.name)) {
    throw new ValidationError('El nombre es requerido');
  }

  if (!isWithinRange(body.age, 18, 100)) {
    throw new ValidationError('La edad debe estar entre 18 y 100');
  }

  if (isMissing(body.phone)) {
    throw new ValidationError('El teléfono es requerido');
  }

  if (!isWithinRange(body.shirtNumber, 1, 99)) {
    throw new ValidationError('El número de camiseta debe estar entre 1 y 99');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePlayerInput;

    validateCreatePlayer(body);

    const player = await createPlayer(body);
    return apiResponse<Player>(player, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('POST /api/players error:', error);
    return apiError('Error al crear jugador', 500);
  }
}
