import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Fades children in on scroll using IntersectionObserver.
 * Honors prefers-reduced-motion via .fade-init CSS rules.
 */
export const FadeIn = ({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // @ts-expect-error dynamic tag ref
  return <Tag ref={ref} className={`fade-init ${visible ? "fade-in" : ""} ${className}`}>{children}</Tag>;
};
