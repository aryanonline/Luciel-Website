import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { Logo } from "./Nav";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="container-narrow py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The judgment layer for regulated AI products. Built in Markham, Ontario.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-4">Product</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/luciel" className="hover:text-foreground">Luciel</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/design-partners" className="hover:text-foreground">Design Partners</Link></li>
              <li><Link to="/changelog" className="hover:text-foreground">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-4">Careers</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/careers" className="inline-flex items-center gap-2 hover:text-foreground">
                  Open roles
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Hiring
                  </span>
                </Link>
              </li>
              <li><Link to="/careers#process" className="hover:text-foreground">Hiring process</Link></li>
              <li><Link to="/careers/apply" className="hover:text-foreground">General application</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-4">Company</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><a href="mailto:hello@vantagemind.ai" className="hover:text-foreground">hello@vantagemind.ai</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>VantageMind AI · Markham, Ontario · Canada</div>
          <div>© {year} VantageMind AI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
