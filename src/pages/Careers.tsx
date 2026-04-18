import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow, FeatureCard, SectionHeading } from "@/components/Section";
import { CtaBlock } from "@/components/CtaBlock";
import { Button } from "@/components/ui/button";

export const roles = [
  {
    slug: "founding-engineer",
    title: "Founding Engineer",
    location: "Markham / Remote (Canada)",
    type: "Full-time",
    blurb: "Own large surfaces of Luciel end-to-end. Backend-leaning, FastAPI + Postgres + pgvector on AWS.",
  },
  {
    slug: "ai-infrastructure-engineer",
    title: "AI Infrastructure Engineer",
    location: "Remote (Canada)",
    type: "Full-time",
    blurb: "Routing, retrieval, evaluation, observability. The plumbing that makes the judgment layer trustworthy.",
  },
  {
    slug: "developer-relations",
    title: "Developer Relations",
    location: "Remote (Canada)",
    type: "Full-time",
    blurb: "Build the technical community around Luciel. Docs, talks, sample apps, design-partner enablement.",
  },
  {
    slug: "design-partner-lead",
    title: "Design Partner Lead",
    location: "Markham / Remote",
    type: "Full-time",
    blurb: "Own the design-partner motion end-to-end: outbound, qualification, pilot success, expansion.",
  },
];

const values = [
  { t: "Mission", d: "Make regulated AI buildable. The infrastructure layer for vertical AI in PIPEDA, HIPAA and SOC 2 environments." },
  { t: "Ownership", d: "Small team, real surfaces. You own outcomes, not tickets. Meaningful equity at the founding stage." },
  { t: "Regulated-AI depth", d: "We work close to the metal of consent, retention and tenancy — not on top of someone else's framework." },
  { t: "Remote-first Canada", d: "Headquartered in Markham, Ontario. Remote-friendly across Canada. Quarterly in-person weeks." },
];

const benefits = [
  "Competitive base + meaningful founding equity",
  "Comprehensive health & dental",
  "Home-office stipend",
  "Learning & conference budget",
  "Quarterly team weeks in-person",
  "PTO that you actually take",
];

const process = [
  { t: "Intro call", d: "30 minutes with the founder. What you've built, what you want next." },
  { t: "Technical deep-dive", d: "Working session on a real Luciel surface. No leetcode." },
  { t: "Founder + reference", d: "Long-form conversation + two references of your choice." },
  { t: "Offer", d: "Within a week of the final round. Transparent comp + equity." },
];

const Careers = () => {
  return (
    <SiteLayout>
      <Seo
        title="Careers"
        description="Join VantageMind AI. Build the judgment layer for regulated AI. Remote-first Canada, headquartered in Markham, Ontario."
        path="/careers"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-narrow pt-24 pb-16 md:pt-36 md:pb-24">
          <Eyebrow>CAREERS · WE'RE HIRING</Eyebrow>
          <h1 className="font-display mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Build the <span className="accent-text">judgment</span> layer.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Small founding team. Real production system. Regulated industries that actually need
            what we're building. If that's the kind of room you want to work in, read on.
          </p>
        </div>
      </section>

      {/* Why VantageMind */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="WHY VANTAGEMIND" title="What you're signing up for." />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <FeatureCard key={v.t} index={i + 1} title={v.t}>{v.d}</FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="OPEN ROLES" title="Hiring now." />
          <div className="mt-12 grid gap-4">
            {roles.map((r) => (
              <div key={r.slug} className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 md:flex-row md:items-center md:justify-between">
                <div className="md:max-w-2xl">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{r.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-primary" />{r.location}</span>
                    <span>·</span>
                    <span>{r.type}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{r.blurb}</p>
                </div>
                <Button asChild>
                  <Link to={`/careers/apply?role=${r.slug}`}>
                    Apply <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="HIRING PROCESS" title="Four steps. No surprises." />
          <div className="mt-14 grid gap-10 md:grid-cols-4">
            {process.map((p, i) => (
              <div key={p.t}>
                <div className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display mt-3 text-lg font-semibold tracking-tight">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="BENEFITS" title="The basics, done well." />
          <ul className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                <span className="text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBlock
        eyebrow="GENERAL APPLICATION"
        title="Don't see your role?"
        description="If you'd be a force multiplier here, tell us. We read every application."
      />
    </SiteLayout>
  );
};

export default Careers;
