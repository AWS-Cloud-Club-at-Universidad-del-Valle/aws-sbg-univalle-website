import type {
  IEvent,
  ISiteConfig,
  ApiEventType,
  ApiEventModality,
} from '@/types/index';

// ============================================
// Utilidades de eventos
// ============================================

/**
 * Filtra eventos futuros, los ordena ascendentemente por fecha y
 * limita el resultado. No modifica el array de entrada.
 *
 * Postcondición: result.length <= limit
 * Postcondición: todos los elementos tienen date >= Date.now()
 */
export function filterUpcomingEvents(events: IEvent[], limit: number): IEvent[] {
  const now = Date.now();
  return events
    .filter(e => e.date.getTime() >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
}

/**
 * Formatea una fecha en español colombiano.
 * @example formatEventDate(new Date('2026-08-20')) → "20 de agosto de 2026"
 *
 * Precondición: date es instancia válida de Date (no NaN)
 * Postcondición: retorna string no vacío
 */
export function formatEventDate(date: Date, locale = 'es-CO'): string {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea solo la hora de un evento.
 * @example formatEventTime(new Date('2026-08-20T10:00:00')) → "10:00 a. m."
 */
export function formatEventTime(date: Date, locale = 'es-CO'): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea mes y año.
 * @example formatMonthYear(new Date('2026-08-20')) → "agosto de 2026"
 */
export function formatMonthYear(date: Date, locale = 'es-CO'): string {
  return date.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

// ============================================
// Utilidades de miembros
// ============================================

/**
 * Retorna las iniciales del nombre (máximo 2 caracteres).
 * @example getInitials("Valentina Rodríguez") → "VR"
 * @example getInitials("Carlos") → "C"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// ============================================
// Utilidades de SEO / JSON-LD
// ============================================

/**
 * Construye el objeto JSON-LD para schema.org/Organization.
 *
 * Precondición: config.url comienza con 'https://'
 * Precondición: config.name no está vacío
 * Postcondición: output tiene @context y @type, es JSON serializable
 */
export function buildJsonLdOrganization(config: ISiteConfig): Record<string, unknown> {
  const sameAs = Object.values(config.social).filter((v): v is string => Boolean(v));

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    logo: `${config.url}${config.logo}`,
    description: config.description,
    sameAs,
  };
}

// ============================================
// Utilidades de string
// ============================================

/**
 * Genera un slug kebab-case a partir de un string.
 * @example slugify("AWS Lambda y Serverless") → "aws-lambda-y-serverless"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Trunca un string a maxLength caracteres y agrega '…' si es necesario.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// ============================================
// Utilidades de la API de Eventos
// ============================================

/**
 * Formatea una fecha en formato "YYYY-MM-DD" (de la API) a español.
 * Se construye la fecha en horario local para evitar corrimientos de zona.
 * @example formatApiDate('2026-09-03') → "3 de septiembre de 2026"
 */
export function formatApiDate(dateStr: string, locale = 'es-CO'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea una fecha corta "YYYY-MM-DD" a "3 sep 2026".
 */
export function formatApiDateShort(dateStr: string, locale = 'es-CO'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Etiqueta legible para el tipo de evento de la API. */
export function eventTypeLabel(type: ApiEventType): string {
  const map: Record<ApiEventType, string> = {
    CHARLA: 'Charla',
    WORKSHOP: 'Workshop',
    HACKATHON: 'Hackathon',
  };
  return map[type] ?? type;
}

/** Etiqueta legible para la modalidad de la API. */
export function modalityLabel(modality: ApiEventModality): string {
  const map: Record<ApiEventModality, string> = {
    VIRTUAL: 'Virtual',
    PRESENCIAL: 'Presencial',
    HIBRIDO: 'Híbrido',
  };
  return map[modality] ?? modality;
}

/** Color de acento (rgba/hex) para cada tipo de evento. */
export function eventTypeColor(type: ApiEventType): string {
  const map: Record<ApiEventType, string> = {
    CHARLA: '#2E73B8',    // azul
    WORKSHOP: '#FF9900',  // naranja AWS
    HACKATHON: '#8B5CF6', // morado
  };
  return map[type] ?? '#FF9900';
}
