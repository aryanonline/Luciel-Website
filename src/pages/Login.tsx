import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/billing";
import { track } from "@/lib/analytics";

type State =
  | { kind: "consuming" }
  | { kind: "ok" }
  | { kind: "no_token" }
  | { kind: "error"; message: string };

/**
 * Login — magic-link consumer.
 *
 * Hit as `/login?token=<jwt>`. We GET the backend endpoint with credentials
 * included so it can `Set-Cookie` the long-lived session cookie. On success
 * the backend returns `{ ok: true, email, tenant_id }` and we forward the
 * user to /account/billing. On failure we show a friendly retry path.
 *
 * This route intentionally does no client-side validation of the token —
 * the backend is the only authority. We just shuttle the token over and
 * trust its response.
 */
const Login = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [state, setState] = useState<State>(token ? { kind: "consuming" } : { kind: "no_token" });
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!token) return;
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
          track({ name: "login_failed", payload: { reason: message } });
          setState({ kind: "error", message });
          return;
        }
        track({ name: "login_succeeded" });
        setState({ kind: "ok" });
        // Small delay so the success state flashes briefly before redirect.
        setTimeout(() => navigate("/account/billing", { replace: true }), 400);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Sign-in failed. Please try again.";
        track({ name: "login_failed", payload: { reason: message } });
        setState({ kind: "error", message });
      }
    })();
  }, [token, navigate]);

  return (
    <SiteLayout>
      <Seo title="Signing you in — VantageMind AI" description="Magic-link sign-in." path="/login" />
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

          {state.kind === "no_token" && (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                No sign-in link here.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Open the most recent sign-in email we sent you, and click the link inside. If
                you can't find it, start a trial and we'll mint a new one.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild><Link to="/signup?tier=individual">Start a trial</Link></Button>
                <Button asChild variant="ghost"><Link to="/contact">Contact support</Link></Button>
              </div>
            </>
          )}

          {state.kind === "error" && (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Sign-in link expired.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {state.message} Sign-in links are good for 24 hours. Start the flow again or
                drop us a line if this keeps happening.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild><Link to="/signup?tier=individual">Get a new link</Link></Button>
                <Button asChild variant="ghost"><Link to="/contact">Contact support</Link></Button>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Login;
