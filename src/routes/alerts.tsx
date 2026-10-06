import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, EmptyState, Panel, RiskChip } from "@/components/common/bits";
import {
  alertCategoryMeta,
  alerts,
  riskMeta,
  type AlertCategory,
  type RiskLevel,
} from "@/data/demo";
import { formatDateTime } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alert Centre — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Security, disaster, travel, advisory and health alerts with risk level, recommended action and the official source for each.",
      },
      { property: "og:title", content: "Alert Centre — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content: "Filter crisis alerts by country, severity and type.",
      },
    ],
  }),
  component: AlertsPage,
});

const categories = Object.keys(alertCategoryMeta) as AlertCategory[];
const levels: RiskLevel[] = ["low", "caution", "high", "critical"];

function AlertsPage() {
  const [country, setCountry] = useState("All");
  const [cat, setCat] = useState<AlertCategory | "All">("All");
  const [level, setLevel] = useState<RiskLevel | "All">("All");

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(alerts.map((a) => a.country))).sort()],
    [],
  );

  const results = alerts.filter(
    (a) =>
      (country === "All" || a.country === country) &&
      (cat === "All" || a.category === cat) &&
      (level === "All" || a.risk === level),
  );

  return (
    <AppShell
      title="Alert centre"
      subtitle="Every alert carries its source, timestamp and a recommended action."
    >
      <Panel className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Filter by country"
            className="glass-soft rounded-xl px-3 py-2 text-sm font-medium outline-none"
          >
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {levels.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(level === l ? "All" : l)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                level === l ? riskMeta[l].chip : "glass-soft text-muted-foreground",
              )}
            >
              <span className={cn("size-2 rounded-full", riskMeta[l].dot)} />
              {riskMeta[l].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(cat === c ? "All" : c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                cat === c
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "glass-soft text-muted-foreground",
              )}
            >
              {alertCategoryMeta[c].icon} {alertCategoryMeta[c].label}
            </button>
          ))}
        </div>
      </Panel>

      {results.length === 0 ? (
        <EmptyState
          title="No alerts match these filters"
          description="Try widening the severity or category filters to see more."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {results.map((a) => (
            <Panel key={a.id} className="lift">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold">
                  {alertCategoryMeta[a.category].icon} {alertCategoryMeta[a.category].label}
                </span>
                <RiskChip risk={a.risk} />
              </div>
              <h2 className="mt-2 font-display text-base font-bold">{a.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.city}, {a.country} · {formatDateTime(a.issuedAt)}
              </p>
              <p className="mt-2 text-sm">{a.summary}</p>
              <p className="glass-soft mt-3 rounded-xl px-3 py-2.5 text-xs">
                <strong>Recommended action:</strong> {a.action}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Source: {a.source}</span>
                <a
                  href={a.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                >
                  Official source <ExternalLink className="size-3" />
                </a>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <div className="mt-5">
        <DemoNote>
          These alerts are sample entries created for the prototype. In a live
          deployment they would come only from verified government and official
          sources, with the original publication time.
        </DemoNote>
      </div>
    </AppShell>
  );
}
