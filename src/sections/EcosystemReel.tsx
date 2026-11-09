import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Cpu,
  ExternalLink,
  FolderGit2,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';
import { onFrame } from '@/lib/scroll';
import { clamp, lerp, range, sceneProgress } from '@/lib/math';
import { ecosystemProjects, type EcosystemProject } from '@/data/synjiStory';

export function EcosystemReel() {
  const stageRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);

  const [focusedIdx, setFocusedIdx] = useState(0);
  const [inspectedProject, setInspectedProject] = useState<EcosystemProject | null>(null);

  useEffect(() => {
    let currentNearest = 0;

    return onFrame(() => {
      const anchor = document.getElementById('ecosistema');
      const stage = stageRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!anchor || !stage || !viewport || !track) return;

      const { p, vis, enter, exit, active } = sceneProgress(anchor);

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, ${lerp(24, 0, enter) - exit * 20}px, 0) scale(${lerp(0.96, 1, enter)})`;
      }
      if (footerRef.current) {
        footerRef.current.style.transform = `translate3d(0, ${lerp(28, 0, enter) + exit * 22}px, 0)`;
      }

      const vpRect = viewport.getBoundingClientRect();
      const k = range(p, 0.05, 0.94);
      const maxTravel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const entryOffset = (1 - enter) * 90 - exit * 80;
      track.style.transform = `translate3d(${-k * maxTravel + entryOffset}px, 0, 0)`;

      // Punto focal a un 35% del contenedor para que la tarjeta activa destaque sin salirse
      const focalX = vpRect.left + vpRect.width * 0.36;
      let nearest = 0;
      let best = Infinity;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const off = (center - focalX) / Math.max(1, vpRect.width);
        const a = clamp(Math.abs(off) * 1.25);

        card.style.opacity = String(1 - a * 0.35);
        card.style.transform = `scale(${1 - a * 0.045})`;

        const img = imgRefs.current[i];
        if (img) {
          img.style.transform = `translate3d(${clamp(off, -1, 1) * -28}px, 0, 0) scale(1.08)`;
        }

        if (Math.abs(off) < best) {
          best = Math.abs(off);
          nearest = i;
        }
      });

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${k})`;
      }
      if (countRef.current) {
        countRef.current.textContent = `0${nearest + 1}`;
      }
      if (nearest !== currentNearest) {
        currentNearest = nearest;
        setFocusedIdx(nearest);
      }
    });
  }, []);

  const activeEntry = ecosystemProjects[focusedIdx] || ecosystemProjects[0];

  return (
    <section
      ref={stageRef}
      aria-labelledby="ecosistema-title"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden pt-16 pb-4 sm:pb-8 px-3.5 sm:px-6"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col justify-between gap-2">
        {/* 1. Cabecera compacta dentro del presupuesto de altura */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-1.5 sm:gap-2 border-b border-white/[0.08] pb-2 shrink-0 will-change-transform"
        >
          <div className="space-y-0.5 sm:space-y-1">
            <h2
              id="ecosistema-title"
              className="font-mono text-base sm:text-2xl lg:text-[26px] font-bold text-[#f5f5f5] tracking-tight leading-snug"
            >
              Si digo que hago algo, tiene que existir la herramienta funcionando.
            </h2>
            <p className="font-mono text-[10px] sm:text-[11px] text-[#06B6D4] uppercase tracking-wider flex flex-wrap items-center gap-1.5">
              <FolderGit2 className="h-3.5 w-3.5 shrink-0" />
              <span>CAP. 03 · ECOSISTEMA DE SISTEMAS Y REPOSITORIOS (@SPLURTCH · 19 REPOS)</span>
            </p>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-2.5 font-mono text-xs text-[#a3a3a3]">
              <span className="tabular-nums">
                <span ref={countRef} className="text-[#f5f5f5] font-bold">
                  01
                </span>{' '}
                / 0{ecosystemProjects.length}
              </span>
              <span className="relative h-1 w-24 sm:w-28 bg-white/15 overflow-hidden rounded-full">
                <span
                  ref={barRef}
                  className="absolute inset-0 origin-left bg-[#06B6D4]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
            </div>

            <a
              href="https://github.com/Splurtch?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#121212] px-3 py-1 font-mono text-[11px] text-[#f5f5f5] hover:border-[#06B6D4]/50 transition-colors"
            >
              <span>GitHub @Splurtch</span>
              <ExternalLink className="h-3 w-3 text-[#06B6D4]" />
            </a>
          </div>
        </div>

        {/* 2. Ventana acotada del carrete horizontal: nunca se desborda ni corta textos */}
        <div
          ref={viewportRef}
          className="relative flex-1 min-h-0 w-full flex items-center overflow-hidden py-1"
        >
          <ol
            ref={trackRef}
            className="flex items-stretch gap-4 sm:gap-5 px-1 sm:px-2 will-change-transform"
          >
            {ecosystemProjects.map((entry, i) => {
              const isFocused = i === focusedIdx;
              return (
                <li
                  key={entry.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="w-[84vw] sm:w-[350px] lg:w-[385px] shrink-0 flex flex-col transition-transform duration-150"
                >
                  <article
                    onClick={() => setInspectedProject(entry)}
                    className={`group cursor-pointer flex h-full flex-col justify-between rounded-2xl border p-3.5 sm:p-4 backdrop-blur-md transition-colors ${
                      isFocused
                        ? 'border-[#06B6D4]/55 bg-[#121212]/95'
                        : 'border-white/[0.08] bg-[#121212]/85 hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Imagen panorámica compacta para dejar espacio completo al texto */}
                      <div className="relative h-24 sm:h-28 lg:h-32 w-full overflow-hidden rounded-xl bg-[#05070c]">
                        <img
                          ref={(el) => {
                            imgRefs.current[i] = el;
                          }}
                          src={entry.image}
                          alt={entry.title}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover will-change-transform opacity-85 transition-opacity group-hover:opacity-100"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-85"
                        />

                        <span className="absolute top-2.5 left-2.5 rounded-full border border-white/[0.12] bg-[#0a0a0a]/85 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-[#06B6D4] uppercase backdrop-blur">
                          0{i + 1} · {entry.clusterLabel}
                        </span>

                        <span className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[10px] text-[#10B981]">
                          <span className="bg-[#0a0a0a]/90 px-2 py-0.5 rounded border border-white/[0.08]">
                            {entry.statusTag}
                          </span>
                        </span>
                      </div>

                      {/* Título y resumen completos sin truncate ni recortes */}
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-mono text-sm sm:text-base font-bold text-[#f5f5f5] leading-snug">
                            {entry.title}
                          </h3>
                          <span className="shrink-0 font-mono text-[10px] text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded px-1.5 py-0.5">
                            {entry.role}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed text-[#d4d4d4]">
                          {entry.summary}
                        </p>
                      </div>

                      {/* Entregable real visible directamente en la tarjeta */}
                      <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0a]/85 p-2.5 space-y-1">
                        <p className="font-mono text-[10px] text-[#06B6D4] uppercase tracking-wider">
                          ENTREGABLE VERIFICADO
                        </p>
                        <p className="text-[11px] text-[#a3a3a3] leading-relaxed">
                          {entry.deliverable}
                        </p>
                      </div>
                    </div>

                    {/* Pie de tarjeta con stack completo y acciones */}
                    <div className="pt-2.5 mt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {entry.stack.map((t) => (
                          <span
                            key={t}
                            className="rounded border border-white/[0.08] bg-[#0a0a0a] px-1.5 py-0.5 font-mono text-[10px] text-[#a3a3a3]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <span className="shrink-0 inline-flex items-center gap-1 font-mono text-[11px] text-[#06B6D4] group-hover:translate-x-0.5 transition-transform">
                        <span>Ficha</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        {/* 3. Barra inferior de telemetría del proyecto en foco (en móvil se compacta en 1 línea) */}
        <div
          ref={footerRef}
          className="rounded-xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2 shrink-0 will-change-transform"
        >
          <div className="flex items-center gap-2 text-xs min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/25 rounded px-2 py-0.5 shrink-0">
              0{focusedIdx + 1}/0{ecosystemProjects.length}
            </span>
            <span className="font-mono font-bold text-[#f5f5f5] truncate">
              {activeEntry.title}
            </span>
            <span className="hidden md:inline text-[#a3a3a3] text-xs truncate">
              — {activeEntry.problemSolved}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setInspectedProject(activeEntry)}
              className="rounded-full border border-[#06B6D4]/40 bg-[#06B6D4]/10 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-colors"
            >
              Arquitectura →
            </button>
            {activeEntry.link && (
              <a
                href={activeEntry.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2.5 py-1 font-mono text-[10px] sm:text-[11px] font-medium text-[#0a0a0a] hover:bg-white"
              >
                <span>Demo</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal de inspección de arquitectura */}
      {inspectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Arquitectura de ${inspectedProject.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070c]/85 backdrop-blur-md p-4"
          onClick={() => setInspectedProject(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#121212] p-5 sm:p-7 space-y-4 max-h-[88svh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.08]">
              <div className="space-y-1">
                <h3 className="font-mono text-lg sm:text-2xl font-bold text-[#f5f5f5]">
                  {inspectedProject.title}
                </h3>
                <p className="font-mono text-xs text-[#06B6D4]">
                  {inspectedProject.role} · {inspectedProject.clusterLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedProject(null)}
                aria-label="Cerrar inspector"
                className="rounded-full border border-white/[0.1] bg-[#181818] p-2 text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 font-mono text-xs text-[#10B981]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{inspectedProject.statusTag}</span>
            </div>

            <p className="text-sm text-[#f5f5f5]/90 leading-relaxed">
              {inspectedProject.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#8B5CF6]">
                  <Layers className="h-4 w-4" />
                  <span>PROBLEMA QUE RESUELVE</span>
                </div>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  {inspectedProject.problemSolved}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#06B6D4]">
                  <Cpu className="h-4 w-4" />
                  <span>ENTREGABLE EN PRODUCCIÓN</span>
                </div>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  {inspectedProject.deliverable}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {inspectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/[0.08] bg-[#0a0a0a] px-2.5 py-1 font-mono text-[11px] text-[#a3a3a3]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {inspectedProject.link && (
                  <a
                    href={inspectedProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-4 py-1.5 font-mono text-xs font-medium text-[#0a0a0a] hover:bg-white"
                  >
                    <span>Abrir web / demo</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {inspectedProject.github && (
                  <a
                    href={inspectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#0a0a0a] px-4 py-1.5 font-mono text-xs text-[#f5f5f5] hover:border-white/[0.25]"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
