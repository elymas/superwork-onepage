import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "motion/react";

type SparklesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

/** tsParticles sparkle field (ported from the Aceternity SparklesCore reference to
 *  our stack: framer-motion → motion/react, no tailwind/cn, trimmed to the options
 *  that actually drive the effect). Fades in once the engine reports loaded. */
export function SparklesCore(props: SparklesProps) {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } });
    }
  };

  const options: ISourceOptions = {
    background: { color: { value: background || "transparent" } },
    fullScreen: { enable: false },
    fpsLimit: 120,
    detectRetina: true,
    particles: {
      color: { value: particleColor || "#ffffff" },
      move: {
        enable: true,
        direction: "none",
        straight: false,
        speed: { min: 0.1, max: 1 },
        outModes: { default: "out" },
      },
      number: {
        density: { enable: true, width: 400, height: 400 },
        value: particleDensity || 120,
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: speed || 4,
          sync: false,
          startValue: "random",
        },
      },
      shape: { type: "circle" },
      size: { value: { min: minSize || 1, max: maxSize || 3 } },
    },
  };

  return (
    <motion.div animate={controls} initial={{ opacity: 0 }} className={className}>
      {init && (
        <Particles
          id={id || generatedId}
          options={options}
          particlesLoaded={particlesLoaded}
        />
      )}
    </motion.div>
  );
}
