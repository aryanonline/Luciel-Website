import { useState } from "react";
import { z } from "zod";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow, FeatureCard, SectionHeading } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, ExternalLink } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  company: z.string().trim().min(1, "Required").max(100),
  role: z.string().trim().min(1, "Required").max(100),
  industry: z.string().min(1, "Required"),
  teamSize: z.string().trim().min(1, "Required").max(40),
  productLink: z.string().trim().url("Must be a valid URL").max(300).or(z.literal("")),
  pain: z.string().trim().min(10, "Tell us a bit more").max(2000),
  email: z.string().trim().email("Invalid email").max(255),
});

const get = [
  { t: "Early access", d: "First production access to Luciel and every primitive as it ships." },
  { t: "Direct founder support", d: "A shared Slack channel with the founder. No tiered support, no tickets." },
  { t: "Influence on the roadmap", d: "Your edge cases become first-class features. Your feedback ships." },
  { t: "Lifetime pricing lock", d: "Locked-in design-partner pricing for the life of your account." },
];

const looking = [
  { t: "Regulated-business SaaS", d: "Property management, mortgage, legal, healthcare. Anywhere consent and retention matter." },
  { t: "Technical team willing to integrate", d: "You have engineers who can integrate a backend service over the next quarter." },
  { t: "Six-month commitment", d: "You can dedicate real product surface area to a Luciel-powered workflow for six months." },
  { t: "Honest technical feedback", d: "You'll tell us when something is wrong, slow, or missing — directly." },
];

const DesignPartners = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      toast({
        title: "Please check the form",
        description: result.error.issues[0]?.message ?? "Some fields are missing.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    // No backend yet — simulate. Founder will follow up via email.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      <Seo
        title="Design Partners"
        description="Pilot Luciel in production over six months. No cost. Direct founder support. Apply to become a VantageMind AI design partner."
        path="/design-partners"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-narrow pt-24 pb-16 md:pt-36 md:pb-24">
          <Eyebrow>DESIGN PARTNERS</Eyebrow>
          <h1 className="font-display mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Design partners <span className="accent-text">wanted</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Pilot Luciel in production over the next six months. No cost. Honest feedback both
            ways. We're selecting a small group of regulated-business teams.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading eyebrow="WHAT YOU GET" title="A real partnership, not a beta program." />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {get.map((p, i) => (
              <FeatureCard key={p.t} index={i + 1} title={p.t}>
                {p.d}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* What we're looking for */}
      <section className="section border-t border-border">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="WHAT WE'RE LOOKING FOR"
            title="A short list of fits."
            description="If three of the four describe you, we should talk."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {looking.map((p, i) => (
              <FeatureCard key={p.t} index={i + 1} title={p.t}>
                {p.d}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section border-t border-border">
        <div className="container-narrow grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>APPLY</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Tell us about your team.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Five minutes. Read by the founder. We reply to every applicant — fit or not.
            </p>

            <div className="mt-10 rounded-xl border border-border bg-card p-6">
              <Eyebrow>PREFER TO TALK FIRST?</Eyebrow>
              <p className="mt-3 text-sm text-muted-foreground">
                Book a 20-minute intro call instead. No prep needed.
              </p>
              <div className="mt-6 flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground">
                Calendly embed placeholder
              </div>
              <Button asChild variant="ghost" className="mt-4 w-full">
                <a href="https://calendly.com/aryan-vantagemind/intro" target="_blank" rel="noreferrer">
                  Open Calendly <ExternalLink className="ml-1" size={14} />
                </a>
              </Button>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" />
                  <Field label="Company" name="company" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Role" name="role" placeholder="CTO, Head of Eng, etc." />
                  <div className="grid gap-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select name="industry">
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-estate">Real Estate / Property Mgmt</SelectItem>
                        <SelectItem value="mortgage">Mortgage</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Team size" name="teamSize" placeholder="e.g. 12 people, 4 engineers" />
                  <Field label="Link to product" name="productLink" placeholder="https://" type="url" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pain">What AI plumbing pain are you feeling?</Label>
                  <Textarea
                    id="pain"
                    name="pain"
                    rows={5}
                    placeholder="Be specific. The more concrete, the better."
                    maxLength={2000}
                  />
                </div>
                <Field label="Email" name="email" type="email" />
                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? "Submitting…" : "Apply"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  By applying, you agree to be contacted by VantageMind AI about the design partner program.
                </p>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-start justify-center rounded-xl border border-border bg-card p-8">
              <CheckCircle2 className="text-primary" size={28} />
              <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight">
                Application received.
              </h3>
              <p className="mt-3 text-muted-foreground">
                Thanks — Aryan reads every application personally and will reply within two
                business days. If you'd like to skip the queue, book a 20-minute intro call.
              </p>
              <Button asChild className="mt-6">
                <a href="https://calendly.com/aryan-vantagemind/intro" target="_blank" rel="noreferrer">
                  Book intro call
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) => (
  <div className="grid gap-2">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} type={type} placeholder={placeholder} maxLength={300} />
  </div>
);

export default DesignPartners;
