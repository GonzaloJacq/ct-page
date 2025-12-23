import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth/auth";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import { Users, Shirt, Trophy, ArrowRight, UserPlus, FileEdit, BarChart2 } from "lucide-react";
import { getPlayers } from "@/lib/db/players";
import { getFormations } from "@/lib/db/formations";
import { GoalsChart, MatchesTrend, PlayerStatsPie } from "@/app/components/dashboard/StatsChart";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (process.env.NEXTAUTH_SECRET && !session) {
    redirect('/auth/login');
  }

  // Fetch real data
  const [players, formations] = await Promise.all([
    getPlayers(),
    getFormations(),
  ]);

  // Quick Stats Mock Data (In a real app, we would fetch these serverside via Prisma)
  const stats = [
    { label: "Jugadores Activos", value: players.length.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Formaciones", value: formations.length.toString(), icon: Shirt, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Próximo Partido", value: "Sin programar", icon: Trophy, color: "text-slate-500", bg: "bg-slate-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl text-white font-display mb-1">
              HOLA, {session?.user?.name?.toUpperCase() || 'ENTRENADOR'}
            </h1>
            <p className="text-slate-400">Aquí tienes el resumen de tu equipo hoy.</p>
          </div>
          <div className="text-sm text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-card flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div>
          <h2 className="text-xl text-white font-display mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            Analítica de Rendimiento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Goals Chart */}
            <div className="dashboard-card md:col-span-2">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Goles por Partido (Últimos 5)</h3>
              <GoalsChart data={[]} />
            </div>

            {/* Pie Chart */}
            <div className="dashboard-card">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Distribución de Plantilla</h3>
              <PlayerStatsPie data={[]} />
            </div>

            {/* Trend Chart (Full Width on mobile, 3 cols on desktop) */}
            <div className="dashboard-card md:col-span-3">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Tendencia de Puntos (Temporada)</h3>
              <MatchesTrend data={[]} />
            </div>
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl text-white font-display">Accesos Directos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/features/players" className="group dashboard-card hover:bg-blue-600/5 hover:border-blue-500/50 flex flex-col justify-between h-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <UserPlus className="w-16 h-16 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center mb-3">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Gestionar Jugadores</h3>
                </div>
              </Link>

              <Link href="/features/formations" className="group dashboard-card hover:bg-emerald-600/5 hover:border-emerald-500/50 flex flex-col justify-between h-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileEdit className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center mb-3">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Editor Táctico</h3>
                </div>
              </Link>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="dashboard-card bg-slate-900/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Temporada Actual
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Posición</span>
                <span className="text-white font-bold">--</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Puntos</span>
                <span className="text-white font-bold">--</span>
              </div>
              <div className="w-full h-[1px] bg-slate-800 my-2" />
              <Link href="/features/matches" className="flex items-center justify-between text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Ver Calendario Completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
