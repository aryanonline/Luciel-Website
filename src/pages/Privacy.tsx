import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow, SectionHeading } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";

const policy = [
  ["What we collect", "Account information, content you submit to our products (listings, documents, conversations), and operational telemetry needed to run the service."],
  ["Why we collect it", "To deliver, secure, and improve our products. We do not sell personal information and we do not use customer content to train third-party foundation models."],
  ["Where it lives", "AWS ca-central-1 (Canada). TLS 1.3 in transit. Encrypted at rest via AWS KMS. No multi-region replication that crosses the border."],
  ["How long we keep it", "Per-tenant retention policies, configurable on contract. Deletions are recorded in an immutable, append-only deletion log so we can prove what was removed and when."],
  ["Access, correction, and deletion", "Individuals may request access to, correction of, or deletion of their personal information by contacting our Privacy Team at privacy@vantagemind.ai. Verified requests are actioned within 30 days."],
  ["Breach notification", "In the event of a breach involving real risk of significant harm, we notify affected individuals and the Office of the Privacy Commissioner of Canada as soon as feasible, per PIPEDA."],
  ["Third parties", "AWS ca-central-1 for hosting and storage. OpenAI and Anthropic for inference. Inference providers do not retain raw customer data and are not used for model training on your content."],
];

const principles = [
  ["1. Accountability", "Aryan Singh, Privacy Officer, is accountable for VantageMind AI's compliance with PIPEDA. Privacy responsibilities are documented and reviewed."],
  ["2. Identifying purposes", "Purposes for collecting personal information are identified at or before collection, in product onboarding and in this policy."],
  ["3. Consent", "Consent is meaningful, per-purpose, timestamped, and withdrawable. Memory features are opt-in and consent-gated at the runtime layer."],
  ["4. Limiting collection", "We collect only what is necessary to deliver the contracted service. No silent enrichment from third-party data brokers."],
  ["5. Limiting use, disclosure, and retention", "Personal information is used only for the purposes consented to, disclosed only to processors necessary to deliver the service, and retained only as long as needed under per-tenant retention policies."],
  ["6. Accuracy", "Customers can correct personal information through the product or through the Privacy Officer. Source-of-truth records are versioned."],
  ["7. Safeguards", "Per-tenant isolation, scope-enforced API permissions, scoped API keys SHA-256 hashed (raw keys never logged), TLS 1.3 with post-quantum key exchange, AWS KMS encryption at rest, immutable admin audit log."],
  ["8. Openness", "This page documents our practices. The Privacy Officer is reachable at privacy@vantagemind.ai for any clarifying questions."],
  ["9. Individual access", "On verified request, individuals receive an account of their personal information held, how it has been used, and to whom it has been disclosed."],
  ["10. Challenging compliance", "Concerns about our compliance can be addressed to the Privacy Officer. Unresolved concerns may be escalated to the Office of the Privacy Commissioner of Canada."],
];

const security = [
  "Canadian data residency — AWS ca-central-1 only.",
  "TLS 1.3 in transit, with post-quantum key exchange.",
  "Encryption at rest via AWS KMS.",
  "Scoped API keys, SHA-256 hashed at rest. Raw keys are never logged.",
  "Immutable admin audit log of every privileged action.",
  "Documented rollback and recovery procedures, exercised on a schedule.",
  "Tagged production release discipline with reproducible verification builds.",
];

const Privacy = () => (
  <SiteLayout>
    <Seo
      title="Privacy & Trust at VantageMind AI"
      description="How VantageMind AI handles personal information, aligned with PIPEDA. Canadian residency, scoped access, audit, and retention by design."
      path="/privacy"
    />

    {/* Hero */}
    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
        <Eyebrow>PRIVACY & TRUST</Eyebrow>
        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Privacy & Trust at <span className="accent-text">VantageMind AI</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          VantageMind AI is a Canadian company based in Markham, Ontario. We take privacy seriously
          and align our products with the Personal Information Protection and Electronic Documents
          Act (PIPEDA). This page documents how we collect, use, store, and protect personal
          information — and how to reach us with questions.
        </p>
      </div>
    </section>

    {/* Privacy Officer */}
    <section className="section border-t border-border">
      <FadeIn className="container-narrow">
        <SectionHeading eyebrow="PRIVACY OFFICER" title="One named person, accountable." />
        <div className="mt-10 max-w-2xl rounded-xl border border-border bg-card p-7">
          <div className="font-display text-2xl text-foreground">Aryan Singh</div>
          <div className="mt-1 text-sm uppercase tracking-[0.18em] text-muted-foreground">Privacy Officer</div>
          <div className="mt-5 space-y-1 text-sm text-muted-foreground">
            <div><a href="mailto:privacy@vantagemind.ai" className="text-primary hover:text-primary/80">privacy@vantagemind.ai</a></div>
            <div>VantageMind AI</div>
            <div>Markham, Ontario, Canada</div>
          </div>
        </div>
      </FadeIn>
    </section>

    {/* Privacy Policy summary */}
    <section className="section border-t border-border">
      <FadeIn className="container-narrow">
        <SectionHeading eyebrow="PRIVACY POLICY SUMMARY" title="Seven points, plainly stated." />
        <ol className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
          {policy.map(([t, b], i) => (
            <li key={t} className="grid gap-3 border-t border-border p-7 first:border-t-0 md:grid-cols-[60px_220px_1fr]">
              <div className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</div>
              <div className="font-display text-lg tracking-tight text-foreground">{t}</div>
              <div className="text-sm leading-relaxed text-muted-foreground">{b}</div>
            </li>
          ))}
        </ol>
      </FadeIn>
    </section>

    {/* PIPEDA principles */}
    <section className="section border-t border-border">
      <FadeIn className="container-narrow">
        <SectionHeading
          eyebrow="PIPEDA ALIGNMENT"
          title="How VantageMind aligns with PIPEDA's 10 Fair Information Principles."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {principles.map(([t, b]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6">
              <div className="font-display text-lg tracking-tight text-foreground">{t}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>

    {/* DPA */}
    <section className="section border-t border-border">
      <FadeIn className="container-narrow">
        <SectionHeading eyebrow="DATA PROCESSING AGREEMENT" title="Available to paying customers." />
        <p className="mt-8 max-w-3xl text-muted-foreground">
          Data Processing Agreements (DPAs) are available to paying customers. Request a copy from{" "}
          <a href="mailto:privacy@vantagemind.ai" className="text-primary hover:text-primary/80">
            privacy@vantagemind.ai
          </a>
          .
        </p>
      </FadeIn>
    </section>

    {/* Security posture */}
    <section className="section border-t border-border">
      <FadeIn className="container-narrow">
        <SectionHeading eyebrow="SECURITY POSTURE" title="What we do, in seven lines." />
        <ul className="mt-10 max-w-3xl space-y-3 text-muted-foreground">
          {security.map((s) => (
            <li key={s} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>

    {/* Closing */}
    <section className="border-t border-border">
      <div className="container-narrow section text-center">
        <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
          Questions?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
          <a href="mailto:privacy@vantagemind.ai" className="text-primary hover:text-primary/80">
            privacy@vantagemind.ai
          </a>
        </p>
      </div>
    </section>
  </SiteLayout>
);

export default Privacy;
