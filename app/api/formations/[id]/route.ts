import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { updateFormation, deleteFormation } from "@/lib/db/formations";
import { UpdateFormationInput } from "@/app/features/formations/types";
import { apiResponse, apiError } from "@/lib/api-utils";
import { isMissing, isWithinRange, ValidationError } from "@/lib/validation";

function validateUpdateFormation(body: UpdateFormationInput): void {
  if (body.name !== undefined) {
    if (isMissing(body.name)) {
      throw new ValidationError('El nombre no puede estar vacío');
    }
    if (body.name.length > 100) {
      throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }
  }

  if (body.formationData !== undefined) {
    if (!body.formationData.players || Object.keys(body.formationData.players).length === 0) {
       throw new ValidationError('Debes agregar al menos un jugador a la formación');
    }
    
    for (const [playerId, position] of Object.entries(body.formationData.players)) {
      if (!isWithinRange(position.x, 0, 100) || !isWithinRange(position.y, 0, 100)) {
        throw new ValidationError(`Posición inválida para el jugador ${playerId}`);
      }
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return apiError("No autorizado", 401);
    }

    const body = (await request.json()) as UpdateFormationInput;

    validateUpdateFormation(body);

    const formation = await updateFormation(id, body);

    if (!formation) {
      return apiError("Formación no encontrada", 404);
    }

    return apiResponse(formation);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, error.statusCode);
    }
    console.error('PUT /api/formations/[id] error:', error);
    return apiError("Error al actualizar formación", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return apiError("No autorizado", 401);
    }

    const deleted = await deleteFormation(id);

    if (!deleted) {
      return apiError("Formación no encontrada", 404);
    }

    return apiResponse(null, 200);
  } catch (error) {
    console.error('DELETE /api/formations/[id] error:', error);
    return apiError("Error al eliminar formación", 500);
  }
}
