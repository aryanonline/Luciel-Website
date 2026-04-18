import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow, SectionHeading } from "@/components/Section";
import { CtaBlock } from "@/components/CtaBlock";

const About = () => {
  return (
    <SiteLayout>
      <Seo
        title="About"
        description="VantageMind AI builds the infrastructure layer for regulated vertical AI. Founded in Markham, Ontario."
        path="/about"
      />

      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-narrow pt-24 pb-20 md:pt-36 md:pb-28">
          <Eyebrow>ABOUT</Eyebrow>
          <h1 className="font-display mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            We build the infrastructure layer for regulated vertical AI.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Frontier models will be a commodity. The defensible work is everything around them —
            consent, memory, retention, tenancy, judgment. That's what VantageMind builds.
          </p>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-narrow grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>MISSION</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              One judgment layer. Every regulated vertical.
            </h2>
          </div>
          <div className="text-muted-foreground">
            <p>
              VantageMind AI builds the infrastructure layer that makes vertical AI possible in
              regulated industries. Our first product, Luciel, is the judgment layer — the fixed,
              audited core that handles auth, memory, consent, retention, and multi-tenancy so
              product teams can focus on domain intelligence.
            </p>
            <p className="mt-4">
              We are pre-revenue, production-deployed, and selecting our first design partners.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-narrow grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>FOUNDER</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Aryan
            </h2>
            <p className="mt-4 text-muted-foreground">
              Solo technical founder. Based in Markham, Ontario. Full-stack architect of Luciel
              — every layer from FastAPI services down to the policy enforcement and pgvector
              memory store.
            </p>
            <p className="mt-4 text-muted-foreground">
              Building in public. 24 of 35 engineering milestones shipped to production. Follow
              along on the{" "}
              <Link to="/changelog" className="text-foreground underline-offset-4 hover:underline">
                Changelog
              </Link>
              .
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                ["Location", "Markham, Ontario"],
                ["Region", "AWS ca-central-1"],
                ["Stack", "FastAPI · PostgreSQL · pgvector"],
                ["Models", "OpenAI · Anthropic"],
                ["Compliance", "PIPEDA today · SOC 2 roadmap"],
                ["Stage", "Pre-revenue · production-deployed"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 font-display text-sm text-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="WHY CANADA"
            title="Density, regulation, proximity."
          />
          <div className="mt-10 max-w-3xl space-y-5 text-muted-foreground">
            <p>
              The Greater Toronto Area is one of the densest regulated-business markets in North
              America. Within a short drive of Markham sit more than a thousand mortgage
              brokerages, hundreds of property management firms, and a deep base of healthcare and
              legal SMBs — all bound by PIPEDA and increasingly by sector-specific data rules.
            </p>
            <p>
              That density is rare. Building infrastructure for regulated AI demands close,
              repeated contact with the teams using it. Canada gives us the regulatory floor
              (PIPEDA), the customer density, and the talent pool to do that without leaving the
              city.
            </p>
          </div>
        </div>
      </section>

      <CtaBlock />
    </SiteLayout>
  );
};

export default About;
