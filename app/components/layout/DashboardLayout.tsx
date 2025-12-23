'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar className="w-full h-full" />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-950 shadow-2xl border-r border-slate-800 transform transition-transform">
             <div className="absolute top-4 right-4 z-50">
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
}
