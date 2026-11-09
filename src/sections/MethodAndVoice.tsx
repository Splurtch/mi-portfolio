import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  GraduationCap,
  MessageSquareQuote,
  Wrench,
} from 'lucide-react';
import { onFrame } from '@/lib/scroll';
import { clamp, lerp, range, sceneProgress, smoothstep } from '@/lib/math';
import {
  academicWorks,
  educationCredentials,
  newsletterIssues,
  workMoments,
} from '@/data/synjiStory';
import { synjiVoiceSamples } from '@/data/synjiPersonal';

/**
 * Capítulo 04 — Método, Voz Synji & Publicaciones (100% Scrollytelling en cámara fija):
 * El scroll recorre 3 sub-escenas espaciales sin que la página baje como un documento:
 *   - Sub-acto 01 (0.00 – 0.36): Los 3 Momentos de Intervención (Observar -> Construir -> Verificar)
 *   - Sub-acto 02 (0.32 – 0.68): Lector Voz Synji (cambia de nota con el scroll) + Ctrl + Alt + Pensar
 *   - Sub-acto 03 (0.64 – 1.00): Publicaciones Científicas (Nereis, Nova Science, P300) + Títulos Oficiales
 */

export function MethodAndVoice() {
  const stageRef = useRef<HTMLElement | null>(null);
  const act1Ref = useRef<HTMLDivElement | null>(null);
  const act2Ref = useRef<HTMLDivElement | null>(null);
  const act3Ref = useRef<HTMLDivElement | null>(null);
  const momentCardRefs = useRef<(HTMLElement | null)[]>([]);
  const barFillRef = useRef<HTMLSpanElement | null>(null);

  const [subAct, setSubAct] = useState<0 | 1 | 2>(0);
  const [activeMomentIdx, setActiveMomentIdx] = useState(0);
  const [selectedNoteIdx, setSelectedNoteIdx] = useState(0);
  const manualSubActRef = useRef<number>(0);
  const manualNoteRef = useRef<number>(0);

  useEffect(() => {
    let curSub: 0 | 1 | 2 = 0;
    let curMoment = 0;
    let curNote = 0;

    return onFrame(() => {
      const anchor = document.getElementById('metodo');
      const stage = stageRef.current;
      if (!anchor || !stage) return;

      const { p, vis, active } = sceneProgress(anchor);

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      }

      const now = Date.now();
      const autoSub: 0 | 1 | 2 = p < 0.35 ? 0 : p < 0.68 ? 1 : 2;
      if (now - manualSubActRef.current > 2600 && autoSub !== curSub) {
        curSub = autoSub;
        setSubAct(autoSub);
      }

      const effectiveSub = now - manualSubActRef.current <= 2600 ? subAct : autoSub;

      // Pesos de visibilidad para cada uno de los 3 sub-actos en el espacio Z
      const w1 =
        now - manualSubActRef.current <= 2600
          ? effectiveSub === 0
            ? 1
            : 0
          : 1 - smoothstep(range(p, 0.31, 0.39));
      const w2 =
        now - manualSubActRef.current <= 2600
          ? effectiveSub === 1
            ? 1
            : 0
          : smoothstep(range(p, 0.31, 0.39)) * (1 - smoothstep(range(p, 0.64, 0.72)));
      const w3 =
        now - manualSubActRef.current <= 2600
          ? effectiveSub === 2
            ? 1
            : 0
          : smoothstep(range(p, 0.64, 0.72));

      if (act1Ref.current) {
        act1Ref.current.style.opacity = String(w1);
        act1Ref.current.style.visibility = w1 > 0.02 ? 'visible' : 'hidden';
        act1Ref.current.style.pointerEvents = w1 > 0.4 ? 'auto' : 'none';
        act1Ref.current.style.transform = `translate3d(0, ${(1 - w1) * -28}px, 0) scale(${lerp(0.92, 1, w1)})`;
      }

      if (act2Ref.current) {
        act2Ref.current.style.opacity = String(w2);
        act2Ref.current.style.visibility = w2 > 0.02 ? 'visible' : 'hidden';
        act2Ref.current.style.pointerEvents = w2 > 0.4 ? 'auto' : 'none';
        act2Ref.current.style.transform = `translate3d(0, ${(1 - w2) * 28}px, 0) scale(${lerp(0.92, 1, w2)})`;
      }

      if (act3Ref.current) {
        act3Ref.current.style.opacity = String(w3);
        act3Ref.current.style.visibility = w3 > 0.02 ? 'visible' : 'hidden';
        act3Ref.current.style.pointerEvents = w3 > 0.4 ? 'auto' : 'none';
        act3Ref.current.style.transform = `translate3d(0, ${(1 - w3) * 32}px, 0) scale(${lerp(0.92, 1, w3)})`;
      }

      // En Sub-acto 1: las 3 tarjetas de momento avanzan con el scroll
      const u1 = range(p, 0.02, 0.33) * workMoments.length;
      const mIdx = clamp(Math.floor(u1), 0, workMoments.length - 1);
      if (mIdx !== curMoment) {
        curMoment = mIdx;
        setActiveMomentIdx(mIdx);
      }
      momentCardRefs.current.forEach((card, i) => {
        if (!card) return;
        const delta = u1 - (i + 0.5);
        const dist = Math.abs(delta);
        const sc = lerp(0.93, 1.03, clamp(1 - dist * 0.75));
        const yOff = delta * -16;
        card.style.transform = `translate3d(0, ${yOff.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
      });

      // En Sub-acto 2: las 3 notas de Voz Synji rotan con el scroll si no se ha pulsado manualmente
      if (now - manualNoteRef.current > 3000 && p >= 0.33 && p <= 0.68) {
        const u2 = range(p, 0.35, 0.65) * synjiVoiceSamples.length;
        const nIdx = clamp(Math.floor(u2), 0, synjiVoiceSamples.length - 1);
        if (nIdx !== curNote) {
          curNote = nIdx;
          setSelectedNoteIdx(nIdx);
        }
      }
    });
  }, [subAct]);

  const currentNote = synjiVoiceSamples[selectedNoteIdx] || synjiVoiceSamples[0];

  const handleSelectSubAct = (idx: 0 | 1 | 2) => {
    manualSubActRef.current = Date.now();
    setSubAct(idx);
  };

  return (
    <section
      ref={stageRef}
      aria-label="Capítulo 4: Cómo Trabajo, Voz Synji y Publicaciones"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-4 pt-20 pb-6 sm:px-6 md:px-[5vw] md:pt-24"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior común de Cap. 04 + Selector de las 3 cámaras */}
      <div className="relative z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <h2 className="font-mono text-xl sm:text-3xl font-bold text-[#f5f5f5] tracking-tight">
            Método operativo, voz propia y base científica.
          </h2>
          <p className="font-mono text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            <span>CAP. 05 · EL SCROLL RECORRE LAS 3 DIMENSIONES (MÉTODO → VOZ → CIENCIA)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {[
            { idx: 0 as const, label: '01 · 3 Momentos' },
            { idx: 1 as const, label: '02 · Voz & Newsletter' },
            { idx: 2 as const, label: '03 · Ciencia & Títulos' },
          ].map((tab) => (
            <button
              key={tab.idx}
              type="button"
              onClick={() => handleSelectSubAct(tab.idx)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                subAct === tab.idx
                  ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                  : 'border border-white/[0.08] bg-[#121212]/90 text-[#a3a3a3] hover:text-[#f5f5f5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="hidden sm:inline-block relative h-1 w-20 rounded-full bg-white/15 overflow-hidden ml-1">
            <span
              ref={barFillRef}
              className="absolute inset-0 origin-left bg-[#06B6D4]"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
        </div>
      </div>

      {/* ESCENARIO CENTRAL SUPERPUESTO (las 3 sub-escenas viven en el mismo centro espacial) */}
      <div className="relative flex-1 min-h-0 flex items-center my-2">
        {/* SUB-ACTO 1: Los 3 Momentos de Intervención */}
        <div
          ref={act1Ref}
          className="absolute inset-x-0 grid grid-cols-1 lg:grid-cols-3 gap-5 will-change-transform"
        >
          {workMoments.map((m, i) => {
            const isFocused = i === activeMomentIdx;
            return (
              <article
                key={m.id}
                ref={(el) => {
                  momentCardRefs.current[i] = el;
                }}
                className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 backdrop-blur-md transition-colors duration-300 will-change-transform ${
                  isFocused
                    ? 'border-[#06B6D4]/60 bg-[#181818]/95'
                    : 'border-white/[0.08] bg-[#121212]/85'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-base sm:text-lg font-bold text-[#f5f5f5]">
                      {m.title}
                    </h3>
                    <span className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#06B6D4] tabular-nums shrink-0">
                      {m.step}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-[#06B6D4]">{m.subtitle}</p>

                  <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed">
                    {m.description}
                  </p>

                  <ul className="space-y-1.5 pt-1 max-sm:hidden">
                    {m.features.map((feat) => (
                      <li
                        key={feat}
                        className="font-mono text-xs text-[#f5f5f5]/90 flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/[0.08] text-xs text-[#a3a3a3] space-y-0.5">
                  <span className="font-mono text-[10px] text-[#06B6D4] block">
                    PRUEBA DE CAMPO:
                  </span>
                  <p className="text-[#f5f5f5] font-medium line-clamp-2">{m.deliverable}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* SUB-ACTO 2: Voz Synji + Ctrl + Alt + Pensar */}
        <div
          ref={act2Ref}
          className="absolute inset-x-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-5 sm:p-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
              <h3 className="font-mono text-lg sm:text-xl font-bold text-[#f5f5f5]">
                Así pienso y escribo cuando cierro el IDE
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#181818] px-3 py-1 font-mono text-[11px] text-[#06B6D4]">
                <MessageSquareQuote className="h-3.5 w-3.5" />
                <span>CORPUS REAL · VOZ SYNJI</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {synjiVoiceSamples.map((note, idx) => {
                const active = idx === selectedNoteIdx;
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      manualNoteRef.current = Date.now();
                      setSelectedNoteIdx(idx);
                    }}
                    className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
                      active
                        ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                        : 'border border-white/[0.08] bg-[#0a0a0a] text-[#a3a3a3] hover:text-[#f5f5f5]'
                    }`}
                  >
                    0{idx + 1} · {note.title.slice(0, 28)}…
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-mono text-sm sm:text-base font-bold text-[#f5f5f5]">
                  {currentNote.title}
                </h4>
                <span className="font-mono text-[10px] text-[#06B6D4]">
                  {currentNote.kicker}
                </span>
              </div>

              <blockquote className="text-xs sm:text-sm text-[#f5f5f5]/90 leading-relaxed italic">
                {currentNote.excerpt}
              </blockquote>

              <div className="pt-2.5 border-t border-white/[0.08] text-xs text-[#a3a3a3]">
                <span className="font-mono text-[#06B6D4] mr-2">TRADUCCIÓN OPERATIVA:</span>
                <span>{currentNote.takeaway}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
              <h3 className="font-mono text-lg font-bold text-[#f5f5f5]">
                Ctrl + Alt + Pensar
              </h3>
              <span className="font-mono text-xs text-[#06B6D4] tabular-nums">
                4 EDICIONES EN LINKEDIN
              </span>
            </div>

            <div className="space-y-2">
              {newsletterIssues.map((item) => (
                <a
                  key={item.number}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/[0.08] bg-[#181818] p-3 space-y-1 transition-colors hover:border-[#06B6D4]/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-mono text-xs sm:text-sm font-semibold text-[#f5f5f5] truncate">
                      {item.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#06B6D4] tabular-nums shrink-0">
                      <span>{item.number}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a3a3a3] line-clamp-2">
                    {item.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SUB-ACTO 3: Publicaciones Científicas y Acreditación Oficial */}
        <div
          ref={act3Ref}
          className="absolute inset-x-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
              <h3 className="font-mono text-base sm:text-lg font-bold text-[#f5f5f5]">
                Publicaciones Científicas e Investigación
              </h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#06B6D4]">
                <BookOpen className="h-3.5 w-3.5" />
                <span>NEREIS · NOVA SCIENCE · P300</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {academicWorks.map((pub) => (
                <a
                  key={pub.title}
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-3.5 space-y-1 transition-colors hover:border-[#06B6D4]/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[#06B6D4] tabular-nums">
                      {pub.year}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#737373]" />
                  </div>
                  <h4 className="font-mono text-xs font-semibold text-[#f5f5f5] line-clamp-2">
                    {pub.title}
                  </h4>
                  <p className="font-mono text-[10px] text-[#a3a3a3] truncate">{pub.venue}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
              <h3 className="font-mono text-base sm:text-lg font-bold text-[#f5f5f5]">
                Formación y Acreditación
              </h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#06B6D4]">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>OFICIAL</span>
              </span>
            </div>

            <ul className="space-y-1.5">
              {educationCredentials.slice(0, 5).map((cred) => (
                <li
                  key={cred.title}
                  className="flex items-start gap-2 rounded-lg border border-white/[0.08] bg-[#181818] px-3 py-2 text-xs"
                >
                  <FileText className="h-3.5 w-3.5 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#f5f5f5] block truncate">
                      {cred.title}
                    </span>
                    <span className="text-[10px] text-[#a3a3a3] block truncate">
                      {cred.institution} · {cred.period}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pie de telemetría del Capítulo 4 */}
      <div className="relative z-20 flex items-center justify-between font-mono text-[11px] text-[#737373] pt-2 border-t border-white/[0.08]">
        <span>
          ESCENA ACTIVA:{' '}
          <strong className="text-[#06B6D4]">
            {subAct === 0
              ? '01 · LOS 3 MOMENTOS DE INTERVENCIÓN'
              : subAct === 1
                ? '02 · VOZ SYNJI & CTRL + ALT + PENSAR'
                : '03 · PUBLICACIONES CIENTÍFICAS & TÍTULOS'}
          </strong>
        </span>
        <span>DESLIZA PARA SEGUIR AVANZANDO EN LA CÁMARA →</span>
      </div>
    </section>
  );
}
