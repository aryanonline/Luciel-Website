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

export { BillingApiError };
