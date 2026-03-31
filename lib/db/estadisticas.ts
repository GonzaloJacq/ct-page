import { PrismaClient } from '@prisma/client';
import { Estadistica, CreateEstadisticaInput, UpdateEstadisticaInput } from '@/app/features/estadisticas/types';

const prisma = new PrismaClient();

export async function getEstadisticas(): Promise<Estadistica[]> {
  // Get all matches to calculate goals, cards, and matches played
  const matches = await prisma.match.findMany({
    select: {
      ourScorerIds: true,
      yellowCardPlayerIds: true,
      redCardPlayerIds: true,
      playerIds: true,
    },
  });

  console.log('Matches:', matches.length);

  // Aggregate goals, cards, and matches played
  const playerStats: Record<string, { goals: number; yellow: number; red: number; matches: number; mvps: number }> = {};

  matches.forEach(match => {
    // Count matches played for each player in the match
    match.playerIds.forEach((playerId) => {
      if (!playerStats[playerId]) playerStats[playerId] = { goals: 0, yellow: 0, red: 0, matches: 0, mvps: 0 };
      playerStats[playerId].matches++;
    });

    // Count goals - each entry in ourScorerIds is one goal
    match.ourScorerIds.forEach(playerId => {
      if (!playerStats[playerId]) playerStats[playerId] = { goals: 0, yellow: 0, red: 0, matches: 0, mvps: 0 };
      playerStats[playerId].goals++;
    });

    // Count yellow cards
    match.yellowCardPlayerIds.forEach(playerId => {
      if (!playerStats[playerId]) playerStats[playerId] = { goals: 0, yellow: 0, red: 0, matches: 0, mvps: 0 };
      playerStats[playerId].yellow++;
    });

    // Count red cards
    match.redCardPlayerIds.forEach(playerId => {
      if (!playerStats[playerId]) playerStats[playerId] = { goals: 0, yellow: 0, red: 0, matches: 0, mvps: 0 };
      playerStats[playerId].red++;
    });
  });

  console.log('Player stats keys:', Object.keys(playerStats).length);
  console.log('Player stats:', playerStats);

  // Get MVP totals by player
  const mvpVoteCounts = await prisma.mVPVote.groupBy({
    by: ['playerId'],
    _count: {
      playerId: true,
    },
  });

  mvpVoteCounts.forEach((entry) => {
    if (!playerStats[entry.playerId]) {
      playerStats[entry.playerId] = { goals: 0, yellow: 0, red: 0, matches: 0, mvps: 0 };
    }
    playerStats[entry.playerId].mvps = entry._count.playerId;
  });

  // Get all player IDs that have any stats
  const playerIds = Object.keys(playerStats);

  // Get player names
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    select: { id: true, name: true },
  });

  const playerMap = new Map(players.map(p => [p.id, p.name]));

  // Combine
  const estadisticas: Estadistica[] = playerIds.map(playerId => ({
    playerId,
    playerName: playerMap.get(playerId) || 'Unknown',
    totalGoals: playerStats[playerId].goals,
    totalYellowCards: playerStats[playerId].yellow,
    totalRedCards: playerStats[playerId].red,
    totalMatches: playerStats[playerId].matches || 0,
    totalMVPs: playerStats[playerId].mvps || 0,
  }));

  console.log('Final estadisticas:', estadisticas);

  // Sort by total MVPs desc, then total goals, then yellow, then red
  return estadisticas.sort(
    (a, b) =>
      b.totalMVPs - a.totalMVPs ||
      b.totalGoals - a.totalGoals ||
      b.totalYellowCards - a.totalYellowCards ||
      b.totalRedCards - a.totalRedCards,
  );
}

export async function getEstadisticaById(id: string): Promise<Estadistica | null> {
  // Since Estadistica is aggregated, this might not make sense, but keep for compatibility
  return null;
}

export async function createEstadistica(input: CreateEstadisticaInput): Promise<any> {
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
export async function updateEstadistica(id: string, input: UpdateEstadisticaInput): Promise<any> {
  return await prisma.scorer.update({
    where: { id },
    data: input,
  });
}

export async function deleteEstadistica(id: string): Promise<any> {
  return await prisma.scorer.delete({
    where: { id },
  });
}
