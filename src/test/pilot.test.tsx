/**
 * pilot.test.tsx — Step 30a.2-pilot Commit 3c website surface tests.
 *
 * Locks in the five load-bearing claims of the pilot website surface:
 *   1. `isRefundEligible` enforces the three-gate rule (is_pilot && pilot_window_end
 *      set && now <= pilot_window_end). Backend remains sole truth source,
 *      but the UI must not show the button when those gates aren't satisfied.
 *   2. `PilotRefundPanel` renders on Account only when the gates pass — and
 *      is reachable via its data-testid so the live e2e harness can find it.
 *   3. Pricing page carries the canonical, plain-English refund-policy sentence
 *      that we promise on Stripe Checkout and in §16 of Terms.
 *   4. Nav has the locked "Start 90-day pilot" primary CTA pointing at /pricing
 *      (not /signup — user wants prospects to compare plans first).
 *   5. LegalTerms has 16 numbered sections and the §16 "Pilot refund amendment"
 *      title and "Last updated" footer reflect the amendment date.
 *
 * These tests run pure-frontend (no network) — the live e2e harness still
 * exercises the round-trip against staging/prod.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Account, { isRefundEligible } from "@/pages/Account";
import Pricing from "@/pages/Pricing";
import LegalTerms from "@/pages/LegalTerms";
import { Nav } from "@/components/Nav";
import { WaitlistProvider } from "@/components/WaitlistModal";
import type { SubscriptionStatus } from "@/lib/billing";

type FetchMock = ReturnType<typeof vi.fn>;
let fetchMock: FetchMock;

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Dates are computed relative to real `Date.now()` so we can exercise
// `isRefundEligible`'s now-vs-cutoff arithmetic without fake timers
// (fake timers stall React's async batching and break waitFor).
const DAY_MS = 24 * 60 * 60 * 1000;
const toIso = (offsetDays: number): string =>
  new Date(Date.now() + offsetDays * DAY_MS).toISOString();

/**
 * Baseline subscription status — a healthy active pilot mid-window
 * (cutoff is 60 days in the future relative to real "now").
 * Individual tests clone-and-override the fields they exercise.
 */
const baselinePilot = (): SubscriptionStatus => ({
  tenant_id: "tenant_test_123",
  tier: "individual",
  billing_cadence: "monthly",
  instance_count_cap: 1,
  status: "trialing",
  active: true,
  is_entitled: true,
  current_period_start: toIso(-30),
  current_period_end: toIso(60),
  trial_end: toIso(60),
  cancel_at_period_end: false,
  canceled_at: null,
  customer_email: "pilot@example.com",
  is_pilot: true,
  pilot_window_end: toIso(60),
});

beforeEach(() => {
  fetchMock = vi.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// 1. isRefundEligible — pure-function truth table.
// ---------------------------------------------------------------------------

describe("isRefundEligible", () => {
  it("returns true when is_pilot, window_end set, and now is inside the window", () => {
    expect(isRefundEligible(baselinePilot())).toBe(true);
  });

  it("returns false when is_pilot is false (regular trialing subscription)", () => {
    const s = baselinePilot();
    s.is_pilot = false;
    expect(isRefundEligible(s)).toBe(false);
  });

  it("returns false when pilot_window_end is null", () => {
    const s = baselinePilot();
    s.pilot_window_end = null;
    expect(isRefundEligible(s)).toBe(false);
  });

  it("returns false on day 91+ — past the cutoff, button must hide", () => {
    const s = baselinePilot();
    // Cutoff was yesterday relative to real now.
    s.pilot_window_end = toIso(-1);
    expect(isRefundEligible(s)).toBe(false);
  });

  it("returns true while there is still meaningful time left in the window", () => {
    // Boundary-ish case: 30 seconds remaining. now <= cutoff still holds.
    const s = baselinePilot();
    s.pilot_window_end = new Date(Date.now() + 30_000).toISOString();
    expect(isRefundEligible(s)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Account page — PilotRefundPanel render gating.
// ---------------------------------------------------------------------------

const renderAccount = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/account"]}>
        <Account />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Account PilotRefundPanel render gating", () => {
  it("renders the refund panel when the subscription is an active pilot mid-window", async () => {
    fetchMock.mockResolvedValueOnce(json(200, baselinePilot()));
    renderAccount();
    await waitFor(() => {
      expect(screen.getByTestId("pilot-refund-panel")).toBeInTheDocument();
    });
    expect(screen.getByTestId("pilot-refund-button")).toBeInTheDocument();
  });

  it("does not render the refund panel for a regular non-pilot trialing subscription", async () => {
    const s = baselinePilot();
    s.is_pilot = false;
    s.pilot_window_end = null;
    fetchMock.mockResolvedValueOnce(json(200, s));
    renderAccount();
    // "Manage billing" is the unambiguous post-load anchor on the
    // billing tab — it renders once /billing/me resolves with an
    // active subscription.
    await waitFor(() => {
      expect(screen.getByText(/manage billing/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("pilot-refund-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pilot-refund-button")).not.toBeInTheDocument();
  });

  it("does not render the refund panel after the 90-day window has closed", async () => {
    const s = baselinePilot();
    s.pilot_window_end = toIso(-1); // cutoff was yesterday relative to real now
    fetchMock.mockResolvedValueOnce(json(200, s));
    renderAccount();
    await waitFor(() => {
      expect(screen.getByText(/manage billing/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("pilot-refund-panel")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Pricing page — canonical refund-policy footnote.
// ---------------------------------------------------------------------------

const renderPricing = () =>
  render(
    <HelmetProvider>
      <WaitlistProvider>
        <MemoryRouter initialEntries={["/pricing"]}>
          <Pricing />
        </MemoryRouter>
      </WaitlistProvider>
    </HelmetProvider>,
  );

describe("Pricing page pilot refund footnote", () => {
  it("renders the refund footnote with the canonical policy sentence", () => {
    renderPricing();
    const footnote = screen.getByTestId("pilot-refund-footnote");
    expect(footnote).toBeInTheDocument();
    // Anchor id is critical — deep-linkable from Stripe Checkout success
    // and from the §16 amendment in Terms.
    expect(footnote).toHaveAttribute("id", "pilot-refund");
    // Load-bearing phrases — copy locked with user. If we change any of
    // these we must also update Stripe Checkout description and §16.
    expect(footnote.textContent).toMatch(/first-time customers/i);
    expect(footnote.textContent).toMatch(/\$100 CAD intro fee/);
    expect(footnote.textContent).toMatch(/fully refundable/i);
    expect(footnote.textContent).toMatch(/90-day window/i);
    expect(footnote.textContent).toMatch(/one-click/i);
    expect(footnote.textContent).toMatch(/cancels your subscription/i);
  });
});

// ---------------------------------------------------------------------------
// 4. Nav — "Start 90-day pilot" CTA pointing at /pricing (not /signup).
// ---------------------------------------------------------------------------

const renderNav = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Nav primary CTA", () => {
  it("renders the 'Start 90-day pilot' CTA pointing at /pricing", () => {
    renderNav();
    // Desktop + mobile both render the label; one href check covers
    // the wiring regardless of which surface react-testing-library hits.
    const ctas = screen.getAllByRole("link", { name: /start 90-day pilot/i });
    expect(ctas.length).toBeGreaterThan(0);
    for (const cta of ctas) {
      expect(cta).toHaveAttribute("href", "/pricing");
    }
  });
});

// ---------------------------------------------------------------------------
// 5. LegalTerms — §16 pilot refund amendment + updated "Last updated".
// ---------------------------------------------------------------------------

const renderLegalTerms = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/legal/terms"]}>
        <LegalTerms />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("LegalTerms pilot refund amendment (§16)", () => {
  it("renders the §16 Pilot refund amendment heading", () => {
    renderLegalTerms();
    expect(
      screen.getByText(/pilot refund amendment \(introductory offer\)/i),
    ).toBeInTheDocument();
  });

  it("updates the 'Last updated' footer to reflect the amendment", () => {
    renderLegalTerms();
    expect(
      screen.getByText(/last updated.*pilot refund amendment/i),
    ).toBeInTheDocument();
  });
});
