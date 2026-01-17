import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { PrismaClient } from '@prisma/client';
import { apiResponse, apiError } from '@/lib/api-utils';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return apiResponse(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return apiError('Error al obtener usuarios', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return apiError('No tienes permisos de administrador', 403);
    }

    const body = await request.json();
    const { id, isAdmin } = body;

    if (!id || typeof isAdmin !== 'boolean') {
      return apiError('Datos inválidos', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isAdmin },
    });

    return apiResponse(user);
  } catch (error) {
    console.error('PUT /api/users error:', error);
    return apiError('Error al actualizar usuario', 500);
  }
}
