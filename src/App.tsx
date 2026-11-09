import { useEffect } from 'react';
import { startScroll } from '@/lib/scroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ParticleField } from '@/components/ParticleField';
import { SiteHeader } from '@/components/SiteHeader';
import { HeroScrolly } from '@/sections/HeroScrolly';
import { TrajectoryZigzag } from '@/sections/TrajectoryZigzag';
import { EcosystemReel } from '@/sections/EcosystemReel';
import { MarketingWebShowcase } from '@/sections/MarketingWebShowcase';
import { MethodAndVoice } from '@/sections/MethodAndVoice';
import { PlayfulOtisLab } from '@/sections/PlayfulOtisLab';
import { ContactTerminal } from '@/sections/ContactTerminal';
import './App.css';

/**
 * Arquitectura Scrollytelling de Cámara Fija de Principio a Fin (0% -> 100%):
 * - Los 7 marcadores (`#despertar` .. `#hablemos`) definen la pista temporal de scroll
 *   sin ningún fondo ni borde que suba o baje por la pantalla.
 * - Las 7 escenas (`fixed inset-0 h-[100svh]`) viven en el mismo plano de cámara fija:
 *   al mover la rueda del ratón, las tarjetas, mapas, carretes, proyectos web/SEO, notas de voz y el
 *   laboratorio elástico aparecen, se desplazan y se transforman frente a ti.
 */

export function App() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const cleanup = startScroll(reducedMotion);
    return cleanup;
  }, [reducedMotion]);

  return (
    <div className="relative bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#06B6D4]/25 selection:text-[#f5f5f5]">
      {/* Lienzo fijo de 1.350 partículas de DigitalSynapse que cambia de forma en cada capítulo */}
      <ParticleField reducedMotion={reducedMotion} />

      {/* Cabecera flotante con progreso y salto directo */}
      <SiteHeader />

      {/* Escenarios fijos en el viewport (la página nunca sube como un documento estático) */}
      <main className="relative z-10">
        <HeroScrolly reducedMotion={reducedMotion} />
        <TrajectoryZigzag reducedMotion={reducedMotion} />
        <EcosystemReel />
        <MarketingWebShowcase />
        <MethodAndVoice />
        <PlayfulOtisLab reducedMotion={reducedMotion} />
        <ContactTerminal />
      </main>

      {/* Pista temporal invisible que gobierna el progreso de principio a fin */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        <div id="despertar" style={{ height: '340svh' }} />
        <div id="zigzag" style={{ height: '360svh' }} />
        <div id="ecosistema" style={{ height: '360svh' }} />
        <div id="marketing-web" style={{ height: '380svh' }} />
        <div id="metodo" style={{ height: '420svh' }} />
        <div id="lado-b" style={{ height: '340svh' }} />
        <div id="hablemos" style={{ height: '260svh' }} />
      </div>
    </div>
  );
}

export default App;
