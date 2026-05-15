import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { BillingApiError, claimCheckoutSession } from "@/lib/billing";

type ClaimState =
  | { kind: "idle" }
  | { kind: "claiming" }
  | { kind: "ready"; email: string | null }
  | { kind: "pending"; email: string | null }
  | { kind: "unknown" }
  | { kind: "no_session" }
  | { kind: "error"; message: string };

/**
 * Onboarding — Step 30a success_url landing page.
 *
 * Stripe redirects here as `/onboarding?session_id={CHECKOUT_SESSION_ID}`
 * after the user completes checkout. We POST the session id to the
 * backend's `/api/v1/billing/onboarding/claim` endpoint, which returns
 * one of three states:
 *
 *   * "ready"   — webhook has minted the Subscription; magic link sent now.
 *   * "pending" — webhook hasn't arrived yet; backend will email when it does.
 *   * "unknown" — Stripe doesn't recognize the session_id.
 *
 * The user clicks the link in their email, which sets the session cookie
 * via `/login` and lands them on `/account/billing`.
 */
const Onboarding = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<ClaimState>({ kind: "idle" });
  const claimedRef = useRef(false);

  useEffect(() => {
    track({
      name: "onboarding_started",
      payload: { session_id: sessionId, has_session: !!sessionId },
    });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      setState({ kind: "no_session" });
      return;
    }
    // StrictMode double-invoke guard — we only want to call claim once
    // even if React mounts the component twice in dev.
    if (claimedRef.current) return;
    claimedRef.current = true;

    setState({ kind: "claiming" });
    claimCheckoutSession(sessionId)
      .then((res) => {
        // We don't know the resolved tier at this layer yet (the claim
        // response only carries `state` and `email_sent_to`); emit the
        // outcome state instead of hard-coding "individual" (F5-2).
        track({ name: "onboarding_claim_succeeded", payload: { state: res.state } });
        if (res.state === "ready") {
          setState({ kind: "ready", email: res.email_sent_to });
        } else if (res.state === "pending") {
          setState({ kind: "pending", email: res.email_sent_to });
        } else {
          setState({ kind: "unknown" });
        }
      })
      .catch((err: unknown) => {
        const message =
          err instanceof BillingApiError
            ? err.message
            : "We couldn't confirm your checkout. Email hello@vantagemind.ai with this page's URL and we'll sort it out.";
        track({ name: "onboarding_claim_failed", payload: { reason: message } });
        setState({ kind: "error", message });
      });
  }, [sessionId]);

  return (
    <SiteLayout>
      <Seo
        title="Welcome — VantageMind AI"
        description="Your Luciel deployment is being prepared. Check your email for the sign-in link."
        path="/onboarding"
        noIndex
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>WELCOME</Eyebrow>

          {state.kind === "ready" || state.kind === "pending" ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                Check your email.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {state.email ? (
                  <>
                    We sent a sign-in link to{" "}
                    <span className="text-foreground">{state.email}</span>.
                  </>
                ) : (
                  <>
                    We sent a sign-in link to the email on your checkout.
                  </>
                )}{" "}
                {state.kind === "pending"
                  ? "Stripe is still confirming payment with us — the link will arrive within a minute."
                  : "Click it to land in your account. The link is good for 24 hours; we'll mint a new one if you need it."}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Your Luciel deployment is being provisioned in the background and will be
                ready the first time you sign in. Your card isn't charged until your trial
                ends, and you can cancel from your account at any time.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild variant="ghost"><Link to="/">Back to home</Link></Button>
              </div>
            </>
          ) : state.kind === "unknown" ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                We couldn't match your checkout.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Stripe doesn't recognize this session id. If you just paid, give us a couple
                minutes and reload; otherwise reach out and we'll sort it out.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild><Link to="/contact">Contact support</Link></Button>
              </div>
            </>
          ) : state.kind === "claiming" ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                Confirming your subscription…
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                One moment — we're finalizing your account.
              </p>
            </>
          ) : state.kind === "error" ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                We hit a snag.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {state.message}
              </p>
              {sessionId && (
                <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
                  <span className="eyebrow">Session</span>
                  <code className="font-mono text-xs text-muted-foreground">{sessionId}</code>
                </div>
              )}
              <div className="mt-10 flex gap-3">
                <Button asChild><Link to="/contact">Contact support</Link></Button>
              </div>
            </>
          ) : (
            // no_session: someone hit /onboarding directly without a Checkout
            // hand-off. Send them to /pricing rather than showing a vague
            // "coming soon" message (F1-5).
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                Looks like you landed here without a checkout.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                The Onboarding page is the landing pad after a successful Stripe checkout.
                If you're new, start with the pricing page and pick the tier that fits your
                deployment shape. If you've already paid, open the most recent sign-in email
                we sent you.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild><Link to="/pricing">See pricing</Link></Button>
                <Button asChild variant="ghost"><Link to="/account/billing">Go to billing</Link></Button>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Onboarding;
