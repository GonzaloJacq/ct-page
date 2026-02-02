'use client';

import Link from 'next/link';
import { Plus, TrendingUp, Vote } from 'lucide-react';

export default function VotacionesHome() {
  const votacionOptions = [
    {
      title: 'Crear Votación',
      description: 'Crea una nueva votación general para el equipo',
      icon: Plus,
      href: '/features/votaciones/crear',
      color: 'from-blue-600 to-blue-400'
    },
    {
      title: 'Votaciones Generales',
      description: 'Participa en votaciones del equipo',
      icon: Vote,
      href: '/features/votaciones/generales',
      color: 'from-purple-600 to-purple-400'
    },
    {
      title: 'Votar MVP',
      description: 'Elige al MVP de los partidos jugados',
      icon: TrendingUp,
      href: '/features/votaciones/mvp',
      color: 'from-orange-600 to-orange-400'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl text-white font-display uppercase leading-none tracking-tight mb-2">
          Sistema de Votaciones
        </h1>
        <p className="text-foreground-muted text-lg">Gestiona y participa en votaciones del equipo</p>
      </div>

      {/* Votacion Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {votacionOptions.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="group dashboard-card hover:border-primary/50 flex flex-col justify-between h-48 relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <option.icon className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className={`w-12 h-12 bg-linear-to-br ${option.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                <option.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-medium text-white uppercase group-hover:translate-x-1 transition-transform">
                  {option.title}
                </h3>
                <p className="text-sm text-foreground-muted mt-1 font-sans">{option.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
