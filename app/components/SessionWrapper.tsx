"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import type { Session } from "next-auth";

function SessionRefresher() {
  useEffect(() => {
    // Hacer refresh de la sesión cada 5 minutos si hay actividad
    // NextAuth maneja automáticamente la renovación si updateAge está configurado
    const interval = setInterval(async () => {
      try {
        // Simplemente hacer una llamada para mantener la sesión activa
        // NextAuth renovará automáticamente si es necesario
        await fetch('/api/auth/session');
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    }, 5 * 60 * 1000); // Cada 5 minutos

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function SessionWrapper({ 
  children, 
  session 
}: { 
  children: React.ReactNode; 
  session?: Session | null; 
}) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // Revalidar sesión cada 5 minutos (en segundos)
      refetchOnWindowFocus={true} // Revalidar cuando vuelve el foco a la ventana
      refetchWhenOffline={false} // Revalidar cuando se reconecta a internet
    >
      <SessionRefresher />
      {children}
    </SessionProvider>
  );
}
