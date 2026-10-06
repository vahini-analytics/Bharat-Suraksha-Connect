import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  mapKindMeta,
  mapPoints,
  riskMeta,
  type MapPointKind,
  type RiskLevel,
} from "@/data/demo";

const kinds: MapPointKind[] = ["crisis", "hospital", "mission", "airport", "shelter"];
const levels: RiskLevel[] = ["low", "caution", "high", "critical"];

export function RiskMap({ compact = false }: { compact?: boolean }) {
  const [activeKinds, setActiveKinds] = useState<MapPointKind[]>(kinds);
  const [activeLevels, setActiveLevels] = useState<RiskLevel[]>(levels);
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      mapPoints.filter(
        (p) =>
          p.kind === "you" ||
          (activeKinds.includes(p.kind) && activeLevels.includes(p.risk)),
      ),
    [activeKinds, activeLevels],
  );

  const point = visible.find((p) => p.id === selected);

  const toggle = <T,>(list: T[], set: (v: T[]) => void, value: T) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        {visible.map((p) =>
          p.kind === "you" ? (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              aria-label={p.label}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="pulse-ring absolute inset-0 rounded-full bg-brand-soft" />
              <span className="relative block size-4 rounded-full bg-brand-soft ring-4 ring-white/70" />
            </button>
          ) : (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              aria-label={p.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.kind === "crisis" && (
                <span
                  className={cn(
                    "absolute -inset-5 rounded-full blur-md opacity-45",
                    riskMeta[p.risk].dot,
                  )}
                />
              )}
              <span
                className={cn(
                  "relative block size-3 rounded-full ring-4 transition hover:scale-125",
                  riskMeta[p.risk].dot,
                  riskMeta[p.risk].ring,
                )}
              />
            </button>
          ),
        )}

        <div className="glass-soft absolute bottom-3 left-3 rounded-lg px-3 py-2 text-[11px] font-medium">
          📍 You · Dubai, UAE · approximate
        </div>
        <div className="glass-soft absolute top-3 right-3 rounded-lg px-3 py-2 text-[11px] font-medium">
          Demo Data
        </div>
      </div>

      {point && (
        <div className="glass-soft rise-in rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              {mapKindMeta[point.kind].icon} {point.label}
            </p>
            <span className={cn("text-[11px] font-bold", riskMeta[point.risk].text)}>
              {riskMeta[point.risk].label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{point.detail}</p>
        </div>
      )}

      {!compact && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => toggle(activeKinds, setActiveKinds, k)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                  activeKinds.includes(k)
                    ? "border-brand/30 bg-brand/10 text-brand"
                    : "glass-soft text-muted-foreground",
                )}
              >
                {mapKindMeta[k].icon} {mapKindMeta[k].label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggle(activeLevels, setActiveLevels, l)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                  activeLevels.includes(l)
                    ? riskMeta[l].chip
                    : "glass-soft text-muted-foreground",
                )}
              >
                <span className={cn("size-2 rounded-full", riskMeta[l].dot)} />
                {riskMeta[l].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {compact && (
        <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
          {levels.map((l) => (
            <span
              key={l}
              className="glass-soft inline-flex items-center gap-1 rounded-full px-2 py-1"
            >
              <span className={cn("size-2 rounded-full", riskMeta[l].dot)} />
              {riskMeta[l].label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
