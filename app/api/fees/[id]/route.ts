import { NextRequest } from 'next/server';
import { getFeeById, updateFee, deleteFee } from '@/lib/db/fees';
import { UpdateFeeInput } from '@/app/features/fees/types';
import { apiResponse, apiError } from '@/lib/api-utils';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fee = await getFeeById(id);
    if (!fee) {
      return apiError('Cuota no encontrada', 404);
    }
    return apiResponse(fee);
  } catch (error) {
    console.error('GET /api/fees/[id] error:', error);
    return apiError('Error al obtener cuota', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateFeeInput;

    const fee = await updateFee(id, body);
    if (!fee) {
      return apiError('Cuota no encontrada', 404);
    }

    return apiResponse(fee);
  } catch (error) {
    console.error('PUT /api/fees/[id] error:', error);
    return apiError('Error al actualizar cuota', 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteFee(id);
    if (!success) {
      return apiError('Cuota no encontrada', 404);
    }
    return apiResponse(null, 200);
  } catch (error) {
    console.error('DELETE /api/fees/[id] error:', error);
    return apiError('Error al eliminar cuota', 500);
  }
}
