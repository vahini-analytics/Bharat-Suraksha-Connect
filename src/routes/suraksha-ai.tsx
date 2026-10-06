import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DemoNote, Panel, PanelHeading } from "@/components/common/bits";
import { nearestMission } from "@/data/demo";

export const Route = createFileRoute("/suraksha-ai")({
  head: () => ({
    meta: [
      { title: "Suraksha AI Assistant — Bharat Suraksha Connect" },
      {
        name: "description",
        content:
          "Ask for emergency guidance, preparedness checklists, plain-language explanations of advisories and the nearest Indian Mission.",
      },
      { property: "og:title", content: "Suraksha AI — Bharat Suraksha Connect" },
      {
        property: "og:description",
        content: "Plain-language safety guidance with sources, built for Indians abroad.",
      },
    ],
  }),
  component: AiPage,
});

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: string;
  at: string;
}

/**
 * Prototype answer engine.
 *
 * Deliberately rule-based and offline: it replies only from the fixed guidance
 * below and never generates claims about live events. Swap this for a model
 * call (grounded in verified official sources) during real integration.
 */
function answer(q: string): { text: string; source: string } {
  const t = q.toLowerCase();
  const mission = nearestMission;

  if (t.includes("mission") || t.includes("embassy") || t.includes("consulate")) {
    return {
      text: `The nearest Indian Mission in this prototype's sample data is the ${mission.name}, ${mission.city}. Contact: ${mission.phone}, emergency line ${mission.emergency}, open ${mission.hours}. Confirm current details on the Ministry of External Affairs website before travelling there.`,
      source: "Sample mission directory (demo) · mea.gov.in",
    };
  }
  if (t.includes("checklist") || t.includes("prepare") || t.includes("preparedness")) {
    return {
      text: "Emergency preparedness checklist:\n1. Keep your passport, visa and an emergency contact list together, plus digital copies.\n2. Save your local emergency number and the nearest Indian Mission helpline offline.\n3. Keep a charged power bank, cash in local currency and essential medication.\n4. Agree a meeting point and a check-in time with your family.\n5. Register your contact details with the Indian Mission in your country.\n6. Keep a small go-bag: water, documents, medication, charger, warm layer.",
      source: "General preparedness guidance (not event-specific)",
    };
  }
  if (t.includes("translate")) {
    return {
      text: "Paste the notice text and tell me the language you want it in. I will translate it literally and flag anything that looks like an instruction from authorities. For anything safety-critical, always check the original official text as well.",
      source: "Prototype translation helper",
    };
  }
  if (t.includes("advisory") || t.includes("explain")) {
    return {
      text: "Share the advisory text and I will explain it in simple language: who it applies to, the area covered, what you are being asked to do, and the time period. I will not add anything the advisory does not say, and I will point you to the issuing authority's page.",
      source: "Prototype explainer",
    };
  }
  if (t.includes("emergency") || t.includes("what should i do")) {
    return {
      text: "During an emergency:\n1. Move to a safe place and call the local emergency number first.\n2. Mark yourself safe in this app so your trusted contacts know your status.\n3. If you need assistance, raise an SOS and note your case ID.\n4. Contact the nearest Indian Mission helpline.\n5. Follow instructions from local authorities and official advisories only.",
      source: "General emergency guidance (not event-specific)",
    };
  }
  return {
    text: "I can help with emergency steps, preparedness checklists, explaining or translating official advisories, and finding the nearest Indian Mission. I do not have live crisis data in this prototype, so for anything happening right now please rely on official advisories and local authorities.",
    source: "Prototype assistant",
  };
}

const suggestions = [
  "What should I do during an emergency?",
  "Where is the nearest Indian mission?",
  "Give me an emergency preparedness checklist",
  "Explain this official advisory",
  "Translate this emergency notice",
];

function AiPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Namaste. I'm Suraksha AI. I can explain official advisories, translate notices, share preparedness checklists and point you to the nearest Indian Mission. I never predict events or invent emergency information.",
      source: "Prototype assistant",
      at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = (text: string) => {
    const q = text.trim().slice(0, 500);
    if (!q || thinking) return;
    const userMsg: Msg = {
      id: `u${Date.now()}`,
      role: "user",
      text: q,
      at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const a = answer(q);
      setMessages((m) => [
        ...m,
        {
          id: `a${Date.now()}`,
          role: "assistant",
          text: a.text,
          source: a.source,
          at: new Date().toISOString(),
        },
      ]);
      setThinking(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 700);
  };

  return (
    <AppShell
      title="Suraksha AI"
      subtitle="Guidance in plain language, with the source and time shown on every answer."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel className="flex flex-col lg:col-span-2">
          <PanelHeading title="Conversation" hint="Offline guidance — no live crisis data" />
          <div className="max-h-[26rem] flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl bg-brand px-4 py-2.5 text-sm text-primary-foreground">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="max-w-[90%]">
                  <p className="text-sm whitespace-pre-line">{m.text}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Source: {m.source} ·{" "}
                    {new Date(m.at).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ),
            )}
            {thinking && (
              <p className="text-sm text-muted-foreground">Suraksha AI is typing…</p>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="glass-soft mt-4 flex items-center gap-2 rounded-2xl px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <input
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about safety steps, advisories or missions"
              aria-label="Ask Suraksha AI"
              className="w-full bg-transparent text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeading title="Try asking" />
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="glass-soft rounded-full px-3 py-1.5 text-[11px] font-medium transition hover:bg-card"
                >
                  {s}
                </button>
              ))}
            </div>
          </Panel>

          <DemoNote>
            Suraksha AI answers only from built-in guidance in this prototype. It
            does not predict conflicts, does not have live advisory data, and always
            directs you to official sources for anything safety-critical.
          </DemoNote>
        </div>
      </div>
    </AppShell>
  );
}
