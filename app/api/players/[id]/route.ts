import { NextRequest, NextResponse } from 'next/server';
import { getPlayerById, updatePlayer, deletePlayer } from '@/lib/db/players';
import { ApiResponse, Player, UpdatePlayerInput } from '@/app/features/players/types';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Player>>> {
  try {
    const { id } = await params;
    const player = await getPlayerById(id);

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Jugador no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: player });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener jugador' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Player>>> {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdatePlayerInput;

    if (body.name !== undefined && body.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre no puede estar vacío' },
        { status: 400 }
      );
    }

    if (body.age !== undefined && (body.age < 18 || body.age > 100)) {
      return NextResponse.json(
        { success: false, error: 'La edad debe estar entre 18 y 100' },
        { status: 400 }
      );
    }

    const player = await updatePlayer(id, body);

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Jugador no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: player });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar jugador' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params;
    const success = await deletePlayer(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Jugador no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: null, message: 'Jugador eliminado' }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar jugador' },
      { status: 500 }
    );
  }
}
