import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useContactModal } from "@/components/ContactModal";

const links = [
  { to: "/luciel", label: "Luciel" },
  { to: "/doctrine", label: "Doctrine" },
  { to: "/security", label: "Security" },
  { to: "/about", label: "About" },
];

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="VantageMind AI home">
    <span
      className="inline-block h-5 w-5 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 35% 30%, hsl(var(--accent-to)) 0%, hsl(var(--accent-from)) 55%, hsl(232 70% 14%) 100%)",
        boxShadow: "0 0 12px hsl(var(--accent-from) / 0.5)",
      }}
      aria-hidden="true"
    />
    <span className="font-display text-[18px] tracking-tight text-foreground">
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

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
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
          <Button size="sm" onClick={openContact}>Request pilot</Button>
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
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3">
              <Button size="sm" className="w-full" onClick={() => { setOpen(false); openContact(); }}>
                Request pilot
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
