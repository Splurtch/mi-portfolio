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

interface BottleneckOption {
  id: string;
  title: string;
  symptom: string;
  prescription: string;
  systemMatch: string;
}

const BOTTLENECKS: BottleneckOption[] = [
  {
    id: 'procesos-ia',
    title: 'Tenemos herramientas e IA sueltas, pero ningún sistema operativo claro',
    symptom:
      'Cada persona usa prompts distintos, se pierde información entre hojas de cálculo y nadie sabe qué ocurrió de verdad.',
    prescription:
      'Diseñar un flujo con agentes, MCP o automatización conectada a vuestros datos reales, con trazabilidad y entregables medibles.',
    systemMatch: 'Arquitectura DigitalSynapse / BidOps / Marketing OS',
  },
  {
    id: 'formacion-fpe',
    title: 'Necesitamos que una formación o coordinación docente funcione de verdad',
    symptom:
      'Mucho temario en papel, pero cuesta que el alumnado practique con feedback estructurado o que la gestión documental no ahogue al equipo.',
    prescription:
      'Convertir programación, rúbricas y casos prácticos en herramientas vivas (como Aula de Práctica SSCE0110 o SynapseFlow).',
    systemMatch: 'EdTech & Coordinación FPE (+10 años en aula)',
  },
  {
    id: 'producto-narrativa',
    title: 'Queremos lanzar un producto o web con criterio técnico y voz propia',
    symptom:
      'La web actual parece una plantilla genérica y no explica ni el valor técnico ni quién hay detrás.',
    prescription:
      'Construir una arquitectura front-end medida (apoyada en DESIGN VAULT e Impeccable) con narrativa clara y conversión directa.',
    systemMatch: 'DESIGN VAULT + Desarrollo Front-End & Narrativa',
  },
];

export function ContactTerminal() {
  const stageRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const manualSelectRef = useRef<number>(0);

  useEffect(() => {
    let lastIdx = 0;

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
        headerRef.current.style.transform = `translate3d(0, ${lerp(-28, 0, enter)}px, 0)`;
      }
      if (leftColRef.current) {
        leftColRef.current.style.transform = `translate3d(${lerp(-44, 0, enter)}px, 0, 0) scale(${lerp(0.92, 1, enter)})`;
      }
      if (rightColRef.current) {
        rightColRef.current.style.transform = `translate3d(${lerp(44, 0, enter)}px, 0, 0) scale(${lerp(0.92, 1, enter)})`;
      }
      if (footerRef.current) {
        footerRef.current.style.transform = `translate3d(0, ${lerp(24, 0, enter)}px, 0)`;
      }

      // Durante el tramo final de scroll, las 3 opciones de diagnóstico se iluminan en secuencia
      if (Date.now() - manualSelectRef.current > 3200) {
        const u = range(p, 0.1, 0.85) * BOTTLENECKS.length;
        const idx = clamp(Math.floor(u), 0, BOTTLENECKS.length - 1);
        if (idx !== lastIdx) {
          lastIdx = idx;
          setSelectedIdx(idx);
        }
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
      aria-label="Capítulo 6: Canal Abierto y Autodiagnóstico"
      className="fixed inset-0 z-10 flex h-[100svh] w-screen flex-col justify-between overflow-hidden px-4 pt-20 pb-5 sm:px-6 md:px-[5vw] md:pt-24"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* Cabecera superior */}
      <div
        ref={headerRef}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-3 border-b border-white/[0.08] will-change-transform"
      >
        <div className="space-y-1">
          <h2 className="font-mono text-xl sm:text-3xl font-bold text-[#f5f5f5] tracking-tight">
            Si tienes un cuello de botella real, lo aterrizamos sin teatro.
          </h2>
          <p className="font-mono text-xs text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" />
            <span>CAP. 07 · AUTODIAGNÓSTICO INTERACTIVO Y CANAL DIRECTO EN LA NUCÍA, ALICANTE</span>
          </p>
        </div>

        <span className="font-mono text-xs text-[#10B981] shrink-0">
          ● RESPUESTA DIRECTA SIN INTERMEDIARIOS
        </span>
      </div>

      {/* Consola central: Diagnóstico + Formulario directo */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Columna izquierda: Selector de cuello de botella (7 cols) */}
        <div ref={leftColRef} className="lg:col-span-7 space-y-3 will-change-transform">
          <h3 className="font-mono text-sm sm:text-base font-bold text-[#f5f5f5]">
            1. ¿Dónde te duele el sistema ahora mismo?
          </h3>

          <div className="space-y-2.5">
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
                  className={`w-full text-left rounded-xl border p-3.5 sm:p-4 transition-all duration-300 ${
                    active
                      ? 'border-[#06B6D4]/60 bg-[#181818]/95 scale-[1.01]'
                      : 'border-white/[0.08] bg-[#121212]/85 hover:border-white/[0.18]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-mono text-xs sm:text-sm font-bold text-[#f5f5f5]">
                      {option.title}
                    </h4>
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        active ? 'text-[#06B6D4]' : 'text-[#737373]'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#a3a3a3] leading-relaxed">
                    {option.symptom}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-mono text-xs font-bold text-[#06B6D4]">
                DIAGNÓSTICO PRELIMINAR DE INTERVENCIÓN
              </h4>
              <span className="font-mono text-[11px] text-[#a3a3a3]">
                {selectedBottleneck.systemMatch}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#f5f5f5] leading-relaxed">
              {selectedBottleneck.prescription}
            </p>
          </div>
        </div>

        {/* Columna derecha: Formulario y canales directos (5 cols) */}
        <div
          ref={rightColRef}
          className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-md p-5 space-y-4 will-change-transform"
        >
          <h3 className="font-mono text-sm sm:text-base font-bold text-[#f5f5f5]">
            2. Envía el contexto o abre canal directo
          </h3>

          <form onSubmit={handleOpenMailClient} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Tu nombre o equipo"
                aria-label="Tu nombre o equipo"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-xs sm:text-sm text-[#f5f5f5] placeholder:text-[#737373] focus:border-[#06B6D4] focus:outline-none"
              />
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="tu@empresa.com"
                aria-label="Tu correo de respuesta"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-xs sm:text-sm text-[#f5f5f5] placeholder:text-[#737373] focus:border-[#06B6D4] focus:outline-none"
              />
            </div>

            <textarea
              rows={2}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              placeholder="Cuéntame en dos líneas qué quieres desbloquear..."
              aria-label="Qué quieres desbloquear"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-xs sm:text-sm text-[#f5f5f5] placeholder:text-[#737373] focus:border-[#06B6D4] focus:outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-2.5 font-mono text-xs font-medium text-[#0a0a0a] transition-transform hover:bg-white active:scale-[0.99]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Preparar correo con este diagnóstico</span>
            </button>
          </form>

          <div className="pt-3 border-t border-white/[0.08] space-y-2 font-mono text-xs">
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
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#06B6D4]" />
                {heroProfile.contacts.phone}
              </span>
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
        className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-[#737373] will-change-transform"
      >
        <div className="flex items-center gap-2.5">
          <img
            src={`${import.meta.env.BASE_URL}brand/digitalsynapse_logo_dark.svg`}
            alt="DigitalSynapse"
            className="h-5 w-auto opacity-90"
          />
          <span>· Diseñado y programado por Synji D. Mulatiere (@splurtch)</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ctrl + Alt + Pensar</span>
          <span>·</span>
          <span className="tabular-nums">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </section>
  );
}
