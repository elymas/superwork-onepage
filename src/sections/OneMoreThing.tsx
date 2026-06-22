import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { content, missionAsset, kakaoOpenChatHref } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/useReducedMotion";
import { SparklesCore } from "../components/SparklesCore";
import "./oneMoreThing.css";

const { oneMoreThing } = content;

const REVEAL = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// Continuous ring rotation speed (degrees per second).
const SPIN_DEG_PER_SEC = 9;
// How far the whole ring tilts toward the pointer.
const PARALLAX_TILT = 12; // degrees

// Mission-card pointer tilt — matched to the showcase AppCard so the two grids
// feel identical on hover.
const MAX_TILT = 9; // degrees
const HOVER_SCALE = 1.04;

type Shot = { src: string; alt: string };

/** A ring of app thumbnails rotating in a circle with a 3D perspective tilt that
 *  follows the pointer. The thumbnails are landscape store graphics (~7:3), so the
 *  holder is a wide rectangle and the image fills it without the heavy side-crop a
 *  portrait holder caused. The shared angle is advanced via a single rAF loop and
 *  written straight to each card's transform (no per-frame React re-render). When
 *  reduced motion is on, the spin and parallax drop and cards sit static + even. */
function Carousel({ reduced }: { reduced: boolean }) {
  const items = oneMoreThing.carousel;
  const count = items.length;
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const angle = useRef(0);

  // Pointer parallax on the whole ring. Springs smooth the snap-back on leave.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const ringTransform = useMotionTemplate`rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  function placeCards(base: number) {
    for (let i = 0; i < count; i += 1) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const theta = base + (i / count) * Math.PI * 2;
      el.style.transform = `rotateY(${(theta * 180) / Math.PI}deg) translateZ(var(--omt-radius)) rotateY(calc(${
        (-theta * 180) / Math.PI
      } * 1deg))`;
      // Cards on the far side dim + recede for depth.
      const depth = (Math.cos(theta) + 1) / 2; // 0 (back) → 1 (front)
      el.style.opacity = String(0.5 + depth * 0.5);
      el.style.zIndex = String(Math.round(depth * 100));
    }
  }

  useAnimationFrame((_t, delta) => {
    if (reduced) return;
    angle.current += (SPIN_DEG_PER_SEC * (Math.PI / 180) * delta) / 1000;
    placeCards(angle.current);
  });

  // Static even spread when reduced (rAF loop is skipped above).
  function setStaticRefs(el: HTMLLIElement | null, i: number) {
    cardRefs.current[i] = el;
    if (el && reduced) {
      const theta = (i / count) * Math.PI * 2;
      el.style.transform = `rotateY(${(theta * 180) / Math.PI}deg) translateZ(var(--omt-radius)) rotateY(${
        (-theta * 180) / Math.PI
      }deg)`;
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * PARALLAX_TILT);
    tiltX.set(-py * PARALLAX_TILT);
  }

  function onPointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <div
      className={`omt-carousel${reduced ? " omt-carousel--static" : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="omt-carousel__stage">
        <motion.ul
          className="omt-carousel__ring"
          style={reduced ? undefined : { transform: ringTransform }}
          aria-label="출시 앱 미리보기"
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className="omt-card"
              ref={(el) => setStaticRefs(el, i)}
            >
              <img
                className="omt-card__img"
                src={missionAsset(item.thumb)}
                alt={`${item.name} 앱 화면`}
                width={232}
                height={100}
                loading="lazy"
                draggable={false}
              />
              <span className="omt-card__name">{item.name}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/** Single mission card. Pointer tilt + hover lift mirror the showcase AppCard.
 *  Cert screenshots are buttons that open the shared lightbox. The aggregate
 *  "앱인토스 전체 앱" mission (thumb null + featured) renders as a full-width banner. */
function MissionCard({
  mission,
  reduced,
  onOpenShot,
}: {
  mission: (typeof oneMoreThing.missions)[number];
  reduced: boolean;
  onOpenShot: (shot: Shot) => void;
}) {
  const featured = mission.featured === true;
  const ref = useRef<HTMLLIElement>(null);

  const rotX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const scale = useSpring(useMotionValue(1), { stiffness: 260, damping: 22 });
  const transform = useMotionTemplate`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;

  function onMove(e: React.PointerEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * MAX_TILT * 2);
    rotX.set(-py * MAX_TILT * 2);
  }

  function onEnter() {
    if (!reduced) scale.set(HOVER_SCALE);
  }

  function onLeave() {
    rotX.set(0);
    rotY.set(0);
    scale.set(1);
  }

  return (
    <motion.li
      ref={ref}
      className={`omt-mission${featured ? " omt-mission--featured" : ""}`}
      style={reduced ? undefined : { transform }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      {...REVEAL}
    >
      <div className="omt-mission__head">
        {mission.thumb ? (
          <img
            className="omt-mission__thumb"
            src={missionAsset(mission.thumb)}
            alt={`${mission.name} 아이콘`}
            width={56}
            height={56}
            loading="lazy"
          />
        ) : (
          <span className="omt-mission__glyph" aria-hidden="true">
            toss
          </span>
        )}
        <div className="omt-mission__titles">
          <h3 className="omt-mission__name">{mission.name}</h3>
          <div className="omt-mission__meta">
            <span className="omt-mission__prize">{mission.prize}</span>
            <span className="omt-mission__rank">{mission.rank}</span>
          </div>
        </div>
      </div>

      <div className="omt-mission__body">
        <p className="omt-mission__goal">{mission.goal}</p>

        <div className="omt-mission__verify">
          <span className="omt-mission__verify-label">인증 방법</span>
          <p className="omt-mission__verify-text">{mission.verify}</p>
        </div>

        {mission.note ? <p className="omt-mission__note">{mission.note}</p> : null}
      </div>

      {mission.certImages.length > 0 ? (
        <div className="omt-mission__certs">
          {mission.certImages.map((file, i) => (
            <button
              key={file}
              type="button"
              className="omt-mission__cert-btn"
              onClick={() =>
                onOpenShot({
                  src: missionAsset(file),
                  alt: `${mission.name} 인증 예시 ${i + 1}`,
                })
              }
              aria-label={`${mission.name} 인증 예시 ${i + 1} 크게 보기`}
            >
              <img
                className="omt-mission__cert"
                src={missionAsset(file)}
                alt={`${mission.name} 인증 예시 ${i + 1}`}
                loading="lazy"
              />
              <span className="omt-mission__cert-zoom" aria-hidden="true">
                ⤢
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </motion.li>
  );
}

export function OneMoreThing() {
  const reduced = usePrefersReducedMotion();

  // One shared lightbox for every cert screenshot. A plain fixed overlay (not a
  // native <dialog>) — the page's `body { overflow-x: hidden }` made the dialog
  // top-layer backdrop paint partially, and the section is the last on the page so
  // users always open it while scrolled. A fixed div is viewport-reliable; Esc is
  // wired by hand below.
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    if (!shot) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShot(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shot]);

  return (
    <section id="one-more-thing" className="section one-more-thing">
      <div className="container">
        <div className="omt-keymsg-wrap">
          {!reduced ? (
            <SparklesCore
              className="omt-sparkles"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              speed={1.2}
              particleDensity={150}
              particleColor="#5a9bd0"
            />
          ) : null}
          <motion.p className="omt-keymsg" {...REVEAL}>
            {oneMoreThing.eyebrow}
          </motion.p>
        </div>

        <Carousel reduced={reduced} />

        <motion.div className="omt-intro" {...REVEAL}>
          <h2 className="omt-title">{oneMoreThing.title}</h2>
          <p className="omt-lead">{oneMoreThing.lead}</p>

          <motion.button
            type="button"
            className="omt-cta"
            onClick={() => {
              const href = kakaoOpenChatHref();
              if (href) window.open(href, "_blank", "noopener");
              else window.alert("준비중입니다~");
            }}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            {oneMoreThing.ctaText}
          </motion.button>

          <div className="omt-notes">
            <p className="omt-note omt-note--reward">{oneMoreThing.rewardNote}</p>
            <p className="omt-note">{oneMoreThing.applyNote}</p>
          </div>
        </motion.div>

        <ul className="omt-missions">
          {oneMoreThing.missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              reduced={reduced}
              onOpenShot={setShot}
            />
          ))}
        </ul>
      </div>

      {/* Cert screenshot lightbox — backdrop click or Esc closes. Portaled to
          <html> so the page's body-level scroll container (body { overflow-x:
          hidden } turns body into a scroller) can't clip the fixed overlay. */}
      {shot
        ? createPortal(
            <div
              className="omt-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={shot.alt}
              onClick={() => setShot(null)}
            >
              <div
                className="omt-lightbox__inner"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="omt-lightbox__close"
                  onClick={() => setShot(null)}
                  aria-label="닫기"
                  autoFocus
                >
                  ×
                </button>
                <img className="omt-lightbox__img" src={shot.src} alt={shot.alt} />
              </div>
            </div>,
            document.documentElement
          )
        : null}
    </section>
  );
}
