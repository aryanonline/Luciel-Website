import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, Eyebrow, FeatureCard } from "@/components/Section";
import { CtaBlock } from "@/components/CtaBlock";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucielOrb } from "@/components/LucielOrb";
import { PricingTiers } from "./Pricing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const primitives = [
  { t: "Auth", d: "Tenant-scoped identity and session handling. Every request is attributable, every action is policy-checked." },
  { t: "Memory", d: "Long-lived semantic memory backed by pgvector. Per-tenant, retention-aware, with deterministic recall." },
  { t: "Consent", d: "Explicit, revocable, per-purpose. No data flows to a model unless consent for that purpose is on file." },
  { t: "Retention", d: "Per-tenant retention windows enforced at the storage layer. Deletes are real, auditable, and provable." },
  { t: "Multi-tenancy", d: "Hard isolation at the row, vector, and prompt level. One bug should never become every customer's bug." },
];

const compliance = [
  "PIPEDA-compliant today",
  "SOC 2 on the roadmap",
  "Consent gating per purpose",
  "Per-tenant data retention",
  "Scope enforcement at the policy layer",
  "Full per-turn traceability",
  "Multi-LLM routing (OpenAI + Anthropic)",
  "Multi-tenant isolation",
];

const faq = [
  {
    q: "How is this different from LangChain, LlamaIndex or CrewAI?",
    a: "Those are agent frameworks — they help you build behavior. Luciel is the layer underneath: identity, memory, consent, retention, tenancy, and policy. You can use Luciel with any agent framework. We're solving the regulated-infrastructure problem, not the agent-orchestration problem.",
  },
  {
    q: "Who owns the data?",
    a: "Your tenants own their data. Luciel is built so that data residency, retention windows, and deletion are first-class — not bolted on. We default to AWS ca-central-1.",
  },
  {
    q: "What LLMs does Luciel support?",
    a: "Today: OpenAI and Anthropic, with first-class multi-LLM routing. The judgment layer is model-agnostic by design — additional providers are a configuration change, not a rewrite.",
  },
  {
    q: "Can I self-host?",
    a: "Self-hosting is on the roadmap for design partners with a hard residency requirement. Today we run as a managed service in AWS ca-central-1.",
  },
  {
    q: "Is it ready for production?",
    a: "Luciel is production-deployed on AWS today. We're at 24 of 35 engineering milestones. We are pre-revenue and selecting design partners — production-ready for pilots, not yet generally available.",
  },
  {
    q: "How do I become a design partner?",
    a: "Apply on the Design Partners page. We're selecting a small group of regulated-business teams for a six-month pilot. No cost. Direct founder support.",
  },
];

const Luciel = () => {
  return (
    <SiteLayout>
      <Seo
        title="Luciel"
        description="Luciel is the judgment layer for modern business: auth, memory, consent, retention and multi-tenancy for regulated AI products."
        path="/luciel"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 -top-10 -z-10 hidden md:block" aria-hidden="true">
          <LucielOrb size={420} echo />
        </div>
        <div className="container-narrow pt-24 pb-20 md:pt-36 md:pb-28">
          <Eyebrow>LUCIEL</Eyebrow>
          <h1 className="font-display mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Luciel — the <span className="accent-text">judgment</span> layer for modern business.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A fixed, audited core that handles the parts of an AI product that should never be
            re-invented per project: identity, memory, consent, retention, and tenancy.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/design-partners">Become a design partner</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/contact">Book intro call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Primitives */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="JUDGMENT PRIMITIVES"
            title="Five primitives. One coherent layer."
            description="Each primitive is enforced consistently across every model call, every tool invocation, every memory write."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {primitives.map((p, i) => (
              <FeatureCard key={p.t} index={i + 1} title={p.t}>
                {p.d}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="section border-t border-border">
        <div className="container-narrow grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>ARCHITECTURE</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Layered, boring, and intentional.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Luciel follows a strict layered architecture: <span className="text-foreground">routes → services → repositories → models → policies</span>.
              Cross-layer shortcuts are not allowed. Every external effect — a model call, a tool
              invocation, a database write — passes through the policy layer.
            </p>
            <p className="mt-4 text-muted-foreground">
              Built on FastAPI, PostgreSQL and pgvector, deployed to AWS ca-central-1. The stack is
              deliberately conventional. The judgment layer is where the opinions live.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="space-y-3 font-mono text-sm">
              {[
                ["routes", "FastAPI · request boundaries"],
                ["services", "Use-case orchestration"],
                ["repositories", "Tenant-scoped data access"],
                ["models", "PostgreSQL + pgvector"],
                ["policies", "Consent · retention · scope"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3"
                  style={{ marginLeft: `${i * 12}px` }}
                >
                  <span className="text-primary">{k}</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="COMPLIANCE POSTURE"
            title="Compliance is a feature of the architecture, not a wrapper."
            description="Each guarantee is enforced at the layer where bypass is not possible."
          />
          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {compliance.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                <span className="text-foreground">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-t border-border">
        <div className="container-narrow grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Honest answers.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Missing something? Email{" "}
              <a className="text-foreground underline-offset-4 hover:underline" href="mailto:hello@vantagemind.ai">
                hello@vantagemind.ai
              </a>
              .
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-base font-medium tracking-tight hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Pricing */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="PRICING"
            title="Pricing that scales with judgment volume."
            description="Start in the sandbox. Move to Team for production. Talk to us for enterprise residency."
          />
          <div className="mt-14">
            <PricingTiers />
          </div>
        </div>
      </section>

      <CtaBlock eyebrow="PILOT LUCIEL" title="Ready to ship domain intelligence — not plumbing?" />
    </SiteLayout>
  );
};

export default Luciel;
