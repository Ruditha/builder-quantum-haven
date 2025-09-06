import { useMemo, useState } from "react";
import { MutationFrequencyChart } from "@/components/charts/MutationFrequencyChart";
import { VariantDistributionChart } from "@/components/charts/VariantDistributionChart";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { Button } from "@/components/ui/button";

const pathogens = ["SARS-CoV-2", "Influenza", "MRSA"] as const;

type Pathogen = (typeof pathogens)[number];

function generateSeries(seed: number) {
  const dates = Array.from({ length: 20 }, (_, i) => i);
  return dates.map((i) => ({
    date: new Date(Date.now() - (19 - i) * 86400000).toISOString().slice(0, 10),
    frequency: Math.max(0, Math.sin((i + seed) / 3) * 0.3 + i * 0.02 + 0.4),
  }));
}

function generateBars(seed: number) {
  const regions = ["NA", "EU", "AS", "AF", "SA", "OC"];
  return regions.map((r, i) => ({ region: r, count: Math.round(20 + Math.abs(Math.sin(i + seed)) * 60) }));
}

function generateForecast(seed: number) {
  const weeks = Array.from({ length: 12 }, (_, i) => i);
  return weeks.map((i) => ({
    date: `W${i + 1}`,
    baseline: Math.max(0.1, 0.3 + i * 0.02 + Math.sin((i + seed) / 2) * 0.05),
    forecast: Math.max(0.1, 0.35 + i * 0.03 + Math.sin((i + seed) / 2) * 0.08),
  }));
}

export default function Dashboard() {
  const [pathogen, setPathogen] = useState<Pathogen>("SARS-CoV-2");

  const seed = useMemo(() => (pathogen === "SARS-CoV-2" ? 2 : pathogen === "Influenza" ? 5 : 8), [pathogen]);
  const line = useMemo(() => generateSeries(seed), [seed]);
  const bars = useMemo(() => generateBars(seed), [seed]);
  const forecast = useMemo(() => generateForecast(seed), [seed]);

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Genomic Trends</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor mutation frequency, regional distribution, and 8-week forecasts per pathogen.
          </p>
        </div>
        <div className="flex gap-2">
          {pathogens.map((p) => (
            <Button
              key={p}
              variant={p === pathogen ? "default" : "outline"}
              onClick={() => setPathogen(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MutationFrequencyChart data={line} />
        <VariantDistributionChart data={bars} />
      </div>

      <div className="mt-6">
        <ForecastChart data={forecast} />
      </div>
    </div>
  );
}
