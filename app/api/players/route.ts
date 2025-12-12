import { NextRequest, NextResponse } from 'next/server';
import { getPlayers, createPlayer } from '@/lib/db/players';
import { ApiResponse, Player, CreatePlayerInput } from '@/app/features/players/types';

export async function GET(): Promise<NextResponse<ApiResponse<Player[]>>> {
  try {
    const players = getPlayers();
    return NextResponse.json({
      success: true,
      data: players,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener jugadores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Player>>> {
  try {
    const body = (await request.json()) as CreatePlayerInput;

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    if (body.age < 18 || body.age > 100) {
      return NextResponse.json(
        { success: false, error: 'La edad debe estar entre 18 y 100' },
        { status: 400 }
      );
    }

    if (!body.phone || body.phone.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El teléfono es requerido' },
        { status: 400 }
      );
    }

    if (body.shirtNumber < 1 || body.shirtNumber > 99) {
      return NextResponse.json(
        { success: false, error: 'El número de camiseta debe estar entre 1 y 99' },
        { status: 400 }
      );
    }

    const player = createPlayer(body);
    return NextResponse.json(
      { success: true, data: player },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear jugador' },
      { status: 500 }
    );
  }
}
