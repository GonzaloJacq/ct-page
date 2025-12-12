import { NextRequest, NextResponse } from 'next/server';
import { getMatches, createMatch } from '@/lib/db/matches';
import { ApiResponse, Match, CreateMatchInput } from '@/app/features/matches/types';

export async function GET(): Promise<NextResponse<ApiResponse<Match[]>>> {
  try {
    const matches = getMatches();
    return NextResponse.json({
      success: true,
      data: matches,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener partidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Match>>> {
  try {
    const body = (await request.json()) as CreateMatchInput;

    if (!body.opponent || body.opponent.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El rival es requerido' },
        { status: 400 }
      );
    }

    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'La fecha es requerida' },
        { status: 400 }
      );
    }

    if (!body.playerIds || body.playerIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debe seleccionar al menos un jugador' },
        { status: 400 }
      );
    }

    const match = createMatch(body);
    return NextResponse.json(
      { success: true, data: match },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear partido' },
      { status: 500 }
    );
  }
}
