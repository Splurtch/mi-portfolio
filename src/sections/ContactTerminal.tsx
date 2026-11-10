import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Coffee,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Terminal,
} from 'lucide-react';
import { onFrame } from '@/lib/scroll';
import { clamp, lerp, range, sceneProgress } from '@/lib/math';
import { heroProfile } from '@/data/synjiStory';

interface DiagnosticBottleneck {
  id: string;
  title: string;
  symptom: string;
  prescription: string;
  systemMatch: string;
}

const BOTTLENECKS: DiagnosticBottleneck[] = [
  {
    id: 'licitaciones-fpe',
    title: 'Formación FPE, FUNDAE o Licitaciones con demasiada carga manual',
    symptom:
      'Se os va la vida rellenando anexos, hojas de firma, memorias técnicas o controlando expedientes en Excel.',
    prescription:
      'Auditoría operativa del flujo documental + automatización supervisada (estilo SynapseFlow / BidOps) y portal de aula.',
    systemMatch: 'DigitalSynapse · BidOps & SynapseFlow',
  },
  {
    id: 'ia-equipos',
    title: 'Queremos integrar IA o Agentes sin perder el control ni tragar humo',
    symptom:
      'El equipo usa ChatGPT/Claude a tientas o tenéis automatizaciones donde nadie sabe qué ha hecho realmente el agente.',
    prescription:
      'Formación práctica In-Company sobre vuestras tareas reales + diseño de skills/agentes con puntos de control humano.',
    systemMatch: 'Arquitectura 30D™ · Formación & Auditoría IA',
  },
  {
    id: 'growth-web',
    title: 'Necesitamos una web, sistema SEO/GEO o producto digital con criterio',
    symptom:
      'La web actual parece una plantilla genérica, no convierte visitas en oportunidades o la voz de marca suena a robot.',
    prescription:
      'Diseño y desarrollo respaldado por Design Vault + arquitectura SEO/GEO y sistema editorial con voz propia.',
    systemMatch: 'Marketing OS · Design Vault & Growth',
  },
];

export function ContactTerminal() {
  const stageRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileStep, setMobileStep] = useState<'diagnostico' | 'contacto'>('diagnostico');

  const manualSelectRef = useRef<number>(0);
  const manualMobileStepRef = useRef<number>(0);

  useEffect(() => {
    let lastIdx = 0;
    let lastMobileStep: 'diagnostico' | 'contacto' = 'diagnostico';

    return onFrame(() => {
      const anchor = document.getElementById('hablemos');
      const stage = stageRef.current;
      if (!anchor || !stage) return;

      const { p, vis, enter, active } = sceneProgress(anchor, { isLast: true });

      stage.style.opacity = String(vis);
      stage.style.visibility = active ? 'visible' : 'hidden';
      stage.style.pointerEvents = active ? 'auto' : 'none';

      if (!active) return;

      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, ${lerp(-20, 0, enter)}px, 0)`;
      }
      if (leftColRef.current) {
        leftColRef.current.style.transform = `translate3d(${lerp(-32, 0, enter)}px, 0, 0) scale(${lerp(0.94, 1, enter)})`;
      }
      if (rightColRef.current) {
        rightColRef.current.style.transform = `translate3d(${lerp(32, 0, enter)}px, 0, 0) scale(${lerp(0.94, 1, enter)})`;
      }
      if (footerRef.current) {
        footerRef.current.style.transform = `translate3d(0, ${lerp(20, 0, enter)}px, 0)`;
      }

      const now = Date.now();
      if (now - manualMobileStepRef.current > 3500) {
        const nextStep = p < 0.52 ? 'diagnostico' : 'contacto';
        if (nextStep !== lastMobileStep) {
          lastMobileStep = nextStep;
          setMobileStep(nextStep);
        }
      }

      const u = range(p, 0.08, 0.72) * BOTTLENECKS.length;
      const idx = clamp(Math.floor(u), 0, BOTTLENECKS.length - 1);
      if (now - manualSelectRef.current > 3500 && idx !== lastIdx) {
        lastIdx = idx;
        setSelectedIdx(idx);
      }
    });
  }, []);

  const selectedBottleneck = BOTTLENECKS[selectedIdx] || BOTTLENECKS[0];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(heroProfile.contacts.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      // ignore
    }
  };

  const handleOpenMailClient = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[Diagnóstico Web] ${selectedBottleneck.title.slice(0, 48)}...`,
    );
    const body = encodeURIComponent(
      `Hola Synji,\n\nSoy ${senderName || '(Tu nombre)'} (${senderEmail || 'tu@email.com'}).\n\nDiagnóstico seleccionado:\n- ${selectedBottleneck.title}\n- Sistema relacionado: ${selectedBottleneck.systemMatch}\n\nContexto de mi caso:\n${projectNotes || 'Me gustaría comentar cómo aplicarlo en nuestro caso.'}\n\nUn saludo.`,
    );
    window.location.href = `mailto:${heroProfile.contacts.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      ref={stageRef}
      aria-label="Capítulo 7: Canal Abierto y Autodiagnóstico"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-3.5 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-5 md:px-[5vw]"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior */}
      <div
        ref={headerRef}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-2 border-b border-white/[0.08] shrink-0 will-change-transform"
      >
        <div className="space-y-0.5 sm:space-y-1">
          <h2 className="font-mono text-base sm:text-2xl lg:text-3xl font-bold text-[#f5f5f5] tracking-tight leading-snug">
            Si tienes un cuello de botella real, lo aterrizamos sin teatro.
          </h2>
          <p className="font-mono text-[10px] sm:text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 shrink-0" />
            <span>CAP. 07 · AUTODIAGNÓSTICO INTERACTIVO Y CANAL DIRECTO EN LA NUCÍA, ALICANTE</span>
          </p>
        </div>

        {/* Conmutador móvil Paso 1 / Paso 2 */}
        <div className="flex items-center justify-between lg:justify-end gap-2">
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={() => {
                manualMobileStepRef.current = Date.now();
                setMobileStep('diagnostico');
              }}
              className={`rounded-full px-3 py-1 font-mono text-[10px] transition-colors ${
                mobileStep === 'diagnostico'
                  ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                  : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
              }`}
            >
              1 · Diagnóstico
            </button>
            <button
              type="button"
              onClick={() => {
                manualMobileStepRef.current = Date.now();
                setMobileStep('contacto');
              }}
              className={`rounded-full px-3 py-1 font-mono text-[10px] transition-colors ${
                mobileStep === 'contacto'
                  ? 'bg-[#06B6D4] text-[#0a0a0a] font-bold'
                  : 'border border-white/[0.1] bg-[#121212] text-[#a3a3a3]'
              }`}
            >
              2 · Canal Directo
            </button>
          </div>

          <span className="hidden sm:inline font-mono text-xs text-[#10B981] shrink-0">
            ● RESPUESTA DIRECTA SIN INTERMEDIARIOS
          </span>
        </div>
      </div>

      {/* Consola central: en móvil muestra Paso 1 o Paso 2 sin desbordar nunca */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center min-h-0">
        {/* Columna izquierda: Selector de cuello de botella (7 cols) */}
        <div
          ref={leftColRef}
          className={`lg:col-span-7 space-y-2.5 will-change-transform ${
            mobileStep === 'diagnostico' ? 'block' : 'hidden lg:block'
          }`}
        >
          <h3 className="font-mono text-xs sm:text-base font-bold text-[#f5f5f5]">
            1. ¿Dónde te duele el sistema ahora mismo?
          </h3>

          <div className="space-y-2">
            {BOTTLENECKS.map((option, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    manualSelectRef.current = Date.now();
                    setSelectedIdx(idx);
                  }}
                  className={`w-full text-left rounded-xl border p-3 sm:p-3.5 transition-all duration-300 ${
                    active
                      ? 'border-[#06B6D4]/60 bg-[#181818]/95'
                      : 'border-white/[0.08] bg-[#121212]/85 hover:border-white/[0.18]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <h4 className="font-mono text-xs sm:text-sm font-bold text-[#f5f5f5] leading-snug">
                      {option.title}
                    </h4>
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        active ? 'text-[#06B6D4]' : 'text-[#737373]'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-[#a3a3a3] leading-relaxed">
                    {option.symptom}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-3.5 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-mono text-[11px] sm:text-xs font-bold text-[#06B6D4]">
                DIAGNÓSTICO PRELIMINAR
              </h4>
              <span className="font-mono text-[10px] sm:text-[11px] text-[#a3a3a3]">
                {selectedBottleneck.systemMatch}
              </span>
            </div>
            <p className="text-xs text-[#f5f5f5] leading-relaxed">
              {selectedBottleneck.prescription}
            </p>
            <button
              type="button"
              onClick={() => {
                manualMobileStepRef.current = Date.now();
                setMobileStep('contacto');
              }}
              className="mt-1.5 inline-flex items-center gap-1 font-mono text-[11px] text-[#06B6D4] lg:hidden"
            >
              <span>Continuar al Paso 2 (Enviar mensaje) →</span>
            </button>
          </div>
        </div>

        {/* Columna derecha: Formulario y canales directos (5 cols) */}
        <div
          ref={rightColRef}
          className={`lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/92 backdrop-blur-md p-4 sm:p-5 space-y-3.5 will-change-transform ${
            mobileStep === 'contacto' ? 'block' : 'hidden lg:block'
          }`}
        >
          <h3 className="font-mono text-xs sm:text-base font-bold text-[#f5f5f5]">
            2. Envía el contexto o abre canal directo
          </h3>

          <form onSubmit={handleOpenMailClient} className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Tu nombre o equipo"
                aria-label="Tu nombre o equipo"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f5] placeholder:text-[#737373] focus:border-[#06B6D4] focus:outline-none"
              />
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="tu@empresa.com"
                aria-label="Tu correo de respuesta"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f5] placeholder:text-[#737373] focus:border-[#06B6D4] focus:outline-none"
              />
            </div>

            <textarea
              rows={2}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              placeholder="Cuéntame en dos líneas qué quieres desbloquear..."
              aria-label="Qué quieres desbloquear"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f5] placeholder:text-[#737373] focus:border-[#06B6D4] focus:outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-2 font-mono text-xs font-medium text-[#0a0a0a] transition-transform hover:bg-white active:scale-[0.99]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Preparar correo con este diagnóstico</span>
            </button>
          </form>

          <div className="pt-2.5 border-t border-white/[0.08] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between gap-2">
              <a
                href={`mailto:${heroProfile.contacts.email}`}
                className="inline-flex items-center gap-2 text-[#f5f5f5] hover:text-[#06B6D4] truncate"
              >
                <Mail className="h-3.5 w-3.5 text-[#06B6D4] shrink-0" />
                <span className="truncate">{heroProfile.contacts.email}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="rounded-md border border-white/[0.08] bg-[#0a0a0a] px-2 py-0.5 text-[10px] text-[#a3a3a3] hover:text-[#f5f5f5] shrink-0"
              >
                {copiedEmail ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a3a3a3]">
              <a
                href={`tel:${heroProfile.contacts.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-[#06B6D4]" />
                {heroProfile.contacts.phone}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#06B6D4]" />
                La Nucía · Alicante
              </span>
            </div>

            <div className="pt-1 flex flex-wrap gap-1.5">
              <a
                href={heroProfile.contacts.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-2.5 py-1 text-[11px] text-[#f5f5f5] hover:border-white/[0.2]"
              >
                <Linkedin className="h-3 w-3 text-[#06B6D4]" />
                <span>LinkedIn</span>
              </a>

              <a
                href={heroProfile.contacts.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-2.5 py-1 text-[11px] text-[#f5f5f5] hover:border-white/[0.2]"
              >
                <Github className="h-3 w-3 text-[#06B6D4]" />
                <span>GitHub</span>
              </a>

              <a
                href={heroProfile.contacts.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-2.5 py-1 text-[11px] text-[#f5f5f5] hover:border-white/[0.2]"
              >
                <span>digitalsynapse.es</span>
                <ArrowUpRight className="h-3 w-3 text-[#06B6D4]" />
              </a>

              <a
                href={heroProfile.contacts.coffee}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-2.5 py-1 text-[11px] text-[#f5f5f5] hover:border-white/[0.2]"
              >
                <Coffee className="h-3 w-3 text-[#F59E0B]" />
                <span>Café</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer integrado dentro del escenario fijo */}
      <footer
        ref={footerRef}
        className="pt-2 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-1.5 font-mono text-[10px] sm:text-[11px] text-[#737373] shrink-0 will-change-transform"
      >
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}brand/digitalsynapse_logo_dark.svg`}
            alt="DigitalSynapse"
            className="h-4 sm:h-5 w-auto opacity-90"
          />
          <span className="truncate">· Synji D. Mulatiere (@splurtch)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>Ctrl + Alt + Pensar</span>
          <span>·</span>
          <span className="tabular-nums">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </section>
  );
}
