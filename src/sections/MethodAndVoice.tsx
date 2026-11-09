import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [mobileAct2Tab, setMobileAct2Tab] = useState<'voz' | 'newsletter'>('voz');
  const [mobileAct3Tab, setMobileAct3Tab] = useState<'ciencia' | 'formacion'>('ciencia');

  const manualSubActRef = useRef<number>(0);
  const currentSubActRef = useRef<0 | 1 | 2>(0);
  const manualNoteRef = useRef<number>(0);
  const manualMobileTabRef = useRef<number>(0);

  useEffect(() => {
    let curMoment = 0;
    let curNote = 0;
    let curAct2Tab: 'voz' | 'newsletter' = 'voz';
    let curAct3Tab: 'ciencia' | 'formacion' = 'ciencia';

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
        barFillRef.current.style.transform = `scaleX(${p})`;
      }

      const now = Date.now();
      const manualActive = now - manualSubActRef.current < 3200;

      let targetSub: 0 | 1 | 2 = currentSubActRef.current;
      if (!manualActive) {
        targetSub = p < 0.35 ? 0 : p < 0.68 ? 1 : 2;
        if (targetSub !== currentSubActRef.current) {
          currentSubActRef.current = targetSub;
          setSubAct(targetSub);
        }
      }

      const w1 = manualActive
        ? currentSubActRef.current === 0
          ? 1
          : 0
        : 1 - smoothstep(range(p, 0.29, 0.38));
      const w2 = manualActive
        ? currentSubActRef.current === 1
          ? 1
          : 0
        : smoothstep(range(p, 0.31, 0.4)) * (1 - smoothstep(range(p, 0.62, 0.71)));
      const w3 = manualActive
        ? currentSubActRef.current === 2
          ? 1
          : 0
        : smoothstep(range(p, 0.64, 0.74));

      if (act1Ref.current) {
        act1Ref.current.style.opacity = String(w1);
        act1Ref.current.style.visibility = w1 > 0.02 ? 'visible' : 'hidden';
        act1Ref.current.style.pointerEvents = w1 > 0.4 ? 'auto' : 'none';
        act1Ref.current.style.transform = `translate3d(0, ${(1 - w1) * -20}px, 0) scale(${lerp(0.95, 1, w1)})`;
      }

      if (act2Ref.current) {
        act2Ref.current.style.opacity = String(w2);
        act2Ref.current.style.visibility = w2 > 0.02 ? 'visible' : 'hidden';
        act2Ref.current.style.pointerEvents = w2 > 0.4 ? 'auto' : 'none';
        act2Ref.current.style.transform = `translate3d(0, ${(1 - w2) * 20}px, 0) scale(${lerp(0.95, 1, w2)})`;
      }

      if (act3Ref.current) {
        act3Ref.current.style.opacity = String(w3);
        act3Ref.current.style.visibility = w3 > 0.02 ? 'visible' : 'hidden';
        act3Ref.current.style.pointerEvents = w3 > 0.4 ? 'auto' : 'none';
        act3Ref.current.style.transform = `translate3d(0, ${(1 - w3) * 20}px, 0) scale(${lerp(0.95, 1, w3)})`;
      }

      // En Sub-acto 1: las 3 tarjetas de momento avanzan con el scroll
      if (now - manualMobileTabRef.current > 2800) {
        const u1 = range(p, 0.02, 0.33) * workMoments.length;
        const mIdx = clamp(Math.floor(u1), 0, workMoments.length - 1);
        if (mIdx !== curMoment) {
          curMoment = mIdx;
          setActiveMomentIdx(mIdx);
        }

        // En móvil, Sub-acto 2 alterna entre Voz Synji (0.35..0.52) y Newsletter (0.52..0.68)
        const nextAct2Tab = p < 0.53 ? 'voz' : 'newsletter';
        if (nextAct2Tab !== curAct2Tab) {
          curAct2Tab = nextAct2Tab;
          setMobileAct2Tab(nextAct2Tab);
        }

        // En móvil, Sub-acto 3 alterna entre Ciencia (0.68..0.84) y Formación (0.84..1.00)
        const nextAct3Tab = p < 0.85 ? 'ciencia' : 'formacion';
        if (nextAct3Tab !== curAct3Tab) {
          curAct3Tab = nextAct3Tab;
          setMobileAct3Tab(nextAct3Tab);
        }
      }

      const u1 = range(p, 0.02, 0.33) * workMoments.length;
      momentCardRefs.current.forEach((card, i) => {
        if (!card) return;
        const delta = u1 - (i + 0.5);
        const dist = Math.abs(delta);
        const sc = lerp(0.95, 1.02, clamp(1 - dist * 0.75));
        const yOff = delta * -10;
        card.style.transform = `translate3d(0, ${yOff.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
      });

      // En Sub-acto 2: las 3 notas de Voz Synji rotan con el scroll
      if (now - manualNoteRef.current > 3000 && p >= 0.33 && p <= 0.68) {
        const u2 = range(p, 0.35, 0.53) * synjiVoiceSamples.length;
        const nIdx = clamp(Math.floor(u2), 0, synjiVoiceSamples.length - 1);
        if (nIdx !== curNote) {
          curNote = nIdx;
          setSelectedNoteIdx(nIdx);
        }
      }
    });
  }, []);

  const currentNote = synjiVoiceSamples[selectedNoteIdx] || synjiVoiceSamples[0];
  const activeMoment = workMoments[activeMomentIdx] || workMoments[0];

  const handleSelectSubAct = useCallback((idx: 0 | 1 | 2) => {
    manualSubActRef.current = Date.now();
    currentSubActRef.current = idx;
    setSubAct(idx);
  }, []);

  return (
    <section
      ref={stageRef}
      aria-label="Capítulo 5: Cómo Trabajo, Voz Synji y Publicaciones"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-3.5 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-6 md:px-[5vw]"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior común + Selector de las 3 cámaras */}
      <div className="relative z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-2.5 border-b border-white/[0.08] shrink-0">
        <div className="space-y-0.5 sm:space-y-1">
          <h2 className="font-mono text-base sm:text-2xl lg:text-3xl font-bold text-[#f5f5f5] tracking-tight leading-snug">
            Método operativo, voz propia y base científica.
          </h2>
          <p className="font-mono text-[10px] sm:text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 shrink-0" />
            <span>CAP. 05 · EL SCROLL RECORRE LAS 3 DIMENSIONES (MÉTODO → VOZ → CIENCIA)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            { idx: 0 as const, label: '01 · 3 Momentos' },
            { idx: 1 as const, label: '02 · Voz & Newsletter' },
            { idx: 2 as const, label: '03 · Ciencia & Títulos' },
          ].map((tab) => (
            <button
              key={tab.idx}
              type="button"
              onClick={() => handleSelectSubAct(tab.idx)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] sm:text-xs transition-colors ${
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

      {/* ESCENARIO CENTRAL SUPERPUESTO (acotado con overflow-hidden para que nada pise cabecera ni pie) */}
      <div className="relative flex-1 min-h-0 flex items-center overflow-hidden my-1">
        {/* SUB-ACTO 1: Los 3 Momentos de Intervención */}
        <div
          ref={act1Ref}
          className="absolute inset-x-0 will-change-transform"
        >
          {/* Vista MÓVIL (< 1024px): Muestra el Momento activo con selector 01..03 (cero desbordamiento) */}
          <div className="flex flex-col gap-2.5 lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-[#a3a3a3] uppercase">
                MOMENTO EN FOCO ({activeMomentIdx + 1}/3)
              </span>
              <div className="flex items-center gap-1">
                {workMoments.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      manualMobileTabRef.current = Date.now();
                      setActiveMomentIdx(i);
                    }}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] transition-colors ${
                      i === activeMomentIdx
                        ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                        : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
                    }`}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>

            <article className="rounded-2xl border border-[#06B6D4]/55 bg-[#141414]/95 p-4 space-y-3 backdrop-blur-md">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-mono text-base font-bold text-[#f5f5f5] leading-snug">
                  {activeMoment.title}
                </h3>
                <span className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#06B6D4] shrink-0">
                  {activeMoment.step}
                </span>
              </div>

              <p className="font-mono text-xs text-[#06B6D4]">{activeMoment.subtitle}</p>
              <p className="text-xs text-[#d4d4d4] leading-relaxed">{activeMoment.description}</p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {activeMoment.features.map((feat) => (
                  <li
                    key={feat}
                    className="font-mono text-[11px] text-[#f5f5f5]/90 flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2.5 border-t border-white/[0.08] text-xs space-y-0.5">
                <span className="font-mono text-[10px] text-[#06B6D4] block">
                  ENTREGABLE & PRUEBA DE CAMPO:
                </span>
                <p className="text-[#f5f5f5] font-medium">{activeMoment.deliverable}</p>
              </div>
            </article>
          </div>

          {/* Vista ESCRITORIO (>= 1024px): Las 3 tarjetas en paralelo */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-5">
            {workMoments.map((m, i) => {
              const isFocused = i === activeMomentIdx;
              return (
                <article
                  key={m.id}
                  ref={(el) => {
                    momentCardRefs.current[i] = el;
                  }}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-3.5 backdrop-blur-md transition-colors duration-300 will-change-transform ${
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

                    <ul className="space-y-1.5 pt-1">
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
                    <p className="text-[#f5f5f5] font-medium">{m.deliverable}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* SUB-ACTO 2: Voz Synji + Ctrl + Alt + Pensar */}
        <div
          ref={act2Ref}
          className="absolute inset-x-0 will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          {/* Selector móvil para alternar entre Voz Synji y Newsletter sin apilar 2 bloques gigantes */}
          <div className="flex items-center justify-between gap-2 mb-2 lg:hidden">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  manualMobileTabRef.current = Date.now();
                  setMobileAct2Tab('voz');
                }}
                className={`rounded-full px-3 py-1 font-mono text-[10px] ${
                  mobileAct2Tab === 'voz'
                    ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                    : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
                }`}
              >
                Voz Synji (3 Notas)
              </button>
              <button
                type="button"
                onClick={() => {
                  manualMobileTabRef.current = Date.now();
                  setMobileAct2Tab('newsletter');
                }}
                className={`rounded-full px-3 py-1 font-mono text-[10px] ${
                  mobileAct2Tab === 'newsletter'
                    ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                    : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
                }`}
              >
                Ctrl + Alt + Pensar (4)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div
              className={`lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-4 sm:p-6 space-y-3 ${
                mobileAct2Tab === 'voz' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
                <h3 className="font-mono text-sm sm:text-xl font-bold text-[#f5f5f5]">
                  Así pienso y escribo cuando cierro el IDE
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#181818] px-2.5 py-0.5 font-mono text-[10px] text-[#06B6D4]">
                  <MessageSquareQuote className="h-3 w-3" />
                  <span>CORPUS · VOZ SYNJI</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
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
                      className={`rounded-xl px-2.5 py-1 font-mono text-[10px] sm:text-xs transition-colors ${
                        active
                          ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                          : 'border border-white/[0.08] bg-[#0a0a0a] text-[#a3a3a3] hover:text-[#f5f5f5]'
                      }`}
                    >
                      0{idx + 1} · {note.title.slice(0, 22)}…
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-3.5 sm:p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-mono text-xs sm:text-base font-bold text-[#f5f5f5]">
                    {currentNote.title}
                  </h4>
                  <span className="font-mono text-[10px] text-[#06B6D4]">
                    {currentNote.kicker}
                  </span>
                </div>

                <blockquote className="text-xs sm:text-sm text-[#f5f5f5]/90 leading-relaxed italic">
                  {currentNote.excerpt}
                </blockquote>

                <div className="pt-2 border-t border-white/[0.08] text-[11px] sm:text-xs text-[#a3a3a3]">
                  <span className="font-mono text-[#06B6D4] mr-1.5">TRADUCCIÓN OPERATIVA:</span>
                  <span>{currentNote.takeaway}</span>
                </div>
              </div>
            </div>

            <div
              className={`lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-4 sm:p-5 space-y-2.5 ${
                mobileAct2Tab === 'newsletter' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
                <h3 className="font-mono text-base sm:text-lg font-bold text-[#f5f5f5]">
                  Ctrl + Alt + Pensar
                </h3>
                <span className="font-mono text-[11px] text-[#06B6D4] tabular-nums">
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
                    className="block rounded-xl border border-white/[0.08] bg-[#181818] p-2.5 sm:p-3 space-y-1 transition-colors hover:border-[#06B6D4]/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-mono text-xs sm:text-sm font-semibold text-[#f5f5f5]">
                        {item.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#06B6D4] tabular-nums shrink-0">
                        <span>{item.number}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a3a3a3] leading-snug">
                      {item.summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUB-ACTO 3: Publicaciones Científicas y Acreditación Oficial */}
        <div
          ref={act3Ref}
          className="absolute inset-x-0 will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          {/* Selector móvil para alternar entre Publicaciones y Formación */}
          <div className="flex items-center justify-between gap-2 mb-2 lg:hidden">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  manualMobileTabRef.current = Date.now();
                  setMobileAct3Tab('ciencia');
                }}
                className={`rounded-full px-3 py-1 font-mono text-[10px] ${
                  mobileAct3Tab === 'ciencia'
                    ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                    : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
                }`}
              >
                Publicaciones Científicas (4)
              </button>
              <button
                type="button"
                onClick={() => {
                  manualMobileTabRef.current = Date.now();
                  setMobileAct3Tab('formacion');
                }}
                className={`rounded-full px-3 py-1 font-mono text-[10px] ${
                  mobileAct3Tab === 'formacion'
                    ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                    : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
                }`}
              >
                Formación Oficial
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div
              className={`lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-4 sm:p-6 space-y-2.5 ${
                mobileAct3Tab === 'ciencia' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
                <h3 className="font-mono text-sm sm:text-lg font-bold text-[#f5f5f5]">
                  Publicaciones Científicas e Investigación
                </h3>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-[#06B6D4]">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>NEREIS · NOVA SCIENCE · P300</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {academicWorks.map((pub) => (
                  <a
                    key={pub.title}
                    href={pub.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-3 space-y-1 transition-colors hover:border-[#06B6D4]/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-[#06B6D4] tabular-nums">
                        {pub.year}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#737373]" />
                    </div>
                    <h4 className="font-mono text-xs font-semibold text-[#f5f5f5] leading-snug">
                      {pub.title}
                    </h4>
                    <p className="font-mono text-[10px] text-[#a3a3a3]">{pub.venue}</p>
                  </a>
                ))}
              </div>
            </div>

            <div
              className={`lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-4 sm:p-5 space-y-2.5 ${
                mobileAct3Tab === 'formacion' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
                <h3 className="font-mono text-sm sm:text-lg font-bold text-[#f5f5f5]">
                  Formación y Acreditación
                </h3>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-[#06B6D4]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>OFICIAL</span>
                </span>
              </div>

              <ul className="space-y-1.5">
                {educationCredentials.slice(0, 6).map((cred) => (
                  <li
                    key={cred.title}
                    className="flex items-start gap-2 rounded-lg border border-white/[0.08] bg-[#181818] px-3 py-1.5 text-xs"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#06B6D4] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#f5f5f5] block leading-snug">
                        {cred.title}
                      </span>
                      <span className="text-[10px] text-[#a3a3a3] block">
                        {cred.institution} · {cred.period}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de telemetría del Capítulo 5 */}
      <div className="relative z-20 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-[#737373] pt-2 border-t border-white/[0.08] shrink-0">
        <span className="truncate">
          ESCENA ACTIVA:{' '}
          <strong className="text-[#06B6D4]">
            {subAct === 0
              ? '01 · LOS 3 MOMENTOS'
              : subAct === 1
                ? '02 · VOZ SYNJI & NEWSLETTER'
                : '03 · PUBLICACIONES & TÍTULOS'}
          </strong>
        </span>
        <span className="hidden sm:inline">DESLIZA PARA SEGUIR AVANZANDO →</span>
      </div>
    </section>
  );
}
