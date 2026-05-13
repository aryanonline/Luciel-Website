import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const Onboarding = () => {
  const [params] = useSearchParams();
  // Preserved in component state for Step 30a's Stripe success_url handler.
  const [sessionId] = useState<string | null>(params.get("session_id"));

  useEffect(() => {
    track({ name: "onboarding_started", payload: { session_id: sessionId } });
  }, [sessionId]);

  return (
    <SiteLayout>
      <Seo
        title="Welcome — VantageMind AI"
        description="Your Luciel deployment is being prepared. We will guide you through choosing the deployment shape that fits your organization."
        path="/onboarding"
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <Eyebrow>WELCOME</Eyebrow>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Your Luciel deployment is being prepared.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We'll guide you through choosing your deployment shape — company-wide,
            department-by-department, or per-professional. Hold tight; this flow lands with our
            next release.
          </p>
          {sessionId && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
              <span className="eyebrow">Session</span>
              <code className="font-mono text-xs text-muted-foreground">{sessionId}</code>
            </div>
          )}
          <div className="mt-10 flex gap-3">
            <Button asChild variant="ghost"><Link to="/account">Go to account</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Onboarding;
