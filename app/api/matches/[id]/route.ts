import { NextRequest, NextResponse } from 'next/server';
import { getMatchById, updateMatch, deleteMatch } from '@/lib/db/matches';
import { ApiResponse, Match, UpdateMatchInput } from '@/app/features/matches/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Match>>> {
  try {
    const { id } = await params;
    const match = await getMatchById(id);

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Partido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: match,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener partido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Match>>> {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateMatchInput;

    const match = await updateMatch(id, body);

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Partido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: match,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar partido' },
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
    const deleted = deleteMatch(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Partido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar partido' },
      { status: 500 }
    );
  }
}
