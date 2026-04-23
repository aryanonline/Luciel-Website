import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, Eyebrow, HairlineCard } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const tiers = [
  {
    name: "Individual",
    price: "$30–80/mo",
    who: "Solo agents",
    body: "Private AI assistant scoped to one agent. Your listings, your playbooks, your compliance docs.",
  },
  {
    name: "Team",
    price: "$300–800/mo",
    who: "Small teams (2–10 agents)",
    body: "Each agent gets their own isolated assistant. Shared brokerage knowledge, strict per-agent boundaries.",
  },
  {
    name: "Company",
    price: "From $2,000/mo",
    who: "Brokerages",
    body: "Brokerage-wide deployment with admin controls, audit trail, and dedicated onboarding.",
  },
];

const howItWorks = [
  {
    step: "STEP 01",
    title: "Onboard your brokerage",
    body: "One API call creates your tenant, default domain, retention policies, and admin key. 5 minutes. Option B: admin key only, no auto-generated assistants. You control what gets created.",
  },
  {
    step: "STEP 02",
    title: "Ingest your knowledge",
    body: "Upload listings, buyer guides, compliance docs, commission structures in PDF, DOCX, Markdown, HTML, CSV, or JSON. 7 format parsers, 4 chunking strategies (paragraph, sentence, fixed, semantic), three-level config inheritance (instance, domain, tenant). Versioned with source-ID tracking and soft-supersede.",
  },
  {
    step: "STEP 03",
    title: "Scope your agents",
    body: "Each agent gets their own isolated Luciel instance. Knowledge reads inherit upward (instance → domain → tenant → global). Writes are enforced downward by scope policy. A leaked chat key can only reach the one assistant it is bound to.",
  },
  {
    step: "STEP 04",
    title: "Chat with judgment",
    body: "Luciel answers using your knowledge, in your voice. Understands before acting. Asks only what improves judgment. Recommends with reasons and tradeoffs. Escalates before false confidence.",
  },
];

const differentiators = [
  {
    eyebrow: "ARCHITECTURE",
    title: "Scoped architecture, not flat chat",
    body: "Your brokerage is a tenant. Each department is a domain. Each person is an agent. Each assistant is a Luciel instance. Knowledge, sessions, traces, and memory all attach to the right scope level. Nothing leaks.",
  },
  {
    eyebrow: "RESIDENCY",
    title: "Canadian-hosted, PIPEDA-aligned",
    body: "AWS ca-central-1. TLS 1.3 with post-quantum key exchange. Encryption at rest. Consent-gated memory. Tenant-scoped retention with immutable deletion logs. Cross-tenant access blocked at the authorization layer.",
  },
  {
    eyebrow: "KNOWLEDGE",
    title: "Your knowledge, versioned",
    body: "7 format parsers behind a registry. Source-ID versioning with soft-supersede — replace a document and the old version is preserved for audit, not deleted. Every write guarded by scope policy with an audit row in the same database transaction.",
  },
  {
    eyebrow: "PORTABILITY",
    title: "Domain-agnostic by construction",
    body: "No vertical enums. No hardcoded role names. No tenant-ID branches in the codebase. Every vertical distinction lives in data, never in code. Real estate today — legal, engineering, healthcare tomorrow, as configuration and knowledge.",
  },
  {
    eyebrow: "DISCIPLINE",
    title: "Production-grade discipline",
    body: "Tagged releases with reproducible verification. 10-pillar end-to-end verification suite covering onboarding, scope isolation, knowledge ingestion, chat retrieval, PIPEDA retention, cascade deactivation, migration integrity, and teardown. Documented 15-minute rollback path on every release.",
  },
];

const moat = [
  ["LAYER 01", "Judgment quality", "One fixed Luciel Core persona that does not drift across deployments."],
  ["LAYER 02", "Hierarchical data layer", "Tenant, domain, agent, Luciel instance. Four levels of scoped isolation."],
  ["LAYER 03", "Cross-client feedback loops", "Aggregated insights across tenants with strict isolation preserved."],
  ["LAYER 04", "Deep workflow integration", "Real tool calls, not just chat (coming in our roadmap)."],
  ["LAYER 05", "Domain-agnostic architecture", "Ships to new verticals as config and knowledge, not code."],
];

const roadmap = [
  "Embeddable chat widget for tenant websites",
  "Hierarchical tenant dashboards (platform, tenant, domain, agent views)",
  "Workflow actions (book appointments, send emails, create leads, query databases)",
  "Evaluation framework for automated quality scoring",
  "Multi-vertical expansion framework",
  "Luciel Councils: multi-assistant orchestration within a scope",
  "Hybrid retrieval: graph + vector search",
];

const Luciel = () => {
  const { open } = useContactModal();
  return (
    <SiteLayout>
      <Seo
        title="Luciel — VantageMind AI"
        description="Luciel is a deployable AI judgment layer with one fixed identity, scoped per tenant, domain, and agent. Canadian-hosted. PIPEDA-aligned."
        path="/products/luciel"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-10 -z-10 hidden md:block" aria-hidden="true">
          <LucielOrb size={420} echo />
        </div>
        <div className="container-narrow pt-24 pb-20 md:pt-36 md:pb-28">
          <Eyebrow>LUCIEL · A VANTAGEMIND PRODUCT</Eyebrow>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Luciel — <span className="accent-text">one fixed mind, infinitely many scoped instances.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A deployable AI judgment layer that specializes for your business through configuration
            and knowledge — never by forking code. Real estate today. Legal, mortgage, and property
            management next.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={open}>Book a design partner demo</Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#pricing">See pricing →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Status banner */}
      <section className="border-t border-border">
        <FadeIn className="container-narrow py-10">
          <div className="flex flex-col items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">Current status</div>
              <p className="mt-2 text-foreground">
                Live on production at api.vantagemind.ai. Onboarding 3–5 GTA brokerages as design partners.
              </p>
            </div>
            <Button onClick={open}>Become a design partner</Button>
          </div>
        </FadeIn>
      </section>

      {/* What Luciel actually is */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHAT LUCIEL ACTUALLY IS" title="Not a chatbot wrapper. A judgment layer." />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              Luciel is a domain-adaptive AI judgment layer with one fixed identity — calm,
              perceptive, direct, honest — that specializes for any company through a four-level
              hierarchy: <span className="text-foreground">tenant</span> (your brokerage),{" "}
              <span className="text-foreground">domain</span> (sales, property management, support),{" "}
              <span className="text-foreground">agent</span> (the person), and{" "}
              <span className="text-foreground">Luciel instance</span> (the scoped assistant).
            </p>
            <p>
              Every child Luciel is assembled at runtime from the core persona, tenant policy,
              domain knowledge, agent role, and per-user memory. The core reasoning never drifts
              across deployments. Tenant configurations add to it — they can never override it.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section border-t border-border scroll-mt-24">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="HOW IT WORKS" title="From zero to scoped assistants in four steps." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {howItWorks.map((s) => (
              <HairlineCard key={s.step} eyebrow={s.step} title={s.title}>
                {s.body}
              </HairlineCard>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* What makes Luciel different */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHAT MAKES LUCIEL DIFFERENT" title="Five design choices, encoded into the system." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <HairlineCard key={d.title} eyebrow={d.eyebrow} title={d.title}>
                {d.body}
              </HairlineCard>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Five-layer moat */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="THE FIVE-LAYER MOAT" title="Why Luciel compounds over time." />
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
            {moat.map(([k, title, body]) => (
              <div key={k} className="grid gap-3 border-t border-border p-5 first:border-t-0 md:grid-cols-[200px_1fr]">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{k}</div>
                <div>
                  <div className="font-display text-lg tracking-tight text-foreground">{title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section border-t border-border scroll-mt-24">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="PRICING"
            title="Bottom-up. Start with one agent. Expand as you go."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.name} className="flex flex-col rounded-xl border border-border bg-card p-7">
                <div className="eyebrow">{t.who}</div>
                <h3 className="font-display mt-3 text-2xl tracking-tight text-foreground">{t.name}</h3>
                <div className="mt-3 font-display text-3xl tracking-tight text-primary">{t.price}</div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
            <span className="text-foreground">Bottom-up expansion:</span> when an individual agent's
            brokerage upgrades to the Company tier, the individual subscription pro-rates as credit
            toward the company plan. Early adopters pay you back.
          </p>
        </FadeIn>
      </section>

      {/* Roadmap */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="ROADMAP" title="What is on our roadmap." />
          <ul className="mt-10 max-w-3xl space-y-3 text-muted-foreground">
            {roadmap.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      {/* Current status */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="CURRENT STATUS" title="Live, and onboarding design partners." />
          <p className="mt-8 max-w-3xl text-muted-foreground">
            Luciel is live on production at{" "}
            <span className="text-foreground">api.vantagemind.ai</span>. We are currently onboarding
            3–5 GTA brokerages as design partners before public launch. Design partners get founding
            pricing, direct access to the founder, and a real say in the product roadmap.
          </p>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-narrow section text-center">
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            Become a Luciel design partner.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            Founding pricing. Direct access to the founder. A real say in what we build next.
          </p>
          <div className="mt-9">
            <Button size="lg" onClick={open}>Become a design partner</Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Luciel;
