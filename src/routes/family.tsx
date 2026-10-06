import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  DemoNote,
  EmptyState,
  Panel,
  PanelHeading,
  StatusChip,
} from "@/components/common/bits";
import { formatWhen, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Family Safety — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "See the safety status and last check-in of your trusted family members, and add new trusted contacts.",
      },
      { property: "og:title", content: "Family Safety — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content: "Keep trusted family informed and see who has checked in.",
      },
    ],
  }),
  component: FamilyPage,
});

function FamilyPage() {
  const { family, addFamilyMember, removeFamilyMember } = useAppState();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const safeCount = family.filter((f) => f.status === "safe").length;
  const pending = family.filter((f) => f.status === "unknown").length;
  const help = family.filter((f) => f.status === "help").length;

  const submit = () => {
    const n = name.trim();
    const r = relation.trim();
    if (n.length < 2 || n.length > 60) return setError("Enter a name of 2–60 characters.");
    if (r.length < 2 || r.length > 40) return setError("Enter a relationship of 2–40 characters.");
    addFamilyMember({
      name: n,
      relation: r,
      city: city.trim().slice(0, 60) || "Not provided",
      status: "unknown",
      lastCheckIn: null,
      sharesLocation: false,
    });
    setName("");
    setRelation("");
    setCity("");
    setError("");
    setOpen(false);
    toast.success("Trusted contact added");
  };

  return (
    <AppShell
      title="Family safety"
      subtitle="Trusted contacts can see your safety status. Exact locations are never shared without permission."
    >
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Marked safe", value: safeCount, tone: "text-safe" },
          { label: "No recent check-in", value: pending, tone: "text-caution" },
          { label: "Needs help", value: help, tone: "text-critical" },
        ].map((s) => (
          <Panel key={s.label}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`mt-1 font-display text-3xl font-bold ${s.tone}`}>{s.value}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelHeading
          title="Trusted contacts"
          action={
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              <UserPlus className="size-3.5" /> Add trusted contact
            </button>
          }
        />

        {open && (
          <div className="glass-soft rise-in mb-4 grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-3">
            <input
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              aria-label="Name"
              className="rounded-xl bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={relation}
              maxLength={40}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Relationship (e.g. Mother)"
              aria-label="Relationship"
              className="rounded-xl bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={city}
              maxLength={60}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (optional)"
              aria-label="City"
              className="rounded-xl bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-xs text-critical sm:col-span-3">{error}</p>}
            <div className="flex gap-2 sm:col-span-3">
              <button
                type="button"
                onClick={submit}
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Save contact
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-card px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {family.length === 0 ? (
          <EmptyState
            title="No trusted contacts yet"
            description="Add the people who should be told when you mark yourself safe or raise an SOS."
          />
        ) : (
          <ul className="space-y-2.5">
            {family.map((m) => (
              <li
                key={m.id}
                className="glass-soft flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">
                    {m.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {m.relation} · {m.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatWhen(m.lastCheckIn)} · {m.city} ·{" "}
                      {m.sharesLocation
                        ? "Shares approximate location"
                        : "Location not shared"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={m.status} />
                  <button
                    type="button"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => {
                      removeFamilyMember(m.id);
                      toast.success("Contact removed");
                    }}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-critical/10 hover:text-critical"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mt-5">
        <DemoNote>
          Statuses shown here are sample data for this prototype. Contacts are not
          messaged and no location is transmitted.
        </DemoNote>
      </div>
    </AppShell>
  );
}
