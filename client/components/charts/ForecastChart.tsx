import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ForecastPoint = { date: string; baseline: number; forecast: number };

export function ForecastChart({ data }: { data: ForecastPoint[] }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="mb-2 text-sm font-medium">Forecasted Trend (Next 8 Weeks)</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip />
            <Area type="monotone" dataKey="baseline" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.5} />
            <Area type="monotone" dataKey="forecast" stroke="#7c3aed" fill="#c4b5fd" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
