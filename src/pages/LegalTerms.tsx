import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";

/**
 * Terms of Service — v1 customer-facing draft.
 *
 * Step 30a.2 Commit 2 (C1 approach): replaces the seven [PLACEHOLDER —
 * pending legal review] stubs with reviewed-but-not-lawyer-reviewed copy.
 * Drawn from PIPEDA, OPC guidance for Canadian SaaS, standard consumer
 * SaaS-terms boilerplate, and grounded in the actual operational practices
 * documented in docs/ARCHITECTURE.md (Canadian residency, two database
 * roles, hash-chained audit trail, Parameter Store secrets, soft-delete
 * with retention purge).
 *
 * The framing is honest: this is the v1 publish-ready version. A
 * comprehensive legal review is scheduled and will be reflected in a future
 * "Last updated" revision.
 */

type Section = {
  title: string;
  body: string;
};

const sections: Section[] = [
  {
    title: "Service description",
    body:
      "VantageMind AI (\"VantageMind\", \"we\", \"our\") provides Luciel, an AI judgment layer deployable at the scope of an individual professional, a department, or a company, together with associated platform services (the \"Service\"). The features available to a customer are determined by the subscription tier in effect, as described on the pricing page and confirmed at checkout. These Terms of Service (the \"Terms\") govern the customer's access to and use of the Service. By creating an account, completing a checkout, or using the Service, the customer agrees to these Terms.",
  },
  {
    title: "Account responsibilities",
    body:
      "The customer is responsible for the accuracy and currency of the information provided at sign-up and during the life of the subscription, and for the security of every credential, sign-in link, and embed key issued to or on behalf of the customer's organization. The customer must notify us promptly at security@vantagemind.ai of any suspected unauthorized access, credential leakage, or other security incident affecting the customer's account. The customer is responsible for the acts and omissions of any user it authorizes to access the Service under its account.",
  },
  {
    title: "Acceptable use",
    body:
      "The customer agrees not to use the Service (a) in violation of applicable law; (b) to attempt to bypass, disable, or interfere with the scope, policy, audit, or rate-limiting controls of the Service; (c) to upload or transmit content that is unlawful, infringing, or that the customer does not have the right to share; (d) to reverse-engineer the Service or its underlying models except to the extent expressly permitted by applicable law; or (e) to use the Service to generate output intended to deceive, defame, harass, or harm a natural person. We may suspend or terminate access for material breach of this section, with notice where reasonably practicable.",
  },
  {
    title: "Payment, trials, renewals, and cancellation",
    body:
      "Subscriptions are billed in advance on the cadence (monthly or annual) selected at checkout, in the currency listed on the pricing page (Canadian dollars at launch). Free trials, where offered, convert automatically into a paid subscription at the end of the trial period unless cancelled before then; the trial length applicable to each tier is shown at checkout. Subscriptions renew automatically at the end of each billing period at the then-current price. The customer may cancel at any time from the billing portal; cancellation takes effect at the end of the current billing period and the customer retains access until that period ends. Refunds outside of the trial-conversion window are at our discretion and, where granted, are processed through Stripe back to the original payment method.",
  },
  {
    title: "Customer content and data ownership",
    body:
      "The customer retains all right, title, and interest in the content the customer submits to or generates through the Service (\"Customer Content\"). The customer grants us a limited, non-exclusive licence to host, process, and transmit Customer Content solely for the purposes of operating the Service for the customer, securing the Service, and complying with applicable law. We do not sell Customer Content and we do not use Customer Content to train third-party foundation models. We act as a processor (or service provider) of Customer Content; the customer remains the controller of personal information about its end users and clients contained in Customer Content. Privacy practices, including the rights of natural persons under PIPEDA, are described in our Privacy Policy.",
  },
  {
    title: "AI output and customer judgment",
    body:
      "Luciel produces recommendations, drafts, and other AI-generated output. We design Luciel to be calibrated, scope-bound, and to escalate ambiguous or out-of-policy matters to a human, but no AI system is infallible. The customer remains responsible for reviewing AI-generated output before acting on it in a context where the output's accuracy, fairness, or completeness matters \u2014 in particular, before any regulated communication, legal undertaking, or material business decision. Output is provided on an \u201cas-is\u201d basis to the extent permitted by law.",
  },
  {
    title: "Service availability and changes",
    body:
      "We use commercially reasonable efforts to keep the Service available and to recover quickly from incidents. Planned maintenance windows are announced in advance where practicable. We may introduce, modify, or discontinue features of the Service over time; material adverse changes affecting paid features will be communicated to active subscribers before they take effect. We will not retroactively reduce data-protection commitments below those in effect when Customer Content was provided.",
  },
  {
    title: "Confidentiality",
    body:
      "Each party will protect non-public information shared by the other party with at least the same degree of care it uses for its own confidential information of like importance, and in no event less than reasonable care. Confidential information may be used only for the purposes of these Terms and may be disclosed only to personnel and advisers with a need to know who are themselves bound by obligations of confidentiality. This section does not restrict disclosure required by law, provided the disclosing party gives prompt notice where lawful.",
  },
  {
    title: "Security and audit posture",
    body:
      "Production data is stored in Canadian-region infrastructure (Amazon Web Services, ca-central-1) without cross-border replication. Transport-layer security (TLS 1.3) protects data in transit; storage-layer encryption protects data at rest using customer-managed KMS keys. The Service maintains a hash-chained audit trail of consequential control-plane and data-plane events and emits independent operational logs. Secrets are stored in AWS Systems Manager Parameter Store with the deactivate-never-delete (\u201cPattern E\u201d) discipline so that the history of which credential was active when can be reconstructed. Additional detail is published at /security and /trust.",
  },
  {
    title: "Warranty disclaimer",
    body:
      "Except as expressly stated in these Terms, the Service is provided on an \u201cas-is\u201d and \u201cas-available\u201d basis. To the maximum extent permitted by law, we disclaim all implied warranties of merchantability, fitness for a particular purpose, non-infringement, and any warranty arising out of course of dealing or usage of trade. We do not warrant that the Service will be uninterrupted, error-free, or that the AI output it produces will meet the customer's particular requirements.",
  },
  {
    title: "Limitation of liability",
    body:
      "To the maximum extent permitted by applicable law, neither party will be liable to the other for indirect, incidental, consequential, special, exemplary, or punitive damages, or for lost profits, lost revenue, or lost data, arising out of or relating to these Terms or the Service, even if advised of the possibility of such damages. Each party's aggregate liability arising out of or relating to these Terms will not exceed the greater of (a) the amounts paid by the customer to VantageMind under these Terms in the twelve months preceding the event giving rise to the claim, and (b) one hundred Canadian dollars (CAD $100). The foregoing limitations do not apply where prohibited by applicable law, nor to a party's indemnification obligations, breach of confidentiality, or willful misconduct.",
  },
  {
    title: "Indemnification",
    body:
      "The customer will defend and indemnify VantageMind and its personnel against third-party claims arising out of (a) Customer Content that infringes a third party's rights or violates applicable law, or (b) the customer's breach of the Acceptable Use section of these Terms. We will defend and indemnify the customer against third-party claims that the Service, as provided by us and used in accordance with these Terms, infringes a third party's intellectual-property rights, subject to the customer giving us prompt written notice and sole control of the defence.",
  },
  {
    title: "Term, suspension, and termination",
    body:
      "These Terms take effect when the customer first accepts them and continue until the subscription is cancelled or otherwise terminated. Either party may terminate for material breach not cured within thirty (30) days after written notice. We may suspend access immediately, with notice where reasonably practicable, for non-payment, security risk, or a violation of the Acceptable Use section that is causing or threatening harm. On termination, the customer's right to access the Service ends; sections of these Terms that by their nature should survive (including data ownership, confidentiality, warranty disclaimer, limitation of liability, indemnification, and governing law) survive termination.",
  },
  {
    title: "Governing law and disputes (Ontario, Canada)",
    body:
      "These Terms are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to its conflict-of-laws principles. The courts of Ontario sitting in Toronto have exclusive jurisdiction over any dispute arising out of or relating to these Terms, and each party irrevocably consents to that jurisdiction \u2014 except that either party may seek injunctive relief in any court of competent jurisdiction to protect its intellectual-property rights or confidential information. The United Nations Convention on Contracts for the International Sale of Goods does not apply.",
  },
  {
    title: "Changes to these Terms",
    body:
      "We may update these Terms from time to time. Material changes affecting paid features will be announced to active subscribers at least thirty (30) days before they take effect. Non-material clarifications and corrections take effect on posting. The \u201cLast updated\u201d date at the bottom of this page reflects the current version. Continued use of the Service after a change takes effect constitutes acceptance of the updated Terms.",
  },
  {
    title: "Contact",
    body:
      "Questions about these Terms can be addressed to contact@vantagemind.ai. Privacy-specific questions should be addressed to privacy@vantagemind.ai. Security-incident reports should be sent to security@vantagemind.ai. VantageMind AI is based in Markham, Ontario, Canada.",
  },
];

const LegalTerms = () => (
  <SiteLayout>
    <Seo
      title="Terms of Service — VantageMind AI"
      description="Terms of Service governing use of VantageMind AI products, including the Luciel deployment platform. Ontario, Canada law."
      path="/legal/terms"
    />
    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
        <Eyebrow>LEGAL</Eyebrow>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Terms of Service
        </h1>
        <p className="mt-7 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This is the v1 customer-facing version of the VantageMind AI Terms of Service. It
          reflects the operational practices we run today and is written in plain language. A
          comprehensive legal review is scheduled; any material changes from that review will
          be announced to active subscribers and reflected in the “Last updated” date below.
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
            </li>
          ))}
        </ol>
        <p className="mt-16 text-xs text-muted-foreground">Last updated: May 2026.</p>
      </div>
    </section>
  </SiteLayout>
);

export default LegalTerms;
