import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const pillars = [
  {
    name: "Canadian data posture",
    body:
      "Production infrastructure operates inside Canada. Storage, processing, and inference traffic stay in-country. There is no cross-border replication and no caveat to that promise.",
    points: [
      "Hosted in AWS ca-central-1",
      "TLS in transit, KMS-managed encryption at rest",
      "PIPEDA-aligned from day one",
    ],
  },
  {
    name: "Scope boundaries",
    body:
      "Every deployment is bound to a scope — an individual, a department, or a company. The scope governs which data the system can read, which actions it can take, and who it answers to. Boundary violations are rejected at the policy layer, not the interface.",
    points: [
      "Scope is enforced at the API, not the UI",
      "Per-deployment isolation by construction",
      "No silent fall-through on missing permissions",
    ],
  },
  {
    name: "Audit trail",
    body:
      "Every conversation, retrieval, privileged action, and configuration change is recorded with the actor, target, before-and-after state, and timestamp. Deletions are logged in an immutable record that proves what was removed and when.",
    points: [
      "Per-turn conversation traces",
      "Append-only admin audit log",
      "Immutable deletion log with retention",
    ],
  },
  {
    name: "Action classification",
    body:
      "Actions the system can take are classified by impact. Read-only actions execute. Material actions — anything that touches a customer, a record, or a financial decision — are classified, scoped, and held for human approval when policy requires it.",
    points: [
      "Tiered action classes with explicit policy",
      "Approval gates before execution",
      "Approval decisions recorded in the audit log",
    ],
  },
];

const Trust = () => {
  const { open } = useContactModal();
  return (
    <SiteLayout>
      <Seo
        title="Trust — VantageMind AI"
        description="Canadian data posture, scope boundaries, full auditability, and action approvals. The trust posture behind every VantageMind deployment."
        path="/trust"
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-20 md:pt-40 md:pb-28">
          <Eyebrow>Trust at VantageMind</Eyebrow>
          <h1 className="font-display mt-7 max-w-4xl text-5xl leading-[1.02] tracking-tight md:text-7xl">
            Built for businesses<br />that answer for their work.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            VantageMind is a Canadian company building AI that operates inside regulated work.
            Trust is not a feature we added — it is the design constraint every product is built
            against.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section>
        <div className="container-narrow py-20 md:py-28">
          <div className="space-y-20">
            {pillars.map((p, i) => (
              <FadeIn key={p.name} className="grid gap-8 border-t border-border pt-12 md:grid-cols-[200px_1fr] md:gap-16">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                    {String(i + 1).padStart(2, "0")} · Pillar
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-[40px]">
                    {p.name}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {p.body}
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Companywide statement */}
      <section className="border-y border-border bg-card/40">
        <FadeIn className="container-narrow grid gap-12 py-20 md:grid-cols-[0.9fr_1.3fr] md:py-28 md:gap-16">
          <div>
            <Eyebrow>Markham, Ontario</Eyebrow>
            <h2 className="font-display mt-5 text-3xl leading-[1.1] tracking-tight md:text-4xl">
              A Canadian company, by design.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>
              VantageMind is based in Markham, Ontario. Our infrastructure, our team, and our
              accountability live in the country we serve.
            </p>
            <p>
              For Canadian businesses, that matters: it removes the cross-border caveats that
              come with U.S.-hosted AI tooling, and it puts our compliance posture inside a
              jurisdiction that holds us to it.
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/privacy">Privacy policy</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/security">Technical security posture</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Roadmap */}
      <section className="border-b border-border">
        <FadeIn className="container-narrow py-20 md:py-28">
          <Eyebrow>What's next</Eyebrow>
          <h2 className="font-display mt-5 max-w-3xl text-3xl leading-[1.1] tracking-tight md:text-4xl">
            We don't claim coverage we haven't earned.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
            <div className="bg-card p-8">
              <div className="font-display text-xl tracking-tight text-foreground">SOC 2 Type II</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Planned. Not yet attested. We will say so the moment it is.
              </p>
            </div>
            <div className="bg-card p-8">
              <div className="font-display text-xl tracking-tight text-foreground">External privacy review</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Independent PIPEDA review and report once design partners are operational.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section>
        <div className="container-narrow py-24 text-center md:py-32">
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            Talk to us about your trust requirements.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            We're happy to walk through controls, scope behavior, and audit posture in detail.
          </p>
          <div className="mt-10">
            <Button size="lg" onClick={open}>Book a demo</Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Trust;
