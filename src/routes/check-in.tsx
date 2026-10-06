import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, Panel, PanelHeading, StatusChip } from "@/components/common/bits";
import { formatWhen, useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "Safety Check-in — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Tell your trusted contacts whether you are safe, need help, or will check in later, and control who can see your status.",
      },
      { property: "og:title", content: "Safety Check-in — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content: "Mark yourself safe in one tap and keep your family informed.",
      },
    ],
  }),
  component: CheckInPage,
});

function CheckInPage() {
  const { status, lastCheckIn, checkIn, privacy, setPrivacy, locationPermission } =
    useAppState();

  const options = [
    {
      key: "safe" as const,
      label: "I AM SAFE",
      icon: "✅",
      cls: "border-safe/30 bg-safe/10 text-safe",
      toast: "Marked as safe",
    },
    {
      key: "help" as const,
      label: "I NEED HELP",
      icon: "🆘",
      cls: "border-critical/30 bg-critical/10 text-critical",
      toast: "Marked as needing help",
    },
    {
      key: "unknown" as const,
      label: "CHECK-IN LATER",
      icon: "🟡",
      cls: "border-caution/30 bg-caution/10 text-caution",
      toast: "We'll remind you to check in later",
    },
  ];

  return (
    <AppShell
      title="Safety check-in"
      subtitle="A single tap tells the people you trust how you are doing."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeading title="How are you right now?" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  checkIn(o.key);
                  toast.success(o.toast, {
                    description: "Visible to your trusted contacts in this prototype.",
                  });
                }}
                className={cn(
                  "rounded-2xl border py-8 font-display text-sm font-bold transition hover:scale-[1.02]",
                  status === o.key ? o.cls : "glass-soft",
                )}
              >
                <span className="block text-2xl">{o.icon}</span>
                <span className="mt-2 block">{o.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="glass-soft rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Current status</p>
              <div className="mt-1.5">
                <StatusChip status={status} />
              </div>
            </div>
            <div className="glass-soft rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Last check-in</p>
              <p className="mt-1.5 text-sm font-semibold">{formatWhen(lastCheckIn)}</p>
            </div>
            <div className="glass-soft rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Location sharing</p>
              <p className="mt-1.5 text-sm font-semibold">
                {privacy.shareLocation
                  ? locationPermission === "granted"
                    ? "On · approximate"
                    : "On · awaiting permission"
                  : "Off"}
              </p>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeading title="Who can see this?" />
            <div className="space-y-2.5 text-sm">
              {[
                {
                  key: "shareStatusWithFamily" as const,
                  label: "Trusted family contacts",
                  hint: "People you added to Family Safety",
                },
                {
                  key: "shareStatusWithMission" as const,
                  label: "Indian Mission (if integrated)",
                  hint: "Not connected in this prototype",
                },
                {
                  key: "shareLocation" as const,
                  label: "Share approximate location",
                  hint: "City-level only, never an exact position",
                },
              ].map((row) => (
                <label
                  key={row.key}
                  className="glass-soft flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5"
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

          <DemoNote>
            Check-ins are stored on this device only. Nothing is published publicly
            and no authority is notified.
          </DemoNote>
        </div>
      </div>
    </AppShell>
  );
}
