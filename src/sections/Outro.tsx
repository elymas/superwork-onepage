import { motion } from "motion/react";
import { content } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import "./outro.css";

const { outro } = content;

export function Outro() {
  const reduced = usePrefersReducedMotion();
  // Split the title into words for a staggered mask-reveal.
  const words = outro.title.split(" ");

  return (
    <section id="outro" className="section outro">
      <div className="outro__glow" aria-hidden />
      <div className="container outro__inner">
        <motion.span
          className="eyebrow"
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
          {outro.message}
        </motion.p>

        <motion.div
          className="outro__cta-wrap"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          <span className={reduced ? "btn outro__cta" : "btn outro__cta outro__cta--pulse"}>{outro.cta}</span>
        </motion.div>

        <p className="outro__foot">superwork · KT나스미디어 사내 아이디어톤</p>
      </div>
    </section>
  );
}
