import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { isEmail, submitDemoRequest } from "@/lib/submissions";

type Tier = "individual" | "team" | "company" | "unspecified";

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const CALENDLY_URL = env.VITE_CALENDLY_URL;

const Contact = () => {
  const [params] = useSearchParams();
  const tierParam = params.get("tier");
  const initialTier: Tier = (["individual", "team", "company"] as const).includes(
    tierParam as "individual" | "team" | "company",
  )
    ? (tierParam as Tier)
    : "unspecified";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tier, setTier] = useState<Tier>(initialTier);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { setTier(initialTier); }, [initialTier]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !message.trim()) {
      toast.error("Name, company, and message are required.");
      return;
    }
    if (!isEmail(email)) {
      toast.error("Enter a valid email.");
      return;
    }
    setSubmitting(true);
    const ok = await submitDemoRequest({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      role: role.trim() || undefined,
      tier,
      message: message.trim(),
      source_page: "/contact",
    });
    setSubmitting(false);
    if (ok) {
      setDone(true);
      toast.success("Thank you. We'll be in touch within one business day.");
    } else {
      toast.error("Something didn't go through. Try again or email hello@vantagemind.ai.");
    }
  };

  return (
    <SiteLayout>
      <Seo
        title="Contact — VantageMind AI"
        description="Book a demo of Luciel, or reach our team directly. Calm, scoped, accountable AI for Canadian businesses."
        path="/contact"
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-16 md:pt-40 md:pb-24">
          <Eyebrow>CONTACT</Eyebrow>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Book a demo.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Thirty minutes, scoped to the work you would actually want Luciel to do.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-narrow py-16 md:py-24">
          <p className="text-sm text-muted-foreground">
            Or email us directly at{" "}
            <a href="mailto:hello@vantagemind.ai" className="text-primary hover:text-primary/80">
              hello@vantagemind.ai
            </a>.
          </p>

          {done ? (
            <div className="mt-8 max-w-xl rounded-xl border border-border bg-card p-8">
              <div className="eyebrow text-primary">Received</div>
              <p className="mt-4 text-base text-foreground">
                Thank you. We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-email">Work email</Label>
                  <Input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-company">Company</Label>
                  <Input id="c-company" required value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-role">Role <span className="text-muted-foreground">(optional)</span></Label>
                  <Input id="c-role" value={role} onChange={(e) => setRole(e.target.value)} autoComplete="organization-title" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-tier">Tier of interest</Label>
                <Select value={tier} onValueChange={(v) => setTier(v as Tier)}>
                  <SelectTrigger id="c-tier"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="unspecified">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-message">What would you want Luciel to do?</Label>
                <Textarea id="c-message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Book a demo"}
                </Button>
              </div>
            </form>
          )}

          {CALENDLY_URL && (
            <div className="mt-16">
              <Eyebrow>Or pick a time</Eyebrow>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <iframe
                  src={CALENDLY_URL}
                  title="Schedule a demo"
                  className="h-[680px] w-full"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
