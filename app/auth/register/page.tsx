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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-gray-100 text-center mb-8">Registrarse</h1>

          {error && (
            <div className="mb-6 p-3 bg-red-900 border border-red-700 rounded text-red-100 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500 transition"
                placeholder="Tu nombre"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500 transition"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded transition"
            >
              {isLoading ? "Registrándose..." : "Registrarse"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
