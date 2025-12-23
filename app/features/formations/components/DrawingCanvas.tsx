"use client";

import { useRef, useEffect, useState } from "react";
import { DrawingPath } from "../types";

interface DrawingCanvasProps {
  width: number;
  height: number;
  drawings: DrawingPath[];
  onDrawingsChange: (drawings: DrawingPath[]) => void;
  isDrawingMode: boolean;
  drawingTool: 'line' | 'arrow' | 'eraser';
  drawingColor: string;
}

export function DrawingCanvas({
  width,
  height,
  drawings,
  onDrawingsChange,
  isDrawingMode,
  drawingTool,
  drawingColor,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width, height });

  // Update canvas size when container size changes
  useEffect(() => {
    setCanvasSize({ width, height });
  }, [width, height]);

  // Redraw all paths whenever drawings change or canvas size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw all saved paths
    drawings.forEach((path) => {
      drawPath(ctx, path);
    });
  }, [drawings, canvasSize.width, canvasSize.height]);

  const drawPath = (ctx: CanvasRenderingContext2D, path: DrawingPath) => {
    if (path.points.length < 2) return;

    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(path.points[0].x * canvasSize.width, path.points[0].y * canvasSize.height);

    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x * canvasSize.width, path.points[i].y * canvasSize.height);
    }

    ctx.stroke();

    // Draw arrow head if it's an arrow
    if (path.type === "arrow" && path.points.length >= 2) {
      const lastPoint = path.points[path.points.length - 1];
      const secondLastPoint = path.points[path.points.length - 2];
      
      const angle = Math.atan2(
        (lastPoint.y - secondLastPoint.y) * canvasSize.height,
        (lastPoint.x - secondLastPoint.x) * canvasSize.width
      );

      const headLength = 15;
      
      ctx.fillStyle = path.color;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x * canvasSize.width, lastPoint.y * canvasSize.height);
      ctx.lineTo(
        lastPoint.x * canvasSize.width - headLength * Math.cos(angle - Math.PI / 6),
        lastPoint.y * canvasSize.height - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        lastPoint.x * canvasSize.width - headLength * Math.cos(angle + Math.PI / 6),
        lastPoint.y * canvasSize.height - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;

    // If eraser tool is selected, find and remove the clicked drawing
    if (drawingTool === 'eraser') {
      const clickedDrawingIndex = findDrawingAtPoint(x, y);
      if (clickedDrawingIndex !== -1) {
        const newDrawings = drawings.filter((_, index) => index !== clickedDrawingIndex);
        onDrawingsChange(newDrawings);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  // Helper function to detect if a point is near a drawing path
  const findDrawingAtPoint = (x: number, y: number): number => {
    const threshold = 0.02; // 2% tolerance for clicking

    for (let i = drawings.length - 1; i >= 0; i--) {
      const drawing = drawings[i];
      
      // Check if click is near any segment of the path
      for (let j = 0; j < drawing.points.length - 1; j++) {
        const p1 = drawing.points[j];
        const p2 = drawing.points[j + 1];
        
        if (isPointNearLine(x, y, p1.x, p1.y, p2.x, p2.y, threshold)) {
          return i;
        }
      }
    }
    
    return -1;
  };

  // Calculate distance from point to line segment
  const isPointNearLine = (
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number,
    threshold: number
  ): boolean => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    
    if (lengthSquared === 0) {
      // Line segment is a point
      const dist = Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
      return dist < threshold;
    }
    
    // Calculate projection of point onto line
    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    
    const nearestX = x1 + t * dx;
    const nearestY = y1 + t * dy;
    
    const distance = Math.sqrt((px - nearestX) * (px - nearestX) + (py - nearestY) * (py - nearestY));
    return distance < threshold;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode || drawingTool === 'eraser') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;

    const newPath = [...currentPath, { x, y }];
    setCurrentPath(newPath);

    // Draw current path in real-time
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    // Redraw all saved paths
    drawings.forEach((path) => drawPath(ctx, path));

    // Draw current path (only for line and arrow)
    if (drawingTool === 'line' || drawingTool === 'arrow') {
      drawPath(ctx, {
        type: drawingTool,
        points: newPath,
        color: drawingColor,
        width: 3,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentPath.length < 2 || drawingTool === 'eraser') {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // Only create drawing for line and arrow tools
    if (drawingTool === 'line' || drawingTool === 'arrow') {
      const newDrawing: DrawingPath = {
        type: drawingTool,
        points: currentPath,
        color: drawingColor,
        width: 3,
      };

      onDrawingsChange([...drawings, newDrawing]);
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        cursor: isDrawingMode ? (drawingTool === 'eraser' ? 'pointer' : 'crosshair') : 'default'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
