import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, Panel, PanelHeading, StatusChip } from "@/components/common/bits";
import { emergencyServices } from "@/data/demo";
import { formatWhen, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Privacy — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Manage your details, emergency contacts, notification and location-sharing settings, and see exactly what is shared and with whom.",
      },
      { property: "og:title", content: "Profile & Privacy — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content: "Your details and privacy controls in one place.",
      },
    ],
  }),
  component: ProfilePage,
});

const languages = ["English", "हिन्दी", "বাংলা", "தமிழ்", "മലയാളം", "తెలుగు"];

function ProfilePage() {
  const {
    profile,
    setProfile,
    privacy,
    setPrivacy,
    family,
    status,
    lastCheckIn,
    locationPermission,
  } = useAppState();
  const [draft, setDraft] = useState(profile);

  const toggles = [
    { key: "shareLocation" as const, label: "Share approximate location", hint: "City-level only" },
    {
      key: "preciseLocationInSos" as const,
      label: "Attach location to SOS",
      hint: "Asked for permission each time",
    },
    {
      key: "shareStatusWithFamily" as const,
      label: "Show my status to trusted contacts",
      hint: "People listed in Family Safety",
    },
    {
      key: "shareStatusWithMission" as const,
      label: "Share status with Indian Mission",
      hint: "Not connected in this prototype",
    },
    { key: "pushAlerts" as const, label: "Alert notifications", hint: "Critical and high alerts" },
    { key: "emailDigest" as const, label: "Daily email digest", hint: "Summary of advisories" },
  ];

  return (
    <AppShell title="Profile & privacy" subtitle="Your details, contacts and sharing controls.">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel>
            <PanelHeading title="Your details" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  ["name", "Full name"],
                  ["city", "City"],
                  ["country", "Country"],
                  ["phone", "Phone"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-sm">
                  <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
                  <input
                    value={draft[key]}
                    maxLength={80}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    className="glass-soft w-full rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              ))}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-muted-foreground">Language</span>
                <select
                  value={privacy.language}
                  onChange={(e) => setPrivacy({ language: e.target.value })}
                  className="glass-soft w-full rounded-xl px-3 py-2.5 font-medium outline-none"
                >
                  {languages.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                const name = draft.name.trim();
                if (name.length < 2) {
                  toast.error("Please enter your name.");
                  return;
                }
                setProfile({
                  ...draft,
                  name,
                  initials: name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase(),
                });
                toast.success("Profile updated");
              }}
              className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Save changes
            </button>
            <p className="mt-2 text-xs text-muted-foreground">{profile.passportNote}.</p>
          </Panel>

          <Panel>
            <PanelHeading title="Notification & sharing settings" />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {toggles.map((row) => (
                <label
                  key={row.key}
                  className="glass-soft flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm"
                >
                  <span>
                    <span className="block font-medium">{row.label}</span>
                    <span className="block text-xs text-muted-foreground">{row.hint}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={privacy[row.key]}
                    onChange={(e) => setPrivacy({ [row.key]: e.target.checked })}
                    className="size-4 accent-[var(--brand)]"
                  />
                </label>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeading
              title="Privacy centre"
              hint="What is shared, with whom, and when"
            />
            <ul className="space-y-2.5 text-sm">
              <li className="glass-soft rounded-xl px-3 py-2.5">
                <strong>Your exact location is never published.</strong> Only an
                approximate area is ever used, and only after you grant permission.
                Permission is currently{" "}
                {locationPermission === "granted"
                  ? "granted"
                  : locationPermission === "denied"
                    ? "declined"
                    : "not requested"}
                .
              </li>
              <li className="glass-soft rounded-xl px-3 py-2.5">
                <strong>Your safety status</strong> is visible to your{" "}
                {privacy.shareStatusWithFamily ? family.length : 0} trusted contacts
                when sharing is on, and to nobody else.
              </li>
              <li className="glass-soft rounded-xl px-3 py-2.5">
                <strong>SOS requests</strong> stay on this device in the prototype. No
                government authority or emergency service receives them.
              </li>
              <li className="glass-soft rounded-xl px-3 py-2.5">
                <strong>Alerts and mission details</strong> are clearly labelled demo
                data and link to the official source they would come from.
              </li>
            </ul>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-soft font-display font-bold text-primary-foreground">
                {profile.initials}
              </span>
              <div>
                <p className="font-display font-bold">{profile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.city}, {profile.country}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5">
                <span className="text-muted-foreground">Status</span>
                <StatusChip status={status} />
              </div>
              <div className="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5">
                <span className="text-muted-foreground">Last check-in</span>
                <span className="font-medium">{formatWhen(lastCheckIn)}</span>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeading title="Emergency contacts" hint="Sample numbers" />
            <ul className="space-y-2.5 text-sm">
              {emergencyServices.map((s) => (
                <li key={s.id} className="glass-soft rounded-xl px-3 py-2.5">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.number}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeading title="Trusted family" />
            <ul className="space-y-2 text-sm">
              {family.map((m) => (
                <li
                  key={m.id}
                  className="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5"
                >
                  <span>{m.relation}</span>
                  <ShieldCheck className="size-4 text-safe" />
                </li>
              ))}
            </ul>
          </Panel>

          <DemoNote>
            Settings are stored on this device only and are reset if you clear your
            browser data.
          </DemoNote>
        </div>
      </div>
    </AppShell>
  );
}
