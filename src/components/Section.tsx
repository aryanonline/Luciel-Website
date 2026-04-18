import { ReactNode } from "react";

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className="eyebrow">{children}</div>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) => (
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-[44px] md:leading-[1.05]">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
    )}
  </div>
);

export const FeatureCard = ({
  title,
  children,
  index,
}: {
  title: string;
  children: ReactNode;
  index?: number;
}) => (
  <div className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
    {typeof index === "number" && (
      <div className="mb-4 text-xs font-mono text-muted-foreground">
        {String(index).padStart(2, "0")}
      </div>
    )}
    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
  </div>
);
