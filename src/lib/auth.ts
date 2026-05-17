/**
 * Step 30a.3 -- password-auth client.
 *
 * Mirrors `src/lib/billing.ts`: thin fetch wrappers over the three new
 * backend routes at `/api/v1/auth/*`. Every call uses
 * `credentials: "include"` so the browser carries / receives the
 * `luciel_session` cookie the routes set on the api.vantagemind.ai
 * domain.
 *
 * Backend contract -- see app/api/v1/auth.py:
 *   * POST /api/v1/auth/login           body {email, password}
 *                                       200 {ok, redirect, email, tenant_id}
 *                                       401 generic on any failure
 *   * POST /api/v1/auth/set-password    body {token, password}
 *                                       200 {ok, redirect}
 *                                       422 {detail: {message, code: "password_too_short"}}
 *                                       401 generic on token failure
 *   * POST /api/v1/auth/forgot-password body {email}
 *                                       200 {ok, message} -- ALWAYS, no enumeration
 *
 * Mandatory-at-signup mechanic (Option B): the post-Stripe-Checkout
 * page is /onboarding (existing route, re-purposed), which renders a
 * passive "check your email" message. The buyer receives a welcome
 * email pointing at /auth/set-password?token=<jwt>; that page POSTs to
 * set-password here, the route mints the session cookie, and the
 * buyer lands on /dashboard.
 */
import { API_BASE_URL } from "@/lib/billing";

export interface LoginResponse {
  ok: true;
  redirect: string;
  email: string;
  tenant_id: string;
}

export interface SetPasswordResponse {
  ok: true;
  redirect: string;
}

export interface ForgotPasswordResponse {
  ok: true;
  message: string;
}

/**
 * Machine-readable error code surfaced from the backend's 422 on
 * `/auth/set-password`. The frontend uses this to render an inline
 * form-validation message rather than a generic toast.
 */
export type AuthErrorCode = "password_too_short" | "invalid_credentials" | "invalid_token" | "unknown";

export class AuthApiError extends Error {
  status: number;
  code: AuthErrorCode;
  body: unknown;
  constructor(status: number, message: string, code: AuthErrorCode, body: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

/**
 * Map a non-200 response onto a typed AuthApiError. The backend
 * returns three shapes:
 *   * 401 {detail: "Invalid email or password."}   -> invalid_credentials
 *   * 401 {detail: "Invalid or expired link."}     -> invalid_token
 *   * 422 {detail: {message, code: "password_too_short"}} -> password_too_short
 * Anything else collapses to `unknown` so the page can still render
 * a generic fallback.
 */
function classifyAuthError(status: number, data: unknown, fallbackOnRoute: AuthErrorCode): AuthApiError {
  const detail =
    typeof data === "object" && data !== null && "detail" in data
      ? (data as { detail: unknown }).detail
      : undefined;

  // 422 with a structured detail block carries the machine-readable
  // code directly. We prefer that path because it lets the form
  // validate inline.
  if (
    status === 422 &&
    typeof detail === "object" &&
    detail !== null &&
    "code" in detail
  ) {
    const code = String((detail as { code: unknown }).code) as AuthErrorCode;
    const message =
      "message" in detail
        ? String((detail as { message: unknown }).message)
        : "Validation failed.";
    return new AuthApiError(status, message, code, data);
  }

  // 401 path -- the backend body is a plain string in `detail`. We
  // map to invalid_token by default since both set-password and
  // forgot-password's only 401 mode is a token failure; login's
  // 401 is the only place invalid_credentials is right, so the
  // caller passes `fallbackOnRoute` to override.
  const message = typeof detail === "string" ? detail : `Request failed (${status}).`;
  if (status === 401) {
    return new AuthApiError(status, message, fallbackOnRoute, data);
  }
  return new AuthApiError(status, message, "unknown", data);
}

async function postJson<T>(
  path: string,
  body: Record<string, unknown>,
  fallbackErrorCode: AuthErrorCode,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw classifyAuthError(res.status, data, fallbackErrorCode);
  }
  return data as T;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return postJson<LoginResponse>(
    "/api/v1/auth/login",
    { email, password },
    "invalid_credentials",
  );
}

export async function setPassword(token: string, password: string): Promise<SetPasswordResponse> {
  return postJson<SetPasswordResponse>(
    "/api/v1/auth/set-password",
    { token, password },
    "invalid_token",
  );
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  // The backend ALWAYS returns 200 for forgot-password so a probing
  // client cannot enumerate emails -- but we still catch network
  // failures with the same error shape.
  return postJson<ForgotPasswordResponse>(
    "/api/v1/auth/forgot-password",
    { email },
    "unknown",
  );
}

export const PASSWORD_MIN_LENGTH = 8;
