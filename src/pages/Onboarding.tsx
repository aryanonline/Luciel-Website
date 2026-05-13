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
  | { kind: "sent"; email: string }
  | { kind: "no_session" }
  | { kind: "error"; message: string };

/**
 * Onboarding — Step 30a success_url landing page.
 *
 * Stripe redirects here as `/onboarding?session_id={CHECKOUT_SESSION_ID}`
 * after the user completes checkout. We POST the session id to the
 * backend's `/api/v1/billing/onboarding/claim` endpoint, which:
 *
 *   1. Verifies the Checkout Session is paid + linked to a Subscription.
 *      (The webhook may have already minted the tenant — that's expected
 *      and idempotent; we just need the email so we can resend the
 *      magic link if the user lost the original.)
 *   2. Mints / re-mints a magic-link token and emails it to the customer.
 *   3. Returns `{ email, magic_link_sent: true }`.
 *
 * We then render the "check your email" state. The user clicks the link
 * in their inbox, which sets the session cookie and lands them on
 * /account/billing.
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
        track({ name: "onboarding_claim_succeeded", payload: { tier: "individual" } });
        setState({ kind: "sent", email: res.email });
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
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>WELCOME</Eyebrow>

          {state.kind === "sent" ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                Check your email.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                We sent a sign-in link to <span className="text-foreground">{state.email}</span>.
                Click it to land in your account. The link is good for 24 hours; we'll mint a
                new one if you need it.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Your Luciel deployment is being provisioned in the background and will be
                ready the first time you sign in. Your card isn't charged until your 14-day
                trial ends, and you can cancel from your account at any time.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild variant="ghost"><Link to="/">Back to home</Link></Button>
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
            // hand-off. Keep the previous "coming soon" copy as a graceful
            // fallback rather than throwing.
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
                Your Luciel deployment is being prepared.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                We'll guide you through choosing your deployment shape — company-wide,
                department-by-department, or per-professional. Hold tight; this flow lands with
                our next release.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild variant="ghost"><Link to="/account">Go to account</Link></Button>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Onboarding;
