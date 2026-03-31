import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import LogoSection from "@/app/components/home/LogoSection";
import MVPSection from "@/app/components/home/MVPSection";
import NextMatchSection from "@/app/components/home/NextMatchSection";
import NextMatchModal from "@/app/components/home/NextMatchModal";
import PhotoGallery from "@/app/components/home/PhotoGallery";
import { getMatches } from "@/lib/db/matches";
import { getPlayers } from "@/lib/db/players";
import {
  getMatchMVPVoteCounts,
  getUserMVPVoteForMatch,
  getAllMVPVoteCounts,
} from "@/lib/db/mvp-votes";
import MVPVoteNotification from "@/app/components/home/MVPVoteNotification";
import type { Match, Player } from "@prisma/client";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (process.env.NEXTAUTH_SECRET && !session) {
    redirect("/auth/login");
  }

  // Fetch data
  const [matches, players] = await Promise.all([getMatches(), getPlayers()]);

  // Get next match (future)
  const now = new Date();
  const nextMatch =
    (matches
      .filter((m) => new Date(m.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] as Match | undefined) ?? null;

  // determine MVP: choose most recent past match that ended at least 24h ago
  const pastMatch =
    (matches
      .filter((m) => new Date(m.date).getTime() < now.getTime() - 24 * 60 * 60 * 1000)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] as Match | undefined) ?? null;

  let mvpPlayer: Player | null = null;
  if (pastMatch) {
    const voteCounts = await getMatchMVPVoteCounts(pastMatch.id);
    if (voteCounts.length > 0) {
      // get top voted player id
      voteCounts.sort((a, b) => b.voteCount - a.voteCount);
      const winnerId = voteCounts[0].playerId;
      const winner = players.find((p) => p.id === winnerId);
      if (winner) mvpPlayer = winner;
    }
  }

  if (!mvpPlayer) {
    const globalVoteCounts = await getAllMVPVoteCounts();
    if (globalVoteCounts.length > 0) {
      globalVoteCounts.sort((a, b) => b.voteCount - a.voteCount);
      const winnerId = globalVoteCounts[0].playerId;
      const winner = players.find((p) => p.id === winnerId);
      if (winner) mvpPlayer = winner;
    }
  }

  let activeMVPMatch: Match | null = null;
  if (session?.user?.playerId && session.user.name) {
    const userPlayerId = session.user.playerId;
    const lastPlayedMatch =
      (matches
        .filter(
          (m) =>
            new Date(m.date).getTime() < now.getTime() &&
            m.playerIds.includes(userPlayerId),
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] as Match | undefined) ?? null;

    if (lastPlayedMatch) {
      const voteDeadline = new Date(lastPlayedMatch.date);
      voteDeadline.setDate(voteDeadline.getDate() + 7); // 7-day voting window

      if (now <= voteDeadline) {
        const existingVote = await getUserMVPVoteForMatch(
          session.user.id,
          lastPlayedMatch.id,
        );
        if (!existingVote) {
          activeMVPMatch = lastPlayedMatch;
        }
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Logo Section */}
        <LogoSection />

        {activeMVPMatch && <MVPVoteNotification match={activeMVPMatch} />}

        {/* Stats Grid - MVP, Next Match, Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MVPSection mvpPlayer={mvpPlayer} />
          <NextMatchSection nextMatch={nextMatch} />
          <NextMatchModal nextMatch={nextMatch} />
        </div>

        {/* Photo Gallery (client) - will fetch /api/matches/latest-gallery */}
        <PhotoGallery />
      </div>
    </DashboardLayout>
  );
}