import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth/auth";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import { Users, Shirt, Trophy, ArrowRight, UserPlus, FileEdit, BarChart2 } from "lucide-react";
import { getPlayers } from "@/lib/db/players";
import { getFormations } from "@/lib/db/formations";
import { GoalsChart, MatchesTrend, PlayerStatsPie } from "@/app/components/dashboard/StatsChart";

export default async function DashboardPage() {
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
    { label: "Jugadores Activos", value: players.length.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Formaciones", value: formations.length.toString(), icon: Shirt, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Próximo Partido", value: "Sin programar", icon: Trophy, color: "text-foreground-muted", bg: "bg-white/5" },
  ];

  return (
    
      <div className="space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-7xl text-white font-display uppercase leading-none tracking-tight">
              HOLA, <span className="text-primary">{session?.user?.name || 'ENTRENADOR'}</span>
            </h1>
            <p className="text-foreground-muted text-lg font-sans mt-2">Resumen de actividad del equipo</p>
          </div>
          <div className="text-base text-primary font-display tracking-widest uppercase border border-white/10 px-4 py-1 rounded-full bg-white/5">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-card group flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-24 h-24" />
              </div>
              <div className={`p-4 rounded-full bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted font-sans font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-display font-medium text-white leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div>
          <h2 className="text-3xl text-white font-display mb-6 flex items-center gap-3 uppercase">
            <BarChart2 className="w-6 h-6 text-primary" />
            Analítica de Rendimiento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Goals Chart */}
            <div className="dashboard-card md:col-span-2">
              <h3 className="text-lg font-display text-white mb-6 uppercase tracking-wider border-l-4 border-primary pl-3">Goles por Partido (Últimos 5)</h3>
              <GoalsChart data={[]} />
            </div>

            {/* Pie Chart */}
            <div className="dashboard-card">
              <h3 className="text-lg font-display text-white mb-6 uppercase tracking-wider border-l-4 border-primary pl-3">Distribución de Plantilla</h3>
              <PlayerStatsPie data={[]} />
            </div>

            {/* Trend Chart (Full Width on mobile, 3 cols on desktop) */}
            <div className="dashboard-card md:col-span-3">
              <h3 className="text-lg font-display text-white mb-6 uppercase tracking-wider border-l-4 border-primary pl-3">Tendencia de Puntos (Temporada)</h3>
              <MatchesTrend data={[]} />
            </div>
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl text-white font-display uppercase">Accesos Directos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link href="/features/players" className="group dashboard-card hover:border-primary/50 flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                  <UserPlus className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium text-white uppercase group-hover:translate-x-1 transition-transform">Gestionar Jugadores</h3>
                    <p className="text-sm text-foreground-muted mt-1 font-sans">Añadir, editar o eliminar fichas</p>
                  </div>
                </div>
              </Link>

              <Link href="/features/formations" className="group dashboard-card hover:border-primary/50 flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                  <FileEdit className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FileEdit className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium text-white uppercase group-hover:translate-x-1 transition-transform">Editor Táctico</h3>
                    <p className="text-sm text-foreground-muted mt-1 font-sans">Crear y modificar alineaciones</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="dashboard-card bg-white/5 border-white/5">
            <h3 className="text-2xl font-display text-white mb-6 flex items-center gap-2 uppercase">
              <Trophy className="w-6 h-6 text-accent" />
              Temporada Actual
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-sans uppercase tracking-wider text-sm">Posición en Liga</span>
                <span className="text-4xl text-white font-display">--</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-sans uppercase tracking-wider text-sm">Puntos Totales</span>
                <span className="text-4xl text-white font-display">--</span>
              </div>
              <div className="w-full h-[1px] bg-white/10 my-4" />
              <Link href="/features/matches" className="flex items-center justify-between text-sm text-primary hover:text-white transition-colors font-medium uppercase tracking-wide group">
                Ver Calendario
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
   
  );
}
