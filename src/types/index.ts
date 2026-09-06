import type { ImageMetadata } from 'astro';

// ============================================
// Configuración del sitio
// ============================================

export interface ISiteConfig {
  name: string;
  shortName: string;
  url: string;
  description: string;
  logo: string;
  ogImage: string;
  social: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    whatsapp?: string;
    youtube?: string;
    email?: string;
  };
}

// ============================================
// Navegación
// ============================================

export interface INavLink {
  href: string;
  label: string;
}

// ============================================
// Estadísticas del grupo
// ============================================

export interface IStat {
  /** Valor entero positivo ≥ 0 */
  value: number;
  /** Sufijo a mostrar tras el número: '+', '%', 'k' */
  suffix?: string;
  /** Descripción legible de la métrica */
  label: string;
  /** Nombre de icono Lucide */
  icon: string;
}

// ============================================
// Eventos
// ============================================

export interface IEvent {
  /** Título del evento. Máximo 80 caracteres. */
  title: string;
  /** Fecha de inicio (ISO 8601). Debe ser Date válido. */
  date: Date;
  /** Fecha de fin, si aplica. Debe ser > date. */
  endDate?: Date;
  /** Nombre del lugar o "Virtual" */
  location: string;
  type: 'workshop' | 'hackathon' | 'charla' | 'otro';
  /** Descripción para preview. Máximo 300 caracteres. */
  description: string;
  /** URL HTTPS de registro, si aplica. */
  registrationUrl?: string;
  image?: ImageMetadata;
  /** Obligatorio si image está presente. */
  imageAlt?: string;
  /** Entre 1 y 5 etiquetas. */
  tags: string[];
  isFeatured?: boolean;
  /** Calculado: date < Date.now() */
  isPast?: boolean;
}

// ============================================
// Miembros del equipo
// ============================================

export interface IMember {
  /** Nombre completo. No vacío. */
  name: string;
  /** Cargo en el grupo. */
  role: string;
  /** Bio corta. Máximo 200 caracteres. */
  bio?: string;
  photo?: ImageMetadata;
  /** Obligatorio si photo está presente. */
  photoAlt?: string;
  /** URL linkedin.com/in/... */
  linkedin?: string;
  /** URL github.com/... */
  github?: string;
  /** True para miembros de la directiva. */
  isDirective: boolean;
}

// ============================================
// Partners
// ============================================

export interface IPartner {
  /** Nombre del partner. No vacío. */
  name: string;
  /** Imagen local importada. */
  logo?: ImageMetadata;
  /** URL de imagen externa (solo si logo no está disponible). */
  logoUrl?: string;
  /** Descripción del logo para accesibilidad. No vacío. */
  logoAlt: string;
  /** URL HTTPS del partner, si aplica. */
  url?: string;
  tier?: 'gold' | 'silver' | 'community';
}

// ============================================
// Recursos educativos
// ============================================

export interface IResource {
  title: string;
  description: string;
  /** URL válida. HTTPS para recursos externos. */
  url: string;
  category: 'documentacion' | 'curso' | 'certificacion' | 'herramienta' | 'comunidad';
  /** Nombre de icono Lucide, opcional. */
  icon?: string;
  /** True si el link abre en nueva pestaña. */
  isExternal: boolean;
}

// ============================================
// Beneficios del grupo
// ============================================

export interface IBenefit {
  title: string;
  description: string;
  /** Nombre de icono Lucide. */
  icon: string;
}

// ============================================
// Enlaces sociales (About page)
// ============================================

export interface ISocialLink {
  /** Unique key identifier for the platform */
  key: string;
  /** Platform name for display and aria-label */
  platform: string;
  /** Accessible label: "{platform} del AWS SBG Univalle" */
  ariaLabel: string;
  /** Target URL (https:// or mailto:) */
  href: string;
  /** Inline SVG markup for the platform icon */
  icon: string;
  /** Whether this link opens in a new tab (false for mailto) */
  external: boolean;
  /** Color para el efecto glow en hover (rgba) */
  glowColor?: string;
}

// ============================================
// Core Team (Contact page)
// ============================================

export interface ICoreTeamMember {
  /** Nombre completo del integrante */
  name: string;
  /** Cargo/rol en el equipo */
  role: string;
  /** Área de responsabilidad */
  area: string;
  /** URL completa del perfil de LinkedIn (HTTPS) */
  linkedin: string;
  /** URL completa del perfil de GitHub (HTTPS) */
  github: string;
  /** URL de imagen de perfil opcional (HTTPS, futuro S3) */
  image?: string;
}

// ============================================
// API de Eventos (backend REST)
// ============================================

/** Tipo de evento según la API. */
export type ApiEventType = 'CHARLA' | 'WORKSHOP' | 'HACKATHON';

/** Modalidad del evento según la API. */
export type ApiEventModality = 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDO';

/** Estado del evento según la API. */
export type ApiEventStatus = 'UPCOMING' | 'COMPLETED';

/** Item de evento en el listado (GET /events). */
export interface IApiEventListItem {
  id: string;
  title: string;
  /** Fecha en formato YYYY-MM-DD */
  date: string;
  /** Hora de inicio HH:mm */
  startTime: string;
  modality: ApiEventModality;
  eventType: ApiEventType;
  status: ApiEventStatus;
  /** URL de imagen */
  image?: string;
}

/** Metadatos de paginación (GET /events). */
export interface IApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Respuesta completa de GET /events. */
export interface IApiEventsResponse {
  items: IApiEventListItem[];
  pagination: IApiPagination;
}

/** Detalle completo de un evento (GET /events/{id}). */
export interface IApiEventDetail {
  id: string;
  title: string;
  /** Descripción larga en formato markdown */
  description: string;
  image?: string;
  eventType: ApiEventType;
  modality: ApiEventModality;
  status: ApiEventStatus;
  /** Fecha en formato YYYY-MM-DD */
  date: string;
  /** Hora de inicio HH:mm */
  startTime: string;
  /** Hora de fin HH:mm */
  endTime?: string;
  timezone?: string;
  location?: string;
  /** URL de registro (Meetup u otra) */
  registrationUrl?: string;
  /** URL de la fuente original */
  sourceUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Filtros/query params soportados por GET /events. */
export interface IApiEventsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: ApiEventType;
  modality?: ApiEventModality;
  status?: ApiEventStatus;
  /** Fecha desde YYYY-MM-DD */
  from?: string;
  /** Fecha hasta YYYY-MM-DD */
  to?: string;
}

// ============================================
// Participa en la Comunidad
// ============================================

/** Tipo de propuesta que el backend debe poder identificar. */
export type ProposalType = 'TALK' | 'WORKSHOP' | 'TALLER' | 'IDEA' | 'VOLUNTEER';

/** Modalidad en la que se realizaría la actividad. */
export type ProposalModality = 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDA';

/** Nivel de la charla, inspirado en los niveles de AWS (100–400). */
export type ProposalLevel = 100 | 200 | 300 | 400;

/** Forma de participación mostrada como tarjeta. */
export interface IParticipationWay {
  /** Tipo de propuesta que se preselecciona al abrir el formulario. */
  key: ProposalType;
  /** Emoji o clave de icono representativo. */
  icon: string;
  /** Título corto: "Dar una charla". */
  title: string;
  /** Descripción breve de la forma de participación. */
  description: string;
  /** Texto del botón: "Postular" | "Proponer" | "Participar". */
  actionLabel: string;
  /** Color rgba para el efecto glow en hover. */
  glowColor?: string;
}

/** Opción de modalidad para el formulario. */
export interface IModalityOption {
  value: ProposalModality;
  label: string;
}

/** Nivel de charla con descripción de ayuda para el speaker. */
export interface ITalkLevel {
  /** Valor numérico del nivel (100, 200, 300, 400). */
  value: ProposalLevel;
  /** Etiqueta legible: "200 — Básico / Intermedio". */
  label: string;
  /** Descripción corta que ayuda a elegir el nivel correcto. */
  description: string;
}
