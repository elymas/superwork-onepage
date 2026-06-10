import { useEffect, useState } from "react";

function query(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when the user requests reduced motion. Resolved synchronously on first
 *  render (so the 3D chunk isn't imported), then kept in sync with the media query. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(query);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
