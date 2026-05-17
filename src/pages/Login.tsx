import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/billing";
import { AuthApiError, login as authLogin } from "@/lib/auth";
import { track } from "@/lib/analytics";

/**
 * Login -- two modes:
 *
 *   1. **Password login (default, Step 30a.3).** With no `?token=` in
 *      the URL, render the email + password form. On submit, POST to
 *      `/api/v1/auth/login`; on 200 the backend has set the session
 *      cookie and we navigate to `/app` (falling back to `/dashboard`
 *      until Step 32 lands the `/app` shell). On 401 surface a single
 *      generic "Invalid email or password" message -- the backend
 *      deliberately does not distinguish failure modes.
 *
 *   2. **Legacy magic-link redeem.** With `?token=<jwt>` present, the
 *      page is the GET-redeem target for any magic-link emails still
 *      in the wild (the Option B welcome-email mechanic of Step 30a.3
 *      replaces this surface for new signups, but historical links
 *      keep working for 24h post-mint per the JWT TTL). We GET
 *      `/api/v1/billing/login?token=...` with credentials so the
 *      backend can Set-Cookie, then navigate to `/dashboard`.
 *
 * Both modes funnel into the same destination -- the only difference
 * is which backend route mints the cookie. The cookie payload shape
 * is identical (Step 30a's invariant).
 */

type RedeemState =
  | { kind: "consuming" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const Login = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  if (token) {
    return <LegacyMagicLinkRedeem token={token} navigate={navigate} />;
  }
  return <PasswordLoginForm navigate={navigate} />;
};

// ---------------------------------------------------------------------
// Password login form (Step 30a.3 default)
// ---------------------------------------------------------------------

const PasswordLoginForm = ({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await authLogin(email.trim(), password);
      track({ name: "login_succeeded" });
      // Step 32 evolution: land on /app once the shell ships; until
      // then /dashboard is the cookied-entry target.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof AuthApiError
          ? err.message
          : "Sign-in failed. Please try again.";
      track({ name: "login_failed", payload: { reason: message } });
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <Seo
        title="Sign in — VantageMind AI"
        description="Sign in to your VantageMind AI account."
        path="/login"
        noIndex
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>SIGN IN</Eyebrow>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Welcome back.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Sign in with the email and password you set when your account
            was provisioned.
          </p>

          <form onSubmit={onSubmit} className="mt-10 max-w-md space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
              <Button asChild variant="ghost">
                <Link to="/forgot-password">Forgot password?</Link>
              </Button>
            </div>
          </form>

          <p className="mt-10 text-sm text-muted-foreground">
            New to VantageMind?{" "}
            <Link to="/pricing" className="text-foreground underline-offset-4 hover:underline">
              See pricing
            </Link>{" "}
            to start a trial.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

// ---------------------------------------------------------------------
// Legacy magic-link redeem (Step 30a, pre-30a.3) -- kept alive for any
// magic-link tokens already in the wild. New signups never land here.
// ---------------------------------------------------------------------

const LegacyMagicLinkRedeem = ({
  token,
  navigate,
}: {
  token: string;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const [state, setState] = useState<RedeemState>({ kind: "consuming" });
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/billing/login?token=${encodeURIComponent(token)}`,
          { method: "GET", credentials: "include", headers: { Accept: "application/json" } },
        );
        const data: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const message =
            typeof data === "object" && data && "detail" in data
              ? String((data as { detail: unknown }).detail)
              : `Sign-in failed (${res.status}).`;
          track({ name: "login_failed", payload: { reason: message, path: "magic-link-legacy" } });
          setState({ kind: "error", message });
          return;
        }
        track({ name: "login_succeeded", payload: { path: "magic-link-legacy" } });
        setState({ kind: "ok" });
        setTimeout(() => navigate("/dashboard", { replace: true }), 400);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Sign-in failed. Please try again.";
        track({ name: "login_failed", payload: { reason: message, path: "magic-link-legacy" } });
        setState({ kind: "error", message });
      }
    })();
  }, [token, navigate]);

  return (
    <SiteLayout>
      <Seo title="Signing you in — VantageMind AI" description="Magic-link sign-in." path="/login" noIndex />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>SIGN IN</Eyebrow>

          {state.kind === "consuming" && (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Signing you in…
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                One moment.
              </p>
            </>
          )}

          {state.kind === "ok" && (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Welcome back.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Taking you to your account…
              </p>
            </>
          )}

          {state.kind === "error" && (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Sign-in link expired.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {state.message} Sign-in links are good for 24 hours. Sign in with your
                password instead, or reset it if you have not set one yet.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/forgot-password">Reset password</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Login;
