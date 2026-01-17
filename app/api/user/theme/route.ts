import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hex color validation regex
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

function isValidColor(color: unknown): color is string {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color);
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado: Sesión inválida' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || !isValidColor(body.themeColor)) {
      return NextResponse.json(
        { error: 'Formato de color inválido. Se requiere un formato Hex (#RRGGBB).' },
        { status: 400 }
      );
    }

    const { themeColor } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { themeColor },
    });

    return NextResponse.json({ 
      success: true, 
      themeColor: user.themeColor 
    });

  } catch (error) {
    console.error('[ThemeUpdate] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar el tema' },
      { status: 500 }
    );
  }
}
