/**
 * billing.ts — client gateway for Step 30a Stripe-backed billing.
 *
 * All network paths point at the Luciel backend (default
 * `https://api.vantagemind.ai`) via `VITE_API_BASE_URL`. Stripe is never
 * called directly from the browser — every checkout / portal / status
 * call goes through our backend so the audit chain stays unbroken
 * (Invariant 4: audit-before-commit applies to the server, not the SPA).
 *
 * When `VITE_STRIPE_PUBLISHABLE_KEY` is not present at build time, callers
 * should treat the checkout flow as "not configured" and fall back to the
 * waitlist UX. We don't actually use the publishable key on the client —
 * checkout is server-driven — but its presence is the single flag we use
 * to mean "billing is live on this build."
 */

type Tier = "individual" | "team" | "company" | "unspecified";

/** Step 30a.1 — billing cadence (monthly vs annual). */
export type BillingCadence = "monthly" | "annual";

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const API_BASE_URL: string =
  env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "https://api.vantagemind.ai";

/**
 * D-widget-snippet-url-points-to-api-not-cdn-2026-05-14:
 *   The customer-facing embed snippet shown on LucielInstanceDetail copies
 *   a `<script src="...">` tag pointing at the widget bundle. Pre-fix it
 *   resolved to `${API_BASE_URL}/widget.js`, which hits the FastAPI ALB
 *   instead of the CloudFront-fronted S3 bucket where the widget bundle
 *   actually lives. Two reasons that's wrong: (1) the backend has no
 *   `/widget.js` route so embeds 404 in production, (2) even if the route
 *   existed, serving a static JS bundle from a cold ALB is the wrong
 *   delivery shape (no edge caching, no immutable versioning, every
 *   embed-page load adds ALB load).
 *
 *   The widget bundle is hosted at `https://d1t84i96t71fsi.cloudfront.net`
 *   (Amplify-managed CloudFront distribution fronting the S3 origin
 *   prepared in Step 27a). At build time the env var `VITE_WIDGET_CDN_URL`
 *   can override this default for staging / preview deploys. The default
 *   bakes the prod CloudFront hostname so a missing env-var produces a
 *   working embed snippet, not a broken one (same fail-safe shape as
 *   `API_BASE_URL`).
 */
export const WIDGET_CDN_URL: string =
  env.VITE_WIDGET_CDN_URL?.replace(/\/+$/, "") || "https://d1t84i96t71fsi.cloudfront.net";

export const STRIPE_PUBLISHABLE_KEY: string | undefined = env.VITE_STRIPE_PUBLISHABLE_KEY;

/** Single source of truth for "is billing wired up on this build?" */
export const isBillingEnabled = (): boolean => !!STRIPE_PUBLISHABLE_KEY;

export interface CheckoutRequest {
  email: string;
  display_name: string;
  tier: Tier;
  /**
   * Step 30a.1 — billing cadence. Defaults to "monthly" on the server when
   * omitted; passed explicitly from /pricing so the cadence toggle drives
   * which Stripe Price the backend resolves to.
   */
  billing_cadence?: BillingCadence;
  source_page?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

/**
 * Subscription state returned by `GET /api/v1/billing/me`.
 * Mirrors `SubscriptionStatusResponse` in app/schemas/billing.py.
 *
 * The endpoint returns 404 when the cookied user has no subscription;
 * BillingApiError surfaces that to callers so the UI can branch.
 */
export interface SubscriptionStatus {
  tenant_id: string;
  tier: Tier;
  /** Step 30a.1 — billing cadence ("monthly" | "annual"). */
  billing_cadence: BillingCadence;
  /**
   * Step 30a.1 — max number of active Luciels for this subscription's tier.
   * Used by the Dashboard to gate the Create Luciel CTA.
   */
  instance_count_cap: number;
  status: string; // "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired"
  active: boolean;
  is_entitled: boolean;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  customer_email: string;
  /**
   * Step 30a.2-pilot — true iff this subscription was minted under the
   * $100 CAD 90-day pilot offer. Distinct from `status === "trialing"`
   * because pilots and ordinary trials share the trialing status; the
   * pilot signal is derived server-side from
   * `provider_snapshot.metadata.luciel_intro_applied`.
   *
   * The Account UI uses this flag to decide whether to render the
   * self-serve "Refund my pilot" button. Never POST /pilot-refund
   * speculatively just to discover eligibility — read this field.
   */
  is_pilot: boolean;
  /**
   * Step 30a.2-pilot — UTC instant the 90-day refund window closes.
   * Equal to `trial_end` whenever `is_pilot === true`; null otherwise.
   * The button must hide when `now > pilot_window_end`, but the backend
   * still enforces the cutoff (returns 409 PilotWindowExpiredError).
   */
  pilot_window_end: string | null;
}

/**
 * Step 30a.2-pilot — response from POST /api/v1/billing/pilot-refund.
 * Mirrors `PilotRefundResponse` in app/schemas/billing.py.
 */
export interface PilotRefundResponse {
  refund_id: string | null;
  charge_id: string;
  refunded_amount_cents: number;
  currency: string;
  tenant_id: string;
  deactivated_at: string;
}

export interface PortalResponse {
  portal_url: string;
}

/** Mirrors `OnboardingClaimResponse` in app/schemas/billing.py. */
export interface OnboardingClaimResponse {
  state: "pending" | "ready" | "unknown";
  email_sent_to: string | null;
}

class BillingApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "BillingApiError";
    this.status = status;
    this.body = body;
  }
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${res.status})`;
    throw new BillingApiError(res.status, message, data);
  }
  return data as T;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${res.status})`;
    throw new BillingApiError(res.status, message, data);
  }
  return data as T;
}

export async function createCheckoutSession(req: CheckoutRequest): Promise<CheckoutResponse> {
  const body: Record<string, unknown> = {
    email: req.email,
    display_name: req.display_name,
    tier: req.tier,
  };
  // Step 30a.1 — only forward billing_cadence when the caller passed it,
  // so the server's monthly default keeps working for any older caller.
  if (req.billing_cadence) {
    body.billing_cadence = req.billing_cadence;
  }
  return postJson<CheckoutResponse>("/api/v1/billing/checkout", body);
}

export async function claimCheckoutSession(sessionId: string): Promise<OnboardingClaimResponse> {
  return postJson<OnboardingClaimResponse>("/api/v1/billing/onboarding/claim", {
    session_id: sessionId,
  });
}

export async function getBillingStatus(): Promise<SubscriptionStatus> {
  return getJson<SubscriptionStatus>("/api/v1/billing/me");
}

export async function createPortalSession(): Promise<PortalResponse> {
  return postJson<PortalResponse>("/api/v1/billing/portal", {});
}

export async function logout(): Promise<{ ok: true }> {
  return postJson<{ ok: true }>("/api/v1/billing/logout", {});
}

/**
 * Step 30a.2-pilot — request a self-serve pilot refund.
 *
 * Contract (per app/services/billing_service.py::process_pilot_refund):
 *   200 PilotRefundResponse      — refund posted, subscription canceled,
 *                                   tenant cascade-deactivated.
 *   401                          — no session cookie / invalid cookie.
 *   403 not_first_time_customer  — repeat customer caught at the backend gate.
 *   404                          — no active sub, or no intro Charge found.
 *   409 intro_window_expired     — past the 90-day refund cliff.
 *   501                          — Stripe / SSM intro Price not configured.
 *
 * The UI should never have to handle 403/409 in production because the
 * button is only rendered when `is_pilot && now <= pilot_window_end`,
 * but we still surface BillingApiError so a stale tab can degrade
 * gracefully.
 */
export async function requestPilotRefund(): Promise<PilotRefundResponse> {
  return postJson<PilotRefundResponse>("/api/v1/billing/pilot-refund", {});
}

export { BillingApiError };
