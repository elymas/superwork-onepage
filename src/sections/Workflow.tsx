import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { content } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import "./workflow.css";

const { workflow } = content;

export function Workflow() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Sticky horizontal scroll-hijack: the panel row translates left as the tall
  // outer track scrolls past. Disabled (vertical stack) for reduced motion.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // 4 panels + intro card => move across ~78% of the row width.
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);

  if (reduced) {
    return (
      <section id="workflow" className="section workflow workflow--static">
        <div className="container">
          <WorkflowHeader />
          <div className="workflow__static-grid">
            {workflow.steps.map((s, i) => (
              <WorkflowPanel key={s.name} index={i} name={s.name} desc={s.desc} />
            ))}
          </div>
          <WorkflowHighlights />
        </div>
      </section>
    );
  }

  return (
    <section id="workflow" className="workflow">
      {/* Tall track creates the scroll distance the horizontal motion consumes. */}
      <div className="workflow__track" ref={trackRef}>
        <div className="workflow__sticky">
          <div className="container workflow__header-wrap">
            <WorkflowHeader />
          </div>
          <motion.div className="workflow__row" style={{ x }}>
            <div className="workflow__intro-card">
              <span className="workflow__concept">{workflow.concept}</span>
              <WorkflowHighlights inline />
            </div>
            {workflow.steps.map((s, i) => (
              <WorkflowPanel key={s.name} index={i} name={s.name} desc={s.desc} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WorkflowHeader() {
  return (
    <div className="workflow__header">
      <span className="eyebrow">superwork workflow</span>
      <h2 className="section-title">{workflow.title}</h2>
      <p className="section-lead">{workflow.tagline}</p>
      <a className="workflow__link" href={workflow.link} target="_blank" rel="noreferrer">
        워크플로우 자세히 보기 ↗
      </a>
    </div>
  );
}

function WorkflowPanel({ index, name, desc }: { index: number; name: string; desc: string }) {
  return (
    <article className="workflow__panel">
      <span className="workflow__panel-index">0{index + 1}</span>
      <h3 className="workflow__panel-title">{name}</h3>
      <p className="workflow__panel-desc">{desc}</p>
    </article>
  );
}

function WorkflowHighlights({ inline = false }: { inline?: boolean }) {
  return (
    <div className={inline ? "workflow__highlights workflow__highlights--inline" : "workflow__highlights"}>
      {workflow.highlights.map((h) => (
        <div key={h.name} className="workflow__highlight">
          <code className="workflow__highlight-name">{h.name}</code>
          <p className="workflow__highlight-desc">{h.desc}</p>
        </div>
      ))}
    </div>
  );
}
