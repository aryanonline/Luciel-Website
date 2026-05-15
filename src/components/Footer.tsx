import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { Logo } from "./Nav";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";
const PRIVACY_EMAIL = "privacy@vantagemind.ai";

export const Footer = () => (
  <footer className="border-t border-border">
    <div className="container-narrow py-16">
      <div className="grid gap-12 md:grid-cols-4">
        {/* Product */}
        <div>
          <div className="eyebrow mb-4">Product</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/products/luciel" className="hover:text-foreground">Luciel</Link></li>
            <li><Link to="/platform" className="hover:text-foreground">Platform</Link></li>
            <li><Link to="/trust" className="hover:text-foreground">Trust</Link></li>
            <li><Link to="/security" className="hover:text-foreground">Security</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <div className="eyebrow mb-4">Company</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/doctrine" className="hover:text-foreground">How Luciel thinks</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className="eyebrow mb-4">Legal</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/legal/terms" className="hover:text-foreground">Terms</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link></li>
          </ul>
        </div>

        {/* Privacy Team */}
        <div>
          <div className="eyebrow mb-4">Privacy Team</div>
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {PRIVACY_EMAIL}
          </a>
        </div>
      </div>

      {/* Identity block */}
      <div className="mt-12 grid gap-6 border-t border-border pt-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            VantageMind AI<br />
            Markham, Ontario, Canada
          </p>
        </div>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Linkedin size={16} />
        </a>
      </div>

      <div className="mt-10 text-xs text-muted-foreground">
        © 2026 VantageMind AI. All rights reserved.
      </div>
    </div>
  </footer>
);
