import type {
  ISiteConfig,
  INavLink,
  IStat,
  IEvent,
  IMember,
  IPartner,
  IResource,
  IBenefit,
} from '@/types/index';

// ============================================
// Configuración global del sitio
// ============================================

export const SITE_CONFIG: ISiteConfig = {
  name: 'AWS Student Builder Group Universidad del Valle',
  shortName: 'AWS SBG Univalle',
  url: 'https://sbg.univalle.edu.co',
  description:
    'Comunidad estudiantil de tecnología cloud AWS en la Universidad del Valle, Colombia. Aprende, construye y conecta con los mejores builders.',
  logo: '/images/logo-sbg.svg',
  ogImage: '/images/og-default.png',
  social: {
    instagram: 'https://instagram.com/awssbgunivalle',
    linkedin: 'https://linkedin.com/company/aws-sbg-univalle',
    github: 'https://github.com/aws-sbg-univalle',
    whatsapp: 'https://wa.me/573000000000',
  },
};

// ============================================
// Links de navegación
// ============================================

export const NAV_LINKS: INavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Nosotros' },
  { href: '/events', label: 'Eventos' },
  { href: '/resources', label: 'Recursos' },
  { href: '/contact', label: 'Contacto' },
];

// ============================================
// Estadísticas del grupo
// ============================================

export const STATS: IStat[] = [
  { value: 150, suffix: '+', label: 'Miembros activos', icon: 'users' },
  { value: 30, suffix: '+', label: 'Eventos realizados', icon: 'calendar' },
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
