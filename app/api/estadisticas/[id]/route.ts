import { NextRequest } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { getEstadisticaById, updateEstadistica, deleteEstadistica } from "@/lib/db/estadisticas";
import { Estadistica, UpdateEstadisticaInput } from "@/app/features/estadisticas/types";
import { apiResponse, apiError } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const estadistica = await getEstadisticaById(id);

    if (!estadistica) {
      return apiError("Estadística no encontrada", 404);
    }

    return apiResponse(estadistica);
  } catch (error) {
    console.error('GET /api/estadisticas/[id] error:', error);
    return apiError("Error al obtener estadística", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateEstadisticaInput;

    const estadistica = await updateEstadistica(id, body);

    if (!estadistica) {
      return apiError("Estadística no encontrada", 404);
    }

    return apiResponse(estadistica);
  } catch (error) {
    console.error('PUT /api/estadisticas/[id] error:', error);
    return apiError("Error al actualizar estadística", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const { id } = await params;
    const deleted = await deleteEstadistica(id);

    if (!deleted) {
      return apiError("Estadística no encontrada", 404);
    }

    return apiResponse(null, 200);
  } catch (error) {
    console.error('DELETE /api/estadisticas/[id] error:', error);
    return apiError("Error al eliminar estadística", 500);
  }
}
