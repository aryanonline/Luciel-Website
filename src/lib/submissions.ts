/**
 * submissions.ts — single client-side gateway for waitlist + demo requests.
 *
 * Today: posts to Web3Forms (already provisioned for the Contact modal),
 * differentiated by subject + a `kind` field so the inbox can be filtered
 * into "tables" (waitlist vs demo_requests).
 *
 * Step 30a: if VITE_WAITLIST_WEBHOOK_URL is set, requests POST there as
 * raw JSON instead — letting the operator point at Supabase / Formspree /
 * a custom edge function without code changes.
 */

const WEB3FORMS_KEY = "aa0bfe54-620b-46d4-967b-a7b0521b81d5";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Tier = "individual" | "team" | "company" | "unspecified";

export interface WaitlistPayload {
  email: string;
  role?: string;
  company?: string;
  tier: Tier;
  source_page: string;
}

export interface DemoRequestPayload {
  name: string;
  email: string;
  company: string;
  role?: string;
  tier: Tier;
  message: string;
  source_page: string;
}

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const WEBHOOK_URL = env.VITE_WAITLIST_WEBHOOK_URL;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (s: string) => EMAIL_RE.test(s.trim());

async function postWebhook(body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function postWeb3Forms(subject: string, body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: "VantageMind AI Website",
        redirect: false,
        ...body,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && !!data.success;
  } catch {
    return false;
  }
}

export async function submitWaitlist(p: WaitlistPayload): Promise<boolean> {
  const record = { kind: "waitlist", created_at: new Date().toISOString(), ...p };
  if (WEBHOOK_URL) return postWebhook(record);
  return postWeb3Forms(`Waitlist — ${p.tier} (${p.email})`, record);
}

export async function submitDemoRequest(p: DemoRequestPayload): Promise<boolean> {
  const record = { kind: "demo_request", created_at: new Date().toISOString(), ...p };
  if (WEBHOOK_URL) return postWebhook(record);
  return postWeb3Forms(`Demo request — ${p.tier} (${p.email})`, record);
}
