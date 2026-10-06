import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, Panel, PanelHeading, RiskChip } from "@/components/common/bits";
import { RiskMap } from "@/components/map/RiskMap";
import { mapKindMeta, mapPoints } from "@/data/demo";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Smart Risk Map — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Explore crisis-affected areas, hospitals, airports, safe locations and Indian Missions on a filterable risk map.",
      },
      { property: "og:title", content: "Smart Risk Map — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content:
          "Risk levels, hospitals, shelters and Indian Missions around your approximate location.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { locationPermission, requestLocation, approxLocation } = useAppState();

  return (
    <AppShell
      title="Smart Risk Map"
      subtitle="Risk levels and key locations around you. Your position is only ever shown as an approximate area."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeading title="Risk overview" hint="Demo Data — illustrative placements" />
          <RiskMap />
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeading title="Your location" />
            {locationPermission === "granted" ? (
              <p className="glass-soft rounded-xl px-3 py-2.5 text-sm">
                Approximate position: <strong>{approxLocation}</strong>
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Location is off. You can share an approximate position to see
                  nearby risks. Nothing is published to other users.
                </p>
                <button
                  type="button"
                  onClick={() => void requestLocation()}
                  className="mt-3 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand/90"
                >
                  Allow approximate location
                </button>
                {locationPermission === "denied" && (
                  <p className="mt-2 text-xs text-critical">
                    Location permission was declined. The map continues with the
                    city saved in your profile.
                  </p>
                )}
              </>
            )}
          </Panel>

          <Panel>
            <PanelHeading title="Locations on this map" />
            <ul className="space-y-2.5">
              {mapPoints
                .filter((p) => p.kind !== "you")
                .map((p) => (
                  <li key={p.id} className="glass-soft rounded-xl px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {mapKindMeta[p.kind].icon} {p.label}
                      </span>
                      <RiskChip risk={p.risk} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.detail}</p>
                  </li>
                ))}
            </ul>
          </Panel>

          <DemoNote>
            Positions are schematic sample data for this prototype, not live crisis
            reporting. A real deployment would plot verified advisories on a mapping
            service.
          </DemoNote>
        </div>
      </div>
    </AppShell>
  );
}
