"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Player } from "../../players/types";

interface DroppedPlayerProps {
  player: Player;
  position: { x: number; y: number };
  onRemove: () => void;
}

export function DroppedPlayer({ player, position, onRemove }: DroppedPlayerProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: player.id,
  });

  const style = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
      data-player-draggable="true"
    >
      <div className="relative">
        {/* Botón de eliminar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition z-10 flex items-center justify-center"
          title="Eliminar jugador"
        >
          ×
        </button>

        {/* Jugador */}
        <div 
          className="bg-primary text-white px-4 py-2 rounded-full shadow-lg cursor-grab active:cursor-grabbing border-2 border-white"
          {...listeners}
          {...attributes}
        >
          <div className="text-center">
            <p className="font-bold text-sm">{player.shirtNumber}</p>
            <p className="text-xs whitespace-nowrap">{player.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}