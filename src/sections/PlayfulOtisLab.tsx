import { useEffect, useRef, useState } from 'react';
import {
  Ban,
  Cat,
  Gamepad2,
  Headphones,
  Radio,
  RotateCcw,
  Sparkles,
  Tv,
} from 'lucide-react';
import { onFrame } from '@/lib/scroll';
import { clamp, lerp, range, sceneProgress } from '@/lib/math';
import {
  personalFacets,
  playlistFrequencies,
  type PlaylistFrequency,
} from '@/data/synjiPersonal';

interface PortraitPreset {
  id: string;
  label: string;
  src: string;
  frame?: number;
  caption: string;
  mood: string;
  warpX: number;
  warpY: number;
}

const PORTRAIT_PRESETS: PortraitPreset[] = [
  { id: 'picaro', label: 'Pícaro', src: `${import.meta.env.BASE_URL}portraits/picaro.webp`, caption: 'Arrastra la frente o las mejillas. También puedes elegir un gesto.', mood: 'PÍCARO · EN REPOSO', warpX: 0, warpY: 0 },
  { id: 'sorpresa', label: 'Sorpresa', src: `${import.meta.env.BASE_URL}portraits/expressions.webp`, frame: 1, caption: 'Esa idea acaba de desbloquear algo.', mood: 'SORPRESA · +1 IDEA', warpX: 0, warpY: -0.06 },
  { id: 'mejillas', label: 'Mejillas', src: `${import.meta.env.BASE_URL}portraits/expressions.webp`, frame: 2, caption: 'Un poco de presión. Todavía queda paciencia.', mood: 'PACIENCIA · COMPRIMIDA', warpX: 0.07, warpY: 0.02 },
  { id: 'guino', label: 'Guiño', src: `${import.meta.env.BASE_URL}portraits/expressions.webp`, frame: 3, caption: 'No todo va a ser ponerse serio.', mood: 'COMPLICIDAD · ACTIVADA', warpX: -0.06, warpY: 0 },
];
const portraitImages = new Map<string, HTMLImageElement>();

export function PlayfulOtisLab({ reducedMotion }: { reducedMotion: boolean }) {
  const stageRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const facetCardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePreset, setActivePreset] = useState<PortraitPreset>(PORTRAIT_PRESETS[0]);
  const [activeFacetIdx, setActiveFacetIdx] = useState<number>(0);
  const [activeTrack, setActiveTrack] = useState<PlaylistFrequency>(playlistFrequencies[0]);
  const [stretchCount, setStretchCount] = useState(0);
  const [patienceLevel, setPatienceLevel] = useState(92);
  const [mobilePanel, setMobilePanel] = useState<'portrait' | 'facets'>('portrait');

  const isSceneActiveRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (resetTimerRef.current) clearTimeout(resetTimerRef.current); }, []);
  const manualInteractionRef = useRef<number>(0);
  const manualMobilePanelRef = useRef<number>(0);

  const pointerRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
    velX: 0,
    velY: 0,
    dispX: 0,
    dispY: 0,
    anchorU: 0.5,
    anchorV: 0.5,
  });

  useEffect(() => {
    const p = pointerRef.current;
    if (!p.dragging && !reducedMotion) {
      p.anchorU = 0.5;
      p.anchorV = 0.48;
      p.velX += activePreset.warpX * 150;
      p.velY += activePreset.warpY * 150;
    }
  }, [activePreset, reducedMotion]);

  useEffect(() => {
    let lastAutoIdx = -1;
    let lastMobilePanel: 'portrait' | 'facets' = 'portrait';

    return onFrame(() => {
      const anchor = document.getElementById('lado-b');
      const stage = stageRef.current;
      if (!anchor || !stage) return;

      const { p, vis, enter, exit, active } = sceneProgress(anchor);
      isSceneActiveRef.current = active;

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, ${lerp(-20, 0, enter) - exit * 16}px, 0)`;
      }
      if (leftColRef.current) {
        leftColRef.current.style.transform = `translate3d(${lerp(-32, 0, enter) - exit * 24}px, 0, 0) scale(${lerp(0.94, 1, enter)})`;
      }
      if (rightColRef.current) {
        rightColRef.current.style.transform = `translate3d(${lerp(32, 0, enter) + exit * 24}px, 0, 0) scale(${lerp(0.94, 1, enter)})`;
      }

      // En móvil (< 1024px), la primera mitad del scroll muestra el retrato elástico (0.00..0.42)
      // y la segunda mitad recorre las 4 facetas y la música (0.42..1.00)
      const now = Date.now();
      if (!pointerRef.current.dragging && now - manualMobilePanelRef.current > 3500) {
        const nextMobilePanel = p < 0.42 ? 'portrait' : 'facets';
        if (nextMobilePanel !== lastMobilePanel) {
          lastMobilePanel = nextMobilePanel;
          setMobilePanel(nextMobilePanel);
        }
      }

      const u = range(p, 0.08, 0.9) * personalFacets.length;
      const idx = clamp(Math.floor(u), 0, personalFacets.length - 1);
      const localProgress = u - idx;

      if (facetCardRef.current) {
        const yPulse = Math.sin(localProgress * Math.PI) * -4;
        facetCardRef.current.style.transform = `translate3d(0, ${yPulse.toFixed(1)}px, 0)`;
      }

      if (now - manualInteractionRef.current > 3200 && idx !== lastAutoIdx) {
        lastAutoIdx = idx;
        setActiveFacetIdx(idx);
        setActiveTrack(playlistFrequencies[idx % (playlistFrequencies.length - 1)]);
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (const preset of PORTRAIT_PRESETS) {
      if (!portraitImages.has(preset.src)) {
        const image = new Image();
        image.src = preset.src;
        portraitImages.set(preset.src, image);
      }
    }
    const img = portraitImages.get(activePreset.src)!;

    let rafId = 0;
    const cols = 14;
    const rows = 16;

    const render = () => {
      if (isSceneActiveRef.current) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const p = pointerRef.current;
        if (!p.dragging) {
          const stiffness = reducedMotion ? 0.35 : 0.14;
          const damping = reducedMotion ? 0.5 : 0.82;
          const forceX = -stiffness * p.dispX;
          const forceY = -stiffness * p.dispY;
          p.velX = (p.velX + forceX) * damping;
          p.velY = (p.velY + forceY) * damping;
          p.dispX += p.velX;
          p.dispY += p.velY;
        }

        if (img.complete && img.naturalWidth > 0) {
          const frameWidth = activePreset.frame === undefined ? img.naturalWidth : img.naturalWidth / 2;
          const frameHeight = activePreset.frame === undefined ? img.naturalHeight : img.naturalHeight / 2;
          const frameX = activePreset.frame === undefined ? 0 : (activePreset.frame % 2) * frameWidth;
          const frameY = activePreset.frame === undefined ? 0 : Math.floor(activePreset.frame / 2) * frameHeight;
          const imgAspect = frameWidth / frameHeight;
          const canvasAspect = width / height;
          let sx = 0;
          let sy = 0;
          let sw = frameWidth;
          let sh = frameHeight;

          if (imgAspect > canvasAspect) {
            sw = frameHeight * canvasAspect;
            sx = (frameWidth - sw) * 0.5;
          } else {
            sh = frameWidth / canvasAspect;
            sy = (frameHeight - sh) * 0.2;
          }

          const cellW = width / cols;
          const cellH = height / rows;
          const srcCellW = sw / cols;
          const srcCellH = sh / rows;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const u = (c + 0.5) / cols;
              const v = (r + 0.5) / rows;

              const dx = u - p.anchorU;
              const dy = v - p.anchorV;
              const distSq = dx * dx + dy * dy;
              const influence = Math.exp(-distSq / 0.11);

              const edgeFade =
                Math.sin(u * Math.PI) * Math.sin(v * Math.PI);

              const offsetX = p.dispX * influence * edgeFade;
              const offsetY = p.dispY * influence * edgeFade;

              const scaleWarpX = 1 + (offsetX / width) * 0.45;
              const scaleWarpY = 1 + (offsetY / height) * 0.45;

              ctx.save();
              ctx.translate(c * cellW + offsetX, r * cellH + offsetY);
              ctx.scale(scaleWarpX, scaleWarpY);
              ctx.drawImage(
                img,
                frameX + sx + c * srcCellW,
                frameY + sy + r * srcCellH,
                srcCellW + 1.2,
                srcCellH + 1.2,
                -0.6,
                -0.6,
                cellW + 1.4,
                cellH + 1.4,
              );
              ctx.restore();
            }
          }

          const stretchMag = Math.hypot(p.dispX, p.dispY);
          if (stretchMag > 4) {
            const ax = p.anchorU * width + p.dispX * 0.65;
            const ay = p.anchorV * height + p.dispY * 0.65;
            ctx.beginPath();
            ctx.arc(ax, ay, Math.min(28, 10 + stretchMag * 0.12), 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        } else {
          ctx.fillStyle = '#121212';
          ctx.fillRect(0, 0, width, height);
        }
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [activePreset, reducedMotion]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    manualInteractionRef.current = Date.now();
    manualMobilePanelRef.current = Date.now();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const u = (e.clientX - rect.left) / rect.width;
    const v = (e.clientY - rect.top) / rect.height;

    const p = pointerRef.current;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    p.dragging = true;
    p.anchorU = u;
    p.anchorV = v;
    p.startX = e.clientX;
    p.startY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerRef.current;
    if (!p.dragging) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    p.dispX = reducedMotion ? 0 : clamp(dx * 0.6, -75, 75);
    p.dispY = reducedMotion ? 0 : clamp(dy * 0.6, -75, 75);
    if (Math.hypot(dx, dy) > 8) {
      const index = p.anchorV < 0.38 || dy < -25 ? 1 : p.anchorU > 0.55 ? 3 : 2;
      setActivePreset(PORTRAIT_PRESETS[index]);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerRef.current;
    if (!p.dragging) return;
    p.dragging = false;
    manualMobilePanelRef.current = Date.now();
    resetTimerRef.current = setTimeout(() => setActivePreset(PORTRAIT_PRESETS[0]), 1200);
    setStretchCount((c) => c + 1);
    setPatienceLevel((lvl) => (lvl <= 18 ? 96 : lvl - 9));
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const triggerSpringPoke = () => {
    manualInteractionRef.current = Date.now();
    const p = pointerRef.current;
    p.anchorU = 0.35 + Math.random() * 0.3;
    p.anchorV = 0.35 + Math.random() * 0.3;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setActivePreset(PORTRAIT_PRESETS[1 + Math.floor(Math.random() * 3)]);
    p.velX = reducedMotion ? 0 : (Math.random() - 0.5) * 90;
    p.velY = reducedMotion ? 0 : (Math.random() - 0.5) * 90;
    resetTimerRef.current = setTimeout(() => setActivePreset(PORTRAIT_PRESETS[0]), 1200);
    setStretchCount((c) => c + 1);
  };

  const activeFacet = personalFacets[activeFacetIdx] || personalFacets[0];

  const getFacetIcon = (id: string) => {
    switch (id) {
      case 'otaku-isekai':
        return <Tv className="h-3.5 w-3.5 text-[#06B6D4]" />;
      case 'rpg-squareenix':
        return <Gamepad2 className="h-3.5 w-3.5 text-[#8B5CF6]" />;
      case 'curiosidad-audiolibros':
        return <Headphones className="h-3.5 w-3.5 text-[#3B82F6]" />;
      default:
        return <Cat className="h-3.5 w-3.5 text-[#10B981]" />;
    }
  };

  return (
    <section
      ref={stageRef}
      aria-label="Capítulo 6: El Lado B y Laboratorio Jugable"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-3.5 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-6 md:px-[5vw]"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior */}
      <div
        ref={headerRef}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-2 border-b border-white/[0.08] shrink-0 will-change-transform"
      >
        <div className="space-y-0.5 sm:space-y-1">
          <h2 className="font-mono text-base sm:text-2xl lg:text-3xl font-bold text-[#f5f5f5] tracking-tight leading-snug">
            Demasiadas pestañas abiertas: quién soy fuera del curro.
          </h2>
          <p className="font-mono text-[10px] sm:text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>CAP. 06 · RETRATO ELÁSTICO (OTIS), 4 FACETAS Y BANDA SONORA</span>
          </p>
        </div>

        {/* Conmutador móvil para no apilar el canvas de Otis encima de las 4 facetas */}
        <div className="flex items-center justify-between lg:justify-end gap-2">
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={() => {
                manualMobilePanelRef.current = Date.now();
                setMobilePanel('portrait');
              }}
              className={`rounded-full px-3 py-1 font-mono text-[10px] transition-colors ${
                mobilePanel === 'portrait'
                  ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                  : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
              }`}
            >
              01 · Retrato Elástico
            </button>
            <button
              type="button"
              onClick={() => {
                manualMobilePanelRef.current = Date.now();
                setMobilePanel('facets');
              }}
              className={`rounded-full px-3 py-1 font-mono text-[10px] transition-colors ${
                mobilePanel === 'facets'
                  ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                  : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
              }`}
            >
              02 · 4 Pasiones & Música
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#a3a3a3]">
            <span>FACETA ACTIVA:</span>
            <span className="text-[#06B6D4] font-bold tabular-nums">
              0{activeFacetIdx + 1} / 0{personalFacets.length}
            </span>
          </div>
        </div>
      </div>

      {/* Escenario central: en móvil muestra el panel activo (Retrato o Facetas) sin desbordar */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center min-h-0">
        {/* Columna izquierda: Retrato Elástico Otis (5 cols) */}
        <div
          ref={leftColRef}
          className={`lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-3 sm:p-4 space-y-2.5 will-change-transform ${
            mobilePanel === 'portrait' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-xs sm:text-sm font-bold text-[#f5f5f5]">
              Retrato Elástico · Arrastra la cara
            </h3>
            <button
              type="button"
              onClick={triggerSpringPoke}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#181818] px-2.5 py-1 font-mono text-[10px] text-[#06B6D4] hover:border-[#06B6D4]/50"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Impulso</span>
            </button>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#05070c] max-h-[38svh] sm:max-h-[42svh]">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Retrato interactivo de Synji: ${activePreset.label}. Arrastra para cambiar el gesto o utiliza los botones inferiores.`}
              width={420}
              height={440}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onLostPointerCapture={handlePointerUp}
              className="w-full h-auto max-h-[38svh] sm:max-h-[42svh] object-cover cursor-grab active:cursor-grabbing touch-none select-none block"
            />

            <div className="pointer-events-none absolute top-2 left-2 right-2 flex items-center justify-between font-mono text-[10px]">
              <span className="rounded-full border border-white/[0.12] bg-[#0a0a0a]/85 px-2.5 py-0.5 text-[#f5f5f5]">
                {activePreset.mood}
              </span>
              <span className="rounded-full border border-[#06B6D4]/30 bg-[#0a0a0a]/85 px-2.5 py-0.5 text-[#06B6D4] tabular-nums">
                TIRONES: {stretchCount}
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg border border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-md p-2">
              <p className="text-[11px] text-[#f5f5f5] leading-snug">{activePreset.caption}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PORTRAIT_PRESETS.map((preset) => {
              const selected = preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    manualInteractionRef.current = Date.now();
                    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
                    manualMobilePanelRef.current = Date.now();
                    setActivePreset(preset);
                  }}
                  className={`rounded-lg px-2 py-1 font-mono text-[10px] transition-colors ${
                    selected
                      ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                      : 'border border-white/[0.08] bg-[#0a0a0a] text-[#a3a3a3] hover:text-[#f5f5f5]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 font-mono text-[10px] flex items-center justify-between">
            <span className="text-[#a3a3a3]">PACIENCIA ANTE EL HUMO:</span>
            <span className="text-[#06B6D4] font-bold tabular-nums">{patienceLevel}%</span>
          </div>
        </div>

        {/* Columna derecha: Las 4 Facetas Personales + Sintonizador Musical (7 cols) */}
        <div
          ref={rightColRef}
          className={`lg:col-span-7 space-y-2.5 sm:space-y-3.5 will-change-transform ${
            mobilePanel === 'facets' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Selector de las 4 Facetas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {personalFacets.map((facet, idx) => {
              const isSelected = idx === activeFacetIdx;
              return (
                <button
                  key={facet.id}
                  type="button"
                  onClick={() => {
                    manualInteractionRef.current = Date.now();
                    setActiveFacetIdx(idx);
                              }}
                  className={`flex items-center gap-1.5 rounded-xl border p-2 text-left transition-colors ${
                    isSelected
                      ? 'border-[#06B6D4]/60 bg-[#181818] text-[#f5f5f5]'
                      : 'border-white/[0.08] bg-[#121212]/85 text-[#a3a3a3] hover:text-[#f5f5f5]'
                  }`}
                >
                  {getFacetIcon(facet.id)}
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold truncate">
                    0{idx + 1} · {facet.title.split(' ')[0].replace(/[,.:;]+$/, '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ficha activa que se mueve con el scroll */}
          <div
            ref={facetCardRef}
            className="rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-3.5 sm:p-5 space-y-2.5 will-change-transform"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-mono text-sm sm:text-lg font-bold text-[#f5f5f5]">
                {activeFacet.title}
              </h3>
              <span className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#06B6D4]">
                {activeFacet.tag}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#f5f5f5]/90 leading-relaxed">
              {activeFacet.confession}
            </p>

            <ul className="space-y-1 max-sm:hidden">
              {activeFacet.details.map((detail) => (
                <li
                  key={detail}
                  className="text-xs text-[#a3a3a3] flex items-start gap-2"
                >
                  <span className="font-mono text-[#06B6D4]">→</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-white/[0.08] flex flex-wrap gap-1">
              {activeFacet.favorites.map((fav, i) => (
                <span
                  key={fav}
                  className={`rounded-md border border-white/[0.08] bg-[#0a0a0a] px-2 py-0.5 font-mono text-[10px] text-[#f5f5f5] ${
                    i >= 4 ? 'max-sm:hidden' : ''
                  }`}
                >
                  {fav}
                </span>
              ))}
            </div>
          </div>

          {/* Sintonizador de Banda Sonora */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono text-xs sm:text-base font-bold text-[#f5f5f5]">
                Sintonizador de Banda Sonora
              </h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#06B6D4]">
                <Radio className="h-3.5 w-3.5" />
                <span>FRECUENCIAS REALES</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {playlistFrequencies.map((item) => {
                const selected = item.id === activeTrack.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      manualInteractionRef.current = Date.now();
                      setActiveTrack(item);
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] sm:text-[11px] transition-colors ${
                      item.blocked
                        ? selected
                          ? 'bg-[#EF4444] text-[#f5f5f5] font-medium'
                          : 'border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]'
                        : selected
                          ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                          : 'border border-white/[0.08] bg-[#0a0a0a] text-[#a3a3a3] hover:text-[#f5f5f5]'
                    }`}
                  >
                    {item.blocked && <Ban className="h-3 w-3" />}
                    <span>{item.bandOrGenre}</span>
                  </button>
                );
              })}
            </div>

            <div
              className={`rounded-xl border px-3 py-2 font-mono text-[11px] sm:text-xs transition-colors ${
                activeTrack.blocked
                  ? 'border-[#EF4444]/50 bg-[#EF4444]/10 text-[#f5f5f5]'
                  : 'border-white/[0.08] bg-[#0a0a0a] text-[#f5f5f5]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold truncate">
                  {activeTrack.blocked
                    ? 'ERROR 403 · CORTAFUEGOS ACTIVADO'
                    : `SONANDO: ${activeTrack.bandOrGenre.toUpperCase()}`}
                </span>
                <span className={activeTrack.blocked ? 'text-[#EF4444]' : 'text-[#06B6D4]'}>
                  {activeTrack.blocked ? 'BLOCKED' : 'ON AIR'}
                </span>
              </div>
              <p className="mt-0.5 hidden sm:block font-sans text-[11px] text-[#a3a3a3] leading-snug">
                {activeTrack.vibe}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-between font-mono text-[11px] text-[#737373] pt-2 border-t border-white/[0.08] shrink-0">
        <span className="truncate">ESTIRA EL RETRATO O CONTINÚA DESLIZANDO</span>
        <span className="hidden sm:inline">SIGUIENTE CÁMARA: AUTODIAGNÓSTICO →</span>
      </div>
    </section>
  );
}
