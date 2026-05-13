import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isEmail, submitWaitlist } from "@/lib/submissions";
import { track } from "@/lib/analytics";

type Tier = "individual" | "team" | "company" | "unspecified";

const Signup = () => {
  const [params] = useSearchParams();
  const tierParam = params.get("tier");
  const tier: Tier = (["individual", "team", "company"] as const).includes(
    tierParam as "individual" | "team" | "company",
  )
    ? (tierParam as Tier)
    : "unspecified";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    track({ name: "signup_started", payload: { tier } });
  }, [tier]);

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
      source_page: "/signup",
    });
    setSubmitting(false);
    if (ok) {
      setDone(true);
      toast.success("You're on the list. We'll be in touch.");
    } else {
      toast.error("Something didn't go through. Try again or email hello@vantagemind.ai.");
    }
  };

  return (
    <SiteLayout>
      <Seo
        title="Sign up — VantageMind AI"
        description="Self-serve sign-up for Luciel is opening soon. Drop your email and we'll let you know the moment it goes live."
        path="/signup"
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-20 md:pt-40 md:pb-28">
          <Eyebrow>SIGN UP</Eyebrow>
          {tier !== "unspecified" && (
            <div className="mt-5">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                {tier} tier
              </span>
            </div>
          )}
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Sign-up is opening soon.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We're finishing the self-serve checkout for the Individual tier. Drop your email and
            we'll let you know the moment it's live. Team and Company tiers are sales-assisted
            today — book a demo and we'll get you set up.
          </p>

          {done ? (
            <div className="mt-10 max-w-md rounded-xl border border-border bg-card p-7">
              <div className="eyebrow text-primary">Confirmed</div>
              <p className="mt-4 text-base text-foreground">You're on the list. We'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 max-w-md space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="su-email">Work email</Label>
                <Input id="su-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="su-role">Role <span className="text-muted-foreground">(optional)</span></Label>
                  <Input id="su-role" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-company">Company <span className="text-muted-foreground">(optional)</span></Label>
                  <Input id="su-company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Join the waitlist"}
                </Button>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Book a demo
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Signup;
