import Link from "next/link";
import { redirect } from "next/navigation";
import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';
import type { IncomingMessage } from 'http';


export default async function Home() {
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn('NEXTAUTH_SECRET is not set — set it to avoid JWT decryption errors; continuing without redirect.');
  }

  try {
    // Only validate token if NEXTAUTH_SECRET is set (required for JWT decryption)
    // If not set, skip validation and render the page (session will come from client-side SessionProvider)
    if (process.env.NEXTAUTH_SECRET) {
      const h = await headers();
      const c = await cookies();

      const headerEntries = Array.from(h as unknown as Iterable<[string, string]>);
      const cookieEntries = c.getAll().map(item => [item.name, item.value]);

      const reqLike: { headers: Record<string, string>; cookies: Record<string, string> } = {
        headers: Object.fromEntries(headerEntries),
        cookies: Object.fromEntries(cookieEntries),
      };

      let token = null as null | Record<string, unknown>;
      try {
        token = await getToken({ req: reqLike as unknown as IncomingMessage & { cookies: Record<string, string> }, secret: process.env.NEXTAUTH_SECRET });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err || '');
        const isDecryptionError = msg.includes('decryption operation failed') || msg.includes('JWEDecryptionFailed') || msg.includes('JWT_SESSION_ERROR');
        if (isDecryptionError) {
          console.warn('Invalid auth cookie detected in Home — redirecting to login and avoiding getServerSession call.');
          redirect('/auth/login');
        }
      }

      if (!token) {
        redirect('/auth/login');
      }
    }
    // If NEXTAUTH_SECRET is not set, skip token validation and render the page
    // The session will be provided by SessionProvider on the client side
  } catch (err: unknown) {
    // Rethrow Next.js redirect to avoid logging it as an error.
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err;
    console.warn('Error while validating token for session:', err);
    redirect('/auth/login');
  }

  // Render the page - Header will show user info if authenticated via SessionProvider

  return (
    <div className="min-h-screen bg-gray-950">
   
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-5xl font-bold text-gray-100 mb-2">
            CLAN TEAM FC
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Sistema de Gestión Integral del Equipo
          </p>
          <p className="text-sm text-gray-500">
            Equipo de fútbol amateur de amigos
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Players Card */}
          <Link
            href="/features/players"
            className="bg-linear-to-br from-blue-900 to-blue-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 border border-blue-700"
          >
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-blue-100 mb-2">
              Gestión de Jugadores
            </h2>
            <p className="text-blue-300 mb-4">
              Administra el registro de jugadores, edades, teléfonos y números de camiseta
            </p>
            <span className="text-blue-400 font-semibold text-sm">Ir a Jugadores →</span>
          </Link>

          {/* Fees Card */}
          <Link
            href="/features/fees"
            className="bg-linear-to-br from-green-900 to-green-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 border border-green-700"
          >
            <div className="text-5xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-green-100 mb-2">
              Gestión de Cuotas
            </h2>
            <p className="text-green-300 mb-4">
              Controla el pago de cuotas mensuales de los jugadores
            </p>
            <span className="text-green-400 font-semibold text-sm">Ir a Cuotas →</span>
          </Link>

          {/* Matches Card */}
          <Link
            href="/features/matches"
            className="bg-linear-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 border border-purple-700"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-purple-100 mb-2">
              Historial de Partidos
            </h2>
            <p className="text-purple-300 mb-4">
              Registra partidos, rivales, jugadores participantes y resultados
            </p>
            <span className="text-purple-400 font-semibold text-sm">Ir a Partidos →</span>
          </Link>

          {/* Scorers Card */}
          <Link
            href="/features/scorers"
            className="bg-linear-to-br from-orange-900 to-orange-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 border border-orange-700"
          >
            <div className="text-5xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold text-orange-100 mb-2">
              Top Goleadores
            </h2>
            <p className="text-orange-300 mb-4">
              Estadísticas de goles por jugador y partido
            </p>
            <span className="text-orange-400 font-semibold text-sm">Ir a Goleadores →</span>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-gray-100 mb-6">
            Características del Sistema
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-100">Gestión Completa de Jugadores</h4>
                  <p className="text-gray-400 text-sm">Registro detallado con datos de contacto</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-100">Control de Cuotas</h4>
                  <p className="text-gray-400 text-sm">Seguimiento de pagos mensuales</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-100">Historial de Partidos</h4>
                  <p className="text-gray-400 text-sm">Registro de enfrentamientos y resultados</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-100">Estadísticas de Goles</h4>
                  <p className="text-gray-400 text-sm">Top goleadores ordenados por desempeño</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-100">Interfaz Intuitiva</h4>
                  <p className="text-gray-400 text-sm">Diseño minimalista en modo oscuro</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-100">Operaciones CRUD</h4>
                  <p className="text-gray-400 text-sm">Crear, leer, actualizar y eliminar datos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>CLAN TEAM FC © 2025 - Sistema de Gestión de Equipos de Fútbol Amateur</p>
        </div>
      </div>
    </div>
  );
}
