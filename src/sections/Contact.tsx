import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Linkedin, Mail, Calendar, Phone, Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const form = formRef.current;

    if (!section || !heading || !form) return;

    const ctx = gsap.context(() => {
      gsap.from(section, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(heading, {
        strokeDashoffset: '100%',
        duration: 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(form, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactMethods = [
    { icon: Mail, label: 'Email', value: 'shinjimulatiere@gmail.com', href: 'mailto:shinjimulatiere@gmail.com' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Synji Mulatiere', href: 'https://linkedin.com/in/synji-d-mulatiere' },
    { icon: Phone, label: 'Teléfono', value: '+34 671 706 589', href: 'tel:+34671706589' },
    { icon: Calendar, label: 'Agenda', value: 'Reservar llamada', href: '#' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-dark overflow-hidden"
    >
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 246, 209, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 246, 209, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2
          ref={headingRef}
          className="font-display text-[15vw] text-cream/[0.03] whitespace-nowrap select-none"
          style={{ WebkitTextStroke: '1px rgba(251, 246, 209, 0.05)' }}
        >
          HABLEMOS
        </h2>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 w-full max-w-6xl mx-auto">
          
          {/* Left: Contact info */}
          <div className="space-y-8">
            <div>
              <span className="font-mono text-sm text-tech-accent uppercase tracking-widest">
                Contacto
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream mt-2 mb-4">
                HABLEMOS<span className="text-tech-accent">.</span>
              </h2>
              <p className="text-lg text-cream/60 leading-relaxed">
                La auditoría inicial es gratuita. Sin compromiso. 
                Solo una conversación honesta sobre dónde estás y hacia dónde quieres ir.
              </p>
            </div>

            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-cream/5 hover:bg-cream/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-tech-accent/20 rounded-lg flex items-center justify-center group-hover:bg-tech-accent/30 transition-colors">
                    <method.icon className="w-5 h-5 text-tech-accent" />
                  </div>
                  <div>
                    <span className="block text-xs text-cream/40 font-mono uppercase">{method.label}</span>
                    <span className="text-cream group-hover:text-tech-accent transition-colors">{method.value}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-cream/20 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>

            <div className="p-6 bg-cream/5 rounded-2xl">
              <h4 className="font-mono text-sm text-cream/40 uppercase tracking-wider mb-4">
                Lo que obtienes
              </h4>
              <ul className="space-y-3">
                {[
                  'Auditoría gratuita 30 min',
                  'Diagnóstico sin compromiso',
                  'Propuesta personalizada',
                  'Soporte continuo',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-cream/70">
                    <Check className="w-5 h-5 text-tech-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative p-8 bg-cream/5 backdrop-blur-sm rounded-2xl border border-cream/10"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-tech-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-tech-accent" />
                  </div>
                  <h3 className="font-display text-2xl text-cream mb-2">¡Mensaje enviado!</h3>
                  <p className="text-cream/60">Te contacto en menos de 24h.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl text-cream mb-6">Envíame un mensaje</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs text-cream/40 font-mono uppercase mb-2">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-cream/5 border border-cream/10 rounded-xl text-cream placeholder-cream/30 focus:outline-none focus:border-tech-accent transition-colors"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-cream/40 font-mono uppercase mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-cream/5 border border-cream/10 rounded-xl text-cream placeholder-cream/30 focus:outline-none focus:border-tech-accent transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-cream/40 font-mono uppercase mb-2">Empresa (opcional)</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-cream/5 border border-cream/10 rounded-xl text-cream placeholder-cream/30 focus:outline-none focus:border-tech-accent transition-colors"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-cream/40 font-mono uppercase mb-2">Mensaje</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-cream/5 border border-cream/10 rounded-xl text-cream placeholder-cream/30 focus:outline-none focus:border-tech-accent transition-colors resize-none"
                        placeholder="Cuéntame sobre tu proyecto..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-tech-accent text-dark font-mono font-semibold rounded-xl hover:bg-cream transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Enviando...</span>
                      ) : (
                        <>
                          Enviar mensaje
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-tech-accent/30 rounded-tr-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-tech-accent/30 rounded-bl-2xl" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-cream/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream/40 text-sm font-mono">© 2025 Synji D. Mulatiere. Todos los derechos reservados.</p>
            <p className="text-cream/40 text-sm">Growth Orgánico Estratégico</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
