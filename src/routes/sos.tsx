import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Phone, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, Panel, PanelHeading } from "@/components/common/bits";
import {
  emergencyServices,
  emergencyTypes,
  nearestMission,
} from "@/data/demo";
import { formatDateTime, useAppState, type SosCase } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "SOS Emergency Request — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Raise an emergency request, choose the emergency type and alert your trusted contacts, with official helpline details close at hand.",
      },
      { property: "og:title", content: "SOS Emergency Request — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content:
          "Create an emergency case, share an approximate location and reach your nearest Indian Mission.",
      },
    ],
  }),
  component: SosPage,
});

type Step = "idle" | "type" | "confirm" | "sending" | "done";

function SosPage() {
  const { family, createCase, requestLocation, locationPermission, approxLocation, privacy } =
    useAppState();
  const [step, setStep] = useState<Step>("idle");
  const [type, setType] = useState<(typeof emergencyTypes)[number] | null>(null);
  const [note, setNote] = useState("");
  const [created, setCreated] = useState<SosCase | null>(null);
  const mission = nearestMission;

  const submit = async () => {
    if (!type) return;
    setStep("sending");
    let location: string | null = null;
    if (privacy.preciseLocationInSos) location = await requestLocation();
    await new Promise((r) => setTimeout(r, 900));
    const c = createCase({
      type: type.id,
      typeLabel: type.label,
      note,
      location,
      notified: family.map((f) => f.name),
    });
    setCreated(c);
    setStep("done");
  };

  return (
    <AppShell
      title="SOS — Need help"
      subtitle="Create an emergency request and notify your trusted contacts. This prototype does not contact police, ambulance services or any government authority."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {step === "idle" && (
            <Panel className="text-center">
              <button
                type="button"
                onClick={() => setStep("type")}
                className="relative mx-auto grid size-48 place-items-center rounded-full bg-critical font-display text-2xl font-bold text-primary-foreground shadow-xl shadow-critical/40 transition hover:scale-[1.02]"
              >
                <span className="pulse-ring absolute inset-0 rounded-full bg-critical" />
                <span className="relative flex flex-col items-center gap-1">
                  <ShieldAlert className="size-9" />
                  SOS
                </span>
              </button>
              <p className="mt-5 text-sm text-muted-foreground">
                You will be asked to confirm before anything is sent.
              </p>
            </Panel>
          )}

          {step === "type" && (
            <Panel className="rise-in">
              <PanelHeading
                title="What kind of help do you need?"
                hint="Choose the closest match"
              />
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {emergencyTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition",
                      type?.id === t.id
                        ? "border border-critical/30 bg-critical/10 text-critical"
                        : "glass-soft hover:bg-card",
                    )}
                  >
                    <span className="mr-2">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <label className="mt-4 block text-sm font-medium" htmlFor="sos-note">
                Anything responders should know? (optional)
              </label>
              <textarea
                id="sos-note"
                value={note}
                maxLength={500}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="glass-soft mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="E.g. two people, building entrance blocked"
              />
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("idle")}
                  className="glass-soft flex-1 rounded-xl py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!type}
                  onClick={() => setStep("confirm")}
                  className="flex-1 rounded-xl bg-critical py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-critical/90 disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </Panel>
          )}

          {step === "confirm" && type && (
            <Panel className="rise-in">
              <div className="flex items-start gap-3 rounded-2xl border border-critical/25 bg-critical/10 p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-critical" />
                <div>
                  <p className="font-display text-base font-bold text-critical">
                    Confirm emergency request
                  </p>
                  <p className="mt-1 text-sm">
                    {type.icon} {type.label}
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <li>
                      • {family.length} trusted contact
                      {family.length === 1 ? "" : "s"} will be notified in this prototype.
                    </li>
                    <li>
                      •{" "}
                      {privacy.preciseLocationInSos
                        ? "Your approximate location will be attached if you grant permission."
                        : "No location will be attached (turned off in privacy settings)."}
                    </li>
                    <li>• No government authority or emergency service is contacted.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("type")}
                  className="glass-soft flex-1 rounded-xl py-2.5 text-sm font-semibold"
                >
                  Go back
                </button>
                <button
                  type="button"
                  onClick={() => void submit()}
                  className="flex-1 rounded-xl bg-critical py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-critical/90"
                >
                  Yes, send SOS
                </button>
              </div>
            </Panel>
          )}

          {step === "sending" && (
            <Panel className="text-center">
              <div className="mx-auto size-12 animate-spin rounded-full border-4 border-critical/20 border-t-critical" />
              <p className="mt-4 text-sm font-medium">Creating your emergency request…</p>
            </Panel>
          )}

          {step === "done" && created && (
            <Panel className="rise-in">
              <div className="rounded-2xl border border-safe/25 bg-safe/10 p-5">
                <p className="font-display text-lg font-bold">Emergency request created</p>
                <p className="mt-1 font-display text-2xl font-bold text-brand">
                  Case ID: {created.id}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Created {formatDateTime(created.createdAt)}
                </p>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="glass-soft flex justify-between rounded-xl px-3 py-2.5">
                  <dt className="text-muted-foreground">Emergency type</dt>
                  <dd className="font-medium">{created.typeLabel}</dd>
                </div>
                <div className="glass-soft flex justify-between rounded-xl px-3 py-2.5">
                  <dt className="text-muted-foreground">Location attached</dt>
                  <dd className="font-medium">
                    {created.location ??
                      (locationPermission === "denied"
                        ? "Not shared (permission declined)"
                        : "Not shared")}
                  </dd>
                </div>
                <div className="glass-soft rounded-xl px-3 py-2.5">
                  <dt className="text-muted-foreground">Contacts notified (prototype)</dt>
                  <dd className="mt-1 font-medium">
                    {created.notified.join(", ") || "No trusted contacts added yet"}
                  </dd>
                </div>
                {created.note && (
                  <div className="glass-soft rounded-xl px-3 py-2.5">
                    <dt className="text-muted-foreground">Your note</dt>
                    <dd className="mt-1">{created.note}</dd>
                  </div>
                )}
              </dl>
              <button
                type="button"
                onClick={() => {
                  setStep("idle");
                  setType(null);
                  setNote("");
                }}
                className="glass-soft mt-4 w-full rounded-xl py-2.5 text-sm font-semibold"
              >
                Back to SOS
              </button>
            </Panel>
          )}
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHeading title="Emergency contacts" hint="Sample numbers" />
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

          <Panel>
            <PanelHeading title="Nearest Indian Mission" />
            <p className="text-sm font-semibold">{mission.name}</p>
            <p className="text-xs text-muted-foreground">
              {mission.city}, {mission.country}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Emergency: {mission.emergency}
            </p>
            <Link
              to="/embassies"
              className="mt-3 block rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Mission directory
            </Link>
          </Panel>

          <DemoNote>
            Requests stay on this device. Always call your local emergency number
            first in a real emergency.
          </DemoNote>
        </div>
      </div>
    </AppShell>
  );
}
