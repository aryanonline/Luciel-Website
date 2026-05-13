/**
 * CreateLucielForm — POST /api/v1/admin/luciel-instances under the
 * cookied user's tenant.
 *
 * Step 30a.1: scope-aware. The form's available scope choices come from
 * the caller's subscription tier:
 *
 *   Individual ⇒ agent only
 *   Team       ⇒ agent | domain
 *   Company    ⇒ agent | domain | tenant
 *
 * The backend enforces the same mapping at AdminService._enforce_tier_scope
 * and returns 402 if violated; we mirror it here for a clean UX.
 *
 * Surfaces the minimum-viable fields:
 *   * instance_id   — slug; we provide a sane default the operator can edit
 *   * display_name  — shown in chat + dashboard
 *   * description   — optional internal note
 *   * system_prompt_additions — the persona / behaviour text the
 *                     instance brings to chat
 *   * scope_level   — only rendered when the tier offers a choice
 *
 * For the agent scope we currently bind to the caller's own agent (the
 * pre-minted primary Agent from TierProvisioningService). The backend's
 * SessionCookieAuthMiddleware infers caller_agent_id from the cookie.
 */

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  AdminApiError,
  LucielInstance,
  ScopeLevel,
  createLucielInstance,
} from "@/lib/admin";
import { SubscriptionStatus } from "@/lib/billing";

interface Props {
  tenantId: string;
  /**
   * Step 30a.1: when present, used to gate the scope dropdown. Defaults
   * to "individual" (the most restrictive) so a form without tier
   * context still gets a valid choice.
   */
  tier?: SubscriptionStatus["tier"];
  onCreated: (inst: LucielInstance) => void;
}

// Slugify helper — mirrors the backend's allowed slug pattern.
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "luciel";

const TIER_SCOPES: Record<string, ScopeLevel[]> = {
  individual: ["agent"],
  team: ["agent", "domain"],
  company: ["agent", "domain", "tenant"],
  unspecified: ["agent"],
};

const SCOPE_LABEL: Record<ScopeLevel, string> = {
  agent: "Just me (agent)",
  domain: "Our team (domain)",
  tenant: "Whole company (tenant)",
};

export const CreateLucielForm = ({ tenantId, tier = "individual", onCreated }: Props) => {
  const allowedScopes = useMemo(
    () => TIER_SCOPES[tier] ?? TIER_SCOPES.individual,
    [tier],
  );

  const [displayName, setDisplayName] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [instanceIdTouched, setInstanceIdTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [scopeLevel, setScopeLevel] = useState<ScopeLevel>(allowedScopes[0]);
  const [submitting, setSubmitting] = useState(false);

  // Auto-derive the slug from display name until the operator edits it.
  const onDisplayNameChange = (v: string) => {
    setDisplayName(v);
    if (!instanceIdTouched) setInstanceId(slugify(v));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Give your Luciel a name.");
      return;
    }
    const slug = instanceId.trim() || slugify(displayName);
    setSubmitting(true);
    try {
      // Step 30a.1: for non-tenant scopes the backend uses the caller's
      // own agent/domain from the cookie when scope_owner_* fields are
      // omitted for that level. We always send scope_owner_tenant_id;
      // for "domain" we let the backend resolve domain from the session.
      const inst = await createLucielInstance({
        instance_id: slug,
        display_name: displayName.trim(),
        scope_level: scopeLevel,
        scope_owner_tenant_id: tenantId,
        description: description.trim() || undefined,
        system_prompt_additions: systemPrompt.trim() || undefined,
      });
      onCreated(inst);
    } catch (err) {
      const msg =
        err instanceof AdminApiError
          ? err.message
          : "Couldn't create the Luciel. Try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="eyebrow">New Luciel</div>

      <div>
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="Sarah's Lead Qualifier"
          maxLength={200}
          required
          className="mt-2"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          What your visitors see in the chat header.
        </p>
      </div>

      <div>
        <Label htmlFor="instance-id">Slug</Label>
        <Input
          id="instance-id"
          value={instanceId}
          onChange={(e) => {
            setInstanceIdTouched(true);
            setInstanceId(slugify(e.target.value));
          }}
          placeholder="sarahs-lead-qualifier"
          maxLength={100}
          minLength={2}
          required
          className="mt-2 font-mono"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          URL-safe identifier; unique within your tenant. Lowercase letters,
          numbers, and dashes only.
        </p>
      </div>

      {allowedScopes.length > 1 && (
        <div>
          <Label htmlFor="scope-level">Who is this Luciel for?</Label>
          <select
            id="scope-level"
            value={scopeLevel}
            onChange={(e) => setScopeLevel(e.target.value as ScopeLevel)}
            className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {allowedScopes.map((s) => (
              <option key={s} value={s}>
                {SCOPE_LABEL[s]}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted-foreground">
            Your {tier} plan supports {allowedScopes.map((s) => SCOPE_LABEL[s].toLowerCase()).join(", ")}.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Qualifies leads on the homepage"
          maxLength={1000}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="system-prompt">Persona &amp; instructions</Label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder={
            "You are a friendly real-estate concierge for Sarah Realty. " +
            "Greet visitors warmly, ask what they're looking for, and " +
            "qualify them on budget, timing, and location. Hand off to " +
            "Sarah by collecting a callback number when the lead is ready."
          }
          rows={6}
          className="mt-2"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          The system prompt your Luciel runs every conversation under. You
          can edit this any time from the instance detail page.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create Luciel"}
        </Button>
      </div>
    </form>
  );
};
