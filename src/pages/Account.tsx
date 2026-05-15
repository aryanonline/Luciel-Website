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
  PilotRefundResponse,
  SubscriptionStatus,
  createPortalSession,
  getBillingStatus,
  logout as billingLogout,
  requestPilotRefund,
} from "@/lib/billing";
import { track } from "@/lib/analytics";

/**
 * ProfilePanel — minimal honest profile surface (F3-3).
 *
 * Step 30a.2 keeps the Account screen anchored on billing because that is the
 * only Step-30 ownable surface for the customer. Profile editing (name,
 * notification preferences, password rotation) ships in a later step. Until
 * then we show the customer what they actually need today — the email Stripe
 * has on file is the source of truth for sign-in — and point them at Billing
 * to manage everything else.
 */
const ProfilePanel = () => (
  <div className="mt-8 rounded-xl border border-border bg-card p-8">
    <div className="eyebrow">Profile</div>
    <p className="mt-4 text-base text-muted-foreground">
      The email on your Stripe customer record is the source of truth for sign-in. To change
      it, open the billing portal and update the email on your customer profile — the change
      flows through to your next sign-in link automatically.
    </p>
    <p className="mt-4 text-sm text-muted-foreground">
      Editable profile fields (display name, notification preferences, password rotation)
      ship in a later release. Until then, manage everything from the Billing tab.
    </p>
  </div>
);

const fmtDate = (iso?: string | null): string | null => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
};

const STATUS_COPY: Record<string, { label: string; tone: "ok" | "warn" | "muted" }> = {
  trialing: { label: "Trial", tone: "ok" },
  active: { label: "Active", tone: "ok" },
  past_due: { label: "Past due", tone: "warn" },
  canceled: { label: "Canceled", tone: "muted" },
  unpaid: { label: "Unpaid", tone: "warn" },
  incomplete: { label: "Incomplete", tone: "warn" },
  incomplete_expired: { label: "Incomplete", tone: "muted" },
};

const StatusPill = ({ status }: { status?: string }) => {
  if (!status) return null;
  const c = STATUS_COPY[status] ?? { label: status, tone: "muted" as const };
  const cls =
    c.tone === "ok"
      ? "border-primary/30 bg-primary/5 text-primary"
      : c.tone === "warn"
        ? "border-destructive/30 bg-destructive/5 text-destructive"
        : "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${cls}`}>
      {c.label}
    </span>
  );
};

/**
 * BillingTab — Step 30a real billing surface.
 *
 * Fetches `/api/v1/billing/me` to determine whether the user has a signed
 * session cookie and an active subscription. The backend's contract:
 *
 *   * 200 + SubscriptionStatus — cookied user with a Subscription row.
 *   * 401                      — no cookie / invalid cookie / inactive user.
 *   * 404                      — cookied user but no Subscription on file.
 *   * 501                      — Stripe not configured on this backend.
 *
 * We map those four cases to UI states: ok / unauthenticated / no_sub /
 * error. "Manage billing" POSTs /portal; "Sign out" POSTs /logout.
 */
type BillingState =
  | { kind: "loading" }
  | { kind: "ok"; status: SubscriptionStatus }
  | { kind: "unauthenticated" }
  | { kind: "no_sub" }
  | { kind: "error"; message: string };

/**
 * Step 30a.2-pilot — derive "can the user self-refund right now?" from
 * the SubscriptionStatus shape. The button must only render when:
 *   1. is_pilot === true (server-verified pilot subscription, derived
 *      from provider_snapshot.metadata.luciel_intro_applied), AND
 *   2. pilot_window_end is set, AND
 *   3. now <= pilot_window_end (so the day-91 cliff hides the button).
 *
 * The backend re-enforces all three conditions, so a stale tab that
 * clicks the button after the window expires still gets a clean 409,
 * which the click handler surfaces as a toast.
 */
export const isRefundEligible = (status: SubscriptionStatus): boolean => {
  if (!status.is_pilot) return false;
  if (!status.pilot_window_end) return false;
  const cutoff = new Date(status.pilot_window_end).getTime();
  if (Number.isNaN(cutoff)) return false;
  return Date.now() <= cutoff;
};

/**
 * PilotRefundPanel — the self-serve refund surface.
 *
 * Renders only when `isRefundEligible(status)` returns true. The click
 * path is: confirm → POST /api/v1/billing/pilot-refund → on success
 * surface a confirmation card and trigger a parent refresh so the rest
 * of the Billing tab re-renders as "canceled / no_sub". On error, surface
 * the BillingApiError message via toast and let the user retry.
 *
 * The confirm uses window.confirm because:
 *   1. It's the lowest-friction single-step UX (the locked judgement),
 *      and we already trust the same primitive elsewhere in the app.
 *   2. The action is reversible from the Stripe dashboard for 24h if
 *      the customer claims accident.
 *   3. The audit row + (eventually) SES receipt creates a paper trail.
 *
 * If we later want a two-step “type REFUND to confirm” modal, the seam
 * is just this one component — nothing upstream depends on the dialog.
 */
const PilotRefundPanel = ({
  status,
  onRefunded,
}: {
  status: SubscriptionStatus;
  onRefunded: (resp: PilotRefundResponse) => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const cutoff = status.pilot_window_end ? new Date(status.pilot_window_end) : null;
  const cutoffLabel = cutoff ? fmtDate(cutoff.toISOString()) : null;

  const onRefund = async () => {
    const confirmed = window.confirm(
      `Refund your $100 CAD pilot fee and close your account?\n\n` +
      `This will refund the full $100 to your original card via Stripe, ` +
      `cancel your subscription, and deactivate your account in the same step. ` +
      `This cannot be undone from the website.`,
    );
    if (!confirmed) return;

    setSubmitting(true);
    track({ name: "pilot_refund_requested" });
    try {
      const resp = await requestPilotRefund();
      track({
        name: "pilot_refund_succeeded",
        payload: { refund_id: resp.refund_id ?? "unknown", amount: resp.refunded_amount_cents },
      });
      toast.success("Refunded $100 CAD. Your account has been closed.");
      onRefunded(resp);
    } catch (err) {
      setSubmitting(false);
      track({
        name: "pilot_refund_failed",
        payload: {
          status: err instanceof BillingApiError ? err.status : 0,
        },
      });
      // Map the backend error codes to human-friendly toast copy.
      // The cases here mirror billing.ts's contract block; if a new
      // code appears we still degrade cleanly to the raw message.
      if (err instanceof BillingApiError) {
        if (err.status === 403) {
          toast.error("This pilot offer is for first-time customers only.");
        } else if (err.status === 409) {
          toast.error("The 90-day pilot window has already closed.");
        } else if (err.status === 404) {
          toast.error("We couldn't find the pilot charge to refund. Contact support.");
        } else if (err.status === 501) {
          toast.error("Pilot refunds aren't configured yet. Email us at hello@vantagemind.ai.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Couldn't process the refund. Try again in a moment.");
      }
    }
  };

  return (
    <div
      data-testid="pilot-refund-panel"
      className="rounded-xl border border-primary/30 bg-primary/5 p-8"
    >
      <div className="flex flex-wrap items-baseline gap-3">
        <div className="eyebrow text-primary">Pilot refund</div>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Available until {cutoffLabel ?? "the pilot window closes"}
        </span>
      </div>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        You're in the 90-day pilot window. You can refund the full $100 CAD to your original
        card at any time before {cutoffLabel ?? "the window closes"}. Issuing a refund
        cancels your subscription and closes the account in the same step.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          data-testid="pilot-refund-button"
          variant="destructive"
          onClick={onRefund}
          disabled={submitting}
        >
          {submitting ? "Refunding…" : "Refund my pilot ($100 CAD)"}
        </Button>
      </div>
    </div>
  );
};

const BillingTab = () => {
  const [state, setState] = useState<BillingState>({ kind: "loading" });
  const [portalSubmitting, setPortalSubmitting] = useState(false);
  const [refunded, setRefunded] = useState<PilotRefundResponse | null>(null);

  const refresh = () => {
    setState({ kind: "loading" });
    getBillingStatus()
      .then((status) => setState({ kind: "ok", status }))
      .catch((err: unknown) => {
        if (err instanceof BillingApiError) {
          if (err.status === 401) {
            setState({ kind: "unauthenticated" });
            return;
          }
          if (err.status === 404) {
            setState({ kind: "no_sub" });
            return;
          }
          setState({ kind: "error", message: err.message });
          return;
        }
        setState({ kind: "error", message: "Couldn't load billing status. Try refreshing." });
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const onManageBilling = async () => {
    setPortalSubmitting(true);
    try {
      const { portal_url } = await createPortalSession();
      track({ name: "billing_portal_opened" });
      window.location.assign(portal_url);
    } catch (err) {
      setPortalSubmitting(false);
      const message =
        err instanceof BillingApiError
          ? err.message
          : "Couldn't open billing portal. Try again in a moment.";
      toast.error(message);
    }
  };

  const onSignOut = async () => {
    try {
      await billingLogout();
      track({ name: "logout_succeeded" });
      refresh();
    } catch {
      toast.error("Sign-out didn't go through. Try again.");
    }
  };

  // Step 30a.2-pilot — after a successful refund the backend has
  // already cascade-deactivated the tenant and canceled the
  // subscription. We surface the confirmation card and stop
  // re-fetching the status (re-fetching would now return 404 /
  // unauthenticated and feel like a regression to the user).
  const onRefunded = (resp: PilotRefundResponse) => {
    setRefunded(resp);
  };

  // Step 30a.2-pilot — refund-complete surface takes precedence over
  // everything else; once the cascade has run the rest of the tab is
  // stale by definition.
  if (refunded) {
    return (
      <div className="mt-8 space-y-6" data-testid="pilot-refund-complete">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-8">
          <div className="eyebrow text-primary">Refund complete</div>
          <h3 className="font-display mt-3 text-2xl tracking-tight text-foreground">
            $100 CAD refunded.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Your refund has been issued to the original card and should appear within 5–7
            business days. Your subscription has been canceled and your account has been
            closed in the same step.
          </p>
          {refunded.refund_id && (
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Stripe refund id: {refunded.refund_id}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/contact">Anything we can do better?</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (state.kind === "loading") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <div className="eyebrow">Billing</div>
        <p className="mt-4 text-base text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <div className="eyebrow">Billing</div>
        <p className="mt-4 text-base text-muted-foreground">{state.message}</p>
        <Button className="mt-6" onClick={refresh}>Retry</Button>
      </div>
    );
  }

  if (state.kind === "unauthenticated") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <div className="eyebrow">Sign in required</div>
        <p className="mt-4 text-base text-muted-foreground">
          We can't see a sign-in session for this browser. If you've already subscribed, check
          your email for the sign-in link we sent at checkout — it's good for 24 hours.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link to="/signup?tier=individual">Start a trial</Link></Button>
          <Button asChild variant="ghost"><Link to="/contact">Need help?</Link></Button>
        </div>
      </div>
    );
  }

  if (state.kind === "no_sub") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <div className="eyebrow">No subscription on file</div>
        <p className="mt-4 text-base text-muted-foreground">
          You're signed in, but we don't see a paid subscription for this account. Start a
          trial to spin up your Individual Luciel deployment.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link to="/pricing">View pricing</Link></Button>
          <Button variant="ghost" onClick={onSignOut}>Sign out</Button>
        </div>
      </div>
    );
  }

  const s = state.status;
  const renewal = fmtDate(s.current_period_end);
  const isCanceled = s.status === "canceled" || s.status === "incomplete_expired";
  // Step 30a.2-pilot — the refund panel must NOT render when the
  // subscription is already canceled (the cascade has run) or when
  // the window has closed; isRefundEligible folds both gates in.
  const showRefundPanel = !isCanceled && isRefundEligible(s);

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="eyebrow">Subscription</div>
          <StatusPill status={s.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account</dt>
            <dd className="mt-1 text-base text-foreground">{s.customer_email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tier</dt>
            <dd className="mt-1 text-base capitalize text-foreground">{s.tier}</dd>
          </div>
          {renewal && (
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {s.cancel_at_period_end
                  ? "Access ends"
                  : s.status === "trialing"
                    ? "Trial ends"
                    : "Next renewal"}
              </dt>
              <dd className="mt-1 text-base text-foreground">{renewal}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tenant</dt>
            <dd className="mt-1 font-mono text-sm text-muted-foreground">{s.tenant_id}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {isCanceled ? (
            <Button asChild>
              <Link to="/pricing">Reactivate</Link>
            </Button>
          ) : (
            <Button onClick={onManageBilling} disabled={portalSubmitting}>
              {portalSubmitting ? "Opening…" : "Manage billing"}
            </Button>
          )}
          <Button variant="ghost" onClick={onSignOut}>Sign out</Button>
        </div>

        {s.cancel_at_period_end && !isCanceled && (
          <p className="mt-6 text-sm text-muted-foreground">
            Your subscription is set to cancel at the end of the current period. You'll keep
            access until {renewal ?? "the period ends"}. Reopen the billing portal to undo.
          </p>
        )}
      </div>

      {showRefundPanel && (
        <PilotRefundPanel status={s} onRefunded={onRefunded} />
      )}
    </div>
  );
};

// Step 30a.2 (F3-3): default landing tab is now "billing". The bare /account
// route still passes defaultTab="profile" via App.tsx for backwards compat;
// /account/billing remains the canonical post-login surface for Sarah.
const Account = ({ defaultTab = "billing" }: { defaultTab?: "profile" | "billing" }) => (
  <SiteLayout>
    <Seo
      title="Account — VantageMind AI"
      description="Account management for Luciel customers."
      path={defaultTab === "billing" ? "/account/billing" : "/account"}
      noIndex
    />
    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
        <Eyebrow>ACCOUNT</Eyebrow>
        <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Account management.
        </h1>

        <Tabs defaultValue={defaultTab} className="mt-12 max-w-2xl">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="profile"><ProfilePanel /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
        </Tabs>
      </div>
    </section>
  </SiteLayout>
);

export default Account;
