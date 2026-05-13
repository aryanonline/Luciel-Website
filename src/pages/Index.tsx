import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Layers, Network, Building2, User, Users } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { FadeIn } from "@/components/FadeIn";
import { trackCta } from "@/lib/analytics";

const Index = () => {

  return (
    <SiteLayout>
      <Seo
        title="VantageMind AI — AI judgment systems for Canadian businesses"
        description="VantageMind builds disciplined AI judgment systems for Canadian businesses. One intelligence, deployed across teams and individuals — scoped, governed, and accountable."
        path="/"
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-40 top-10 -z-10 hidden opacity-60 md:block" aria-hidden="true">
          <LucielOrb size={520} echo />
        </div>
        <div className="container-narrow grid items-center gap-10 pt-24 pb-16 md:grid-cols-[1.2fr_1fr] md:pt-32 md:pb-24">
          <div>
            <Eyebrow>VantageMind AI · Markham, Ontario</Eyebrow>
            <h1 className="font-display mt-6 text-5xl leading-[1.0] tracking-tight md:text-[68px]">
              AI judgment systems<br />for Canadian businesses.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              VantageMind builds disciplined, model-agnostic AI that reasons inside your business —
              with a fixed identity, scoped access, and an audit trail. One intelligence,
              deployed across individuals, departments, and the whole company.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/contact" onClick={() => trackCta("Book a demo", "/")}>Book a demo</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/products/luciel" className="inline-flex items-center gap-1.5">
                  Explore Luciel <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-primary/80" /> Canadian-resident infrastructure</span>
              <span className="inline-flex items-center gap-2"><Layers size={14} className="text-primary/80" /> Scope-enforced by design</span>
              <span className="inline-flex items-center gap-2"><Network size={14} className="text-primary/80" /> PIPEDA-aligned</span>
            </div>
          </div>
        </div>
      </section>

      {/* THESIS — editorial two-column */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow grid gap-16 py-24 md:grid-cols-[0.9fr_1.3fr] md:py-32">
          <div>
            <Eyebrow>The thesis</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              One intelligence.<br />Many deployments.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              Most AI products fork themselves into a different system for every customer.
              We took the opposite approach. We built one disciplined reasoning core — and a
              platform that lets it be deployed at the scope where the work actually happens:
              an individual professional, a department, or an entire company.
            </p>
            <p>
              The core stays consistent. Tone, posture, escalation rules, and operational
              discipline never drift. What changes per deployment is{" "}
              <span className="text-foreground">scope, knowledge, tools, and policy</span> —
              loaded as configuration, not forked into code.
            </p>
            <p>
              The result is an AI you can actually trust to operate inside a regulated business:
              accountable, observable, and bounded.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* LUCIEL FLAGSHIP — asymmetric */}
      <section className="border-b border-border">
        <div className="container-narrow grid gap-12 py-24 md:grid-cols-[1.4fr_0.9fr] md:py-32">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
              Flagship product
            </span>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight md:text-6xl">
              Luciel — a deployable<br />judgment layer.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Luciel is a domain-adaptive, model-agnostic AI judgment layer. It sits over your
              business data and tools and reasons with a consistent identity — adapting to the
              scope it is deployed at, the work it is doing, and the rules it is bound by.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              First serving Canadian real-estate brokerages: a private assistant per agent,
              a coordinated layer across the team, and an accountable system for the brokerage.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/products/luciel">Explore Luciel</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/contact" onClick={() => trackCta("Book a demo", "/")}>Book a demo</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn className="flex items-center justify-center">
            <LucielOrb size={300} />
          </FadeIn>
        </div>
      </section>

      {/* PLATFORM — capability list, no icon-circles */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow py-24 md:py-32">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
            <div>
              <Eyebrow>The platform</Eyebrow>
              <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
                Five operating disciplines.
              </h2>
              <p className="mt-6 text-muted-foreground">
                The same reasoning core, the same operating model, every deployment.
              </p>
              <Button asChild variant="ghost" className="mt-7 px-0">
                <Link to="/platform" className="inline-flex items-center gap-1.5 text-primary">
                  See the platform <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {[
                ["Scope", "Each deployment is bound to the people, data, and tools it is allowed to see. Cross-scope access is rejected at the policy boundary."],
                ["Memory", "Layered memory — company knowledge, departmental context, individual continuity — with consent and retention enforced at the runtime layer."],
                ["Policy", "Business rules, escalation paths, and action approvals are first-class objects, not prompt suggestions."],
                ["Dashboards", "Operators see what the system is doing, what it has touched, and what it has escalated — across every deployment."],
                ["Channels", "Chat widget today. Voice, SMS, and email arriving with our next release — same scope policy, same memory, same audit trail."],
              ].map(([t, b]) => (
                <div key={t} className="grid gap-4 py-7 md:grid-cols-[160px_1fr]">
                  <div className="font-display text-xl tracking-tight text-foreground">{t}</div>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* DEPLOYMENT MODEL */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow py-24 md:py-32">
          <div className="max-w-2xl">
            <Eyebrow>Deployment model</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Deploy where the work happens.
            </h2>
            <p className="mt-6 text-muted-foreground md:text-lg">
              The same intelligence, deployed at the scope it serves. Each level has its own
              boundaries, its own knowledge, and its own controls.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {[
              { Icon: User, name: "Individual", body: "A private deployment scoped to one professional. Their book of work, their voice, their continuity." },
              { Icon: Users, name: "Department", body: "A shared deployment for a team or function. Coordinated knowledge, role-aware permissions, joint visibility." },
              { Icon: Building2, name: "Company", body: "A company-wide layer with policy controls, audit, and aggregated dashboards across every deployment underneath." },
            ].map(({ Icon, name, body }) => (
              <div key={name} className="bg-card p-9">
                <Icon size={20} className="text-primary/80" strokeWidth={1.5} />
                <div className="mt-6 font-display text-2xl tracking-tight text-foreground">{name}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* TRUST */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow py-24 md:py-32">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
            <div>
              <Eyebrow>Trust</Eyebrow>
              <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
                Built for businesses that answer for their work.
              </h2>
              <Button asChild variant="ghost" className="mt-7 px-0">
                <Link to="/trust" className="inline-flex items-center gap-1.5 text-primary">
                  Read our trust posture <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
            <dl className="grid gap-8 sm:grid-cols-2">
              {[
                ["Canadian data posture", "Production infrastructure in Canada. No cross-border replication. Aligned with PIPEDA from day one."],
                ["Scope enforcement", "Every read and write is bound to a scope. Cross-scope access is rejected at the API boundary, not the UI."],
                ["Auditability", "Every conversation, retrieval, and privileged action is recorded with the actor, target, and outcome."],
                ["Action approvals", "Material actions are classified, scoped, and — when policy requires — held for human approval before execution."],
              ].map(([t, b]) => (
                <div key={t}>
                  <dt className="font-display text-lg tracking-tight text-foreground">{t}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="container-narrow py-24 text-center md:py-32">
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
            See Luciel deployed in your business.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground md:text-lg">
            We're onboarding a small number of Canadian brokerages as design partners.
            Demos take about thirty minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/contact" onClick={() => trackCta("Book a demo", "/")}>Book a demo</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/products/luciel">Explore Luciel</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
