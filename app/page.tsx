import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import LogoSection from "@/app/components/home/LogoSection";
import MVPSection from "@/app/components/home/MVPSection";
import NextMatchSection from "@/app/components/home/NextMatchSection";
import PhotoGallery from "@/app/components/home/PhotoGallery";
import { getMatches } from "@/lib/db/matches";
import { getPlayers } from "@/lib/db/players";
import type { Match } from "@prisma/client";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (process.env.NEXTAUTH_SECRET && !session) {
    redirect("/auth/login");
  }

  // Fetch data
  const [matches, players] = await Promise.all([getMatches(), getPlayers()]);

  // Get next match
  const nextMatch =
    (matches
      .filter((m) => new Date(m.date) > new Date())
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0] as Match | undefined) ?? null;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Logo Section */}
        <LogoSection />

        {/* Stats Grid - MVP, Next Match, Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MVPSection mvpPlayer={players[0] || null} />
          <NextMatchSection nextMatch={nextMatch} />
        </div>

        {/* Photo Gallery */}
        <PhotoGallery />
      </div>
    </DashboardLayout>
  );
}