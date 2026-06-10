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
                  <div className="ideathon__step-head">
                    <h3 className="ideathon__step-title">{step.name}</h3>
                    <span className="ideathon__step-duration">{step.duration}</span>
                  </div>
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
            <h4 className="ideathon__panel-title">보상</h4>
            <ul className="ideathon__rewards">
              {ideathon.rewards.map((r) => (
                <li key={r.target}>
                  <span className="ideathon__reward-target">{r.target}</span>
                  <span className="ideathon__reward-prize">{r.prize}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="ideathon__panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <h4 className="ideathon__panel-title">제출 항목</h4>
            <div className="ideathon__method">{ideathon.howTo.method}</div>
            <div className="ideathon__chips">
              {ideathon.howTo.items.map((item) => (
                <span key={item} className="ideathon__chip">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="ideathon__judging"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="ideathon__judging-label">1차 · 아이디어</span>
            <p>{ideathon.judging.round1}</p>
          </div>
          <div>
            <span className="ideathon__judging-label">2차 · 프로토타입</span>
            <p>{ideathon.judging.round2}</p>
          </div>
          <div>
            <span className="ideathon__judging-label">결과</span>
            <p>{ideathon.judging.outcome}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
