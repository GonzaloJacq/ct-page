import { NextRequest, NextResponse } from 'next/server';
import { getFees, createFee } from '@/lib/db/fees';
import { ApiResponse, Fee, CreateFeeInput } from '@/app/features/fees/types';

export async function GET(): Promise<NextResponse<ApiResponse<Fee[]>>> {
  try {
    const fees = await getFees();
    return NextResponse.json({ success: true, data: fees });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener cuotas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Fee>>> {
  try {
    const body = (await request.json()) as CreateFeeInput;

    if (!body.playerId) {
      return NextResponse.json(
        { success: false, error: 'Selecciona un jugador' },
        { status: 400 }
      );
    }

    if (!body.month) {
      return NextResponse.json(
        { success: false, error: 'Selecciona un mes' },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const fee = await createFee(body);
    return NextResponse.json(
      { success: true, data: fee },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear cuota' },
      { status: 500 }
    );
  }
}
