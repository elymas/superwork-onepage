import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { type AppItem, iconUrl } from "../data/content";

const MAX_TILT = 9; // degrees

interface Props {
  app: AppItem;
  reduced: boolean;
}

export function AppCard({ app, reduced }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Pointer-driven 3D tilt. Springs smooth the snap-back on leave.
  const rotX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const transform = useMotionTemplate`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  function onMove(e: React.PointerEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * MAX_TILT * 2);
    rotX.set(-py * MAX_TILT * 2);
  }

  function onLeave() {
    rotX.set(0);
    rotY.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      className="app-card"
      style={reduced ? undefined : { transform }}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="app-card__top">
        <img className="app-card__icon" src={iconUrl(app.icon)} alt={`${app.name} 아이콘`} width={72} height={72} loading="lazy" />
        <div>
          <h3 className="app-card__name">{app.name}</h3>
          <p className="app-card__tagline">{app.tagline}</p>
        </div>
      </div>

      {app.desc ? <p className="app-card__desc">{app.desc}</p> : null}

      <div className="app-card__footer">
        {app.verified ? (
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
