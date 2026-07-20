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
