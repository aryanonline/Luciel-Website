import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { CtaBlock } from "@/components/CtaBlock";

type Entry = { date: string; step: string; title: string; description: string };

const entries: Entry[] = [
  {
    date: "2025-04-12",
    step: "Step 24",
    title: "Scope enforcement + domain/agent policies",
    description:
      "Every model call and tool invocation now passes through a policy layer that resolves the active tenant, domain, and agent scope. Cross-scope reads are impossible by construction.",
  },
  {
    date: "2025-04-02",
    step: "Step 23",
    title: "Data retention engine",
    description:
      "Per-tenant retention windows enforced at the storage layer. Soft deletes are gone — deletes are real, audited, and provable.",
  },
  {
    date: "2025-03-21",
    step: "Step 22",
    title: "Consent gating",
    description:
      "Consent records are per-purpose, revocable, and checked at the policy layer before any data flows to a model. No consent, no call.",
  },
  {
    date: "2025-03-08",
    step: "Step 21",
    title: "PIPEDA data retention defaults",
    description:
      "Sensible PIPEDA-aligned retention defaults shipped for every new tenant. Overridable per-tenant via configuration.",
  },
  {
    date: "2025-02-24",
    step: "Step 20",
    title: "Multi-tenant isolation",
    description:
      "Hard isolation across rows, vector indexes, and prompt context. Repository layer rewritten to make untenanted reads a compile-time error.",
  },
];

const Changelog = () => {
  return (
    <SiteLayout>
      <Seo
        title="Changelog"
        description="Build-in-public changelog for Luciel. 24 of 35 engineering milestones shipped to production."
        path="/changelog"
      />

      <section className="container-narrow pt-28 pb-12 md:pt-36">
        <Eyebrow>CHANGELOG</Eyebrow>
        <h1 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Building Luciel in public.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          24 of 35 engineering milestones shipped. Updated as we ship. Recent entries below.
        </p>
      </section>

      <section className="container-narrow pb-20 md:pb-28">
        <div className="mt-6 border-t border-border">
          {entries.map((e) => (
            <article
              key={e.step}
              className="grid gap-3 border-b border-border py-10 md:grid-cols-[180px_1fr] md:gap-12"
            >
              <div>
                <time className="font-mono text-xs text-muted-foreground">{e.date}</time>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  {e.step}
                </div>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                  {e.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{e.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Earlier milestones (Steps 1–19) covered the FastAPI service skeleton, repository layer,
          PostgreSQL schema, pgvector memory store, multi-LLM routing, auth surface, and AWS
          ca-central-1 production deploy. Detailed entries for those will be backfilled.
        </p>
      </section>

      <CtaBlock eyebrow="FOLLOW ALONG" title="Want to use this in production?" />
    </SiteLayout>
  );
};

export default Changelog;
