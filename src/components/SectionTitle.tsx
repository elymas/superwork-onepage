import { motion } from "motion/react";

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}

/** Shared heading block. Reveal is driven by whileInView so every section gets a
 *  consistent entrance; section-specific motion lives in each section component. */
export function SectionTitle({ eyebrow, title, lead, align = "left" }: Props) {
  return (
    <motion.div
      style={{ textAlign: align, maxWidth: align === "center" ? "760px" : undefined, marginInline: align === "center" ? "auto" : undefined }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {lead ? <p className="section-lead" style={{ marginInline: align === "center" ? "auto" : undefined }}>{lead}</p> : null}
    </motion.div>
  );
}
