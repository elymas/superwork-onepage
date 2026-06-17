import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { content } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import { useWebGLSupported } from "../hooks/useWebGL";
import { HeroFallback } from "./hero/HeroFallback";
import "./hero/hero.css";

const { hero } = content;

// three.js only loads for devices that actually render the 3D scene.
const Scene = lazy(() => import("./hero/Scene"));

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupported();
  const use3D = !reduced && webgl;

  const sectionRef = useRef<HTMLElement>(null);
  // Fade + scale the hero out as it scrolls away under the next section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {use3D ? (
        <Suspense fallback={<HeroFallback />}>
          <Scene />
        </Suspense>
      ) : (
        <HeroFallback />
      )}
      <div className="hero__scrim" />

      <motion.div className="hero__content" style={reduced ? undefined : { opacity, scale, y }}>
        <span className="hero__eyebrow">KT나스미디어 사내 아이디어톤</span>
        <h1 className="hero__title">
          Idea is <span className="hero__title-accent">All you need</span>
        </h1>
        <p className="hero__subtitle">{hero.subtitle}</p>

        {hero.stats.length > 0 ? (
          <div className="hero__stats">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <div className="hero__stat-value">{s.value}</div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="hero__scroll-cue" aria-hidden>
          SCROLL ↓
        </div>
      </motion.div>
    </section>
  );
}
