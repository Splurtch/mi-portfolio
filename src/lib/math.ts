export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where `v` sits between `a` and `b`, clamped to 0–1. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInQuad = (t: number) => t * t;

/**
 * Scroll progress through a tall section whose child is `position: sticky`.
 * 0 when the section's top meets the viewport top, 1 when the sticky child
 * is about to unpin.
 */
export function pinProgress(el: HTMLElement): { p: number; rect: DOMRect; vh: number } {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const span = Math.max(1, rect.height - vh);
  return { p: clamp(-rect.top / span), rect, vh };
}

/**
 * Calcula el progreso continuo `p` (0..1) y la visibilidad (`vis`: 0..1) de una escena
 * fijada en pantalla a partir de su marcador invisible en la pista de scroll (`#despertar`, etc.).
 * Permite que las escenas se fundan en el mismo espacio de cámara (sin que la página suba/baje)
 * desde el principio (0%) hasta el final (100%).
 */
export function sceneProgress(
  anchorEl: HTMLElement | null,
  options?: { isFirst?: boolean; isLast?: boolean },
): {
  p: number;
  vis: number;
  enter: number;
  exit: number;
  active: boolean;
} {
  if (!anchorEl) {
    return { p: 0, vis: 0, enter: 0, exit: 0, active: false };
  }
  const rect = anchorEl.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const height = Math.max(1, rect.height);

  // `raw` va de 0 cuando el borde superior del marcador entra en el top (rect.top = 0)
  // hasta 1 cuando el borde inferior del marcador llega al top (rect.bottom = 0),
  // o para la última sección cuando rect.bottom llega a vh.
  const span = options?.isLast ? Math.max(1, height - vh) : height;
  const raw = -rect.top / span;

  // Ventana extendida para solapar suavemente la salida de la escena N con la entrada de la N+1
  const fadeZone = 0.08;
  if (raw < -fadeZone || (!options?.isLast && raw > 1 + fadeZone)) {
    return { p: clamp(raw, 0, 1), vis: 0, enter: 0, exit: 1, active: false };
  }

  const p = clamp(raw, 0, 1);
  const enter = options?.isFirst ? 1 : smoothstep(range(raw, -fadeZone, 0.02));
  const exit = options?.isLast ? 0 : smoothstep(range(raw, 1 - fadeZone, 1.02));
  const vis = clamp(enter * (1 - exit), 0, 1);

  return {
    p,
    vis,
    enter,
    exit,
    active: vis > 0.015,
  };
}
