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
    <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-[52px]">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
    )}
  </div>
);

export const HairlineCard = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/40">
    {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
    <h3 className="font-display text-2xl tracking-tight text-foreground">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</p>
  </div>
);
