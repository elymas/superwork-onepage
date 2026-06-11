import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { content, groupwareHref } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import { useWebGLSupported } from "../hooks/useWebGL";
import "./outro.css";

const { outro } = content;

// three.js only loads for devices that actually render the shader backdrop,
// keeping it out of the initial bundle (same lazy strategy as the Hero scene).
const ShaderAnimation = lazy(() =>
  import("../components/ShaderAnimation").then((m) => ({ default: m.ShaderAnimation }))
);

/** Render each sentence of the message on its own line. The curator provides the
 *  message as an array of sentences; tolerate a legacy single string too. */
function messageLines(message: string | string[]) {
  const sentences = Array.isArray(message) ? message : message.split(/(?<=\.)\s+/).filter(Boolean);
  return sentences.map((s, i) => (
    <span key={i} className="outro__message-line">
      {s}
    </span>
  ));
}

export function Outro() {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupported();
  // Shader only adds value when it can animate; skip the three.js download entirely
  // on reduced-motion or no-WebGL devices.
  const useShader = webgl && !reduced;
  // Split the title into words for a staggered mask-reveal.
  const words = outro.title.split(" ");
  const href = groupwareHref();

  return (
    <section id="outro" className="section outro">
      {useShader ? (
        <Suspense fallback={null}>
          <ShaderAnimation paused={false} />
        </Suspense>
      ) : null}
      <div className="outro__glow" aria-hidden />
      <div className="container outro__inner">
        <motion.span
          className="eyebrow outro__eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          함께 만드는 AX 문화
        </motion.span>

        <h2 className="outro__title">
          {words.map((word, i) => (
            <span className="outro__word-mask" key={i}>
              <motion.span
                className="outro__word"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>{" "}
            </span>
          ))}
        </h2>

        <motion.p
          className="outro__message"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {messageLines(outro.message)}
        </motion.p>

        <motion.div
          className="outro__cta-wrap"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          {href ? (
            <motion.a
              className={reduced ? "btn outro__cta" : "btn outro__cta outro__cta--pulse"}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={reduced ? undefined : { scale: 1.04 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              {outro.cta}
            </motion.a>
          ) : (
            // No verified URL yet — keep hover affordance but don't link to a placeholder.
            <motion.span
              className={reduced ? "btn outro__cta" : "btn outro__cta outro__cta--pulse"}
              role="button"
              aria-disabled="true"
              whileHover={reduced ? undefined : { scale: 1.04 }}
            >
              {outro.cta}
            </motion.span>
          )}
        </motion.div>

        <p className="outro__foot">superwork · KT나스미디어 사내 아이디어톤</p>
      </div>
    </section>
  );
}
