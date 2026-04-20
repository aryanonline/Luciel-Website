import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { Logo } from "./Nav";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";
const CONTACT_EMAIL = "contact@vantagemind.ai";

export const Footer = () => (
  <footer className="border-t border-border">
    <div className="container-narrow py-16">
      <div className="grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The AI judgment layer.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Aryan Singh on LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div>
          <div className="eyebrow mb-4">Product</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/luciel" className="hover:text-foreground">Luciel</Link></li>
            <li><Link to="/security" className="hover:text-foreground">Security</Link></li>
            <li><Link to="/doctrine" className="hover:text-foreground">Doctrine</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Company</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Legal</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><span className="cursor-not-allowed opacity-60">Privacy</span></li>
            <li><span className="cursor-not-allowed opacity-60">Terms</span></li>
            <li><span className="cursor-not-allowed opacity-60">PIPEDA Statement</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
        © 2026 VantageMind AI · Markham, Ontario, Canada · PIPEDA-compliant by design
      </div>
    </div>
  </footer>
);
