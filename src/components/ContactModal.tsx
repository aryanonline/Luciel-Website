import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/* ===========================================================
   ContactModal — pre-revenue contact capture
   -----------------------------------------------------------
   Plumbing: Web3Forms (https://web3forms.com) — pure
   client-side POST. The access key (VITE_WEB3FORMS_ACCESS_KEY)
   is read from import.meta.env. If unset, falls back to mailto.

   Anti-abuse:
   - Honeypot field "botcheck" must remain empty (Web3Forms
     server-side filters submissions where this is non-empty).
   - Client-side sessionStorage throttle: 1 submission / 30s.
   ============================================================ */

const ACCESS_KEY = "aa0bfe54-620b-46d4-967b-a7b0521b81d5";
const ACCESS_KEY_PLACEHOLDER = "PLACEHOLDER_PASTE_KEY_HERE";
const ENDPOINT = "https://api.web3forms.com/submit";
const RECIPIENT = "contact@vantagemind.ai";
const THROTTLE_MS = 30_000;
const STORAGE_KEY = "vm_contact_last_submit";

// Lightweight email regex — HTML5 type="email" is the primary gate;
// this is a belt-and-braces check before POST.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  email: string;
  company: string;
  role: string;
  use_case: string;
  message: string;
  botcheck: string; // honeypot
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  name: "", email: "", company: "", role: "", use_case: "", message: "", botcheck: "",
};

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm(initial);
        setErrors({});
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const validate = (s: FormState): FieldErrors => {
    const e: FieldErrors = {};
    if (!s.name.trim()) e.name = "Required";
    if (!s.email.trim()) e.email = "Required";
    else if (!EMAIL_RE.test(s.email.trim())) e.email = "Enter a valid email";
    if (!s.company.trim()) e.company = "Required";
    if (!s.role.trim()) e.role = "Required";
    if (!s.use_case.trim()) e.use_case = "Required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — silent drop
    if (form.botcheck.trim() !== "") {
      close();
      return;
    }

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    // Rate-limit
    const last = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() - last < THROTTLE_MS) {
      const wait = Math.ceil((THROTTLE_MS - (Date.now() - last)) / 1000);
      toast.error(`Please wait ${wait}s before submitting again.`);
      return;
    }

    setSubmitting(true);

    const subject = `VantageMind AI — Design-partner pilot request from ${form.name}`;

    const keyMissing = false;

    if (keyMissing) {
      if (!warnedMissingKey) {
        console.warn(
          "[ContactModal] VITE_WEB3FORMS_ACCESS_KEY is missing or placeholder — falling back to mailto.",
        );
        warnedMissingKey = true;
      }
      const mailtoBody =
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Company: ${form.company}\n` +
        `Role: ${form.role}\n\n` +
        `What they'd judge with Luciel:\n${form.use_case}\n\n` +
        `Anything else:\n${form.message || "—"}`;
      const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
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
          email: form.email,
          company: form.company,
          role: form.role,
          use_case: form.use_case,
          message: form.message,
          botcheck: form.botcheck, // honeypot — Web3Forms server-side filter
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

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

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

          <form onSubmit={handleSubmit} noValidate className="mt-2 space-y-4">
            {/* Honeypot — visually hidden, off-screen, not tab-focusable */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label>
                Leave this field empty
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.botcheck}
                  onChange={(e) => update("botcheck", e.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cm-name">Name</Label>
                <Input
                  id="cm-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-email">Email</Label>
                <Input
                  id="cm-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-company">Company</Label>
                <Input
                  id="cm-company"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  aria-invalid={!!errors.company}
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-role">Role</Label>
                <Input
                  id="cm-role"
                  name="role"
                  autoComplete="organization-title"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  aria-invalid={!!errors.role}
                />
                {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cm-use-case">What would Luciel judge for you?</Label>
              <Textarea
                id="cm-use-case"
                name="use_case"
                rows={4}
                value={form.use_case}
                onChange={(e) => update("use_case", e.target.value)}
                aria-invalid={!!errors.use_case}
              />
              {errors.use_case && <p className="text-xs text-destructive">{errors.use_case}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cm-message">Anything else we should know?</Label>
              <Textarea
                id="cm-message"
                name="message"
                rows={3}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
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
