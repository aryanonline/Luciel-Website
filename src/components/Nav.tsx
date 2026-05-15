import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { trackCta } from "@/lib/analytics";

type NavLink = { to: string; label: string };

const links: NavLink[] = [
  { to: "/products/luciel", label: "Luciel" },
  { to: "/platform", label: "Platform" },
  { to: "/trust", label: "Trust" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "Company" },
  { to: "/contact", label: "Contact" },
];

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="VantageMind AI home">
    <span
      className="inline-block h-[18px] w-[18px] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 35% 30%, hsl(var(--accent-to)) 0%, hsl(var(--accent-from)) 55%, hsl(222 30% 10%) 100%)",
        boxShadow: "0 0 10px hsl(var(--accent-from) / 0.35)",
      }}
      aria-hidden="true"
    />
    <span className="font-display text-[19px] tracking-tight text-foreground">
      VantageMind <span className="text-muted-foreground">AI</span>
    </span>
  </Link>
);

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-background/85 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {l.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {/* Step 30a.2-pilot — pilot CTA precedes the demo CTA so the
              90-day / $100 offer is the first thing scanning eyes hit.
              Target is /pricing (NOT /signup) because the locked nav
              doctrine is "compare plans first, then commit" — the
              pricing page surfaces the pilot banner + the day-91
              conversion table + the refund policy in one read. */}
          <Button asChild size="sm">
            <Link to="/pricing" onClick={() => trackCta("Start 90-day pilot", pathname)}>
              Start 90-day pilot
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link to="/contact" onClick={() => trackCta("Book a demo", pathname)}>Book a demo</Link>
          </Button>
        </div>

        <button
          className="rounded-md border border-border p-2 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-narrow flex flex-col gap-1 py-4">
            <Link to="/" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Home</Link>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                {l.label}
              </Link>
            ))}
            <div className="mt-3 space-y-2">
              {/* Same pilot-first ordering on mobile. */}
              <Button asChild size="sm" className="w-full">
                <Link to="/pricing" onClick={() => trackCta("Start 90-day pilot", pathname)}>
                  Start 90-day pilot
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link to="/contact" onClick={() => trackCta("Book a demo", pathname)}>Book a demo</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
