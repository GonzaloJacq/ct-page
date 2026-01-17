'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export const Navbar = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo-ct.png" alt="CT Logo" className="w-10 h-10 object-contain" />
            <span className="text-white font-bold hidden sm:inline">CLAN TEAM FC</span>
          </Link>

          {/* Navegación Central */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link href="/features/players" className="text-gray-300 hover:text-white transition">
              Jugadores
            </Link>
            <Link href="/features/fees" className="text-gray-300 hover:text-white transition">
              Cuotas
            </Link>
            <Link href="/features/matches" className="text-gray-300 hover:text-white transition">
              Partidos
            </Link>
            <Link href="/features/scorers" className="text-gray-300 hover:text-white transition">
              Goleadores
            </Link>
            <Link href="/features/formations" className="text-gray-300 hover:text-white transition">
              Formaciones
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-300 text-sm hidden sm:inline">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              Home
            </Link>
            <Link
              href="/features/players"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              Jugadores
            </Link>
            <Link
              href="/features/fees"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              Cuotas
            </Link>
            <Link
              href="/features/matches"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              Partidos
            </Link>
            <Link
              href="/features/scorers"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              Goleadores
            </Link>
            <Link
              href="/features/formations"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              Formaciones
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
