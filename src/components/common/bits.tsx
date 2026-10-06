import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { riskMeta, type RiskLevel } from "@/data/demo";
import type { SafetyStatus } from "@/lib/app-state";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass rounded-3xl p-5 sm:p-6", className)}>{children}</section>
  );
}

export function PanelHeading({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-base font-bold">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function RiskChip({ risk }: { risk: RiskLevel }) {
  const meta = riskMeta[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        meta.chip,
      )}
    >
      <span className={cn("size-2 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function StatusChip({ status }: { status: SafetyStatus }) {
  const map = {
    safe: { label: "Safe", cls: "bg-safe/10 text-safe border-safe/25", dot: "bg-safe" },
    help: {
      label: "Needs help",
      cls: "bg-critical/10 text-critical border-critical/25",
      dot: "bg-critical",
    },
    unknown: {
      label: "No recent check-in",
      cls: "bg-caution/10 text-caution border-caution/25",
      dot: "bg-caution",
    },
  } as const;
  const m = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold",
        m.cls,
      )}
    >
      <span className={cn("size-2.5 rounded-full", m.dot)} /> {m.label}
    </span>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="glass-soft flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass-soft rounded-2xl px-5 py-10 text-center">
      <p className="font-display text-sm font-bold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-2xl bg-card/60"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}
