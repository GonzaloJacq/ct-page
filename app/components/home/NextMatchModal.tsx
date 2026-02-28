"use client";

import { useState } from "react";
import { Match } from "@prisma/client";
import NextMatchSection from "./NextMatchSection";
import { X } from "lucide-react";

interface NextMatchModalProps {
  nextMatch?: Match | null;
  onClose?: () => void;
}

export default function NextMatchModal({ nextMatch, onClose }: NextMatchModalProps) {
  const [open, setOpen] = useState(Boolean(nextMatch));

  if (!nextMatch || !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setOpen(false);
            onClose?.();
          }}
          className="absolute right-0 top-0 p-2 text-white hover:text-primary"
        >
          <X className="w-6 h-6" />
        </button>
        <NextMatchSection nextMatch={nextMatch} />
      </div>
    </div>
  );
}
