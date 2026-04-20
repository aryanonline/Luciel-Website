/**
 * Tenant → Domain → Agent diagram with a subtle orb across all three.
 * Pure SVG, scales fluidly, no animation.
 */
export const ArchitectureDiagram = () => (
  <div className="rounded-xl border border-border bg-card p-6 md:p-10">
    <svg
      viewBox="0 0 720 220"
      role="img"
      aria-label="Architecture diagram showing tenant, domain, and agent layers connected by Luciel"
      className="h-auto w-full"
    >
      <defs>
        <radialGradient id="orbGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(263 100% 88%)" stopOpacity="0.9" />
          <stop offset="35%" stopColor="hsl(252 100% 68%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(232 70% 14%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(252 100% 68%)" stopOpacity="0.0" />
          <stop offset="50%" stopColor="hsl(252 100% 68%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(263 100% 79%)" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Background orb spanning the diagram */}
      <ellipse cx="360" cy="110" rx="320" ry="90" fill="url(#orbGrad)" opacity="0.55" />

      {/* Connecting line */}
      <line x1="120" y1="110" x2="600" y2="110" stroke="url(#lineGrad)" strokeWidth="1" />

      {/* Three nodes */}
      {[
        { x: 120, label: "Tenant", sub: "Firm" },
        { x: 360, label: "Domain", sub: "Vertical" },
        { x: 600, label: "Agent", sub: "Task" },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={110} r={42} fill="hsl(240 22% 9%)" stroke="hsl(240 22% 15%)" />
          <text
            x={n.x}
            y={106}
            textAnchor="middle"
            fontFamily="Instrument Serif, serif"
            fontSize="20"
            fill="hsl(240 14% 92%)"
          >
            {n.label}
          </text>
          <text
            x={n.x}
            y={126}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize="10"
            letterSpacing="2"
            fill="hsl(240 10% 60%)"
          >
            {n.sub.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
    <p className="mt-6 text-center text-sm text-muted-foreground">
      The business model is the architecture. Every new vertical makes the next one cheaper to launch.
    </p>
  </div>
);
