import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Auditoría',
    subtitle: 'Diagnóstico gratuito',
    description: 'Analizo tu situación actual: procesos, métricas, competencia y oportunidades. Sin compromiso.',
    duration: '30 min',
  },
  {
    id: 2,
    icon: Lightbulb,
    title: 'Estrategia',
    subtitle: 'Plan de acción',
    description: 'Diseño un roadmap personalizado con objetivos claros, hitos medibles y prioridades.',
    duration: '1 semana',
  },
  {
    id: 3,
    icon: Rocket,
    title: 'Implementación',
    subtitle: 'Ejecución ágil',
    description: 'Pongo en marcha los sistemas, automatizaciones y procesos acordados.',
    duration: '30 días',
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Optimización',
    subtitle: 'Mejora continua',
    description: 'Monitoreo, ajustes y escalado basado en datos reales de tu negocio.',
    duration: 'Continuo',
  },
];

const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stepsElements = stepsRef.current.filter(Boolean);

    if (!section || stepsElements.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate steps on scroll
      stepsElements.forEach((step, index) => {
        gsap.from(step, {
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Connect line animation
      const line = section.querySelector('.connect-line');
      if (line) {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-offwhite py-20 lg:py-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="font-mono text-sm text-wood-dark uppercase tracking-widest">
            Cómo trabajo
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark mt-2 mb-4">
            DE LA IDEA AL RESULTADO
          </h2>
          <p className="text-lg text-dark/60">
            Proceso probado en +50 empresas. Sin teorías, solo ejecución.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="connect-line absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-wood/20 lg:-translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => {
                  if (el) stepsRef.current[index] = el;
                }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${
                  index !== steps.length - 1 ? 'lg:pb-16' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 lg:left-1/2 w-4 h-4 bg-lime rounded-full border-4 border-offwhite shadow-lg lg:-translate-x-1/2 z-10" />

                {/* Content */}
                <div className={`pl-20 lg:pl-0 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:col-start-2 lg:pl-16'}`}>
                  <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-wood/10 hover:border-lime hover:shadow-glow transition-all duration-300">
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-cream" />
                      </div>
                      <div className={index % 2 === 0 ? 'lg:text-right' : ''}>
                        <span className="font-mono text-xs text-wood-dark uppercase tracking-wider">
                          Paso 0{step.id}
                        </span>
                        <h3 className="font-display text-xl text-dark">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-dark/70 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    
                    <div className={`flex items-center gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      <span className="px-3 py-1 bg-lime/20 rounded-full text-xs font-mono text-dark/60">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                {index % 2 === 0 && <div className="hidden lg:block" />}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-dark/60 mb-4">
            ¿Listo para empezar? La auditoría es gratuita.
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-dark text-cream rounded-full font-mono font-semibold hover:bg-wood-dark transition-colors"
          >
            Quiero mi auditoría gratis
          </button>
        </div>
      </div>
    </section>
  );
};

export default Process;
