"use client";

import { useState, useRef } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { Player } from "../../players/types";
import { FormationData, FormationPlayerData, DrawingPath } from "../types";
import { DraggablePlayer } from "./DragablePlayer";
import { DroppedPlayer } from "./DroppedPlayer";
import { DrawingCanvas } from "./DrawingCanvas";


interface FormationBuilderProps {
  players: Player[];
  initialFormation?: {
    id: string;
    name: string;
    formationData: FormationData;
  } | null;
  onSave: (name: string, formationData: FormationData) => void;
  onCancel: () => void;
}

export function FormationBuilder({
  players,
  initialFormation,
  onSave,
  onCancel,
}: FormationBuilderProps) {
  const [formationName, setFormationName] = useState(initialFormation?.name || "");
  const [droppedPlayers, setDroppedPlayers] = useState<FormationPlayerData>(
    initialFormation?.formationData?.players || {}
  );
  const [drawings, setDrawings] = useState<DrawingPath[]>(
    initialFormation?.formationData?.drawings || []
  );
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'line' | 'arrow' | 'eraser'>('line');
  const [drawingColor, setDrawingColor] = useState('#FFFFFF');
  const fieldRef = useRef<HTMLDivElement>(null);

  const availablePlayers = players.filter((p) => !droppedPlayers[p.id]);
  const playersOnField = players.filter((p) => droppedPlayers[p.id]);

  const handleDragStart = (event: DragStartEvent) => {
    if (isDrawingMode) return;
    const player = players.find((p) => p.id === event.active.id);
    setActivePlayer(player || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null);
    
    if (!fieldRef.current || isDrawingMode) return;

    const fieldRect = fieldRef.current.getBoundingClientRect();
    const { x: deltaX, y: deltaY } = event.delta;

    // Si es un jugador nuevo desde el sidebar
    if (!droppedPlayers[event.active.id as string]) {
      const dropX = event.active.rect.current.translated?.left || 0;
      const dropY = event.active.rect.current.translated?.top || 0;

      // Verificar si se soltó dentro de la cancha
      if (
        dropX >= fieldRect.left &&
        dropX <= fieldRect.right &&
        dropY >= fieldRect.top &&
        dropY <= fieldRect.bottom
      ) {
        const relativeX = ((dropX - fieldRect.left) / fieldRect.width) * 100;
        const relativeY = ((dropY - fieldRect.top) / fieldRect.height) * 100;

        setDroppedPlayers({
          ...droppedPlayers,
          [event.active.id]: {
            x: Math.max(0, Math.min(100, relativeX)),
            y: Math.max(0, Math.min(100, relativeY)),
          },
        });
      }
    } else {
      // Mover un jugador ya existente en la cancha
      const currentPos = droppedPlayers[event.active.id as string];
      const newX = currentPos.x + (deltaX / fieldRect.width) * 100;
      const newY = currentPos.y + (deltaY / fieldRect.height) * 100;

      setDroppedPlayers({
        ...droppedPlayers,
        [event.active.id]: {
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY)),
        },
      });
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    const newDropped = { ...droppedPlayers };
    delete newDropped[playerId];
    setDroppedPlayers(newDropped);
  };

  const handleSave = () => {
    if (!formationName.trim()) {
      alert("Por favor ingresa un nombre para la formación");
      return;
    }
    if (Object.keys(droppedPlayers).length === 0) {
      alert("Agrega al menos un jugador a la formación");
      return;
    }
    
    const formationData: FormationData = {
      players: droppedPlayers,
      drawings: drawings.length > 0 ? drawings : undefined,
    };
    
    onSave(formationName, formationData);
  };

  const clearDrawings = () => {
    console.log('Clearing drawings only');
    setDrawings([]);
  };

  const clearAll = () => {
    console.log('clearAll called, players:', Object.keys(droppedPlayers).length, 'drawings:', drawings.length);
    if (confirm(`¿Estás seguro de borrar TODO? (${Object.keys(droppedPlayers).length} jugadores y ${drawings.length} dibujos)`)) {
      console.log('User confirmed, clearing everything');
      setDroppedPlayers({});
      setDrawings([]);
    } else {
      console.log('User cancelled');
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar con jugadores disponibles */}
        <div className="col-span-3 bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-bold text-gray-100 mb-4">
            Jugadores Disponibles
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {availablePlayers.map((player) => (
              <DraggablePlayer key={player.id} player={player} />
            ))}
            {availablePlayers.length === 0 && (
              <p className="text-gray-500 text-sm">No hay jugadores disponibles</p>
            )}
          </div>
        </div>

        {/* Cancha */}
        <div className="col-span-9">
          <div className="mb-4">
            <input
              type="text"
              value={formationName}
              onChange={(e) => setFormationName(e.target.value)}
              placeholder="Nombre de la formación (ej: 4-3-3)"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500"
            />
          </div>

          {/* Drawing Tools */}
          <div className="mb-4 flex items-center gap-4 bg-gray-900 p-3 rounded-lg">
            <button
              onClick={() => setIsDrawingMode(!isDrawingMode)}
              className={`px-4 py-2 rounded-md transition ${
                isDrawingMode
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {isDrawingMode ? "✏️ Dibujando" : "🖊️ Modo Dibujo"}
            </button>

            {isDrawingMode && (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDrawingTool('line')}
                    className={`px-3 py-2 rounded-md transition ${
                      drawingTool === 'line'
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    title="Línea"
                  >
                    ━
                  </button>
                  <button
                    onClick={() => setDrawingTool('arrow')}
                    className={`px-3 py-2 rounded-md transition ${
                      drawingTool === 'arrow'
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    title="Flecha"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setDrawingTool('eraser')}
                    className={`px-3 py-2 rounded-md transition ${
                      drawingTool === 'eraser'
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    title="Goma de borrar"
                  >
                    🧽
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-gray-300 text-sm">Color:</label>
                  <input
                    type="color"
                    value={drawingColor}
                    onChange={(e) => setDrawingColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearDrawings}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={drawings.length === 0}
                    title={drawings.length === 0 ? "No hay dibujos para limpiar" : "Limpiar solo los dibujos"}
                  >
                    🧹 Limpiar
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Object.keys(droppedPlayers).length === 0 && drawings.length === 0}
                    title="Borrar jugadores y dibujos"
                  >
                    🗑️ Borrar Todo
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            ref={fieldRef}
            className="relative w-full aspect-[2/3] bg-green-700 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20% 20%, 20% 20%, 100% 100%, 100% 100%",
              backgroundPosition: "0 0, 0 0, 0 0, 0 0",
            }}
          >
            {/* Líneas de la cancha */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50" />
              <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/50" />
              <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-white/50" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/50 -translate-y-1/2" />
              
              {/* Círculo central */}
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <img src="/logo-ct.png" alt="Field Logo" className="w-16 h-16 object-contain opacity-20" />
              </div>
              
              {/* Áreas */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[15%] border-2 border-white/50 border-t-0" />
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[15%] border-2 border-white/50 border-b-0" />
            </div>

            {/* Drawing Canvas - non-interactive, just for display */}
            {fieldRef.current && (
              <DrawingCanvas
                width={fieldRef.current.offsetWidth}
                height={fieldRef.current.offsetHeight}
                drawings={drawings}
                onDrawingsChange={setDrawings}
                isDrawingMode={isDrawingMode}
                drawingTool={drawingTool}
                drawingColor={drawingColor}
              />
            )}

            {/* Jugadores en la cancha - rendered with high z-index so they're always on top */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {playersOnField.map((player) => (
                <DroppedPlayer
                  key={player.id}
                  player={player}
                  position={droppedPlayers[player.id]}
                  onRemove={() => handleRemovePlayer(player.id)}
                />
              ))}
            </div>

            {/* Invisible overlay for drawing - uses lower z-index but pointer-events to not block players */}
            {isDrawingMode && fieldRef.current && (
              <div 
                className="absolute inset-0 z-10"
                style={{ 
                  cursor: drawingTool === 'eraser' ? 'pointer' : 'crosshair',
                  // Only capture pointer events when not dragging
                  pointerEvents: activePlayer ? 'none' : 'auto'
                }}
                onMouseDown={(e) => {
                  // Forward event to canvas for drawing
                  const canvas = fieldRef.current?.querySelector('canvas');
                  if (canvas) {
                    const mouseEvent = new MouseEvent('mousedown', {
                      clientX: e.clientX,
                      clientY: e.clientY,
                      bubbles: true
                    });
                    canvas.dispatchEvent(mouseEvent);
                  }
                }}
                onMouseMove={(e) => {
                  const canvas = fieldRef.current?.querySelector('canvas');
                  if (canvas) {
                    const mouseEvent = new MouseEvent('mousemove', {
                      clientX: e.clientX,
                      clientY: e.clientY,
                      bubbles: true
                    });
                    canvas.dispatchEvent(mouseEvent);
                  }
                }}
                onMouseUp={(e) => {
                  const canvas = fieldRef.current?.querySelector('canvas');
                  if (canvas) {
                    const mouseEvent = new MouseEvent('mouseup', {
                      clientX: e.clientX,
                      clientY: e.clientY,
                      bubbles: true
                    });
                    canvas.dispatchEvent(mouseEvent);
                  }
                }}
              />
            )}

            {/* Overlay para el drag */}
            <DragOverlay>
              {activePlayer && (
                <div className="bg-primary text-white px-3 py-2 rounded-md shadow-lg cursor-grabbing">
                  {activePlayer.name}
                </div>
              )}
            </DragOverlay>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Guardar Formación
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );
}