import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";

const tenets = [
  {
    n: "I.",
    t: "One mind, many deployments.",
    body:
      "Luciel is never reskinned. The persona is the product. What changes per tenant is domain, knowledge, and policy — never tone, never posture, never the underlying judgment.",
  },
  {
    n: "II.",
    t: "Judgment over retrieval.",
    body:
      "A retrieved fact is not an answer. A summary is not a recommendation. Luciel takes a position, with reasons and tradeoffs. A good answer is useless without a position.",
  },
  {
    n: "III.",
    t: "The architecture is the business model.",
    body:
      "Three-level hierarchy: tenant, domain, agent. Cross-tenant pattern learning improves the persona while strict isolation protects every tenant's data. Every new vertical makes the next one cheaper to launch.",
  },
  {
    n: "IV.",
    t: "Domain is earned, not configured.",
    body:
      "Every vertical gets a real domain module — knowledge, vocabulary, tools, escalation rules — not a prompt. A prompt is not a product. A domain module is.",
  },
  {
    n: "V.",
    t: "Compliance is foundational.",
    body:
      "PIPEDA. Canadian residency. Audit-first. Consent and retention are enforced at the layer where bypass is not possible. Compliance is not a sales line — it is a structural property.",
  },
  {
    n: "VI.",
    t: "The human keeps the wheel.",
    body:
      "Luciel recommends. Luciel escalates. Luciel never acts unsupervised on material decisions. Authority to act is granted, scoped, and revocable.",
  },
  {
    n: "VII.",
    t: "Consistency is a feature.",
    body:
      "The same Luciel your broker trusts at 9am is the one your client trusts at midnight. Reliability of character is itself a product property — and the one most often missing in AI tools today.",
  },
];

const Doctrine = () => (
  <SiteLayout>
    <Seo
      title="The Doctrine — VantageMind AI"
      description="Seven tenets that govern how Luciel is built and how it behaves. One mind, many deployments, no reskin."
      path="/doctrine"
    />

    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
        <Eyebrow>THE DOCTRINE</Eyebrow>
        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Seven tenets.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The principles that govern how Luciel is built and how it behaves. They are not slogans.
          They are constraints on the product.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow mx-auto max-w-3xl">
        <div className="space-y-16">
          {tenets.map((t) => (
            <FadeIn key={t.n} as="article">
              <div className="font-mono text-sm text-primary">{t.n}</div>
              <h2 className="font-display mt-3 text-3xl leading-[1.15] tracking-tight md:text-4xl">
                {t.t}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.body}
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-24 border-t border-border pt-10">
          <p className="font-display text-xl tracking-tight text-foreground">
            — Aryan Singh, Founder, VantageMind AI
          </p>
        </FadeIn>
      </div>
    </section>
  </SiteLayout>
);

export default Doctrine;
