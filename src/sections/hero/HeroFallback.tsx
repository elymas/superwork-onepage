import "./hero.css";

/** Static gradient + CSS-animated card grid shown when WebGL is unavailable
 *  or the user prefers reduced motion. Mirrors the "50 planned, 7 launched" idea. */
export function HeroFallback() {
  const cells = Array.from({ length: 50 }, (_, i) => i < 7);
  return (
    <div className="hero-fallback" aria-hidden>
      <div className="hero-fallback__glow" />
      <div className="hero-fallback__grid">
        {cells.map((launched, i) => (
          <span key={i} className={launched ? "hero-fallback__cell is-launched" : "hero-fallback__cell"} />
        ))}
      </div>
    </div>
  );
}
