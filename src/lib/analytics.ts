/**
 * analytics.ts — thin event emitter.
 *
 * Today: no-op (logs in dev). Wire-points exist so Step 30a can flip on
 * a real provider (Plausible / PostHog / GA4) by setting VITE_ANALYTICS_KEY
 * and replacing the `dispatch` body — without touching call sites.
 */

type Tier = "individual" | "team" | "company" | "unspecified";

export type AnalyticsEvent =
  | { name: "pricing_viewed"; payload?: Record<string, never> }
  | { name: "pricing_tier_clicked"; payload: { tier: Tier } }
  | { name: "signup_started"; payload: { tier: Tier; mode?: "checkout" | "waitlist" } }
  | { name: "signup_completed"; payload: { tier?: Tier; session_id?: string } }
  // Step 30a billing flow events
  | { name: "checkout_session_created"; payload: { tier: Tier } }
  | { name: "onboarding_started"; payload: { session_id: string | null; has_session?: boolean } }
  | { name: "onboarding_claim_succeeded"; payload: { tier: Tier } }
  | { name: "onboarding_claim_failed"; payload: { reason: string } }
  | { name: "login_succeeded"; payload?: Record<string, never> }
  | { name: "login_failed"; payload: { reason: string } }
  | { name: "logout_succeeded"; payload?: Record<string, never> }
  | { name: "billing_portal_opened"; payload?: Record<string, never> }
  | { name: "first_conversation"; payload?: Record<string, unknown> }
  | { name: "cta_clicked"; payload: { label: string; source_page: string; tier?: Tier } };

const KEY = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ANALYTICS_KEY;

function dispatch(name: string, payload?: Record<string, unknown>) {
  // TODO(step-30a): when VITE_ANALYTICS_KEY is set, forward to the chosen
  // provider here (e.g. window.plausible?.(name, { props: payload })).
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, payload ?? {}, KEY ? "(provider configured)" : "(no-op)");
  }
}

export function track<E extends AnalyticsEvent>(event: E): void {
  dispatch(event.name, (event as { payload?: Record<string, unknown> }).payload);
}

/** Convenience for the most-used CTA event. */
export function trackCta(label: string, sourcePage: string, tier?: Tier) {
  track({ name: "cta_clicked", payload: { label, source_page: sourcePage, tier } });
}
