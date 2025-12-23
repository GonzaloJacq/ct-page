'use client';

import { useSession } from 'next-auth/react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 h-16 w-full glass-panel border-b-0 border-x-0 border-t-0 border-b border-slate-800/50">
      <div className="flex justify-between items-center h-full px-4 md:px-8">
        {/* Left: Mobile Menu & Current Page */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:block">
            {/* We could add dynamic breadcrumbs here later */}
            <span className="text-slate-500 text-sm font-medium">Panel de Control</span>
          </div>
        </div>

        {/* Right: User User & Action */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-800 mx-1" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {session?.user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-slate-500">
                {session?.user?.role === 'admin' ? 'Administrador' : 'Entrenador'}
              </p>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-slate-900">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
