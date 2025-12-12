import { NextRequest, NextResponse } from 'next/server';
import { getScorerById, updateScorer, deleteScorer } from '@/lib/db/scorers';
import { ApiResponse, Scorer, UpdateScorerInput } from '@/app/features/scorers/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Scorer>>> {
  try {
    const { id } = await params;
    const scorer = getScorerById(id);

    if (!scorer) {
      return NextResponse.json(
        { success: false, error: 'Registro de goles no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scorer,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener registro de goles' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Scorer>>> {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateScorerInput;

    const scorer = updateScorer(id, body);

    if (!scorer) {
      return NextResponse.json(
        { success: false, error: 'Registro de goles no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scorer,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar registro de goles' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params;
    const deleted = deleteScorer(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Registro de goles no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar registro de goles' },
      { status: 500 }
    );
  }
}
