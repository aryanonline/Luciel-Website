import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";

type Row = [control: string, implementation: string];

const Group = ({ title, rows }: { title: string; rows: Row[] }) => (
  <FadeIn as="section" className="border-t border-border pt-12 first:border-t-0 first:pt-0">
    <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-4xl">{title}</h2>
    <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="hidden grid-cols-[1fr_2fr] border-b border-border md:grid">
        <div className="p-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Control</div>
        <div className="border-l border-border p-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Implementation
        </div>
      </div>
      <div className="divide-y divide-border">
        {rows.map(([c, i], idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_2fr]">
            <div className="p-5 text-sm font-medium text-foreground">{c}</div>
            <div className="border-t border-border p-5 text-sm leading-relaxed text-muted-foreground md:border-l md:border-t-0">
              {i}
            </div>
          </div>
        ))}
      </div>
    </div>
  </FadeIn>
);

const Security = () => (
  <SiteLayout>
    <Seo
      title="Security and Compliance — VantageMind AI"
      description="PIPEDA-native, Canadian-resident, per-tenant isolation, scope-enforced permissions, full audit. The technical posture."
      path="/security"
    />

    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
        <Eyebrow>SECURITY AND COMPLIANCE</Eyebrow>
        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
          The technical posture.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Compliance isn't a feature we added. It's the foundation every tenant is built on.
          Below is the implementation, control by control.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow space-y-16">
        <Group
          title="Jurisdiction and residency"
          rows={[
            ["Governing regulation", "Canada PIPEDA. Designed against Canadian privacy doctrine first."],
            ["Hosting region", "AWS ca-central-1 exclusively. No multi-region replication that crosses the border."],
            ["Data egress", "No cross-border data transfer. All processing, storage, and inference traffic remains in Canada."],
          ]}
        />
        <Group
          title="Tenant isolation"
          rows={[
            ["Database scoping", "Per-tenant scoping at the repository layer. Every query is bound to a tenant context that cannot be omitted."],
            ["Admin route policy", "ScopePolicy applied to every admin route. Out-of-scope reads and writes are rejected at the API boundary, not at the UI."],
            ["Cascade behavior", "Tenant deactivation cascades to all owned domains, agents, and identities."],
          ]}
        />
        <Group
          title="Identity and access"
          rows={[
            ["API key binding", "Every API key is bound to a luciel_instance_id. Keys are not portable across instances."],
            ["Key rotation", "Mandatory key rotation on role change. Old keys are revoked at issue time, not on schedule."],
            ["Privileged role", "platformadmin permission required for cross-tenant operations. Privilege-escalation guard rejects any attempt to grant a permission the caller does not hold."],
          ]}
        />
        <Group
          title="Knowledge pipeline"
          rows={[
            ["Embeddings", "Versioned embeddings. Every chunk is traceable to a source version and a chunking config."],
            ["Per-tenant chunking", "Per-tenant and per-domain chunking configuration. No global defaults that override tenant intent."],
            ["Source attribution", "Every retrieved chunk carries source attribution surfaced in the runtime trace."],
          ]}
        />
        <Group
          title="Audit and traceability"
          rows={[
            ["Per-turn trace", "A Trace row is written for every conversation turn: model used, tools called, memory touched, policy flags, escalations."],
            ["Admin audit log", "AdminAuditLog records every privileged action with the acting identity, target, before-and-after state, and timestamp."],
            ["Deletion log", "DeletionLog provides immutable, append-only records of every deletion event, retained for two years."],
          ]}
        />
        <Group
          title="Consent and retention"
          rows={[
            ["Consent model", "UserConsent is per-purpose, per-tenant, timestamped, and withdrawable. Consent is required before personal memory is stored or retrieved."],
            ["Memory gating", "Memory access is consent-gated at the runtime layer. A missing or withdrawn consent results in a hard miss, not a silent fallthrough."],
            ["Retention policies", "Five default retention policies configurable per tenant. Enforced by scheduled jobs with deletion proof in DeletionLog."],
          ]}
        />
        <Group
          title="Production posture"
          rows={[
            ["Compute", "ECS Fargate in ca-central-1."],
            ["Database", "Amazon RDS for PostgreSQL with pgvector, encrypted at rest. Backups and snapshots stay in ca-central-1."],
            ["Edge", "Application Load Balancer in front of the service. TLS terminated at the ALB."],
          ]}
        />
        <Group
          title="Roadmap"
          rows={[
            ["SOC 2 Type II", "Planned. Not yet attested. We do not claim coverage we have not earned."],
            ["External privacy review", "Planned. Independent PIPEDA review and report once design partners are operational."],
          ]}
        />
      </div>
    </section>
  </SiteLayout>
);

export default Security;
