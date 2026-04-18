import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, FeatureCard, Eyebrow } from "@/components/Section";
import { CtaBlock } from "@/components/CtaBlock";
import { Button } from "@/components/ui/button";
import { LucielOrb, TypewriterRotator } from "@/components/LucielOrb";
import { PricingTiers } from "./Pricing";
import { SecurityCompliance, WhatMakesDifferent } from "@/components/HomeSections";

const techLogos = ["FastAPI", "PostgreSQL", "pgvector", "AWS", "Anthropic", "OpenAI"];

const scrollToApply = () => {
  // On home, send users to the design-partners apply form
  window.location.href = "/design-partners#apply";
};

const Index = () => {
  return (
    <SiteLayout>
      <Seo
        title="The judgment layer for regulated AI products"
        description="Luciel handles auth, memory, consent, retention, and multi-tenancy so your team ships domain intelligence — not plumbing."
        path="/"
      />

      {/* Hero — Animated orb */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-narrow flex min-h-[88vh] flex-col items-center justify-center pt-24 pb-16 text-center md:pt-28">
          <Eyebrow>VANTAGEMIND AI · LUCIEL</Eyebrow>

          <div className="relative mt-10 flex items-center justify-center">
            <LucielOrb size={420} />
          </div>

          <div className="mt-12 min-h-[2em]">
            <TypewriterRotator />
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={scrollToApply}>
              Request Access <ArrowRight />
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/luciel">See Luciel</Link>
            </Button>
          </div>

          <div className="scroll-hint mt-16 text-muted-foreground">
            <ChevronDown size={20} />
          </div>
        </div>
      </section>

      {/* Tech logos */}
      <section className="border-t border-border">
        <div className="container-narrow py-10">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Built on</div>
          <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-3">
            {techLogos.map((t) => (
              <span key={t} className="font-display text-sm text-muted-foreground/80">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="THE PROBLEM"
            title="Every regulated business rebuilds the same AI plumbing."
            description="Auth, memory, consent, retention, multi-tenancy. The unglamorous infrastructure that decides whether an AI product can ship in a regulated industry — or not."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <FeatureCard index={1} title="Generic LLMs can't be trusted">
              Out of the box, foundation models hallucinate, leak context across tenants, and have
              no concept of consent or retention. Useless in regulated workflows.
            </FeatureCard>
            <FeatureCard index={2} title="Teams rebuild the same primitives">
              Every vertical AI startup writes the same auth layer, the same memory store, the
              same consent gate. Months lost on infrastructure no customer ever sees.
            </FeatureCard>
            <FeatureCard index={3} title="The compliance gap is widening">
              Buyers in healthcare, mortgage, legal and property management now require evidence of
              data handling. Most AI products can't produce it.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="THE SOLUTION"
            title="One fixed AI mind. Infinite specialized instances."
            description="Luciel separates the parts of an AI system that should never change — judgment, policy, memory — from the parts that should be configured per industry and per task."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { tag: "TIER 01", title: "Tenant", desc: "Persona, consent, retention. Per-customer isolation enforced at every read and write." },
              { tag: "TIER 02", title: "Domain", desc: "Industry knowledge, vocabulary, tools. Mortgage, property management, legal — configured, not coded." },
              { tag: "TIER 03", title: "Agent", desc: "Task-specific roles with scoped tools and policies. Composable, auditable, replaceable." },
            ].map((t, i) => (
              <div key={t.title} className="relative rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-primary">{t.tag}</div>
                  {i < 2 && <ArrowRight className="hidden text-muted-foreground md:block" size={16} />}
                </div>
                <h3 className="font-display mt-6 text-xl font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-xl text-base text-muted-foreground">
            <span className="text-foreground">Configure, don't code.</span> The judgment layer
            stays fixed and audited. Domains and agents become a configuration surface your
            product team can iterate on safely.
          </p>
        </div>
      </section>

      {/* Why now */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="WHY NOW" title="The window is opening for vertical AI." />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { t: "LLMs crossed the reliability threshold", d: "Frontier models are now consistent enough that the bottleneck is no longer raw capability — it's everything around the model." },
              { t: "Compliance is a buying requirement", d: "PIPEDA, SOC 2, HIPAA, GDPR. Procurement teams now ask about retention, consent, and tenancy before they ask about features." },
              { t: "SMBs want vertical AI but can't build it", d: "Mid-market firms in regulated industries want their own AI surface. They don't have the engineering depth to build the infrastructure underneath." },
            ].map((p, i) => (
              <div key={p.t}>
                <div className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display mt-3 text-lg font-semibold tracking-tight">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <SecurityCompliance />

      {/* What makes Luciel different */}
      <WhatMakesDifferent />

      {/* Pricing preview */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="PRICING"
            title="Start free. Scale when you ship."
            description="Three tiers. No surprises. Talk to us when residency, SLA, or on-prem matter."
          />
          <div className="mt-14">
            <PricingTiers />
          </div>
          <div className="mt-10">
            <Button asChild variant="ghost">
              <Link to="/pricing">See full comparison <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <Eyebrow>STATUS</Eyebrow>
          <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-[44px]">
            Pre-revenue. Production-deployed. Building in public.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
            {[
              { v: "24 / 35", l: "Engineering milestones shipped" },
              { v: "AWS", l: "Production-live in ca-central-1" },
              { v: "PIPEDA", l: "Compliant from day one" },
              { v: "Open", l: "Seeking first design partners" },
            ].map((s) => (
              <div key={s.l} className="bg-card p-6">
                <div className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{s.v}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </SiteLayout>
  );
};

export default Index;
