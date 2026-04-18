import { Link } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow, SectionHeading } from "@/components/Section";
import { CtaBlock } from "@/components/CtaBlock";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";

export const tiers = [
  {
    id: "developer",
    eyebrow: "DEVELOPER",
    name: "Developer",
    price: "$0",
    cadence: "forever",
    blurb: "Sandbox access for prototypes and evaluation.",
    features: [
      "10,000 judgments / month",
      "Single tenant",
      "Community support",
      "OpenAI + Anthropic routing",
      "PIPEDA-aligned defaults",
      "API + dashboard access",
    ],
    cta: { label: "Start free", to: "/checkout?plan=developer" },
    recommended: false,
  },
  {
    id: "team",
    eyebrow: "TEAM",
    name: "Team",
    price: "$499",
    cadence: "/ month",
    blurb: "Production workloads with the full judgment layer.",
    features: [
      "250,000 judgments / month",
      "SSO (SAML / OIDC)",
      "Audit logs + retention controls",
      "Email support, 1 business day",
      "Per-tenant isolation",
      "Multi-LLM routing",
    ],
    cta: { label: "Start Team plan", to: "/checkout?plan=team" },
    recommended: true,
  },
  {
    id: "enterprise",
    eyebrow: "ENTERPRISE",
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    blurb: "For regulated workloads with residency and SLA requirements.",
    features: [
      "Unlimited judgments",
      "PIPEDA + SOC 2 posture (target)",
      "Dedicated solutions architect",
      "99.9% SLA",
      "On-prem / VPC option",
      "Custom data residency",
    ],
    cta: { label: "Talk to sales", to: "/contact?topic=enterprise" },
    recommended: false,
  },
];

const compareRows = [
  ["Monthly judgments", "10k", "250k", "Unlimited"],
  ["Tenants", "1", "Unlimited", "Unlimited"],
  ["SSO (SAML / OIDC)", false, true, true],
  ["Audit logs", false, true, true],
  ["Per-tenant retention controls", false, true, true],
  ["Dedicated SA", false, false, true],
  ["SLA", false, "—", "99.9%"],
  ["On-prem / VPC", false, false, true],
  ["PIPEDA posture", true, true, true],
  ["SOC 2 posture", "Target", "Target", "Target"],
] as const;

export const PricingTiers = () => (
  <div className="grid gap-5 md:grid-cols-3">
    {tiers.map((t) => (
      <div
        key={t.id}
        className={`relative flex flex-col rounded-xl border bg-card p-6 transition-colors ${
          t.recommended ? "border-primary/60 ring-1 ring-primary/40" : "border-border"
        }`}
      >
        {t.recommended && (
          <div className="absolute -top-3 left-6 rounded-full border border-primary/40 bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Recommended
          </div>
        )}
        <div className="eyebrow">{t.eyebrow}</div>
        <div className="mt-5 flex items-baseline gap-2">
          <div className="font-display text-4xl font-semibold tracking-tight">{t.price}</div>
          <div className="text-sm text-muted-foreground">{t.cadence}</div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t.blurb}</p>
        <ul className="mt-6 space-y-3 text-sm">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check size={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="text-foreground/90">{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 pt-4">
          <Button asChild className="w-full" variant={t.recommended ? "default" : "outline"}>
            <Link to={t.cta.to}>{t.cta.label}</Link>
          </Button>
        </div>
      </div>
    ))}
  </div>
);

const Pricing = () => {
  return (
    <SiteLayout>
      <Seo
        title="Pricing"
        description="Luciel pricing — Developer, Team and Enterprise. Built for regulated AI workloads with PIPEDA posture and per-tenant isolation."
        path="/pricing"
      />

      {/* Hero with orb echo */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 -top-20 -z-10 hidden md:block"
          aria-hidden="true"
        >
          <LucielOrb size={360} echo />
        </div>
        <div className="container-narrow pt-24 pb-16 md:pt-36 md:pb-20">
          <Eyebrow>PRICING</Eyebrow>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Simple pricing for <span className="accent-text">serious</span> workloads.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Start free. Move to Team when you ship to production. Talk to us when residency, SLA,
            or on-prem matter.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <PricingTiers />
        </div>
      </section>

      {/* Compare */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="COMPARE" title="Feature comparison." />
          <div className="mt-12 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr className="text-left">
                  <th className="px-5 py-4 font-medium text-muted-foreground">Feature</th>
                  <th className="px-5 py-4 font-medium">Developer</th>
                  <th className="px-5 py-4 font-medium text-primary">Team</th>
                  <th className="px-5 py-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label, d, te, e], i) => (
                  <tr key={i} className="border-t border-border bg-card/40">
                    <td className="px-5 py-4 text-muted-foreground">{label}</td>
                    <Cell v={d} />
                    <Cell v={te} />
                    <Cell v={e} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBlock eyebrow="GET STARTED" title="Pick a plan or talk to us." description="Start in the sandbox today. Talk to us when you're ready for production." />
    </SiteLayout>
  );
};

const Cell = ({ v }: { v: string | boolean }) => (
  <td className="px-5 py-4">
    {typeof v === "boolean" ? (
      v ? <Check size={16} className="text-primary" /> : <Minus size={16} className="text-muted-foreground" />
    ) : (
      <span className="text-foreground/90">{v}</span>
    )}
  </td>
);

export default Pricing;
