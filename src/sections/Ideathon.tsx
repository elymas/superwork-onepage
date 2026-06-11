import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { content } from "../data/content";
import { SectionTitle } from "../components/SectionTitle";
import "./ideathon.css";

const { ideathon } = content;

export function Ideathon() {
  const timelineRef = useRef<HTMLDivElement>(null);
  // The connecting line fills top→bottom as the timeline scrolls through view.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 60%"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="ideathon" className="section ideathon">
      <div className="container">
        <SectionTitle eyebrow="01 · 아이디어톤" title={ideathon.title} lead={ideathon.tagline} />

        <div className="ideathon__period">
          <span className="ideathon__period-dot" />
          진행 기간 {ideathon.period}
          <span className="ideathon__period-range">{ideathon.periodRange}</span>
        </div>

        <div className="ideathon__timeline" ref={timelineRef}>
          <div className="ideathon__rail" aria-hidden>
            <motion.div className="ideathon__rail-fill" style={{ scaleY: lineScaleY }} />
          </div>

          <ol className="ideathon__steps">
            {ideathon.process.map((step, i) => (
              <motion.li
                key={step.step}
                className="ideathon__step"
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="ideathon__step-no">{step.step}</span>
                <div className="ideathon__step-body">
                  <h3 className="ideathon__step-title">{step.name}</h3>
                  <p className="ideathon__step-desc">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="ideathon__grid">
          <motion.div
            className="ideathon__panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="ideathon__panel-title">참가자 혜택</h4>
            <ul className="ideathon__benefits">
              {ideathon.benefits.map((b, i) => {
                // Last entry = grand prize → highlight card with a soft pulse.
                const isWinner = i === ideathon.benefits.length - 1;
                return (
                  <motion.li
                    key={b.target}
                    className={isWinner ? "ideathon__benefit ideathon__benefit--winner" : "ideathon__benefit"}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="ideathon__benefit-target">{b.target}</span>
                    <strong className="ideathon__benefit-amount">{b.amount}</strong>
                    {b.note ? <span className="ideathon__benefit-note">{b.note}</span> : null}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            className="ideathon__panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <h4 className="ideathon__panel-title">{ideathon.howTo.title}</h4>
            <div className="ideathon__method">{ideathon.howTo.method}</div>
            <ul className="ideathon__fields">
              {ideathon.howTo.items.map((item, i) => (
                <motion.li
                  key={item}
                  className="ideathon__field"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="ideathon__field-no">{i + 1}</span>
                  <span className="ideathon__field-label">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="ideathon__selection"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="ideathon__panel-title">{ideathon.selection.title}</h4>
          <div className="ideathon__selection-rounds">
            <div>
              <span className="ideathon__judging-label">1차 · 아이디어</span>
              <p>{ideathon.selection.round1}</p>
            </div>
            <div>
              <span className="ideathon__judging-label">2차 · 앱 개발 대상</span>
              <p>{ideathon.selection.round2}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="ideathon__criteria"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="ideathon__panel-title">{ideathon.criteria.title}</h4>
          <div className="ideathon__criteria-grid">
            {ideathon.criteria.items.map((c) => (
              <div key={c.name} className="ideathon__criterion">
                <span className="ideathon__criterion-weight">{c.weight}</span>
                <h5 className="ideathon__criterion-name">{c.name}</h5>
                <p className="ideathon__criterion-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
