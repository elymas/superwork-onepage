import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Vanilla-three fullscreen fragment shader: the reference concentric-line
 *  animation, composited at reduced alpha as a soft Outro backdrop.
 *
 *  Vanilla three (not R3F) so it stays a single self-contained canvas that mounts
 *  only here — the hero owns the only R3F Canvas. Lazy-loaded from Outro so three
 *  stays out of the initial bundle. */
export function ShaderAnimation({ paused = false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;
    const mount: HTMLDivElement = mountEl;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: /* glsl */ `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      // Reference concentric-line shader (per spec). The loop body and color build
      // are used verbatim; only the final alpha is derived from luminance so the
      // bright lines composite softly over the light Outro and keep text AA. A full
      // opaque output would otherwise paint the section dark.
      fragmentShader: /* glsl */ `
        #define TWO_PI 6.2831853072
        #define PI 3.14159265359
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          float t = time*0.05;
          float lineWidth = 0.002;
          vec3 color = vec3(0.0);
          for(int j = 0; j < 3; j++){
            for(int i=0; i < 5; i++){
              color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            }
          }
          // Composite softly: alpha from line intensity, tinted toward the sky palette.
          float intensity = clamp((color.r + color.g + color.b) / 3.0, 0.0, 1.0);
          float alpha = intensity * 0.5;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    function resize() {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.resolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const start = performance.now();
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (pausedRef.current) return;
      uniforms.time.value = (now - start) / 1000;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="shader-bg" aria-hidden />;
}
