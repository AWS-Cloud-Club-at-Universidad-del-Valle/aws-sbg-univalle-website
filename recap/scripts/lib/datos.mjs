// Datos y utilidades compartidas por los generadores. Todas las cifras salen
// de recap/metricas.json y recap/investigacion/eventos.json.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const aqui = path.dirname(fileURLToPath(import.meta.url));
export const RECAP = path.resolve(aqui, '..', '..');
export const REPO = path.resolve(RECAP, '..');
export const ENTREGABLES = path.join(RECAP, 'entregables');

export const M = JSON.parse(readFileSync(path.join(RECAP, 'metricas.json'), 'utf8'));
export const EVENTOS = JSON.parse(readFileSync(path.join(RECAP, 'investigacion', 'eventos.json'), 'utf8')).eventos;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const n = (v, dec = 0) =>
  new Intl.NumberFormat('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);
export const fecha = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
};
export const fechaCorta = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES_C[m - 1]} ${y}`;
};
export const mesCorto = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return `${MESES_C[m - 1]} ${String(y).slice(2)}`;
};
export const limpiar = (t) =>
  t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '').replace(/\s+/g, ' ').trim();

// Cifras derivadas que usan todos los entregables.
const ev = M.eventos;
export const D = {
  corte: M.fecha_corte,
  corteTexto: fecha(M.fecha_corte),
  miembros: M.comunidad.miembros_meetup.valor,
  eventos: ev.total,
  propios: M.comunidad.eventos_propios_o_coorganizados.valor,
  presenciales: ev.presenciales,
  virtuales: ev.virtuales,
  confirmaciones: ev.confirmaciones_total,
  promVirtual: ev.confirmaciones_promedio_virtual,
  promPresencial: ev.confirmaciones_promedio_presencial,
  mediana: ev.confirmaciones_mediana,
  calificacion: M.comunidad.calificacion_meetup.valor,
  valoraciones: M.comunidad.calificacion_meetup.valoraciones,
  impactados: M.comunidad.estudiantes_impactados.texto,
  linkedin: M.comunidad.seguidores_linkedin.valor,
  youtube: M.comunidad.suscriptores_youtube.valor,
  repos: M.comunidad.repos_publicos_github.valor,
  tulua:
    (ev.por_sede['Tuluá · Univalle Villa Campestre']?.eventos ?? 0) + (ev.por_sede['Tuluá · Escuela de Policía']?.eventos ?? 0),
  porMesLanz: ev.eventos_por_mes_desde_lanzamiento,
  porMesAval: ev.eventos_por_mes_desde_aval,
  porSemana: ev.eventos_por_semana_desde_lanzamiento,
  sepOct: ev.por_mes.filter((m) => m.mes === '2026-09' || m.mes === '2026-10').reduce((a, m) => a + m.eventos, 0),
  reto: M.reto_cloud_practitioner,
  cmp: M.comparacion_sbg_colombia,
  diasLanz: M.periodo.dias_desde_lanzamiento,
  diasAval: M.periodo.dias_desde_aval,
};

export const AVISO_RSVP =
  'Las confirmaciones son respuestas «Asistiré» en Meetup, no asistencia real. Varios eventos presenciales se inscribieron por formulario externo, así que Meetup los subestima.';

export const URL = {
  meetup: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/',
  sitio: 'https://awsunivalle.dev',
  recap: 'https://awsunivalle.dev/recap',
  univalle: 'https://www.univalle.edu.co/ciencia-y-tecnologia/estudiante-de-univalle-representara-a-colombia-en-aws-re-invent-2026',
  sessionize: 'https://sessionize.com/juan-manuel-hoyos/',
  communityDay: 'https://awsstudentcommunity.day/en',
  directorio: 'https://dondeaprendoaws.com/comunidades/estudiantes/',
  linkedin: 'https://www.linkedin.com/company/aws-studentbuildergroupunivalle/',
  instagram: 'https://www.instagram.com/awsbuildergroup.univalle/',
  whatsapp: 'https://whatsapp.com/channel/0029VbBm0RJKgsNn6Ze7bU19',
  correo: 'aws.cloud.club@correounivalle.edu.co',
};
