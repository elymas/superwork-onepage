import { content } from "../data/content";
import { SectionTitle } from "../components/SectionTitle";
import { AppCard } from "../components/AppCard";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import "./showcase.css";

const { apps } = content;
const launchedCount = apps.filter((a) => a.verified).length;

export function Showcase() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="showcase" className="section showcase">
      <div className="container">
        <SectionTitle
          eyebrow="02 · 출시 앱"
          title={`아이디어톤이 만든 ${launchedCount}개의 앱`}
          lead="QR을 스캔하거나 카드를 눌러 직접 사용해 보세요."
          align="center"
        />

        <div className="showcase__grid">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}
