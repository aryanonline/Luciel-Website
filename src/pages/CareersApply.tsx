import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
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
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { roles } from "./Careers";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  linkedin: z.string().trim().url("Must be a valid URL").max(300).or(z.literal("")),
  github: z.string().trim().url("Must be a valid URL").max(300).or(z.literal("")),
  role: z.string().min(1, "Pick a role"),
  why: z.string().trim().min(20, "Tell us a bit more").max(2000),
  resume: z.string().trim().url("Resume must be a URL").max(500),
});

const CareersApply = () => {
  const [params] = useSearchParams();
  const initialRole = params.get("role") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const r = schema.safeParse(data);
    if (!r.success) {
      toast({
        title: "Please check the form",
        description: r.error.issues[0]?.message ?? "Some fields are missing.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    // TODO: backend — wire to applications endpoint
    await new Promise((res) => setTimeout(res, 600));
    setSubmitting(false);
    setSubmitted(true);
  };

  const currentRole = roles.find((r) => r.slug === initialRole);

  return (
    <SiteLayout>
      <Seo
        title={`Apply${currentRole ? ` · ${currentRole.title}` : ""}`}
        description="Apply to join VantageMind AI. Build the judgment layer for regulated AI."
        path="/careers/apply"
      />

      <section className="container-narrow pt-24 pb-16 md:pt-36">
        <Link to="/careers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to careers
        </Link>
        <Eyebrow>APPLICATION</Eyebrow>
        <h1 className="font-display mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          {currentRole ? `Apply: ${currentRole.title}` : "General application"}
        </h1>
        {currentRole && (
          <p className="mt-4 text-muted-foreground">
            {currentRole.location} · {currentRole.type}
          </p>
        )}
      </section>

      <section className="container-narrow pb-24 md:pb-32">
        {!submitted ? (
          <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" maxLength={100} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" maxLength={255} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/…" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" name="github" type="url" placeholder="https://github.com/…" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={initialRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.slug} value={r.slug}>{r.title}</SelectItem>
                    ))}
                    <SelectItem value="general">General application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="why">Why VantageMind?</Label>
                <Textarea id="why" name="why" rows={5} maxLength={2000} placeholder="Be specific. What draws you to regulated AI infrastructure?" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resume">Resume URL</Label>
                <Input id="resume" name="resume" type="url" placeholder="Link to PDF, Notion, personal site, etc." />
              </div>
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
              <p className="text-xs text-muted-foreground">
                By applying, you agree to be contacted by VantageMind AI about this role.
              </p>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8">
            <CheckCircle2 className="text-primary" size={28} />
            <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight">
              Application received.
            </h3>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Thanks — we read every application and will reply within five business days.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/careers">Back to roles</Link>
            </Button>
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default CareersApply;
