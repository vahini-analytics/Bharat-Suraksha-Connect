import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowUpRight, Phone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeading, RiskChip, StatusChip, DemoNote } from "@/components/common/bits";
import { RiskMap } from "@/components/map/RiskMap";
import {
  alertCategoryMeta,
  alerts,
  emergencyServices,
  missions,
  officialUpdates,
  nearestMission,
} from "@/data/demo";
import { formatWhen, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home Dashboard — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Safety status, crisis alerts, nearby emergency services and your nearest Indian Mission, in one dashboard for Indians abroad.",
      },
      { property: "og:title", content: "Bharat Suraksha Connect — Safety Beyond Borders" },
      {
        property: "og:description",
        content:
          "Helping Indians abroad stay informed, connected, and safer during emergencies.",
      },
    ],
  }),
  component: HomePage,
});

const quickActions = [
  { to: "/sos", label: "SOS", icon: "🆘" },
  { to: "/check-in", label: "I am safe", icon: "✅" },
  { to: "/map", label: "Risk map", icon: "🗺️" },
  { to: "/embassies", label: "Indian Mission", icon: "🏛️" },
  { to: "/family", label: "Family status", icon: "👨‍👩‍👧" },
  { to: "/suraksha-ai", label: "Ask Suraksha AI", icon: "🤖" },
] as const;

function HomePage() {
  const { profile, status, lastCheckIn, family, checkIn } = useAppState();
  const nearest = nearestMission;
  const topAlerts = alerts.slice(0, 3);

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <Panel className="rise-in">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-soft font-display text-xl font-bold text-primary-foreground shadow-md shadow-brand/30">
                {profile.initials}
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Signed in as
                </p>
                <p className="font-display text-lg font-bold leading-tight">{profile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {profile.city}, {profile.country}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-safe/20 bg-safe/10 px-4 py-3">
              <span className="text-sm font-semibold">Current status</span>
              <StatusChip status={status} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Last check-in: {formatWhen(lastCheckIn)}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  checkIn("safe");
                  toast.success("Marked as safe", {
                    description: "Shared with your trusted contacts in this prototype only.",
                  });
                }}
                className="glass-soft grid place-items-center rounded-2xl py-4 font-display text-sm font-bold text-brand transition hover:bg-card"
              >
                <span className="text-lg">✅</span> I AM SAFE
              </button>
              <Link
                to="/sos"
                className="relative grid place-items-center rounded-2xl bg-critical py-4 font-display text-sm font-bold text-primary-foreground shadow-lg shadow-critical/30"
              >
                <span className="pulse-ring absolute inset-0 rounded-2xl bg-critical" />
                <span className="relative text-lg">🆘</span>
                <span className="relative">SOS</span>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {quickActions.slice(2).map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="glass-soft rounded-xl px-3 py-2.5 font-medium transition hover:bg-card"
                >
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeading
              title="Family Safety"
              action={
                <Link to="/family" className="text-xs font-semibold text-brand hover:underline">
                  + Add contact
                </Link>
              }
            />
            <ul className="space-y-2.5">
              {family.map((m) => (
                <li
                  key={m.id}
                  className="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5"
                >
                  <span className="text-sm font-medium">{m.relation}</span>
                  <StatusChip status={m.status} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeading title="Nearby emergency services" hint="Sample numbers" />
            <ul className="space-y-2.5">
              {emergencyServices.map((s) => (
                <li
                  key={s.id}
                  className="glass-soft flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                >
                  <span>
                    <span className="block text-sm font-medium">{s.name}</span>
                    <span className="block text-xs text-muted-foreground">{s.detail}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand">
                    <Phone className="size-3.5" /> {s.number}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <Panel>
            <PanelHeading
              title="Smart Risk Map"
              hint="Approximate location · Demo Data"
              action={
                <Link to="/map" className="text-xs font-semibold text-brand hover:underline">
                  Open map
                </Link>
              }
            />
            <RiskMap compact />
          </Panel>

          <Panel>
            <PanelHeading
              title="Active alerts"
              action={
                <Link to="/alerts" className="text-xs font-semibold text-brand hover:underline">
                  View all
                </Link>
              }
            />
            <div className="space-y-3">
              {topAlerts.map((a) => (
                <article key={a.id} className="glass-soft lift rounded-2xl p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold">
                      {alertCategoryMeta[a.category].icon} {alertCategoryMeta[a.category].label}
                    </span>
                    <RiskChip risk={a.risk} />
                  </div>
                  <p className="mt-1.5 text-sm font-semibold">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.action} · Source: {a.source}
                  </p>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-5 lg:col-span-3">
          <Panel>
            <PanelHeading title="Nearest Indian Mission" />
            <div className="glass-soft rounded-2xl p-4">
              <p className="text-sm font-semibold">{nearest.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {nearest.city}, {nearest.country} · {nearest.distanceKm} km
              </p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <p>📞 {nearest.phone}</p>
                <p>🕐 {nearest.hours}</p>
              </div>
              <Link
                to="/embassies"
                className="mt-3 block rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:bg-brand/90"
              >
                View mission details
              </Link>
            </div>
          </Panel>

          <Panel>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-sm">
                🤖
              </span>
              <h2 className="font-display text-base font-bold">Suraksha AI</h2>
            </div>
            <Link to="/suraksha-ai" className="glass-soft lift block rounded-2xl p-3.5">
              <p className="text-xs text-muted-foreground">Ask about safety guidance</p>
              <p className="mt-1 text-sm font-medium">
                “What should I do during an emergency?”
              </p>
            </Link>
          </Panel>

          <Panel>
            <PanelHeading title="Recent official updates" hint="Sample notices" />
            <ul className="space-y-2.5">
              {officialUpdates.map((u) => (
                <li key={u.id} className="glass-soft rounded-xl px-3 py-2.5">
                  <p className="text-sm font-medium">{u.title}</p>
                  <a
                    href={u.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                  >
                    {u.source} <ArrowUpRight className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>

          <DemoNote>
            This prototype does not contact government authorities or emergency
            services. All alerts, contacts and mission details shown are sample data.
          </DemoNote>
        </div>
      </div>
    </AppShell>
  );
}
