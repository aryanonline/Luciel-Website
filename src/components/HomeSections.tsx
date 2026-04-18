import {
  MapPin,
  ShieldCheck,
  Lock,
  FileCheck2,
  Trash2,
  KeyRound,
  Eye,
  Layers,
} from "lucide-react";
import { SectionHeading } from "@/components/Section";

const pillars = [
  {
    icon: MapPin,
    title: "Canadian data residency",
    desc: "All infrastructure in AWS ca-central-1. Your data never leaves Canada.",
  },
  {
    icon: ShieldCheck,
    title: "PIPEDA-compliant from day one",
    desc: "Consent and retention are enforced at the core, not bolted on.",
  },
  {
    icon: Layers,
    title: "Three-layer authorization",
    desc: "Authentication (who), permissions (what), and scope (which rows). Tenant, domain, and agent boundaries enforced at the API layer.",
  },
  {
    icon: FileCheck2,
    title: "Explicit user consent gating",
    desc: "No personal memory is stored or retrieved without timestamped consent. Withdrawable anytime.",
  },
  {
    icon: Trash2,
    title: "Automated data retention",
    desc: "Per-tenant purge and anonymize policies with immutable 2-year deletion audit logs.",
  },
  {
    icon: Lock,
    title: "Encrypted end-to-end",
    desc: "RDS encryption at rest, TLS in transit, AWS Secrets Manager for every credential.",
  },
  {
    icon: KeyRound,
    title: "Hashed API keys",
    desc: "SHA-256 hashed, never stored in plaintext. Scoped per tenant, domain, or agent.",
  },
  {
    icon: Eye,
    title: "Full observability",
    desc: "Every conversation recorded as an auditable trace: model used, tools called, memory touched, escalations triggered.",
  },
];

export const SecurityCompliance = () => (
  <section className="section border-t border-border">
    <div className="container-narrow">
      <SectionHeading
        eyebrow="SECURITY & COMPLIANCE"
        title="Security and compliance, built into the core"
        description="Luciel is PIPEDA-compliant by design. Compliance isn't a feature we added — it's the foundation every tenant is built on."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                  <Icon size={18} />
                </div>
                <h3 className="font-display mt-5 text-base font-semibold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const comparisonRows: [string, string][] = [
  [
    "One chatbot you customize with prompts",
    "One fixed intelligence with a permanent persona and doctrine",
  ],
  [
    "Tenant isolation bolted on later",
    "Three-level hierarchy (tenant / domain / agent) built into every layer",
  ],
  ["Compliance as an add-on", "PIPEDA consent and retention enforced in the core"],
  ["Hosted wherever is cheapest", "Canadian-built, Canadian-hosted, Canadian-compliant"],
  ["Hallucinates confidently", "Escalates before false certainty"],
  ["Code changes to add a client", "New tenants are a single API call — config over code"],
  ["Black-box responses", "Full trace on every turn: provider, tools, memory, policy flags"],
  [
    "Generic for every industry",
    "Vertical-ready: real estate live, property management and mortgage next",
  ],
];

export const WhatMakesDifferent = () => (
  <section className="section border-t border-border">
    <div className="container-narrow">
      <SectionHeading
        eyebrow="WHAT MAKES LUCIEL DIFFERENT"
        title="What makes Luciel different"
        description="Most AI platforms are generic chatbots with a custom prompt. Luciel is architecturally different."
      />

      <div className="mt-14 overflow-hidden rounded-xl border border-border bg-card">
        {/* Header — desktop only */}
        <div className="hidden grid-cols-2 border-b border-border md:grid">
          <div className="p-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Generic AI Platforms
          </div>
          <div className="border-l border-border bg-primary/5 p-5 text-xs uppercase tracking-[0.18em] text-primary">
            Luciel
          </div>
        </div>

        <div className="divide-y divide-border">
          {comparisonRows.map(([generic, luciel], i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-5 text-sm text-muted-foreground">
                <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 md:hidden">
                  Generic AI
                </div>
                {generic}
              </div>
              <div className="border-t border-border bg-primary/5 p-5 text-sm text-foreground md:border-l md:border-t-0">
                <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-primary md:hidden">
                  Luciel
                </div>
                {luciel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctrine pull-quote */}
      <div className="relative mt-12 overflow-hidden rounded-xl border border-primary/30 bg-card p-8 md:p-12">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(600px circle at 20% 0%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(500px circle at 100% 100%, hsl(252 100% 50% / 0.12), transparent 60%)",
          }}
        />
        <div className="text-xs uppercase tracking-[0.18em] text-primary">THE LUCIEL DOCTRINE</div>
        <blockquote className="font-display mt-5 max-w-3xl text-xl font-medium leading-[1.5] tracking-tight text-foreground md:text-2xl md:leading-[1.45]">
          "Luciel exists to understand before acting. Luciel asks only what improves judgment.
          Luciel uses tools for truth, not theater. Luciel recommends with reasons and tradeoffs.
          Luciel escalates before false confidence. Luciel remains Luciel in every domain."
        </blockquote>
        <div className="mt-6 text-sm text-muted-foreground">— The Luciel Doctrine</div>
      </div>
    </div>
  </section>
);
