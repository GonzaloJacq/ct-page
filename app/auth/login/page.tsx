"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Verify server-side session - sometimes cookies or env cause server to not see cookie
        try {
          const sres = await fetch('/api/auth/session');
          if (sres.ok) {
            const sessionData = await sres.json();
            if (sessionData?.user) {
              router.push('/');
              return;
            }
          }
        } catch (e) {
          // ignore
        }
        setError('No se pudo verificar la sesión en el servidor. Intenta limpiar cookies (botón abajo) o reinicia la aplicación.');
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 has-[.bg-radial]:bg-radial">
      <div className="w-full max-w-md">
        <div className="dashboard-card shadow-2xl shadow-primary/10">
          <div className="flex justify-center mb-6">
            <img src="/logo-ct.png" alt="Clan Team FC Logo" className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(194,24,91,0.5)]" />
          </div>
          <h1 className="text-4xl font-bold font-display text-white text-center mb-8 tracking-wide">
            CLAN TEAM FC
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg"
            >
              {isLoading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-foreground-muted text-sm font-sans">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-primary hover:text-white font-medium transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
