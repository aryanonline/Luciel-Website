import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/auth";
import { track } from "@/lib/analytics";

/**
 * ForgotPassword (Step 30a.3) -- POST a single field to
 * `/api/v1/auth/forgot-password`. The backend ALWAYS returns 200 with
 * a generic body regardless of whether the email maps to a real
 * account, so the page renders the same "if an account exists, we
 * sent a reset link" copy on submit success regardless of outcome.
 * No email enumeration is possible from this surface.
 *
 * The reset link the buyer receives lands on `/auth/set-password?token=...`
 * (the same page the signup welcome email lands on); the token class
 * is the only difference, and the route consumes both transparently.
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      track({ name: "forgot_password_submitted" });
    } catch {
      // The backend always-200's; a thrown error here is a network
      // failure. We still flip to the submitted view so the user
      // can't probe email existence by retrying on different inputs.
      track({ name: "forgot_password_network_error" });
    } finally {
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <Seo
        title="Reset your password — VantageMind AI"
        description="Request a password-reset link for your VantageMind AI account."
        path="/forgot-password"
        noIndex
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>RESET PASSWORD</Eyebrow>

          {!submitted ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Reset your password.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Enter the email on your VantageMind account. If we have a
                record of it, we'll send a reset link good for 24 hours.
              </p>

              <form onSubmit={onSubmit} className="mt-10 max-w-md space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send reset link"}
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/login">Back to sign in</Link>
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Check your email.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                If an account exists for{" "}
                <span className="text-foreground">{email}</span>, a reset
                link has been sent. Open the email and click the link to
                set a new password. The link is good for 24 hours.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild>
                  <Link to="/login">Back to sign in</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default ForgotPassword;
