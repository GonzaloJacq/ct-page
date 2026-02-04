import { PrismaClient, MVPVote } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateMVPVoteInput {
  userId: string;
  matchId: string;
  playerId: string;
}

export interface MVPVoteCountResult {
  playerId: string;
  voteCount: number;
}

/**
 * Crear o actualizar un voto de MVP
 * Si el usuario ya votó en este partido, actualiza su voto
 */
export async function createOrUpdateMVPVote(
  input: CreateMVPVoteInput
): Promise<MVPVote> {
  return prisma.mVPVote.upsert({
    where: {
      userId_matchId: {
        userId: input.userId,
        matchId: input.matchId,
      },
    },
    update: {
      playerId: input.playerId,
    },
    create: {
      userId: input.userId,
      matchId: input.matchId,
      playerId: input.playerId,
    },
  });
}

/**
 * Obtener el voto de un usuario para un partido específico
 */
export async function getUserMVPVoteForMatch(
  userId: string,
  matchId: string
): Promise<MVPVote | null> {
  return prisma.mVPVote.findUnique({
    where: {
      userId_matchId: {
        userId,
        matchId,
      },
    },
  });
}

/**
 * Obtener todos los votos para un partido
 */
export async function getMatchMVPVotes(matchId: string): Promise<MVPVote[]> {
  return prisma.mVPVote.findMany({
    where: { matchId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Obtener el conteo de votos por jugador en un partido
 */
export async function getMatchMVPVoteCounts(
  matchId: string
): Promise<MVPVoteCountResult[]> {
  const votes = await prisma.mVPVote.groupBy({
    by: ['playerId'],
    where: { matchId },
    _count: {
      playerId: true,
    },
  });

  return votes.map((vote) => ({
    playerId: vote.playerId,
    voteCount: vote._count.playerId,
  }));
}

/**
 * Obtener todos los votos de un usuario
 */
export async function getUserMVPVotes(userId: string): Promise<MVPVote[]> {
  return prisma.mVPVote.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Eliminar un voto de MVP
 */
export async function deleteMVPVote(
  userId: string,
  matchId: string
): Promise<MVPVote> {
  return prisma.mVPVote.delete({
    where: {
      userId_matchId: {
        userId,
        matchId,
      },
    },
  });
}
