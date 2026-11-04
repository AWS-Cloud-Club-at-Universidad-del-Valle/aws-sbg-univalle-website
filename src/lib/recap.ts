/**
 * recap — Datos de la página /recap.
 *
 * Todas las cifras vienen de recap/metricas.json y recap/investigacion/eventos.json,
 * generados por recap/scripts/construir_datos.py. Aquí solo se agregan textos
 * editoriales (logros, hitos, alianzas) que citan esas cifras con su fuente.
 */

import metricas from '../../recap/metricas.json';
import eventosData from '../../recap/investigacion/eventos.json';

export { metricas };

export type NivelFuente = 'oficial' | 'publica' | 'lider';

export interface IRecapEvento {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  modalidad: 'Virtual' | 'Presencial';
  sede: string;
  lugar: string;
  tema: string;
  ponentes_publicos: string[];
  confirmaciones_meetup: number;
  nota: string | null;
  url: string;
}

export const EVENTOS = eventosData.eventos as IRecapEvento[];

export const FECHA_CORTE = metricas.fecha_corte;

const nf = new Intl.NumberFormat('es-CO');
export const fmt = (n: number, dec = 0) =>
  new Intl.NumberFormat('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
export const fmtInt = (n: number) => nf.format(n);

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** "2026-10-14" → "14 oct 2026" */
export function fechaCorta(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
}

/** "2026-10" → "oct 2026" */
export function mesCorto(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MESES[m - 1]} ${String(y).slice(2)}`;
}

export function mesLargo(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MESES_LARGOS[m - 1]} de ${y}`;
}

/** Quita emojis decorativos de los títulos de Meetup. */
export function limpiarTitulo(t: string): string {
  return t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '').replace(/\s+/g, ' ').trim();
}

export const FUENTES = {
  meetup: { label: 'Meetup del grupo', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/' },
  univalle: {
    label: 'Agencia de Noticias Univalle, 15 oct 2026',
    url: 'https://www.univalle.edu.co/ciencia-y-tecnologia/estudiante-de-univalle-representara-a-colombia-en-aws-re-invent-2026',
  },
  sessionize: { label: 'Perfil de ponente en Sessionize', url: 'https://sessionize.com/juan-manuel-hoyos/' },
  communityDay: { label: 'AWS Student Community Day Colombia', url: 'https://awsstudentcommunity.day/en' },
  directorio: { label: 'Directorio de SBG en dondeaprendoaws.com', url: 'https://dondeaprendoaws.com/comunidades/estudiantes/' },
  reto: { label: 'Reto en Meetup', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316372017/' },
  cloudQuest: { label: 'Cloud Quest en Meetup', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316898074/' },
  linkedin: { label: 'LinkedIn del grupo', url: 'https://www.linkedin.com/company/aws-studentbuildergroupunivalle/' },
  repo: {
    label: 'Fuentes y metodología en GitHub',
    url: 'https://github.com/AWS-Cloud-Club-at-Universidad-del-Valle/aws-sbg-univalle-website/tree/feat/recap/recap',
  },
} as const;

const ev = metricas.eventos;
const com = metricas.comunidad;
const cmp = metricas.comparacion_sbg_colombia;
const reto = metricas.reto_cloud_practitioner;
const enTulua = (ev.por_sede['Tuluá · Univalle Villa Campestre']?.eventos ?? 0) + (ev.por_sede['Tuluá · Escuela de Policía']?.eventos ?? 0);

export const EVENTOS_TULUA = enTulua;

export interface ILogro {
  titulo: string;
  detalle: string;
  nivel: NivelFuente;
  fuente: { label: string; url?: string };
}

export const LOGROS: ILogro[] = [
  {
    titulo: `${ev.total} eventos en 8 meses`,
    detalle: `Desde el lanzamiento del 28 de febrero, ${fmt(ev.eventos_por_semana_desde_lanzamiento, 2)} eventos por semana en promedio: ${ev.presenciales} presenciales y ${ev.virtuales} virtuales.`,
    nivel: 'oficial',
    fuente: FUENTES.meetup,
  },
  {
    titulo: `${fmtInt(com.miembros_meetup.valor)} miembros en Meetup`,
    detalle: `${cmp.puesto_univalle_miembros}.º entre los ${cmp.grupos.length} SBG de Colombia revisados, y el único de los cinco primeros fuera de Bogotá y Medellín (corte: ${fechaCorta(FECHA_CORTE)}).`,
    nivel: 'oficial',
    fuente: FUENTES.directorio,
  },
  {
    titulo: `${fmt(com.calificacion_meetup.valor, 2)}/5 con ${com.calificacion_meetup.valoraciones} valoraciones`,
    detalle: `Es el mayor número de valoraciones entre los ${cmp.grupos.length} grupos comparados.`,
    nivel: 'oficial',
    fuente: FUENTES.meetup,
  },
  {
    titulo: 'Beca All Builders Welcome para AWS re:Invent 2026',
    detalle: 'Juan Manuel Hoyos Contreras, líder del grupo, viaja a Las Vegas del 30 de noviembre al 4 de diciembre con beca completa.',
    nivel: 'oficial',
    fuente: FUENTES.univalle,
  },
  {
    titulo: `Reto Cloud Practitioner de ${reto.sesiones} sesiones`,
    detalle: `Organizado con el SBG de la UCEVA en Tuluá, con cupos llenos y ${fmt(reto.confirmaciones_promedio, 1)} confirmaciones de media por sesión.`,
    nivel: 'oficial',
    fuente: FUENTES.reto,
  },
  {
    titulo: 'Más de 20 vouchers de certificación',
    detalle: 'Entregados a estudiantes de Tuluá, Yumbo y otras sedes de la Universidad del Valle.',
    nivel: 'lider',
    fuente: { label: 'Fuente pública pendiente' },
  },
  {
    titulo: `Tuluá, el centro de lo presencial`,
    detalle: `${enTulua} de los ${ev.presenciales} eventos presenciales se hicieron en Tuluá: en la sede Villa Campestre y en la Escuela de Policía Simón Bolívar.`,
    nivel: 'oficial',
    fuente: FUENTES.meetup,
  },
  {
    titulo: 'Ponentes en el AWS Summit Bogotá 2026',
    detalle: 'Invitados por AWS. Según su perfil de ponente, Juan Manuel Hoyos fue seleccionado para el AWS Builder Spotlight.',
    nivel: 'lider',
    fuente: FUENTES.sessionize,
  },
  {
    titulo: 'AWS Cloud Quest en el Valle del Cauca',
    detalle: 'Kick-off con Univalle, Icesi, UCEVA y San Buenaventura: 156 confirmaciones, el récord del grupo. Hubo muchos ganadores de Univalle, según el líder.',
    nivel: 'oficial',
    fuente: FUENTES.cloudQuest,
  },
  {
    titulo: 'Primer SBG del Valle del Cauca',
    detalle: 'Creado el 17 de noviembre de 2025. Después llegaron los de la UCEVA (mayo de 2026) e Icesi (septiembre de 2026), con quienes ya trabaja.',
    nivel: 'publica',
    fuente: FUENTES.directorio,
  },
];

export interface IHito {
  fecha: string; // ISO o YYYY-MM
  mes: string; // YYYY-MM
  titulo: string;
  detalle: string;
  nivel: NivelFuente;
  url?: string;
  futuro?: boolean;
}

export const HITOS: IHito[] = [
  { mes: '2025-11', fecha: '2025-11', titulo: 'AWS da el aval', detalle: 'Nace el primer AWS Student Builder Group del Valle del Cauca. El grupo se crea en Meetup el 17 de noviembre.', nivel: 'lider' },
  { mes: '2026-02', fecha: '2026-02-01', titulo: 'Organización en GitHub', detalle: 'Primer repositorio de la comunidad. Hoy hay 12 repos públicos con retos de práctica.', nivel: 'oficial', url: 'https://github.com/AWS-Cloud-Club-at-Universidad-del-Valle' },
  { mes: '2026-02', fecha: '2026-02-28', titulo: 'Lanzamiento: Tu Primer Paso en la Nube', detalle: 'Evento virtual con taller de EC2 y 96 confirmaciones.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/313397936/' },
  { mes: '2026-03', fecha: '2026-03-16', titulo: 'Un AWS Hero en la comunidad', detalle: 'Carlos Zambrano habla de cómo construir una carrera en la nube (93 confirmaciones).', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/313727453/' },
  { mes: '2026-05', fecha: '2026-05-11', titulo: 'Primer evento presencial en Tuluá', detalle: 'Certificaciones y GitOps en la sede Villa Campestre. Es el inicio del polo regional.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/314572381/' },
  { mes: '2026-06', fecha: '2026-06-12', titulo: 'Primer evento en Meléndez', detalle: 'AWS Cloud Essentials con demo de Lambda en Cali.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/315114097/' },
  { mes: '2026-06', fecha: '2026-06-26', titulo: 'Student Community Day Colombia', detalle: 'En Bogotá, con más de 800 cupos. Univalle participa como SBG y su líder figura entre los organizadores.', nivel: 'oficial', url: 'https://awsstudentcommunity.day/en' },
  { mes: '2026-07', fecha: '2026-07-25', titulo: 'Construye Rápido... Despliega seguro!', detalle: 'Con AWS User Group Valle del Cauca, CENESIS e IEEE Computer Society: 89 confirmaciones, el presencial con más confirmaciones.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/315578404/' },
  { mes: '2026-07', fecha: '2026-07-30', titulo: 'AWS Summit Bogotá 2026', detalle: 'Ponentes invitados por AWS; AWS Builder Spotlight según Sessionize.', nivel: 'lider', url: 'https://sessionize.com/juan-manuel-hoyos/' },
  { mes: '2026-09', fecha: '2026-09-03', titulo: 'La nube llega a la Escuela de Policía', detalle: 'Dos charlas de serverless y fundamentos en Tuluá.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316292610/' },
  { mes: '2026-09', fecha: '2026-09-19', titulo: 'Arranca el reto Cloud Practitioner', detalle: 'Ocho sesiones presenciales con el SBG de la UCEVA, con cupos llenos desde la primera.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316372017/' },
  { mes: '2026-09', fecha: '2026-09-28', titulo: 'TryCatch.tv llega a Univalle', detalle: 'Del estudio al primer trabajo en tech: 152 confirmaciones.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316601837/' },
  { mes: '2026-10', fecha: '2026-10-14', titulo: 'AWS Cloud Quest Valle del Cauca', detalle: 'Cuatro universidades y 156 confirmaciones, el récord del grupo.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316898074/' },
  { mes: '2026-10', fecha: '2026-10-15', titulo: 'Beca para AWS re:Invent', detalle: 'La Universidad del Valle publica la beca All Builders Welcome del líder del grupo.', nivel: 'oficial', url: FUENTES.univalle.url },
  { mes: '2026-10', fecha: '2026-10-29', titulo: 'Cierre del reto', detalle: 'Sesión 8: Well-Architected y simulacro final de examen.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316375885/' },
  { mes: '2026-12', fecha: '2026-12-04', titulo: 'Watch & Build Party en Tuluá', detalle: 'AWS re:Invent en vivo y a construir, aprobada y avalada por AWS.', nivel: 'lider', futuro: true },
  { mes: '2026-12', fecha: '2026-12', titulo: 'Hackathon de AWS', detalle: 'En diciembre, con fecha por confirmar. Será el primer hackathon del grupo.', nivel: 'lider', futuro: true },
];

export const ALIANZAS = [
  { nombre: 'AWS SBG UCEVA', rol: 'Reto Cloud Practitioner (8 sesiones) y Cloud Quest', lugar: 'Tuluá' },
  { nombre: 'Universidad Icesi', rol: 'Sede de Contenedores 101 y parte de Cloud Quest', lugar: 'Cali' },
  { nombre: 'Universidad de San Buenaventura', rol: 'Parte de Cloud Quest Valle del Cauca', lugar: 'Cali' },
  { nombre: 'AWS User Group Valle del Cauca', rol: 'Coorganizador de "Construye Rápido... Despliega seguro!"', lugar: 'Cali' },
  { nombre: 'IEEE Computer Society', rol: 'Coorganizador y sesiones para su comunidad', lugar: 'Univalle' },
  { nombre: 'CENESIS', rol: 'Centro de Estudios de Ingeniería de Sistemas, coorganizador', lugar: 'Univalle' },
  { nombre: 'Escuela de Policía Simón Bolívar', rol: 'Sede de dos charlas', lugar: 'Tuluá' },
  { nombre: 'Red de SBG de Colombia', rol: 'AWS Student Community Day Colombia 2026', lugar: 'Bogotá' },
];
