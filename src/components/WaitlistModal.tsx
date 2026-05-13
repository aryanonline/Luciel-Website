import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isEmail, submitWaitlist } from "@/lib/submissions";
import { trackCta } from "@/lib/analytics";

type Tier = "individual" | "team" | "company" | "unspecified";

type Ctx = { open: (tier?: Tier, source?: string) => void; close: () => void };
const WaitlistCtx = createContext<Ctx | null>(null);

export const useWaitlist = () => {
  const ctx = useContext(WaitlistCtx);
  if (!ctx) throw new Error("useWaitlist must be used inside WaitlistProvider");
  return ctx;
};

export const WaitlistProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTier] = useState<Tier>("unspecified");
  const [source, setSource] = useState<string>("/");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");

  const open = useCallback((t: Tier = "unspecified", s = typeof window !== "undefined" ? window.location.pathname : "/") => {
    setTier(t);
    setSource(s);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const reset = () => { setEmail(""); setRole(""); setCompany(""); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast.error("Enter a valid email.");
      return;
    }
    setSubmitting(true);
    const ok = await submitWaitlist({
      email: email.trim(),
      role: role.trim() || undefined,
      company: company.trim() || undefined,
      tier,
      source_page: source,
    });
    setSubmitting(false);
    if (ok) {
      toast.success("You're on the list. We'll be in touch.");
      reset();
      setTimeout(close, 1500);
    } else {
      toast.error("Something didn't go through. Try again or email hello@vantagemind.ai.");
    }
  };

  return (
    <WaitlistCtx.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Join the waitlist</DialogTitle>
            <DialogDescription>
              We will let you know the moment it opens. No marketing in between.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="mt-2 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="wl-email">Work email</Label>
              <Input id="wl-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wl-role">Role <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="wl-role" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wl-company">Company <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="wl-company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Join the waitlist"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </WaitlistCtx.Provider>
  );
};

/**
 * WaitlistButton — single CTA used across the site.
 *
 * `mode="waitlist"` (today) opens the modal.
 * `mode="checkout"` (Step 30a) redirects to /signup?tier=… and will be
 * swapped for a Stripe-checkout redirect once that endpoint exists.
 */
export interface WaitlistButtonProps {
  tier?: Tier;
  /** "waitlist" today; flip to "checkout" once Step 30a ships. */
  mode?: "waitlist" | "checkout";
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: ReactNode;
  sourcePage?: string;
}

export const WaitlistButton = ({
  tier = "unspecified",
  mode = "waitlist",
  variant = "default",
  size = "default",
  className,
  children = "Join the waitlist",
  sourcePage,
}: WaitlistButtonProps) => {
  const { open } = useWaitlist();
  const navigate = useNavigate();
  const source = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/");

  const onClick = () => {
    trackCta(typeof children === "string" ? children : "waitlist_cta", source, tier);

    if (mode === "checkout") {
      // TODO(step-30a): replace this with a call to the Stripe Checkout
      // session creator (e.g. POST /api/billing/create-checkout-session)
      // and then `window.location.assign(session.url)`. Until then we
      // route to the /signup stub so the flow is continuous.
      navigate(`/signup?tier=${tier}`);
      return;
    }

    open(tier, source);
  };

  return (
    <Button onClick={onClick} variant={variant} size={size} className={className}>
      {children}
    </Button>
  );
};
