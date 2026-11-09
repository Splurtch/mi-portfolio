import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { onScroll } from '@/lib/scroll';
import { clamp } from '@/lib/math';

const CHAPTERS = [
  { id: 'despertar', num: '01', label: 'Despertar' },
  { id: 'zigzag', num: '02', label: 'Zigzag' },
  { id: 'ecosistema', num: '03', label: 'Repos & Sistemas' },
  { id: 'marketing-web', num: '04', label: 'Marketing & Web' },
  { id: 'metodo', num: '05', label: 'Método' },
  { id: 'lado-b', num: '06', label: 'Lado B' },
  { id: 'hablemos', num: '07', label: 'Hablemos' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('despertar');
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const unsub = onScroll((s) => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - s.vh);
      const ratio = clamp(s.y / maxScroll, 0, 1);
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${ratio})`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(ratio * 100)}%`;
      }

      const probeY = s.vh * 0.38;
      let current = CHAPTERS[0].id;
      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY) {
            current = ch.id;
          }
        }
      }
      setActiveId((prev) => (prev !== current ? current : prev));
    });
    return unsub;
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = id === 'despertar' ? 0 : el.offsetTop + el.offsetHeight * 0.06;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-[1280px] pointer-events-auto">
        <div className="relative overflow-hidden rounded-full border border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-md px-3.5 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Brand identity */}
          <a
            href="#despertar"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('despertar');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <img
              src={`${import.meta.env.BASE_URL}brand/digitalsynapse_isotipo.svg`}
              alt="DigitalSynapse Isotipo"
              className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="flex flex-col">
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-[#f5f5f5] leading-none">
                SYNJI D. MULATIERE
              </span>
              <span className="font-mono text-[10px] text-[#a3a3a3] tracking-wider uppercase mt-0.5">
                @splurtch · DigitalSynapse
              </span>
            </div>
          </a>

          {/* Desktop chapter nav */}
          <nav aria-label="Capítulos de la historia" className="hidden lg:flex items-center gap-1">
            {CHAPTERS.map((ch) => {
              const isActive = activeId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToSection(ch.id)}
                  className={`px-3 py-1.5 rounded-full font-mono text-xs transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/[0.09] text-[#f5f5f5]'
                      : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={isActive ? 'text-[#06B6D4] tabular-nums' : 'text-[#737373] tabular-nums'}>
                    {ch.num}
                  </span>
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right telemetry + Primary CTA */}
          <div className="flex items-center gap-2">
            {/* En móvil muestra el capítulo activo para orientar siempre al usuario */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] text-[#f5f5f5]"
            >
              <span className="text-[#06B6D4] font-bold tabular-nums">
                {CHAPTERS.find((c) => c.id === activeId)?.num}
              </span>
              <span className="max-w-[82px] truncate">
                {CHAPTERS.find((c) => c.id === activeId)?.label}
              </span>
            </button>

            <span
              ref={progressTextRef}
              className="inline-block font-mono text-[10px] sm:text-[11px] text-[#a3a3a3] tabular-nums w-8 sm:w-9 text-right"
              aria-hidden="true"
            >
              0%
            </span>

            <button
              type="button"
              onClick={() => scrollToSection('hablemos')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-4 py-1.5 font-mono text-xs font-medium text-[#0a0a0a] transition-transform duration-200 hover:bg-white active:scale-[0.99]"
            >
              <span>Diagnosticar proyecto</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Cerrar menú de capítulos' : 'Abrir menú de capítulos'}
              className="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/[0.08] bg-[#121212] text-[#f5f5f5]"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Subtle bottom progress line */}
          <div
            ref={progressFillRef}
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] origin-left scale-x-0 bg-[#06B6D4]"
          />
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-md p-3 lg:hidden">
            <div className="grid grid-cols-2 gap-1.5">
              {CHAPTERS.map((ch) => {
                const isActive = activeId === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToSection(ch.id)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left font-mono text-xs transition-colors ${
                      isActive
                        ? 'bg-white/[0.08] text-[#f5f5f5]'
                        : 'text-[#a3a3a3] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                    }`}
                  >
                    <span className="text-[#06B6D4] tabular-nums">{ch.num}</span>
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#a3a3a3]">La Nucía, Alicante · ES</span>
              <button
                type="button"
                onClick={() => scrollToSection('hablemos')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-3.5 py-1.5 font-mono text-xs font-medium text-[#0a0a0a]"
              >
                <span>Canal directo</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
