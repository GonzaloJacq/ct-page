"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Player } from "../../players/types";

interface DraggablePlayerProps {
  player: Player;
}

export function DraggablePlayer({ player }: DraggablePlayerProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: player.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md cursor-grab active:cursor-grabbing transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium">{player.name}</p>
          <p className="text-gray-400 text-sm">
           #{player.shirtNumber}
          </p>
        </div>
        <div className="text-2xl">⚽</div>
      </div>
    </div>
  );
}
