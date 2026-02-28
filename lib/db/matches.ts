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
  const data: any = {
    date: input.date,
    opponent: input.opponent,
    location: input.location ?? null,
    time: input.time ?? null,
    playerIds: Array.from(input.playerIds),
    resultNosotros: input.resultNosotros ?? null,
    resultEllos: input.resultEllos ?? null,
    ourScorerIds: Array.from(input.ourScorerIds ?? []),
    yellowCardPlayerIds: Array.from(input.yellowCardPlayerIds ?? []),
    redCardPlayerIds: Array.from(input.redCardPlayerIds ?? []),
  };

  return await prisma.match.create({
    data,
  });
}

export async function updateMatch(id: string, input: UpdateMatchInput): Promise<Match> {
  const data: Record<string, unknown> = {};

  if (input.date !== undefined) data.date = input.date;
  if (input.opponent !== undefined) data.opponent = input.opponent;
  if (input.playerIds !== undefined) data.playerIds = Array.from(input.playerIds);
  if ('location' in input) data.location = input.location ?? null;
  if ('time' in input) data.time = input.time ?? null;
  if ('resultNosotros' in input) data.resultNosotros = input.resultNosotros ?? null;
  if ('resultEllos' in input) data.resultEllos = input.resultEllos ?? null;
  if ('ourScorerIds' in input) data.ourScorerIds = Array.from(input.ourScorerIds ?? []);
  if ('yellowCardPlayerIds' in input) data.yellowCardPlayerIds = Array.from(input.yellowCardPlayerIds ?? []);
  if ('redCardPlayerIds' in input) data.redCardPlayerIds = Array.from(input.redCardPlayerIds ?? []);

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
