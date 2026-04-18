import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CtaBlock = ({
  eyebrow = "GET STARTED",
  title = "Design partners wanted.",
  description = "We're selecting a small group of regulated-business teams to pilot Luciel in production. No cost. Honest feedback both ways.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) => (
  <section className="relative overflow-hidden">
    <div className="mesh-bg absolute inset-0 -z-10" aria-hidden="true" />
    <div className="container-narrow section">
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card/60 p-10 text-center backdrop-blur md:p-16">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/design-partners">Become a design partner</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to="/contact">Book intro call</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
