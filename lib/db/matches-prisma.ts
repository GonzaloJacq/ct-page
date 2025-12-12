import { PrismaClient } from '@prisma/client';
import { Match, CreateMatchInput, UpdateMatchInput } from '@/app/features/matches/types';

const prisma = new PrismaClient();

export async function getMatches(): Promise<Match[]> {
  const matches = await prisma.match.findMany({
    orderBy: { date: 'desc' },
  });
  return matches;
}

export async function getMatchById(id: string): Promise<Match | null> {
  return await prisma.match.findUnique({
    where: { id },
  });
}

export async function createMatch(input: CreateMatchInput): Promise<Match> {
  return await prisma.match.create({
    data: {
      date: input.date,
      opponent: input.opponent,
      playerIds: Array.from(input.playerIds),
      result: input.result ?? null,
    },
  });
}

export async function updateMatch(id: string, input: UpdateMatchInput): Promise<Match> {
  const data: Record<string, unknown> = {};

  if (input.date !== undefined) data.date = input.date;
  if (input.opponent !== undefined) data.opponent = input.opponent;
  if (input.playerIds !== undefined) data.playerIds = Array.from(input.playerIds);
  if ('result' in input) data.result = input.result ?? null;

  return await prisma.match.update({
    where: { id },
    data,
  });
}

export async function deleteMatch(id: string): Promise<Match> {
  return await prisma.match.delete({
    where: { id },
  });
}
