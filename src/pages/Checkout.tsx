import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft } from "lucide-react";
import { tiers } from "./Pricing";

// TODO: Wire Stripe. Set the publishable key in environment, then load via @stripe/stripe-js.
// const STRIPE_PUBLISHABLE_KEY = ""; // <-- placeholder, do not commit a real key

const Checkout = () => {
  const [params] = useSearchParams();
  const planId = params.get("plan") ?? "team";
  const plan = useMemo(() => tiers.find((t) => t.id === planId) ?? tiers[1], [planId]);
  const [seats, setSeats] = useState(5);

  return (
    <SiteLayout>
      <Seo
        title={`Checkout · ${plan.name}`}
        description="Start your Luciel plan. Stripe-powered checkout."
        path="/checkout"
      />

      <section className="container-narrow pt-24 pb-16 md:pt-36">
        <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to pricing
        </Link>
        <Eyebrow>CHECKOUT</Eyebrow>
        <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          Start the {plan.name} plan.
        </h1>
      </section>

      <section className="container-narrow pb-24 md:pb-32">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <form className="rounded-xl border border-border bg-card p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
            <Eyebrow>BILLING DETAILS</Eyebrow>
            <div className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Billing email</Label>
                <Input id="email" name="email" type="email" placeholder="billing@yourcompany.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company name</Label>
                <Input id="company" name="company" placeholder="Acme Inc." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  min={1}
                  max={500}
                  value={seats}
                  onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value || "1", 10)))}
                />
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
              <strong className="text-foreground">Stripe integration pending.</strong> The
              checkout will mount Stripe Elements here once <code className="text-primary">STRIPE_PUBLISHABLE_KEY</code> is configured.
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full" disabled>
              <Lock size={16} /> Pay — Stripe integration pending
            </Button>
          </form>

          {/* Summary */}
          <aside className="h-fit rounded-xl border border-border bg-card p-6 md:p-8">
            <Eyebrow>ORDER SUMMARY</Eyebrow>
            <div className="mt-5 flex items-baseline justify-between">
              <div className="font-display text-2xl font-semibold tracking-tight">{plan.name}</div>
              <div className="text-sm text-muted-foreground">{plan.cadence}</div>
            </div>
            <div className="mt-2 font-display text-4xl font-semibold tracking-tight">
              {plan.price}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{plan.blurb}</p>

            <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f} className="text-muted-foreground">— {f}</li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-6 text-sm">
              <span className="text-muted-foreground">Seats</span>
              <span className="text-foreground">{seats}</span>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Need a different setup? <Link to="/contact?topic=enterprise" className="text-primary hover:underline">Talk to sales →</Link>
            </p>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Checkout;
