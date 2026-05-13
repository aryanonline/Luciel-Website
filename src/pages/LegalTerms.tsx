import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";

const sections: [string, string][] = [
  ["Service description", "VantageMind AI provides Luciel, a deployable AI judgment layer, under the tier the customer subscribes to."],
  ["Account responsibilities", "Customers are responsible for the accuracy of account information and for the security of credentials issued to their organization."],
  ["Acceptable use", "Use of the service must comply with applicable law and must not attempt to bypass scope, policy, or audit controls."],
  ["Payment and cancellation", "Subscriptions renew on the contracted cadence. Cancellation takes effect at the end of the current billing period."],
  ["Data ownership", "Customers retain ownership of their content. VantageMind AI is the processor of customer content for the purposes of operating the service."],
  ["Limitation of liability", "Liability is limited to the amount paid by the customer in the twelve months preceding the event giving rise to the claim, except where prohibited by law."],
  ["Governing law (Ontario, Canada)", "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein."],
];

const LegalTerms = () => (
  <SiteLayout>
    <Seo
      title="Terms of Service — VantageMind AI"
      description="Terms of Service for VantageMind AI and the Luciel platform."
      path="/legal/terms"
    />
    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
        <Eyebrow>LEGAL</Eyebrow>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Terms of Service
        </h1>
      </div>
    </section>

    <section className="border-b border-border">
      <div className="container-narrow py-16">
        <ol className="space-y-10 max-w-3xl">
          {sections.map(([t, b], i) => (
            <li key={t}>
              <div className="eyebrow text-primary">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="font-display mt-2 text-2xl tracking-tight text-foreground">{t}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{b}</p>
              <p className="mt-3 text-xs italic text-muted-foreground/80">[PLACEHOLDER — pending legal review]</p>
            </li>
          ))}
        </ol>
        <p className="mt-16 text-xs text-muted-foreground">Last updated: pending publish.</p>
      </div>
    </section>
  </SiteLayout>
);

export default LegalTerms;
