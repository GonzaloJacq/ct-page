import { NextRequest } from "next/server";
import { getScorerById, updateScorer, deleteScorer } from "@/lib/db/scorers";
import { Scorer, UpdateScorerInput } from "@/app/features/scorers/types";
import { apiResponse, apiError } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scorer = await getScorerById(id);

    if (!scorer) {
      return apiError("Registro de goles no encontrado", 404);
    }

    return apiResponse(scorer);
  } catch (error) {
    console.error('GET /api/scorers/[id] error:', error);
    return apiError("Error al obtener registro de goles", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateScorerInput;

    const scorer = await updateScorer(id, body);

    if (!scorer) {
      return apiError("Registro de goles no encontrado", 404);
    }

    return apiResponse(scorer);
  } catch (error) {
    console.error('PUT /api/scorers/[id] error:', error);
    return apiError("Error al actualizar registro de goles", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteScorer(id);

    if (!deleted) {
      return apiError("Registro de goles no encontrado", 404);
    }

    return apiResponse(null, 200);
  } catch (error) {
    console.error('DELETE /api/scorers/[id] error:', error);
    return apiError("Error al eliminar registro de goles", 500);
  }
}
