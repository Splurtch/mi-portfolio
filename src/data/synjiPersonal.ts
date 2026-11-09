/**
 * Módulo extensible: "Quién es Synji fuera del curro" + Voz personal (006_REFERENCIAS_SYNJI).
 * Diseñado para ampliarse fácilmente conforme se añadan nuevas carpetas o anécdotas.
 */

export interface PersonalFacet {
  id: string;
  title: string;
  tag: string;
  confession: string;
  details: string[];
  favorites: string[];
}

export interface PlaylistFrequency {
  id: string;
  bandOrGenre: string;
  vibe: string;
  blocked?: boolean;
}

export interface SynjiNote {
  id: string;
  kicker: string;
  title: string;
  excerpt: string;
  takeaway: string;
}

export const personalFacets: PersonalFacet[] = [
  {
    id: 'otaku-isekai',
    title: 'Devorador de Manga, Anime y Cultura Asiática',
    tag: 'MODO OTAKU · ISEKAI & SHONEN',
    confession: 'Siempre he sentido pasión por la cultura asiática y me encanta dibujar. Ahora mismo estoy metidísimo en los isekai, aunque sigo al día los grandes mangas y animes de toda la vida.',
    details: [
      'Capaz de analizar por qué un personaje toma una decisión absurda y usarlo para explicar psicología humana sin despeinarme.',
      'Me gusta dibujar por puro placer creativo y fijarme en el diseño de mundos, sistemas de magia y narrativa visual.',
    ],
    favorites: [
      'Re:Zero',
      'Mushoku Tensei',
      'Tensura (Slime)',
      'The Rising of the Shield Hero',
      'KonoSuba',
      'Jujutsu Kaisen',
      'One Piece',
      'Sakamoto Days',
      'Kimetsu no Yaiba',
      'Bleach',
      'Dragon Ball',
      'Ranma ½',
      'Spy × Family',
    ],
  },
  {
    id: 'rpg-squareenix',
    title: 'RPGs, MMORPGs y la escuela Square Enix',
    tag: 'GAMER · DE SUPER NES A PS5 & PC',
    confession: 'Me flipan los videojuegos desde la Super NES, pero donde me pierdo de verdad es en un buen RPG o MMORPG con historia densa, exploración y sistemas profundos.',
    details: [
      'Amante incondicional de Square Enix: Final Fantasy y Kingdom Hearts forman parte de mi ADN.',
      'También tengo debilidad editorial en APE-S por los juegos indie de terror psicológico y por destripar cada rincón de un mapa abierto.',
    ],
    favorites: [
      'Final Fantasy (Square Enix)',
      'Kingdom Hearts',
      'RPGs de mundo abierto',
      'MMORPGs',
      'Indie Horror Psicológico',
      'Star Wars / Tolkien / Fantasía',
    ],
  },
  {
    id: 'curiosidad-audiolibros',
    title: 'Curiosidad Crónica y Audiolibros en el Coche',
    tag: 'APRENDIZAJE CONTINUO · SIN FILTRO',
    confession: 'Hola, me llamo Synji y sí, soy consumidor… de audiolibros. Me escucho uno y luego salto a otro, y a otro, y a otro, sin descanso. Cada trayecto en coche es mi chute.',
    details: [
      'Si un libro me obliga a mirarme en el espejo mientras pone a caldo nuestras excusas (como «Te estás jodiendo la vida», de Buenaventura del Charco Olea), tiene mi 9/10.',
      'Lo mismo me da por investigar de dónde sale la cola de pez de Capricornio en Mesopotamia que por destripar un paper de neurociencia o montar un servidor en Linux.',
    ],
    favorites: [
      'Psicología sin postureo',
      'Mitología y lore antiguo',
      'Neurociencia de la conducta',
      'Dibujo y diseño visual',
      'Wing Tsun & Capoeira',
    ],
  },
  {
    id: 'gatos-casa',
    title: 'Gatos, Animales y Vida Real',
    tag: 'CASA LLENA · CONCILIACIÓN REAL',
    confession: 'Soy un amante absoluto de los gatos (convivo con ellos a diario) y me gustan todos los animales. Toda la automatización que construyo tiene un objetivo muy simple: ganar tiempo de calidad con mi familia.',
    details: [
      'Entre mi mujer, mis hijos, los gatos y el perro, mi casa es el mejor detector de humo del mundo: ahí ningún prompt te salva de la vida real.',
      'Por eso me importa tanto cómo introducimos las pantallas y la IA, y quién asume la responsabilidad cuando delegamos en la tecnología.',
    ],
    favorites: [
      'Gatos al mando de la casa',
      'Todos los animales',
      'Tiempo en familia',
      'Hacer masa de pizza y pan bao casero',
    ],
  },
];

export const soundtrackFrequencies: PlaylistFrequency[] = [
  { id: 'extremo', bandOrGenre: 'Extremoduro / Robe', vibe: 'Rock transgresivo y poesía cruda con la que he crecido' },
  { id: 'platero', bandOrGenre: 'Platero y Tú', vibe: 'Rock & roll de barra, directo y sin artificios' },
  { id: 'linkin', bandOrGenre: 'Linkin Park', vibe: 'Himnos de adolescencia y descarga de energía pura' },
  { id: 'limp-papa', bandOrGenre: 'Limp Bizkit · Papa Roach', vibe: 'Nu Metal a todo volumen para programar o conducir' },
  { id: 'punk-rock', bandOrGenre: 'Blink-182 · Sum 41', vibe: 'Pop-punk / skate punk para subir las revoluciones' },
  { id: 'heavy-alt', bandOrGenre: 'Korn · Slipknot · Deftones · RATM', vibe: 'Riffs pesados, atmósferas densas y actitud' },
  { id: 'post-tech', bandOrGenre: 'Post-Rock · Indie · Hardtekk · 60s/70s', vibe: 'Para entrar en foco profundo cuando hay que construir' },
  { id: 'electrolatino', bandOrGenre: 'Electrolatino', vibe: 'ERROR 403: Frecuencia no compatible con este cerebro', blocked: true },
];

export const synjiVoiceSamples: SynjiNote[] = [
  {
    id: 'capricornio',
    kicker: 'CURIOSIDAD QUE SALE DE UN DETALLE',
    title: '¿Os habéis fijado en que Capricornio tiene cola de pez?',
    excerpt: '«Toda la vida pensando que era una cabra y resulta que el bicho es mitad cabra, mitad pescado. ¿Pero esto qué coño es? Y ojo, que el invento viene de Mesopotamia con el Suhurmashu de Enki… Luego llegaron los griegos, Pan se tiró al Nilo huyendo de Tifón y Zeus decidió inmortalizar la parida con su propio rincón entre las estrellas.»',
    takeaway: 'Así funciona mi cabeza: veo un detalle raro, tiro del hilo hasta el origen y lo cuento sin ponerme estupendo.',
  },
  {
    id: 'amodei',
    kicker: 'SOBRE FORMAR EN IA SIN HUMO',
    title: 'Cuatro prompts mal puestos y ya nos creemos Amodei',
    excerpt: '«Para usar la IA solo para hacer consultas ya tenemos a nuestro san Google. En los cursos que doy montamos un revisor de marca al que le cuelo a propósito un texto lleno de cagadas y un dato que me he inventado, a ver si el equipo se lo traga o sabe auditarlo delante de todos.»',
    takeaway: 'No prometo que la IA no falle nunca; enseño a detectar cuándo te la está colando.',
  },
  {
    id: 'mierdacracia',
    kicker: 'POR QUÉ AUTOMATIZO PROCESOS',
    title: 'Dejar de ser una hoja de Excel con patas',
    excerpt: '«Pasar de hora y media de mierdacracia administrativa a tres minutos de reloj. La IA prepara el borrador, pero no toca las cuentas ni envía un solo mensaje sin que el tutor lo revise y pulse el botón. El que diga que prefiere seguir haciéndolo a mano, que siga.»',
    takeaway: 'Automatizar sirve para quitar trabajo mecánico, nunca para borrar al responsable humano.',
  },
];

export const playlistFrequencies = soundtrackFrequencies;
export const synjiVoiceNotes = synjiVoiceSamples;

