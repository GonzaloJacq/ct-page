import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all matches with goals info
    const matches = await prisma.match.findMany({
      select: {
        id: true,
        opponent: true,
        date: true,
        ourScorerIds: true,
        resultNosotros: true,
      },
      orderBy: { date: 'desc' },
    });

    // Get all scorers
    const scorers = await prisma.scorer.findMany({
      select: {
        id: true,
        matchId: true,
        playerId: true,
        playerName: true,
        goalsCount: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all players
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        matches,
        scorers,
        players,
        analysis: {
          totalMatches: matches.length,
          totalScorers: scorers.length,
          totalPlayers: players.length,
          scorersWithGoals: scorers.filter(s => s.goalsCount > 0).length,
          playersWithScorers: new Set(scorers.map(s => s.playerId)).size,
        }
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
