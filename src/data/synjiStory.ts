export interface TrajectoryStage {
  id: string;
  phase: string;
  period: string;
  title: string;
  lead: string;
  body: string;
  evidenceTag: string;
  highlights: {
    label: string;
    detail: string;
    link?: string;
  }[];
}

export interface EcosystemProject {
  id: string;
  title: string;
  cluster: 'negocio' | 'edtech' | 'ia' | 'cultura';
  clusterLabel: string;
  role: string;
  statusTag: string;
  summary: string;
  problemSolved: string;
  deliverable: string;
  image: string;
  stack: string[];
  link?: string;
  github?: string;
}

export interface WorkMoment {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  deliverable: string;
  proof: string;
  features: string[];
}

export interface NewsletterIssue {
  number: string;
  date: string;
  title: string;
  summary: string;
  url: string;
}

export interface AcademicWork {
  year: string;
  title: string;
  venue: string;
  summary: string;
  url: string;
}

export type WebProjectStage = 'desplegado' | 'en-proceso' | 'en-desarrollo';

export interface MarketingWebProject {
  id: string;
  title: string;
  stage: WebProjectStage;
  stageLabel: string;
  category: string;
  role: string;
  summary: string;
  seoAndGrowthWork: string;
  deliverable: string;
  stack: string[];
  url?: string;
  domainLabel?: string;
}

export const heroData = {
  name: 'SYNJI D. MULATIERE',
  legalName: 'Synji de Paula Mulatiere',
  shortName: 'Synji D. Mulatiere',
  handle: '@splurtch',
  location: 'La Nucía · Alicante (Comunidad Valenciana)',
  newsletter: 'Ctrl + Alt + Pensar',
  thesis: 'El talento sin sistema es ruido caro.',
  lead: 'Soy neuropsicólogo de formación, llevo más de diez años en el barro de la docencia FPE y construyo sistemas de growth, procesos e IA supervisada para que los negocios escalen sin vivir apagando fuegos.',
  microClaims: [
    '01 Traducir lo confuso a observable',
    '02 Convertirlo en proceso o herramienta',
    '03 Auditar si ocurrió de verdad',
  ],
  stats: [
    {
      value: '+10 años',
      label: 'DOCENCIA Y FPE',
      detail: 'FOREM PV, LABORA/SEPE, Esatur, García Ibáñez, Cáritas',
    },
    {
      value: '19 repos',
      label: 'ECOSISTEMA @SPLURTCH',
      detail: 'Aula SSCE0110, SynapseFlow, Canary, EVOSER, BidOps',
    },
    {
      value: '498 impl.',
      label: 'DESIGN VAULT + MCP',
      detail: '21 herramientas MCP auditadas con Playwright + axe',
    },
    {
      value: '4 publ.',
      label: 'NEUROCIENCIA & BRCS',
      detail: 'Revista Nereis, Nova Science Publishers y P300',
    },
  ],
  contacts: {
    email: 'shinjimulatiere@gmail.com',
    phone: '+34 657 290 057',
    linkedin: 'https://www.linkedin.com/in/synji-de-paula-mulatiere',
    github: 'https://github.com/Splurtch',
    website: 'https://digitalsynapse.es/',
    coffee: 'https://buymeacoffee.com/digitalsynapse',
  },
};

export const heroProfile = heroData;

export const trajectoryStages: TrajectoryStage[] = [
  {
    id: 'neuro',
    phase: 'TRAMO 01 · MENTE Y CONDUCTA',
    period: '2011 — 2018',
    title: 'De la cirugía estereotáxica y el potencial P300 a entender cómo decidimos',
    lead: 'Entré en Psicología y Neurociencias por pura curiosidad sobre cómo funciona por dentro la conducta humana.',
    body: 'Estudié Psicología en la UCV y el Máster en Neurociencias en la Universitat de València, con estancia de investigación en la UJI trabajando sobre proyecciones hacia hipocampo y amígdala. Publiqué sobre resiliencia (escala BRCS en 530 universitarios) y correlatos neuronales de la memoria y el engaño, mientras trabajaba en viviendas tuteladas (Fundación Lukas) y salud mental.',
    evidenceTag: 'PUBLICADO · REVISTA NEREIS & NOVA SCIENCE',
    highlights: [
      {
        label: 'Análisis factorial confirmatorio BRCS (Nereis, 2017)',
        detail: 'Propiedades psicométricas de afrontamiento resiliente en 530 estudiantes universitarios.',
        link: 'https://revistas.ucv.es/nereis/index.php/Nereis/article/view/96',
      },
      {
        label: 'From False Memories to Deception (Nova Science, 2017)',
        detail: 'Revisión de correlatos neuronales en memoria y engaño en contextos judiciales.',
        link: 'https://novapublishers.com/shop/horizons-in-neuroscience-research-volume-33/',
      },
      {
        label: 'Fundación Lukas & Jornadas l’Alfàs del Pi',
        detail: 'Apoyo psicoeducativo en diversidad funcional severa y ponencia sobre relaciones sociales en dependencia.',
        link: 'https://www.lalfas.es/concejalias/fomento-y-desarrollo/lalfas-acoge-unas-jornadas-actualizacion-materia-atencion-personas-dependientes/',
      },
    ],
  },
  {
    id: 'barro',
    phase: 'TRAMO 02 · EL BARRO OPERATIVO Y COMERCIAL',
    period: '2007 — 2022',
    title: 'Hostelería, RRHH y cuatro años midiendo ventas reales en Telyco (Grupo Telefónica)',
    lead: 'Antes de diseñar arquitecturas de negocio pasé por la barra, los turnos de personal y los cuadros de mando comerciales.',
    body: 'Trabajé en restauración y atención al cliente, llevé administración de personal y turnos en Gran Sol Hotel (y me formé en Dirección de RRHH en la UNED), y pasé más de cuatro años como analista comercial y team coach en Telyco con SAP y Salesforce. Ahí aprendes rápido la diferencia entre un informe bonito y lo que pasa en el punto de venta un martes por la tarde.',
    evidenceTag: 'OPERACIONES · SAP / SALESFORCE / RRHH',
    highlights: [
      {
        label: 'Telyco · Grupo Telefónica (2018–2022)',
        detail: 'Seguimiento de KPIs, informes en SAP/Salesforce, soporte a equipos de venta e incidencias en tienda.',
      },
      {
        label: 'Dirección de RRHH (UNED) & Gran Sol Hotel',
        detail: 'Gestión de turnos, contratación, expedientes y coordinación laboral.',
      },
      {
        label: 'Voluntariado Banco de Alimentos de Alicante',
        detail: 'Campañas de recogida y coordinación sobre el terreno durante cinco años.',
      },
    ],
  },
  {
    id: 'fpe',
    phase: 'TRAMO 03 · DOCENCIA Y COORDINACIÓN FPE',
    period: '2015 — 2026',
    title: 'Más de diez años enseñando, coordinando programas y peleando contra la «mierdacracia»',
    lead: 'La Formación para el Empleo es donde confluyen las personas, la pedagogía y el papeleo que sostiene un expediente.',
    body: 'He impartido y coordinado acciones para FOREM PV, LABORA/SEPE, Cáritas, Grupo García Ibáñez, Esatur Formación, Folgado, Virensis o Cibervoluntarios: desde atención sociosanitaria y docencia (SSCE0110) hasta competencias digitales e IA (IFCT45/46). Viendo cómo nos íbamos media vida rellenando hojas de cálculo a mano, empecé a construir mis propias herramientas de aula y automatización.',
    evidenceTag: 'ACREDITADO · +10 AÑOS EN AULA Y GESTIÓN FPE',
    highlights: [
      {
        label: 'Esatur Formación · Grupo García Ibáñez · FOREM PV',
        detail: 'Docencia y coordinación académica en certificados de profesionalidad, IFCT45/46 y SSCE0110.',
        link: 'https://esatur.espacioaulavirtual.com/?lang=es',
      },
      {
        label: 'Inclusión digital y sociosanitaria (Cáritas, Cibervoluntarios, AFJA)',
        detail: 'Lectura fácil, adaptación al ritmo real del grupo y manual para cuidadores de la Marina Baixa.',
      },
      {
        label: 'De hoja de Excel con patas a construir software propio',
        detail: 'Creación del Aula de Práctica SSCE0110 (56 actividades), SynapseFlow y herramientas de seguimiento.',
        link: 'https://aula-practica.digitalsynapse.es/#/activities',
      },
    ],
  },
  {
    id: 'sistemas',
    phase: 'TRAMO 04 · ARQUITECTURA DE NEGOCIO, GROWTH E IA',
    period: '2022 — 2026',
    title: 'DigitalSynapse, Growth orgánico e IA donde alguien de verdad revisa qué ha hecho el agente',
    lead: 'Uní comportamiento humano, formación y tecnología para montar sistemas que funcionan sin depender de estar encima 24/7.',
    body: 'Cofundé DigitalSynapse (consultoría de formación/licitaciones, marketing digital y mejora de procesos), lideré estrategias de marketing y growth en Talent Bridge y Nexus Coaching Institute, completé el MBA & Máster en Marketing Digital, el Global MBA en IA & Data Science y el Máster de IA en BIG School, y entreno a equipos reales (como Destiny by Bergen y Asset Lighthouse) para trabajar con agentes sin tragarse sus alucinaciones.',
    evidenceTag: 'EN PRODUCCIÓN · DIGITALSYNAPSE & ECOSISTEMA IA',
    highlights: [
      {
        label: 'DigitalSynapse.es',
        detail: 'Consultoría de ejecución en licitaciones formativas, SEO técnico, procesos y herramientas a medida.',
        link: 'https://digitalsynapse.es/',
      },
      {
        label: 'Talent Bridge & Nexus Coaching Institute',
        detail: 'Dirección de marketing, embudos AARRR, SEO, CRM y experimentos de adquisición y activación.',
        link: 'https://talent-bridge.es/',
      },
      {
        label: 'Formación In-Company de IA & Agentes (Destiny / Asset Lighthouse)',
        detail: 'Tres mañanas con ejercicios reales, cuatro agentes y siete skills con revisión humana verificable.',
      },
    ],
  },
];

export const ecosystemProjects: EcosystemProject[] = [
  {
    id: 'digitalsynapse',
    title: 'DigitalSynapse & BidOps',
    cluster: 'negocio',
    clusterLabel: 'Negocio & Licitaciones',
    role: 'Cofundador & Consultor',
    statusTag: 'WEB PÚBLICA · METODOLOGÍA PROPIA',
    summary: 'Consultoría de gestión y ejecución para empresas de servicios y centros formativos: licitaciones públicas, FUNDAE 360, SEO técnico y mejora de procesos.',
    problemSolved: 'Muchos centros tienen buen equipo docente pero pierden convocatorias o margen por cuellos de botella documentales y falta de captación predecible.',
    deliverable: 'Radar de oportunidades (PLACE/BDNS), analizador de pliegos BidOps v2.1, memorias técnicas y arquitectura operativa.',
    image: `${import.meta.env.BASE_URL}synji-neon.webp`,
    stack: ['WordPress', 'SEO Técnico', 'BidOps', 'Claude API', 'FUNDAE'],
    link: 'https://digitalsynapse.es/',
  },
  {
    id: 'design-vault',
    title: 'DESIGN VAULT',
    cluster: 'ia',
    clusterLabel: 'Laboratorio UX/UI & MCP',
    role: 'Creador & Arquitecto',
    statusTag: '498 IMPLEMENTACIONES PROBADAS',
    summary: 'Laboratorio privado de investigación visual y biblioteca propia de componentes React, primitivas de motion (@dv/motion), 44 plantillas de página y servidor MCP.',
    problemSolved: 'Dejar de diseñar interfaces a ciegas o repetir plantillas genéricas de IA: cada patrón distingue entre dato MEDIDO, OBSERVADO e INFERIDO.',
    deliverable: 'Servidor MCP con 21 herramientas, base de datos SQLite auditable y 498 piezas verificadas con Playwright y axe.',
    image: `${import.meta.env.BASE_URL}synji-film.webp`,
    stack: ['React 19', 'TypeScript', 'Playwright', 'Axe a11y', 'MCP Server', 'SQLite'],
  },
  {
    id: 'aula-practica',
    title: 'Aula de Práctica SSCE0110 & SynapseFlow',
    cluster: 'edtech',
    clusterLabel: 'EdTech & Automatización FPE',
    role: 'Autor & Docente',
    statusTag: 'DESPLEGADO · 56 ACTIVIDADES',
    summary: 'Ecosistema para formación para el empleo: portal interactivo con 56 actividades distribuidas en 8 módulos y 46 unidades, más automatización documental para expedientes.',
    problemSolved: 'Pasar de hora y media de gestión manual por lote a 3 minutos, manteniendo siempre la revisión explícita del tutor antes de enviar nada.',
    deliverable: 'Portal web en producción, generador de documentación ODT/PDF/ZIP desde Excel y flujo de tutoría.',
    image: `${import.meta.env.BASE_URL}synji-cafe.webp`,
    stack: ['React', 'TypeScript', 'Python', 'Supabase', 'Hostinger'],
    link: 'https://aula-practica.digitalsynapse.es/#/activities',
    github: 'https://github.com/Splurtch',
  },
  {
    id: 'marketing-os',
    title: 'Marketing OS & Voz Synji',
    cluster: 'ia',
    clusterLabel: 'Sistemas de Agentes & Copy',
    role: 'Arquitecto de Sistema',
    statusTag: 'NÚCLEO CON 155 PRUEBAS',
    summary: 'Sistema multicliente para investigación SEO/GEO, estrategia, calendario, copy y auditoría editorial, donde cada marca mantiene sus fuentes y voz aisladas.',
    problemSolved: 'Evitar que los agentes mezclen contextos de clientes o publiquen textos con olor a plantilla corporativa sin que una persona responsable los valide.',
    deliverable: 'Repositorio con 155 tests automatizados, protocolo de eventos, fichas de revisión y la skill voz-synji v0.2.0.',
    image: `${import.meta.env.BASE_URL}synji-editorial.webp`,
    stack: ['Claude Code', 'MCP', 'SEO/GEO', 'Node.js', 'Testing'],
  },
  {
    id: 'canary-guardian',
    title: 'Canary · Guardian Call 360',
    cluster: 'ia',
    clusterLabel: 'Hackathon & IA Explicable',
    role: 'Co-creador (Psicología + IA)',
    statusTag: 'PROTOTIPO · GOOGLE ADK / GEMINI',
    summary: 'Sistema de detección de ingeniería social en llamadas y mensajes para proteger a personas mayores frente a estafas bancarias y suplantación.',
    problemSolved: 'Aplicar psicología de la coerción y señales de urgencia para alertar a tiempo con decisiones explicables y aviso al contacto de confianza.',
    deliverable: 'Prototipo funcional para All Things Agentic Hackathon con análisis de señales de riesgo en vivo.',
    image: `${import.meta.env.BASE_URL}synji-perfil.webp`,
    stack: ['Google ADK', 'Gemini', 'Psicología Cognitiva', 'Voice AI'],
    link: 'https://allthingsagentichackathon.devpost.com/',
  },
  {
    id: 'ape-s',
    title: 'APE-S · Cultura Geek, Gaming & Mente',
    cluster: 'cultura',
    clusterLabel: 'Medio Digital & Laboratorio',
    role: 'Equipo Fundador · Web & SEO',
    statusTag: 'WEB PÚBLICA · APE-S.COM',
    summary: 'Medio en español nacido de una etapa en Twitch sobre anime, manga, guías de videojuegos (con debilidad por el indie horror y los RPG), hardware y salud mental.',
    problemSolved: 'Hablar de cultura otaku, videojuegos y pantallas desde la experiencia real de jugador y padre, sin sermones ni notas de prensa.',
    deliverable: 'Portal WordPress con tema propio, arquitectura SEO, guiones y sistema de contenidos multicanal.',
    image: `${import.meta.env.BASE_URL}synji-playa.webp`,
    stack: ['WordPress', 'Technical SEO', 'Content Ops', 'Gaming & Anime'],
    link: 'https://ape-s.com/',
  },
  {
    id: 'evoser-trackedu',
    title: 'EVOSER, TrackEdu & MindScape Insight',
    cluster: 'edtech',
    clusterLabel: 'Herramientas Docentes',
    role: 'Desarrollador & Formador',
    statusTag: 'PILOTO & REPOSITORIOS PÚBLICOS',
    summary: 'Conjunto de aplicaciones educativas: seguimiento de evolución competencial y sociolaboral (EVOSER), utilidades de aula, gamificación HOTR0046 y tests educativos.',
    problemSolved: 'Hacer visible el progreso real de cada alumno en clase y dar herramientas prácticas para practicar en vez de memorizar diapositivas.',
    deliverable: 'MVPs interactivos, webquests de tutoría, teleprompter docente y juegos de seguridad alimentaria.',
    image: `${import.meta.env.BASE_URL}synji-calle.webp`,
    stack: ['React', 'TypeScript', 'Python', 'EdTech', 'Gamificación'],
    link: 'https://mindscape-insight-54.lovable.app',
    github: 'https://github.com/Splurtch?tab=repositories',
  },
];

export const workMoments: WorkMoment[] = [
  {
    id: 'observar',
    step: 'MOMENTO 01',
    title: 'Traducir un problema confuso a algo observable',
    subtitle: 'Diagnóstico · Conducta · Datos',
    description: 'Antes de tocar una herramienta o contratar un anuncio, miro qué está pasando de verdad: dónde se atasca la gente, qué datos faltan y qué parte del problema es humana y cuál de proceso.',
    deliverable: 'Auditoría de embudo, mapa de cuellos de botella o análisis de viabilidad de pliegos.',
    proof: 'Base en Psicología, Neurociencias y 4+ años de análisis comercial en Telyco.',
    features: ['Auditoría SEO/GEO y embudo AARRR', 'Diagnóstico operativo de centros FPE', 'Análisis de solvencia y pliegos (BidOps)', 'Investigación UX/UI medida (Design Vault)'],
  },
  {
    id: 'construir',
    step: 'MOMENTO 02',
    title: 'Convertirlo en una actividad, proceso o herramienta usable',
    subtitle: 'Arquitectura 30D™ · Formación · Automatización',
    description: 'Un sistema que nadie entiende es otro mueble caro. Diseño procesos, programas formativos y herramientas donde el equipo o el alumno sabe exactamente qué hacer después.',
    deliverable: 'Playbooks operativos, aulas prácticas, agentes con contexto de marca o flujos automatizados.',
    proof: '+10 años diseñando cursos FPE y entrenando a equipos no técnicos en IA aplicada.',
    features: ['Automatización documental y CRM', 'Formación In-Company de IA con casos reales', 'Diseño y coordinación integral FPE / FUNDAE', 'Desarrollo web y herramientas internas'],
  },
  {
    id: 'verificar',
    step: 'MOMENTO 03',
    title: 'Comprobar si lo que se prometió ocurrió realmente',
    subtitle: 'Supervisión humana · Trazabilidad · Cero humo',
    description: 'Delegar en la IA es fácil; vigilarla es otra historia. En mis sistemas los agentes preparan el terreno, pero las decisiones delicadas tienen huella verificable y responsable humano.',
    deliverable: 'Controles de calidad, pruebas automatizadas y protocolos de revisión editorial/operativa.',
    proof: 'Experimento real en aula: colarle datos falsos a un agente revisor para enseñar a auditarlo.',
    features: ['Auditoría de agentes y permisos de acceso', 'Revisión editorial anti-plantilla (Voz Synji)', 'Validación técnica E2E (Playwright + axe)', 'Justificación y cierre documental de expedientes'],
  },
];

export const newsletterIssues: NewsletterIssue[] = [
  {
    number: 'EDICIÓN 01',
    date: '13 oct. 2026',
    title: 'Antes de darle más permisos a tu agente de IA',
    summary: 'Qué superficie de acceso abrimos cuando conectamos correo, navegador y archivos sin mirar quién responde si algo sale mal.',
    url: 'https://es.linkedin.com/pulse/antes-de-darle-m%C3%A1s-permisos-tu-agente-ia-synji-d-mulatiere-ysjwe',
  },
  {
    number: 'EDICIÓN 02',
    date: '19 oct. 2026',
    title: 'Delegar en la IA es fácil. Vigilarla, ya veremos',
    summary: 'Navegación autónoma, benchmarks frente a tareas reales y por qué supervisar cuesta más atención de la que nos venden.',
    url: 'https://es.linkedin.com/pulse/delegar-en-la-ia-es-f%C3%A1cil-vigilarla-ya-veremos-synji-d-mulatiere-ky9le',
  },
  {
    number: 'EDICIÓN 03',
    date: '27 oct. 2026',
    title: '«Lo revisará una persona». Vale. ¿Cuál?',
    summary: 'Cuánto vale la etiqueta de revisión humana cuando nadie tiene tiempo, contexto ni evidencia concreta para contradecir a la máquina.',
    url: 'https://es.linkedin.com/pulse/lo-revisar%C3%A1-una-persona-vale-cu%C3%A1l-synji-d-mulatiere-el6je',
  },
  {
    number: 'EDICIÓN 04',
    date: '03 nov. 2026',
    title: '¿Y qué coño ha hecho el agente cuando me dice «hecho»?',
    summary: 'La diferencia entre producir, enviar y aceptar algo: qué pistas verificables necesitamos exigirle a cualquier sistema autónomo.',
    url: 'https://es.linkedin.com/pulse/y-qu%C3%A9-co%C3%B1o-ha-hecho-el-agente-cuando-me-dice-synji-d-mulatiere-x1eie',
  },
];

export const academicWorks: AcademicWork[] = [
  {
    year: '2017',
    title: 'Análisis factorial confirmatorio de la escala BRCS en jóvenes universitarios',
    venue: 'Revista Nereis (UCV) · n.º 9, pp. 89–92',
    summary: 'Estudio con 530 estudiantes universitarios sobre las propiedades psicométricas de la escala breve de afrontamiento resiliente.',
    url: 'https://revistas.ucv.es/nereis/index.php/Nereis/article/view/96',
  },
  {
    year: '2017',
    title: 'From False Memories to Deception: Revisiting the Use of Neural Correlates',
    venue: 'Horizons in Neuroscience Research (Nova Science Publishers) · Vol. 33, Cap. 7',
    summary: 'Revisión crítica sobre técnicas neurocientíficas, memoria falsa y detección del engaño en el ámbito forense y judicial.',
    url: 'https://novapublishers.com/shop/horizons-in-neuroscience-research-volume-33/',
  },
  {
    year: '2017',
    title: 'The Concept of Resilience: Assessment Tools and Underlying Variables',
    venue: 'Nova Science Publishers · Primer autor',
    summary: 'Capítulo de libro dedicado a las herramientas de evaluación y las variables neuropsicológicas subyacentes a la resiliencia.',
    url: 'https://www.researchgate.net/publication/324695101_The_Concept_of_Resilience_Assessment_Tools_and_Underlying_Variables',
  },
  {
    year: '2017',
    title: 'Differences Between Semantic and Episodic Memories Under Deception: An Analysis of Brainfingerprints',
    venue: 'European Neuroscience Conference for Doctoral Students (Benidorm)',
    summary: 'Comunicación científica sobre memoria episódica vs. semántica bajo simulación de engaño y análisis del potencial evocado P300.',
    url: 'https://www.researchgate.net/publication/317359088_DIFFERENCES_BETWEEN_SEMANTIC_AND_EPISODIC_MEMORIES_UNDER_DECEPTION_AN_ANALYSIS_OF_BRAINFINGERPRINTS',
  },
];

export const educationCredentials = [
  { period: '2025 – 2026', title: 'Global MBA en IA & Data Science', institution: 'ENEB (2.250 h · Nota 9,4/10)' },
  { period: '2025 – 2026', title: 'Máster de Inteligencia Artificial & Máster en SEO', institution: 'BIG School' },
  { period: '2024 – 2025', title: 'MBA & Máster en Marketing Digital y Analytics', institution: 'ENEB / Univ. Isabel I (72 ECTS)' },
  { period: '2024', title: 'SSCE0110 Habilitación para la Docencia (Grados A, B y C) + IFCD0110 Web', institution: 'FOREM PV & Aula MI2' },
  { period: '2018 – 2019', title: 'Experto Universitario en Dirección de RRHH en la Empresa', institution: 'UNED (20 ECTS)' },
  { period: '2015 – 2016', title: 'Máster Universitario en Neurociencias Básicas y Aplicadas', institution: 'Universitat de València (60 ECTS) + Estancia UJI' },
  { period: '2011 – 2015', title: 'Grado en Psicología', institution: 'Universidad Católica de Valencia (240 ECTS)' },
];

export const marketingSeoStack = [
  { group: 'SEO & GEO Técnico', items: ['Search Console', 'GA4', 'Semrush', 'Ahrefs', 'Screaming Frog', 'Rank Math', 'Schema.org'] },
  { group: 'Growth, CRM & Embudos', items: ['Funnels AARRR', 'Zoho CRM Plus', 'Salesforce / SAP', 'Mailchimp', 'CRO & Copywriting'] },
  { group: 'Web & Automatización', items: ['WordPress Custom Themes', 'React + TypeScript + Vite', 'Next.js', 'Hostinger / Vercel', 'Marketing OS (155 tests)'] },
];

export const marketingWebProjects: MarketingWebProject[] = [
  // 1. DESPLEGADOS Y EN PRODUCCIÓN
  {
    id: 'web-digitalsynapse',
    title: 'DigitalSynapse.es',
    stage: 'desplegado',
    stageLabel: 'DESPLEGADO · EN PRODUCCIÓN',
    category: 'Web Corporativa B2B · SEO & Embudo Diagnóstico',
    role: 'Cofundador · Arquitectura Web, Copy & SEO Técnico',
    summary: 'Portal y ecosistema de marca para consultoría de formación/licitaciones, marketing digital y mejora de procesos con identidad oscura propia y motor de partículas.',
    seoAndGrowthWork: 'Arquitectura de conversión por líneas de negocio, cuestionario de autodiagnóstico interactivo en 3 pasos, SEO técnico en WordPress y sección pública de oportunidades.',
    deliverable: 'Tema WordPress a medida, páginas de servicio, radar de licitaciones y analítica integrada.',
    stack: ['WordPress Custom Theme', 'SEO Técnico', 'CRO Diagnóstico', 'Rank Math', 'GA4'],
    url: 'https://digitalsynapse.es/',
    domainLabel: 'digitalsynapse.es',
  },
  {
    id: 'web-talent-bridge',
    title: 'Talent Bridge',
    stage: 'desplegado',
    stageLabel: 'DESPLEGADO · GROWTH ACTIVO',
    category: 'Dirección de Marketing · Captación & SEO',
    role: 'Head of Marketing & Growth Strategy',
    summary: 'Línea de crecimiento y posicionamiento para conectar talento y oportunidades profesionales con una propuesta de valor clara y medible.',
    seoAndGrowthWork: 'Diseño de estrategia de adquisición, arquitectura de mensajes y copy orientado a acción, optimización SEO on-page, contenidos y priorización de embudos CRM.',
    deliverable: 'Web pública optimizada, estrategia de captación multicanal y embudos AARRR operativos.',
    stack: ['Growth AARRR', 'SEO On-Page', 'Copywriting', 'CRM', 'Captación B2B/B2C'],
    url: 'https://talent-bridge.es/',
    domainLabel: 'talent-bridge.es',
  },
  {
    id: 'web-apes',
    title: 'APE-S · Cultura Geek, Gaming & IA',
    stage: 'desplegado',
    stageLabel: 'DESPLEGADO · MEDIO ACTIVO',
    category: 'Portal Editorial · SEO de Contenidos & Content Suite',
    role: 'Cofundador · Web, SEO Editorial & Operaciones',
    summary: 'Medio digital en español sobre anime/manga, videojuegos (indie horror y RPG), hardware, IA y salud mental nacido desde una etapa en Twitch.',
    seoAndGrowthWork: 'Estrategia de clústeres temáticos, optimización de títulos/miniaturas/intención de búsqueda, auditorías técnicas y sistema de prompts por capas para edición humana.',
    deliverable: 'Portal WordPress en producción, distribución en TikTok/X y suite editorial propia.',
    stack: ['WordPress', 'SEO Editorial', 'Screaming Frog', 'Content Ops', 'Analytics'],
    url: 'https://ape-s.com/',
    domainLabel: 'ape-s.com',
  },
  {
    id: 'web-nexus-aula',
    title: 'Nexus Coaching & Aula Práctica DS',
    stage: 'desplegado',
    stageLabel: 'DESPLEGADO · ECOSISTEMA ACTIVO',
    category: 'Estrategia de Marca, Embudos & Portal EdTech',
    role: 'Estratega de Marketing / Desarrollador Web',
    summary: 'Estrategia de posicionamiento, contenidos y CRM para Nexus en el sector coaching, junto al despliegue en producción del portal web Aula de Práctica SSCE0110.',
    seoAndGrowthWork: 'Definición de propuesta de valor diferenciada, estructura de captación y despliegue en Hostinger con subdominio corporativo, control de acceso y métricas reales.',
    deliverable: 'Estrategia comercial Nexus y portal web interactivo con 56 actividades desplegadas.',
    stack: ['Brand Strategy', 'React + Vite', 'Hostinger', 'Funnels & CRM', 'UX Operativa'],
    url: 'https://aula-practica.digitalsynapse.es/#/activities',
    domainLabel: 'aula-practica.digitalsynapse.es',
  },

  // 2. EN PROCESO Y PILOTO ACTIVO
  {
    id: 'web-destiny-elisa',
    title: 'Destiny by Bergen · Asset Lighthouse · ELISA',
    stage: 'en-proceso',
    stageLabel: 'EN PROCESO · PILOTO & AUDITORÍA',
    category: 'Web Inmobiliaria · SEO & Ecosistema Zoho CRM Plus',
    role: 'Consultor de Marketing, SEO, Procesos & Formador IA',
    summary: 'Intervención integral en sector inmobiliario de inversión: activos web (`destiny-web`), auditoría del recorrido de cada consulta comercial y formación de IA.',
    seoAndGrowthWork: 'Investigación de palabras clave SEO (noviembre 2026), revisión de documentación comercial, análisis de migración a Zoho CRM Plus y caso piloto supervisado de Marketing OS.',
    deliverable: 'Repositorio `destiny-web`, estudio de arquitectura CRM, keyword research y 4 agentes a medida.',
    stack: ['Keyword Research SEO', 'Lead Journey', 'Zoho CRM Plus', 'Web Inmobiliaria', 'Marketing OS Pilot'],
    domainLabel: 'destiny-web / ELISA',
  },
  {
    id: 'web-bds',
    title: 'BDS · Proyecto Web & Estrategia SEO',
    stage: 'en-proceso',
    stageLabel: 'EN PROCESO · ARQUITECTURA & SEO',
    category: 'Desarrollo Web · Posicionamiento & Captación',
    role: 'Arquitecto Web & Estratega de Marketing Digital',
    summary: 'Desarrollo de estructura web, narrativa de servicios y estrategia de posicionamiento orgánico dentro del laboratorio de proyectos de marketing (`MARKETING PROJECT/BDS`).',
    seoAndGrowthWork: 'Mapeo de intención de búsqueda, estructura de páginas orientada a conversión, definición de identidad visual y preparación de contenidos optimizados.',
    deliverable: 'Arquitectura web en curso, guía de posicionamiento y activos de conversión.',
    stack: ['Arquitectura Web', 'SEO Técnico & Local', 'Copywriting', 'CRO', 'Content Strategy'],
    domainLabel: 'Proyecto BDS',
  },
  {
    id: 'web-matricula-vida',
    title: 'Matrícula de Vida & Webs de Especialistas',
    stage: 'en-proceso',
    stageLabel: 'EN PROCESO · DISEÑO & ASISTENTE',
    category: 'Diseño Web · Copywriting & Asistente Especializado',
    role: 'Diseñador Web, Copywriter & Arquitecto de Asistente',
    summary: 'Trabajo de diseño web, arquitectura de contenidos y propuesta de asistente especializado para Matrícula de Vida, más webs para formación de inglés profesional y nichos.',
    seoAndGrowthWork: 'Clarificación de oferta y recorrido de usuario, redacción sin plantillas corporativas e integración de puntos de contacto asistidos.',
    deliverable: 'Estructura web, textos de marca y especificación funcional de asistente.',
    stack: ['Diseño Web', 'Copywriting Humano', 'Asistente IA', 'SEO Nicho', 'UX'],
    domainLabel: 'matriculadevida',
  },
  {
    id: 'web-apes-v7',
    title: 'APE-S Theme v7.0.1 (Staging Release)',
    stage: 'en-proceso',
    stageLabel: 'EN PROCESO · VALIDADO EN STAGING',
    category: 'Rediseño Web · Core Web Vitals & SEO Semántico',
    role: 'Lead Frontend & Technical SEO',
    summary: 'Evolución completa del tema de APE-S a la versión 7.0.1 probada en entorno staging antes de su promoción a producción.',
    seoAndGrowthWork: 'Optimización de velocidad de carga (LCP/CLS), jerarquía semántica de encabezados, plantillas de lectura limpia y marcado estructurado.',
    deliverable: 'Tema WordPress v7.0.1 validado en staging con auditoría visual y técnica.',
    stack: ['WordPress Theme v7.0.1', 'Core Web Vitals', 'Schema.org', 'Staging QA'],
    url: 'https://ape-s.com/',
    domainLabel: 'staging · ape-s.com',
  },

  // 3. EN DESARROLLO Y LABORATORIO SEO / GEO
  {
    id: 'dev-marketing-os',
    title: 'Marketing OS Multicliente & Suite SEO/GEO',
    stage: 'en-desarrollo',
    stageLabel: 'EN DESARROLLO · 155 TESTS EN LAB',
    category: 'Sistema Operativo de Marketing · SEO/GEO & Voz de Marca',
    role: 'Creador & Arquitecto de Sistema',
    summary: 'Núcleo local para gestionar investigación SEO/GEO, estrategia, calendario, copy y recursos visuales de múltiples clientes sin mezclar nunca sus fuentes ni su tono.',
    seoAndGrowthWork: 'Automatización de briefings SEO y GEO (visibilidad en buscadores e IA generativa), protocolo de eventos y ficha de revisión humana obligatoria antes de publicar.',
    deliverable: 'Repositorio local con 155 pruebas superadas, aislamiento por cliente y motor de auditoría.',
    stack: ['SEO + GEO', '155 Pruebas Automatizadas', 'Claude / MCP', 'Aislamiento Multicliente', 'Voz Synji'],
    domainLabel: 'Lab · Marketing OS',
  },
  {
    id: 'dev-neuroaudita',
    title: 'NeuroAudita (La Nucía / Benidorm)',
    stage: 'en-desarrollo',
    stageLabel: 'EN DESARROLLO · VIABILIDAD & WEB',
    category: 'Proyecto Web Local · Psicología Aplicada & Auditoría',
    role: 'Fundador · Estrategia de Negocio & SEO Local',
    summary: 'Iniciativa de consulta de psicología/neuropsicología y línea de intervención con talleres y auditoría conductual en la Marina Baixa.',
    seoAndGrowthWork: 'Estudio de viabilidad en La Nucía y Benidorm, análisis competitivo local (benchmarking sectorial), diseño de cartera de servicios y arquitectura web local.',
    deliverable: 'Dossier estratégico de viabilidad, matriz de servicios y prototipo de presencia digital.',
    stack: ['SEO Local (Marina Baixa)', 'Benchmarking', 'Diseño de Servicios', 'Neuropsicología Aplicada'],
    domainLabel: 'Lab · NeuroAudita',
  },
  {
    id: 'dev-tpv-saas',
    title: 'DigitalSynapse SaaS FPE & TPV Restaurante Demo',
    stage: 'en-desarrollo',
    stageLabel: 'EN DESARROLLO · PROTOTIPOS REACT',
    category: 'Web Apps Verticales · SaaS B2B & Hostelería',
    role: 'Product Builder & Full-Stack Prototyping',
    summary: 'Dos aplicaciones web verticales en desarrollo: plataforma SaaS para centros formativos FPE/FUNDAE (con herramientas de captación y control) y demo funcional de TPV para restauración.',
    seoAndGrowthWork: 'Diseño orientado a resolver fricciones operativas reales detectadas en aula y en hostelería, con arquitectura moderna en React, TypeScript, Vite y Supabase.',
    deliverable: 'Repositorio `tpv-restaurante-demo` y hoja de ruta + prototipo de DigitalSynapse SaaS.',
    stack: ['React 19', 'TypeScript', 'Vite', 'Supabase', 'SaaS B2B'],
    url: 'https://github.com/Splurtch?tab=repositories',
    domainLabel: 'Lab · SaaS & TPV Web',
  },
  {
    id: 'dev-linkedin-os',
    title: 'LinkedIn OS & Motores Editoriales (Gary-Ops / Patel)',
    stage: 'en-desarrollo',
    stageLabel: 'EN DESARROLLO · MOTOR ORGÁNICO',
    category: 'Growth Orgánico · Reutilización Multicanal & Embudos',
    role: 'Estratega de Growth & Autor de Ctrl + Alt + Pensar',
    summary: 'Sistema propio para transformar una investigación semanal en piezas nativas para LinkedIn, Substack, web, email y vídeo/audio sin perder voz propia.',
    seoAndGrowthWork: 'Aplicación práctica de marcos de distribución (GaryVee, Neil Patel, Alex Hormozi) adaptados al mercado español con rutinas de 30 minutos y trazabilidad de fuentes.',
    deliverable: 'Flujo editorial multicanal, plantillas de carruseles y 4 ediciones publicadas en LinkedIn.',
    stack: ['Growth Orgánico', 'Content Repurposing', 'LinkedIn B2B', 'Substack', 'Autoridad de Marca'],
    url: 'https://es.linkedin.com/in/synji-d-mulatiere',
    domainLabel: 'LinkedIn & Substack',
  },
];
