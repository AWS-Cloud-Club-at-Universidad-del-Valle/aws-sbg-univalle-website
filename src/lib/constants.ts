import type {
  ISiteConfig,
  INavLink,
  IStat,
  IEvent,
  IMember,
  IPartner,
  IResource,
  IBenefit,
  ISocialLink,
  ICoreTeamMember,
  IParticipationWay,
  IModalityOption,
  ITalkLevel,
} from '@/types/index';

// ============================================
// Configuración global del sitio
// ============================================

/**
 * Configuración del CDN de assets (CloudFront → bucket S3 privado, vía OAC).
 *
 * El dominio y las rutas cambian por entorno y se inyectan en build mediante
 * variables PUBLIC_* (igual que PUBLIC_EVENTS_API_URL). El workflow de deploy
 * define los valores según la rama:
 *   - main    → distribución/bucket de producción
 *   - develop → distribución/bucket de desarrollo
 *
 * El fallback por defecto apunta a PRODUCCIÓN, para que un build sin variables
 * configuradas (p. ej. en main) sirva desde el entorno correcto.
 *
 * Prod:  https://d2zjot7yvduv1u.cloudfront.net  · members/ · prod-assets/prod-logos/
 * Dev:   https://d23d5d88jw9p2.cloudfront.net   · dev-members/photos-members/ · dev-assets/dev-logos/
 */
export const ASSETS_CDN_URL: string =
  import.meta.env.PUBLIC_ASSETS_CDN_URL ?? 'https://d2zjot7yvduv1u.cloudfront.net';

/** Prefijo (key) de las fotos del Core Team dentro del bucket. */
export const ASSETS_MEMBERS_PATH: string =
  import.meta.env.PUBLIC_ASSETS_MEMBERS_PATH ?? 'prod-members/prod-members-photos';

/** Prefijo (key) de los logos dentro del bucket. */
export const ASSETS_LOGOS_PATH: string =
  import.meta.env.PUBLIC_ASSETS_LOGOS_PATH ?? 'prod-assets/prod-logos';

/**
 * Logo oficial del SBG en CloudFront (mismo archivo que el favicon).
 * Debe ser URL absoluta: no hay assets locales en public/images/.
 */
export const SBG_LOGO_URL = `${ASSETS_CDN_URL}/${ASSETS_LOGOS_PATH}/aws_sbg_univalle.png`;

/**
 * Base para construir la URL de un perfil público en AWS Builder Center.
 * La URL final es `${BUILDER_CENTER_PROFILE_BASE}${username}`.
 * Si el formato de perfil cambia, se ajusta aquí en un solo lugar.
 */
export const BUILDER_CENTER_PROFILE_BASE = 'https://builder.aws.com/community/@';

export const SITE_CONFIG: ISiteConfig = {
  name: 'AWS Student Builder Group Universidad del Valle',
  shortName: 'AWS SBG Univalle',
  /** Debe coincidir con `site` en astro.config.mjs y con el Sitemap de robots.txt. */
  url: 'https://awsunivalle.dev',
  description:
    'Comunidad estudiantil de tecnología cloud AWS en la Universidad del Valle, Colombia. Aprende, construye y conecta con los mejores builders.',
  logo: SBG_LOGO_URL,
  ogImage: SBG_LOGO_URL,
  social: {
    instagram: 'https://www.instagram.com/awsbuildergroup.univalle/',
    linkedin: 'https://www.linkedin.com/company/aws-studentbuildergroupunivalle/',
    github: 'https://github.com/AWS-Cloud-Club-at-Universidad-del-Valle',
    whatsapp: 'https://whatsapp.com/channel/0029VbBm0RJKgsNn6Ze7bU19',
    youtube: 'https://www.youtube.com/@awscloudunivalle',
    email: 'mailto:aws.cloud.club@correounivalle.edu.co',
  },
};

// ============================================
// Links de navegación
// ============================================

export const NAV_LINKS: INavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Nosotros' },
  { href: '/certificate', label: 'Certifícate' },
  { href: '/student-rewards', label: 'Rewards' },
  { href: '/events', label: 'Eventos' },
  { href: '/resources', label: 'Recursos' },
  { href: '/participate', label: 'Participa' },
  { href: '/contact', label: 'Contacto' },
];

// ============================================
// Estadísticas del grupo
// ============================================

export const STATS: IStat[] = [
  { value: 922, suffix: '', label: 'Miembros activos', icon: 'users' },
  { value: 27, suffix: '', label: 'Eventos realizados', icon: 'calendar' },
  { value: 15, suffix: '+', label: 'Proyectos en la nube', icon: 'cloud' },
  { value: 8, suffix: '', label: 'Semestres de historia', icon: 'award' },
];

// ============================================
// Próximos eventos (placeholder realista)
// ============================================

export const UPCOMING_EVENTS: IEvent[] = [
  {
    title: 'Workshop: AWS Lambda y Serverless',
    date: new Date('2026-08-20T10:00:00'),
    endDate: new Date('2026-08-20T13:00:00'),
    location: 'Edificio E, Sala 401 — Universidad del Valle',
    type: 'workshop',
    description:
      'Aprende a construir funciones serverless con AWS Lambda, API Gateway y DynamoDB. Sesión práctica con ejemplos reales del mundo académico.',
    registrationUrl: 'https://forms.gle/ejemplo-lambda',
    tags: ['serverless', 'lambda', 'aws', 'backend'],
    isFeatured: true,
  },
  {
    title: 'Hackathon Cloud Challenge 2026',
    date: new Date('2026-09-05T08:00:00'),
    endDate: new Date('2026-09-06T18:00:00'),
    location: 'Auditorio Principal — Universidad del Valle',
    type: 'hackathon',
    description:
      '48 horas para construir soluciones reales usando servicios AWS. Equipos de 3–5 personas. Premios para los mejores proyectos.',
    registrationUrl: 'https://forms.gle/ejemplo-hackathon',
    tags: ['hackathon', 'aws', 'cloud', 'competencia'],
    isFeatured: true,
  },
  {
    title: 'Charla: Preparación para AWS Cloud Practitioner',
    date: new Date('2026-09-15T16:00:00'),
    location: 'Sala Virtual — Google Meet',
    type: 'charla',
    description:
      'Sesión de orientación para prepararte para la certificación AWS Cloud Practitioner. Tips, recursos y experiencias de miembros certificados.',
    tags: ['certificacion', 'aws', 'cloud-practitioner', 'carrera'],
  },
];

// ============================================
// Equipo directivo (placeholder)
// ============================================

export const DIRECTIVE_MEMBERS: IMember[] = [
  {
    name: 'Valentina Rodríguez',
    role: 'Presidenta',
    bio: 'Estudiante de Ingeniería de Sistemas, AWS Cloud Practitioner certificada y apasionada por arquitecturas serverless.',
    linkedin: 'https://linkedin.com/in/ejemplo-valentina',
    github: 'https://github.com/ejemplo-valentina',
    isDirective: true,
  },
  {
    name: 'Carlos Andrade',
    role: 'Vicepresidente Técnico',
    bio: 'Desarrollador backend especializado en microservicios con AWS ECS y Kubernetes. AWS Developer Associate.',
    linkedin: 'https://linkedin.com/in/ejemplo-carlos',
    github: 'https://github.com/ejemplo-carlos',
    isDirective: true,
  },
  {
    name: 'María José Salcedo',
    role: 'Coordinadora de Eventos',
    bio: 'Organizadora de workshops y hackathons del grupo. Estudiante de Ingeniería Industrial con enfoque en tecnología.',
    linkedin: 'https://linkedin.com/in/ejemplo-mariajose',
    isDirective: true,
  },
  {
    name: 'Andrés Felipe Torres',
    role: 'Coordinador de Contenido',
    bio: 'Encargado de los recursos educativos y blog técnico. AWS Solutions Architect Associate en proceso.',
    linkedin: 'https://linkedin.com/in/ejemplo-andres',
    github: 'https://github.com/ejemplo-andres',
    isDirective: true,
  },
  {
    name: 'Laura Quintero',
    role: 'Coordinadora de Comunidad',
    bio: 'Gestiona redes sociales y la comunidad. Conecta miembros con oportunidades de trabajo, becas e internships.',
    linkedin: 'https://linkedin.com/in/ejemplo-laura',
    isDirective: true,
  },
];

// ============================================
// Partners y sponsors
// ============================================

export const PARTNERS: IPartner[] = [
  {
    name: 'Amazon Web Services',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    logoAlt: 'Logo de Amazon Web Services',
    url: 'https://aws.amazon.com',
    tier: 'gold',
  },
  {
    name: 'Universidad del Valle',
    logoUrl: '/images/logo-univalle.png',
    logoAlt: 'Logo de la Universidad del Valle',
    url: 'https://www.univalle.edu.co',
    tier: 'gold',
  },
  {
    name: 'AWS Educate',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    logoAlt: 'Logo de AWS Educate',
    url: 'https://aws.amazon.com/education/awseducate/',
    tier: 'silver',
  },
];

// ============================================
// Recursos educativos destacados
// ============================================

export const FEATURED_RESOURCES: IResource[] = [
  {
    title: 'AWS Cloud Practitioner Essentials',
    description:
      'Curso oficial de AWS para obtener las bases del cloud computing y prepararte para la certificación CCP.',
    url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
    category: 'curso',
    icon: 'graduation-cap',
    isExternal: true,
  },
  {
    title: 'Documentación Oficial de AWS',
    description:
      'Accede a la documentación técnica completa de todos los servicios de Amazon Web Services.',
    url: 'https://docs.aws.amazon.com/',
    category: 'documentacion',
    icon: 'book-open',
    isExternal: true,
  },
  {
    title: 'AWS Free Tier',
    description:
      'Experimenta con más de 100 servicios AWS de forma gratuita. Ideal para practicar sin costo.',
    url: 'https://aws.amazon.com/free/',
    category: 'herramienta',
    icon: 'gift',
    isExternal: true,
  },
  {
    title: 'AWS Solutions Architect Associate',
    description:
      'Guía completa para prepararte para la certificación SAA-C03. Uno de los títulos más valorados del mercado.',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    category: 'certificacion',
    icon: 'award',
    isExternal: true,
  },
  {
    title: 'AWS re:Post — Comunidad',
    description:
      'Plataforma de preguntas y respuestas de AWS. Resuelve dudas técnicas con expertos de la comunidad.',
    url: 'https://repost.aws/',
    category: 'comunidad',
    icon: 'message-circle',
    isExternal: true,
  },
  {
    title: 'AWS Skill Builder',
    description:
      'Plataforma de aprendizaje online con cursos, labs y rutas personalizadas para todos los niveles.',
    url: 'https://skillbuilder.aws/',
    category: 'curso',
    icon: 'zap',
    isExternal: true,
  },
];

// ============================================
// Recursos educativos — Página /resources
// ============================================

export const RESOURCES: IResource[] = [
  {
    title: 'AWS Skill Builder',
    description:
      'Plataforma de aprendizaje online con cursos, labs y rutas personalizadas para todos los niveles.',
    url: 'https://skillbuilder.aws/',
    category: 'curso',
    icon: 'skill-builder',
    isExternal: true,
  },
  {
    title: 'AWS Academy',
    description:
      'Programa académico que lleva contenido cloud oficial de AWS a instituciones educativas.',
    url: 'https://aws.amazon.com/es/training/awsacademy/',
    category: 'curso',
    icon: 'academy',
    isExternal: true,
  },
  {
    title: 'AWS Certification',
    description:
      'Valida tus habilidades cloud con certificaciones reconocidas globalmente por la industria.',
    url: 'https://aws.amazon.com/es/certification/',
    category: 'certificacion',
    icon: 'certification',
    isExternal: true,
  },
  {
    title: 'AWS Workshops',
    description:
      'Laboratorios prácticos guiados para aprender servicios AWS construyendo proyectos reales.',
    url: 'https://builder.aws.com/build/workshops?trk=aca14daf-abad-48ab-b076-80aef7f8194d&sc_channel=el&tab=discover',
    category: 'herramienta',
    icon: 'workshops',
    isExternal: true,
  },
  {
    title: 'AWS Builder Center',
    description:
      'Centro de recursos para builders con herramientas, proyectos y comunidad de constructores.',
    url: 'https://bit.ly/45y5hpA',
    category: 'comunidad',
    icon: 'builder-center',
    isExternal: true,
  },
];

/** Colores de acento asignados a cada recurso (índice corresponde a RESOURCES). */
export const RESOURCE_ACCENT_COLORS: string[] = [
  'var(--sbg-accent)',  // AWS Skill Builder → Morado
  'var(--sbg-orange)',  // AWS Academy → Naranja
  'var(--sbg-success)', // AWS Certification → Verde
  'var(--sbg-blue)',    // AWS Workshops → Azul
  'var(--sbg-orange)',  // AWS Builder Center → Naranja (repetido, icono distinto)
];

// ============================================
// Beneficios de unirse al grupo
// ============================================

export const BENEFITS: IBenefit[] = [
  {
    title: 'Aprende tecnología cloud real',
    description:
      'Workshops prácticos con servicios AWS reales: Lambda, S3, EC2, RDS y más. Aprendizaje aplicado desde el primer día.',
    icon: 'cloud',
  },
  {
    title: 'Certifícate con AWS',
    description:
      'Prepárate para certificaciones AWS con guías, simulacros y la experiencia de miembros ya certificados.',
    icon: 'award',
  },
  {
    title: 'Construye tu red profesional',
    description:
      'Conecta con estudiantes apasionados, profesores, empresas y la comunidad AWS de toda Colombia.',
    icon: 'users',
  },
  {
    title: 'Proyectos reales en la nube',
    description:
      'Participa en proyectos grupales que usan AWS para resolver problemas reales de la Universidad y la región.',
    icon: 'code-2',
  },
  {
    title: 'Hackathons y competencias',
    description:
      'Compite en hackathons internos y externos, gana premios y demuestra tus habilidades al mundo.',
    icon: 'trophy',
  },
  {
    title: 'Oportunidades laborales',
    description:
      'Accede a ofertas de trabajo, pasantías y becas en empresas tecnológicas que buscan talento con habilidades AWS.',
    icon: 'briefcase',
  },
];

// ============================================
// Enlaces sociales (About page)
// ============================================

export const ABOUT_SOCIAL_LINKS: ISocialLink[] = [
  {
    key: 'whatsapp',
    platform: 'WhatsApp',
    ariaLabel: 'WhatsApp del AWS SBG Univalle',
    href: 'https://whatsapp.com/channel/0029VbBm0RJKgsNn6Ze7bU19',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
    external: true,
    glowColor: 'rgba(37,211,102,0.15)',
  },
  {
    key: 'instagram',
    platform: 'Instagram',
    ariaLabel: 'Instagram del AWS SBG Univalle',
    href: 'https://www.instagram.com/awsbuildergroup.univalle/',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.88 0 1.441 1.441 0 0 1 2.88 0z"/></svg>',
    external: true,
    glowColor: 'rgba(228,64,95,0.15)',
  },
  {
    key: 'youtube',
    platform: 'YouTube',
    ariaLabel: 'YouTube del AWS SBG Univalle',
    href: 'https://www.youtube.com/@awscloudunivalle',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    external: true,
    glowColor: 'rgba(255,0,0,0.12)',
  },
  {
    key: 'email',
    platform: 'Email',
    ariaLabel: 'Enviar correo al AWS SBG Univalle',
    href: 'mailto:aws.cloud.club@correounivalle.edu.co',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z"/></svg>',
    external: false,
    glowColor: 'rgba(139,92,246,0.15)',
  },
];

// ============================================
// Core Team — Página /contact
// ============================================

export const CORE_TEAM_MEMBERS: ICoreTeamMember[] = [
  {
    name: 'Juan Manuel Hoyos Contreras',
    role: 'Leader',
    area: '',
    linkedin: 'https://www.linkedin.com/in/juanhcontreras/',
    github: 'https://github.com/juanhcode',
    builderCenter: 'juanhoyos',
    image: `${ASSETS_CDN_URL}/${ASSETS_MEMBERS_PATH}/juan.jpeg`,
  },
  {
    name: 'Sebastián Cifuentes Flórez',
    role: '',
    area: 'Marketing & Community Lead',
    linkedin: 'https://www.linkedin.com/in/sebastian-cifuentes-florez-65872b187/',
    github: 'https://github.com/SpecTr03',
    image: `${ASSETS_CDN_URL}/${ASSETS_MEMBERS_PATH}/cifuentes.jpeg`,
  },
  {
    name: 'Pablo Nicolás Marín González',
    role: '',
    area: 'Partnerships & Academy Lead',
    linkedin: 'https://www.linkedin.com/in/pablo-nicolas-marin-gonzalez-33b8042a1/',
    github: 'https://github.com/Slylem0',
    builderCenter: 'pablitonicolas',
    image: `${ASSETS_CDN_URL}/${ASSETS_MEMBERS_PATH}/pablo.jpeg`,
  },
  {
    name: 'Aura María Peláez',
    role: '',
    area: 'Tech Lead',
    linkedin: 'https://www.linkedin.com/in/aura-maria-pelaez-luna-a0b4a33a8',
    github: 'https://github.com/aura2025',
    image: `${ASSETS_CDN_URL}/${ASSETS_MEMBERS_PATH}/aura.jpeg`,
  },
  {
    name: 'Miguel Ángel Sanclemente Mejía',
    role: '',
    area: 'Logistics & Events Lead',
    linkedin: 'https://www.linkedin.com/in/miguel-sanclemente-mejia-1538073a6/',
    github: 'https://github.com/MiguelSanclemente',
    image: `${ASSETS_CDN_URL}/${ASSETS_MEMBERS_PATH}/miguel.jpeg`,
  },
  {
    name: 'Jann Carlo Martinez',
    role: '',
    area: 'Planning & Monitoring Lead',
    linkedin: 'https://www.linkedin.com/in/jann-carlo-martinez-cardona-b1578a2b8/',
    github: 'https://github.com/JannC23',
    image: `${ASSETS_CDN_URL}/${ASSETS_MEMBERS_PATH}/jann.jpeg`,
  },
];

// ============================================
// Participa en la Comunidad — Página /participate
// ============================================

/** Correo del equipo de la comunidad (destino de las propuestas). */
export const COMMUNITY_EMAIL = 'aws.cloud.club@correounivalle.edu.co';

/**
 * Endpoint del backend para registrar propuestas (POST /community/proposals).
 * Si se deja vacío, el formulario simula el envío para poder probar la UX.
 */
export const PROPOSALS_ENDPOINT =
  'https://orj83oh0pc.execute-api.us-east-1.amazonaws.com/dev/community/proposals';

/** Formas de participación mostradas como tarjetas. */
export const PARTICIPATION_WAYS: IParticipationWay[] = [
  {
    key: 'TALK',
    icon: 'mic',
    title: 'Dar una charla',
    description:
      'Comparte tus conocimientos y experiencias sobre cloud, desarrollo, IA, DevOps, datos o seguridad con la comunidad.',
    actionLabel: 'Postular',
    glowColor: 'rgba(255,153,0,0.35)',
  },
  {
    key: 'WORKSHOP',
    icon: 'tools',
    title: 'Proponer un workshop',
    description:
      'Propón una actividad práctica para aprender construyendo, orientada a AWS, cloud, automatización u otros temas.',
    actionLabel: 'Proponer',
    glowColor: 'rgba(139,92,246,0.35)',
  },
  {
    key: 'TALLER',
    icon: 'book',
    title: 'Proponer un taller',
    description:
      'Comparte una actividad educativa, formativa o introductoria pensada para quienes están comenzando.',
    actionLabel: 'Proponer',
    glowColor: 'rgba(76,175,80,0.35)',
  },
  {
    key: 'VOLUNTEER',
    icon: 'hand',
    title: 'Ser voluntario',
    description:
      'Ayúdanos a organizar y desarrollar nuestros eventos presenciales: logística, registro, apoyo a speakers y más.',
    actionLabel: 'Participar',
    glowColor: 'rgba(33,150,243,0.35)',
  },
];

/** Opciones de modalidad para el formulario de propuesta. */
export const PROPOSAL_MODALITIES: IModalityOption[] = [
  { value: 'VIRTUAL', label: 'Virtual' },
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'HIBRIDA', label: 'Híbrida' },
];

/** Niveles de charla inspirados en los niveles de AWS (100–400). */
export const TALK_LEVELS: ITalkLevel[] = [
  {
    value: 100,
    label: '100 — Introductorio',
    description:
      'Contenido introductorio. Orientado a personas que están comenzando con el tema.',
  },
  {
    value: 200,
    label: '200 — Básico / Intermedio',
    description: 'Contenido que asume conocimientos básicos previos.',
  },
  {
    value: 300,
    label: '300 — Intermedio / Avanzado',
    description: 'Contenido técnico más profundo y especializado.',
  },
  {
    value: 400,
    label: '400 — Avanzado / Experto',
    description:
      'Contenido altamente avanzado, especializado o enfocado en escenarios complejos.',
  },
];

// ============================================
// Student Rewards — Página /student-rewards
// AWS Builder Center · beneficios para estudiantes
// ============================================

/** Enlace único de registro en AWS Builder Center (cuenta del grupo). */
export const BUILDER_CENTER_SIGNUP_URL = 'https://bit.ly/45y5hpA';

/** Página oficial de Student Rewards. También usada para la verificación de estudiante. */
export const STUDENT_REWARDS_URL = 'https://builder.aws.com/student-rewards';

/** Valor total aproximado desbloqueable (USD). */
export const STUDENT_REWARDS_TOTAL_VALUE = '$579';

/** Beneficio principal al verificarse y completar el perfil. */
export interface IRewardHighlight {
  value: string;
  title: string;
  description: string;
}

export const STUDENT_REWARDS_HIGHLIGHT: IRewardHighlight = {
  value: '$449',
  title: '1 año de Skill Builder Premium',
  description:
    'Al verificar tu estatus de estudiante y completar tu perfil, recibes acceso Premium a AWS Skill Builder durante 12 meses, sin tarjeta de crédito.',
};

/** Pasos para comenzar. */
export interface IRewardStep {
  number: number;
  title: string;
  description: string;
}

export const STUDENT_REWARDS_STEPS: IRewardStep[] = [
  {
    number: 1,
    title: 'Verifica tu estatus de estudiante',
    description:
      'Valida con SheerID usando tu nombre, universidad y correo. La mayoría de verificaciones se completan en minutos.',
  },
  {
    number: 2,
    title: 'Completa tu perfil de Builder Center',
    description: 'Agrega tu foto y la sección "about" para activar tus beneficios.',
  },
  {
    number: 3,
    title: 'Recibe tu primer beneficio',
    description: 'Un año de acceso Premium a AWS Skill Builder ($449 de valor).',
  },
];

/** Recompensas por badges acumulados. */
export interface IRewardTier {
  badges: number;
  reward: string;
  value: string;
  icon: string; // clave de icono
}

export const STUDENT_REWARDS_TIERS: IRewardTier[] = [
  { badges: 7, reward: '$10 en créditos AWS', value: '$10', icon: 'coins' },
  { badges: 14, reward: '$20 adicionales en créditos AWS', value: '$20', icon: 'coins' },
  {
    badges: 21,
    reward: 'Voucher de examen AWS Foundational Certification',
    value: '$100',
    icon: 'certificate',
  },
];

/** Formas de ganar badges. */
export const STUDENT_REWARDS_BADGE_ACTIONS: string[] = [
  'Publica artículos en Builder Center',
  'Comenta contenido de la comunidad',
  'Mantén rachas de actividad',
];

/** Razones por las que vale la pena participar. */
export const STUDENT_REWARDS_BENEFITS: string[] = [
  'No necesitas tarjeta de crédito para unirte a AWS Builder Center',
  'Acceso a recursos de aprendizaje premium',
  'Créditos AWS para construir tus proyectos',
  'Un camino claro para obtener una certificación Foundational de AWS',
];
