import { getMatches } from "@/lib/db/matches";
import { getPlayers } from "@/lib/db/players";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import VotarMVP from "../components/VotarMVP";
import { MatchWithPlayers } from "../types";
import { getUserMVPVotes } from "@/lib/db/mvp-votes";
import { MVPVote } from "@prisma/client";

interface SessionWithId {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

async function getMatchesWithPlayers(): Promise<MatchWithPlayers[]> {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithId | null;
    const userId = session?.user?.id;

    const [matches, allPlayers, userVotes] = await Promise.all([
      getMatches(),
      getPlayers(),
      userId ? getUserMVPVotes(userId) : Promise.resolve([] as MVPVote[]),
    ]);

    // Map user votes by matchId for quick lookup
    const userVotesMap = new Map(
      userVotes.map((vote) => [vote.matchId, vote])
    );

    // Map all players by ID for quick lookup
    const playersMap = new Map(
      allPlayers.map((player) => [
        player.id,
        {
          id: player.id,
          name: player.name,
          number: player.shirtNumber,
          position: "Jugador",
        },
      ])
    );

    return matches.map((match) => {
      const userVote = userVotesMap.get(match.id);
      const votedPlayer = userVote ? playersMap.get(userVote.playerId) : null;

      return {
        id: match.id,
        title: match.opponent ? `vs ${match.opponent}` : "Partido",
        date: match.date,
        opponent: match.opponent,
        players: match.playerIds
          .map((id) => playersMap.get(id))
          .filter((player) => player !== undefined),
        userVote: userVote && votedPlayer ? {
          playerId: userVote.playerId,
          playerName: votedPlayer.name,
        } : undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

export default async function VotarMVPPage() {
  const matches = await getMatchesWithPlayers();

  return <VotarMVP matches={matches} />;
}
