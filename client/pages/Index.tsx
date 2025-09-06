import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ActivitySquare,
  ArrowRight,
  Beaker,
  Brain,
  ChartLine,
  Clock,
  FileUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MutationFrequencyChart } from "@/components/charts/MutationFrequencyChart";
import { VariantDistributionChart } from "@/components/charts/VariantDistributionChart";
import { ForecastChart } from "@/components/charts/ForecastChart";

const pathogens = [
  { key: "SARS-CoV-2", color: "#2563eb" },
  { key: "Influenza", color: "#059669" },
  { key: "MRSA", color: "#7c3aed" },
] as const;

type PathogenKey = (typeof pathogens)[number]["key"];

function useDemoData(selected: PathogenKey) {
  const seed =
    selected === "SARS-CoV-2" ? 3 : selected === "Influenza" ? 7 : 10;
  const series = Array.from({ length: 20 }, (_, i) => ({
    date: new Date(Date.now() - (19 - i) * 86400000).toISOString().slice(0, 10),
    frequency: Math.max(0, Math.sin((i + seed) / 3) * 0.3 + i * 0.02 + 0.35),
  }));
  const bars = ["NA", "EU", "AS", "AF", "SA", "OC"].map((r, i) => ({
    region: r,
    count: Math.round(25 + Math.abs(Math.sin(i + seed)) * 55),
  }));
  const forecast = Array.from({ length: 12 }, (_, i) => ({
    date: `W${i + 1}`,
    baseline: Math.max(0.1, 0.28 + i * 0.02 + Math.sin((i + seed) / 2) * 0.05),
    forecast: Math.max(0.1, 0.33 + i * 0.03 + Math.sin((i + seed) / 2) * 0.08),
  }));
  return { series, bars, forecast };
}

export default function Index() {
  const [selected, setSelected] = useState<PathogenKey>("SARS-CoV-2");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { series, bars, forecast } = useMemo(
    () => useDemoData(selected),
    [selected],
  );
  const color = pathogens.find((p) => p.key === selected)?.color ?? "#2563eb";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-100/60 via-transparent to-indigo-100/40 dark:from-sky-900/20 dark:to-indigo-900/10" />
        <div className="container relative grid gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Multi-pathogen
              AI surveillance
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Predict pathogen evolution before it spreads
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Detect mutations in near real-time, classify emerging variants,
              and forecast growth to power proactive public health decisions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3" id="upload">
              <input
                ref={fileRef}
                type="file"
                accept=".fasta,.fa,.fna,.txt"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  setFileName(f ? f.name : null);
                  if (!f) return;
                  try {
                    const text = await f.text();
                    const payload = {
                      filename: f.name,
                      content: text,
                      pathogen: selected,
                    };
                    const res = await fetch("/api/upload-fasta", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    // Show basic results
                    if (res.ok) {
                      alert(
                        `Uploaded ${data.filename} — ${data.summary.sequences} sequences, ${data.summary.total_mutations} mutations detected`,
                      );
                    } else {
                      alert(
                        `Upload failed: ${data.error || JSON.stringify(data)}`,
                      );
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Failed to upload FASTA file");
                  }
                }}
              />
              <Button
                onClick={() => fileRef.current?.click()}
                className="gap-2"
              >
                <FileUp className="h-4 w-4" /> Upload FASTA
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href="#visuals">
                  <ChartLine className="h-4 w-4" /> View live trends
                </a>
              </Button>
              {fileName && (
                <span className="inline-flex items-center text-sm text-muted-foreground">
                  Selected: {fileName}
                </span>
              )}
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Near real-time ingestion
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Secure & collaborative
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Quick Preview</p>
              <div className="flex gap-2">
                {pathogens.map((p) => (
                  <Button
                    key={p.key}
                    size="sm"
                    variant={p.key === selected ? "default" : "outline"}
                    onClick={() => setSelected(p.key)}
                  >
                    {p.key}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <MutationFrequencyChart data={series} color={color} />
              <VariantDistributionChart data={bars} color="#10b981" />
            </div>
            <div className="mt-4">
              <ForecastChart data={forecast} />
            </div>
            <div className="mt-3 text-right">
              <Button asChild variant="ghost" className="gap-2">
                <a href="/dashboard">
                  Open full dashboard <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Impact */}
      <section id="impact" className="container py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Why it matters
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pathogens like SARS-CoV-2, Influenza, and antibiotic-resistant
              bacteria mutate rapidly—changing transmissibility, virulence, and
              treatment resistance.
            </p>
          </div>
          <ul className="grid gap-4 md:col-span-2 md:grid-cols-2">
            <li className="rounded-xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4 text-primary" /> Traditional methods
                are too slow
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Manual sequencing + phylogenetics can take days or weeks,
                delaying response.
              </p>
            </li>
            <li className="rounded-xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <ActivitySquare className="h-4 w-4 text-primary" /> Limited
                predictive power
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Existing tools describe current variants but don’t forecast
                future trends.
              </p>
            </li>
            <li className="rounded-xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <Beaker className="h-4 w-4 text-primary" /> Fragmented systems
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Pathogen-specific workflows hinder a unified response across
                viruses and bacteria.
              </p>
            </li>
            <li className="rounded-xl border p-4">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" /> Expected impact
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Faster detection, early warnings, and better resource allocation
                across regions.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="border-y bg-muted/30">
        <div className="container py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            ML-powered pipeline
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Automated genomic processing, mutation/variant detection, AI
            forecasting, and interactive dashboards—scalable and collaborative.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold">
                1. Automated Genomic Processing
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingest FASTA, detect SNPs/indels vs references, enrich with
                date/location metadata.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold">
                2. Mutation & Variant Detection
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Classify VOC/VOI; surface novel variants when signatures deviate
                significantly.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold">3. AI-Driven Prediction</p>
              <p className="mt-1 text-sm text-muted-foreground">
                ARIMA/LSTM trends; XGBoost risk scoring; link mutations to drug
                targets.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold">
                4. Interactive Visualization
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Dashboards for mutation frequency, regional spread, and
                forecasted growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizations */}
      <section id="visuals" className="container py-14 md:py-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Interactive visualization
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore mutation frequency, regional distribution, and near-term
              forecasts by pathogen.
            </p>
          </div>
          <div className="flex gap-2">
            {pathogens.map((p) => (
              <Button
                key={p.key}
                size="sm"
                variant={p.key === selected ? "default" : "outline"}
                onClick={() => setSelected(p.key)}
              >
                {p.key}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <MutationFrequencyChart data={series} color={color} />
          <VariantDistributionChart data={bars} />
        </div>
        <div className="mt-6">
          <ForecastChart data={forecast} />
        </div>
      </section>
    </div>
  );
}
