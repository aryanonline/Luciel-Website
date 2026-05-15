import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  BillingCadence,
  createCheckoutSession,
  isBillingEnabled,
} from "@/lib/billing";

type Tier = "individual" | "team" | "company" | "unspecified";

/**
 * Signup — email-capture step.
 *
 * Step 30a (v1): only Individual was self-serve on Stripe.
 * Step 30a.1: Individual + Team are both self-serve. Company keeps a
 * "Book a demo" primary CTA on /pricing but qualified leads can be sent
 * here via `?showSkip=1` on /pricing — if a Company tier hits /signup
 * directly we still forward to checkout (the backend's 422 / contact
 * redirect is no longer needed because Company is fully self-serve).
 *
 * Cadence: ?cadence=monthly|annual is forwarded to
 * POST /api/v1/billing/checkout so the backend resolves the right Stripe
 * Price. Missing / invalid cadence falls back to "monthly".
 *
 * If VITE_STRIPE_PUBLISHABLE_KEY is unset on this build, every tier falls
 * back to waitlist so the page never dead-ends.
 */
const Signup = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const tierParam = params.get("tier");
  const tier: Tier = (["individual", "team", "company"] as const).includes(
    tierParam as "individual" | "team" | "company",
  )
    ? (tierParam as Tier)
    : "unspecified";

  // Step 30a.1 — cadence pass-through (defaults to monthly).
  const cadenceParam = params.get("cadence");
  const cadence: BillingCadence =
    cadenceParam === "annual" ? "annual" : "monthly";

  // Step 30a.1: all three tiers are self-serve on Stripe. Unspecified
  // still falls through to waitlist (e.g. someone hits /signup with no
  // ?tier= query param at all).
  const checkoutEnabled =
    isBillingEnabled() &&
    (tier === "individual" || tier === "team" || tier === "company");

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    track({
      name: "signup_started",
      payload: { tier, cadence, mode: checkoutEnabled ? "checkout" : "waitlist" },
    });
  }, [tier, cadence, checkoutEnabled]);

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
          // tier is one of "individual" | "team" | "company" here — checkoutEnabled gates that.
          tier: tier as "individual" | "team" | "company",
          billing_cadence: cadence,
          source_page: "/signup",
        });
        track({ name: "checkout_session_created", payload: { tier, cadence } });
        // Hand off to Stripe-hosted Checkout. Backend has already minted
        // the audit row; we should never return from this call.
        window.location.assign(checkout_url);
        return;
      } catch (err) {
        setSubmitting(false);
        const isApi = err instanceof BillingApiError;
        // Step 30a.1: if the backend rejects a self-serve attempt for
        // any reason that requires a human (e.g. enterprise procurement
        // policy), it returns 422 with detail="contact_sales". Route the
        // customer to /contact so they don't dead-end.
        if (
          isApi &&
          err.status === 422 &&
          typeof err.message === "string" &&
          err.message.toLowerCase().includes("contact")
        ) {
          navigate(`/contact?tier=${tier}&from=signup`);
          return;
        }
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

  // Step 30a.1 — trial copy by tier (matches BillingService.resolve_trial_days)
  const trialDays = tier === "individual" ? 14 : 7;
  const isAnnual = cadence === "annual";
  // Step 30a.2-pilot — pilot offer is monthly-only and first-time-only.
  // Annual buyers and unspecified-tier walk-ins see the standard copy.
  // First-time detection itself is hard-enforced at the backend via
  // ``BillingService.is_first_time_customer(email)`` — we don't probe
  // here because (a) the email isn't entered yet on first render and
  // (b) the backend gate is the only trustworthy source. If a repeat
  // customer somehow lands on a pilot-flavored signup, checkout will
  // route them to the standard subscription path server-side.
  const pilotEligibleSurface = checkoutEnabled && !isAnnual && tier !== "unspecified";
  const seoTitle = checkoutEnabled
    ? isAnnual
      ? "Start your annual plan — VantageMind AI"
      : pilotEligibleSurface
        ? "Start your 90-day pilot — VantageMind AI"
        : "Start your trial — VantageMind AI"
    : "Sign up — VantageMind AI";
  const seoDesc = checkoutEnabled
    ? isAnnual
      ? `Start an annual plan for Luciel ${tier}. Cancel anytime, no commitment.`
      : pilotEligibleSurface
        ? `Start a 90-day pilot of Luciel ${tier} for $100 CAD. Full refund any time in the pilot window. First-time customers only.`
        : `Start a ${trialDays}-day free trial of Luciel ${tier}. Cancel anytime, no commitment.`
    : "Self-serve sign-up for Luciel is opening soon. Drop your email and we'll let you know the moment it goes live.";

  return (
    <SiteLayout>
      <Seo title={seoTitle} description={seoDesc} path="/signup" />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-20 md:pt-40 md:pb-28">
          <Eyebrow>
            {checkoutEnabled
              ? isAnnual
                ? "START YOUR PLAN"
                : pilotEligibleSurface
                  ? "START YOUR 90-DAY PILOT"
                  : "START YOUR TRIAL"
              : "SIGN UP"}
          </Eyebrow>
          {tier !== "unspecified" && (
            <div className="mt-5">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                {tier} tier
              </span>
            </div>
          )}
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            {checkoutEnabled ? (
              isAnnual ? (
                <>Annual plan.<br />One bill a year.</>
              ) : pilotEligibleSurface ? (
                <>90 days for $100.<br />Refund anytime.</>
              ) : (
                <>{trialDays} days free.<br />Cancel anytime.</>
              )
            ) : (
              <>Sign-up is opening soon.</>
            )}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {checkoutEnabled ? (
              isAnnual ? (
                <>
                  Drop your email and we'll send you straight to checkout. Annual plans are
                  billed up front at ten times the monthly rate — effectively two months free —
                  with no trial. Your private Luciel deployment is provisioned the moment
                  payment confirms.
                </>
              ) : pilotEligibleSurface ? (
                <>
                  Drop your email and we'll send you straight to checkout for the $100 CAD
                  pilot. You get 90 days at the {tier} tier; on day 91 your subscription
                  converts to the regular monthly rate. Change your mind anytime in the 90-day
                  window and refund the full $100 yourself with one click from your account
                  page. Refunds also close the account in the same step. First-time customers
                  only — if you've subscribed before, you'll be routed to the standard plan.
                </>
              ) : (
                <>
                  Drop your email and we'll send you straight to checkout. Your card isn't
                  charged until day {trialDays + 1}, and your private Luciel deployment is
                  provisioned the moment payment confirms.
                </>
              )
            ) : (
              <>
                Drop your email and we'll let you know the moment self-serve sign-up is live
                for your tier. If you want to talk to us in the meantime, book a demo.
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
                      ? pilotEligibleSurface
                        ? "Continue to pilot checkout"
                        : "Continue to checkout"
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
