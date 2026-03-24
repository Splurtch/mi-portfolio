import { useEffect, useRef, useState, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, ArrowUpRight, TrendingUp, Users, Code, Award, Coffee, FileText, Brain, Zap, Palette, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  icon: React.ElementType;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Digital Synapse',
    category: 'CEO & Founder',
    description: 'Mi consultora de arquitectura de negocio. Ayudo a empresas de servicios a escalar con sistemas que funcionan sin depender del fundador.',
    image: '/project-1.jpg',
    tags: ['Growth Strategy', 'Arquitectura 30D™', 'Automatización'],
    link: 'https://digitalsynapse.es',
    icon: TrendingUp,
  },
  {
    id: 2,
    title: 'NEXUS Coaching Institute',
    category: 'CMO',
    description: 'Escuela de Coaching e Inteligencia Emocional. +5.000 alumnos formados con certificaciones oficiales.',
    image: '/project-2.jpg',
    tags: ['Marketing Digital', 'SEO', 'Automatización'],
    link: 'https://www.nexuscoachinginstitute.com',
    icon: Award,
  },
  {
    id: 3,
    title: 'APE-s',
    category: 'Founder',
    description: 'Blog de entretenimiento: gaming, educación y salud mental. Contenido viral sobre cultura otaku y videojuegos.',
    image: '/project-3.jpg',
    tags: ['Content Marketing', 'SEO', 'Affiliate'],
    link: 'https://ape-s.com',
    icon: Users,
  },
  {
    id: 4,
    title: 'JUJUJU Aquacenter SL',
    category: 'Desarrollador CRM',
    description: 'Sistema CRM a medida para gestión de clientes, reservas y operaciones de centro acuático.',
    image: '/project-4.jpg',
    tags: ['CRM', 'Automatización', 'Desarrollo'],
    icon: Code,
  },
  {
    id: 5,
    title: 'Suite SEO',
    category: 'Herramienta Interna',
    description: 'Dashboard integral para análisis SEO: keywords, competencia, backlinks y auditorías técnicas automatizadas.',
    image: '/project-1.jpg',
    tags: ['SEO', 'Python', 'Data Analysis', 'Automatización'],
    icon: Zap,
  },
  {
    id: 6,
    title: 'AutoDoc Pro',
    category: 'SaaS en desarrollo',
    description: 'Generación automática de documentación empresarial. Contratos, informes y procedimientos en segundos, no en horas.',
    image: '/project-2.jpg',
    tags: ['IA', 'Documentación', 'Productividad', 'B2B'],
    icon: FileText,
  },
  {
    id: 7,
    title: 'PromptForge',
    category: 'Repositorio IA',
    description: 'Biblioteca de prompts optimizados y especializados. Creación de Asistentes GPTs, GEMs y agents personalizados para negocio.',
    image: '/project-3.jpg',
    tags: ['Prompt Engineering', 'OpenAI', 'Gemini', 'Agents'],
    icon: Brain,
  },
  {
    id: 8,
    title: 'BrandCanvas',
    category: 'App Interna',
    description: 'Canva privado para empresas. Plantillas de marca, documentos, PPTs y RRSS con importación JSON para generación automática.',
    image: '/project-4.jpg',
    tags: ['Branding', 'No-Code', 'Automatización', 'Design'],
    icon: Palette,
  },
  {
    id: 9,
    title: 'MindScape Insight',
    category: 'Side Project',
    description: 'Herramienta educativa con tests de personalidad y autoconocimiento. Sin fines clínicos, puro aprendizaje. Hecho con ❤️ en Lovable.',
    image: '/project-1.jpg',
    tags: ['EdTech', 'Psicología', 'Lovable', 'No-Code'],
    link: 'https://mindscape-insight-54.lovable.app',
    icon: Sparkles,
  },
];

const webInDevelopment = [
  { title: 'Blanqueamiento Dental Casa', url: 'https://blanqueamientodentalcasa.com', description: 'Nicho SEO + Affiliate' },
  { title: 'Matrícula de Vida', url: 'https://matriculadevida.com', description: 'Terapias holísticas' },
  { title: 'Excusitas', url: 'https://excusitas.com', description: 'Entretenimiento viral' },
];

const techStack = ['WordPress', 'React', 'Node.js', 'Python', 'HTML/CSS', 'JavaScript', 'Make', 'n8n', 'IA', 'Lovable', 'Cursor'];

interface ProjectCardProps {
  project: Project;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, isHovered, onHover, onLeave }, ref) => {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      if (!imageRef.current) return;
      if (isHovered) {
        gsap.to(imageRef.current, { filter: 'hue-rotate(10deg) saturate(1.2)', duration: 0.3 });
      } else {
        gsap.to(imageRef.current, { filter: 'hue-rotate(0deg) saturate(1)', duration: 0.3 });
      }
    }, [isHovered]);

    return (
      <div
        ref={ref}
        className="group relative perspective-1000"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className={`relative overflow-hidden rounded-2xl bg-cream border border-wood/20 transition-all duration-500 ${
          isHovered ? 'shadow-tech-glow scale-[1.02] border-tech-accent/50' : 'shadow-card'
        }`}>
          {/* Image */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img
              ref={imageRef}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-70'
            }`} />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-tech-accent/90 text-dark text-xs font-mono rounded-full">
                {project.category}
              </span>
            </div>

            {/* Icon badge */}
            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 bg-cream/90 rounded-full flex items-center justify-center border border-tech-accent/30">
                <project.icon className="w-5 h-5 text-dark" />
              </div>
            </div>

            {/* Action buttons */}
            <div className={`absolute top-16 right-4 flex gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
              {project.github && (
                <a href={project.github} className="w-10 h-10 bg-cream/90 rounded-full flex items-center justify-center hover:bg-cream transition-colors border border-tech-accent/30">
                  <Github className="w-5 h-5 text-dark" />
                </a>
              )}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-cream/90 rounded-full flex items-center justify-center hover:bg-cream transition-colors border border-tech-accent/30">
                  <ExternalLink className="w-5 h-5 text-dark" />
                </a>
              )}
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-xl sm:text-2xl text-cream mb-2">{project.title}</h3>
              <p className={`text-cream/70 text-sm leading-relaxed transition-all duration-300 ${
                isHovered ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'
              } overflow-hidden`}>
                {project.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 flex flex-wrap gap-2">
            {project.tags.map((tag, tIndex) => (
              <span key={tIndex} className="px-3 py-1 bg-wood/10 text-dark/70 text-xs font-mono rounded-full hover:bg-tech-accent/10 hover:text-tech-accent transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative corner */}
        <div className={`absolute -bottom-2 -right-2 w-20 h-20 border-r-2 border-b-2 border-tech-accent/30 rounded-br-2xl transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`} />
      </div>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from('.projects-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      cards.forEach((card, index) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.05,
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-offwhite py-20 lg:py-32"
    >
      {/* Marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="font-display text-[20vw] text-dark/[0.03] whitespace-nowrap select-none">
          PROYECTOS<span className="text-tech-accent">.</span>
        </h2>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-lime/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-tech-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="projects-title mb-16 text-center">
          <span className="font-mono text-sm text-wood-dark uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark mt-2 mb-4">
            PROYECTOS REALES<span className="text-tech-accent">.</span>
          </h2>
          <p className="text-lg text-dark/60 max-w-2xl mx-auto">
            Negocios que he escalado, herramientas que he construido y experimentos que me mantienen despierto por las noches.
          </p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {techStack.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-cream border border-wood/20 rounded-full text-xs font-mono text-dark/60 hover:border-tech-accent hover:text-tech-accent transition-colors">
              {tech}
            </span>
          ))}
        </div>

        {/* Projects grid - asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column */}
          <div className="left-column space-y-8 lg:space-y-12">
            {projects.filter((_, i) => i % 2 === 0).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                ref={(el) => { cardsRef.current[index * 2] = el; }}
                isHovered={hoveredProject === project.id}
                onHover={() => setHoveredProject(project.id)}
                onLeave={() => setHoveredProject(null)}
              />
            ))}
          </div>

          {/* Right column - offset */}
          <div className="right-column space-y-8 lg:space-y-12 lg:mt-24">
            {projects.filter((_, i) => i % 2 === 1).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                ref={(el) => { cardsRef.current[index * 2 + 1] = el; }}
                isHovered={hoveredProject === project.id}
                onHover={() => setHoveredProject(project.id)}
                onLeave={() => setHoveredProject(null)}
              />
            ))}
          </div>
        </div>

        {/* In development section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="font-display text-2xl text-dark mb-6 text-center">
            En desarrollo<span className="text-tech-accent">.</span>
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {webInDevelopment.map((web, index) => (
              <a
                key={index}
                href={web.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-dark/5 rounded-xl hover:bg-dark hover:text-cream transition-all duration-300 border border-transparent hover:border-tech-accent/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display text-sm">{web.title}</h4>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-tech-accent" />
                </div>
                <p className="text-xs text-dark/60 group-hover:text-cream/60">{web.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Buy Me A Coffee - sutil y gracioso */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="relative p-6 bg-gradient-to-r from-wood/10 via-cream to-lime/10 rounded-2xl border border-wood/20 overflow-hidden">
            {/* Decoración de café */}
            <div className="absolute -right-4 -top-4 text-6xl opacity-10">☕</div>
            <div className="absolute -left-2 -bottom-2 text-4xl opacity-10">🍕</div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 bg-tech-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Coffee className="w-7 h-7 text-tech-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-lg text-dark mb-1">
                  ¿Te está gustando lo que ves?
                </h4>
                <p className="text-sm text-dark/60">
                  Estos proyectos se mantienen con café, pizza y muchas horas de sueño perdido. 
                  Si quieres apoyar la causa (y mi consumo de cafeína), 
                  <a 
                    href="https://buymeacoffee.com/digitalsynapse" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-accent hover:underline font-medium ml-1"
                  >
                    aquí invitas al próximo ☕
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-dark text-cream rounded-full font-mono font-semibold hover:bg-tech-accent transition-colors"
          >
            Iniciar proyecto
          </button>
        </div>

        {/* Esto está vivo - mensaje final */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 bg-dark rounded-3xl overflow-hidden">
            {/* Decoración animada */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-tech-accent/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-tech-accent/20 rounded-full mb-6">
                <span className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
                <span className="text-xs font-mono text-tech-accent uppercase tracking-wider">Siempre en movimiento</span>
              </div>
              
              <h3 className="font-display text-3xl sm:text-4xl text-cream mb-4">
                Esto está vivo<span className="text-tech-accent">.</span>
              </h3>
              
              <p className="text-lg text-cream/70 leading-relaxed max-w-2xl mx-auto mb-6">
                Esta lista nunca está completa. Hay siempre algo cocinándose en algún rincón de mi cerebro. 
                Con las herramientas que tenemos hoy —IA, no-code, automatización— el único límite verdadero 
                es lo que uno se atreve a imaginar.
              </p>
              
              <p className="text-cream/50 italic">
                "Si puedes soñarlo, puedes construirlo. Y si no sabes cómo, seguro que encuentras a alguien 
                que sí o una IA que te enseña."
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {['Siempre aprendiendo', 'Siempre construyendo', 'Siempre curioso'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-cream/10 rounded-full text-sm font-mono text-cream/60 border border-cream/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
