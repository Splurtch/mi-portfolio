import Lenis from '@studio-freight/lenis';

/**
 * Un único bucle requestAnimationFrame para toda la página (inspirado en Selene).
 * Lenis avanza primero y cada componente scrollytelling lee su propio rect
 * y escribe estilos directamente en el DOM/Canvas sin pasar por el estado de React.
 */

export interface ScrollState {
  time: number;
  y: number;
  vh: number;
}

type Tick = (time: number) => void;
type ScrollTick = (state: ScrollState) => void;

const subscribers = new Set<Tick>();
const scrollSubscribers = new Set<ScrollTick>();
let lenis: Lenis | null = null;

export function startScroll(reducedMotion: boolean): () => void {
  if (!reducedMotion) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
  }

  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    const state: ScrollState = {
      time,
      y: window.scrollY || window.pageYOffset || 0,
      vh: window.innerHeight || 1,
    };
    subscribers.forEach((fn) => fn(time));
    scrollSubscribers.forEach((fn) => fn(state));
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function onFrame(fn: Tick): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function onScroll(fn: ScrollTick): () => void {
  scrollSubscribers.add(fn);
  return () => {
    scrollSubscribers.delete(fn);
  };
}

/** Pause Lenis while a modal owns input; Radix handles native scroll locking. */
export function setScrollPaused(paused: boolean) {
  if (paused) lenis?.stop();
  else lenis?.start();
}

export function scrollToPosition(top: number) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.2, immediate: reducedMotion });
  } else {
    window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
}

export function scrollToHash(hash: string) {
  const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
  history.replaceState(null, '', hash === '#top' ? ' ' : hash);
}
