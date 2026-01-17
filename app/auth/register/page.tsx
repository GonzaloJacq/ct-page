"use client";

import { useState } from "react";
// Using dynamic import for SweetAlert2 so builds don't fail if dependency isn't installed
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrarse");
        try {
          // @ts-ignore - optional dependency: sweetalert2 may not be installed in some environments
          const _Swal = (await import('sweetalert2')).default;
          _Swal.fire({ title: 'Error', text: data.error || 'Error al registrarse', icon: 'error' });
        } catch {
          alert(data.error || 'Error al registrarse');
        }
        return;
      }

      try {
        // @ts-ignore - optional dependency: sweetalert2 may not be installed in some environments
        const _Swal = (await import('sweetalert2')).default;
        _Swal.fire({ title: 'Registrado', text: 'Registro exitoso, inicia sesión', icon: 'success', timer: 1600, showConfirmButton: false });
      } catch {
        alert('Registro exitoso, inicia sesión');
      }
      router.push("/auth/login");
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="dashboard-card shadow-2xl shadow-primary/10">
          <h1 className="text-4xl font-bold text-white font-display text-center mb-8 uppercase tracking-wide">Registrarse</h1>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Tu nombre"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">Email</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">Contraseña</label>
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground-muted mb-2 font-display uppercase tracking-wider">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg mt-2"
            >
              {isLoading ? "Registrándose..." : "Registrarse"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-foreground-muted text-sm font-sans">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-primary hover:text-white font-medium transition-colors">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
