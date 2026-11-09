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
  caption: string;
  mood: string;
  warpX: number;
  warpY: number;
}

const PORTRAIT_PRESETS: PortraitPreset[] = [
  {
    id: 'otaku',
    label: 'Modo Otaku / Isekai',
    src: `${import.meta.env.BASE_URL}synji-film.webp`,
    caption: 'Entre Re:Zero, Mushoku Tensei, One Piece y un cuaderno de dibujo.',
    mood: 'MODO OTAKU · ACTIVO',
    warpX: 0.14,
    warpY: 0.08,
  },
  {
    id: 'rpg',
    label: 'Modo RPG / Square Enix',
    src: `${import.meta.env.BASE_URL}synji-hero.webp`,
    caption: 'De Super NES a Final Fantasy, Kingdom Hearts y MMORPGs.',
    mood: 'MANA / EXP · 9999',
    warpX: -0.12,
    warpY: 0.06,
  },
  {
    id: 'cafe',
    label: 'Modo Audiolibros & Café',
    src: `${import.meta.env.BASE_URL}synji-cafe.webp`,
    caption: 'Encadenando audiolibros en el coche y tirando del hilo de Capricornio.',
    mood: 'CURIOSIDAD · SIN FILTRO',
    warpX: 0.09,
    warpY: -0.09,
  },
  {
    id: 'playa',
    label: 'Modo Gatos & Familia',
    src: `${import.meta.env.BASE_URL}synji-playa.webp`,
    caption: 'En casa con mi mujer, mis hijos, los gatos al mando y cero humo.',
    mood: 'LATENCIA MENTAL · 12ms',
    warpX: -0.08,
    warpY: -0.1,
  },
];

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
  const [stretchCount, setStretchCount] = useState<number>(0);
  const [patienceLevel, setPatienceLevel] = useState<number>(88);

  const manualInteractionRef = useRef<number>(0);
  const isSceneActiveRef = useRef<boolean>(false);

  const pointerRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    dispX: 0,
    dispY: 0,
    velX: 0,
    velY: 0,
    anchorU: 0.5,
    anchorV: 0.5,
  });

  useEffect(() => {
    const p = pointerRef.current;
    p.anchorU = 0.5;
    p.anchorV = 0.48;
    p.velX += activePreset.warpX * 150;
    p.velY += activePreset.warpY * 150;
  }, [activePreset]);

  // Sincronización con la cámara fija de scrollytelling
  useEffect(() => {
    let lastAutoIdx = -1;

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
        headerRef.current.style.transform = `translate3d(0, ${lerp(-26, 0, enter) - exit * 20}px, 0)`;
      }
      if (leftColRef.current) {
        leftColRef.current.style.transform = `translate3d(${lerp(-48, 0, enter) - exit * 36}px, 0, 0) scale(${lerp(0.9, 1, enter)})`;
      }
      if (rightColRef.current) {
        rightColRef.current.style.transform = `translate3d(${lerp(48, 0, enter) + exit * 36}px, 0, 0) scale(${lerp(0.92, 1, enter)})`;
      }

      // El scroll recorre automáticamente las 4 facetas personales y los modos del retrato
      const u = range(p, 0.08, 0.9) * personalFacets.length;
      const idx = clamp(Math.floor(u), 0, personalFacets.length - 1);
      const localProgress = u - idx;

      if (facetCardRef.current) {
        const yPulse = Math.sin(localProgress * Math.PI) * -6;
        facetCardRef.current.style.transform = `translate3d(0, ${yPulse.toFixed(1)}px, 0)`;
      }

      if (Date.now() - manualInteractionRef.current > 3200 && idx !== lastAutoIdx) {
        lastAutoIdx = idx;
        setActiveFacetIdx(idx);
        setActivePreset(PORTRAIT_PRESETS[idx % PORTRAIT_PRESETS.length]);
        setActiveTrack(playlistFrequencies[idx % (playlistFrequencies.length - 1)]);
      }
    });
  }, []);

  // Motor elástico Canvas 2D inspirado en Otis
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activePreset.src;

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
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = width / height;
          let sx = 0;
          let sy = 0;
          let sw = img.naturalWidth;
          let sh = img.naturalHeight;

          if (imgAspect > canvasAspect) {
            sw = img.naturalHeight * canvasAspect;
            sx = (img.naturalWidth - sw) * 0.5;
          } else {
            sh = img.naturalWidth / canvasAspect;
            sy = (img.naturalHeight - sh) * 0.35;
          }

          const cellW = width / cols;
          const cellH = height / rows;
          const srcCellW = sw / cols;
          const srcCellH = sh / rows;

          const getDeformedPoint = (c: number, r: number) => {
            const u = c / cols;
            const v = r / rows;
            const baseX = u * width;
            const baseY = v * height;

            const edgeMask = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
            const du = u - p.anchorU;
            const dv = v - p.anchorV;
            const distSq = du * du + dv * dv;
            const influence = Math.exp(-distSq / 0.14) * edgeMask;

            return {
              x: baseX + p.dispX * influence,
              y: baseY + p.dispY * influence,
            };
          };

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const p00 = getDeformedPoint(c, r);
              const p10 = getDeformedPoint(c + 1, r);
              const p01 = getDeformedPoint(c, r + 1);
              const p11 = getDeformedPoint(c + 1, r + 1);

              const minX = Math.min(p00.x, p01.x);
              const maxX = Math.max(p10.x, p11.x);
              const minY = Math.min(p00.y, p10.y);
              const maxY = Math.max(p01.y, p11.y);

              ctx.drawImage(
                img,
                sx + c * srcCellW,
                sy + r * srcCellH,
                srcCellW + 0.8,
                srcCellH + 0.8,
                minX,
                minY,
                Math.max(1, maxX - minX + cellW * 0.08),
                Math.max(1, maxY - minY + cellH * 0.08),
              );
            }
          }

          const stretchMag = Math.hypot(p.dispX, p.dispY);
          if (stretchMag > 3) {
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const u = (e.clientX - rect.left) / rect.width;
    const v = (e.clientY - rect.top) / rect.height;

    const p = pointerRef.current;
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
    p.dispX = Math.max(-130, Math.min(130, dx * 0.85));
    p.dispY = Math.max(-130, Math.min(130, dy * 0.85));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerRef.current;
    if (!p.dragging) return;
    p.dragging = false;
    setStretchCount((c) => c + 1);
    setPatienceLevel((lvl) => (lvl > 24 ? lvl - 6 : 92));
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
    p.velX = (Math.random() - 0.5) * 190;
    p.velY = (Math.random() - 0.5) * 190;
    setStretchCount((c) => c + 1);
  };

  const activeFacet = personalFacets[activeFacetIdx] || personalFacets[0];

  const getFacetIcon = (id: string) => {
    switch (id) {
      case 'otaku-isekai':
        return <Tv className="h-4 w-4 text-[#06B6D4]" />;
      case 'rpg-squareenix':
        return <Gamepad2 className="h-4 w-4 text-[#8B5CF6]" />;
      case 'curiosidad-audiolibros':
        return <Headphones className="h-4 w-4 text-[#3B82F6]" />;
      default:
        return <Cat className="h-4 w-4 text-[#10B981]" />;
    }
  };

  return (
    <section
      ref={stageRef}
      aria-label="Capítulo 5: El Lado B y Laboratorio Jugable"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-4 pt-20 pb-6 sm:px-6 md:px-[5vw] md:pt-24"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior */}
      <div
        ref={headerRef}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-3 border-b border-white/[0.08] will-change-transform"
      >
        <div className="space-y-1">
          <h2 className="font-mono text-xl sm:text-3xl font-bold text-[#f5f5f5] tracking-tight">
            Demasiadas pestañas abiertas: quién soy fuera del curro.
          </h2>
          <p className="font-mono text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CAP. 06 · EL SCROLL RECORRE MIS 4 PASIONES Y PUEDES ESTIRAR EL RETRATO ELÁSTICO (OTIS)</span>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#a3a3a3]">
          <span>FACETA ACTIVA:</span>
          <span className="text-[#06B6D4] font-bold tabular-nums">
            0{activeFacetIdx + 1} / 0{personalFacets.length}
          </span>
        </div>
      </div>

      {/* Escenario central en dos columnas sincronizadas con el scroll */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Columna izquierda: Retrato Elástico Otis (5 cols) */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-3.5 sm:p-4 space-y-3 will-change-transform"
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

          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#05070c] max-h-[42svh]">
            <canvas
              ref={canvasRef}
              width={420}
              height={440}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full max-h-[42svh] object-cover cursor-grab active:cursor-grabbing touch-none select-none block"
            />

            <div className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[10px]">
              <span className="rounded-full border border-white/[0.12] bg-[#0a0a0a]/85 px-2.5 py-0.5 text-[#f5f5f5]">
                {activePreset.mood}
              </span>
              <span className="rounded-full border border-[#06B6D4]/30 bg-[#0a0a0a]/85 px-2.5 py-0.5 text-[#06B6D4] tabular-nums">
                TIRONES: {stretchCount}
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 rounded-lg border border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-md p-2">
              <p className="text-[11px] text-[#f5f5f5] leading-snug">{activePreset.caption}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PORTRAIT_PRESETS.map((preset, idx) => {
              const selected = preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    manualInteractionRef.current = Date.now();
                    setActivePreset(preset);
                    setActiveFacetIdx(idx % personalFacets.length);
                  }}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10px] transition-colors ${
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

          <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2.5 font-mono text-[10px] flex items-center justify-between">
            <span className="text-[#a3a3a3]">PACIENCIA ANTE EL HUMO:</span>
            <span className="text-[#06B6D4] font-bold tabular-nums">{patienceLevel}%</span>
          </div>
        </div>

        {/* Columna derecha: Las 4 Facetas Personales + Sintonizador Musical (7 cols) */}
        <div
          ref={rightColRef}
          className="lg:col-span-7 space-y-4 will-change-transform"
        >
          {/* Selector de las 4 Facetas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {personalFacets.map((facet, idx) => {
              const isSelected = idx === activeFacetIdx;
              return (
                <button
                  key={facet.id}
                  type="button"
                  onClick={() => {
                    manualInteractionRef.current = Date.now();
                    setActiveFacetIdx(idx);
                    setActivePreset(PORTRAIT_PRESETS[idx % PORTRAIT_PRESETS.length]);
                  }}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    isSelected
                      ? 'border-[#06B6D4]/60 bg-[#181818] text-[#f5f5f5]'
                      : 'border-white/[0.08] bg-[#121212]/85 text-[#a3a3a3] hover:text-[#f5f5f5]'
                  }`}
                >
                  {getFacetIcon(facet.id)}
                  <span className="font-mono text-[11px] font-semibold truncate">
                    0{idx + 1} · {facet.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ficha activa que se mueve con el scroll */}
          <div
            ref={facetCardRef}
            className="rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-5 space-y-3 will-change-transform"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-mono text-base sm:text-lg font-bold text-[#f5f5f5]">
                {activeFacet.title}
              </h3>
              <span className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#06B6D4]">
                {activeFacet.tag}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#f5f5f5]/90 leading-relaxed">
              {activeFacet.confession}
            </p>

            <ul className="space-y-1.5 max-sm:hidden">
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

            <div className="pt-2 border-t border-white/[0.08] flex flex-wrap gap-1.5">
              {activeFacet.favorites.map((fav) => (
                <span
                  key={fav}
                  className="rounded-md border border-white/[0.08] bg-[#0a0a0a] px-2 py-0.5 font-mono text-[10px] text-[#f5f5f5]"
                >
                  {fav}
                </span>
              ))}
            </div>
          </div>

          {/* Sintonizador de Banda Sonora */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono text-sm sm:text-base font-bold text-[#f5f5f5]">
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
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
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
              className={`rounded-xl border px-3.5 py-2.5 font-mono text-xs transition-colors ${
                activeTrack.blocked
                  ? 'border-[#EF4444]/50 bg-[#EF4444]/10 text-[#f5f5f5]'
                  : 'border-white/[0.08] bg-[#0a0a0a] text-[#f5f5f5]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">
                  {activeTrack.blocked
                    ? 'ERROR 403 · CORTAFUEGOS SONORO ACTIVADO'
                    : `SONANDO: ${activeTrack.bandOrGenre.toUpperCase()}`}
                </span>
                <span className={activeTrack.blocked ? 'text-[#EF4444]' : 'text-[#06B6D4]'}>
                  {activeTrack.blocked ? 'BLOCKED' : 'ON AIR'}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs text-[#a3a3a3]">{activeTrack.vibe}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px] text-[#737373] pt-2 border-t border-white/[0.08]">
        <span>ESTIRA EL RETRATO CON EL RATÓN O CONTINÚA HACIENDO SCROLL</span>
        <span>SIGUIENTE CÁMARA: AUTODIAGNÓSTICO & CANAL ABIERTO →</span>
      </div>
    </section>
  );
}
