import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { Logo } from "./Nav";
import { useContactModal } from "@/components/ContactModal";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";
const PRIVACY_EMAIL = "privacy@vantagemind.ai";

export const Footer = () => {
  const { open } = useContactModal();
  return (
    <footer className="border-t border-border">
      <div className="container-narrow py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Column 1 — Company identity */}
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              VantageMind AI<br />
              Markham, Ontario, Canada
            </p>
            <div className="mt-5">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aryan Singh on LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 — Products */}
          <div>
            <div className="eyebrow mb-4">Products</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/products/luciel" className="hover:text-foreground">Luciel</Link></li>
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <div className="eyebrow mb-4">Company</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy & Trust</Link></li>
              <li>
                <button onClick={open} className="text-left hover:text-foreground">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 — Privacy Officer */}
          <div>
            <div className="eyebrow mb-4">Privacy Officer</div>
            <a
              href={`mailto:${PRIVACY_EMAIL}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {PRIVACY_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          © 2026 VantageMind AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
