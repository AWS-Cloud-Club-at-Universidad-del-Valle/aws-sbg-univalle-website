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
export const FECHA_CORTE_MEETUP = metricas.fecha_corte_meetup;
export const CIFRAS_RECAP = metricas.cifras_confirmadas_por_lider;

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

const fuenteLider = { label: CIFRAS_RECAP.fuente };
const hitosLider = metricas.hitos_confirmados_por_lider;
const expansionRegional = 'Ayudamos a abrir SBG en Icesi, Uceva, USB, UAO, EMAVI y Camacho. También dimos charlas en Icesi, USB y Uceva.';
const ponentesInternacionales = `${hitosLider.community_day_peru.texto}. Juan Manuel Hoyos fue ponente en la AWS Student Community de Cochabamba, Bolivia.`;
const thinkBig = 'Pablo Nicolás Marín ganó el reto Think Big de AWS con ideas para llevar a escala global.';
const aiTour = 'Univalle fue seleccionada para alojar, por separado del equipo de AWS, un evento del AWS AI Tour Colombia el 10 de noviembre en la Icesi.';

export interface ILogro {
  titulo: string;
  detalle: string;
  nivel: NivelFuente;
  fuente: { label: string; url?: string };
}

export const HITOS_SIN_FECHA: ILogro[] = [
  {
    titulo: `Más de ${fmtInt(CIFRAS_RECAP.web.peticiones_superan)} peticiones en la web`,
    detalle: `${CIFRAS_RECAP.web.dominio} ha recibido ${fmtInt(CIFRAS_RECAP.web.usuarios)} usuarios desde su lanzamiento.`,
    nivel: 'lider',
    fuente: fuenteLider,
  },
  {
    titulo: 'El Valle se llenó de SBG',
    detalle: expansionRegional,
    nivel: 'lider',
    fuente: fuenteLider,
  },
  {
    titulo: 'Ponentes internacionales',
    detalle: ponentesInternacionales,
    nivel: 'lider',
    fuente: fuenteLider,
  },
];

export const LOGROS: ILogro[] = [
  {
    titulo: `${CIFRAS_RECAP.eventos} eventos y ${fmtInt(CIFRAS_RECAP.estudiantes_alcanzados)} estudiantes alcanzados`,
    detalle: `Desde la fundación en noviembre de 2025, la comunidad creció hasta ${fmtInt(CIFRAS_RECAP.miembros)} miembros.`,
    nivel: 'lider',
    fuente: fuenteLider,
  },
  {
    titulo: 'AWS Community Leadership Summit Bogotá',
    detalle: `${hitosLider.cumbre_andina.texto}. ${thinkBig}`,
    nivel: 'lider',
    fuente: fuenteLider,
  },
  {
    titulo: 'AWS AI Tour Colombia',
    detalle: aiTour,
    nivel: 'lider',
    fuente: fuenteLider,
  },
  ...HITOS_SIN_FECHA,
  {
    titulo: 'Primera AI League global',
    detalle: 'Un estudiante de Univalle ganó la primera edición global.',
    nivel: 'lider',
    fuente: fuenteLider,
  },
  {
    titulo: `${fmtInt(com.miembros_meetup.valor)} miembros en el corte público de Meetup`,
    detalle: `${cmp.puesto_univalle_miembros}.º entre los ${cmp.grupos.length} SBG de Colombia revisados al ${fechaCorta(FECHA_CORTE_MEETUP)}.`,
    nivel: 'oficial',
    fuente: FUENTES.directorio,
  },
  {
    titulo: `${fmt(com.calificacion_meetup.valor, 2)}/5 con ${com.calificacion_meetup.valoraciones} valoraciones`,
    detalle: `Es el mayor número de valoraciones entre los ${cmp.grupos.length} grupos comparados al ${fechaCorta(FECHA_CORTE_MEETUP)}.`,
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
    detalle: `El primer curso reunió a 50 estudiantes en Tuluá, con certificación gratis. También se ofreció el curso a estudiantes de Yumbo.`,
    nivel: 'lider',
    fuente: fuenteLider,
  },
  {
    titulo: 'Más de 20 vouchers de certificación',
    detalle: 'Entregados a estudiantes de Tuluá, Yumbo y otras sedes de la Universidad del Valle.',
    nivel: 'lider',
    fuente: { label: 'Fuente pública pendiente' },
  },
  {
    titulo: `Tuluá, el centro de lo presencial`,
    detalle: `${enTulua} de los ${ev.presenciales} eventos presenciales publicados en Meetup al ${fechaCorta(FECHA_CORTE_MEETUP)} se hicieron en Tuluá: en la sede Villa Campestre y en la Escuela de Policía Simón Bolívar.`,
    nivel: 'oficial',
    fuente: FUENTES.meetup,
  },
  {
    titulo: 'Juan Manuel Hoyos, ponente en el AWS Summit Bogotá 2026',
    detalle: 'Estudiante de Univalle, invitado por AWS. Según su perfil de ponente, fue seleccionado para el AWS Builder Spotlight.',
    nivel: 'lider',
    fuente: FUENTES.sessionize,
  },
  {
    titulo: 'AWS Cloud Quest en el Valle del Cauca',
    detalle: hitosLider.cloud_quest.texto + '.',
    nivel: 'lider',
    fuente: fuenteLider,
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
  { mes: '2025-11', fecha: '2025-11', titulo: 'AWS da el aval', detalle: 'Estudiantes de Univalle Tuluá fundan el primer AWS Student Builder Group del Valle del Cauca, pionero en comunidades AWS en la región. El grupo se crea en Meetup el 17 de noviembre.', nivel: 'lider' },
  { mes: '2025-12', fecha: '2025-12', titulo: 'Equipo listo', detalle: 'El equipo queda conformado y hace una pausa por vacaciones entre diciembre y enero.', nivel: 'lider' },
  { mes: '2026-01', fecha: '2026-01', titulo: 'Pausa de vacaciones', detalle: 'El equipo retoma actividades en febrero.', nivel: 'lider' },
  { mes: '2026-02', fecha: '2026-02-01', titulo: 'Organización en GitHub', detalle: 'La comunidad arranca en redes sociales y publica su primer repositorio en GitHub.', nivel: 'oficial', url: 'https://github.com/AWS-Cloud-Club-at-Universidad-del-Valle' },
  { mes: '2026-02', fecha: '2026-02-28', titulo: 'Lanzamiento: Tu Primer Paso en la Nube', detalle: 'Primer evento virtual, con un taller de EC2 y cerca de 100 estudiantes. Meetup registró 96 confirmaciones.', nivel: 'lider', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/313397936/' },
  { mes: '2026-03', fecha: '2026-03-16', titulo: 'Un AWS Hero en la comunidad', detalle: 'Carlos Zambrano habla de cómo construir una carrera en la nube (93 confirmaciones).', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/313727453/' },
  { mes: '2026-03', fecha: '2026-03', titulo: 'Taller de perfil de LinkedIn', detalle: 'Un profesional sénior orientó a los estudiantes en la preparación de su perfil.', nivel: 'lider' },
  { mes: '2026-04', fecha: '2026-04', titulo: 'Charlas virtuales', detalle: 'La comunidad continúa con charlas en línea.', nivel: 'lider' },
  { mes: '2026-05', fecha: '2026-05-11', titulo: 'Primer evento presencial en la Semana de la Expresión', detalle: 'Más de 1.200 asistentes en Tuluá. La agenda incluyó certificaciones y GitOps en la sede Villa Campestre.', nivel: 'lider', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/314572381/' },
  { mes: '2026-06', fecha: '2026-06-12', titulo: 'Primer evento en Meléndez', detalle: 'AWS Cloud Essentials con una demostración de Lambda y cerca de 50 personas en Cali.', nivel: 'lider', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/315114097/' },
  { mes: '2026-06', fecha: '2026-06-26', titulo: 'AWS Student Community Day Colombia', detalle: 'Univalle llevó cerca de 100 estudiantes de Cali y Tuluá a Bogotá y se destacó por los premios obtenidos. Un estudiante de Univalle ganó la primera AI League global.', nivel: 'lider', url: 'https://awsstudentcommunity.day/en' },
  { mes: '2026-07', fecha: '2026-07-25', titulo: 'Construye Rápido... Despliega seguro!', detalle: 'Con AWS User Group Valle del Cauca, CENESIS e IEEE Computer Society: 89 confirmaciones, el presencial con más confirmaciones en el corte público de Meetup.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/315578404/' },
  { mes: '2026-07', fecha: '2026-07-30', titulo: 'AWS Summit Bogotá 2026', detalle: 'Juan Manuel Hoyos, estudiante de Univalle, fue ponente. Su perfil de Sessionize registra la selección para AWS Builder Spotlight.', nivel: 'lider', url: 'https://sessionize.com/juan-manuel-hoyos/' },
  { mes: '2026-09', fecha: '2026-09', titulo: 'Evento ESBOL', detalle: 'Cerca de 150 personas asistieron al evento en la Escuela de Policía Simón Bolívar, en Tuluá. Meetup registra dos charlas de serverless y fundamentos.', nivel: 'lider', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316292610/' },
  { mes: '2026-09', fecha: '2026-09-19', titulo: 'Arranca el reto Cloud Practitioner', detalle: 'Primer curso con el SBG de la UCEVA: 50 estudiantes, ocho sesiones y certificación gratis. También se ofreció el curso a estudiantes de Yumbo.', nivel: 'lider', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316372017/' },
  { mes: '2026-09', fecha: '2026-09-28', titulo: 'TryCatch.tv llega a Univalle', detalle: 'Del estudio al primer trabajo en tech: 152 confirmaciones.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316601837/' },
  { mes: '2026-10', fecha: '2026-10-14', titulo: 'AWS Cloud Quest Valle del Cauca', detalle: 'Univalle ganó el torneo regional. El lanzamiento con cuatro universidades registró 156 confirmaciones en Meetup.', nivel: 'lider', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316898074/' },
  { mes: '2026-10', fecha: '2026-10-15', titulo: 'Beca para AWS re:Invent', detalle: 'La Universidad del Valle publica la beca All Builders Welcome del líder del grupo.', nivel: 'oficial', url: FUENTES.univalle.url },
  { mes: '2026-10', fecha: '2026-10-29', titulo: 'Cierre del reto', detalle: 'Sesión 8: Well-Architected y simulacro final de examen.', nivel: 'oficial', url: 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316375885/' },
  { mes: '2026-11', fecha: '2026-11-10', titulo: 'AWS AI Tour Colombia', detalle: aiTour, nivel: 'lider' },
  { mes: '2026-11', fecha: '2026-11-11', titulo: 'AWS Community Leadership Summit Bogotá', detalle: `Del 11 al 15 de noviembre. ${hitosLider.cumbre_andina.texto}. ${thinkBig}`, nivel: 'lider' },
  { mes: '2026-11', fecha: '2026-11', titulo: 'Taller de Ingeniería de arnés', detalle: 'El grupo realizó el taller en noviembre.', nivel: 'lider' },
  { mes: '2026-11', fecha: '2026-11', titulo: 'Kiro for Students', detalle: 'Univalle está a la espera de ser seleccionada.', nivel: 'lider' },
  { mes: '2026-11', fecha: '2026-11-21', titulo: 'AWS Tech Day Cali', detalle: 'Próximo evento. El SBG participa como organizador del lado de AWS.', nivel: 'lider', futuro: true },
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
