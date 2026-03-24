import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gamepad2, BookOpen, Tv, Dumbbell, Sparkles, TrendingUp, Settings, Code, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!section || !image || !content) return;

    const ctx = gsap.context(() => {
      // Animaciones simples al entrar en viewport - sin scrub
      gsap.from(image, {
        x: -50,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      const textElements = content.querySelectorAll('.animate-item');
      gsap.from(textElements, {
        y: 25,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Efecto de grayscale
      const img = image.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { filter: 'grayscale(100%)' },
          {
            filter: 'grayscale(0%)',
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

    }, section);

    return () => ctx.revert();
  }, []);

  const hobbies = [
    { icon: Gamepad2, title: 'Videojuegos', desc: 'Mundo abierto, RPG, explorar cada rincón' },
    { icon: BookOpen, title: 'Lectura', desc: 'Crecimiento personal, manga, anime' },
    { icon: Tv, title: 'Coleccionismo', desc: 'Otaku de toda la vida' },
    { icon: Dumbbell, title: 'Artes Marciales', desc: 'Wing Tsun, Capoeira' },
  ];

  const pilares = [
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      desc: 'Diseño sistemas de adquisición y retención que escalan tu negocio sin depender de aumentar el equipo.',
      color: 'from-lime/30 to-lime/10',
      borderColor: 'border-lime',
    },
    {
      icon: Settings,
      title: 'Arquitectura de Negocio',
      desc: 'Estructura operativa que ordena procesos, elimina cuellos de botella y prepara tu empresa para escalar.',
      color: 'from-wood/30 to-wood/10',
      borderColor: 'border-wood',
    },
    {
      icon: Code,
      title: 'Automatización & Tech',
      desc: 'Tráfico cualificado que crece solo + sistemas que ahorran horas de trabajo manual cada semana.',
      color: 'from-tech-accent/20 to-tech-accent/5',
      borderColor: 'border-tech-accent',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen w-full bg-offwhite py-20 lg:py-32"
    >
      {/* Marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="font-display text-[20vw] text-dark/[0.03] whitespace-nowrap select-none">
          SOBRE MÍ
        </h2>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Sticky Image */}
          <div className="lg:sticky lg:top-32">
            <div
              ref={imageRef}
              className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-wood"
            >
              <img
                src="/synji-cafe.png"
                alt="Synji D. Mulatiere"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-dark/80 backdrop-blur-sm rounded-xl p-4 border-l-2 border-tech-accent">
                  <p className="font-mono text-cream text-sm">
                    "He pasado años perdidos hasta que encontré el gusto por aprender."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="animate-item">
              <span className="font-mono text-sm text-wood-dark uppercase tracking-widest">
                Sobre mí
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark mt-2">
                ¿QUIÉN SOY<span className="text-tech-accent">?</span>
              </h2>
            </div>

            <div className="animate-item space-y-4 text-dark/80 leading-relaxed">
              <p className="text-lg">
                Soy neuropsicólogo de formación, aunque mi camino ha sido bastante zigzagueante. 
                He pasado por la hostelería, los recursos humanos, la psicoeducación... hasta 
                que encontré mi sitio en el cruce entre <span className="text-tech-accent font-medium">formación</span>, <span className="text-wood-dark font-medium">tecnología</span> y <span className="text-lime font-medium">crecimiento de negocio</span>.
              </p>
              
              <p className="text-lg">
                Llevo más de 10 años diseñando e impartiendo formación FPE, y en paralelo he ido 
                construyendo sistemas de growth. Eso me ha dado una visión clara: muchos centros 
                tienen buen contenido pero <span className="text-tech-accent font-medium">procesos débiles</span>.
              </p>
              
              <p className="text-lg">
                Ahora me dedico a ayudar a negocios de servicios a escalar con sistemas orgánicos 
                que funcionan sin depender de que el fundador esté encima 24/7.
              </p>
            </div>

            <div className="animate-item p-6 bg-cream rounded-2xl border-l-4 border-tech-accent">
              <p className="text-dark/70 italic">
                "El talento sin sistema es ruido caro. Diseño arquitecturas de negocio 
                que escalan sin depender de ti."
              </p>
            </div>

            {/* 3 Pilares */}
            <div className="animate-item">
              <h3 className="font-display text-xl text-dark mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-tech-accent" />
                En qué te puedo ayudar
              </h3>
              <div className="space-y-4">
                {pilares.map((pilar, index) => (
                  <div 
                    key={index}
                    className={`p-5 bg-gradient-to-r ${pilar.color} rounded-xl border ${pilar.borderColor}/30 hover:${pilar.borderColor} transition-all duration-300 group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <pilar.icon className="w-6 h-6 text-cream" />
                      </div>
                      <div>
                        <h4 className="font-display text-lg text-dark mb-1">{pilar.title}</h4>
                        <p className="text-sm text-dark/70">{pilar.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobbies */}
            <div className="animate-item">
              <h3 className="font-display text-xl text-dark mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime" />
                Fuera del trabajo
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {hobbies.map((hobby, index) => (
                  <div key={index} className="p-4 bg-cream rounded-xl border border-wood/10 hover:border-tech-accent/50 transition-colors">
                    <hobby.icon className="w-5 h-5 text-wood-dark mb-2" />
                    <h4 className="font-mono text-sm text-dark">{hobby.title}</h4>
                    <p className="text-xs text-dark/60">{hobby.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de música - Mi banda sonora */}
            <div className="animate-item">
              <div className="card-wood rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                {/* Decoración musical */}
                <div className="absolute -right-8 -top-8 text-[120px] opacity-5 select-none">🎸</div>
                <div className="absolute -left-4 -bottom-4 text-[80px] opacity-5 select-none">🎵</div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center shadow-lg border border-tech-accent/30">
                      <Headphones className="w-6 h-6 text-cream" />
                    </div>
                    <div>
                      <span className="font-mono text-sm text-tech-accent uppercase tracking-widest">
                        Mi banda sonora
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-dark">
                        Lo que suena en mis auriculares
                      </h3>
                    </div>
                  </div>

                  <p className="text-dark/70 leading-relaxed mb-4">
                    Crecí con el sonido de <span className="text-tech-accent font-medium">Korn, Slipknot, Deftones, Linkin Park y Rage Against The Machine</span> resonando a todo volumen. Pero mi paleta musical es un caos hermoso: desde el rock clásico de los 60s y 70s hasta el punk más visceral, pasando por el metal más oscuro, el tech más experimental y el dubstep que te sacude el pecho.
                  </p>

                  <p className="text-dark/70 leading-relaxed mb-4">
                    Indie, post-rock, nu metal, hardcore, electrónica, jazz fusion... si tiene alma y transmite algo real, está en mi playlist. Lo único que no encontrarás ahí es el electrolatino. <span className="text-wood-dark italic">Simplemente no es mi frecuencia.</span>
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {['Rock', 'Metal', 'Punk', 'Tech', 'Dubstep', 'Indie', 'Nu Metal', 'Post-Rock', 'Hardcore', '60s', '70s', '80s'].map((genre, i) => (
                      <span key={i} className="px-3 py-1 bg-dark/5 rounded-full text-xs font-mono text-dark/60 border border-wood/20">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
