import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/luciel", label: "Luciel" },
  { to: "/pricing", label: "Pricing" },
  { to: "/design-partners", label: "Design Partners" },
  { to: "/careers", label: "Careers", hiring: true },
  { to: "/changelog", label: "Changelog" },
  { to: "/contact", label: "Contact" },
];

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="VantageMind AI home">
    <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M16 18 L32 46 L48 18" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
    <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
      VantageMind <span className="text-muted-foreground font-normal">AI</span>
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
        scrolled ? "border-b border-border bg-background/80 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative text-sm transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <span className="inline-flex items-center gap-1.5">
                {l.label}
                {l.hiring && (
                  <span className="relative flex h-1.5 w-1.5" aria-label="We're hiring">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                )}
              </span>
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm">
            <Link to="/design-partners">Request Access</Link>
          </Button>
        </div>

        <button
          className="rounded-md border border-border p-2 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-narrow flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                {l.label}
                {l.hiring && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            ))}
            <div className="mt-3">
              <Button asChild size="sm" className="w-full">
                <Link to="/design-partners">Request Access</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
