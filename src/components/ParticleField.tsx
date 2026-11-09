import { useEffect, useRef } from 'react';
import { onFrame } from '@/lib/scroll';
import { clamp, lerp } from '@/lib/math';

/**
 * Motor de partículas de DigitalSynapse (recuperado de particle-logo.js en digitalsynapse.es
 * y evolucionado a scrollytelling multicapa):
 *
 * - Muestrea SVGs reales en un lienzo offscreen de 240×240 (`getImageData`), conservando
 *   los colores exactos del degradado de marca (#3B82F6 -> #8B5CF6 -> #06B6D4) y aclarando
 *   los trazos guía (#1E293B -> rgb(100,116,139)).
 * - En lugar de dispersarse sin más, las 1.400 partículas hacen morphing continuo entre
 *   6 geometrías diseñadas para cada capítulo del relato:
 *     0. #despertar  -> Isotipo S-Isométrica Tech de DigitalSynapse (logo-mark.php)
 *     1. #zigzag     -> Red Sináptica / Prisma Neuronal + Curva (funciones sobre + growth)
 *     2. #ecosistema -> Radar de Licitaciones y Hexágono Estructurado (oportunidades + formacion)
 *     3. #metodo     -> Escalera Arquitectura 30D + Nodo Editorial (mejora-de-procesos + blog)
 *     4. #lado-b     -> Mando RPG / Cristal Isekai & Gato Sináptico (Lado B personal)
 *     5. #hablemos   -> Escudo de Garantía y Verificación (contacto)
 */

const SAMPLE = 240;
const TAU = Math.PI * 2;

interface SampledPoint {
  u: number;
  v: number;
  c: string;
  dim: number;
}

interface MorphParticle {
  // Coordenadas iniciales aleatorias para la entrada tipo GPT-Astra / DigitalSynapse
  ix: number;
  iy: number;
  // Franja lateral para partículas periféricas de profundidad
  sx: number;
  sy: number;
  z: number;
  r: number;
  ph: number;
  delay: number;
  // Posiciones objetivo (u, v, color, dim) en cada una de las 6 formas
  targets: SampledPoint[];
}

const GRAD_DEFS = `
  <defs>
    <linearGradient id="dsg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="50%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>
`;

/**
 * Las 6 geometrías SVG de DigitalSynapse (viewBox 0 0 100 100) que se muestrean en partículas.
 */
const CHAPTER_SVGS: { id: string; label: string; svg: string }[] = [
  {
    id: 'despertar',
    label: 'ISOTIPO S-ISOMÉTRICA · DIGITALSYNAPSE',
    // El logo S-Isométrica original de logo-mark.php escalado a 100x100
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 32 32" fill="none">
      ${GRAD_DEFS}
      <path d="M6 10L16 4L26 10L6 22L16 28L26 22" stroke="url(#dsg)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="10" r="3.6" fill="#3B82F6"/>
      <circle cx="16" cy="16" r="3.6" fill="#8B5CF6"/>
      <circle cx="26" cy="22" r="3.6" fill="#06B6D4"/>
    </svg>`,
  },
  {
    id: 'zigzag',
    label: 'RED SINÁPTICA · NEUROCIENCIA A SISTEMAS',
    // Icono "Sinapsis / Red" + curva ascendente de functions.php
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 100 100" fill="none">
      ${GRAD_DEFS}
      <path d="M22 34 L50 16 L78 34 L78 66 L50 84 L22 66 Z" stroke="#1E293B" stroke-width="3.2"/>
      <path d="M22 34 L50 50 L78 34 M50 50 L50 84 M22 66 L50 50 L78 66" stroke="url(#dsg)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="50" cy="16" r="6" fill="#3B82F6"/>
      <circle cx="78" cy="34" r="5.5" fill="#8B5CF6"/>
      <circle cx="78" cy="66" r="5.5" fill="#06B6D4"/>
      <circle cx="50" cy="84" r="6" fill="#3B82F6"/>
      <circle cx="22" cy="66" r="5.5" fill="#06B6D4"/>
      <circle cx="22" cy="34" r="5.5" fill="#3B82F6"/>
      <circle cx="50" cy="50" r="8.5" fill="#06B6D4"/>
    </svg>`,
  },
  {
    id: 'ecosistema',
    label: 'RADAR & HEXÁGONO · 7 SISTEMAS EN VIVO',
    // Icono "Radar de Oportunidades" + "Hexágono Formacion/Licitaciones" de functions.php
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 100 100" fill="none">
      ${GRAD_DEFS}
      <circle cx="50" cy="50" r="38" stroke="#1E293B" stroke-width="3" stroke-dasharray="6 5"/>
      <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" stroke="url(#dsg)" stroke-width="3.8"/>
      <path d="M50 12 A38 38 0 0 1 88 50" stroke="#06B6D4" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 50 L77 23" stroke="url(#dsg)" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="7" fill="#8B5CF6"/>
      <circle cx="70" cy="36" r="6" fill="#06B6D4"/>
      <circle cx="32" cy="62" r="5" fill="#3B82F6"/>
    </svg>`,
  },
  {
    id: 'marketing-web',
    label: 'GROWTH, SEO/GEO & WEBS · EMBUDO EN VIVO',
    // Icono oficial "Marketing Digital / Growth" de digitalsynapse.es (functions.php)
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 100 100" fill="none">
      ${GRAD_DEFS}
      <path d="M14 82 L88 82 M14 20 L14 82" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
      <rect x="24" y="60" width="10" height="22" rx="2" stroke="#3B82F6" stroke-width="3.2"/>
      <rect x="42" y="46" width="10" height="36" rx="2" stroke="#8B5CF6" stroke-width="3.2"/>
      <rect x="60" y="32" width="10" height="50" rx="2" stroke="#06B6D4" stroke-width="3.2"/>
      <path d="M20 56 Q 45 48 64 24 L 82 16" stroke="url(#dsg)" stroke-width="4.8" stroke-linecap="round"/>
      <path d="M70 14 L83 15 L80 28" stroke="#06B6D4" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="56" r="5" fill="#3B82F6"/>
      <circle cx="47" cy="40" r="5.5" fill="#8B5CF6"/>
      <circle cx="82" cy="16" r="6.5" fill="#06B6D4"/>
    </svg>`,
  },
  {
    id: 'metodo',
    label: 'ARQUITECTURA 30D · MÉTODO Y PROCESOS',
    // Icono "Mejora de procesos / Escalera" + nodo editorial de functions.php
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 100 100" fill="none">
      ${GRAD_DEFS}
      <path d="M20 20 L20 82 M40 20 L40 82 M60 20 L60 82 M80 20 L80 82" stroke="#1E293B" stroke-width="3" stroke-dasharray="4 5"/>
      <path d="M20 68 L40 68 L40 48 L60 48 L60 26 L82 26" stroke="url(#dsg)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="68" r="6" fill="#3B82F6"/>
      <circle cx="40" cy="68" r="6" fill="#3B82F6"/>
      <circle cx="40" cy="48" r="6.5" fill="#8B5CF6"/>
      <circle cx="60" cy="48" r="6.5" fill="#8B5CF6"/>
      <circle cx="60" cy="26" r="6.5" fill="#06B6D4"/>
      <circle cx="82" cy="26" r="7" fill="#06B6D4"/>
    </svg>`,
  },
  {
    id: 'lado-b',
    label: 'MODO JUGABLE · OTAKU, RPG & GATOS',
    // Geometría híbrida: silueta de orejas de gato + cruceta/botones de mando RPG con el degradado DigitalSynapse
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 100 100" fill="none">
      ${GRAD_DEFS}
      <path d="M22 42 L26 18 L42 32 L58 32 L74 18 L78 42 C84 54 82 74 68 80 L32 80 C18 74 16 54 22 42 Z" stroke="url(#dsg)" stroke-width="4.2" stroke-linejoin="round"/>
      <path d="M35 50 V62 M29 56 H41" stroke="#3B82F6" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="65" cy="52" r="4.5" fill="#06B6D4"/>
      <circle cx="57" cy="60" r="4.5" fill="#8B5CF6"/>
      <path d="M45 68 Q50 73 55 68" stroke="#06B6D4" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'hablemos',
    label: 'CANAL VERIFICADO · GARANTÍA SIN HUMO',
    // Icono "Garantía / Trust Shield" de functions.php (contacto)
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 100 100" fill="none">
      ${GRAD_DEFS}
      <path d="M50 14 L18 25 L18 54 C18 74 50 88 50 88 C50 88 82 74 82 54 L82 25 Z" stroke="#1E293B" stroke-width="3"/>
      <path d="M50 23 L26 32 L26 54 C26 68 50 80 50 80 C50 80 74 68 74 54 L74 32 Z" stroke="url(#dsg)" stroke-width="4.2"/>
      <path d="M37 52 L46 61 L64 41" stroke="#06B6D4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="46" cy="61" r="4.5" fill="#06B6D4"/>
      <circle cx="50" cy="14" r="4.5" fill="#3B82F6"/>
    </svg>`,
  },
];

function sampleSvgToPoints(svgString: string, maxCount: number): Promise<SampledPoint[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = SAMPLE;
      c.height = SAMPLE;
      const x = c.getContext('2d', { willReadFrequently: true });
      if (!x) {
        resolve([]);
        return;
      }
      x.drawImage(img, 0, 0, SAMPLE, SAMPLE);
      const d = x.getImageData(0, 0, SAMPLE, SAMPLE).data;
      const pts: SampledPoint[] = [];

      for (let py = 0; py < SAMPLE; py += 2) {
        for (let px = 0; px < SAMPLE; px += 2) {
          const i = (py * SAMPLE + px) * 4;
          if (d[i + 3] < 110) continue;
          const dark = d[i] + d[i + 1] + d[i + 2] < 180;
          pts.push({
            u: px / SAMPLE,
            v: py / SAMPLE,
            c: dark
              ? 'rgb(100,116,139)'
              : `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`,
            dim: dark ? 0.5 : 1,
          });
        }
      }

      // Mezcla determinista para muestreo uniforme
      for (let j = pts.length - 1; j > 0; j--) {
        const m = (Math.random() * (j + 1)) | 0;
        const tmp = pts[j];
        pts[j] = pts[m];
        pts[m] = tmp;
      }

      // Ordenar suavemente por ángulo desde el centro para que el morphing entre formas sea orgánico y no caótico
      const sliced = pts.slice(0, maxCount);
      sliced.sort(
        (a, b) =>
          Math.atan2(a.v - 0.5, a.u - 0.5) - Math.atan2(b.v - 0.5, b.u - 0.5),
      );
      resolve(sliced);
    };
    img.onerror = () => resolve([]);
    img.src =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString.trim());
  });
}

export function ParticleField({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const badgeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    const narrow = window.innerWidth < 900;
    const maxParticles = narrow ? 680 : 1350;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let unsubFrame: (() => void) | null = null;

    Promise.all(CHAPTER_SVGS.map((ch) => sampleSvgToPoints(ch.svg, maxParticles))).then(
      (allShapes) => {
        if (cancelled || !allShapes[0] || allShapes[0].length === 0) return;

        const count = Math.min(
          maxParticles,
          ...allShapes.map((s) => (s.length > 0 ? s.length : maxParticles)),
        );
        const band = narrow ? 0.08 : 0.14;

        const particles: MorphParticle[] = Array.from({ length: count }, (_, idx) => {
          const base = allShapes[0][idx % allShapes[0].length];
          return {
            ix: Math.random(),
            iy: Math.random(),
            sx: base.u < 0.5 ? Math.random() * band : 1 - Math.random() * band,
            sy: Math.random(),
            z: Math.random(),
            r: 0.75 + Math.random() * Math.random() * 1.65,
            ph: Math.random() * TAU,
            delay: Math.random() * 0.45,
            targets: allShapes.map((shape) => shape[idx % shape.length]),
          };
        });

        let startTime = 0;
        let smoothShapeIdx = 0;
        let lastBadgeIdx = -1;

        unsubFrame = onFrame((now) => {
          if (!startTime) startTime = now;
          const t = (now - startTime) / 1000;
          const scrollY = window.scrollY || 0;

          // Determinar en qué sección estamos y el progreso continuo entre formas (0 .. 5)
          const probeY = H * 0.45;
          let targetIdx = 0;
          for (let i = 0; i < CHAPTER_SVGS.length; i++) {
            const el = document.getElementById(CHAPTER_SVGS[i].id);
            if (el) {
              const r = el.getBoundingClientRect();
              if (r.top <= probeY) {
                targetIdx = i;
              }
            }
          }

          smoothShapeIdx += (targetIdx - smoothShapeIdx) * (reducedMotion ? 1 : 0.07);
          const idxA = clamp(Math.floor(smoothShapeIdx), 0, CHAPTER_SVGS.length - 1);
          const idxB = clamp(idxA + 1, 0, CHAPTER_SVGS.length - 1);
          const morphT = smoothShapeIdx - idxA;
          // Curva smoothstep + swoop idéntica a particle-logo.js
          const e = morphT * morphT * (3 - 2 * morphT);
          const swoop = Math.sin(e * Math.PI);

          if (targetIdx !== lastBadgeIdx && badgeRef.current) {
            lastBadgeIdx = targetIdx;
            badgeRef.current.textContent = CHAPTER_SVGS[targetIdx].label;
          }

          // Posición y escala del emblema de partículas según el capítulo activo
          const wide = W >= 900;
          const shapeSize = wide
            ? Math.min(H * 0.56, W * 0.32)
            : Math.min(W * 0.68, H * 0.44);

          // En capítulos pares a la derecha, en impares ligeramente centrado-derecha para acompañar el scrollytelling
          const anchorXRatio = wide
            ? idxA === 0
              ? 0.74
              : idxA === 1
                ? 0.78
                : idxA === 2
                  ? 0.24
                  : idxA === 3
                    ? 0.76
                    : idxA === 4
                      ? 0.78
                      : 0.75
            : 0.5;
          const nextAnchorXRatio = wide
            ? idxB === 0
              ? 0.74
              : idxB === 1
                ? 0.78
                : idxB === 2
                  ? 0.24
                  : idxB === 3
                    ? 0.76
                    : idxB === 4
                      ? 0.78
                      : 0.75
            : 0.5;

          const curAnchorX = lerp(anchorXRatio, nextAnchorXRatio, e) * W - shapeSize / 2;
          const curAnchorY = H * 0.52 - shapeSize / 2;
          const shapeAlpha = wide ? 0.88 : 0.34;

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, W, H);
          ctx.globalCompositeOperation = 'lighter';

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            let intro = clamp((t - p.delay) / 1.35);
            intro = 1 - Math.pow(1 - intro, 3);

            const tA = p.targets[idxA];
            const tB = p.targets[idxB];

            const u = lerp(tA.u, tB.u, e);
            const v = lerp(tA.v, tB.v, e);

            // El 78% de las partículas forman la escultura del logo/icono de la sección,
            // y el 22% mantienen el campo lateral con paralaje de digitalsynapse.es
            const isLateralField = i % 5 === 0 && smoothShapeIdx > 0.25;

            let x: number;
            let y: number;

            if (isLateralField) {
              let fy = p.sy - (scrollY * (0.1 + 0.3 * p.z)) / H;
              fy = (((fy % 1) + 1) % 1) * 1.1 - 0.05;
              x = p.sx * W;
              y = fy * H + Math.sin(t * 0.5 + p.ph) * 6;
            } else {
              const breatheX = reducedMotion ? 0 : Math.sin(t * 0.9 + p.ph) * 1.1;
              const breatheY = reducedMotion ? 0 : Math.cos(t * 0.7 + p.ph) * 1.1;
              const bx = curAnchorX + u * shapeSize + breatheX;
              const by = curAnchorY + v * shapeSize + breatheY;

              x = lerp(p.ix * W, bx, intro) + swoop * Math.cos(p.ph) * (14 + p.z * 28);
              y = lerp(p.iy * H, by, intro) - swoop * (16 + p.z * 36);
            }

            const pulse = reducedMotion ? 0.85 : 0.7 + 0.3 * Math.sin(t * 2 + p.ph);
            ctx.globalAlpha =
              intro *
              pulse *
              (isLateralField ? 0.42 : shapeAlpha) *
              lerp(tA.dim, tB.dim, e);
            ctx.fillStyle = e < 0.5 ? tA.c : tB.c;
            ctx.beginPath();
            ctx.arc(x, y, p.r, 0, TAU);
            ctx.fill();
          }

          ctx.globalAlpha = 1;
        });
      },
    );

    return () => {
      cancelled = true;
      window.removeEventListener('resize', resize);
      if (unsubFrame) unsubFrame();
    };
  }, [reducedMotion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      />
      {/* Micro-HUD flotante abajo a la derecha que indica la geometría activa de partículas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-3 right-4 z-30 hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md px-3 py-1 font-mono text-[10px] tracking-wider text-[#a3a3a3]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" />
        <span ref={badgeRef}>ISOTIPO S-ISOMÉTRICA · DIGITALSYNAPSE</span>
      </div>
    </>
  );
}
