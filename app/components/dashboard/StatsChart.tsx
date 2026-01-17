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

interface GoalsChartProps {
  data?: { match: string; goals: number }[];
}

const NoDataState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center w-full h-full text-slate-400 text-sm">
    {message}
  </div>
);

const COLORS = ['#C2185B', '#db2777', '#f59e0b', '#10b981'];
const THEME_GRID_COLOR = 'rgba(255,255,255,0.1)';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-white/10 p-2 rounded shadow-xl">
        <p className="text-white text-sm font-bold">{`${label}`}</p>
        <p className="text-primary text-sm">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

// ...

export function GoalsChart({ data = [] }: GoalsChartProps) {
  // ...
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME_GRID_COLOR} vertical={false} />
          <XAxis dataKey="match" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="goals" name="Goles" fill="#C2185B" radius={[4, 4, 0, 0]} barSize={30} />
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
