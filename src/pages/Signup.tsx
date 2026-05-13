import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isEmail, submitWaitlist } from "@/lib/submissions";
import { track } from "@/lib/analytics";
import {
  BillingApiError,
  createCheckoutSession,
  isBillingEnabled,
} from "@/lib/billing";

type Tier = "individual" | "team" | "company" | "unspecified";

/**
 * Signup — Step 30a email-capture step.
 *
 * Individual tier (the only self-serve tier in v1) → POST /api/v1/billing/checkout
 * and forward to Stripe-hosted Checkout.
 *
 * Team / Company / Unspecified → keep the waitlist UX. They are sales-assisted
 * in v1 (drift: D-billing-team-company-not-self-serve-2026-05-13).
 *
 * If VITE_STRIPE_PUBLISHABLE_KEY is unset on this build, every tier falls
 * back to waitlist so the page never dead-ends.
 */
const Signup = () => {
  const [params] = useSearchParams();
  const tierParam = params.get("tier");
  const tier: Tier = (["individual", "team", "company"] as const).includes(
    tierParam as "individual" | "team" | "company",
  )
    ? (tierParam as Tier)
    : "unspecified";

  // Step 30a v1: only Individual is self-serve on Stripe. Other tiers stay
  // on the waitlist path even when billing is configured.
  const checkoutEnabled = isBillingEnabled() && tier === "individual";

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    track({
      name: "signup_started",
      payload: { tier, mode: checkoutEnabled ? "checkout" : "waitlist" },
    });
  }, [tier, checkoutEnabled]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast.error("Enter a valid email.");
      return;
    }
    setSubmitting(true);

    if (checkoutEnabled) {
      const trimmedName = displayName.trim();
      if (!trimmedName) {
        setSubmitting(false);
        toast.error("Add your name so we can put it on your account.");
        return;
      }
      try {
        const { checkout_url } = await createCheckoutSession({
          email: email.trim(),
          display_name: trimmedName,
          tier: "individual",
          source_page: "/signup",
        });
        track({ name: "checkout_session_created", payload: { tier } });
        // Hand off to Stripe-hosted Checkout. Backend has already minted
        // the audit row; we should never return from this call.
        window.location.assign(checkout_url);
        return;
      } catch (err) {
        setSubmitting(false);
        const isApi = err instanceof BillingApiError;
        const message = isApi
          ? err.message
          : "We couldn't reach billing. Try again, or email hello@vantagemind.ai.";
        toast.error(message);
        return;
      }
    }

    // Waitlist fallback (Team / Company / Unspecified, or billing not configured)
    const ok = await submitWaitlist({
      email: email.trim(),
      role: role.trim() || undefined,
      company: company.trim() || undefined,
      tier,
      source_page: "/signup",
    });
    setSubmitting(false);
    if (ok) {
      setDone(true);
      toast.success("You're on the list. We'll be in touch.");
    } else {
      toast.error("Something didn't go through. Try again or email hello@vantagemind.ai.");
    }
  };

  return (
    <SiteLayout>
      <Seo
        title={checkoutEnabled ? "Start your trial — VantageMind AI" : "Sign up — VantageMind AI"}
        description={
          checkoutEnabled
            ? "Start a 14-day free trial of Luciel Individual. Cancel anytime, no commitment."
            : "Self-serve sign-up for Luciel is opening soon. Drop your email and we'll let you know the moment it goes live."
        }
        path="/signup"
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-20 md:pt-40 md:pb-28">
          <Eyebrow>{checkoutEnabled ? "START YOUR TRIAL" : "SIGN UP"}</Eyebrow>
          {tier !== "unspecified" && (
            <div className="mt-5">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                {tier} tier
              </span>
            </div>
          )}
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            {checkoutEnabled ? (
              <>14 days free.<br />Cancel anytime.</>
            ) : (
              <>Sign-up is opening soon.</>
            )}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {checkoutEnabled ? (
              <>
                Drop your email and we'll send you straight to checkout. Your card isn't
                charged until day 15, and your private Luciel deployment is provisioned the
                moment payment confirms.
              </>
            ) : (
              <>
                We're finishing the self-serve checkout for the Individual tier. Drop your
                email and we'll let you know the moment it's live. Team and Company tiers are
                sales-assisted today — book a demo and we'll get you set up.
              </>
            )}
          </p>

          {done ? (
            <div className="mt-10 max-w-md rounded-xl border border-border bg-card p-7">
              <div className="eyebrow text-primary">Confirmed</div>
              <p className="mt-4 text-base text-foreground">You're on the list. We'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 max-w-md space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="su-email">Work email</Label>
                <Input id="su-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {checkoutEnabled && (
                <div className="space-y-1.5">
                  <Label htmlFor="su-name">Your name</Label>
                  <Input
                    id="su-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              )}
              {!checkoutEnabled && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-role">Role <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="su-role" value={role} onChange={(e) => setRole(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-company">Company <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="su-company" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? checkoutEnabled
                      ? "Redirecting…"
                      : "Sending…"
                    : checkoutEnabled
                      ? "Continue to checkout"
                      : "Join the waitlist"}
                </Button>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Book a demo
                </Link>
              </div>
              {checkoutEnabled && (
                <p className="pt-2 text-xs text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <Link to="/legal/terms" className="underline underline-offset-2 hover:text-foreground">Terms</Link>{" "}
                  and{" "}
                  <Link to="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>.
                  Card billed in CAD. Cancel from your account at any time during the trial.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Signup;
