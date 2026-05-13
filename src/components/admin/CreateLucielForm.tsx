/**
 * CreateLucielForm — POST /api/v1/admin/luciel-instances under the
 * cookied user's tenant.
 *
 * Surfaces the minimum-viable v1 fields:
 *   * instance_id   — slug; we provide a sane default the operator can edit
 *   * display_name  — shown in chat + dashboard
 *   * description   — optional internal note
 *   * system_prompt_additions — the persona / behaviour text the
 *                     instance brings to chat
 *
 * scope_level is hard-coded to "tenant" at v1: the only user that hits
 * this form is the tenant admin (cookied dashboard session). Domain-
 * and agent-scoped instances are a Step 33+ surface for multi-domain
 * tenants — out of scope for Sarah's journey.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  AdminApiError,
  LucielInstance,
  createLucielInstance,
} from "@/lib/admin";

interface Props {
  tenantId: string;
  onCreated: (inst: LucielInstance) => void;
}

// Slugify helper — mirrors the backend's allowed slug pattern.
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "luciel";

export const CreateLucielForm = ({ tenantId, onCreated }: Props) => {
  const [displayName, setDisplayName] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [instanceIdTouched, setInstanceIdTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
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
      const inst = await createLucielInstance({
        instance_id: slug,
        display_name: displayName.trim(),
        scope_level: "tenant",
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
