import { useState, useRef, useEffect } from 'react';
import { TrendingUp, Settings, Code, GraduationCap, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  color: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Growth Strategy',
    subtitle: 'Estrategia de Crecimiento',
    description: 'Diseño de sistemas de adquisición y retención que escalan tu negocio sin depender de aumentar el equipo.',
    features: ['Auditoría de embudo', 'Dashboard KPIs', 'Roadmap 90D', 'Optimización CRO'],
    icon: TrendingUp,
    color: 'lime',
  },
  {
    id: 2,
    title: 'Arquitectura 30D™',
    subtitle: 'Sistemas de Negocio',
    description: 'Estructura operativa que ordena procesos, elimina cuellos de botella y prepara tu empresa para escalar.',
    features: ['Mapeo de procesos', 'Playbook ops', 'Automatización', 'Documentación'],
    icon: Settings,
    color: 'wood',
  },
  {
    id: 3,
    title: 'SEO & Automatización',
    subtitle: 'Growth Orgánico',
    description: 'Tráfico cualificado que crece solo + sistemas que ahorran horas de trabajo manual cada semana.',
    features: ['Auditoría SEO', 'Estrategia contenidos', 'Automatización', 'Integraciones'],
    icon: Code,
    color: 'tech',
  },
  {
    id: 4,
    title: 'Consultoría FPE',
    subtitle: 'Formación Subvencionada',
    description: 'Gestión integral de proyectos FPE: desde la solicitud de ayudas hasta el cierre documental.',
    features: ['Licitaciones', 'Coordinación', 'Control doc.', 'Optimización'],
    icon: GraduationCap,
    color: 'wood-dark',
  },
];

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
    setExpandedId(null);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    setExpandedId(null);
  };

  // Touch handlers para swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = touchStartX.current - touchCurrentX.current;
    const threshold = 60;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  // Mouse drag handlers para desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    touchCurrentX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    touchCurrentX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = touchStartX.current - touchCurrentX.current;
    const threshold = 60;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      lime: 'bg-lime/20 text-lime border-lime',
      wood: 'bg-wood/20 text-wood border-wood',
      'wood-dark': 'bg-wood-dark/20 text-wood-dark border-wood-dark',
      tech: 'bg-tech-accent/20 text-tech-accent border-tech-accent',
    };
    return colors[color] || colors.lime;
  };

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex;
    const totalCards = services.length;
    
    // Normalizar diff para que siempre esté en rango [-2, 2]
    let normalizedDiff = diff;
    if (diff > totalCards / 2) normalizedDiff = diff - totalCards;
    if (diff < -totalCards / 2) normalizedDiff = diff + totalCards;
    
    if (normalizedDiff === 0) {
      // Tarjeta activa - centrada
      return {
        transform: 'translateX(0) translateY(0) rotate(0deg) scale(1)',
        opacity: 1,
        zIndex: 100,
      };
    } else if (normalizedDiff === -1 || (normalizedDiff === totalCards - 1)) {
      // Tarjeta anterior - parcialmente visible a la izquierda
      return {
        transform: 'translateX(-75%) translateY(10px) rotate(-8deg) scale(0.9)',
        opacity: 0.7,
        zIndex: 50,
      };
    } else if (normalizedDiff === 1 || (normalizedDiff === -(totalCards - 1))) {
      // Tarjeta siguiente - parcialmente visible a la derecha
      return {
        transform: 'translateX(75%) translateY(10px) rotate(8deg) scale(0.9)',
        opacity: 0.7,
        zIndex: 50,
      };
    } else if (normalizedDiff === -2 || normalizedDiff === 2) {
      // Tarjetas más lejanas - apenas visibles en los bordes
      const isLeft = normalizedDiff < 0;
      return {
        transform: `translateX(${isLeft ? '-90%' : '90%'}) translateY(20px) rotate(${isLeft ? '-12' : '12'}deg) scale(0.8)`,
        opacity: 0.4,
        zIndex: 10,
      };
    } else {
      // Ocultas
      return {
        transform: 'translateX(0) scale(0.7)',
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  return (
    <section
      id="services"
      className="relative w-full bg-wood-texture py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Wood texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-offwhite via-wood/5 to-offwhite pointer-events-none" />

      {/* Marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="font-display text-[15vw] sm:text-[18vw] text-dark/[0.03] whitespace-nowrap select-none">
          SERVICIOS
        </h2>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="font-mono text-xs sm:text-sm text-wood-dark uppercase tracking-widest">
            Qué hago
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark mt-2 mb-2">
            SERVICIOS<span className="text-tech-accent">.</span>
          </h2>
          <p className="text-sm sm:text-base text-dark/60 max-w-lg mx-auto">
            Desliza las cartas para navegar
          </p>
        </div>

        {/* Cards Deck Container */}
        <div 
          ref={containerRef}
          className="relative h-[420px] sm:h-[460px] lg:h-[480px] flex items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {services.map((service, index) => {
            const position = getCardPosition(index);
            const isActive = index === activeIndex;
            const isExpanded = expandedId === service.id;
            
            return (
              <div
                key={service.id}
                className="absolute w-[85%] sm:w-[70%] max-w-md cursor-pointer"
                style={{
                  ...position,
                  transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onClick={() => {
                  if (isActive) {
                    setExpandedId(expandedId === service.id ? null : service.id);
                  } else {
                    // Si hace click en una tarjeta lateral, traerla al centro
                    setActiveIndex(index);
                    setExpandedId(null);
                  }
                }}
              >
                <div className={`card-wood rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-tech-accent' : ''
                } ${isActive ? 'shadow-2xl' : ''}`}>
                  {/* Card header */}
                  <div className="relative p-4 sm:p-5 border-b border-wood/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${getColorClasses(service.color)}`}>
                        <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-dark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg sm:text-xl text-dark truncate">{service.title}</h3>
                        <span className="font-mono text-xs text-wood-dark">{service.subtitle}</span>
                      </div>
                      <span className="font-display text-xl sm:text-2xl text-wood/30">0{service.id}</span>
                    </div>
                  </div>

                  {/* Card content - expandible */}
                  <div className={`p-4 sm:p-5 bg-cream/50 transition-all duration-500 ${
                    isExpanded ? 'max-h-[300px] sm:max-h-[340px]' : 'max-h-28 sm:max-h-32'
                  } overflow-hidden overflow-y-auto`}>
                    <p className="text-sm sm:text-base text-dark/70 leading-relaxed mb-3">
                      {service.description}
                    </p>
                    
                    <div className={`transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="bg-offwhite rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3">
                        <h4 className="font-mono text-xs text-dark/50 uppercase tracking-wider mb-2">
                          Incluye
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {service.features.map((feature, fIndex) => (
                            <span key={fIndex} className="px-2 sm:px-3 py-1 bg-cream rounded-full text-xs text-dark flex items-center gap-1">
                              <Check className="w-3 h-3 text-tech-accent" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 sm:py-3 bg-dark text-cream rounded-lg sm:rounded-xl font-mono text-sm hover:bg-tech-accent transition-colors"
                      >
                        Hablar de esto
                      </button>
                    </div>
                  </div>

                  {/* Expand hint */}
                  {isActive && !isExpanded && (
                    <div className="px-4 pb-3 bg-cream/50 text-center">
                      <span className="font-mono text-xs text-tech-accent">Toca para ver más</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={goToPrev}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-cream rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-tech-accent hover:text-cream transition-all border border-wood/20"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => { setActiveIndex(index); setExpandedId(null); }}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-tech-accent w-6 sm:w-8' : 'bg-wood/40 w-2 sm:w-2.5 hover:bg-wood/60'
                }`}
                aria-label={`Ir a servicio ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-cream rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-tech-accent hover:text-cream transition-all border border-wood/20"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Indicador de swipe */}
        <p className="text-center text-xs text-dark/40 mt-3 sm:hidden">
          ← Desliza las cartas →
        </p>
      </div>
    </section>
  );
};

export default Services;
