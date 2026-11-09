import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Compass } from 'lucide-react';
import { onFrame } from '@/lib/scroll';
import { clamp, easeOutCubic, lerp, range, sceneProgress } from '@/lib/math';
import { trajectoryStages } from '@/data/synjiStory';

const WINDOW = [0.06, 0.92] as const;
const TOTAL_HOURS = 15400;

const ORIGIN_NODE = { cx: 180, cy: 290, r: 68 };
const DEST_NODE = { cx: 1010, cy: 250, r: 54 };

const LEGS = [
  `M${ORIGIN_NODE.cx} ${ORIGIN_NODE.cy - 96} a96 96 0 1 1 -0.1 0 a96 96 0 0 1 82 44`,
  `M${ORIGIN_NODE.cx + 82} ${ORIGIN_NODE.cy - 52} C 380 70, 510 430, 620 220`,
  `M620 220 C 710 70, 830 95, ${DEST_NODE.cx - 24} ${DEST_NODE.cy - 78}`,
  `M${DEST_NODE.cx - 24} ${DEST_NODE.cy - 78} a74 74 0 1 1 -0.1 0.2 a74 74 0 0 1 24 24`,
];

export function TrajectoryZigzag({ reducedMotion }: { reducedMotion: boolean }) {
  const stageRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const mapWrapRef = useRef<HTMLDivElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const legRefs = useRef<SVGPathElement[]>([]);
  const capsuleRef = useRef<SVGGElement | null>(null);
  const hoursRef = useRef<HTMLSpanElement | null>(null);
  const [leg, setLeg] = useState(0);
  const manualOverrideRef = useRef<number>(0);

  useEffect(() => {
    let current = 0;

    return onFrame(() => {
      const anchor = document.getElementById('zigzag');
      const stage = stageRef.current;
      if (!anchor || !stage) return;

      const { p, vis, enter, exit, active } = sceneProgress(anchor);

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, ${lerp(-22, 0, enter) - exit * 18}px, 0)`;
      }
      if (mapWrapRef.current) {
        const s = lerp(0.9, 1, enter) + exit * 0.06;
        mapWrapRef.current.style.transform = `scale(${s.toFixed(3)})`;
      }
      if (consoleRef.current) {
        consoleRef.current.style.transform = `translate3d(0, ${lerp(28, 0, enter) + exit * 20}px, 0) scale(${lerp(0.96, 1, enter)})`;
      }

      const u = range(p, WINDOW[0], WINDOW[1]) * LEGS.length;
      const s = clamp(Math.floor(u), 0, LEGS.length - 1);

      if (Date.now() - manualOverrideRef.current > 2400 && s !== current) {
        current = s;
        setLeg(s);
      }

      legRefs.current.forEach((path, i) => {
        if (!path) return;
        const k = reducedMotion ? 1 : easeOutCubic(clamp(u - i));
        path.style.strokeDashoffset = String(1 - k);
        if (i === s && capsuleRef.current) {
          const total = path.getTotalLength();
          const pt = path.getPointAtLength(total * k);
          capsuleRef.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        }
      });

      if (hoursRef.current) {
        const progress = easeOutCubic(clamp(u / LEGS.length));
        hoursRef.current.textContent = Math.round(progress * TOTAL_HOURS).toLocaleString('es-ES');
      }
    });
  }, [reducedMotion]);

  const currentStage = trajectoryStages[leg] || trajectoryStages[0];

  const handleSelectLeg = useCallback((idx: number) => {
    manualOverrideRef.current = Date.now();
    setLeg(idx);
  }, []);

  return (
    <section
      ref={stageRef}
      aria-labelledby="zigzag-title"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-3.5 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-6 md:px-[5vw]"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior compacta */}
      <div
        ref={headerRef}
        className="flex flex-col gap-1.5 sm:gap-2.5 lg:flex-row lg:items-end lg:justify-between shrink-0 will-change-transform"
      >
        <div className="space-y-1">
          <h2
            id="zigzag-title"
            className="font-mono text-base sm:text-2xl lg:text-3xl font-bold text-[#f5f5f5] tracking-tight leading-snug"
          >
            No ha sido una línea recta; ha sido un entrenamiento cruzado.
          </h2>
          <p className="font-mono text-[10px] sm:text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span>CAP. 02 · TRAZADO ORBITAL DE 4 ETAPAS (DESLIZA O PULSA CADA TRAMO)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 sm:gap-3 font-mono text-xs text-[#a3a3a3] shrink-0">
          {/* Botonera rápida de tramos (ideal para móvil y escritorio) */}
          <div className="flex items-center gap-1">
            {trajectoryStages.map((st, i) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectLeg(i)}
                className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] transition-colors ${
                  i === leg
                    ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                    : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3] hover:text-[#f5f5f5]'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>

          <span className="uppercase text-[11px] sm:text-xs">
            Terreno:{' '}
            <span ref={hoursRef} className="text-[#f5f5f5] font-bold tabular-nums">
              0
            </span>{' '}
            h
          </span>
        </div>
      </div>

      {/* Mapa SVG central (altura flexible controlada para no empujar la tarjeta en móvil) */}
      <div
        ref={mapWrapRef}
        className="relative flex min-h-0 flex-1 items-center justify-center my-1 will-change-transform max-h-[24svh] sm:max-h-[34svh] lg:max-h-none"
      >
        <svg
          viewBox="0 0 1200 460"
          className="h-full max-h-full w-full"
          role="img"
          aria-label="Trayectoria en cuatro etapas desde Neurociencias hasta DigitalSynapse e IA."
        >
          <defs>
            <clipPath id="origin-clip">
              <circle cx={ORIGIN_NODE.cx} cy={ORIGIN_NODE.cy} r={ORIGIN_NODE.r} />
            </clipPath>
            <clipPath id="dest-clip">
              <circle cx={DEST_NODE.cx} cy={DEST_NODE.cy} r={DEST_NODE.r} />
            </clipPath>
            <radialGradient id="synapse-node-glow">
              <stop offset="0.6" stopColor="#06B6D4" stopOpacity="0.32" />
              <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="flight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          <g fill="#f5f5f5">
            {Array.from({ length: 48 }, (_, i) => (
              <circle
                key={i}
                cx={(i * 179) % 1200}
                cy={(i * 89) % 460}
                r={i % 6 === 0 ? 1.4 : 0.75}
                opacity={0.1 + ((i * 29) % 40) / 100}
              />
            ))}
          </g>

          <circle
            cx={ORIGIN_NODE.cx}
            cy={ORIGIN_NODE.cy}
            r={ORIGIN_NODE.r * 1.25}
            fill="url(#synapse-node-glow)"
          />
          <circle
            cx={ORIGIN_NODE.cx}
            cy={ORIGIN_NODE.cy}
            r={ORIGIN_NODE.r}
            fill="#121212"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          <image
            href={`${import.meta.env.BASE_URL}synji-hero.webp`}
            x={ORIGIN_NODE.cx - ORIGIN_NODE.r}
            y={ORIGIN_NODE.cy - ORIGIN_NODE.r}
            width={ORIGIN_NODE.r * 2}
            height={ORIGIN_NODE.r * 2}
            clipPath="url(#origin-clip)"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.82"
          />

          <circle cx="430" cy="245" r="10" fill="#121212" stroke="#8B5CF6" strokeWidth="2.5" />
          <circle cx="430" cy="245" r="4" fill="#8B5CF6" />

          <circle cx="620" cy="220" r="12" fill="#121212" stroke="#06B6D4" strokeWidth="2.5" />
          <circle cx="620" cy="220" r="4.5" fill="#06B6D4" />

          <circle
            cx={DEST_NODE.cx}
            cy={DEST_NODE.cy}
            r={DEST_NODE.r * 1.3}
            fill="url(#synapse-node-glow)"
          />
          <circle
            cx={DEST_NODE.cx}
            cy={DEST_NODE.cy}
            r={DEST_NODE.r}
            fill="#121212"
            stroke="#06B6D4"
            strokeWidth="2.5"
          />
          <image
            href={`${import.meta.env.BASE_URL}portraits/editorial.webp`}
            x={DEST_NODE.cx - DEST_NODE.r}
            y={DEST_NODE.cy - DEST_NODE.r}
            width={DEST_NODE.r * 2}
            height={DEST_NODE.r * 2}
            clipPath="url(#dest-clip)"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.92"
          />

          {LEGS.map((d, i) => (
            <path
              key={`ghost-${i}`}
              d={d}
              fill="none"
              stroke="#f5f5f5"
              strokeOpacity="0.1"
              strokeWidth="1.5"
              strokeDasharray="4 7"
            />
          ))}
          {LEGS.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                if (el) legRefs.current[i] = el;
              }}
              d={d}
              pathLength={1}
              fill="none"
              stroke="url(#flight-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1 1"
              strokeDashoffset="1"
            />
          ))}

          <g
            ref={capsuleRef}
            transform={`translate(${ORIGIN_NODE.cx} ${ORIGIN_NODE.cy - 96})`}
          >
            <circle r="13" fill="#06B6D4" opacity="0.28" />
            <circle r="5.5" fill="#f5f5f5" />
          </g>

          <g fontFamily="JetBrains Mono, monospace" fontSize="12" letterSpacing="1.4" fill="#a3a3a3">
            <text x={ORIGIN_NODE.cx} y={ORIGIN_NODE.cy + ORIGIN_NODE.r + 36} textAnchor="middle">
              2011 · NEUROCIENCIA & P300
            </text>
            <text x="430" y="278" textAnchor="middle">
              BARRO COMERCIAL & RRHH
            </text>
            <text x="620" y="254" textAnchor="middle">
              +10 AÑOS DOCENCIA FPE
            </text>
            <text x={DEST_NODE.cx} y={DEST_NODE.cy + DEST_NODE.r + 38} textAnchor="middle" fill="#06B6D4">
              2026 · DIGITALSYNAPSE & IA
            </text>
          </g>
        </svg>
      </div>

      {/* Consola inferior del tramo activo (ajustada para móvil y escritorio sin desbordar) */}
      <div
        ref={consoleRef}
        className="rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-3.5 sm:p-5 shrink-0 will-change-transform"
      >
        <div className="grid gap-3 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="font-mono text-[10px] sm:text-xs font-bold text-[#06B6D4] uppercase">
                {currentStage.phase}
              </span>
              <span className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#06B6D4] tabular-nums">
                {currentStage.period} · TRAMO {leg + 1}/{trajectoryStages.length}
              </span>
            </div>
            <h3 className="font-mono text-sm sm:text-lg font-bold text-[#f5f5f5] leading-snug">
              {currentStage.title}
            </h3>
            <p className="text-xs text-[#d4d4d4] leading-relaxed">
              {currentStage.body}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-2 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-2.5 lg:pt-0 lg:pl-5">
            <div className="space-y-1.5">
              {currentStage.highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center justify-between gap-2 rounded-lg bg-[#0a0a0a]/85 px-2.5 py-1.5 text-[11px] sm:text-xs"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[#f5f5f5] min-w-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#06B6D4] shrink-0" />
                    <span className="leading-tight">{h.label}</span>
                  </span>
                  {h.link && (
                    <a
                      href={h.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] text-[#06B6D4] hover:underline shrink-0"
                    >
                      <span>Ver</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#737373] uppercase truncate">
                {currentStage.evidenceTag}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {trajectoryStages.map((st, i) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectLeg(i)}
                    aria-label={`Ver etapa ${i + 1}: ${st.phase}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === leg
                        ? 'w-7 bg-[#06B6D4]'
                        : i < leg
                          ? 'w-3.5 bg-[#3B82F6]/60'
                          : 'w-3.5 bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
