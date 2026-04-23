import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useContactModal } from "@/components/ContactModal";

type NavLink =
  | { kind: "link"; to: string; label: string }
  | { kind: "products"; label: string }
  | { kind: "contact"; label: string };

const links: NavLink[] = [
  { kind: "link", to: "/", label: "Home" },
  { kind: "products", label: "Products" },
  { kind: "link", to: "/about", label: "About" },
  { kind: "link", to: "/privacy", label: "Privacy & Trust" },
  { kind: "contact", label: "Contact" },
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

const ProductsDropdown = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isActive = pathname.startsWith("/products");

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-products-dropdown]")) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div className="relative" data-products-dropdown>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 text-sm transition-colors ${
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Products <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-3 w-64 rounded-xl border border-border bg-card p-2 shadow-lg">
          <Link
            to="/products/luciel"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
          >
            <div className="font-medium">Luciel</div>
            <div className="text-xs text-muted-foreground">AI assistant for real estate brokerages</div>
          </Link>
          <div className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
            <div className="font-medium">More coming soon</div>
            <div className="text-xs">Legal · Mortgage · Property management</div>
          </div>
        </div>
      )}
    </div>
  );
};

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
          {links.map((l) => {
            if (l.kind === "products") return <ProductsDropdown key="products" />;
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
            <div className="px-2 pt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Products</div>
            <Link to="/products/luciel" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Luciel</Link>
            <div className="rounded-md px-2 py-2 text-sm text-muted-foreground/60">More coming soon</div>
            <Link to="/about" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">About</Link>
            <Link to="/privacy" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Privacy & Trust</Link>
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
