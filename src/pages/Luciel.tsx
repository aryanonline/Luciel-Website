import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, User, Users, Building2 } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { FadeIn } from "@/components/FadeIn";
import { trackCta } from "@/lib/analytics";

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const LUCIEL_EMBED_KEY = env.VITE_LUCIEL_MARKETING_EMBED_KEY;
const LUCIEL_WIDGET_SRC = "https://d1t84i96t71fsi.cloudfront.net/widget.js";

const recommendationShape: { eyebrow: string; title: string; body: string }[] = [
  { eyebrow: "1", title: "What suits you best", body: "The recommendation itself, stated plainly." },
  { eyebrow: "2", title: "Why it fits you", body: "The reasoning, grounded in what we know about your situation." },
  { eyebrow: "3", title: "The tradeoff", body: "What you give up by choosing this. Never hidden." },
  { eyebrow: "4", title: "What I still need to confirm", body: "The open question. Luciel names it rather than guessing past it." },
];

const trustReasons = [
  {
    name: "Scoped access",
    body:
      "Each Luciel deployment can only see the data, tools, and people inside its scope. A leaked credential reaches one assistant — not the brokerage.",
  },
  {
    name: "Escalation built-in",
    body:
      "Luciel knows what it doesn't know. Ambiguous, material, or out-of-policy work is escalated to the right human, with the reasoning attached.",
  },
  {
    name: "Auditability",
    body:
      "Every conversation, retrieval, and action is recorded with the actor, target, and outcome. Operators can answer 'what did the system do, and why' at any time.",
  },
  {
    name: "Memory discipline",
    body:
      "Memory is layered, consent-gated, and retention-bound. Personal context stays with the individual; company knowledge stays at the company; nothing leaks across.",
  },
  {
    name: "Cross-channel continuity",
    body:
      "The same Luciel — same identity, same memory, same posture — across chat, email, embedded surfaces, and integrations.",
  },
];

const Luciel = () => {
  // Inject the Luciel marketing widget once when the embed key is present.
  useEffect(() => {
    if (!LUCIEL_EMBED_KEY) return;
    if (document.querySelector(`script[src="${LUCIEL_WIDGET_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = LUCIEL_WIDGET_SRC;
    s.async = true;
    s.setAttribute("data-luciel-api-base", "https://api.vantagemind.ai");
    s.setAttribute("data-luciel-embed-key", LUCIEL_EMBED_KEY);
    document.head.appendChild(s);
  }, []);

  return (
    <SiteLayout>
      <Seo
        title="Luciel — A deployable AI judgment layer"
        description="Luciel is a domain-adaptive, model-agnostic AI judgment layer. Deployed for individuals, departments, or whole companies. Canadian, scoped, auditable."
        path="/products/luciel"
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-32 top-12 -z-10 hidden opacity-50 md:block" aria-hidden="true">
          <LucielOrb size={460} echo />
        </div>
        <div className="container-narrow pt-28 pb-20 md:pt-40 md:pb-28">
          <Eyebrow>Luciel · A VantageMind product</Eyebrow>
          <h1 className="font-display mt-7 max-w-4xl text-5xl leading-[1.02] tracking-tight md:text-[78px]">
            A deployable<br />AI judgment layer.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Luciel is a domain-adaptive, model-agnostic AI that reasons inside your business.
            One consistent identity, deployed at the scope where the work happens — for an
            individual professional, a department, or your whole company.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/contact" onClick={() => trackCta("Book a demo", "/products/luciel")}>Book a demo</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/platform" className="inline-flex items-center gap-1.5">
                See the platform <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHAT LUCIEL IS — editorial */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow grid gap-16 py-24 md:grid-cols-[0.9fr_1.3fr] md:py-32">
          <div>
            <Eyebrow>What Luciel is</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              A judgment layer,<br />not a chatbot.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              Most AI products are interfaces over a generic model. Luciel is the opposite. It is
              a disciplined reasoning layer that sits between your business — your people, your
              data, your rules — and the underlying intelligence.
            </p>
            <p>
              The reasoning identity is fixed: calm, perceptive, direct, accountable. The way it
              works inside your business is configurable: scope, knowledge, vocabulary, tools,
              policy, channels.
            </p>
            <p>
              Because the foundation model is configurable too, Luciel is not bound to any one
              vendor's roadmap. The reasoning identity is ours; the model underneath is a choice.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* FIXED VS CONFIGURABLE */}
      <section className="border-b border-border bg-card/40">
        <FadeIn className="container-narrow py-20 md:py-28">
          <Eyebrow>The model</Eyebrow>
          <h2 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-5xl">
            What stays fixed. What adapts.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
            <div className="bg-card p-9">
              <div className="eyebrow">Fixed in Luciel</div>
              <ul className="mt-5 space-y-3 text-muted-foreground">
                <li>· Reasoning identity and tone</li>
                <li>· Escalation discipline</li>
                <li>· Scope and policy enforcement</li>
                <li>· Audit and observability</li>
                <li>· Consent and retention behavior</li>
              </ul>
            </div>
            <div className="bg-card p-9">
              <div className="eyebrow">Configured per deployment</div>
              <ul className="mt-5 space-y-3 text-muted-foreground">
                <li>· Domain knowledge and vocabulary</li>
                <li>· Tools and integrations</li>
                <li>· Business rules and approval gates</li>
                <li>· Channels and surfaces</li>
                <li>· Underlying foundation model</li>
              </ul>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* DEPLOY BY SCOPE */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
            <div>
              <Eyebrow>Deployment</Eyebrow>
              <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
                One Luciel,<br />three scopes.
              </h2>
              <p className="mt-6 text-muted-foreground">
                The same intelligence, deployed at the scope it serves. Each level has its own
                boundaries, knowledge, and controls.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
              {[
                { Icon: User, name: "Individual", body: "A private Luciel scoped to one professional. Their book of work, their voice, their continuity. Nothing leaks to the rest of the team." },
                { Icon: Users, name: "Department", body: "A shared Luciel for a team or function. Coordinated knowledge, role-aware permissions, joint visibility for the team lead." },
                { Icon: Building2, name: "Company", body: "A company-wide deployment with policy controls, audit, and aggregated dashboards across every individual and departmental Luciel underneath." },
              ].map(({ Icon, name, body }) => (
                <div key={name} className="grid gap-6 bg-card p-8 md:grid-cols-[160px_1fr]">
                  <div className="flex items-start gap-3">
                    <Icon size={18} className="text-primary/80" strokeWidth={1.5} />
                    <div className="font-display text-xl tracking-tight text-foreground">{name}</div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* TRUSTWORTHY BY DESIGN */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow py-24 md:py-32">
          <Eyebrow>Trustworthy by design</Eyebrow>
          <h2 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-5xl">
            What makes Luciel safe to deploy.
          </h2>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {trustReasons.map((r) => (
              <div key={r.name} className="grid gap-4 py-8 md:grid-cols-[260px_1fr] md:gap-12">
                <div className="font-display text-2xl tracking-tight text-foreground">{r.name}</div>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{r.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="ghost" className="px-0">
              <Link to="/trust" className="inline-flex items-center gap-1.5 text-primary">
                Read our trust posture <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* FIRST VERTICAL */}
      <section className="border-b border-border bg-card/40">
        <FadeIn className="container-narrow grid gap-12 py-20 md:grid-cols-[0.9fr_1.3fr] md:py-28 md:gap-16">
          <div>
            <Eyebrow>First vertical</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Canadian real-estate brokerages.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>
              Luciel is first being deployed inside Canadian real-estate brokerages. A private
              Luciel per agent, scoped to their book of work. A coordinated layer across the
              team. An accountable system at the brokerage level.
            </p>
            <p>
              We're onboarding a small group of GTA brokerages as design partners — founding
              pricing, direct access to the team, and a real say in the roadmap.
            </p>
            <div className="pt-3">
              <Button onClick={open}>Become a design partner</Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section>
        <div className="container-narrow py-24 text-center md:py-32">
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
            See Luciel in your business.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground md:text-lg">
            Thirty-minute demo, scoped to the work you'd actually want it to do.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={open}>Book a demo</Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/platform">See the platform</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Luciel;
