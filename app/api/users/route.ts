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
        role: true,
        playerId: true,
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
    const { id, isAdmin, role, playerId } = body;

    if (!id || typeof id !== 'string') {
      return apiError('Datos inválidos', 400);
    }

    const data: any = {};
    // isAdmin may be provided explicitly for toggling
    if (body.hasOwnProperty('isAdmin')) {
      if (typeof isAdmin !== 'boolean') {
        return apiError('Datos inválidos', 400);
      }
      data.isAdmin = isAdmin;
    }

    if (role && ['PLAYER','ASSISTANT','DIRECTOR'].includes(role)) {
      data.role = role;
    }
    if (body.hasOwnProperty('playerId')) {
      if (playerId === null || playerId === undefined) {
        // allow clearing association
        data.playerId = null;
      } else if (typeof playerId === 'string') {
        data.playerId = playerId;
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return apiResponse(user);
  } catch (error) {
    console.error('PUT /api/users error:', error);
    return apiError('Error al actualizar usuario', 500);
  }
}
