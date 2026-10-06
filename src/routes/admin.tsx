import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, Panel, PanelHeading, RiskChip } from "@/components/common/bits";
import {
  alerts,
  alertsOverTime,
  citizensByCountry,
  crisisLocations,
  requestsByType,
  statusDistribution,
} from "@/data/demo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard (Demo) — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Coordination view with registered citizens, assistance requests, critical cases and alert trends, using clearly labelled sample data.",
      },
      { property: "og:title", content: "Admin Dashboard (Demo) — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content: "Sample coordination analytics for crisis response teams.",
      },
    ],
  }),
  component: AdminPage,
});

const statusColors = ["var(--safe)", "var(--caution)", "var(--critical)"];

function AdminPage() {
  const stats = [
    { label: "Registered citizens", value: "11,830" },
    { label: "Marked safe", value: "8,420" },
    { label: "Assistance requests", value: "130" },
    { label: "Critical cases", value: "18" },
    { label: "No recent check-in", value: "2,190" },
    { label: "Active alerts", value: String(alerts.length) },
  ];

  return (
    <AppShell
      title="Admin dashboard (demo)"
      subtitle="Coordination view for crisis response teams. Every figure below is sample data."
    >
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-6">
        {stats.map((s) => (
          <Panel key={s.label} className="lift p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeading title="Citizens by country" hint="Sample registrations" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citizensByCountry}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="country" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="citizens" fill="var(--brand)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Emergency requests by type" hint="Sample requests" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis
                  type="category"
                  dataKey="type"
                  width={80}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip />
                <Bar dataKey="count" fill="var(--brand-soft)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Safety status distribution" hint="Sample population" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {statusDistribution.map((entry, i) => (
                    <Cell key={entry.key} fill={statusColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {statusDistribution.map((s, i) => (
              <span key={s.key} className="inline-flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: statusColors[i] }}
                />
                {s.name} · {s.value.toLocaleString()}
              </span>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Alerts over time" hint="Last 7 days (sample)" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="var(--critical)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeading title="Crisis locations" hint="Sample case load" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Risk level</th>
                  <th className="pb-2 font-medium">Open cases</th>
                </tr>
              </thead>
              <tbody>
                {crisisLocations.map((c) => (
                  <tr key={c.location} className="border-t border-border/60">
                    <td className="py-2.5 font-medium">{c.location}</td>
                    <td className="py-2.5">
                      <RiskChip risk={c.level} />
                    </td>
                    <td className="py-2.5">{c.cases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <DemoNote>
          This dashboard is a demonstration only. It is not connected to any
          government coordination system and contains no real citizen records.
        </DemoNote>
      </div>
    </AppShell>
  );
}
