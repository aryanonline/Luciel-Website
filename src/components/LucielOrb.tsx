/**
 * Luciel orb — restrained brand mark.
 * Layered radial gradients with a slow breathing scale (6s, 1.0 → 1.04).
 * No particles, no grain, no hue drift, no typewriter. Honors prefers-reduced-motion.
 */
export const LucielOrb = ({ size = 420, echo = false }: { size?: number; echo?: boolean }) => {
  const opacity = echo ? 0.3 : 1;
  return (
    <div
      className="luciel-orb relative"
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      <div className="orb-halo absolute inset-[-20%] rounded-full" />
      <div className="orb-core absolute inset-0 rounded-full">
        <div className="orb-highlight absolute inset-0 rounded-full" />
      </div>
    </div>
  );
};
