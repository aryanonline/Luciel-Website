/**
 * Dashboard.tsx — Step 32 admin surface root.
 *
 * Sarah's customer journey lands here after the magic-link redirect
 * from /api/v1/billing/login. The page is gated on the Step 30a
 * session cookie: an unauthenticated user gets a sign-in CTA, a user
 * with no subscription gets a "start trial" CTA, and an authenticated
 * subscriber gets the dashboard tabs:
 *
 *   * Overview  — Step 31 tenant rollup (turn count, escalations,
 *                 trend line, top Luciels)
 *   * Luciels   — list + "Create new Luciel" form (Step 31.2 commit B
 *                 unlocked per-instance scoping for the embed keys
 *                 that ride out of /dashboard/luciels/:pk/deploy)
 *   * Account   — link to /account (we don't duplicate the billing
 *                 surface here — that's Account.tsx)
 *
 * Authentication: getBillingStatus + listLucielInstances + getTenant
 * Dashboard all ride the session cookie. We branch on the BillingApi
 * Error.status returned by /api/v1/billing/me to decide which CTA to
 * show; data-tab fetches run in parallel.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  BillingApiError,
  SubscriptionStatus,
  getBillingStatus,
} from "@/lib/billing";
import {
  AdminApiError,
  Agent,
  DOMAIN_SLUG_REGEX,
  DomainConfig,
  LucielInstance,
  TenantDashboard,
  UserInvite,
  createDomainSelfServe,
  createInvite,
  deactivateDomainSelfServe,
  getTenantDashboard,
  listAgents,
  listDomainsSelfServe,
  listInvites,
  listLucielInstances,
  resendInvite,
  revokeInvite,
} from "@/lib/admin";
import { CreateLucielForm } from "@/components/admin/CreateLucielForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthState =
  | { kind: "loading" }
  | { kind: "ok"; subscription: SubscriptionStatus }
  | { kind: "unauthenticated" }
  | { kind: "no_sub" }
  | { kind: "error"; message: string };

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-8">{children}</div>
);

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-6">
    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </div>
    <div className="mt-3 font-display text-4xl tracking-tight text-foreground">
      {value}
    </div>
    {hint && <div className="mt-2 text-sm text-muted-foreground">{hint}</div>}
  </div>
);

// --------------------------------------------------------------------- //
// Overview tab — Step 31 tenant rollup
// --------------------------------------------------------------------- //

const OverviewTab = ({ tenantId }: { tenantId: string }) => {
  const [data, setData] = useState<TenantDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenantDashboard(7, 5)
      .then(setData)
      .catch((err: unknown) => {
        const msg =
          err instanceof AdminApiError
            ? err.message
            : "Couldn't load dashboard. Try refreshing.";
        setError(msg);
      });
  }, [tenantId]);

  if (error) {
    return (
      <Card>
        <div className="eyebrow">Overview</div>
        <p className="mt-4 text-base text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <div className="eyebrow">Overview</div>
        <p className="mt-4 text-base text-muted-foreground">Loading rollups…</p>
      </Card>
    );
  }

  const a = data.aggregates;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Conversations"
          value={a.turn_count}
          hint={`Last ${data.window_days} days`}
        />
        <StatCard
          label="Unique visitors"
          value={a.unique_user_count}
          hint="Across all Luciels"
        />
        <StatCard
          label="Escalations"
          value={a.escalation_count}
          hint="Routed to a human"
        />
        <StatCard
          label="Tool calls"
          value={a.tool_call_count}
          hint="Actions taken by Luciel"
        />
      </div>

      <Card>
        <div className="eyebrow">Top Luciels</div>
        {data.top_luciel_instances.length === 0 ? (
          <p className="mt-4 text-base text-muted-foreground">
            No Luciels have handled traffic yet. Create one in the{" "}
            <span className="font-medium">Luciels</span> tab and deploy its
            widget to see numbers here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border">
            {data.top_luciel_instances.map((c) => (
              <li
                key={c.child_id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="text-base text-foreground">
                    {c.child_display_name ?? c.child_id}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {c.child_id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base text-foreground">{c.turn_count}</div>
                  <div className="text-xs text-muted-foreground">turns</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="eyebrow">Tenant</div>
        <div className="mt-4 font-mono text-sm text-muted-foreground">
          {data.tenant_id}
        </div>
      </Card>
    </div>
  );
};

// --------------------------------------------------------------------- //
// Luciels tab — list + create
// --------------------------------------------------------------------- //

const LucielsTab = ({
  tenantId,
  tier,
  instanceCountCap,
}: {
  tenantId: string;
  tier: SubscriptionStatus["tier"];
  instanceCountCap: number;
}) => {
  const [instances, setInstances] = useState<LucielInstance[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const refresh = () => {
    setError(null);
    listLucielInstances(tenantId, false)
      .then(setInstances)
      .catch((err: unknown) => {
        const msg =
          err instanceof AdminApiError
            ? err.message
            : "Couldn't load your Luciels. Try refreshing.";
        setError(msg);
      });
  };

  useEffect(refresh, [tenantId]);

  // Step 30a.1: gate "New Luciel" on the tier's active-instance cap so
  // the user gets a clean local message instead of bumping into the
  // backend's 402. We count tenant-wide active instances here — same
  // count the backend computes via LucielInstanceRepository.count_active_for_tenant.
  const activeCount = (instances ?? []).filter((i) => i.active).length;
  const atCap = instances !== null && activeCount >= instanceCountCap;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Eyebrow>Your Luciels</Eyebrow>
          {instances !== null && (
            <p className="mt-2 text-sm text-muted-foreground">
              {activeCount} of {instanceCountCap} used on your {tier} plan.
            </p>
          )}
        </div>
        <Button
          onClick={() => setShowCreate((s) => !s)}
          disabled={!showCreate && atCap}
          title={atCap ? `You've reached the ${tier} plan limit (${instanceCountCap}).` : undefined}
        >
          {showCreate ? "Cancel" : "New Luciel"}
        </Button>
      </div>

      {atCap && !showCreate && (
        <Card>
          <div className="eyebrow">Plan limit reached</div>
          <p className="mt-4 text-base text-muted-foreground">
            Your {tier} plan supports up to {instanceCountCap} active Luciels.
            Deactivate one from its detail page, or{" "}
            <Link
              to="/pricing"
              className="underline underline-offset-2 hover:text-foreground"
            >
              upgrade to a larger plan
            </Link>
            {" "}for more room.
          </p>
        </Card>
      )}

      {showCreate && (
        <Card>
          <CreateLucielForm
            tenantId={tenantId}
            tier={tier}
            onCreated={(inst) => {
              toast.success(`Created "${inst.display_name}"`);
              setShowCreate(false);
              refresh();
            }}
          />
        </Card>
      )}

      {error && (
        <Card>
          <p className="text-base text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={refresh}>
            Retry
          </Button>
        </Card>
      )}

      {!error && instances === null && (
        <Card>
          <p className="text-base text-muted-foreground">Loading…</p>
        </Card>
      )}

      {!error && instances !== null && instances.length === 0 && (
        <Card>
          <p className="text-base text-muted-foreground">
            You haven't created a Luciel yet. Click <b>New Luciel</b> to spin
            one up.
          </p>
        </Card>
      )}

      {!error && instances !== null && instances.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {instances.map((inst) => (
            <li key={inst.id}>
              <Link
                to={`/dashboard/luciels/${inst.id}`}
                className="block rounded-xl border border-border bg-card p-6 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-medium text-foreground">
                    {inst.display_name}
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                      inst.active
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-border bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {inst.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground">
                  {inst.instance_id}
                </div>
                {inst.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {inst.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --------------------------------------------------------------------- //
// Company tab — Step 30a.5 (Company tier + tenant_admin/owner only)
// --------------------------------------------------------------------- //
//
// The Company tab is the org-building surface for a Company customer.
// Visibility gate (locked in design doc §11 Q5, resolved 2026-05-18):
//
//   tier === "company" AND role IN ("tenant_admin", "owner")
//
// Gating on tier alone would leak Domain creation/deactivation to an
// invited department lead, breaking the design's intended chain of
// authority. The role is sourced off the cookied user's active
// ScopeAssignment via the active_role field on /api/v1/billing/me.
//
// Acceptance test target (design §13.1 T1): a Company customer pays
// $1,000, opens /dashboard, creates two Domains, invites two leads,
// each lead invites two agents. Six invite emails, zero founder
// involvement -- this tab carries the Domain-creation half of that
// flow; the Team tab carries the invite-to-the-domain half.

const CompanyTab = ({
  tenantId,
}: {
  tenantId: string;
}) => {
  const [domains, setDomains] = useState<DomainConfig[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyDomainId, setBusyDomainId] = useState<string | null>(null);

  const refresh = () => {
    setError(null);
    listDomainsSelfServe()
      .then(setDomains)
      .catch((err: unknown) => {
        const msg =
          err instanceof AdminApiError
            ? err.message
            : "Couldn't load your domains. Try refreshing.";
        setError(msg);
      });
  };

  useEffect(refresh, [tenantId]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const slugTrim = slug.trim().toLowerCase();
    const nameTrim = displayName.trim();
    if (!DOMAIN_SLUG_REGEX.test(slugTrim)) {
      toast.error(
        "Slug must be lowercase letters, digits, and internal hyphens only.",
      );
      return;
    }
    if (!nameTrim) {
      toast.error("Give the domain a display name.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createDomainSelfServe({
        domain_id: slugTrim,
        display_name: nameTrim,
        description: description.trim() || undefined,
      });
      toast.success(`Created domain ${created.domain_id}.`);
      setSlug("");
      setDisplayName("");
      setDescription("");
      setShowCreate(false);
      refresh();
    } catch (err) {
      // Backend error shapes (design §6.3):
      //   402 {code:"domain_cap_reached"|"tier_scope_not_allowed"|"no_active_subscription"}
      //   409 {code:"domain_slug_taken"}
      //   422 -- slug regex / length
      const isApi = err instanceof AdminApiError;
      let message = "Couldn't create the domain. Try again.";
      if (isApi) {
        const detail = (err.body as { detail?: unknown })?.detail;
        if (detail && typeof detail === "object" && "message" in detail) {
          message = String((detail as { message: unknown }).message);
        } else {
          message = err.message;
        }
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onDeactivate = async (domainId: string) => {
    const confirmed = window.confirm(
      `Deactivate domain "${domainId}"? This cascades to every Luciel and ` +
        `agent assigned to it.`,
    );
    if (!confirmed) return;
    setBusyDomainId(domainId);
    try {
      await deactivateDomainSelfServe(domainId);
      toast.success(`Deactivated ${domainId}.`);
      refresh();
    } catch (err) {
      const msg =
        err instanceof AdminApiError
          ? err.message
          : "Couldn't deactivate the domain. Try again.";
      toast.error(msg);
    } finally {
      setBusyDomainId(null);
    }
  };

  const activeDomains = (domains ?? []).filter((d) => d.active);
  const inactiveDomains = (domains ?? []).filter((d) => !d.active);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Your company</Eyebrow>
          <p className="mt-2 text-sm text-muted-foreground">
            Every department in your company runs in its own Domain. Create
            one Domain per team — sales, marketing, support — and invite
            leads from the Team tab.
          </p>
        </div>
        <Button onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? "Cancel" : "New domain"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <form onSubmit={onCreate} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="domain-slug">Slug</Label>
              <Input
                id="domain-slug"
                type="text"
                placeholder="sales"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                autoComplete="off"
                required
                minLength={2}
                maxLength={64}
                pattern="^[a-z0-9][a-z0-9-]*[a-z0-9]$"
              />
              <p className="text-xs text-muted-foreground">
                Lowercase letters, digits, and internal hyphens. Shown in
                URLs and audit logs.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="domain-display-name">Display name</Label>
              <Input
                id="domain-display-name"
                type="text"
                placeholder="Sales"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="off"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="domain-description">Description (optional)</Label>
              <Input
                id="domain-description"
                type="text"
                placeholder="What this team focuses on."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                maxLength={500}
              />
            </div>
            <div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create domain"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {error && (
        <Card>
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {domains === null && !error && (
        <Card>
          <p className="text-sm text-muted-foreground">Loading domains…</p>
        </Card>
      )}

      {domains !== null && activeDomains.length === 0 && (
        <Card>
          <p className="text-sm text-muted-foreground">
            No domains yet. Create one per department so each team's Luciels
            stay scoped to their work.
          </p>
        </Card>
      )}

      {activeDomains.length > 0 && (
        <ul className="space-y-3">
          {activeDomains.map((d) => (
            <li
              key={d.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div>
                <div className="font-display text-lg text-foreground">
                  {d.display_name}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {d.domain_id}
                </div>
                {d.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {d.description}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => onDeactivate(d.domain_id)}
                disabled={busyDomainId === d.domain_id}
              >
                {busyDomainId === d.domain_id ? "Deactivating…" : "Deactivate"}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {inactiveDomains.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            {inactiveDomains.length} inactive domain
            {inactiveDomains.length === 1 ? "" : "s"}
          </summary>
          <ul className="mt-3 space-y-2">
            {inactiveDomains.map((d) => (
              <li
                key={d.id}
                className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  {d.display_name}
                </span>{" "}
                ({d.domain_id})
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};

// --------------------------------------------------------------------- //
// Team tab — Step 30a.4 (Team / Company tiers only)
// --------------------------------------------------------------------- //
//
// Step 30a.1 carved this tab with an "Add teammate" form that POSTed to
// /api/v1/admin/luciel-instances with teammate_email set. That overload
// is deprecated as of Step 30a.4; the first-class UserInvite lifecycle
// (POST/GET/RESEND/DELETE /api/v1/admin/invites) is the canonical path.
//
// Surface now shows two lists:
//   * Pending invites -- mint-time row from POST /admin/invites, with
//     resend / revoke actions and an expires-in countdown (7-day TTL).
//   * Accepted teammates -- Agents that came from a redeemed invite.
//
// Redemption is handled by the existing /auth/set-password page; the
// invite-purpose JWT in the welcome email lands the new teammate there
// and SetPassword.tsx happily redeems it (the backend route routes on
// `purpose='invite'` and calls invite_service.redeem_invite). No new
// page on the website -- only the team-tab UI changes.

const TeamTab = ({
  tenantId,
  tier,
}: {
  tenantId: string;
  tier: SubscriptionStatus["tier"];
}) => {
  const [members, setMembers] = useState<Agent[] | null>(null);
  const [invites, setInvites] = useState<UserInvite[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyInviteId, setBusyInviteId] = useState<string | null>(null);

  const refresh = () => {
    setError(null);
    listAgents(true)
      .then(setMembers)
      .catch((err: unknown) => {
        const msg =
          err instanceof AdminApiError
            ? err.message
            : "Couldn't load your team. Try refreshing.";
        setError(msg);
      });
    listInvites()
      .then(setInvites)
      .catch((err: unknown) => {
        // Invites failing is non-fatal -- the team list is still useful.
        // Surface as toast, leave invites at null so the section is hidden.
        const msg =
          err instanceof AdminApiError
            ? err.message
            : "Couldn't load pending invites.";
        toast.error(msg);
        setInvites([]);
      });
  };

  useEffect(refresh, [tenantId]);

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    const name = inviteName.trim();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid teammate email.");
      return;
    }
    if (!name) {
      toast.error("Add a display name for your teammate.");
      return;
    }
    setSubmitting(true);
    try {
      await createInvite({
        invited_email: email,
        role: "teammate",
        display_name: name,
        // tenant_id + domain_id default to the cookied user's active
        // scope on the backend; passing them is optional and we omit
        // them so the backend stays the source of truth.
      });
      toast.success(`Invited ${email}. We sent them a sign-in link.`);
      setInviteEmail("");
      setInviteName("");
      setShowInvite(false);
      refresh();
    } catch (err) {
      const isApi = err instanceof AdminApiError;
      // 409 = duplicate pending invite OR pending-cap exceeded.
      // 410 = invite expired (shouldn't happen on create, but defensive).
      const message = isApi
        ? err.message
        : "Couldn't add teammate. Try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async (inviteId: string, email: string) => {
    setBusyInviteId(inviteId);
    try {
      const res = await resendInvite(inviteId);
      if (res.sent) {
        toast.success(`Re-sent invite to ${email}.`);
      } else {
        toast.message(
          `Re-issued invite for ${email} (email was rate-limited).`,
        );
      }
      refresh();
    } catch (err) {
      const msg =
        err instanceof AdminApiError
          ? err.message
          : "Couldn't resend invite. Try again.";
      toast.error(msg);
    } finally {
      setBusyInviteId(null);
    }
  };

  const onRevoke = async (inviteId: string, email: string) => {
    setBusyInviteId(inviteId);
    try {
      await revokeInvite(inviteId);
      toast.success(`Revoked invite for ${email}.`);
      refresh();
    } catch (err) {
      const msg =
        err instanceof AdminApiError
          ? err.message
          : "Couldn't revoke invite. Try again.";
      toast.error(msg);
    } finally {
      setBusyInviteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Your team</Eyebrow>
          <p className="mt-2 text-sm text-muted-foreground">
            {tier === "company"
              ? "Everyone with access to this company deployment."
              : "Everyone with access to this team's Luciels."}
          </p>
        </div>
        <Button onClick={() => setShowInvite((s) => !s)}>
          {showInvite ? "Cancel" : "Add teammate"}
        </Button>
      </div>

      {showInvite && (
        <Card>
          <form onSubmit={onInvite} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Teammate email</Label>
              <Input
                id="invite-email"
                type="email"
                required
                autoComplete="off"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-name">Display name</Label>
              <Input
                id="invite-name"
                type="text"
                required
                autoComplete="off"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send a one-time sign-in link to that address. Their
              Luciel and scope are provisioned the moment they accept.
            </p>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending invite…" : "Send invite"}
            </Button>
          </form>
        </Card>
      )}

      {error && (
        <Card>
          <p className="text-base text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={refresh}>
            Retry
          </Button>
        </Card>
      )}

      {!error && members === null && (
        <Card>
          <p className="text-base text-muted-foreground">Loading…</p>
        </Card>
      )}

      {/* Pending invites -- Step 30a.4. Only render the section when
          there is at least one pending row; revoked / accepted invites
          live in the audit chain, not the UI. */}
      {!error && invites !== null && invites.filter((i) => i.status === "pending").length > 0 && (
        <div className="space-y-3">
          <Eyebrow>Pending invites</Eyebrow>
          <ul
            data-testid="pending-invites-list"
            className="divide-y divide-border rounded-xl border border-border bg-card"
          >
            {invites
              .filter((i) => i.status === "pending")
              .map((inv) => {
                const expiresAt = new Date(inv.expires_at);
                const expiresInDays = Math.max(
                  0,
                  Math.floor(
                    (expiresAt.getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  ),
                );
                const busy = busyInviteId === inv.id;
                return (
                  <li
                    key={inv.id}
                    data-testid={`pending-invite-${inv.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-base text-foreground">
                        {inv.invited_email}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        Invited · expires in {expiresInDays} day
                        {expiresInDays === 1 ? "" : "s"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() => onResend(inv.id, inv.invited_email)}
                      >
                        {busy ? "…" : "Resend"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() => onRevoke(inv.id, inv.invited_email)}
                      >
                        {busy ? "…" : "Revoke"}
                      </Button>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {!error && members !== null && members.length === 0 && (
        <Card>
          <p className="text-base text-muted-foreground">
            No teammates yet. Click <b>Add teammate</b> to invite the first
            person on your team.
          </p>
        </Card>
      )}

      {!error && members !== null && members.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="min-w-0">
                <div className="truncate text-base text-foreground">
                  {m.display_name}
                </div>
                <div className="truncate font-mono text-xs text-muted-foreground">
                  {m.contact_email ?? m.agent_id}
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                  m.active
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                {m.active ? "Active" : "Inactive"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --------------------------------------------------------------------- //
// Account tab — just a deep-link out
// --------------------------------------------------------------------- //

const AccountTab = () => (
  <Card>
    <div className="eyebrow">Account & billing</div>
    <p className="mt-4 text-base text-muted-foreground">
      Manage your subscription, payment method, and trial status in the
      account area.
    </p>
    <div className="mt-6 flex gap-3">
      <Button asChild>
        <Link to="/account/billing">Manage billing</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link to="/account">Profile</Link>
      </Button>
    </div>
  </Card>
);

// --------------------------------------------------------------------- //
// Page root
// --------------------------------------------------------------------- //

const Dashboard = () => {
  const [auth, setAuth] = useState<AuthState>({ kind: "loading" });

  useEffect(() => {
    getBillingStatus()
      .then((subscription) => setAuth({ kind: "ok", subscription }))
      .catch((err: unknown) => {
        if (err instanceof BillingApiError) {
          if (err.status === 401) {
            setAuth({ kind: "unauthenticated" });
            return;
          }
          if (err.status === 404) {
            setAuth({ kind: "no_sub" });
            return;
          }
          setAuth({ kind: "error", message: err.message });
          return;
        }
        setAuth({
          kind: "error",
          message: "Couldn't load your account. Try refreshing.",
        });
      });
  }, []);

  return (
    <SiteLayout>
      <Seo
        title="Dashboard — VantageMind AI"
        description="Build and deploy your Luciel instances."
        path="/dashboard"
        noIndex
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>DASHBOARD</Eyebrow>
          <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Your Luciels.
          </h1>

          <div className="mt-12">
            {auth.kind === "loading" && (
              <Card>
                <p className="text-base text-muted-foreground">Loading…</p>
              </Card>
            )}

            {auth.kind === "error" && (
              <Card>
                <p className="text-base text-muted-foreground">
                  {auth.message}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Card>
            )}

            {auth.kind === "unauthenticated" && (
              <Card>
                <div className="eyebrow">Sign in required</div>
                <p className="mt-4 text-base text-muted-foreground">
                  Check your inbox for the sign-in link we sent at checkout —
                  it's good for 24 hours. If you can't find it, restart a
                  trial and we'll send a fresh one.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button asChild>
                    <Link to="/signup?tier=individual">Start a trial</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/contact">Need help?</Link>
                  </Button>
                </div>
              </Card>
            )}

            {auth.kind === "no_sub" && (
              <Card>
                <div className="eyebrow">No subscription on file</div>
                <p className="mt-4 text-base text-muted-foreground">
                  You're signed in, but we don't see a paid subscription.
                  Start a trial to spin up your first Luciel.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/pricing">View pricing</Link>
                  </Button>
                </div>
              </Card>
            )}

            {auth.kind === "ok" && (() => {
              // Step 30a.5 §11 Q5: tab visibility is tier AND role.
              //   * Team tab    — tier in (team, company) AND role in
              //                   (owner, tenant_admin, department_lead)
              //   * Company tab — tier === company AND role in
              //                   (owner, tenant_admin)
              // Gating on tier alone would leak Company-tier Domain
              // creation to an invited department lead, breaking the
              // chain of authority. active_role is sourced from the
              // cookied user's active ScopeAssignment via
              // /api/v1/billing/me (see app/api/v1/billing.py::me).
              const tier = auth.subscription.tier;
              const role = auth.subscription.active_role;
              const isTeamLikeTier = tier === "team" || tier === "company";
              const teamRoleAllowed =
                role === "owner" ||
                role === "tenant_admin" ||
                role === "department_lead";
              const showTeam = isTeamLikeTier && teamRoleAllowed;
              const companyRoleAllowed =
                role === "owner" || role === "tenant_admin";
              const showCompany = tier === "company" && companyRoleAllowed;
              return (
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="luciels">Luciels</TabsTrigger>
                    {showCompany && (
                      <TabsTrigger value="company">Company</TabsTrigger>
                    )}
                    {showTeam && <TabsTrigger value="team">Team</TabsTrigger>}
                    <TabsTrigger value="account">Account</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-8">
                    <OverviewTab tenantId={auth.subscription.tenant_id} />
                  </TabsContent>
                  <TabsContent value="luciels" className="mt-8">
                    <LucielsTab
                      tenantId={auth.subscription.tenant_id}
                      tier={tier}
                      instanceCountCap={auth.subscription.instance_count_cap}
                    />
                  </TabsContent>
                  {showCompany && (
                    <TabsContent value="company" className="mt-8">
                      <CompanyTab tenantId={auth.subscription.tenant_id} />
                    </TabsContent>
                  )}
                  {showTeam && (
                    <TabsContent value="team" className="mt-8">
                      <TeamTab
                        tenantId={auth.subscription.tenant_id}
                        tier={tier}
                      />
                    </TabsContent>
                  )}
                  <TabsContent value="account" className="mt-8">
                    <AccountTab />
                  </TabsContent>
                </Tabs>
              );
            })()}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Dashboard;
