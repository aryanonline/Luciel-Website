import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthApiError, PASSWORD_MIN_LENGTH, setPassword } from "@/lib/auth";
import { track } from "@/lib/analytics";

/**
 * SetPassword (Step 30a.3) -- single page that handles BOTH the
 * welcome-email "set your password" link and the forgot-password
 * "reset your password" link. The backend route
 * `POST /api/v1/auth/set-password` consumes both token classes
 * (`set_password` and `reset_password`) transparently, so the only
 * thing this page cares about is whether a `?token=` is present.
 *
 * Surface contract from app/api/v1/auth.py:
 *   200 {ok, redirect}                       -> navigate to /dashboard
 *   422 {detail: {message, code: "password_too_short"}}
 *                                            -> inline form error
 *   401 {detail: "Invalid or expired link."} -> "link expired" view
 *   anything else                            -> generic error banner
 *
 * The route mints the `luciel_session` cookie itself, so on 200 the
 * buyer is already authenticated when we navigate.
 */
type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "expired" }
  | { kind: "error"; message: string };

const SetPasswordPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [password, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  // If there's no token in the URL at all, treat it as an expired/
  // broken link -- the welcome and reset emails always carry one.
  useEffect(() => {
    if (!token) setState({ kind: "expired" });
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === "submitting") return;
    setFieldError(null);

    if (password.length < PASSWORD_MIN_LENGTH) {
      setFieldError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setFieldError("Passwords do not match.");
      return;
    }

    setState({ kind: "submitting" });
    try {
      await setPassword(token, password);
      track({ name: "set_password_succeeded" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.code === "password_too_short") {
          setFieldError(err.message || `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
          setState({ kind: "idle" });
          track({ name: "set_password_failed", payload: { reason: "password_too_short" } });
          return;
        }
        if (err.code === "invalid_token") {
          track({ name: "set_password_failed", payload: { reason: "invalid_token" } });
          setState({ kind: "expired" });
          return;
        }
      }
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      track({ name: "set_password_failed", payload: { reason: message } });
      setState({ kind: "error", message });
    }
  };

  return (
    <SiteLayout>
      <Seo
        title="Set your password — VantageMind AI"
        description="Set the password for your VantageMind AI account."
        path="/auth/set-password"
        noIndex
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>SET PASSWORD</Eyebrow>

          {state.kind === "expired" ? (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                This link has expired.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Set-password and reset-password links are good for 24 hours.
                Request a fresh one and we'll send it to your inbox.
              </p>
              <div className="mt-10 flex gap-3">
                <Button asChild>
                  <Link to="/forgot-password">Request new link</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/login">Back to sign in</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Set your password.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Choose a password of at least {PASSWORD_MIN_LENGTH} characters.
                You'll use this every time you sign in to VantageMind AI.
              </p>

              <form onSubmit={onSubmit} className="mt-10 max-w-md space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={PASSWORD_MIN_LENGTH}
                    required
                    value={password}
                    onChange={(e) => setPw(e.target.value)}
                    disabled={state.kind === "submitting"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    minLength={PASSWORD_MIN_LENGTH}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={state.kind === "submitting"}
                  />
                </div>

                {fieldError && (
                  <div
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {fieldError}
                  </div>
                )}

                {state.kind === "error" && (
                  <div
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {state.message}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={state.kind === "submitting"}>
                    {state.kind === "submitting" ? "Setting password…" : "Set password and sign in"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default SetPasswordPage;
