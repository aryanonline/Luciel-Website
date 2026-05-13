/**
 * admin.test.ts — Step 32 smoke tests for the admin gateway.
 *
 * Verifies the shape of every request we send to the backend matches
 * what Step 31.2 ships:
 *   * GET  /api/v1/dashboard/tenant  → returns TenantDashboard
 *   * POST /api/v1/admin/luciel-instances → JSON body, scope_level included
 *   * POST /api/v1/admin/embed-keys → carries luciel_instance_id when set
 *     (Step 31.2 commit B)
 *   * AdminApiError captures status + parsed detail
 *
 * Network calls are mocked at globalThis.fetch so the suite is hermetic.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AdminApiError,
  createEmbedKey,
  createLucielInstance,
  getTenantDashboard,
  listLucielInstances,
} from "@/lib/admin";

type FetchMock = ReturnType<typeof vi.fn>;
let fetchMock: FetchMock;

const okResponse = (body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const createdResponse = (body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });

const errorResponse = (status: number, detail: string): Response =>
  new Response(JSON.stringify({ detail }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  fetchMock = vi.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getTenantDashboard", () => {
  it("calls GET /api/v1/dashboard/tenant with credentials + parses body", async () => {
    const payload = {
      tenant_id: "t_test",
      window_days: 7,
      aggregates: {
        turn_count: 12,
        unique_user_count: 4,
        escalation_count: 0,
        tool_call_count: 1,
        moderation_block_count: 0,
        latency_p50_ms: null,
        latency_p95_ms: null,
      },
      trend: [],
      top_domains: [],
      top_luciel_instances: [],
    };
    fetchMock.mockResolvedValueOnce(okResponse(payload));

    const res = await getTenantDashboard(7, 5);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/dashboard/tenant?window_days=7&top_n=5");
    expect(init.credentials).toBe("include");
    expect(init.method).toBe("GET");
    expect(res.aggregates.turn_count).toBe(12);
  });
});

describe("listLucielInstances", () => {
  it("builds tenant_id + active_only query string when supplied", async () => {
    fetchMock.mockResolvedValueOnce(okResponse([]));
    await listLucielInstances("t_test", true);
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("tenant_id=t_test");
    expect(String(url)).toContain("active_only=true");
  });
});

describe("createLucielInstance", () => {
  it("POSTs with content-type JSON + scope_level + tenant in body", async () => {
    const created = {
      id: 1,
      instance_id: "sarahs-bot",
      display_name: "Sarah's Bot",
      description: null,
      scope_level: "tenant",
      scope_owner_tenant_id: "t_test",
      scope_owner_domain_id: null,
      scope_owner_agent_id: null,
      system_prompt_additions: null,
      preferred_provider: null,
      allowed_tools: null,
      active: true,
      created_by: null,
      created_at: "2026-05-13T00:00:00Z",
      updated_at: "2026-05-13T00:00:00Z",
    };
    fetchMock.mockResolvedValueOnce(createdResponse(created));

    const res = await createLucielInstance({
      instance_id: "sarahs-bot",
      display_name: "Sarah's Bot",
      scope_level: "tenant",
      scope_owner_tenant_id: "t_test",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/admin/luciel-instances");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    const body = JSON.parse(init.body as string);
    expect(body.scope_level).toBe("tenant");
    expect(body.scope_owner_tenant_id).toBe("t_test");
    expect(body.instance_id).toBe("sarahs-bot");
    expect(res.id).toBe(1);
  });
});

describe("createEmbedKey", () => {
  it("includes luciel_instance_id when provided (Step 31.2 commit B)", async () => {
    fetchMock.mockResolvedValueOnce(
      createdResponse({
        embed_key: {
          id: "ek_1",
          key_prefix: "lk_test_AAA",
          tenant_id: "t_test",
          domain_id: null,
          luciel_instance_id: 7,
          display_name: "Sarah's Widget",
          key_kind: "embed",
          allowed_origins: ["https://sarah-realty.example.com"],
          widget_branding_color: "#0E7C5A",
          greeting_message: "Hi!",
          permissions: ["chat"],
          active: true,
          created_at: "2026-05-13T00:00:00Z",
        },
        api_key: "lk_test_AAA_full_secret",
      }),
    );

    const res = await createEmbedKey({
      tenant_id: "t_test",
      luciel_instance_id: 7,
      display_name: "Sarah's Widget",
      allowed_origins: ["https://sarah-realty.example.com"],
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/admin/embed-keys");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string);
    expect(body.luciel_instance_id).toBe(7);
    expect(body.tenant_id).toBe("t_test");
    expect(res.embed_key.luciel_instance_id).toBe(7);
    expect(res.api_key).toBe("lk_test_AAA_full_secret");
  });

  it("omits luciel_instance_id when caller passes undefined (back-compat)", async () => {
    fetchMock.mockResolvedValueOnce(
      createdResponse({
        embed_key: {
          id: "ek_2",
          key_prefix: "lk_test_BBB",
          tenant_id: "t_test",
          domain_id: null,
          luciel_instance_id: null,
          display_name: "Tenant-wide",
          key_kind: "embed",
          allowed_origins: ["*"],
          widget_branding_color: null,
          greeting_message: null,
          permissions: ["chat"],
          active: true,
          created_at: "2026-05-13T00:00:00Z",
        },
        api_key: "lk_test_BBB_full_secret",
      }),
    );

    await createEmbedKey({
      tenant_id: "t_test",
      display_name: "Tenant-wide",
      allowed_origins: ["*"],
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect("luciel_instance_id" in body).toBe(false);
  });
});

describe("AdminApiError", () => {
  it("captures status + detail from the response body", async () => {
    fetchMock.mockResolvedValueOnce(
      errorResponse(403, "Luciel instance belongs to a different tenant."),
    );

    await expect(
      createEmbedKey({
        tenant_id: "t_test",
        luciel_instance_id: 9999,
        display_name: "x",
        allowed_origins: ["*"],
      }),
    ).rejects.toMatchObject({
      name: "AdminApiError",
      status: 403,
      message: expect.stringContaining("different tenant"),
    });
  });

  it("captures 401 unauthenticated as AdminApiError", async () => {
    fetchMock.mockResolvedValueOnce(errorResponse(401, "Unauthorized"));
    try {
      await listLucielInstances();
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(AdminApiError);
      expect((err as AdminApiError).status).toBe(401);
    }
  });

  it("captures 422 inactive-instance branch (Pattern E)", async () => {
    fetchMock.mockResolvedValueOnce(
      errorResponse(422, "Luciel instance is inactive (soft-deleted)."),
    );
    await expect(
      createEmbedKey({
        tenant_id: "t_test",
        luciel_instance_id: 5,
        display_name: "x",
        allowed_origins: ["*"],
      }),
    ).rejects.toMatchObject({
      status: 422,
      message: expect.stringContaining("inactive"),
    });
  });
});
