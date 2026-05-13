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

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const API_BASE_URL: string =
  env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "https://api.vantagemind.ai";

export const STRIPE_PUBLISHABLE_KEY: string | undefined = env.VITE_STRIPE_PUBLISHABLE_KEY;

/** Single source of truth for "is billing wired up on this build?" */
export const isBillingEnabled = (): boolean => !!STRIPE_PUBLISHABLE_KEY;

export interface CheckoutRequest {
  email: string;
  tier: Tier;
  source_page?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface BillingStatus {
  authenticated: boolean;
  email?: string;
  tenant_id?: string;
  tier?: Tier;
  status?: string; // "trialing" | "active" | "past_due" | "canceled" | …
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
}

export interface PortalResponse {
  portal_url: string;
}

export interface OnboardingClaimResponse {
  email: string;
  magic_link_sent: boolean;
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
  return postJson<CheckoutResponse>("/api/v1/billing/checkout", {
    email: req.email,
    tier: req.tier,
    source_page: req.source_page,
  });
}

export async function claimCheckoutSession(sessionId: string): Promise<OnboardingClaimResponse> {
  return postJson<OnboardingClaimResponse>("/api/v1/billing/onboarding/claim", {
    session_id: sessionId,
  });
}

export async function getBillingStatus(): Promise<BillingStatus> {
  return getJson<BillingStatus>("/api/v1/billing/me");
}

export async function createPortalSession(): Promise<PortalResponse> {
  return postJson<PortalResponse>("/api/v1/billing/portal", {});
}

export async function logout(): Promise<{ ok: true }> {
  return postJson<{ ok: true }>("/api/v1/billing/logout", {});
}

export { BillingApiError };
