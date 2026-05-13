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
  LucielInstance,
  TenantDashboard,
  getTenantDashboard,
  listLucielInstances,
} from "@/lib/admin";
import { CreateLucielForm } from "@/components/admin/CreateLucielForm";

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

const LucielsTab = ({ tenantId }: { tenantId: string }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Eyebrow>Your Luciels</Eyebrow>
        <Button onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? "Cancel" : "New Luciel"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CreateLucielForm
            tenantId={tenantId}
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

            {auth.kind === "ok" && (
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="luciels">Luciels</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-8">
                  <OverviewTab tenantId={auth.subscription.tenant_id} />
                </TabsContent>
                <TabsContent value="luciels" className="mt-8">
                  <LucielsTab tenantId={auth.subscription.tenant_id} />
                </TabsContent>
                <TabsContent value="account" className="mt-8">
                  <AccountTab />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Dashboard;
