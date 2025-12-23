import { NextRequest, NextResponse } from 'next/server';

import {
  ApiResponse,
  Formation,
  CreateFormationInput,
} from '@/app/features/formations/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { createFormation, getFormations } from '@/lib/db/formations';


export async function GET(): Promise<NextResponse<ApiResponse<Formation[]>>> {
  try {
    const formations = await getFormations();
    return NextResponse.json({
      success: true,
      data: formations,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener formaciones' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Formation>>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CreateFormationInput;

    // Validaciones
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    if (body.name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'El nombre no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    if (!body.formationData || !body.formationData.players || Object.keys(body.formationData.players).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debes agregar al menos un jugador a la formación',
        },
        { status: 400 }
      );
    }

    // Validar que las posiciones estén en el rango correcto
    for (const [playerId, position] of Object.entries(body.formationData.players)) {
      if (
        position.x < 0 ||
        position.x > 100 ||
        position.y < 0 ||
        position.y > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Posición inválida para el jugador ${playerId}`,
          },
          { status: 400 }
        );
      }
    }

    const formation = await createFormation(body);
    return NextResponse.json(
      { success: true, data: formation },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear formación' },
      { status: 500 }
    );
  }
}