import { useState } from "react";
import { z } from "zod";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Github, Mail, MapPin, ExternalLink, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(2000),
});

const Contact = () => {
  const [sent, setSent] = useState(false);

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
    await new Promise((res) => setTimeout(res, 400));
    setSent(true);
  };

  return (
    <SiteLayout>
      <Seo
        title="Contact"
        description="Reach VantageMind AI. Book a 20-minute intro call or send a note. Based in Markham, Ontario."
        path="/contact"
      />

      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-narrow pt-24 pb-16 md:pt-36 md:pb-20">
          <Eyebrow>CONTACT</Eyebrow>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Let's talk.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            The fastest way to reach us is a 20-minute intro call. If async is better, the form
            on the right goes straight to the founder's inbox.
          </p>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-narrow grid gap-10 md:grid-cols-2">
          {/* Calendly */}
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <Eyebrow>BOOK A CALL</Eyebrow>
            <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
              20-minute intro call
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No prep needed. We'll talk about what you're building, what's painful, and whether
              Luciel fits.
            </p>
            <div className="mt-6 flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground">
              Calendly embed placeholder
            </div>
            <Button asChild className="mt-5 w-full" variant="ghost">
              <a href="https://calendly.com/aryan-vantagemind/intro" target="_blank" rel="noreferrer">
                Open Calendly <ExternalLink className="ml-1" size={14} />
              </a>
            </Button>

            <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={14} className="text-primary" />
                <a href="mailto:hello@vantagemind.ai" className="hover:text-foreground">
                  hello@vantagemind.ai
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={14} className="text-primary" />
                Markham, Ontario, Canada
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Github size={14} className="text-primary" />
                <a
                  href="https://github.com/aryanonline/luciel"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  github.com/aryanonline/luciel
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          {!sent ? (
            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8">
              <Eyebrow>SEND A NOTE</Eyebrow>
              <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
                Direct to the founder
              </h2>
              <div className="mt-6 grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" maxLength={100} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" maxLength={255} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={6} maxLength={2000} />
                </div>
                <Button type="submit" size="lg">
                  Send message
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-start justify-center rounded-xl border border-border bg-card p-8">
              <CheckCircle2 className="text-primary" size={28} />
              <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight">
                Message received.
              </h3>
              <p className="mt-3 text-muted-foreground">
                Thanks — we'll reply within two business days. For anything urgent, book a call
                via Calendly.
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
