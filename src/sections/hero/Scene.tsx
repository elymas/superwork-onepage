import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CardField } from "./CardField";

/** Lazy-loaded entry point for everything that pulls in three.js, so devices on
 *  the CSS fallback path never download the 3D bundle. */
export default function Scene() {
  return (
    <Canvas
      className="hero__canvas"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 60 }}
    >
      <ambientLight intensity={0.95} />
      <pointLight position={[6, 6, 6]} intensity={1.1} color="#bfe0f5" />
      <pointLight position={[-6, -3, 2]} intensity={0.7} color="#f3f7c4" />
      <Suspense fallback={null}>
        <CardField />
      </Suspense>
    </Canvas>
  );
}
