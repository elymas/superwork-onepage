import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TOTAL = 50;
const LAUNCHED = 7;
const ACCENT = new THREE.Color("#4d7cff");
const LIME = new THREE.Color("#c6ff4d");
const DIM = new THREE.Color("#2a3050");

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
    // Spread cards through a slab of space in front of the camera.
    for (let i = 0; i < TOTAL; i++) {
      const launched = i < LAUNCHED;
      const radius = 2 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius * (0.7 + Math.random() * 0.6);
      const y = (Math.random() - 0.5) * 8;
      const z = -2 - Math.random() * 9;
      cards.push({
        position: new THREE.Vector3(x, y, z),
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: 0.15 + Math.random() * 0.35,
        launched,
        baseColor: launched ? (Math.random() > 0.5 ? ACCENT : LIME) : DIM,
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
      <boxGeometry args={[0.9, 1.25, 0.06]} />
      <meshStandardMaterial
        color={spec.baseColor}
        emissive={spec.baseColor}
        emissiveIntensity={spec.launched ? 1.4 : 0.05}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={spec.launched ? 0.95 : 0.55}
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
