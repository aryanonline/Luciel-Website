import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WaitlistButton } from "@/components/WaitlistModal";
import { track, trackCta } from "@/lib/analytics";

type Tier = "individual" | "team" | "company";

interface TierCard {
  id: Tier;
  label: string;
  price: string;
  audience: string;
  bullets: string[];
  primary: "waitlist" | "demo";
  highlighted?: boolean;
}

const tiers: TierCard[] = [
  {
    id: "individual",
    label: "INDIVIDUAL",
    // Step 30a: locked single SKU at $30 CAD/mo for the Individual tier.
    price: "$30",
    audience: "A single professional working on their own behalf.",
    bullets: [
      "One person's Luciels, configured for their own client work",
      "Private deployment, own scope, own audit trail",
      "Configurable per role and workflow",
      "14-day free trial — cancel anytime",
    ],
    primary: "waitlist",
  },
  {
    id: "team",
    label: "TEAM",
    price: "$300–800",
    audience: "A department or team within a larger company.",
    bullets: [
      "All the Luciels for that team",
      "Department dashboard and team-level memory",
      "Cross-member coordination, scope-enforced",
    ],
    primary: "demo",
    highlighted: true,
  },
  {
    id: "company",
    label: "COMPANY",
    price: "$2,000",
    audience: "A whole company — every department, every team, every individual under company policy and audit.",
    bullets: [
      "Company-wide deployment with full hierarchy",
      "Company, department, and individual dashboards",
      "Immutable audit trail across every scope",
    ],
    primary: "demo",
  },
];

const faqs: [string, string][] = [
  [
    "Can an individual customer's department upgrade them later?",
    "Yes. When the department signs up, the individual's saved work, conversation history, and configured Luciels carry forward into the department deployment. No one starts from zero just because the buyer changed.",
  ],
  [
    "What happens to our data if we cancel?",
    "Data is retained for the contracted retention period and then purged. Soft-delete keeps the audit chain intact during the retention window so accidental deletes are recoverable.",
  ],
  [
    "Where does customer data live?",
    "AWS Canadian region (ca-central-1). No cross-border replication. Aligned with PIPEDA from day one.",
  ],
  [
    "Can Luciel be configured to push our preferred outcome onto end users?",
    "No. The reasoning identity is fixed. A deploying organization configures domain knowledge, tools, and workflows — it cannot configure Luciel to coerce or to act against the end user's interest.",
  ],
  [
    "How does billing work when team leadership changes?",
    "Data lives with the scope, not the person. When leadership changes, access is rotated cleanly and the team's Luciels keep working — because the data was never personally owned.",
  ],
];

const Pricing = () => {
  useEffect(() => {
    track({ name: "pricing_viewed" });
  }, []);

  return (
    <SiteLayout>
      <Seo
        title="Pricing — VantageMind AI"
        description="Three tiers, three different products. Individual, Team, and Company Luciels — priced to the scope where the work happens."
        path="/pricing"
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
          <Eyebrow>PRICING</Eyebrow>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Three tiers.<br />Three different products.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Luciel is sold at the scope where the work happens. A Team Luciel is not a bigger
            Individual Luciel — it can see across the team, learn from every conversation, and act
            on behalf of any member. That is a different product, not a larger version of the same one.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <section className="border-b border-border">
        <div className="container-narrow py-20 md:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.id} className="flex flex-col">
                {t.highlighted && (
                  <div className="mb-3 text-center">
                    <span className="eyebrow text-primary">Most popular</span>
                  </div>
                )}
                <div
                  className={`flex h-full flex-col rounded-xl border bg-card p-7 ${
                    t.highlighted ? "border-primary/50 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]" : "border-border"
                  }`}
                >
                  <div className="eyebrow">{t.label}</div>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <div className="font-display text-5xl tracking-tight text-foreground">{t.price}</div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">/month</div>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t.audience}</p>

                  <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <Check size={16} className="mt-0.5 flex-shrink-0 text-primary/80" strokeWidth={1.5} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    {t.primary === "waitlist" ? (
                      <>
                        {/* Step 30a: Individual tier flips to mode="checkout" which
                            routes to /signup → Stripe-hosted Checkout. When
                            VITE_STRIPE_PUBLISHABLE_KEY is unset on a build the
                            button transparently falls back to the waitlist modal. */}
                        <WaitlistButton
                          tier={t.id}
                          mode="checkout"
                          className="w-full"
                          sourcePage="/pricing"
                        >
                          Start free trial
                        </WaitlistButton>
                        <Link
                          to={`/contact?tier=${t.id}`}
                          onClick={() => trackCta("Book a demo", "/pricing", t.id)}
                          className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground"
                        >
                          Book a demo
                        </Link>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full">
                          <Link
                            to={`/contact?tier=${t.id}`}
                            onClick={() => {
                              track({ name: "pricing_tier_clicked", payload: { tier: t.id } });
                              trackCta("Book a demo", "/pricing", t.id);
                            }}
                          >
                            Book a demo
                          </Link>
                        </Button>
                        <div className="mt-4 text-center">
                          <WaitlistButton
                            tier={t.id}
                            mode="waitlist"
                            variant="ghost"
                            sourcePage="/pricing"
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            Join the waitlist
                          </WaitlistButton>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why the prices look this way */}
          <div className="mt-20 grid gap-10 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
            <div>
              <Eyebrow>Pricing rationale</Eyebrow>
              <h2 className="font-display mt-5 text-3xl leading-[1.1] tracking-tight md:text-4xl">
                Why the prices look this way.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              A Team Luciel is not a bigger Individual Luciel. It can see across all the team's
              work, learn from every conversation, and act on behalf of any of them — that is a
              different product, and a different value. The same is true from Team to Company. The
              price tracks the value the customer actually gets, which is why the tiers exist as
              separate products rather than seat counts.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card/40 p-7">
            <div className="eyebrow mb-3">Dedicated infrastructure</div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dedicated infrastructure tier — own database, own compute, own audit boundary —
              available on request for customers whose compliance posture requires it.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="container-narrow py-20 md:py-28">
          <Eyebrow>QUESTIONS</Eyebrow>
          <h2 className="font-display mt-5 max-w-3xl text-3xl leading-[1.1] tracking-tight md:text-5xl">
            What customers tend to ask.
          </h2>
          <Accordion type="single" collapsible className="mt-10 max-w-3xl">
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-border">
                <AccordionTrigger className="text-left text-base leading-snug text-foreground hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container-narrow py-20 text-center md:py-28">
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
            Pick the scope that matches your work.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/contact" onClick={() => trackCta("Book a demo", "/pricing")}>Book a demo</Link>
            </Button>
            <WaitlistButton variant="ghost" size="lg" sourcePage="/pricing">Join the waitlist</WaitlistButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Pricing;
