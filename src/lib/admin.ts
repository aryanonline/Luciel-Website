/**
 * admin.ts — client gateway for the Step 31 dashboard + Step 31.2
 * admin surface (Luciel instances, embed keys).
 *
 * Authentication: every endpoint accepts the Step 30a session cookie
 * minted by /api/v1/billing/login + bridged into request.state by
 * SessionCookieAuthMiddleware (Step 31.2 commit A). `credentials:
 * "include"` ships the cookie cross-origin.
 *
 * Endpoint inventory:
 *   GET    /api/v1/dashboard/tenant
 *   GET    /api/v1/admin/luciel-instances
 *   POST   /api/v1/admin/luciel-instances
 *   GET    /api/v1/admin/luciel-instances/{pk}
 *   PATCH  /api/v1/admin/luciel-instances/{pk}
 *   DELETE /api/v1/admin/luciel-instances/{pk}  (soft, Pattern E)
 *   POST   /api/v1/admin/embed-keys             (Step 31.2 commit B
 *                                                accepts luciel_instance_id)
 *   GET    /api/v1/admin/api-keys?key_kind=embed
 *
 * Error contract: every non-2xx surfaces as an AdminApiError carrying
 * status + parsed body so the UI can branch on 401 (sign-in required),
 * 403 (scope), 404 (not found), 422 (validation, including the new
 * "inactive instance" branch).
 */

import { API_BASE_URL } from "@/lib/billing";

export class AdminApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const init: RequestInit = {
    method,
    credentials: "include",
    headers: { Accept: "application/json" },
  };
  if (body !== undefined) {
    init.headers = { ...init.headers, "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  // 204 No Content (e.g. DELETE) has no body to parse.
  if (res.status === 204) return undefined as unknown as T;
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${res.status})`;
    throw new AdminApiError(res.status, message, data);
  }
  return data as T;
}

// --------------------------------------------------------------------- //
// Dashboard rollups (Step 31)
// --------------------------------------------------------------------- //

export interface ScopeAggregates {
  turn_count: number;
  unique_user_count: number;
  escalation_count: number;
  tool_call_count: number;
  moderation_block_count: number;
  latency_p50_ms: number | null;
  latency_p95_ms: number | null;
}

export interface TrendBucket {
  day: string;
  turn_count: number;
}

export interface ChildRollup {
  child_id: string;
  child_display_name: string | null;
  turn_count: number;
  unique_user_count: number;
}

export interface TenantDashboard {
  tenant_id: string;
  window_days: number;
  aggregates: ScopeAggregates;
  trend: TrendBucket[];
  top_domains: ChildRollup[];
  top_luciel_instances: ChildRollup[];
}

export async function getTenantDashboard(
  windowDays = 7,
  topN = 5,
): Promise<TenantDashboard> {
  return request<TenantDashboard>(
    "GET",
    `/api/v1/dashboard/tenant?window_days=${windowDays}&top_n=${topN}`,
  );
}

// --------------------------------------------------------------------- //
// Luciel instances (Step 26 + Step 31.2)
// --------------------------------------------------------------------- //

export type ScopeLevel = "tenant" | "domain" | "agent";

export interface LucielInstance {
  id: number;
  instance_id: string;
  display_name: string;
  description: string | null;
  scope_level: ScopeLevel;
  scope_owner_tenant_id: string;
  scope_owner_domain_id: string | null;
  scope_owner_agent_id: string | null;
  system_prompt_additions: string | null;
  preferred_provider: string | null;
  allowed_tools: string[] | null;
  active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLucielInstanceRequest {
  instance_id: string;
  display_name: string;
  description?: string;
  scope_level: ScopeLevel;
  scope_owner_tenant_id: string;
  scope_owner_domain_id?: string;
  scope_owner_agent_id?: string;
  system_prompt_additions?: string;
  preferred_provider?: string;
  allowed_tools?: string[];
  created_by?: string;
}

export interface UpdateLucielInstanceRequest {
  display_name?: string;
  description?: string | null;
  system_prompt_additions?: string | null;
  preferred_provider?: string | null;
  allowed_tools?: string[] | null;
  active?: boolean;
  updated_by?: string;
}

export async function listLucielInstances(
  tenantId?: string,
  activeOnly = false,
): Promise<LucielInstance[]> {
  const qs = new URLSearchParams();
  if (tenantId) qs.set("tenant_id", tenantId);
  if (activeOnly) qs.set("active_only", "true");
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request<LucielInstance[]>("GET", `/api/v1/admin/luciel-instances${suffix}`);
}

export async function getLucielInstance(pk: number): Promise<LucielInstance> {
  return request<LucielInstance>("GET", `/api/v1/admin/luciel-instances/${pk}`);
}

export async function createLucielInstance(
  payload: CreateLucielInstanceRequest,
): Promise<LucielInstance> {
  return request<LucielInstance>("POST", `/api/v1/admin/luciel-instances`, payload as unknown as Record<string, unknown>);
}

export async function updateLucielInstance(
  pk: number,
  payload: UpdateLucielInstanceRequest,
): Promise<LucielInstance> {
  return request<LucielInstance>("PATCH", `/api/v1/admin/luciel-instances/${pk}`, payload as unknown as Record<string, unknown>);
}

export async function deactivateLucielInstance(pk: number): Promise<void> {
  return request<void>("DELETE", `/api/v1/admin/luciel-instances/${pk}`);
}

// --------------------------------------------------------------------- //
// Embed keys (Step 31.2 commit B — accepts luciel_instance_id)
// --------------------------------------------------------------------- //

export interface EmbedKey {
  id: string;
  key_prefix: string;
  tenant_id: string;
  domain_id: string | null;
  luciel_instance_id: number | null;
  display_name: string;
  key_kind: string;
  allowed_origins: string[];
  widget_branding_color: string | null;
  greeting_message: string | null;
  permissions: string[];
  active: boolean;
  created_at: string;
}

export interface CreateEmbedKeyRequest {
  tenant_id: string;
  domain_id?: string | null;
  luciel_instance_id?: number | null;
  display_name: string;
  allowed_origins: string[];
  widget_branding_color?: string;
  widget_position?: string;
  greeting_message?: string;
  widget_subtitle?: string;
}

export interface EmbedKeyCreateResponse {
  embed_key: EmbedKey;
  api_key: string; // one-time plaintext
}

export async function createEmbedKey(
  payload: CreateEmbedKeyRequest,
): Promise<EmbedKeyCreateResponse> {
  return request<EmbedKeyCreateResponse>(
    "POST",
    `/api/v1/admin/embed-keys`,
    payload as unknown as Record<string, unknown>,
  );
}

export async function listEmbedKeys(): Promise<EmbedKey[]> {
  // /admin/api-keys accepts key_kind=embed to filter
  return request<EmbedKey[]>("GET", `/api/v1/admin/api-keys?key_kind=embed`);
}
