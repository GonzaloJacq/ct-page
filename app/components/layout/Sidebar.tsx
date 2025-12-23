'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users,
  Trophy, 
  Banknote, 
  TrendingUp,
  LogOut,
  Shirt
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Jugadores', href: '/features/players', icon: Users },
  { name: 'Formaciones', href: '/features/formations', icon: Shirt },
  { name: 'Partidos', href: '/features/matches', icon: Trophy },
  { name: 'Goleadores', href: '/features/scorers', icon: TrendingUp },
  { name: 'Cuotas', href: '/features/fees', icon: Banknote },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = '', onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`flex flex-col h-full bg-slate-950 border-r border-slate-800 ${className}`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
          <img src="/logo-ct.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl text-white tracking-wider">
            CLAN TEAM
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600/10 text-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-white'
                }`}
              />
              <span className="font-medium text-sm">{item.name}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          onClick={() => {
            signOut({ callbackUrl: '/auth/login' });
            if (onClose) onClose();
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
