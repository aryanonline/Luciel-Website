import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

/* ===========================================================
   ContactModal — pre-revenue contact capture
   -----------------------------------------------------------
   Plumbing: Web3Forms (https://web3forms.com) — pure
   client-side POST, no backend infra needed. Email is delivered
   to whatever inbox is configured on the Web3Forms access key.
   We chose Web3Forms over Resend because Resend requires server
   infrastructure (API key cannot ship in client bundles), and
   we have intentionally NOT enabled Lovable Cloud / Supabase
   to honor our Canadian data-residency promise.

   Key sourcing:
   - VITE_WEB3FORMS_ACCESS_KEY is read from import.meta.env
   - If unset, the form falls back to a mailto: link so nothing
     silently drops.

   Anti-abuse:
   - Honeypot field "website" must remain empty
   - Client-side localStorage throttle: 1 submission / 60s
   ============================================================ */

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
const ACCESS_KEY_PLACEHOLDER = "PLACEHOLDER_PASTE_KEY_HERE";
const ENDPOINT = "https://api.web3forms.com/submit";
const RECIPIENT = "contact@vantagemind.ai";
const THROTTLE_MS = 30_000;
const STORAGE_KEY = "vm_contact_last_submit";

let warnedMissingKey = false;

type Ctx = { open: () => void; close: () => void };
const ContactModalContext = createContext<Ctx | null>(null);

export const useContactModal = () => {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used inside ContactModalProvider");
  return ctx;
};

type FormState = {
  name: string;
  firm: string;
  role: string;
  firmSize: string;
  problem: string;
  source: string;
  website: string; // honeypot
};

const initial: FormState = {
  name: "", firm: "", role: "", firmSize: "", problem: "", source: "", website: "",
};

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      const t = setTimeout(() => setForm(initial), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — silent drop
    if (form.website.trim() !== "") {
      close();
      return;
    }

    // Required fields
    if (!form.name || !form.firm || !form.role || !form.firmSize || !form.problem) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Rate-limit (sessionStorage, 30s)
    const last = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() - last < THROTTLE_MS) {
      const wait = Math.ceil((THROTTLE_MS - (Date.now() - last)) / 1000);
      toast.error(`Please wait ${wait}s before submitting again.`);
      return;
    }

    setSubmitting(true);

    const subject = `VantageMind AI — Design-partner pilot request from ${form.name}`;
    const messageBody =
      `Name: ${form.name}\n` +
      `Firm: ${form.firm}\n` +
      `Role: ${form.role}\n` +
      `Firm size: ${form.firmSize}\n` +
      `How they heard about us: ${form.source || "—"}\n\n` +
      `Problem to solve:\n${form.problem}`;

    const keyMissing = !ACCESS_KEY || ACCESS_KEY === ACCESS_KEY_PLACEHOLDER;

    if (keyMissing) {
      if (!warnedMissingKey) {
        console.warn(
          "[ContactModal] VITE_WEB3FORMS_ACCESS_KEY is missing or placeholder — falling back to mailto. Set it in .env.local to enable POST submission.",
        );
        warnedMissingKey = true;
      }
      const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
      window.location.href = mailto;
      toast.message("Opening your email client", {
        description: "Form delivery is not yet configured. Your message is pre-filled.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject,
          from_name: "VantageMind AI Website",
          name: form.name,
          firm: form.firm,
          role: form.role,
          firm_size: form.firmSize,
          source: form.source,
          message: messageBody,
          botcheck: "", // honeypot — server-side filter
          redirect: false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Submission failed");

      sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
      toast.success("Thanks — we'll reply within 2 business days.");
      setTimeout(() => close(), 3000);
    } catch (err) {
      console.error("[ContactModal] submit failed", err);
      sessionStorage.setItem(STORAGE_KEY, String(Date.now())); // throttle failures too
      toast.error("Something went wrong. Please try again or email contact@vantagemind.ai.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  return (
    <ContactModalContext.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Request a design-partner pilot</DialogTitle>
            <DialogDescription>
              We are taking on two design-partner tenants in 2026. Tell us about your firm and the
              problem you want to solve.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            {/* Honeypot — visually hidden, off-screen, not tab-focusable */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cm-name">Name</Label>
                <Input id="cm-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-firm">Firm</Label>
                <Input id="cm-firm" required value={form.firm} onChange={(e) => update("firm", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-role">Role</Label>
                <Input id="cm-role" required value={form.role} onChange={(e) => update("role", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-size">Firm size</Label>
                <Select value={form.firmSize} onValueChange={(v) => update("firmSize", v)}>
                  <SelectTrigger id="cm-size"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1–10</SelectItem>
                    <SelectItem value="11-50">11–50</SelectItem>
                    <SelectItem value="51-200">51–200</SelectItem>
                    <SelectItem value="200+">200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cm-problem">What problem are you trying to solve?</Label>
              <Textarea
                id="cm-problem"
                required
                rows={4}
                value={form.problem}
                onChange={(e) => update("problem", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cm-source">How did you hear about us?</Label>
              <Input id="cm-source" value={form.source} onChange={(e) => update("source", e.target.value)} />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ContactModalContext.Provider>
  );
};
