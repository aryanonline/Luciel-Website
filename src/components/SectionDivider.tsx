/**
 * Hairline divider with a small static orb motif at center.
 * Used between sections for visual continuity.
 */
export const SectionDivider = () => (
  <div className="container-narrow" aria-hidden="true">
    <div className="relative flex h-px items-center justify-center bg-border">
      <div className="absolute h-2 w-2 rounded-full bg-background ring-1 ring-border">
        <div
          className="absolute inset-[2px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, hsl(var(--accent-to)), hsl(var(--accent-from)) 70%)",
          }}
        />
      </div>
    </div>
  </div>
);
