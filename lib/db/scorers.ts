import { PrismaClient } from '@prisma/client';
import { Scorer, CreateScorerInput } from '@/app/features/scorers/types';

const prisma = new PrismaClient();

export async function getScorers(): Promise<Scorer[]> {
  const scorers = await prisma.scorer.findMany({
    orderBy: [{ goalsCount: 'desc' }, { createdAt: 'desc' }],
  });
  return scorers;
}

export async function getScorerById(id: string): Promise<Scorer | null> {
  return await prisma.scorer.findUnique({
    where: { id },
  });
}

export async function createScorer(input: CreateScorerInput): Promise<Scorer> {
  return await prisma.scorer.create({
    data: {
      matchId: input.matchId,
      playerId: input.playerId,
      playerName: input.playerName,
      goalsCount: input.goalsCount,
      matchDate: input.matchDate,
      opponent: input.opponent,
    },
  });
}

export async function deleteScorer(id: string): Promise<Scorer> {
  return await prisma.scorer.delete({
    where: { id },
  });
}
