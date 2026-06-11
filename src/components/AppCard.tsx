import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { type AppItem, iconUrl, groupwareHref } from "../data/content";

const MAX_TILT = 9; // degrees
const HOVER_SCALE = 1.04;

interface Props {
  app: AppItem;
  reduced: boolean;
}

export function AppCard({ app, reduced }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Pointer-driven 3D tilt + lift on hover. Springs smooth the snap-back on leave.
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
    setHovered(true);
    if (!reduced) scale.set(HOVER_SCALE);
  }

  function onLeave() {
    rotX.set(0);
    rotY.set(0);
    scale.set(1);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      className="app-card"
      style={reduced ? undefined : { transform }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="app-card__top">
        {app.icon ? (
          <img className="app-card__icon" src={iconUrl(app.icon)} alt={`${app.name} 아이콘`} width={72} height={72} loading="lazy" />
        ) : null}
        <div>
          <h3 className="app-card__name">{app.name}</h3>
          <p className="app-card__tagline">{app.tagline}</p>
        </div>
      </div>

      {app.desc ? <p className="app-card__desc">{app.desc}</p> : null}

      <div className="app-card__footer">
        {app.verified && app.url ? (
          <a className="app-card__qr" href={app.url} target="_blank" rel="noreferrer" aria-label={`${app.name} 열기`}>
            <span className="app-card__qr-frame">
              <QRCodeSVG value={app.url} size={96} bgColor="#ffffff" fgColor="#06070d" level="M" marginSize={2} />
            </span>
            <span className="app-card__qr-label">{hovered ? "탭하여 열기 →" : "QR 스캔"}</span>
          </a>
        ) : (
          <div className="app-card__pending" role="status">
            <span className="app-card__pending-dot" />
            링크 준비 중
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** The 8th "next lineup" slot — invites an idea submission instead of showing a QR.
 *  The CTA links to the groupware board when a verified URL exists; until then it
 *  stays a hover-only badge (no broken placeholder link on a printed/scanned page).
 *  Dispatched from Showcase (not via an early return in AppCard) to keep both
 *  components' hooks unconditional. */
export function ComingSoonCard({ app, reduced }: Props) {
  const href = groupwareHref();
  const label = app.cta ?? "지금 아이디어 제출하기";

  return (
    <motion.div
      className="app-card app-card--soon"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="app-card__top">
        <span className={reduced ? "app-card__soon-plus" : "app-card__soon-plus app-card__soon-plus--pulse"} aria-hidden>
          +
        </span>
        <div>
          <h3 className="app-card__name">{app.name}</h3>
          <p className="app-card__tagline app-card__tagline--soon">{app.tagline}</p>
        </div>
      </div>

      {app.desc ? <p className="app-card__desc">{app.desc}</p> : null}

      <div className="app-card__footer">
        {href ? (
          <motion.a
            className="app-card__soon-cta"
            href={href}
            target="_blank"
            rel="noreferrer"
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            {label}
          </motion.a>
        ) : (
          <motion.span
            className="app-card__soon-cta"
            role="button"
            aria-disabled="true"
            whileHover={reduced ? undefined : { scale: 1.05 }}
          >
            {label}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
