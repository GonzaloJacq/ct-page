"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { Match } from "@prisma/client";

interface MVPVoteNotificationProps {
  match: Match;
}

export default function MVPVoteNotification({ match }: MVPVoteNotificationProps) {
  return (
    <div className="dashboard-card border-yellow-400/20 bg-yellow-500/10">
      <div className="flex items-start gap-3">
        <Megaphone className="w-5 h-5 text-yellow-300 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-display font-bold text-yellow-200">
            Votación MVP disponible
          </h3>
          <p className="text-sm text-foreground-muted">
            Hay una votación activa para el partido <strong>{match.opponent}</strong> del {new Date(match.date).toLocaleDateString("es-ES")}. Si estuviste convocado, puedes elegir tu MVP.
          </p>
          <Link
            href="/features/votaciones/mvp"
            className="inline-flex mt-3 px-4 py-2 rounded-lg bg-yellow-500 text-foreground font-medium hover:brightness-110 transition"
          >
            Ir a votar MVP
          </Link>
        </div>
      </div>
    </div>
  );
}
