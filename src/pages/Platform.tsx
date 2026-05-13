import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const pillars = [
  {
    n: "01",
    name: "Consistent intelligence",
    body:
      "Every deployment runs against the same disciplined reasoning core. Tone, posture, escalation behavior, and operational habits do not drift between customers, departments, or individuals. The personality of the system is the product.",
  },
  {
    n: "02",
    name: "Scoped deployment",
    body:
      "Deployments are bound to a scope: an individual, a department, or a company. The scope determines what the system can see, what it can do, and who it answers to. Cross-scope access is rejected at the policy boundary, not the interface.",
  },
  {
    n: "03",
    name: "Memory layers",
    body:
      "Three layers of memory: company knowledge that everyone in scope inherits, departmental context that shapes how work is done, and individual continuity that respects each professional's voice and book of work. Memory is consent-gated and retention-bound.",
  },
  {
    n: "04",
    name: "Governance and policy",
    body:
      "Business rules, escalation paths, approval gates, and action classifications are first-class objects in the platform — not suggestions inside a prompt. Operators write the rules; the platform enforces them at runtime.",
  },
  {
    n: "05",
    name: "Operator dashboards",
    body:
      "A clear view of what the system is doing across every deployment: conversations served, knowledge retrieved, actions taken, items escalated. Operators see the work as it happens, and after the fact for audit.",
  },
  {
    n: "06",
    name: "Channels and integrations",
    body:
      "One reasoning identity, available wherever the work happens — chat, email, embedded surfaces, and direct integrations into the systems your team already uses. Context follows the conversation across channels.",
  },
];

const Platform = () => {
  const { open } = useContactModal();
  return (
    <SiteLayout>
      <Seo
        title="Platform — VantageMind AI"
        description="The operating model behind every VantageMind deployment. Consistent intelligence, scoped deployment, layered memory, governance, dashboards, and channels."
        path="/platform"
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-20 md:pt-40 md:pb-28">
          <Eyebrow>The platform</Eyebrow>
          <h1 className="font-display mt-7 max-w-4xl text-5xl leading-[1.02] tracking-tight md:text-7xl">
            One operating model.<br />Every deployment.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            VantageMind is built on a single disciplined platform that powers every product we ship.
            Six operating pillars define how the system reasons, what it can touch, what it
            remembers, and how it answers for its work.
          </p>
        </div>
      </section>

      {/* Pillars — editorial list */}
      <section>
        <div className="container-narrow py-20 md:py-28">
          <div className="space-y-20">
            {pillars.map((p) => (
              <FadeIn key={p.n} className="grid gap-6 border-t border-border pt-12 md:grid-cols-[180px_1fr] md:gap-12">
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{p.n} · Pillar</div>
                <div>
                  <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-[40px]">
                    {p.name}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture summary */}
      <section className="border-y border-border bg-card/40">
        <FadeIn className="container-narrow py-20 md:py-28">
          <Eyebrow>Operating model</Eyebrow>
          <h2 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-5xl">
            What stays fixed. What adapts.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
            <div className="bg-card p-9">
              <div className="eyebrow">Fixed</div>
              <ul className="mt-5 space-y-3 text-muted-foreground">
                <li>· Reasoning core and identity</li>
                <li>· Escalation discipline</li>
                <li>· Audit and observability model</li>
                <li>· Scope enforcement layer</li>
                <li>· Consent and retention enforcement</li>
              </ul>
            </div>
            <div className="bg-card p-9">
              <div className="eyebrow">Configurable per deployment</div>
              <ul className="mt-5 space-y-3 text-muted-foreground">
                <li>· Domain knowledge</li>
                <li>· Vocabulary and voice</li>
                <li>· Tools, integrations, and channels</li>
                <li>· Policy, approvals, and escalation routes</li>
                <li>· Underlying foundation model</li>
              </ul>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section>
        <div className="container-narrow py-24 text-center md:py-32">
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            See the platform in motion.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            A thirty-minute walk-through, scoped to your business and the work you'd want it to do.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={open}>Book a demo</Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/products/luciel" className="inline-flex items-center gap-1.5">
                Explore Luciel <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Platform;
