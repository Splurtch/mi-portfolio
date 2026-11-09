import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, X } from 'lucide-react';
import { onScroll, setScrollPaused, scrollToPosition } from '@/lib/scroll';
import { clamp } from '@/lib/math';
import './SiteHeader.css';

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
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('despertar');
  const progressFillRef = useRef<HTMLSpanElement | null>(null);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  const pendingChapterRef = useRef<string | null>(null);

  useEffect(() => onScroll((s) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - s.vh);
    const ratio = clamp(s.y / maxScroll, 0, 1);
    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleY(${ratio})`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(ratio * 100)}%`;
    }

    const probeY = s.vh * 0.38;
    let current = CHAPTERS[0].id;
    for (const chapter of CHAPTERS) {
      const element = document.getElementById(chapter.id);
      if (element && element.getBoundingClientRect().top <= probeY) {
        current = chapter.id;
      }
    }
    setActiveId((previous) => previous !== current ? current : previous);
  }), []);

  useEffect(() => {
    setScrollPaused(open);
    return () => setScrollPaused(false);
  }, [open]);

  const navigateAfterClose = () => {
    const id = pendingChapterRef.current;
    pendingChapterRef.current = null;
    if (!id) return;
    const element = document.getElementById(id);
    if (!element) return;
    const top = id === 'despertar' ? 0 : element.offsetTop + element.offsetHeight * 0.06;
    setScrollPaused(false);
    scrollToPosition(top);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="chapter-rail" aria-label="Abrir menú de capítulos">
          <span className="chapter-rail__label" aria-hidden="true">Menú</span>
          <span className="chapter-rail__track" aria-hidden="true">
            <span ref={progressFillRef} className="chapter-rail__progress" />
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="chapter-menu-backdrop" data-lenis-prevent />
        <Dialog.Content
          className="chapter-menu"
          aria-modal="true"
          data-lenis-prevent
          onCloseAutoFocus={navigateAfterClose}
          onFocusCapture={(event) => {
            // Radix wraps focus without scrolling. Keep wrapped links visible on short screens.
            if (event.target instanceof HTMLElement) {
              event.target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
          }}
        >
          <div className="chapter-menu__header">
            <div className="chapter-menu__identity">
              <img src={`${import.meta.env.BASE_URL}brand/digitalsynapse_isotipo.svg`} alt="" />
              <span>Synji D. Mulatiere<small>@splurtch · DigitalSynapse</small></span>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="chapter-menu__close" aria-label="Cerrar menú de capítulos">
                <X size={20} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="chapter-menu__intro">
            <Dialog.Title>Elige tu capítulo.</Dialog.Title>
            <Dialog.Description>Explora a tu ritmo. El escenario es tuyo.</Dialog.Description>
          </div>

          <nav aria-label="Capítulos de la historia">
            <ol className="chapter-menu__list">
              {CHAPTERS.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    aria-current={activeId === chapter.id ? 'location' : undefined}
                    className="chapter-menu__link"
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                      event.preventDefault();
                      pendingChapterRef.current = chapter.id;
                      setOpen(false);
                    }}
                  >
                    <span className="chapter-menu__number" aria-hidden="true">{chapter.num}</span>
                    <span>{chapter.label}</span>
                    <ArrowUpRight className="chapter-menu__arrow" size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="chapter-menu__footer" aria-hidden="true">
            <span>Tu recorrido</span>
            <span ref={progressTextRef}>0%</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
