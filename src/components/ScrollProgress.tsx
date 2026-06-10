import { motion, useScroll, useSpring } from "motion/react";

/** Thin accent bar pinned to the top, tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: "0% 50%",
        scaleX,
        background: "linear-gradient(90deg, var(--accent), var(--accent-deep))",
        zIndex: 100,
      }}
    />
  );
}
