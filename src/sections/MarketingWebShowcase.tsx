import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FlaskConical,
  Globe,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { onFrame } from '@/lib/scroll';
import { clamp, lerp, range, sceneProgress } from '@/lib/math';
import {
  marketingSeoStack,
  marketingWebProjects,
  type MarketingWebProject,
  type WebProjectStage,
} from '@/data/synjiStory';

const STAGES: {
  id: WebProjectStage;
  num: string;
  label: string;
  shortLabel: string;
  badgeColor: string;
  dotColor: string;
  description: string;
}[] = [
  {
    id: 'desplegado',
    num: '01',
    label: 'Desplegados & En Producción',
    shortLabel: 'Desplegados',
    badgeColor: 'text-[#10B981] border-[#10B981]/35 bg-[#10B981]/10',
    dotColor: 'bg-[#10B981]',
    description: 'Webs públicas, medios editoriales y estrategias de Growth/SEO operando con tráfico y usuarios reales.',
  },
  {
    id: 'en-proceso',
    num: '02',
    label: 'En Proceso & Piloto Activo',
    shortLabel: 'En Proceso',
    badgeColor: 'text-[#06B6D4] border-[#06B6D4]/35 bg-[#06B6D4]/10',
    dotColor: 'bg-[#06B6D4]',
    description: 'Proyectos web, auditorías de recorrido comercial, migraciones CRM y rediseños en entorno staging.',
  },
  {
    id: 'en-desarrollo',
    num: '03',
    label: 'En Desarrollo & Laboratorio SEO/GEO',
    shortLabel: 'En Desarrollo',
    badgeColor: 'text-[#8B5CF6] border-[#8B5CF6]/35 bg-[#8B5CF6]/10',
    dotColor: 'bg-[#8B5CF6]',
    description: 'Sistemas multicliente con pruebas automatizadas, aplicaciones web verticales (SaaS/TPV) y motores orgánicos.',
  },
];

export function MarketingWebShowcase() {
  const stageRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridWrapRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const progressFillRef = useRef<HTMLSpanElement | null>(null);

  const [activeStage, setActiveStage] = useState<WebProjectStage>('desplegado');
  const [manualLock, setManualLock] = useState(false);
  const [focusedCardIdx, setFocusedCardIdx] = useState(0);
  const [selectedProject, setSelectedProject] = useState<MarketingWebProject | null>(null);

  useEffect(() => {
    let lastStage: WebProjectStage = 'desplegado';
    let lastCard = 0;

    return onFrame(() => {
      const anchor = document.getElementById('marketing-web');
      const stage = stageRef.current;
      if (!anchor || !stage) return;

      const { p, vis, enter, exit, active } = sceneProgress(anchor);

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, ${lerp(24, 0, enter) - exit * 18}px, 0) scale(${lerp(0.96, 1, enter)})`;
      }
      if (footerRef.current) {
        footerRef.current.style.transform = `translate3d(0, ${lerp(28, 0, enter) + exit * 20}px, 0)`;
      }

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${clamp(p, 0, 1)})`;
      }

      // Si el usuario no ha fijado manualmente una pestaña, el scroll recorre las 3 fases:
      // 0.00 - 0.35 -> Desplegados
      // 0.35 - 0.68 -> En Proceso
      // 0.68 - 1.00 -> En Desarrollo
      let targetStage: WebProjectStage = lastStage;
      let localP = 0;
      if (!manualLock) {
        if (p < 0.35) {
          targetStage = 'desplegado';
          localP = range(p, 0.04, 0.33);
        } else if (p < 0.68) {
          targetStage = 'en-proceso';
          localP = range(p, 0.36, 0.66);
        } else {
          targetStage = 'en-desarrollo';
          localP = range(p, 0.69, 0.96);
        }

        if (targetStage !== lastStage) {
          lastStage = targetStage;
          setActiveStage(targetStage);
        }
      } else {
        localP = range(p, 0.05, 0.95);
      }

      const activeCard = clamp(Math.floor(localP * 4), 0, 3);
      if (activeCard !== lastCard) {
        lastCard = activeCard;
        setFocusedCardIdx(activeCard);
      }

      if (gridWrapRef.current) {
        const zScale = lerp(0.94, 1, enter) - exit * 0.04;
        const zY = lerp(32, 0, enter) - exit * 24;
        gridWrapRef.current.style.transform = `translate3d(0, ${zY}px, 0) scale(${zScale})`;
      }

      // Micro-movimiento de profundidad en las 4 tarjetas de la fase visible
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const dist = Math.abs(localP * 3 - i);
        const focus = clamp(1 - dist * 0.45, 0.78, 1);
        const lift = i === activeCard ? -3 : 0;
        card.style.transform = `translate3d(0, ${lift}px, 0) scale(${lerp(0.985, 1.01, focus)})`;
      });
    });
  }, [manualLock]);

  const currentStageMeta = STAGES.find((s) => s.id === activeStage) || STAGES[0];
  const visibleProjects = marketingWebProjects.filter((p) => p.stage === activeStage);

  return (
    <section
      ref={stageRef}
      aria-labelledby="marketing-web-title"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden pt-16 pb-9 px-4 sm:px-6"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col justify-between gap-2.5">
        {/* 1. Cabecera + Selector de Estado (Desplegados / En Proceso / En Desarrollo) */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-2.5 border-b border-white/[0.08] pb-2.5 shrink-0 will-change-transform"
        >
          <div className="space-y-1">
            <h2
              id="marketing-web-title"
              className="font-mono text-lg sm:text-2xl lg:text-[26px] font-bold text-[#f5f5f5] tracking-tight leading-tight"
            >
              Marketing Digital, SEO/GEO y Proyectos Web: del tráfico al sistema.
            </h2>
            <p className="font-mono text-[11px] text-[#06B6D4] uppercase tracking-wider flex flex-wrap items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>
                CAP. 04 · {currentStageMeta.num}/03 {currentStageMeta.label.toUpperCase()} (EL SCROLL RECORRE LOS 3 ESTADOS)
              </span>
            </p>
          </div>

          {/* Botonera de los 3 estados + barra de progreso */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {STAGES.map((st) => {
              const isSelected = activeStage === st.id;
              const count = marketingWebProjects.filter((p) => p.stage === st.id).length;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setManualLock(true);
                    setActiveStage(st.id);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                    isSelected
                      ? 'border-[#06B6D4]/60 bg-[#06B6D4]/15 text-[#f5f5f5]'
                      : 'border-white/[0.08] bg-[#121212] text-[#a3a3a3] hover:text-[#f5f5f5]'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${st.dotColor}`} />
                  <span>{st.shortLabel}</span>
                  <span className="text-[10px] text-[#737373]">({count})</span>
                </button>
              );
            })}
            {manualLock && (
              <button
                type="button"
                onClick={() => setManualLock(false)}
                className="rounded-full border border-white/[0.1] bg-[#181818] px-2.5 py-1 font-mono text-[10px] text-[#06B6D4] hover:border-[#06B6D4]/40"
              >
                Auto-scroll
              </button>
            )}
          </div>
        </div>

        {/* 2. Matriz central de 4 proyectos del estado activo (sin recortes ni desbordamiento) */}
        <div
          ref={gridWrapRef}
          className="relative flex-1 min-h-0 flex flex-col justify-center will-change-transform overflow-y-auto lg:overflow-visible py-0.5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {visibleProjects.map((proj, idx) => {
              const isHighlighted = idx === focusedCardIdx;
              return (
                <article
                  key={proj.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => setSelectedProject(proj)}
                  className={`group cursor-pointer rounded-2xl border p-3.5 sm:p-4 backdrop-blur-md transition-colors flex flex-col justify-between gap-2.5 ${
                    isHighlighted
                      ? 'border-[#06B6D4]/55 bg-[#121212]/95'
                      : 'border-white/[0.08] bg-[#121212]/85 hover:border-white/[0.2]'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Fila superior: Estado + Dominio / Acción */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${currentStageMeta.badgeColor}`}
                      >
                        {proj.stage === 'desplegado' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : proj.stage === 'en-proceso' ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <FlaskConical className="h-3 w-3" />
                        )}
                        <span>{proj.stageLabel}</span>
                      </span>

                      {proj.domainLabel && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#a3a3a3]">
                          <Globe className="h-3 w-3 text-[#06B6D4]" />
                          <span>{proj.domainLabel}</span>
                        </span>
                      )}
                    </div>

                    {/* Título completo + rol */}
                    <div>
                      <h3 className="font-mono text-sm sm:text-base font-bold text-[#f5f5f5] leading-snug">
                        {proj.title}
                      </h3>
                      <p className="font-mono text-[11px] text-[#06B6D4] mt-0.5">
                        {proj.category} · <span className="text-[#a3a3a3]">{proj.role}</span>
                      </p>
                    </div>

                    {/* Resumen de proyecto */}
                    <p className="text-xs text-[#d4d4d4] leading-relaxed">
                      {proj.summary}
                    </p>

                    {/* Bloque específico de SEO / Growth / Arquitectura Web */}
                    <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0a]/85 p-2.5 space-y-1">
                      <p className="font-mono text-[10px] text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        <span>INTERVENCIÓN SEO, GROWTH & ARQUITECTURA WEB</span>
                      </p>
                      <p className="text-[11px] text-[#a3a3a3] leading-relaxed">
                        {proj.seoAndGrowthWork}
                      </p>
                    </div>
                  </div>

                  {/* Stack y enlaces */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {proj.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-white/[0.08] bg-[#0a0a0a] px-1.5 py-0.5 font-mono text-[10px] text-[#a3a3a3]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-1 font-mono text-[10px] text-[#f5f5f5] hover:bg-[#06B6D4] hover:text-[#0a0a0a] transition-colors"
                        >
                          <span>Visitar</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      <span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-[#06B6D4] group-hover:translate-x-0.5 transition-transform">
                        <span>Detalle</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 3. Barra inferior: Stack de herramientas SEO/GEO/Growth + Progreso */}
        <div
          ref={footerRef}
          className="rounded-xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md px-3.5 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 shrink-0 will-change-transform"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {marketingSeoStack.map((grp) => (
              <div key={grp.group} className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#06B6D4] font-semibold">
                  {grp.group}:
                </span>
                <span className="font-mono text-[11px] text-[#a3a3a3]">
                  {grp.items.join(' · ')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-[10px] text-[#a3a3a3] uppercase">
              FASE {currentStageMeta.num}/03
            </span>
            <span className="relative h-1 w-24 bg-white/15 overflow-hidden rounded-full">
              <span
                ref={progressFillRef}
                className="absolute inset-0 origin-left bg-[#06B6D4]"
                style={{ transform: 'scaleX(0)' }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Modal de detalle del proyecto Web / Marketing / SEO */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${selectedProject.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070c]/85 backdrop-blur-md p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#121212] p-5 sm:p-7 space-y-4 max-h-[88svh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.08]">
              <div className="space-y-1">
                <h3 className="font-mono text-lg sm:text-2xl font-bold text-[#f5f5f5]">
                  {selectedProject.title}
                </h3>
                <p className="font-mono text-xs text-[#06B6D4]">
                  {selectedProject.category} · {selectedProject.role}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Cerrar detalle"
                className="rounded-full border border-white/[0.1] bg-[#181818] p-2 text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-3 py-1 font-mono text-xs text-[#06B6D4]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{selectedProject.stageLabel}</span>
              </span>
              {selectedProject.domainLabel && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0a0a0a] px-3 py-1 font-mono text-xs text-[#a3a3a3]">
                  <Globe className="h-3.5 w-3.5 text-[#06B6D4]" />
                  <span>{selectedProject.domainLabel}</span>
                </span>
              )}
            </div>

            <p className="text-sm text-[#f5f5f5]/90 leading-relaxed">
              {selectedProject.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#8B5CF6]">
                  <Search className="h-4 w-4" />
                  <span>SEO, GROWTH & ARQUITECTURA</span>
                </div>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  {selectedProject.seoAndGrowthWork}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#10B981]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>ENTREGABLE Y ESTADO</span>
                </div>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  {selectedProject.deliverable}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/[0.08] bg-[#0a0a0a] px-2.5 py-1 font-mono text-[11px] text-[#a3a3a3]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {selectedProject.url && (
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-4 py-1.5 font-mono text-xs font-medium text-[#0a0a0a] hover:bg-white"
                >
                  <span>Abrir proyecto / web</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
