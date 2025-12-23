import { NextRequest, NextResponse } from "next/server";
import { updateFormation, deleteFormation } from "@/lib/db/formations";
import {
  ApiResponse,
  Formation,
  UpdateFormationInput,
} from "@/app/features/formations/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";



export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Formation>>> {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as UpdateFormationInput;

    // Validaciones
    if (body.name !== undefined) {
      if (body.name.trim() === "") {
        return NextResponse.json(
          { success: false, error: "El nombre no puede estar vacío" },
          { status: 400 }
        );
      }

      if (body.name.length > 100) {
        return NextResponse.json(
          {
            success: false,
            error: "El nombre no puede exceder 100 caracteres",
          },
          { status: 400 }
        );
      }
    }

    if (body.formationData !== undefined) {
      if (!body.formationData.players || Object.keys(body.formationData.players).length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Debes agregar al menos un jugador a la formación",
          },
          { status: 400 }
        );
      }

      // Validar posiciones
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
    }

    const formation = await updateFormation(id, body);

    if (!formation) {
      return NextResponse.json(
        { success: false, error: "Formación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: formation });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al actualizar formación" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<void>>> {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const deleted = await deleteFormation(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Formación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al eliminar formación" },
      { status: 500 }
    );
  }
}
