import { NextRequest, NextResponse } from 'next/server';
import { getFeeById, updateFee, deleteFee } from '@/lib/db/fees';
import { ApiResponse, Fee, UpdateFeeInput } from '@/app/features/fees/types';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Fee>>> {
  try {
    const { id } = await params;
    const fee = await getFeeById(id);
    if (!fee) {
      return NextResponse.json(
        { success: false, error: 'Cuota no encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: fee });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener cuota' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Fee>>> {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateFeeInput;

    const fee = await updateFee(id, body);
    if (!fee) {
      return NextResponse.json(
        { success: false, error: 'Cuota no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: fee });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar cuota' },
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
    const success = await deleteFee(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Cuota no encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: null, message: 'Cuota eliminada' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar cuota' },
      { status: 500 }
    );
  }
}
