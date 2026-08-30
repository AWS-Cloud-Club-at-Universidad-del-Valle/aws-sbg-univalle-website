/**
 * eventCard — Generador de markup para las tarjetas de evento.
 *
 * Se usa desde el cliente (render dinámico) para construir cada tarjeta
 * del listado a partir de un IApiEventListItem. Devuelve un string HTML
 * ya escapado para evitar inyección desde datos de la API.
 */

import type { IApiEventListItem } from '@/types/index';
import {
  formatApiDateShort,
  eventTypeLabel,
  modalityLabel,
  eventTypeColor,
} from '@/lib/utils';

/** Escapa texto para insertarlo de forma segura en HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Icono SVG según modalidad. */
function modalityIcon(modality: string): string {
  if (modality === 'VIRTUAL') {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
  }
  // PRESENCIAL / HIBRIDO → pin de ubicación
  return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
}

/**
 * Genera el HTML de una tarjeta de evento como un enlace al detalle.
 *
 * @param item Evento del listado
 * @returns string HTML de la tarjeta
 */
export function renderEventCard(item: IApiEventListItem): string {
  const color = eventTypeColor(item.eventType);
  const typeText = escapeHtml(eventTypeLabel(item.eventType));
  const modalityText = escapeHtml(modalityLabel(item.modality));
  const title = escapeHtml(item.title);
  const dateText = escapeHtml(formatApiDateShort(item.date));
  const time = escapeHtml(item.startTime ?? '');
  const href = `/events/detalle?id=${encodeURIComponent(item.id)}`;

  const imageBlock = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${title}" loading="lazy" class="event-card__img" />`
    : `<div class="event-card__img event-card__img--placeholder" aria-hidden="true">
         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
       </div>`;

  return `
    <a href="${href}" class="event-card group" data-event-id="${escapeHtml(item.id)}">
      <div class="event-card__media">
        ${imageBlock}
        <span class="event-card__type" style="--type-color:${color};">${typeText}</span>
      </div>
      <div class="event-card__body">
        <h3 class="event-card__title">${title}</h3>
        <div class="event-card__meta">
          <span class="event-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${dateText}
          </span>
          ${
            time
              ? `<span class="event-card__meta-item">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                   ${time}
                 </span>`
              : ''
          }
          <span class="event-card__meta-item">
            ${modalityIcon(item.modality)}
            ${modalityText}
          </span>
        </div>
        <span class="event-card__cta">
          Ver detalle
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </a>
  `;
}

/** Genera el HTML de una tarjeta skeleton (estado de carga). */
export function renderEventCardSkeleton(): string {
  return `
    <div class="event-card event-card--skeleton" aria-hidden="true">
      <div class="event-card__media"><div class="skeleton-box"></div></div>
      <div class="event-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-line--short"></div>
      </div>
    </div>
  `;
}
