import { useEffect, useRef } from 'react';
import { ArrowDownRight, Sparkles, Terminal } from 'lucide-react';
import { onFrame, scrollToHash } from '@/lib/scroll';
import { clamp, easeOutCubic, lerp, range, sceneProgress } from '@/lib/math';
import { heroProfile } from '@/data/synjiStory';

interface DustMote {
  x: number;
  y: number;
  r: number;
  s: number;
  a: number;
}

export function HeroScrolly({ reducedMotion }: { reducedMotion: boolean }) {
  const stageRef = useRef<HTMLElement | null>(null);
  const dustRef = useRef<HTMLCanvasElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const bigTitleRef = useRef<HTMLDivElement | null>(null);
  const rimFrameRef = useRef<HTMLDivElement | null>(null);
  const cockpitGridRef = useRef<HTMLDivElement | null>(null);
  const portraitLayerRef = useRef<HTMLDivElement | null>(null);
  const statsLayerRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const clockRef = useRef<HTMLParagraphElement | null>(null);
  const elevRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const c = dustRef.current;
    if (!c) return;
    const sync = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = dustRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let seed = 19;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const motes: DustMote[] = Array.from({ length: 130 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.5 + rand() * 1.6,
      s: 0.3 + rand(),
      a: 0.2 + rand() * 0.55,
    }));

    let lastTime = 0;

    return onFrame((time) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;

      const anchor = document.getElementById('despertar');
      const stage = stageRef.current;
      if (!anchor || !stage) return;

      const { p, vis, exit, active } = sceneProgress(anchor, { isFirst: true });

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      // 1. Polvo cósmico/sináptico en la lente (0.00 -> 0.24)
      const veil = 1 - range(p, 0, 0.24);
      if (veil > 0.001) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = canvas.width / Math.max(1, w);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        for (const m of motes) {
          if (!reducedMotion) {
            m.x += 0.005 * m.s * dt;
            m.y -= 0.004 * m.s * dt;
            if (m.x > 1) m.x -= 1;
            if (m.y < 0) m.y += 1;
          }
          ctx.fillStyle = m.s > 0.8 ? '#06B6D4' : '#dfe6f2';
          ctx.globalAlpha = m.a * veil;
          ctx.beginPath();
          ctx.arc(m.x * w, (m.y - p * 0.55) * h, m.r * (1 + p * 3.5), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      if (veilRef.current) {
        veilRef.current.style.opacity = String(veil);
        veilRef.current.style.transform = `translate3d(0, ${-range(p, 0, 0.24) * 24}vh, 0) scale(${1 + range(p, 0, 0.24) * 0.24})`;
      }
      canvas.style.opacity = String(veil);

      // 2. Gran titular cinematográfico (0.04 -> 0.44)
      if (bigTitleRef.current) {
        const tIn = easeOutCubic(range(p, 0.03, 0.22));
        const tOut = range(p, 0.34, 0.48);
        const titleVis = tIn * (1 - tOut);
        bigTitleRef.current.style.opacity = String(titleVis);
        bigTitleRef.current.style.letterSpacing = `${lerp(0.32, -0.02, tIn)}em`;
        bigTitleRef.current.style.transform = `translate3d(0, ${lerp(8, -10, range(p, 0.03, 0.48))}vh, 0) scale(${lerp(0.92, 1.04, tIn)})`;
        bigTitleRef.current.style.filter = tIn < 0.98 ? `blur(${(1 - tIn) * 8}px)` : 'none';
      }

      // 3. Marco de apertura espacial
      const rimIn = easeOutCubic(range(p, 0.2, 0.52));
      if (rimFrameRef.current) {
        rimFrameRef.current.style.opacity = String(rimIn * (1 - exit * 0.85));
        rimFrameRef.current.style.transform = `translate3d(0, ${-exit * 14}vh, 0) scale(${lerp(1.52, 1, rimIn) + exit * 0.12})`;
      }

      // 4. Tarjetas y retrato apareciendo desde el espacio Z/Y y saliendo hacia cámara al terminar el acto
      const deckIn = easeOutCubic(range(p, 0.26, 0.58));
      if (cockpitGridRef.current) {
        cockpitGridRef.current.style.opacity = String(clamp(deckIn * 1.4) * (1 - exit));
        cockpitGridRef.current.style.transform = `translate3d(${-exit * 40}px, ${lerp(22, 0, deckIn) - exit * 18}vh, 0) scale(${lerp(0.92, 1, deckIn) + exit * 0.06})`;
      }

      const portIn = easeOutCubic(range(p, 0.34, 0.66));
      if (portraitLayerRef.current) {
        portraitLayerRef.current.style.opacity = String(clamp(portIn * 1.5) * (1 - exit));
        portraitLayerRef.current.style.transform = `translate3d(${exit * 40}px, ${lerp(30, 0, portIn) - exit * 22}vh, 0) scale(${lerp(0.88, 1, portIn) + exit * 0.08})`;
      }

      const statsIn = easeOutCubic(range(p, 0.42, 0.72));
      if (statsLayerRef.current) {
        statsLayerRef.current.style.opacity = String(clamp(statsIn * 1.5) * (1 - exit));
        statsLayerRef.current.style.transform = `translate3d(0, ${lerp(20, 0, statsIn) + exit * 16}vh, 0) scale(${lerp(0.94, 1, statsIn)})`;
      }

      if (hudRef.current) {
        hudRef.current.style.opacity = String(
          range(p, 0.02, 0.12) * (1 - exit),
        );
      }
      if (clockRef.current) {
        const secs = Math.floor(p * 36000);
        const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
        const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');
        clockRef.current.textContent = `T+ ${hh}:${mm}:${ss}`;
      }
      if (elevRef.current) {
        elevRef.current.textContent = `${(deckIn * 100).toFixed(0)}% SYNC`;
      }
    });
  }, [reducedMotion]);

  return (
    <section
      ref={stageRef}
      aria-label="Capítulo 1: El Despertar"
      className="fixed inset-0 z-10 h-[100svh] w-screen overflow-hidden"
    >
      {/* CAPA 1: Gran titular cinematográfico (0.04 – 0.44) */}
      <div
        ref={bigTitleRef}
        className="pointer-events-none absolute inset-x-0 top-[28%] z-10 px-6 text-center md:top-[32%]"
        style={{ opacity: 0 }}
      >
        <p className="font-mono text-xs sm:text-sm tracking-[0.28em] text-[#06B6D4] uppercase mb-3">
          MENTE · CONDUCTA · SISTEMAS CON IA
        </p>
        <p className="font-mono text-3xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f5] tracking-tight">
          {heroProfile.name}
        </p>
        <p className="mt-4 font-mono text-xs sm:text-sm text-[#a3a3a3] max-w-xl mx-auto">
          «{heroProfile.thesis}»
        </p>
      </div>

      {/* CAPA 2: Marco de apertura espacial */}
      <div
        ref={rimFrameRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 sm:inset-6 z-10 rounded-3xl border border-white/[0.08] will-change-transform"
        style={{
          opacity: 0,
          boxShadow: 'inset 0 0 120px rgba(5, 7, 12, 0.85)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />
      </div>

      {/* CAPA 3: Escenario principal en profundidad */}
      <div className="relative z-20 mx-auto flex h-full max-w-[1280px] flex-col justify-between pt-20 pb-7 px-4 sm:px-8">
        <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div
            ref={cockpitGridRef}
            className="lg:col-span-7 space-y-5 will-change-transform"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            <h1 className="font-mono text-2xl sm:text-4xl xl:text-[3.1rem] font-bold tracking-tight text-[#f5f5f5] leading-[1.08]">
              Empecé intentando entender cerebros y terminé diseñando sistemas reales con IA.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#a3a3a3] leading-relaxed max-w-[62ch] bg-[#0a0a0a]/75 backdrop-blur-md rounded-xl p-3.5 border border-white/[0.08]">
              Soy <strong className="text-[#f5f5f5] font-medium">{heroProfile.legalName}</strong> (<code className="font-mono text-xs text-[#06B6D4]">{heroProfile.handle}</code>). Psicólogo y máster en Neurociencias, curtido en el barro comercial, más de diez años en docencia y coordinación de FPE y cofundador de{' '}
              <strong className="text-[#f5f5f5] font-medium">DigitalSynapse</strong>. Mueve la rueda del ratón: la pantalla no baja como un documento, las piezas vienen hacia ti.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#121212]/90 px-3 py-1 font-mono text-xs text-[#f5f5f5]">
                <Terminal className="h-3.5 w-3.5 text-[#06B6D4]" />
                <span>CAP. 01 · EL DESPERTAR</span>
              </span>
              <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-[#121212]/90 px-3 py-1 font-mono text-xs text-[#a3a3a3]">
                {heroProfile.location}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-[#121212]/90 px-3 py-1 font-mono text-xs text-[#06B6D4]">
                {heroProfile.newsletter}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToHash('#zigzag')}
                className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f5] px-5 py-2.5 font-mono text-xs sm:text-sm font-medium text-[#0a0a0a] transition-transform duration-200 hover:bg-white active:scale-[0.99]"
              >
                <span>Saltar a Cap. 02 · Zigzag</span>
                <ArrowDownRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToHash('#ecosistema')}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121212]/90 px-4 py-2.5 font-mono text-xs sm:text-sm text-[#f5f5f5] hover:border-white/[0.25]"
              >
                <span>Cap. 03 · Carrete (07)</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToHash('#lado-b')}
                className="inline-flex items-center gap-2 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-4 py-2.5 font-mono text-xs sm:text-sm text-[#06B6D4] hover:bg-[#06B6D4]/15"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Cap. 05 · Modo Jugable Otis</span>
              </button>
            </div>
          </div>

          <div
            ref={portraitLayerRef}
            className="lg:col-span-5 will-change-transform"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            <div className="relative mx-auto max-w-[350px] rounded-2xl border border-white/[0.1] bg-[#121212]/80 backdrop-blur-md p-3">
              <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-xl bg-[#05070c]">
                <img
                  src={`${import.meta.env.BASE_URL}synji-hero.webp`}
                  alt="Retrato de Synji D. Mulatiere"
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"
                />
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-md p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-[#f5f5f5]">
                      {heroProfile.shortName}
                    </span>
                    <span className="font-mono text-[10px] text-[#10B981] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                      EN LÍNEA
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#a3a3a3] leading-snug">
                    «Menos pose de consultor y más herramientas que funcionen el lunes a las ocho.»
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={statsLayerRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 will-change-transform"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          {heroProfile.stats.map((st) => (
            <div
              key={st.label}
              className="rounded-xl border border-white/[0.08] bg-[#121212]/85 backdrop-blur-md px-3.5 py-2.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-base sm:text-lg font-bold text-[#f5f5f5] tabular-nums">
                  {st.value}
                </span>
                <span className="font-mono text-[10px] text-[#06B6D4]">{st.label}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#a3a3a3] truncate">{st.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CAPA 4: Velo atmosférico inicial */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 will-change-transform"
        style={{
          background:
            'radial-gradient(55% 45% at 72% 48%, rgba(59,130,246,0.26), transparent 70%), radial-gradient(50% 55% at 28% 55%, rgba(139,92,246,0.22), transparent 70%), radial-gradient(85% 85% at 50% 50%, rgba(10,14,24,0.88), rgba(5,7,12,0.96))',
        }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center px-4">
          <p className="font-mono text-xs tracking-[0.22em] text-[#06B6D4] uppercase">
            EXPEDICIÓN SINÁPTICA · DIGITALSYNAPSE
          </p>
          <p className="mt-3 font-mono text-sm sm:text-base tracking-[0.32em] text-[#f5f5f5] uppercase">
            Desliza para despejar el ruido y entrar al sistema
          </p>
          <span className="mt-6 inline-block font-mono text-lg text-[#06B6D4] animate-bounce">
            ↓
          </span>
        </div>
      </div>

      <canvas
        ref={dustRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 size-full"
      />

      {/* CAPA 5: Telemetría HUD */}
      <div
        ref={hudRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 sm:inset-7 z-20 font-mono text-[10px] tracking-[0.14em] text-[#a3a3a3] uppercase"
        style={{ opacity: 0 }}
      >
        <div className="absolute top-14 left-2 sm:left-4 space-y-0.5">
          <p ref={clockRef} className="text-[#f5f5f5] tabular-nums">
            T+ 00:00:00
          </p>
          <p className="text-[#737373]">Reloj de ejecución</p>
        </div>
        <div className="absolute top-14 right-2 sm:right-4 space-y-0.5 text-right">
          <p>
            Estado <span ref={elevRef} className="text-[#06B6D4] tabular-nums">0% SYNC</span>
          </p>
          <p className="text-[#737373]">Partículas S-Isométrica</p>
        </div>
      </div>
    </section>
  );
}
