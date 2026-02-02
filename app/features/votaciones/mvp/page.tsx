import { getMatches } from "@/lib/db/matches";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import VotarMVP from "../components/VotarMVP";
import { MatchWithPlayers } from "../types";

async function getMatchesWithPlayers(): Promise<MatchWithPlayers[]> {
  try {
    const matches = await getMatches();

    // Mock data: In a real app, you would fetch players for each match from your database
    return matches.map((match) => ({
      id: match.id,
      title: match.opponent ? `vs ${match.opponent}` : "Partido",
      date: match.date,
      opponent: match.opponent,
      players: [], // This will be populated from match data
    }));
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

export default async function VotarMVPPage() {
  const matches = await getMatchesWithPlayers();

  return <VotarMVP matches={matches} />;
}
