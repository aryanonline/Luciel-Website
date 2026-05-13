/**
 * Dashboard.test.tsx — Step 32 page render smoke test.
 *
 * Renders the Dashboard page under three /api/v1/billing/me responses
 * and asserts the page picks the right CTA branch. We don't drive the
 * authenticated path here (that's the live e2e harness's job) -- the
 * smoke test just locks in that the auth-state machine doesn't crash
 * and shows the user a sensible next action.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Dashboard from "@/pages/Dashboard";

type FetchMock = ReturnType<typeof vi.fn>;
let fetchMock: FetchMock;

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    </HelmetProvider>,
  );

beforeEach(() => {
  fetchMock = vi.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Dashboard page", () => {
  it("shows the sign-in CTA when /billing/me returns 401", async () => {
    fetchMock.mockResolvedValueOnce(json(401, { detail: "Unauthorized" }));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/sign in required/i)).toBeInTheDocument();
    });
    // Sanity: the trial CTA is reachable from this state.
    expect(screen.getAllByText(/start a trial/i).length).toBeGreaterThan(0);
  });

  it("shows the no-subscription CTA when /billing/me returns 404", async () => {
    fetchMock.mockResolvedValueOnce(json(404, { detail: "No subscription" }));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/no subscription on file/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/view pricing/i)).toBeInTheDocument();
  });

  it("shows the loading state initially, then surfaces error for 500", async () => {
    fetchMock.mockResolvedValueOnce(json(500, { detail: "boom" }));
    renderPage();
    // Render starts with the loading card.
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/boom/)).toBeInTheDocument();
    });
  });
});
