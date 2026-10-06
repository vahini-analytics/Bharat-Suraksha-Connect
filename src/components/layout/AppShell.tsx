import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DEMO_NOTICE } from "@/data/demo";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Smart Map" },
  { to: "/sos", label: "SOS" },
  { to: "/embassies", label: "Embassies" },
  { to: "/family", label: "Family" },
  { to: "/suraksha-ai", label: "Suraksha AI" },
  { to: "/alerts", label: "Alerts" },
  { to: "/profile", label: "Profile" },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-field relative min-h-screen w-full overflow-hidden font-sans text-foreground">
      <div className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full bg-brand-soft/25 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 size-[460px] rounded-full bg-saffron/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 size-[420px] rounded-full bg-safe/15 blur-[120px]" />

      <header className="relative z-20 mx-auto max-w-7xl px-4 pt-5">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-primary-foreground shadow-md shadow-brand/30">
              <ShieldCheck className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight">
                Bharat Suraksha Connect
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Safety Beyond Borders
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 transition hover:bg-card/70"
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{
                  className:
                    "bg-brand text-primary-foreground shadow-md shadow-brand/25 hover:bg-brand",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="glass-soft hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:inline-flex">
              <span className="size-2 rounded-full bg-safe" /> Demo Data
            </span>
            <Link
              to="/admin"
              className="glass-soft hidden rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Admin
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen((v) => !v)}
              className="glass-soft grid size-9 place-items-center rounded-xl lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="glass rise-in mt-2 grid grid-cols-2 gap-2 rounded-2xl p-3 text-sm font-medium lg:hidden">
            {[...navItems, { to: "/admin", label: "Admin" } as const].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="glass-soft rounded-xl px-3 py-2.5"
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-brand text-primary-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        {title && (
          <div className="mb-5">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>

      <footer className="relative z-10 mx-auto max-w-7xl px-4 pb-10">
        <p className="text-center text-xs text-muted-foreground">
          Helping Indians abroad stay informed, connected, and safer during
          emergencies. · {DEMO_NOTICE}
        </p>
      </footer>
    </div>
  );
}
