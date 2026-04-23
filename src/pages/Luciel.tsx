import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, Eyebrow, HairlineCard } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
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

const Luciel = () => {
  const { open } = useContactModal();
  return (
    <SiteLayout>
      <Seo
        title="Luciel — VantageMind AI"
        description="Luciel is a private AI assistant for real estate brokerages. Per-agent isolation. Canadian data residency. PIPEDA-aligned."
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
            A private AI assistant for <span className="accent-text">real estate brokerages.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Luciel is a domain-adaptive AI judgment layer scoped per agent. Trained on your
            brokerage's listings, playbooks, and compliance documents. Data stays in Canada. Each
            agent gets their own isolated assistant; nothing leaks across the team.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={open}>Book your design-partner demo</Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#pricing">See pricing →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="border-t border-border">
        <FadeIn className="container-narrow py-10">
          <div className="flex flex-col items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">Current status</div>
              <p className="mt-2 text-foreground">
                Onboarding 3–5 GTA design partners. Live deployments running on AWS ca-central-1.
              </p>
            </div>
            <Button onClick={open}>Apply as a design partner</Button>
          </div>
        </FadeIn>
      </section>

      {/* Who Luciel is */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHO LUCIEL IS" title="The persona is the product." />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              Luciel is calm, perceptive, direct, and honest. That description is not marketing
              copy. It is the operating posture, encoded into the system.
            </p>
            <p>
              Calm because it does not perform certainty it has not earned. Perceptive because it
              reads intent before it answers. Direct because it states a position. Honest because
              it escalates when it should and admits what it does not know.
            </p>
            <p>
              The same Luciel a broker trusts at 9am is the one a client trusts at midnight. That
              consistency is a deliberate design choice.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* What Luciel does */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHAT LUCIEL DOES" title="Intent → Reasoning → Recommendation → Action." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <HairlineCard eyebrow="STEP 01" title="Discover intent">
              Most clients arrive with a vague request and a clear underlying need. Luciel surfaces
              the underlying need before it commits to an answer.
            </HairlineCard>
            <HairlineCard eyebrow="STEP 02" title="Reason over your domain">
              Luciel reasons over your brokerage's knowledge base, vocabulary, policies, and
              jurisdiction-specific rules — not a generic web index.
            </HairlineCard>
            <HairlineCard eyebrow="STEP 03" title="Recommend, with reasons">
              Luciel takes a position. Every recommendation comes with the reasoning, the
              tradeoffs, and the relevant sources.
            </HairlineCard>
            <HairlineCard eyebrow="STEP 04" title="Act, where authorized">
              Where you grant authority, Luciel can take action through scoped tools. Where
              authority is missing, Luciel escalates to a human.
            </HairlineCard>
          </div>
        </FadeIn>
      </section>

      {/* Architecture */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="HOW LUCIEL IS DEPLOYED"
            title="Three-level hierarchy. One mind."
          />
          <div className="mt-12">
            <ArchitectureDiagram />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <HairlineCard eyebrow="TENANT" title="Your brokerage">
              Identity, branding, billing, and policy boundary. Per-tenant isolation enforced at
              the data and API layers.
            </HairlineCard>
            <HairlineCard eyebrow="DOMAIN" title="Real estate">
              Knowledge, vocabulary, tool catalog, and escalation rules for residential real
              estate. Configured, not coded.
            </HairlineCard>
            <HairlineCard eyebrow="AGENT" title="Each agent">
              A scoped role with a defined set of tools, knowledge slices, and permissions.
              Composable, auditable, replaceable.
            </HairlineCard>
          </div>
        </FadeIn>
      </section>

      {/* Runtime loop */}
      <section id="how-it-works" className="section border-t border-border scroll-mt-24">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="RUNTIME LOOP" title="What happens on every turn." />
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
            {[
              ["INPUT",              "Agent message arrives, bound to a tenant, domain, agent, and authenticated identity."],
              ["SCOPE RESOLUTION",   "Permissions evaluated against tenant, domain, and agent boundaries before any read."],
              ["KNOWLEDGE RETRIEVAL","Versioned embeddings queried within the agent's allowed knowledge slice."],
              ["REASONING",          "Luciel reasons over retrieved context, prior memory (if consented), and the active policy."],
              ["OUTPUT",             "A position, with reasoning and source attribution. Tool calls, if authorized."],
              ["AUDIT",              "Full trace recorded: model, tools, memory touched, policy flags, escalations."],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-3 border-t border-border p-5 first:border-t-0 md:grid-cols-[200px_1fr]">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{k}</div>
                <div className="text-sm leading-relaxed text-muted-foreground">{v}</div>
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
            Luciel is designed to grow with you. Start with one agent on the Individual tier, expand
            to the team, then deploy across the brokerage. No forced rip-and-replace — each tier
            builds on the previous one.
          </p>
        </FadeIn>
      </section>

      {/* Memory and consent */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>MEMORY AND CONSENT</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-[44px]">
              Memory is opt-in. Consent is timestamped. Withdrawable anytime.
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Personal memory is never stored or retrieved without explicit, timestamped consent.
              Consent is per-purpose and per-tenant. Withdrawal is a first-class operation, not a
              support ticket.
            </p>
            <p>
              Retention windows are enforced at the storage layer with immutable deletion logs.
              When a record is gone, it is gone, and we can prove it.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* What Luciel is not */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHAT LUCIEL IS NOT" title="Boundaries, stated plainly." />
          <ul className="mt-10 max-w-3xl space-y-4 text-muted-foreground">
            <li><span className="text-foreground">Not a chatbot.</span> Chatbots are reactive. Luciel takes positions and drives toward outcomes.</li>
            <li><span className="text-foreground">Not a model wrapper.</span> The judgment layer is the product. Models are interchangeable underneath.</li>
            <li><span className="text-foreground">Not reskinnable.</span> The persona does not change per tenant. Domain and policy do.</li>
            <li><span className="text-foreground">Not a CRM.</span> Luciel integrates with systems of record. It does not replace them.</li>
          </ul>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-narrow section text-center">
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            Ready to deploy Luciel at your brokerage?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            We're onboarding 3–5 GTA design partners now.
          </p>
          <div className="mt-9">
            <Button size="lg" onClick={open}>Book your design-partner demo</Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Luciel;
