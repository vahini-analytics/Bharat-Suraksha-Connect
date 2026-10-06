import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, MapPin, Phone, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, EmptyState, Panel } from "@/components/common/bits";
import { missions } from "@/data/demo";

export const Route = createFileRoute("/embassies")({
  head: () => ({
    meta: [
      { title: "Indian Embassies & Consulates — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Search Indian embassies, consulates and high commissions by country or city, with contact details, hours and directions.",
      },
      {
        property: "og:title",
        content: "Indian Embassies & Consulates — Bharat Suraksha Connect",
      },
      {
        property: "og:description",
        content: "Find the nearest Indian Mission wherever you are.",
      },
    ],
  }),
  component: EmbassyPage,
});

function EmbassyPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(missions.map((m) => m.country))).sort()],
    [],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return missions
      .filter((m) => country === "All" || m.country === country)
      .filter(
        (m) =>
          !needle ||
          m.name.toLowerCase().includes(needle) ||
          m.city.toLowerCase().includes(needle) ||
          m.country.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [q, country]);

  return (
    <AppShell
      title="Embassy & Consulate finder"
      subtitle="Indian Missions listed with contact details, working hours and directions."
    >
      <Panel className="mb-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="glass-soft flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              maxLength={80}
              placeholder="Search by mission, city or country"
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Search missions"
            />
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Filter by country"
            className="glass-soft rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {results.length === 0 ? (
        <EmptyState
          title="No missions match your search"
          description="Try a different city or clear the country filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((m) => (
            <Panel key={m.id} className="lift flex flex-col">
              <span className="w-fit rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
                {m.type}
              </span>
              <h2 className="mt-3 font-display text-base font-bold">{m.name}</h2>
              <p className="text-xs text-muted-foreground">
                {m.city}, {m.country} · {m.distanceKm.toLocaleString()} km away
              </p>
              <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <dt className="shrink-0">
                    <MapPin className="size-3.5" />
                  </dt>
                  <dd>{m.address}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0">
                    <Phone className="size-3.5" />
                  </dt>
                  <dd>
                    {m.phone}
                    <br />
                    Emergency: {m.emergency}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0">🕐</dt>
                  <dd>{m.hours}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${m.name} ${m.city}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:bg-brand/90"
                >
                  Directions
                </a>
                <a
                  href={m.website}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-soft inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold"
                >
                  Website <ExternalLink className="size-3.5" />
                </a>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <div className="mt-5">
        <DemoNote>
          Addresses and phone numbers above are placeholders for this prototype.
          Always confirm details on the Ministry of External Affairs website or the
          mission's own site before acting on them.
        </DemoNote>
      </div>
    </AppShell>
  );
}
