import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";

interface Section {
  title: string;
  body: string;
  /** Doctrinally committed sections are not marked PLACEHOLDER. */
  committed?: boolean;
}

const sections: Section[] = [
  {
    title: "What we collect",
    body: "Account information, content you submit to our products, and operational telemetry necessary to run the service.",
  },
  {
    title: "How we use it",
    body: "To deliver, secure, and improve the service. We do not sell personal information and we do not use customer content to train third-party foundation models.",
  },
  {
    title: "Where it lives",
    body: "AWS Canadian region (ca-central-1). No cross-border replication. TLS 1.3 in transit. AWS KMS encryption at rest.",
    committed: true,
  },
  {
    title: "Retention and deletion",
    body: "Soft-delete keeps the audit chain intact during the retention window. Records are then purged on the schedule set by the contracted retention period.",
    committed: true,
  },
  {
    title: "Your rights under PIPEDA",
    body: "You may request access to, correction of, or deletion of your personal information, and you may file a complaint with our Privacy Team or with the Office of the Privacy Commissioner of Canada.",
    committed: true,
  },
  {
    title: "Contact",
    body: "privacy@vantagemind.ai",
    committed: true,
  },
];

const LegalPrivacy = () => (
  <SiteLayout>
    <Seo
      title="Privacy Policy — VantageMind AI"
      description="Privacy policy for VantageMind AI. Canadian data residency, PIPEDA-aligned, with clear retention and deletion practices."
      path="/legal/privacy"
    />
    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
        <Eyebrow>LEGAL</Eyebrow>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Privacy Policy
        </h1>
      </div>
    </section>

    <section className="border-b border-border">
      <div className="container-narrow py-16">
        <ol className="space-y-10 max-w-3xl">
          {sections.map((s, i) => (
            <li key={s.title}>
              <div className="eyebrow text-primary">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="font-display mt-2 text-2xl tracking-tight text-foreground">{s.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.body}</p>
              {!s.committed && (
                <p className="mt-3 text-xs italic text-muted-foreground/80">[PLACEHOLDER — pending legal review]</p>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-16 text-xs text-muted-foreground">Last updated: pending publish.</p>
      </div>
    </section>
  </SiteLayout>
);

export default LegalPrivacy;
