import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, Eyebrow, HairlineCard } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const Luciel = () => {
  const { open } = useContactModal();
  return (
    <SiteLayout>
      <Seo
        title="Luciel — VantageMind AI"
        description="A domain-adaptive intelligence with one fixed persona. Discovers intent, reasons over your domain, recommends with audit."
        path="/luciel"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-10 -z-10 hidden md:block" aria-hidden="true">
          <LucielOrb size={420} echo />
        </div>
        <div className="container-narrow pt-24 pb-20 md:pt-36 md:pb-28">
          <Eyebrow>LUCIEL</Eyebrow>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            A calm, perceptive intelligence — <span className="accent-text">deployed</span>, not chatted with.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Luciel is a domain-adaptive AI judgment layer. One fixed persona. Per-tenant
            knowledge, tools, and policies. Built for firms where the answer must be earned and
            the audit trail must be honest.
          </p>
        </div>
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
              Luciel reasons over your firm's knowledge base, vocabulary, policies, and
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

      {/* Deployment */}
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
            <HairlineCard eyebrow="TENANT" title="Your firm">
              Identity, branding, billing, and policy boundary. Per-tenant isolation enforced at
              the data and API layers.
            </HairlineCard>
            <HairlineCard eyebrow="DOMAIN" title="Your vertical">
              Knowledge, vocabulary, tool catalog, and escalation rules for a specific industry.
              Configured, not coded.
            </HairlineCard>
            <HairlineCard eyebrow="AGENT" title="Your task">
              A scoped role with a defined set of tools, knowledge slices, and permissions.
              Composable, auditable, replaceable.
            </HairlineCard>
          </div>
        </FadeIn>
      </section>

      {/* Runtime loop */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="RUNTIME LOOP" title="What happens on every turn." />
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
            {[
              ["INPUT",              "User message arrives, bound to a tenant, domain, agent, and authenticated identity."],
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

      {/* Escalation */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>ESCALATION</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-[44px]">
              The human keeps the wheel.
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Luciel escalates before false confidence. When a question crosses a policy boundary,
              touches a material decision, or sits outside the agent's competence, Luciel hands
              off to a named human with full context.
            </p>
            <p>
              Escalation is not a failure mode. It is part of the product.
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
            Ready to deploy a judgment layer?
          </h2>
          <div className="mt-9">
            <Button size="lg" onClick={open}>Request a design-partner pilot</Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Luciel;
