'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const THEME_GRID_COLOR = 'rgba(255,255,255,0.1)';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl">
        <p className="text-slate-200 text-sm font-bold">{`${label}`}</p>
        <p className="text-blue-400 text-sm">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

// Empty State Component
const NoDataState = ({ message }: { message: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-lg border border-slate-800 border-dashed">
    <p className="text-sm font-medium">{message}</p>
  </div>
);

interface GoalsChartProps {
  data?: { match: string; goals: number }[];
}

export function GoalsChart({ data = [] }: GoalsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full">
        <NoDataState message="No hay datos de goles registrados" />
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME_GRID_COLOR} vertical={false} />
          <XAxis dataKey="match" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="goals" name="Goles" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MatchesTrendProps {
  data?: { match: string; points: number }[];
}

export function MatchesTrend({ data = [] }: MatchesTrendProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full">
        <NoDataState message="No hay partidos jugados esta temporada" />
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME_GRID_COLOR} vertical={false} />
          <XAxis dataKey="match" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="points" name="Puntos Acum." stroke="#10b981" fillOpacity={1} fill="url(#colorPoints)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PlayerStatsPieProps {
  data?: { name: string; value: number }[];
}

export function PlayerStatsPie({ data = [] }: PlayerStatsPieProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full">
        <NoDataState message="No hay datos de jugadores" />
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-[-20px] relative z-10">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-xs text-slate-400">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
