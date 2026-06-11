import { content } from "../data/content";
import { SectionTitle } from "../components/SectionTitle";
import { AppCard, ComingSoonCard } from "../components/AppCard";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import "./showcase.css";

const { apps, showcase } = content;

/** Break the showcase title before "만든 앱" so it wraps onto a second line,
 *  derived from the data string rather than hardcoding the copy. */
function showcaseTitle(title: string) {
  const marker = "만든 앱";
  const i = title.lastIndexOf(marker);
  if (i <= 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <br />
      {title.slice(i)}
    </>
  );
}

export function Showcase() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="showcase" className="section showcase">
      <div className="container">
        <SectionTitle eyebrow="02 · 출시 앱" title={showcaseTitle(showcase.title)} lead={showcase.lead} align="center" />

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
