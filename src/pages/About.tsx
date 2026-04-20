import { Linkedin } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow, SectionHeading } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";

const About = () => {
  const { open } = useContactModal();
  return (
    <SiteLayout>
      <Seo
        title="About — VantageMind AI"
        description="Founded in Markham, Ontario by Aryan Singh. Why a judgment layer, not another chatbot. Why Canada."
        path="/about"
      />

      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
          <Eyebrow>ABOUT</Eyebrow>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            One judgment layer. <br />Built in Canada. <br />
            <span className="accent-text">For firms where judgment matters.</span>
          </h1>
        </div>
      </section>

      {/* Founder */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>FOUNDER</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Aryan Singh
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted-foreground">
              VantageMind AI · Markham / Hamilton, Ontario
            </p>
            <Button asChild variant="outline" className="mt-7">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <Linkedin /> Connect on LinkedIn
              </a>
            </Button>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>
              Aryan Singh is the founder and sole technical architect of VantageMind AI and Luciel.
              The full system — from infrastructure in AWS ca-central-1 to the policy and consent
              layers — is built and operated by Aryan today.
            </p>
            <p>
              VantageMind is based in Markham, Ontario, with operations in Hamilton. The company is
              pre-revenue, production-deployed, and selecting its first design-partner tenants for
              2026.
            </p>
            <p>
              Building in public. Honest about what is shipped, what is planned, and what is still
              a hypothesis.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Origin */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="ORIGIN"
            title="Why a judgment layer, not another chatbot."
          />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              The first wave of AI products was a wave of chatbots. Generic personalities, generic
              answers, no domain depth, no governance. Useful for novelty. Insufficient for any
              firm whose work carries real consequences.
            </p>
            <p>
              The work that matters in regulated firms is not a question-and-answer game. It is
              the act of figuring out what a client actually needs, reasoning over a body of
              policy and knowledge, taking a position, and being accountable for it. That is a
              judgment problem, not a retrieval problem.
            </p>
            <p>
              VantageMind exists to build the judgment layer for that work. Luciel is the first
              product. The architecture is designed so that every new vertical we add makes the
              next one easier to launch.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Why Canada */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading eyebrow="WHY CANADA" title="PIPEDA. Trust. Proximity." />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              PIPEDA gives us a regulatory floor that requires structural answers — consent,
              retention, audit — rather than marketing answers. Building against that floor first
              produces a stronger product.
            </p>
            <p>
              Canadian residency builds trust with the firms we serve. Their clients' data stays
              in the country it was collected in. We do not have to caveat that promise.
            </p>
            <p>
              The Greater Toronto and Hamilton Area gives us proximity to the kinds of firms
              Luciel is built for — brokerages, advisories, intake-heavy professional services.
              Close enough to learn from. Close enough to support well.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Hiring note */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <Eyebrow>HIRING</Eyebrow>
          <p className="font-display mt-4 max-w-3xl text-3xl leading-[1.2] tracking-tight md:text-4xl">
            We are not hiring yet. We will be in 2026.
          </p>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            When we open roles, they will be listed here.
          </p>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-narrow section text-center">
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            Want to talk?
          </h2>
          <div className="mt-9">
            <Button size="lg" onClick={open}>Request a design-partner pilot</Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
