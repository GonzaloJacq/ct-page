import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import {
  createOrUpdateMVPVote,
  getUserMVPVoteForMatch,
} from "@/lib/db/mvp-votes";

interface SessionWithId extends Session {
  user: Session["user"] & {
    id: string;
  };
}

interface CreateVoteRequestBody {
  matchId: string;
  playerId: string;
}

/**
 * POST /api/mvp-votes
 * Crear o actualizar un voto de MVP
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithId | null;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateVoteRequestBody = await request.json();
    const { matchId, playerId } = body;

    if (!matchId || !playerId) {
      return NextResponse.json(
        { error: "Missing matchId or playerId" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    const vote = await createOrUpdateMVPVote({
      userId,
      matchId,
      playerId,
    });

    return NextResponse.json(vote);
  } catch (error) {
    console.error("Error creating MVP vote:", error);
    return NextResponse.json(
      { error: "Failed to create vote" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mvp-votes?matchId=xxx
 * Obtener el voto actual del usuario para un partido
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithId | null;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
    }

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    const vote = await getUserMVPVoteForMatch(userId, matchId);

    return NextResponse.json(vote);
  } catch (error) {
    console.error("Error fetching MVP vote:", error);
    return NextResponse.json(
      { error: "Failed to fetch vote" },
      { status: 500 }
    );
  }
}
