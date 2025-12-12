import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db/mock';
import { ApiResponse, Product, UpdateProductInput } from '@/app/features/products/types';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener producto',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const { id } = await params;
    const body = await request.json() as UpdateProductInput;

    // Validaciones
    if (body.name !== undefined && body.name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre no puede estar vacío',
        },
        { status: 400 }
      );
    }

    if (body.price !== undefined && body.price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El precio no puede ser negativo',
        },
        { status: 400 }
      );
    }

    if (body.stock !== undefined && body.stock < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El stock no puede ser negativo',
        },
        { status: 400 }
      );
    }

    const product = updateProduct(id, body);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar producto',
      },
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
    const success = deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Producto eliminado correctamente',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar producto',
      },
      { status: 500 }
    );
  }
}
