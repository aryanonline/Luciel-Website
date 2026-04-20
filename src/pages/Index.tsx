import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, Eyebrow, HairlineCard } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";

const securityBadges = [
  "PIPEDA",
  "AWS ca-central-1",
  "Per-tenant isolation",
  "Scope-enforced permissions",
  "Versioned knowledge",
  "Full audit trail",
  "Consent-gated memory",
  "Retention policies",
];

const differences = [
  { n: "01", t: "One fixed persona, never reskinned.", d: "The persona is the product. Same Luciel for every tenant, every domain, every turn." },
  { n: "02", t: "Three-level hierarchy: tenant → domain → agent.", d: "Built into every layer of the system, not bolted on after the fact." },
  { n: "03", t: "Cross-tenant pattern learning with strict isolation.", d: "Patterns improve the persona; data never crosses a tenant boundary." },
  { n: "04", t: "PIPEDA-native, Canadian-resident infrastructure.", d: "AWS ca-central-1. Consent-gated memory. Retention enforced in the core." },
  { n: "05", t: "Judgment, not retrieval. Luciel takes a position.", d: "A retrieved answer is not enough. Luciel recommends with reasons and tradeoffs." },
];

const verticals = [
  { live: true,  t: "Residential Real Estate", d: "Live with REMAX Crossroads as design partner." },
  { live: false, t: "Insurance Brokerage",      d: "On the roadmap. Submission triage and renewal prep." },
  { live: false, t: "Wealth Advisory",          d: "On the roadmap. Client intent, KYC continuity, suitability notes." },
  { live: false, t: "Legal Intake",             d: "On the roadmap. Conflict checks, matter scoping, intake reasoning." },
  { live: false, t: "Healthcare Navigation",    d: "On the roadmap. Pathway guidance with clinician-in-the-loop escalation." },
  { live: false, t: "Higher-Ed Advising",       d: "On the roadmap. Program fit, course planning, outreach continuity." },
];

const Index = () => {
  const { open } = useContactModal();

  return (
    <SiteLayout>
      <Seo
        title="VantageMind AI — The AI judgment layer"
        description="Luciel is a deployable AI judgment layer for firms where judgment matters. Calm, perceptive, governed, Canadian-resident."
        path="/"
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-narrow grid min-h-[88vh] items-center gap-12 pt-24 pb-16 md:grid-cols-[1.05fr_1fr] md:pt-28">
          <div>
            <Eyebrow>VANTAGEMIND AI</Eyebrow>
            <h1 className="font-display mt-6 text-5xl leading-[1.0] tracking-tight md:text-7xl">
              One mind. <br />Many deployments. <br />
              <span className="accent-text">No reskin.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Luciel is a deployable AI judgment layer. A calm, perceptive intelligence your firm
              embeds into client-facing work — fluent in your domain, governed by your policies,
              consistent across every touchpoint.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={open}>Request a design-partner pilot</Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/doctrine">Read the Doctrine</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <LucielOrb size={420} />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="THE PROBLEM"
            title="Most AI tools answer questions. Luciel figures out what your clients actually want."
          />
          <div className="mt-12 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              Generic chatbots produce surface-level replies. They retrieve, summarize, and move
              on. They have no sense of what a client is actually trying to accomplish, no fluency
              in your domain, and no permission to act on anything material.
            </p>
            <p>
              The work your firm does is different. Your clients arrive with vague intent and
              meaningful stakes. They need a calm, perceptive partner that asks the right
              questions, reasons over your firm's knowledge and policies, and recommends with
              confidence — or escalates honestly when it should not.
            </p>
            <p>
              Luciel is built for that work. Not a chatbot. A judgment layer.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* WHAT LUCIEL IS */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHAT LUCIEL IS" title="Three things at once." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <HairlineCard eyebrow="ONE" title="A fixed mind">
              Calm, perceptive, direct, honest. Luciel's persona is permanent. Tenants do not
              reskin it. The persona is the product.
            </HairlineCard>
            <HairlineCard eyebrow="TWO" title="A domain runtime">
              Per-tenant configuration of knowledge, tools, and policies. New verticals are added
              as real domain modules — not rewritten prompts.
            </HairlineCard>
            <HairlineCard eyebrow="THREE" title="A governed platform">
              Per-tenant isolation, scope-enforced permissions, versioned knowledge, full audit,
              and Canadian-resident infrastructure by default.
            </HairlineCard>
          </div>
        </FadeIn>
      </section>

      {/* ARCHITECTURE */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="ARCHITECTURE AT A GLANCE"
            title="Tenant. Domain. Agent. One mind across all three."
          />
          <div className="mt-12">
            <ArchitectureDiagram />
          </div>
        </FadeIn>
      </section>

      {/* WHY NOW */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHY NOW" title="The model layer is commoditizing." />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              The frontier model providers are converging on similar capabilities at similar
              prices. Within a few quarters, raw model access will be a utility — fast, cheap, and
              broadly available. The differentiation that mattered last year will not matter next
              year.
            </p>
            <p>
              Durable value will not accrue at the model layer. It will accrue to whoever owns the
              judgment layer on top: the persona, the domain reasoning, the governance, the
              consistency. The layer that turns a model into something a regulated firm can
              actually deploy in front of its clients.
            </p>
            <p>
              That layer is what we are building. Now is the moment to build it.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* WHAT MAKES LUCIEL DIFFERENT */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="WHAT MAKES LUCIEL DIFFERENT"
            title="Five things, and they are all architectural."
          />
          <div className="mt-12 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {differences.map((d) => (
              <div key={d.n} className="grid gap-4 p-7 md:grid-cols-[80px_1fr_1.4fr]">
                <div className="font-mono text-sm text-primary">{d.n}</div>
                <div className="font-display text-xl tracking-tight text-foreground">{d.t}</div>
                <div className="text-sm leading-relaxed text-muted-foreground">{d.d}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* SECURITY TEASER */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="SECURITY"
            title="Compliance isn't a feature we added. It's the foundation every tenant is built on."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {securityBadges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground"
              >
                {b}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="ghost"><Link to="/security">Read the security posture →</Link></Button>
          </div>
        </FadeIn>
      </section>

      {/* DOCTRINE PULL-QUOTE */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <blockquote className="font-display mx-auto max-w-4xl text-center text-3xl leading-[1.25] tracking-tight text-foreground md:text-[40px]">
            "Luciel is a domain-adaptive intelligence with a fixed, deeply perceptive persona —
            one that discovers human intent, reasons over domain-specific data, and delivers
            judgment your team can act on."
          </blockquote>
          <div className="mt-8 text-center text-sm uppercase tracking-[0.22em] text-muted-foreground">
            — The VantageMind Doctrine
          </div>
        </FadeIn>
      </section>

      {/* VERTICALS */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="VERTICALS"
            title="Built for industries where judgment matters."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verticals.map((v) => (
              <div key={v.t} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="font-display text-xl tracking-tight text-foreground">{v.t}</div>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-[0.18em] ${
                      v.live ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {v.live ? "Live" : "Roadmap"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* FOUNDER STRIP */}
      <section className="border-t border-border">
        <div className="container-narrow flex flex-col items-center gap-6 py-14 md:flex-row md:justify-between md:gap-10">
          <div className="flex items-center gap-5">
            <LucielOrb size={64} />
            <div>
              <div className="font-display text-lg text-foreground">Aryan Singh, Founder</div>
              <div className="text-sm text-muted-foreground">
                Building the judgment layer from Markham, Ontario.
              </div>
            </div>
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </section>

      {/* FINAL CTA — inlined per spec (no shared component) */}
      <section className="border-t border-border">
        <div className="container-narrow section">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
              We are taking on two design-partner tenants in 2026.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              If you run a brokerage, advisory, or firm where judgment matters — let us talk.
            </p>
            <div className="mt-9">
              <Button size="lg" onClick={open}>Start the conversation</Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
