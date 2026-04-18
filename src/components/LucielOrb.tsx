import { useEffect, useState } from "react";

/**
 * Animated Luciel orb.
 * Layered radial gradients + blur + orbiting particle ring.
 * Respects prefers-reduced-motion.
 */
export const LucielOrb = ({ size = 420, echo = false }: { size?: number; echo?: boolean }) => {
  const particles = Array.from({ length: 12 });
  const opacity = echo ? 0.35 : 1;

  return (
    <div
      className="luciel-orb relative"
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      {/* Outer halo */}
      <div className="orb-halo absolute inset-[-20%] rounded-full" />

      {/* Core orb */}
      <div className="orb-core absolute inset-0 rounded-full">
        <div className="orb-highlight absolute inset-0 rounded-full" />
        <div className="orb-grain absolute inset-0 rounded-full" />
      </div>

      {/* Orbiting particle ring */}
      {!echo && (
        <div className="absolute inset-0">
          {particles.map((_, i) => {
            const radius = 48 + (i % 3) * 6; // % of container
            const duration = 20 + (i % 4) * 5; // 20–35s
            const delay = -(i * (duration / particles.length));
            const reverse = i % 2 === 0;
            return (
              <div
                key={i}
                className="orb-particle absolute left-1/2 top-1/2"
                style={{
                  width: 4,
                  height: 4,
                  marginLeft: -2,
                  marginTop: -2,
                  animation: `orb-spin ${duration}s linear ${delay}s infinite ${reverse ? "" : "reverse"}`,
                  // @ts-expect-error CSS var
                  "--r": `${radius}%`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const phrases = [
  "The judgment layer for regulated AI.",
  "Auth, memory, consent — solved.",
  "Ship domain intelligence, not plumbing.",
  "Built for regulated industries.",
];

export const TypewriterRotator = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("typing");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(phrases[0]);
      return;
    }
    const current = phrases[idx];
    let t: number;
    if (phase === "typing") {
      if (text.length < current.length) {
        t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), 35);
      } else {
        t = window.setTimeout(() => setPhase("hold"), 1600);
      }
    } else if (phase === "hold") {
      t = window.setTimeout(() => setPhase("deleting"), 800);
    } else {
      if (text.length > 0) {
        t = window.setTimeout(() => setText(current.slice(0, text.length - 1)), 18);
      } else {
        setIdx((idx + 1) % phrases.length);
        setPhase("typing");
        return;
      }
    }
    return () => window.clearTimeout(t);
  }, [text, phase, idx]);

  return (
    <div className="font-display text-base font-medium tracking-tight text-foreground md:text-xl">
      <span>{text}</span>
      <span className="caret ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[-2px] bg-primary align-middle" />
    </div>
  );
};
