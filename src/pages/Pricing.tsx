import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WaitlistButton } from "@/components/WaitlistModal";
import { track, trackCta } from "@/lib/analytics";

type Tier = "individual" | "team" | "company";
type Cadence = "monthly" | "annual";

interface TierCard {
  id: Tier;
  label: string;
  monthlyPrice: string;
  annualPrice: string;
  audience: string;
  bullets: string[];
  /**
   * Step 30a.1 — all three tiers are now self-serve on Stripe. Company
   * keeps a primary "Book a demo" CTA with a hidden "Skip the call →"
   * link available behind ?showSkip=1 so we can quietly send qualified
   * leads straight to checkout without leaking the path on the public page.
   */
  primary: "checkout" | "demo-with-skip";
  trialCopy: string;
  highlighted?: boolean;
}

const tiers: TierCard[] = [
  {
    id: "individual",
    label: "INDIVIDUAL",
    // Step 30a.1: tier pricing locked. Monthly = working price; annual =
    // 10× monthly (i.e. two months free relative to month-by-month).
    monthlyPrice: "$30",
    annualPrice: "$300",
    audience: "A single professional working on their own behalf.",
    bullets: [
      "One person's Luciels, configured for their own client work",
      "Private deployment, own scope, own audit trail",
      "Configurable per role and workflow",
      "14-day free trial on monthly — cancel anytime",
    ],
    primary: "checkout",
    trialCopy: "14-day free trial",
  },
  {
    id: "team",
    label: "TEAM",
    monthlyPrice: "$300",
    annualPrice: "$3,000",
    audience: "A department or team within a larger company.",
    bullets: [
      "All the Luciels for that team",
      "Department dashboard and team-level memory",
      "Cross-member coordination, scope-enforced",
      "7-day free trial on monthly",
    ],
    primary: "checkout",
    trialCopy: "7-day free trial",
    highlighted: true,
  },
  {
    id: "company",
    label: "COMPANY",
    monthlyPrice: "$2,000",
    annualPrice: "$20,000",
    audience:
      "A whole company — every department, every team, every individual under company policy and audit.",
    bullets: [
      "Company-wide deployment with full hierarchy",
      "Company, department, and individual dashboards",
      "Immutable audit trail across every scope",
      "7-day free trial on monthly",
    ],
    primary: "demo-with-skip",
    trialCopy: "7-day free trial",
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
  [
    "Monthly or annual — what's the difference?",
    "Pick the cadence that matches how you buy. Monthly comes with a free trial (14 days on Individual, 7 days on Team and Company); annual is billed once a year at ten times the monthly rate — effectively two months free — with no trial. Both cadences are the same product at the same scope.",
  ],
];

const Pricing = () => {
  const [params] = useSearchParams();
  // Step 30a.1: Company tier's primary CTA stays "Book a demo" on the
  // public page. The "Skip the call →" link to self-serve checkout is
  // gated behind ?showSkip=1 so we can hand it to qualified leads
  // without exposing the bypass to general traffic.
  const showCompanySkip = useMemo(() => params.get("showSkip") === "1", [params]);

  const [cadence, setCadence] = useState<Cadence>("monthly");

  useEffect(() => {
    track({ name: "pricing_viewed" });
  }, []);

  useEffect(() => {
    track({ name: "pricing_cadence_toggled", payload: { cadence } });
  }, [cadence]);

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
          {/* Cadence toggle */}
          <div className="mb-10 flex justify-center">
            <div
              role="tablist"
              aria-label="Billing cadence"
              className="inline-flex items-center rounded-full border border-border bg-card p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={cadence === "monthly"}
                onClick={() => setCadence("monthly")}
                className={`rounded-full px-5 py-2 text-sm transition-colors ${
                  cadence === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cadence === "annual"}
                onClick={() => setCadence("annual")}
                className={`rounded-full px-5 py-2 text-sm transition-colors ${
                  cadence === "annual"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
                <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-primary/80">
                  2 mo free
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((t) => {
              const displayPrice = cadence === "monthly" ? t.monthlyPrice : t.annualPrice;
              const perSubtext = cadence === "monthly" ? "/month" : "/year";

              return (
                <div key={t.id} className="flex flex-col">
                  {t.highlighted && (
                    <div className="mb-3 text-center">
                      <span className="eyebrow text-primary">Most popular</span>
                    </div>
                  )}
                  <div
                    className={`flex h-full flex-col rounded-xl border bg-card p-7 ${
                      t.highlighted
                        ? "border-primary/50 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                        : "border-border"
                    }`}
                  >
                    <div className="eyebrow">{t.label}</div>
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <div className="font-display text-5xl tracking-tight text-foreground">
                        {displayPrice}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{perSubtext}</div>
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
                      {t.primary === "checkout" ? (
                        <>
                          {/* Step 30a.1: Individual + Team are now both
                              self-serve. Forwards cadence so the backend
                              resolves to the correct Stripe Price. Falls
                              back to waitlist when VITE_STRIPE_PUBLISHABLE_KEY
                              is unset on this build. */}
                          <WaitlistButton
                            tier={t.id}
                            mode="checkout"
                            cadence={cadence}
                            className="w-full"
                            sourcePage="/pricing"
                          >
                            {cadence === "monthly" ? "Start free trial" : "Start annual plan"}
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
                          {/* Company tier — primary stays "Book a demo".
                              The "Skip the call →" link to self-serve
                              checkout is only rendered when ?showSkip=1
                              is present, so we can quietly route
                              qualified leads without exposing the
                              bypass on the public page. */}
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
                          {showCompanySkip ? (
                            <div className="mt-4 text-center">
                              <WaitlistButton
                                tier={t.id}
                                mode="checkout"
                                cadence={cadence}
                                variant="ghost"
                                sourcePage="/pricing"
                                className="text-sm text-muted-foreground hover:text-foreground"
                              >
                                Skip the call →
                              </WaitlistButton>
                            </div>
                          ) : (
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
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
