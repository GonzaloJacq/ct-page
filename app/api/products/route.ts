import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db/mock';
import { ApiResponse, Product, CreateProductInput } from '@/app/features/products/types';

export async function GET(): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    const products = getProducts();
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const body = await request.json() as CreateProductInput;

    // Validar datos
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre es requerido',
        },
        { status: 400 }
      );
    }

    if (body.price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El precio no puede ser negativo',
        },
        { status: 400 }
      );
    }

    if (body.stock < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El stock no puede ser negativo',
        },
        { status: 400 }
      );
    }

    const product = createProduct(body);

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear producto',
      },
      { status: 500 }
    );
  }
}
