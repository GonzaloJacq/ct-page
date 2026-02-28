import { PrismaClient } from '@prisma/client';
import { Match, CreateMatchInput, UpdateMatchInput } from '@/app/features/matches/types';

const prisma = new PrismaClient();

export async function getMatches(): Promise<Match[]> {
  const matches = await prisma.match.findMany({
    orderBy: { date: 'desc' },
  });
  return matches;
}

export async function getLatestMatchWithGallery(): Promise<{ galleryFolderId?: string | null } | null> {
  return await prisma.match.findFirst({
    where: { galleryFolderId: { not: null } },
    // choose the most recent match by date (chronological) that has a gallery
    orderBy: { date: 'desc' },
    select: { galleryFolderId: true },
  });
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
    galleryFolderId: input.galleryFolderId ?? null,
    playerIds: Array.from(input.playerIds),
    resultNosotros: input.resultNosotros ?? null,
    resultEllos: input.resultEllos ?? null,
    ourScorerIds: Array.from(input.ourScorerIds ?? []),
    yellowCardPlayerIds: Array.from(input.yellowCardPlayerIds ?? []),
    redCardPlayerIds: Array.from(input.redCardPlayerIds ?? []),
  };

  try {
    return await prisma.match.create({
      data,
    });
  } catch (e: any) {
    // if the migration hasn't been applied yet, the galleryFolderId column may not exist
    if (
      e?.message?.toLowerCase().includes('galleryfolderid') &&
      /does not exist/.test(e?.message)
    ) {
      // retry without the field
      const { galleryFolderId, ...rest } = data;
      return await prisma.match.create({ data: rest });
    }
    throw e;
  }
}

export async function updateMatch(id: string, input: UpdateMatchInput): Promise<Match> {
  const data: Record<string, unknown> = {};

  if (input.date !== undefined) data.date = input.date;
  if (input.opponent !== undefined) data.opponent = input.opponent;
  if (input.playerIds !== undefined) data.playerIds = Array.from(input.playerIds);
  if ('location' in input) data.location = input.location ?? null;
  if ('time' in input) data.time = input.time ?? null;
  if ('galleryFolderId' in input) data.galleryFolderId = input.galleryFolderId ?? null;
  if ('resultNosotros' in input) data.resultNosotros = input.resultNosotros ?? null;
  if ('resultEllos' in input) data.resultEllos = input.resultEllos ?? null;
  if ('ourScorerIds' in input) data.ourScorerIds = Array.from(input.ourScorerIds ?? []);
  if ('yellowCardPlayerIds' in input) data.yellowCardPlayerIds = Array.from(input.yellowCardPlayerIds ?? []);
  if ('redCardPlayerIds' in input) data.redCardPlayerIds = Array.from(input.redCardPlayerIds ?? []);

  try {
    return await prisma.match.update({
      where: { id },
      data,
    });
  } catch (e: any) {
    if (
      e?.message?.toLowerCase().includes('galleryfolderid') &&
      /does not exist/.test(e?.message)
    ) {
      const { galleryFolderId, ...rest } = data;
      return await prisma.match.update({ where: { id }, data: rest });
    }
    throw e;
  }
}

export async function deleteMatch(id: string): Promise<Match> {
  return await prisma.match.delete({
    where: { id },
  });
}
