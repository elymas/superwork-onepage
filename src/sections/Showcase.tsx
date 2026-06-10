import { content } from "../data/content";
import { SectionTitle } from "../components/SectionTitle";
import { AppCard, ComingSoonCard } from "../components/AppCard";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import "./showcase.css";

const { apps, showcase } = content;

export function Showcase() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="showcase" className="section showcase">
      <div className="container">
        <SectionTitle eyebrow="02 · 출시 앱" title={showcase.title} lead={showcase.lead} align="center" />

        <div className="showcase__grid">
          {apps.map((app) =>
            app.comingSoon ? (
              <ComingSoonCard key={app.id} app={app} reduced={reduced} />
            ) : (
              <AppCard key={app.id} app={app} reduced={reduced} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
