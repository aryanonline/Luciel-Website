import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useContactModal } from "@/components/ContactModal";

type NavLink =
  | { kind: "link"; to: string; label: string }
  | { kind: "contact"; label: string };

const links: NavLink[] = [
  { kind: "link", to: "/products/luciel", label: "Luciel" },
  { kind: "link", to: "/platform", label: "Platform" },
  { kind: "link", to: "/trust", label: "Trust" },
  { kind: "link", to: "/about", label: "Company" },
  { kind: "contact", label: "Contact" },
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
  const { open: openContact } = useContactModal();

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

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => {
            if (l.kind === "contact")
              return (
                <button
                  key="contact"
                  onClick={openContact}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </button>
              );
            return (
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
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button size="sm" onClick={openContact}>Book a demo</Button>
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
            <Link to="/products/luciel" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Luciel</Link>
            <Link to="/platform" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Platform</Link>
            <Link to="/trust" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Trust</Link>
            <Link to="/about" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Company</Link>
            <button
              onClick={() => { setOpen(false); openContact(); }}
              className="rounded-md px-2 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Contact
            </button>
            <div className="mt-3">
              <Button size="sm" className="w-full" onClick={() => { setOpen(false); openContact(); }}>
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
