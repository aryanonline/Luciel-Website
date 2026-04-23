import { Link } from "react-router-dom";
import { Linkedin, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { LucielOrb } from "@/components/LucielOrb";
import { FadeIn } from "@/components/FadeIn";
import { useContactModal } from "@/components/ContactModal";

const LINKEDIN_URL = "https://www.linkedin.com/in/aryan-singh-726825109/";

const Index = () => {
  const { open } = useContactModal();

  return (
    <SiteLayout>
      <Seo
        title="VantageMind AI — Domain-adaptive AI judgment layers"
        description="VantageMind AI builds domain-adaptive AI judgment layers for Canadian businesses. Based in Markham, Ontario. Built for PIPEDA from day one."
        path="/"
      />

      {/* HERO — company level */}
      <section className="relative overflow-hidden">
        <div className="container-narrow grid min-h-[88vh] items-center gap-12 pt-24 pb-16 md:grid-cols-[1.05fr_1fr] md:pt-28">
          <div>
            <Eyebrow>VANTAGEMIND AI</Eyebrow>
            <h1 className="font-display mt-6 text-5xl leading-[1.0] tracking-tight md:text-7xl">
              VantageMind <span className="accent-text">AI</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We build domain-adaptive AI judgment layers for Canadian businesses. Based in
              Markham, Ontario. Built for PIPEDA from day one.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#products">Meet Luciel — our first product</a>
              </Button>
              <Button size="lg" variant="ghost" onClick={open}>
                Book a demo
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <LucielOrb size={420} />
          </div>
        </div>
      </section>

      {/* ABOUT VANTAGEMIND */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="ABOUT VANTAGEMIND"
            title="One trusted AI identity. Specialized per industry."
          />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              VantageMind AI is a Markham-based company building the next generation of AI tools
              for Canadian industries. Our products are designed around one principle: one fixed,
              trustworthy AI identity — scoped cleanly to your business, your data, and your
              workflows.
            </p>
            <p>
              We build domain-agnostic infrastructure once, then specialize it for each industry
              as data and configuration, not code.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="section border-t border-border scroll-mt-24">
        <FadeIn className="container-narrow">
          <SectionHeading
            eyebrow="PRODUCTS"
            title="What we ship — and what's next."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {/* Card 1 — Luciel */}
            <div className="flex flex-col rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/40">
              <span className="self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                Available now — onboarding design partners
              </span>
              <h3 className="font-display mt-5 text-2xl tracking-tight text-foreground">
                Luciel — AI assistant for real estate brokerages.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                A private AI assistant scoped per agent. Trained on your brokerage's listings,
                playbooks, and compliance documents. Data stays in Canada. Each agent gets their
                own isolated assistant; nothing leaks across the team.
              </p>
              <div className="mt-6">
                <Link
                  to="/products/luciel"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
                >
                  Learn more about Luciel <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2 — Future */}
            <div className="flex flex-col rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/40">
              <span className="self-start rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Coming 2026–2027
              </span>
              <h3 className="font-display mt-5 text-2xl tracking-tight text-foreground">
                More products in the pipeline.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                VantageMind is expanding into legal, mortgage, and property management next. Same
                trusted core identity, specialized per vertical through configuration and
                knowledge — never by forking the codebase.
              </p>
              <div className="mt-6">
                <button
                  onClick={open}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
                >
                  Get notified <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* DOCTRINE PULL-QUOTE */}
      <section className="section border-t border-border">
        <FadeIn className="container-narrow">
          <blockquote className="font-display mx-auto max-w-4xl text-center text-3xl leading-[1.25] tracking-tight text-foreground md:text-[40px]">
            "One mind. Many deployments. No reskin. We build domain-adaptive intelligence with a
            fixed, perceptive identity — specialized per industry, governed for Canada."
          </blockquote>
          <div className="mt-8 text-center text-sm uppercase tracking-[0.22em] text-muted-foreground">
            — The VantageMind Doctrine
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="ghost"><Link to="/doctrine">Read the Doctrine →</Link></Button>
          </div>
        </FadeIn>
      </section>

      {/* FOUNDER STRIP */}
      <section className="border-t border-border">
        <div className="container-narrow flex flex-col items-center gap-6 py-14 md:flex-row md:justify-between md:gap-10">
          <div className="flex items-center gap-5">
            <LucielOrb size={64} />
            <div>
              <div className="font-display text-lg text-foreground">Aryan Singh, Founder</div>
              <div className="text-sm text-muted-foreground">
                Building the judgment layer from Markham, Ontario.
              </div>
            </div>
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border">
        <div className="container-narrow section">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
              Want to talk?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              If you run a brokerage, advisory, or firm where judgment matters — let us talk.
            </p>
            <div className="mt-9">
              <Button size="lg" onClick={open}>Book a demo</Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
