import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { onFrame } from '@/lib/scroll';
import { PortraitEngine } from '@/lib/portrait/engine';
import { CanvasPortraitEngine } from '@/lib/portrait/canvas-engine';
type Renderer = PortraitEngine | CanvasPortraitEngine;
import { PORTRAIT_SILHOUETTE, createPortraitMask } from '@/lib/portrait/silhouette';
import './ElasticPortrait.css';

type Props = {
  preset: number;
  label: string;
  reducedMotion: boolean;
  activeRef: RefObject<boolean>;
  impulse: number;
  onGrab: (u: number, v: number) => void;
  onRelease: (cancelled: boolean) => void;
};
const SOURCES = ['portraits/picaro.webp', 'portraits/expressions.webp'];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Portrait image unavailable'));
    image.src = `${import.meta.env.BASE_URL}${src}`;
  });
}

/** One connected GPU surface. The frame is decoration, never a clipping box. */
export function ElasticPortrait({ preset, label, reducedMotion, activeRef, impulse, onGrab, onRelease }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const softwareCanvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Renderer | null>(null);
  const callbacks = useRef({ onGrab, onRelease });
  const settings = useRef({ preset, reducedMotion });
  const [renderer, setRenderer] = useState('loading');
  const ready = renderer !== 'loading' && renderer !== 'static';
  const [failed, setFailed] = useState(false);
  const [held, setHeld] = useState(false);
  const clipId = useId().replace(/:/g, '');

  useEffect(() => { callbacks.current = { onGrab, onRelease }; }, [onGrab, onRelease]);
  useEffect(() => {
    settings.current = { preset, reducedMotion };
    engineRef.current?.setFace(preset, reducedMotion);
    if (reducedMotion) engineRef.current?.reset();
  }, [preset, reducedMotion]);
  useEffect(() => {
    if (impulse && !reducedMotion) engineRef.current?.poke();
  }, [impulse, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;
    const softwareCanvas = softwareCanvasRef.current;
    if (!canvas || !surface || !softwareCanvas) return;
    let disposed = false;
    let engine: Renderer | null = null;
    let sources: HTMLImageElement[] | null = null;
    let mask: HTMLCanvasElement | null = null;
    let size = 0;
    let dirty = true;
    let wasActive = false;
    const downs = new Map<number, { x: number; y: number; moved: number }>();
    const cancel = () => {
      if (!downs.size) return;
      const ids = [...downs.keys()];
      downs.clear();
      engine?.releaseAll(settings.current.reducedMotion);
      for (const id of ids) if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
      setHeld(false);
      callbacks.current.onRelease(true);
      dirty = true;
    };
    const layout = () => {
      // ResizeObserver gives the actual untransformed CSS size. Pointer input
      // is converted separately, so the chapter's entrance scale cannot jump.
      const nextSize = surface.clientWidth;
      if (nextSize !== size) cancel();
      size = nextSize;
      if (!size) { cancel(); return; }
      engine?.resize(size * 2.2, size * 1.8, Math.min(devicePixelRatio || 1, 2), { x: size * 0.6, y: size * 0.4, size });
      dirty = true;
    };
    const local = (ev: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      return { x: (ev.clientX - rect.left) * size / rect.width, y: (ev.clientY - rect.top) * size / rect.height };
    };
    const down = (ev: PointerEvent) => {
      if (!engine || !size || ev.button !== 0) return;
      if (ev.target instanceof Element && !ev.target.closest('[data-portrait-hit]')) return;
      const p = local(ev);
      if (!engine.grab(ev.pointerId, p.x / size, p.y / size)) return;
      ev.preventDefault();
      downs.set(ev.pointerId, { ...p, moved: 0 });
      surface.setPointerCapture(ev.pointerId);
      setHeld(true);
      callbacks.current.onGrab(p.x / size, p.y / size);
      dirty = true;
    };
    const move = (ev: PointerEvent) => {
      const d = downs.get(ev.pointerId);
      if (!d || !engine) return;
      const p = local(ev);
      const dx = p.x - d.x;
      const dy = p.y - d.y;
      d.moved = Math.max(d.moved, Math.hypot(dx, dy));
      if (!settings.current.reducedMotion) engine.drag(ev.pointerId, dx, dy);
      dirty = true;
    };
    const up = (ev: PointerEvent) => {
      if (!downs.has(ev.pointerId)) return;
      downs.delete(ev.pointerId);
      engine?.release(ev.pointerId);
      if (surface.hasPointerCapture(ev.pointerId)) surface.releasePointerCapture(ev.pointerId);
      if (!downs.size) {
        setHeld(false);
        callbacks.current.onRelease(ev.type !== 'pointerup');
      }
      dirty = true;
    };
    const loseContext = (ev: Event) => {
      ev.preventDefault();
      cancel();
      engine?.destroy();
      engine = null;
      engineRef.current = null;
      try {
        if (!sources || !mask) throw new Error('Portrait sources unavailable');
        engine = new CanvasPortraitEngine(softwareCanvas, sources, mask);
        engineRef.current = engine;
        engine.setFace(settings.current.preset, settings.current.reducedMotion);
        layout();
        setRenderer('canvas2d');
      } catch {
        setRenderer('static');
        setFailed(true);
      }
    };
    const visibility = () => { if (document.hidden) cancel(); };
    const ro = new ResizeObserver(layout);
    ro.observe(surface);
    surface.addEventListener('pointerdown', down);
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerup', up);
    surface.addEventListener('pointercancel', up);
    surface.addEventListener('lostpointercapture', up);
    canvas.addEventListener('webglcontextlost', loseContext);
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', visibility);
    const unsubscribe = onFrame((time) => {
      const active = activeRef.current && size > 0 && !document.hidden;
      if (!active) {
        if (wasActive) { cancel(); engine?.reset(); }
        wasActive = false;
        return;
      }
      if (!wasActive) dirty = true;
      wasActive = true;
      // Idle faces and hidden chapters issue no draw calls.
      if (engine && (dirty || engine.moving)) {
        engine.render(time, settings.current.reducedMotion);
        dirty = false;
      }
    });
    void (async () => {
      try {
        const base = await loadImage(SOURCES[0]);
        const expressions = await loadImage(SOURCES[1]).catch(() => base);
        if (disposed) return;
        sources = [base, expressions];
        mask = createPortraitMask();
        try {
          engine = new PortraitEngine(canvas, sources, mask);
        } catch {
          // Some privacy settings and graphics drivers disable WebGL. Keep the
          // same continuous deformation with a connected Canvas2D mesh.
          engine = new CanvasPortraitEngine(softwareCanvas, sources, mask);
        }
        engineRef.current = engine;
        engine.setFace(settings.current.preset, settings.current.reducedMotion);
        layout();
        setRenderer(engine.rendererName);
      } catch (error) {
        console.warn('Interactive portrait unavailable; using static portrait.', error);
        if (!disposed) { setRenderer('static'); setFailed(true); }
      }
    })();
    return () => {
      disposed = true;
      unsubscribe();
      ro.disconnect();
      surface.removeEventListener('pointerdown', down);
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerup', up);
      surface.removeEventListener('pointercancel', up);
      surface.removeEventListener('lostpointercapture', up);
      canvas.removeEventListener('webglcontextlost', loseContext);
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', visibility);
      for (const id of downs.keys()) if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
      downs.clear();
      engine?.destroy();
      engineRef.current = null;
    };
  }, [activeRef]);

  // State changes redraw a stationary portrait, including reduced-motion mode.
  useEffect(() => {
    if (engineRef.current && activeRef.current) engineRef.current.render(performance.now(), reducedMotion);
  }, [preset, reducedMotion, activeRef]);

  const atlas = preset > 0;
  return (
    <div className="elastic-portrait" data-renderer={renderer} data-held={held || undefined}>
      <div ref={surfaceRef} className="elastic-portrait__surface" role="img"
        aria-label={`Retrato de Synji: ${label}. ${reducedMotion ? 'Movimiento reducido activado.' : 'Arrastra el rostro o usa los botones de gesto.'}`}>
        <div className="elastic-portrait__frame" aria-hidden="true" />
        {!ready && <svg className="elastic-portrait__fallback" viewBox="0 0 1000 1000" aria-hidden="true">
          <defs><clipPath id={clipId}><path d={PORTRAIT_SILHOUETTE} /></clipPath></defs>
          <g clipPath={`url(#${clipId})`}>
            <image href={`${import.meta.env.BASE_URL}${SOURCES[atlas ? 1 : 0]}`}
              x={atlas ? -(preset % 2) * 1000 : 0} y={atlas ? -Math.floor(preset / 2) * 1000 : 0}
              width={atlas ? 2000 : 1000} height={atlas ? 2000 : 1000} />
          </g>
        </svg>}
        <canvas ref={canvasRef} className="elastic-portrait__canvas" aria-hidden="true" style={{visibility: renderer.startsWith('webgl') ? 'visible' : 'hidden'}} />
        <canvas ref={softwareCanvasRef} className="elastic-portrait__canvas" aria-hidden="true" style={{visibility: renderer === 'canvas2d' ? 'visible' : 'hidden'}} />
        {ready && <svg className="elastic-portrait__hit" viewBox="0 0 1000 1000" aria-hidden="true">
          <path data-portrait-hit d={PORTRAIT_SILHOUETTE} fill="transparent" />
        </svg>}
      </div>
      {failed && <span className="sr-only">Vista estática. Puedes elegir el gesto con los botones.</span>}
    </div>
  );
}
