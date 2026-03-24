import { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Users, 
  Lightbulb,
  ChevronRight,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

interface CVCard {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  items: {
    title: string;
    company?: string;
    period?: string;
    location?: string;
    description?: string;
  }[];
}

const cvCards: CVCard[] = [
  {
    id: 1,
    title: 'Experiencia',
    subtitle: 'Laboral',
    icon: Briefcase,
    items: [
      { title: 'Project Manager FPE', company: 'Esatur Formación', period: '2024 - Actual', location: 'Alicante', description: 'Planificación y coordinación operativa.' },
      { title: 'Growth Marketing Manager', company: 'Talent Bridge', period: '2025 - Actual', location: 'Remoto', description: 'Embudo AARRR completo.' },
      { title: 'Docente FPE', company: 'FOREM PV, Cáritas', period: '2017 - Actual', location: 'Alicante', description: 'Certificados profesionalidad. +95% finalización.' },
      { title: 'Analista Comercial', company: 'Telyco Selección', period: '2018 - 2022', location: 'Alicante', description: 'KPIs con SAP y Salesforce.' },
    ],
  },
  {
    id: 2,
    title: 'Formación',
    subtitle: 'Académica',
    icon: GraduationCap,
    items: [
      { title: 'Máster IA', company: 'BIG School', period: '2025 - Actual', description: 'IA aplicada a negocio.' },
      { title: 'MBA & Máster Marketing', company: 'Univ. Isabel I', period: '2024 - 2025', description: 'Nota: 8,55. Estrategia digital.' },
      { title: 'Máster Neurociencias', company: 'Univ. Valencia', period: '2015 - 2016', description: 'Base para neuromarketing.' },
      { title: 'Grado Psicología', company: 'Univ. Católica Valencia', period: '2011 - 2015', description: 'Análisis comportamiento humano.' },
    ],
  },
  {
    id: 3,
    title: 'Certificaciones',
    subtitle: 'Especializadas',
    icon: Award,
    items: [
      { title: 'Google Data Analytics' },
      { title: 'Google Project Management' },
      { title: 'IFCT127PO - Big Data' },
      { title: 'IFCD093PO - ML Python' },
      { title: 'SEO y Monetización' },
      { title: 'Aplicando la IA - IronHack' },
    ],
  },
  {
    id: 4,
    title: 'Skills',
    subtitle: 'Técnicos',
    icon: Code,
    items: [
      { title: 'Project Management', description: 'Agile, Scrum, OKRs' },
      { title: 'Growth Marketing', description: 'AARRR, CRO, Funnels' },
      { title: 'SEO/SEM', description: 'Technical SEO, GA4' },
      { title: 'Inteligencia Artificial', description: 'Prompt Engineering' },
      { title: 'Data Analysis', description: 'Python, SQL' },
    ],
  },
  {
    id: 5,
    title: 'Idiomas',
    subtitle: 'Comunicación',
    icon: Users,
    items: [
      { title: 'Español', description: 'Nativo' },
      { title: 'Portugués', description: 'Nativo' },
      { title: 'Inglés', description: 'B1 - Intermedio' },
      { title: 'Catalán', description: 'Comprensión básica' },
    ],
  },
  {
    id: 6,
    title: 'Intereses',
    subtitle: 'Personales',
    icon: Lightbulb,
    items: [
      { title: 'Neurociencia aplicada', description: 'Aprendizaje' },
      { title: 'Tecnología educativa', description: 'EdTech' },
      { title: 'Desarrollo personal', description: 'Productividad' },
      { title: 'Voluntariado', description: 'Banco Alimentos' },
    ],
  },
];

const CVCards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % cvCards.length);
    setExpandedId(null);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + cvCards.length) % cvCards.length);
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

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex;
    const totalCards = cvCards.length;
    
    // Normalizar diff
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
        transform: 'translateX(-72%) translateY(10px) rotate(-8deg) scale(0.88)',
        opacity: 0.65,
        zIndex: 50,
      };
    } else if (normalizedDiff === 1 || (normalizedDiff === -(totalCards - 1))) {
      // Tarjeta siguiente - parcialmente visible a la derecha
      return {
        transform: 'translateX(72%) translateY(10px) rotate(8deg) scale(0.88)',
        opacity: 0.65,
        zIndex: 50,
      };
    } else if (normalizedDiff === -2 || normalizedDiff === 2) {
      // Tarjetas más lejanas - apenas visibles
      const isLeft = normalizedDiff < 0;
      return {
        transform: `translateX(${isLeft ? '-88%' : '88%'}) translateY(20px) rotate(${isLeft ? '-12' : '12'}deg) scale(0.78)`,
        opacity: 0.35,
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
      id="cv"
      className="relative w-full bg-wood-texture py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Wood texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-offwhite via-wood/5 to-offwhite pointer-events-none" />

      {/* Marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="font-display text-[15vw] sm:text-[18vw] text-dark/[0.03] whitespace-nowrap select-none">
          CV<span className="text-tech-accent">.</span>
        </h2>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="font-mono text-xs sm:text-sm text-wood-dark uppercase tracking-widest">
            Mi trayectoria
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark mt-2 mb-2">
            CURRICULUM VITAE<span className="text-tech-accent">.</span>
          </h2>
          <p className="text-sm sm:text-base text-dark/60 max-w-lg mx-auto">
            Desliza las cartas para navegar
          </p>
        </div>

        {/* Cards Deck Container */}
        <div 
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
          {cvCards.map((card, index) => {
            const position = getCardPosition(index);
            const isActive = index === activeIndex;
            const isExpanded = expandedId === card.id;
            
            return (
              <div
                key={card.id}
                className="absolute w-[88%] sm:w-[65%] max-w-sm cursor-pointer"
                style={{
                  ...position,
                  transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onClick={() => {
                  if (isActive) {
                    setExpandedId(expandedId === card.id ? null : card.id);
                  } else {
                    setActiveIndex(index);
                    setExpandedId(null);
                  }
                }}
              >
                <div className={`card-wood rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-tech-accent' : ''
                } ${isActive ? 'shadow-2xl' : ''}`}>
                  {/* Card header */}
                  <div className="relative p-3 sm:p-4 border-b border-wood/30">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border border-tech-accent/30">
                        <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-cream" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base sm:text-lg text-dark truncate">{card.title}</h3>
                        <span className="font-mono text-xs text-tech-accent">{card.subtitle}</span>
                      </div>
                      <span className="font-display text-lg sm:text-xl text-wood/30">0{card.id}</span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className={`p-3 sm:p-4 bg-cream/50 transition-all duration-500 ${
                    isExpanded ? 'max-h-[340px] sm:max-h-[380px]' : 'max-h-36 sm:max-h-40'
                  } overflow-hidden overflow-y-auto`}>
                    <div className="space-y-2">
                      {card.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="p-2 sm:p-2.5 bg-cream rounded-lg border border-wood/20"
                        >
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tech-accent mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-body font-semibold text-dark text-xs sm:text-sm">{item.title}</h4>
                              {item.company && (
                                <p className="text-xs text-tech-accent font-mono">{item.company}</p>
                              )}
                              {(item.period || item.location) && (
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 text-xs text-dark/60">
                                  {item.period && (
                                    <span className="flex items-center gap-0.5">
                                      <Calendar className="w-2.5 h-2.5 text-tech-accent" />
                                      {item.period}
                                    </span>
                                  )}
                                  {item.location && (
                                    <span className="flex items-center gap-0.5">
                                      <MapPin className="w-2.5 h-2.5 text-tech-accent" />
                                      {item.location}
                                    </span>
                                  )}
                                </div>
                              )}
                              {item.description && (
                                <p className="text-xs text-dark/70 mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expand hint */}
                  {isActive && !isExpanded && (
                    <div className="px-3 pb-2 bg-cream/50 text-center">
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

          <div className="flex gap-1.5 sm:gap-2">
            {cvCards.map((_, index) => (
              <button
                key={index}
                onClick={() => { setActiveIndex(index); setExpandedId(null); }}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-tech-accent w-5 sm:w-7' : 'bg-wood/40 w-2 sm:w-2.5 hover:bg-wood/60'
                }`}
                aria-label={`Ir a tarjeta ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-cream rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-tech-accent hover:text-cream transition-all border border-wood/20"
            aria-label="Siguiente"
          >
            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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

export default CVCards;
