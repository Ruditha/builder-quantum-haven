import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export type SeriesPoint = { date: string; frequency: number };

export function MutationFrequencyChart({ data, color = "#2563eb" }: { data: SeriesPoint[]; color?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="mb-2 text-sm font-medium">Mutation Frequency Over Time</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} minTickGap={24} />
            <YAxis tick={{ fontSize: 12 }} tickMargin={8} width={40} />
            <Tooltip cursor={{ stroke: "#94a3b8", strokeDasharray: 4 }} />
            <Line type="monotone" dataKey="frequency" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
