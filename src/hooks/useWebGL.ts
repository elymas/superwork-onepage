import { useState } from "react";

function detectWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/** WebGL support, detected synchronously on first render so the 3D chunk is
 *  never imported on devices that will fall back. */
export function useWebGLSupported(): boolean {
  const [supported] = useState(detectWebGL);
  return supported;
}
