import { NextRequest, NextResponse } from 'next/server';
import { getScorers, createScorer } from '@/lib/db/scorers';
import { ApiResponse, Scorer, CreateScorerInput } from '@/app/features/scorers/types';

export async function GET(): Promise<NextResponse<ApiResponse<Scorer[]>>> {
  try {
    const scorers = getScorers();
    return NextResponse.json({
      success: true,
      data: scorers,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener goleadores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Scorer>>> {
  try {
    const body = (await request.json()) as CreateScorerInput;

    if (!body.matchId || body.matchId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El partido es requerido' },
        { status: 400 }
      );
    }

    if (!body.playerId || body.playerId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El jugador es requerido' },
        { status: 400 }
      );
    }

    if (!body.playerName || body.playerName.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre del jugador es requerido' },
        { status: 400 }
      );
    }

    if (!body.goalsCount || body.goalsCount < 1) {
      return NextResponse.json(
        { success: false, error: 'El número de goles debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const scorer = createScorer(body);
    return NextResponse.json(
      { success: true, data: scorer },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear registro de goles' },
      { status: 500 }
    );
  }
}
