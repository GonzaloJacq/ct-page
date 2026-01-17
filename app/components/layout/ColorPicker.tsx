'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PRESET_COLORS = [
  '#C2185B', // Default Magenta
  '#E11D48', // Rose
  '#DB2777', // Pink
  '#9333EA', // Purple
  '#7C3AED', // Violet
  '#4F46E5', // Indigo
  '#2563EB', // Blue
  '#0284C7', // Sky
  '#059669', // Emerald
  '#16A34A', // Green
  '#D97706', // Amber
  '#EA580C', // Orange
];

export default function ColorPicker() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleColorSelect = async (color: string) => {
    setLoading(true);
    try {
      // 1. Update CSS variable immediately for responsiveness
      document.documentElement.style.setProperty('--primary', color);
      
      // 2. Persist to DB
      const res = await fetch('/api/user/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeColor: color }),
      });

      if (res.ok) {
        // 3. Update session to persist across navigation
        await update({ themeColor: color });
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save color:', error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const currentColor = session?.user?.themeColor || '#C2185B';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors relative group"
        title="Cambiar color de tema"
      >
        <Palette className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full border border-background" style={{ backgroundColor: currentColor }} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 p-4 bg-background border border-white/10 rounded-xl shadow-xl w-64 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-sm font-display text-white mb-3 uppercase tracking-wider">Color de Énfasis</h3>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={loading}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 relative"
                  style={{ backgroundColor: color }}
                >
                  {currentColor === color && (
                    <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/10">
               <label className="text-xs text-foreground-muted mb-2 block">Personalizado</label>
               <input 
                 type="color" 
                 value={currentColor}
                 onChange={(e) => {
                    document.documentElement.style.setProperty('--primary', e.target.value);
                 }}
                 onBlur={(e) => handleColorSelect(e.target.value)}
                 className="w-full h-8 cursor-pointer rounded bg-transparent"
               />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
