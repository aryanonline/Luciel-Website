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
  createPortalSession,
  getBillingStatus,
  logout as billingLogout,
} from "@/lib/billing";
import { track } from "@/lib/analytics";

const Placeholder = ({ label }: { label: string }) => (
  <div className="mt-8 rounded-xl border border-border bg-card p-8">
    <div className="eyebrow">{label}</div>
    <p className="mt-4 text-base text-muted-foreground">Coming with our next release.</p>
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

const BillingTab = () => {
  const [state, setState] = useState<BillingState>({ kind: "loading" });
  const [portalSubmitting, setPortalSubmitting] = useState(false);

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
    </div>
  );
};

const Account = ({ defaultTab = "profile" }: { defaultTab?: "profile" | "billing" }) => (
  <SiteLayout>
    <Seo
      title="Account — VantageMind AI"
      description="Account management for Luciel customers."
      path={defaultTab === "billing" ? "/account/billing" : "/account"}
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
          <TabsContent value="profile"><Placeholder label="Profile" /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
        </Tabs>
      </div>
    </section>
  </SiteLayout>
);

export default Account;
