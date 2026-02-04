'use client';

import { useSession } from 'next-auth/react';

export default function LogoSection() {
  const { data: session } = useSession();
  const accentColor = session?.user?.themeColor || '#C2185B';

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Logo rodeado del color seleccionado */}
      <div 
        className="relative w-40 h-40 rounded-full flex items-center justify-center p-1"
        style={{
          background: `conic-gradient(from 0deg, ${accentColor}, ${accentColor}20, ${accentColor})`
        }}
      >
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
          <img 
            src="/logo-ct.png" 
            alt="Logo CLAN TEAM" 
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Nombre del club */}
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight text-white">
          CLAN TEAM
        </h1>
        <p className="text-2xl md:text-3xl font-display text-primary mt-2 uppercase tracking-widest">
          Futbol Club
        </p>
      </div>
    </div>
  );
}
