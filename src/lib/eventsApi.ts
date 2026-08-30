/**
 * eventsApi — Cliente de la API REST de Eventos.
 *
 * Consume los endpoints públicos GET /events y GET /events/{id}.
 * Incluye una capa de caché en sessionStorage con TTL para evitar
 * llamar a la API en cada render/navegación.
 *
 * La base URL se lee de la variable de entorno PUBLIC_EVENTS_API_URL.
 * Solo se usan endpoints GET públicos: no se manejan tokens ni secretos.
 */

import type {
  IApiEventsResponse,
  IApiEventDetail,
  IApiEventsQuery,
} from '@/types/index';

/** Base URL de la API (inyectada en build por Astro). */
const API_BASE_URL: string = import.meta.env.PUBLIC_EVENTS_API_URL ?? '';

/** TTL de la caché de listados: 10 minutos. */
const LIST_CACHE_TTL_MS = 10 * 60 * 1000;

/** TTL de la caché de detalle: 15 minutos. */
const DETAIL_CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Prefijo de las claves de caché en sessionStorage.
 * Incluye un identificador de la base URL para que las cachés de dev y prod
 * no colisionen si se cambia de API.
 */
function hashBase(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    h = (h << 5) - h + url.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}
const CACHE_PREFIX = `sbg:events:${hashBase(API_BASE_URL)}:`;

interface CacheEntry<T> {
  /** Timestamp (ms) en que se guardó la entrada. */
  ts: number;
  /** TTL en ms para esta entrada. */
  ttl: number;
  /** Datos cacheados. */
  data: T;
}

/** Error tipado para fallos de la API. */
export class EventsApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'EventsApiError';
    this.status = status;
  }
}

/**
 * Lee una entrada de caché válida (no expirada) desde sessionStorage.
 * Retorna null si no existe, expiró o el entorno no soporta sessionStorage.
 */
function readCache<T>(key: string): T | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.ts > entry.ttl) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/** Guarda una entrada en la caché de sessionStorage. Falla en silencio. */
function writeCache<T>(key: string, data: T, ttl: number): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { ts: Date.now(), ttl, data };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    /* cuota llena o modo privado: ignorar */
  }
}

/** Construye el querystring a partir de los filtros, omitiendo vacíos. */
function buildQueryString(query: IApiEventsQuery): string {
  const params = new URLSearchParams();
  if (query.page != null) params.set('page', String(query.page));
  if (query.limit != null) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.type) params.set('type', query.type);
  if (query.modality) params.set('modality', query.modality);
  if (query.status) params.set('status', query.status);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Obtiene un listado paginado de eventos (GET /events).
 * Usa caché de sessionStorage con TTL de 10 minutos por combinación de filtros.
 *
 * @throws EventsApiError si la API no responde o retorna error.
 */
export async function fetchEvents(
  query: IApiEventsQuery = {}
): Promise<IApiEventsResponse> {
  if (!API_BASE_URL) {
    throw new EventsApiError('PUBLIC_EVENTS_API_URL no está configurada.');
  }

  const qs = buildQueryString(query);
  const cacheKey = `list${qs}`;

  const cached = readCache<IApiEventsResponse>(cacheKey);
  if (cached) return cached;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/events${qs}`, {
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    throw new EventsApiError(
      'No se pudo conectar con la API de eventos. Revisa tu conexión.'
    );
  }

  if (!res.ok) {
    throw new EventsApiError(
      `La API respondió con estado ${res.status}.`,
      res.status
    );
  }

  const data = (await res.json()) as IApiEventsResponse;
  writeCache(cacheKey, data, LIST_CACHE_TTL_MS);
  return data;
}

/**
 * Obtiene el detalle completo de un evento (GET /events/{id}).
 * Usa caché de sessionStorage con TTL de 15 minutos.
 *
 * @throws EventsApiError si la API no responde o el evento no existe.
 */
export async function fetchEventById(id: string): Promise<IApiEventDetail> {
  if (!API_BASE_URL) {
    throw new EventsApiError('PUBLIC_EVENTS_API_URL no está configurada.');
  }

  const cacheKey = `detail:${id}`;
  const cached = readCache<IApiEventDetail>(cacheKey);
  if (cached) return cached;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    throw new EventsApiError(
      'No se pudo conectar con la API de eventos. Revisa tu conexión.'
    );
  }

  if (res.status === 404) {
    throw new EventsApiError('El evento no existe.', 404);
  }
  if (!res.ok) {
    throw new EventsApiError(
      `La API respondió con estado ${res.status}.`,
      res.status
    );
  }

  const data = (await res.json()) as IApiEventDetail;
  writeCache(cacheKey, data, DETAIL_CACHE_TTL_MS);
  return data;
}

/** Limpia toda la caché de eventos (útil para forzar recarga). */
export function clearEventsCache(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignorar */
  }
}
