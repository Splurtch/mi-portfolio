import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const tags = tagsRef.current;

    if (!section || !image || !heading || !subheading || !tags) return;

    const ctx = gsap.context(() => {
      gsap.set(image, { clipPath: 'inset(100% 0 0 0)', scale: 1.2 });
      gsap.set(heading, { rotateX: 90, y: 100, opacity: 0 });
      gsap.set(subheading, { opacity: 0, y: 50 });
      gsap.set(tags.children, { opacity: 0, y: 30 });

      const entranceTl = gsap.timeline({ delay: 0.3 });

      entranceTl
        .to(image, {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          duration: 1.4,
          ease: 'expo.out',
        })
        .to(heading, {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
        }, '-=1')
        .to(subheading, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }, '-=0.6')
        .to(tags.children, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }, '-=0.4');

      // Solo animación de entrada, sin scroll effects para máxima fluidez
      gsap.to(image.querySelector('img'), {
        scale: 1.02,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = image.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = ((e.clientY - centerY) / rect.height) * -5;
      const rotateY = ((e.clientX - centerX) / rect.width) * 5;

      gsap.to(image, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    image.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      image.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-offwhite grain-overlay"
    >
      {/* Marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="font-display text-[25vw] text-dark/[0.02] whitespace-nowrap select-none">
          SYNJI D<span className="text-tech-accent">.</span>
        </h2>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-lime/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-tech-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-wood/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-7xl">
          
          {/* Text content */}
          <div className="order-2 lg:order-1 text-center lg:text-left perspective-1000">
            <h1
              ref={headingRef}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-dark leading-none mb-6 preserve-3d"
            >
              SYNJI D
              <br />
              <span className="text-wood-dark">MULATIERE</span>
              <span className="text-tech-accent">.</span>
            </h1>
            
            <p
              ref={subheadingRef}
              className="font-body text-xl sm:text-2xl text-dark/80 font-light tracking-wide"
            >
              Consultor de <span className="text-tech-accent font-medium">Growth Orgánico</span>. Ayudo a negocios de servicios y formación 
              a generar crecimiento real con sistemas que escalan sin depender de ti.
            </p>
            
            <div ref={tagsRef} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <span className="px-4 py-2 bg-wood/20 rounded-full text-sm font-mono text-dark/70 border border-wood/30 hover:border-tech-accent transition-colors">
                Project Manager FPE
              </span>
              <span className="px-4 py-2 bg-lime/30 rounded-full text-sm font-mono text-dark/70 border border-lime/50 hover:border-tech-accent transition-colors">
                Growth Marketing
              </span>
              <span className="px-4 py-2 bg-tech-accent/10 rounded-full text-sm font-mono text-dark/70 border border-tech-accent/30 hover:bg-tech-accent/20 transition-colors">
                Neuropsicología
              </span>
            </div>

            <p className="mt-6 text-sm text-dark/50 italic border-l-2 border-tech-accent pl-4">
              "El talento sin sistema es ruido caro."
            </p>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 flex justify-center perspective-1000">
            <div
              ref={imageRef}
              className="relative w-64 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] preserve-3d"
            >
              {/* Decorative frame */}
              <div className="absolute -inset-4 border-2 border-wood/30 rounded-lg transform rotate-3" />
              <div className="absolute -inset-4 border-2 border-tech-accent/30 rounded-lg transform -rotate-2" />
              
              {/* Main image */}
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-wood">
                <img
                  src="/synji-hero.png"
                  alt="Synji Mulatiere"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-dark text-cream px-4 py-2 rounded-lg shadow-lg animate-float border border-tech-accent/30">
                <span className="font-mono text-sm"><span className="text-tech-accent">10+</span> años</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-dark/50 uppercase tracking-widest">
            Descubre más
          </span>
          <ChevronDown className="w-5 h-5 text-tech-accent animate-bounce-subtle" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
