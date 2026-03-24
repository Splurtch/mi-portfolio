import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Transition = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const images = imagesRef.current.filter(Boolean);

    if (!section || !content || images.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(content, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      images.forEach((image, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        
        gsap.from(image, {
          y: 100 * direction,
          rotation: 10 * direction,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });

        gsap.to(image, {
          y: `${15 * direction}`,
          duration: 3 + index,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const floatingImages = [
    { src: '/service-1.jpg', style: { top: '10%', left: '5%', width: '200px', rotation: -8 } },
    { src: '/service-2.jpg', style: { top: '60%', left: '8%', width: '150px', rotation: 5 } },
    { src: '/service-3.jpg', style: { top: '15%', right: '5%', width: '180px', rotation: 8 } },
    { src: '/service-4.jpg', style: { top: '55%', right: '10%', width: '160px', rotation: -5 } },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-dark overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-tech-dark to-dark" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 170, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating images */}
      {floatingImages.map((img, index) => (
        <div
          key={index}
          ref={(el) => { imagesRef.current[index] = el; }}
          className="absolute hidden lg:block rounded-xl overflow-hidden shadow-tech-glow opacity-60"
          style={{
            ...img.style,
            transform: `rotate(${img.style.rotation}deg)`,
          }}
        >
          <img src={img.src} alt="" className="w-full h-auto" />
        </div>
      ))}

      {/* Central content */}
      <div
        ref={contentRef}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center text-center"
      >
        {/* Decorative line */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-tech-accent to-transparent" />

        <span className="font-mono text-sm text-tech-accent uppercase tracking-[0.3em] mb-6">
          Ahora llega lo bueno
        </span>

        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream mb-6">
          PROYECTOS<span className="text-tech-accent">.</span>
        </h2>

        <p className="max-w-2xl text-cream/60 text-lg sm:text-xl leading-relaxed mb-12">
          De la estrategia a la ejecución. Estos son algunos de los proyectos 
          en los que he trabajado, desde consultoría hasta desarrollo web.
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['React', 'TypeScript', 'Node.js', 'Python', 'SEO', 'Growth'].map((tech, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-tech-light/50 border border-tech-accent/30 rounded-full font-mono text-sm text-tech-accent hover:bg-tech-accent/20 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 text-cream/40">
          <span className="font-mono text-xs uppercase tracking-widest">Scroll para ver</span>
          <ArrowDown className="w-5 h-5 text-tech-accent animate-bounce-subtle" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-offwhite to-transparent" />
    </section>
  );
};

export default Transition;
