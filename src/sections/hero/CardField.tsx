import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TOTAL = 50;
const LAUNCHED = 7;
// Pastel launched palette: soft sky, near-white, pale lemon.
const SKY = new THREE.Color("#7fb8e6");
const WHITE = new THREE.Color("#ffffff");
const LEMON = new THREE.Color("#eef2a8");
const LAUNCHED_TONES = [SKY, WHITE, LEMON];
// Dim cards: cool light blue-grey so they stay visible on the off-white field.
const DIM = new THREE.Color("#c5d3e2");

interface CardSpec {
  position: THREE.Vector3;
  rotationSpeed: number;
  floatPhase: number;
  floatAmp: number;
  launched: boolean;
  baseColor: THREE.Color;
}

/** 50 floating cards = the 50 planned ideas; 7 glow = the launched apps.
 *  Instanced-free here (only 50 meshes) for per-card emissive control. */
function useCards(): CardSpec[] {
  return useMemo(() => {
    const cards: CardSpec[] = [];
    // Keep all cards on a SHALLOW near slab (z just behind the camera plane) so they
    // render large and uniform — deep cards were tiny/faint at the edges and left the
    // visible cluster bunched in the centre. x is matched to the frustum half-width at
    // this depth so the cards genuinely fill >half the width; y biased up so the field
    // sits above the message (message at ~43vh) without covering the copy.
    for (let i = 0; i < TOTAL; i++) {
      const launched = i < LAUNCHED;
      const z = -1 - Math.random() * 2.5; // distance ~7–8.5 from camera (z=6)
      // Frustum half-width grows with distance; spread x to ~95% of it at each card's
      // depth so the field reaches the screen edges.
      const dist = 6 - z;
      const halfW = dist * Math.tan((60 * Math.PI) / 180 / 2) * (16 / 9);
      const x = (Math.random() - 0.5) * 2 * halfW * 0.92;
      const y = 4.2 + Math.random() * 4;
      cards.push({
        position: new THREE.Vector3(x, y, z),
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: 0.15 + Math.random() * 0.35,
        launched,
        baseColor: launched ? LAUNCHED_TONES[i % LAUNCHED_TONES.length] : DIM,
      });
    }
    // Shuffle so the glowing cards aren't clustered at one depth.
    return cards.sort(() => Math.random() - 0.5);
  }, []);
}

function Card({ spec }: { spec: CardSpec }) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = spec.position.y;

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y += delta * spec.rotationSpeed;
    mesh.rotation.x += delta * spec.rotationSpeed * 0.4;
    mesh.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.6 + spec.floatPhase) * spec.floatAmp;
  });

  return (
    <mesh ref={ref} position={spec.position}>
      <boxGeometry args={[1.5, 2.05, 0.1]} />
      <meshStandardMaterial
        color={spec.baseColor}
        emissive={spec.baseColor}
        emissiveIntensity={spec.launched ? 0.55 : 0}
        metalness={0.1}
        roughness={0.55}
        transparent
        opacity={spec.launched ? 0.95 : 0.7}
      />
    </mesh>
  );
}

/** Group that tilts toward the pointer for a subtle parallax. */
export function CardField() {
  const cards = useCards();
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    // Ease the whole field toward the pointer-driven target tilt.
    const targetY = pointer.x * 0.35;
    const targetX = -pointer.y * 0.25;
    g.rotation.y += (targetY - g.rotation.y) * 0.05;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      {cards.map((spec, i) => (
        <Card key={i} spec={spec} />
      ))}
    </group>
  );
}
