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
    body:
      "We collect three categories of information. (1) Account information: your name, business email, organization, role, and the billing details required to create and maintain your subscription \u2014 the latter handled by our payment processor (Stripe) and not stored in plaintext on our servers. (2) Customer Content: the data you submit to or generate through the Service, including documents you upload, conversations Luciel has on your behalf, configuration you supply, and audit metadata about those interactions. (3) Operational telemetry: the technical records we need to run, secure, and improve the Service \u2014 request and response timing, error traces, IP address at the time of access, anonymous usage analytics about which features are used, and the structured audit-log entries described in our Terms of Service and at /security. We do not knowingly collect personal information from children, and the Service is not designed for use by individuals under sixteen.",
    committed: true,
  },
  {
    title: "How we use it",
    body:
      "We use the information we collect to (a) deliver the Service to you and to the natural persons authorized under your account, (b) operate, secure, and improve the Service \u2014 including investigating incidents, preventing abuse, and tuning performance, (c) handle billing, send transactional messages such as sign-in links and receipts, and respond to your support requests, and (d) comply with our legal obligations. We do not sell personal information. We do not use Customer Content to train third-party foundation models, and we do not authorize our model providers to do so. We may use aggregated, de-identified telemetry to evaluate the Service and to publish operational summaries, but only after the data is severed from any natural person.",
    committed: true,
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
        <p className="mt-7 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This is the v1 customer-facing version of the VantageMind AI Privacy Policy. It
          reflects the data-handling practices we run today and is written in plain language.
          A comprehensive legal review is scheduled; any material changes will be announced to
          active subscribers and reflected in the “Last updated” date below.
        </p>
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
        <p className="mt-16 text-xs text-muted-foreground">Last updated: May 2026.</p>
      </div>
    </section>
  </SiteLayout>
);

export default LegalPrivacy;
