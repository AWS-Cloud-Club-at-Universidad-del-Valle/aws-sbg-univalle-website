// Genera entregables/presentacion/recap-aws-sbg-univalle.pptx (14 diapositivas con notas).
// Uso: node recap/scripts/generar_presentacion.mjs
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { M, D, n, fechaCorta, mesCorto, URL, ENTREGABLES } from './lib/datos.mjs';
import { aplicarTema } from './lib/tema_pptx.mjs';

const require = createRequire(import.meta.url);
const PptxGenJS = require('pptxgenjs');

const THEME = {
  name: 'AWS SBG Univalle',
  headFontFace: 'Arial',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '14171D', lt1: 'FFFFFF', dk2: '21252E', lt2: 'E5E7EB',
    accent1: '8B5CF6', accent2: 'FF9900', accent3: 'CF7700', accent4: 'A3AAB6', accent5: '2A2F3A', accent6: '86EFAC',
    hlink: 'A78BFA', folHlink: 'A78BFA',
  },
};
const HEX = { bg: '14171D', surface: '21252E', elev: '2A2F3A', text: 'E5E7EB', muted: 'A3AAB6', subtle: '8B929E', violet: '8B5CF6', orange: 'FF9900', orangeD: 'CF7700', grid: '2F3440' };

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Recap 2025–2026 · AWS Student Builder Group Universidad del Valle';
pres.author = 'AWS Student Builder Group Universidad del Valle';
pres.company = 'AWS SBG Univalle';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const LOGO = 'image/png;base64,' + readFileSync(path.join(ENTREGABLES, '_assets', 'logo-sbg.png')).toString('base64');

// ------------------------------------------------------------------ layouts
pres.defineSlideMaster({
  title: 'PORTADA',
  background: { color: HEX.bg },
  objects: [
    { image: { x: 0.6, y: 0.5, w: 0.55, h: 0.55, data: LOGO } },
    { text: { text: 'AWS Student Builder Group · Universidad del Valle', options: { x: 1.3, y: 0.55, w: 6, h: 0.45, fontFace: 'Courier New', fontSize: 11, color: C.accent4, margin: 0 } } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.55, w: 8.8, h: 1.9, fontFace: 'Arial', fontSize: 40, bold: true, color: C.background1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.6, w: 7.6, h: 1.0, fontFace: 'Calibri', fontSize: 16, color: C.accent4, valign: 'top', margin: 0 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENIDO',
  background: { color: HEX.bg },
  margin: [0.5, 0.6, 0.5, 0.6],
  objects: [
    { placeholder: { options: { name: 'eyebrow', type: 'body', x: 0.6, y: 0.35, w: 7, h: 0.3, fontFace: 'Courier New', fontSize: 11, color: C.accent2, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.62, w: 8.8, h: 0.75, fontFace: 'Arial', fontSize: 26, bold: true, color: C.background1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    { image: { x: 9.05, y: 5.1, w: 0.32, h: 0.32, data: LOGO } },
    { text: { text: `AWS SBG Univalle · Recap 2025–2026 · corte ${fechaCorta(D.corte)}`, options: { x: 0.6, y: 5.15, w: 6, h: 0.25, fontFace: 'Calibri', fontSize: 9, color: C.accent4, margin: 0 } } },
  ],
  slideNumber: { x: 8.55, y: 5.15, w: 0.4, h: 0.25, fontFace: 'Calibri', fontSize: 9, color: HEX.subtle, align: 'right' },
});

const contenido = (seccion, eyebrow, titulo) => {
  const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: seccion });
  s.addText(eyebrow, { placeholder: 'eyebrow' });
  s.addText(titulo, { placeholder: 'title' });
  return s;
};
const tarjeta = (s, x, y, w, h, nombre, fill = HEX.surface) =>
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill }, objectName: nombre });
const cifra = (s, x, y, w, valor, etiqueta, nota, nombre) => {
  tarjeta(s, x, y, w, 1.35, `tarjeta-${nombre}`);
  s.addText(String(valor), { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.6, fontFace: 'Arial', fontSize: 30, bold: true, color: C.background1, margin: 0, isTextBox: true, objectName: `valor-${nombre}` });
  s.addText(etiqueta, { x: x + 0.2, y: y + 0.72, w: w - 0.4, h: 0.3, fontSize: 13, bold: true, color: C.background2, margin: 0, isTextBox: true });
  if (nota) s.addText(nota, { x: x + 0.2, y: y + 1.0, w: w - 0.4, h: 0.25, fontSize: 10, color: C.accent4, margin: 0, isTextBox: true });
};
const ejes = { catAxisLabelColor: HEX.muted, valAxisLabelColor: HEX.muted, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 10, valAxisLabelFontSize: 10, valGridLine: { color: HEX.grid, size: 0.75 }, catGridLine: { style: 'none' }, catAxisLineShow: false, valAxisLineShow: false, dataLabelColor: HEX.text, dataLabelFontFace: '+mn-lt', dataLabelFontSize: 10 };

// ------------------------------------------------------------------ 1. portada
pres.addSection({ title: 'Apertura' });
{
  const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: 'Apertura' });
  s.addText([{ text: 'De Cali a Tuluá,', options: { breakLine: true } }, { text: 'y de Tuluá a Las Vegas.', options: { color: C.accent2 } }], { placeholder: 'title' });
  s.addText(`Recap 2025–2026 del primer AWS Student Builder Group del Valle del Cauca. Cifras públicas con corte al ${D.corteTexto}.`, { placeholder: 'body' });
  s.addNotes(`Buenas. En los próximos minutos les contamos el primer año del AWS Student Builder Group de la Universidad del Valle. La frase resume la historia: nacimos en Cali, la actividad presencial se concentró en Tuluá y el año cierra con nuestro líder en AWS re:Invent, en Las Vegas, y con la comunidad construyendo en Tuluá. Todas las cifras son públicas, con fuente y corte al 3 de noviembre de 2026.`);
}

// ------------------------------------------------------------------ 2. el año en cifras
pres.addSection({ title: 'El año' });
{
  const s = contenido('El año', '# el_año_en_cifras', 'Un año construyendo en comunidad');
  const w = 2.05, g = 0.2;
  cifra(s, 0.6, 1.55, w, n(D.miembros), 'miembros', 'en Meetup', 'miembros');
  cifra(s, 0.6 + (w + g), 1.55, w, D.eventos, 'eventos', `${D.presenciales} presenciales · ${D.virtuales} virtuales`, 'eventos');
  cifra(s, 0.6 + 2 * (w + g), 1.55, w, n(D.confirmaciones), 'confirmaciones', 'RSVP, no asistencia real', 'rsvp');
  cifra(s, 0.6 + 3 * (w + g), 1.55, w, n(D.calificacion, 2), 'de calificación', `${D.valoraciones} valoraciones`, 'rating');
  s.addText([
    { text: `${n(D.porSemana, 2)} eventos por semana`, options: { bold: true, color: C.background1 } },
    { text: ` desde el lanzamiento del 28 de febrero de 2026 (${n(D.porMesLanz, 2)} al mes). Desde el aval de noviembre de 2025, ${n(D.porMesAval, 2)} al mes. Además, la Agencia de Noticias Univalle reporta ${D.impactados} estudiantes impactados en todas las sedes.`, options: { color: C.background2 } },
  ], { x: 0.6, y: 3.2, w: 8.8, h: 0.9, fontSize: 15, margin: 0, isTextBox: true, valign: 'top' });
  s.addText('Las confirmaciones son respuestas «Asistiré» en Meetup, no asistencia real.', { x: 0.6, y: 4.45, w: 8.8, h: 0.3, fontSize: 10, color: C.accent4, margin: 0, isTextBox: true });
  s.addNotes(`Cuatro cifras de Meetup al 3 de noviembre: 1.408 miembros, 36 eventos, 1.757 confirmaciones y 4,86 de calificación con 183 valoraciones. Ojo: las confirmaciones son RSVP, no asistencia real. El ritmo es de un evento por semana desde el lanzamiento. Los 900 estudiantes impactados vienen de la nota oficial de la universidad y se cuentan aparte de los miembros de Meetup.`);
}

// ------------------------------------------------------------------ 3. línea de tiempo
{
  const s = contenido('El año', '# linea_de_tiempo', 'Del aval de AWS a re:Invent');
  const hitos = [
    ['nov 25', 'Aval de AWS', 'Primer SBG del Valle'],
    ['28 feb', 'Lanzamiento', '96 confirmaciones'],
    ['11 may', 'Llegamos a Tuluá', 'Primer presencial'],
    ['26 jun', 'Community Day', 'Bogotá, coorganizado'],
    ['30 jul', 'Summit Bogotá', 'Ponentes invitados'],
    ['19 sep', 'Reto CCP', '8 sesiones con UCEVA'],
    ['14 oct', 'Cloud Quest', '4 universidades'],
    ['4 dic', 'Watch Party', 'Tuluá'],
  ];
  const x0 = 1.25, x1 = 8.75, y = 2.75;
  s.addShape(pres.ShapeType.line, { x: x0, y, w: x1 - x0, h: 0, line: { color: HEX.grid, width: 2 }, objectName: 'eje-tiempo' });
  hitos.forEach(([f, t, d], i) => {
    const x = x0 + (i * (x1 - x0)) / (hitos.length - 1);
    const futuro = i === hitos.length - 1;
    s.addShape(pres.ShapeType.ellipse, { x: x - 0.11, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: futuro ? HEX.orange : HEX.violet }, line: { color: HEX.bg, width: 2 }, objectName: `hito-${i}` });
    const arriba = i % 2 === 0;
    s.addText(f, { x: x - 0.6, y: arriba ? 1.62 : 3.0, w: 1.2, h: 0.25, align: 'center', fontFace: 'Courier New', fontSize: 10, color: futuro ? C.accent2 : C.accent4, margin: 0, isTextBox: true });
    s.addText([{ text: t, options: { bold: true, color: C.background1, breakLine: true } }, { text: d, options: { color: C.accent4, fontSize: 10 } }], { x: x - 0.65, y: arriba ? 1.88 : 3.25, w: 1.3, h: 0.7, align: 'center', valign: 'top', fontSize: 11, margin: 0, isTextBox: true });
  });
  s.addText('El ritmo se aceleró en el segundo semestre: septiembre y octubre concentran 20 de los 36 eventos.', { x: 0.6, y: 4.35, w: 8.8, h: 0.4, fontSize: 14, color: C.background2, margin: 0, isTextBox: true });
  s.addNotes(`La línea de tiempo arranca con el aval de AWS en noviembre de 2025. El lanzamiento oficial fue el 28 de febrero de 2026. En mayo llegamos por primera vez a Tuluá, en junio coorganizamos el Student Community Day en Bogotá y en julio fuimos ponentes invitados por AWS en el Summit Bogotá. El segundo semestre trajo el reto de certificación con la UCEVA y Cloud Quest con cuatro universidades. Cerramos el 4 de diciembre con la Watch Party en Tuluá.`);
}

// ------------------------------------------------------------------ 4. ritmo (gráfica nativa)
{
  const s = contenido('El año', '# ritmo', 'Uno por semana, y acelerando');
  const meses = M.eventos.por_mes.filter((m) => m.mes >= '2026-02' && m.mes <= '2026-10');
  const labels = meses.map((m) => mesCorto(m.mes));
  s.addChart(pres.ChartType.bar, [
    { name: 'Virtual', labels, values: meses.map((m) => m.virtuales) },
    { name: 'Presencial', labels, values: meses.map((m) => m.presenciales) },
  ], { x: 0.6, y: 1.45, w: 5.9, h: 3.4, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 70, chartColors: [HEX.violet, HEX.orangeD], showLegend: true, legendPos: 'b', legendColor: HEX.muted, legendFontFace: '+mn-lt', legendFontSize: 10, showValue: false, showTitle: true, title: 'Eventos por mes (feb–oct 2026)', titleColor: HEX.text, titleFontFace: '+mn-lt', titleFontSize: 12, valAxisMaxVal: 12, valAxisMajorUnit: 4, ...ejes, objectName: 'grafica-eventos-mes' });
  tarjeta(s, 6.8, 1.45, 2.6, 3.4, 'tarjeta-ritmo');
  s.addText([
    { text: `${D.sepOct} de ${D.eventos}`, options: { fontFace: 'Arial', fontSize: 30, bold: true, color: C.background1, breakLine: true } },
    { text: 'eventos en septiembre y octubre', options: { fontSize: 13, color: C.background2, breakLine: true } },
    { text: ' ', options: { fontSize: 8, breakLine: true } },
    { text: 'Agosto: sin eventos publicados.', options: { fontSize: 11, color: C.accent4 } },
  ], { x: 7.0, y: 1.65, w: 2.2, h: 3.0, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes(`Mes a mes. De febrero a julio hicimos 16 eventos; en septiembre y octubre, 20. Octubre fue el récord, con 12, gracias al reto de certificación y los workshops en Tuluá. En agosto no hubo eventos publicados.`);
}

// ------------------------------------------------------------------ 5. Tuluá
pres.addSection({ title: 'Impacto' });
{
  const s = contenido('Impacto', '# tuluá', `${D.tulua} de ${D.presenciales} presenciales fueron en Tuluá`);
  const sedes = Object.entries(M.eventos.por_sede).filter(([k]) => k !== 'Virtual').sort((a, b) => b[1].eventos - a[1].eventos);
  s.addChart(pres.ChartType.bar, [{ name: 'Eventos presenciales', labels: sedes.map(([k]) => k), values: sedes.map(([, v]) => v.eventos) }], { x: 0.6, y: 1.45, w: 5.4, h: 3.3, barDir: 'bar', chartColors: [HEX.orangeD], showValue: true, dataLabelPosition: 'outEnd', showLegend: false, showTitle: true, title: 'Eventos presenciales por sede', titleColor: HEX.text, titleFontFace: '+mn-lt', titleFontSize: 12, catAxisOrientation: 'maxMin', ...ejes, objectName: 'grafica-sedes' });
  s.addShape(pres.ShapeType.roundRect, { x: 6.3, y: 1.45, w: 3.1, h: 2.1, rectRadius: 0.12, fill: { color: HEX.surface }, line: { color: HEX.muted, width: 1, dashType: 'dash' }, objectName: 'espacio-foto-tulua' });
  s.addText('[FOTO REAL]\nReto Cloud Practitioner en Tuluá\nReemplazar con foto con permiso', { x: 6.4, y: 1.6, w: 2.9, h: 1.8, align: 'center', valign: 'middle', fontSize: 11, color: C.accent4, margin: 0, isTextBox: true });
  s.addText('La nube no es solo para la sede principal: la actividad presencial vive en la sede regional.', { x: 6.3, y: 3.7, w: 3.1, h: 1.05, fontSize: 13, color: C.background2, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes(`Este es el dato que más nos distingue. De 20 eventos presenciales, 16 se hicieron en Tuluá: 14 en la sede Villa Campestre y 2 en la Escuela de Policía Simón Bolívar. En Cali hicimos 3, en Meléndez e Icesi, y uno fue el Community Day en Bogotá. Para la universidad esto es regionalización real. Este espacio queda reservado para una foto real del reto.`);
}

// ------------------------------------------------------------------ 6. Reto CCP
{
  const s = contenido('Impacto', '# reto_cloud_practitioner', 'Ocho semanas para certificarse, con cupos llenos');
  const r = D.reto;
  s.addChart(pres.ChartType.bar, [{ name: 'Confirmaciones', labels: r.confirmaciones_por_sesion.map((_, i) => `S${i + 1}`), values: r.confirmaciones_por_sesion }], { x: 0.6, y: 1.45, w: 5.6, h: 3.3, barDir: 'col', chartColors: [HEX.orangeD], showValue: true, dataLabelPosition: 'outEnd', showLegend: false, showTitle: true, title: 'Confirmaciones por sesión', titleColor: HEX.text, titleFontFace: '+mn-lt', titleFontSize: 12, valAxisMaxVal: 50, valAxisMajorUnit: 10, ...ejes, objectName: 'grafica-reto' });
  cifra(s, 6.5, 1.45, 2.9, n(r.confirmaciones_promedio, 1), 'confirmaciones de media', 'por sesión, cupos llenos', 'reto-prom');
  cifra(s, 6.5, 3.0, 2.9, 'Más de 20', 'vouchers entregados', 'Tuluá, Yumbo y otras sedes · dato del equipo', 'vouchers');
  s.addText('Con el AWS SBG de la UCEVA · Tuluá · 19 sep → 29 oct 2026', { x: 0.6, y: 4.8, w: 8.8, h: 0.25, fontSize: 10, color: C.accent4, margin: 0, isTextBox: true });
  s.addNotes(`El reto AWS Certified Cloud Practitioner fueron 8 sesiones presenciales en Tuluá, organizadas con el SBG de la UCEVA, del 19 de septiembre al 29 de octubre. Los cupos se llenaron desde la primera sesión, y la sexta igualó a la primera con 40 confirmaciones. Además, el equipo entregó más de 20 vouchers de certificación a estudiantes de Tuluá, Yumbo y otras sedes; ese dato lo confirma el líder y aún no tiene fuente pública.`);
}

// ------------------------------------------------------------------ 7. temas
{
  const s = contenido('Impacto', '# temas', 'Lo que más convoca: carrera, IA y comunidad');
  const temas = Object.entries(M.eventos.por_tema).sort((a, b) => b[1].confirmaciones - a[1].confirmaciones);
  s.addChart(pres.ChartType.bar, [{ name: 'Confirmaciones', labels: temas.map(([t]) => t), values: temas.map(([, d]) => d.confirmaciones) }], { x: 0.6, y: 1.45, w: 6.0, h: 3.35, barDir: 'bar', chartColors: [HEX.violet], showValue: true, dataLabelPosition: 'outEnd', showLegend: false, showTitle: true, title: 'Confirmaciones por tema', titleColor: HEX.text, titleFontFace: '+mn-lt', titleFontSize: 12, catAxisOrientation: 'maxMin', ...ejes, objectName: 'grafica-temas' });
  tarjeta(s, 6.85, 1.45, 2.55, 3.35, 'tarjeta-temas');
  s.addText([
    { text: `${n(D.promVirtual, 1)}`, options: { fontFace: 'Arial', fontSize: 26, bold: true, color: C.background1, breakLine: true } },
    { text: 'confirmaciones promedio en virtual', options: { fontSize: 12, color: C.background2, breakLine: true } },
    { text: ' ', options: { fontSize: 8, breakLine: true } },
    { text: `${n(D.promPresencial, 1)}`, options: { fontFace: 'Arial', fontSize: 26, bold: true, color: C.background1, breakLine: true } },
    { text: 'en presencial, subestimado por la inscripción externa', options: { fontSize: 12, color: C.background2 } },
  ], { x: 7.05, y: 1.6, w: 2.15, h: 3.1, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes(`Las charlas de carrera profesional son las que más convocan en virtual: 481 confirmaciones en cinco charlas. IA y datos es el tema con más eventos después del reto. Serverless aparece abajo, pero sus cuatro eventos fueron presenciales con inscripción por formulario, así que Meetup no refleja su asistencia.`);
}

// ------------------------------------------------------------------ 8. ponentes
{
  const s = contenido('Impacto', '# ponentes', 'La industria vino a la comunidad');
  const ponentes = [
    ['Carlos Zambrano', 'AWS Hero'],
    ['Germán Ruiz', 'Senior Solutions Architect, AWS'],
    ['Julián Darío Luna Patiño', 'AWS Community Builder, TryCatch.tv'],
    ['Jhon Robert Quintero', 'AWS Community Builder'],
    ['Diana David', 'HR Manager LATAM'],
    ['José Verbel Tous', 'Desde las Trincheras: Kiro'],
    ['William A. Guzmán Bernal', 'De AWS a LinkedIn'],
    ['Raúl Alzate · Lucas Vera Toro · Carlos F. Chicata', 'IA, DynamoDB y data pipelines'],
  ];
  ponentes.forEach(([nombre, rol], i) => {
    const col = i % 2, fila = Math.floor(i / 2);
    const x = 0.6 + col * 4.5, y = 1.5 + fila * 0.82;
    tarjeta(s, x, y, 4.3, 0.7, `ponente-${i}`);
    s.addText([{ text: nombre, options: { bold: true, color: C.background1, breakLine: true } }, { text: rol, options: { color: C.accent4, fontSize: 11 } }], { x: x + 0.2, y: y + 0.08, w: 3.9, h: 0.55, fontSize: 13, margin: 0, valign: 'middle', isTextBox: true });
  });
  s.addNotes(`Trajimos a la comunidad a personas de la industria: un AWS Hero, Carlos Zambrano; un Senior Solutions Architect de AWS, Germán Ruiz; y varios AWS Community Builders. Los nombres salen de las publicaciones de cada evento en Meetup y en LinkedIn.`);
}

// ------------------------------------------------------------------ 9. reconocimientos
pres.addSection({ title: 'Reconocimiento' });
{
  const s = contenido('Reconocimiento', '# reconocimientos', 'Rumbo a AWS re:Invent 2026');
  const items = [
    ['Beca All Builders Welcome', 'Juan Manuel Hoyos Contreras, líder del grupo, estará en Las Vegas del 30 nov al 4 dic.', 'Agencia de Noticias Univalle, 15 oct 2026'],
    ['AWS Summit Bogotá 2026', 'Ponentes invitados por AWS. Builder Spotlight según Sessionize.', 'Dato del equipo + Sessionize'],
    ['Student Community Day Colombia', 'Líder entre los organizadores · Bogotá, 26 jun · más de 800 cupos.', 'awsstudentcommunity.day'],
    ['Primer SBG del Valle del Cauca', 'Creado el 17 nov 2025, antes que UCEVA (may 2026) e Icesi (sep 2026).', 'Meetup + dondeaprendoaws.com'],
  ];
  items.forEach(([t, d, f], i) => {
    const x = 0.6 + (i % 2) * 4.5, y = 1.5 + Math.floor(i / 2) * 1.65;
    tarjeta(s, x, y, 4.3, 1.5, `reco-${i}`);
    s.addText([{ text: t, options: { bold: true, fontSize: 15, color: C.background1, breakLine: true } }, { text: d, options: { fontSize: 12, color: C.background2, breakLine: true } }, { text: f, options: { fontSize: 10, color: C.accent2 } }], { x: x + 0.2, y: y + 0.12, w: 3.9, h: 1.26, valign: 'top', margin: 0, isTextBox: true, paraSpaceAfter: 3 });
  });
  s.addNotes(`El trabajo de la comunidad tiene reconocimiento externo. Nuestro líder ganó la beca All Builders Welcome para AWS re:Invent; lo publicó la Agencia de Noticias de la universidad. Fuimos ponentes invitados por AWS en el Summit Bogotá, y su perfil de ponente menciona el Builder Spotlight. Coorganizamos el Student Community Day Colombia. Y somos el primer SBG del Valle del Cauca.`);
}

// ------------------------------------------------------------------ 10. comparación
{
  const s = contenido('Reconocimiento', '# contexto', `${D.cmp.puesto_univalle_miembros}.º en miembros entre ${D.cmp.grupos.length} SBG de Colombia`);
  const corto = (g) => g.nombre.replace('AWS SBG at ', '').replace('Francisco Jose de Caldas District Univ. - Bogota', 'U. Distrital').replace('University of the Valle', 'Universidad del Valle').replace('EAN University', 'EAN').replace(/National University of Colombia\s+- Bogota Campus/, 'U. Nacional Bogotá').replace('University of Antioquia', 'U. de Antioquia').replace('Digital University Institution of Antioquia', 'IU Digital');
  const filas = D.cmp.grupos.slice(0, 6).map((g) => {
    const yo = g.url.includes('university-of-the-valle');
    const o = { color: yo ? HEX.orange : HEX.text, bold: yo, fontSize: 11 };
    return [{ text: corto(g), options: o }, { text: g.ciudad, options: o }, { text: n(g.miembros), options: { ...o, align: 'right' } }, { text: String(g.eventos_pasados), options: { ...o, align: 'right' } }, { text: String(g.valoraciones), options: { ...o, align: 'right' } }];
  });
  const h = (t, a = 'left') => ({ text: t, options: { bold: true, color: HEX.muted, fontSize: 10, align: a } });
  s.addTable([[h('Grupo'), h('Ciudad'), h('Miembros', 'right'), h('Eventos', 'right'), h('Valoraciones', 'right')], ...filas], { x: 0.6, y: 1.45, w: 6.2, colW: [2.2, 1.1, 1.0, 0.9, 1.0], fontFace: 'Calibri', color: HEX.text, border: { type: 'solid', pt: 0.5, color: HEX.grid }, fill: { color: HEX.bg }, rowH: 0.36, margin: 0.05, objectName: 'tabla-comparacion' });
  tarjeta(s, 7.05, 1.45, 2.35, 2.55, 'tarjeta-cmp');
  s.addText([
    { text: `${D.cmp.puesto_univalle_eventos}.º`, options: { fontFace: 'Arial', fontSize: 24, bold: true, color: C.background1 } },
    { text: ' en eventos', options: { fontSize: 12, color: C.background2, breakLine: true } },
    { text: `${D.cmp.puesto_univalle_valoraciones}.º`, options: { fontFace: 'Arial', fontSize: 24, bold: true, color: C.background1 } },
    { text: ' en valoraciones', options: { fontSize: 12, color: C.background2, breakLine: true } },
    { text: 'Único del top 5 fuera de Bogotá y Medellín.', options: { fontSize: 11, color: C.accent4 } },
  ], { x: 7.2, y: 1.6, w: 2.05, h: 2.3, valign: 'top', margin: 0, isTextBox: true, paraSpaceAfter: 6 });
  s.addText(`Universo: ${D.cmp.grupos.length} SBG de Colombia en dondeaprendoaws.com con página en Meetup, consultados el ${fechaCorta(D.corte)}. Los grupos se crearon entre mayo de 2025 y septiembre de 2026, así que las cifras acumuladas no son del todo comparables.`, { x: 0.6, y: 4.2, w: 8.8, h: 0.6, fontSize: 10, color: C.accent4, margin: 0, isTextBox: true, valign: 'top' });
  s.addNotes(`Para dar contexto sin exagerar: entre los 14 SBG de Colombia que revisamos el mismo día, somos segundos en miembros después de la U. Distrital, segundos en eventos después de EAN y primeros en número de valoraciones. No decimos que seamos el más grande ni el más activo, porque los grupos tienen edades distintas y el universo depende de un directorio comunitario.`);
}

// ------------------------------------------------------------------ 11. alianzas
{
  const s = contenido('Reconocimiento', '# alianzas', 'Construimos con otros');
  const al = [
    ['AWS SBG UCEVA', 'Reto CCP y Cloud Quest'],
    ['Universidad Icesi', 'Contenedores 101 · Cloud Quest'],
    ['U. de San Buenaventura', 'Cloud Quest Valle del Cauca'],
    ['AWS User Group Valle', 'Construye Rápido... Despliega seguro!'],
    ['IEEE Computer Society', 'Coorganización y sesiones'],
    ['CENESIS', 'Estudios de Ingeniería de Sistemas'],
    ['Escuela de Policía Simón Bolívar', 'Dos charlas en Tuluá'],
    ['Red de SBG de Colombia', 'Student Community Day'],
  ];
  al.forEach(([a, r], i) => {
    const x = 0.6 + (i % 4) * 2.2, y = 1.5 + Math.floor(i / 4) * 1.45;
    tarjeta(s, x, y, 2.05, 1.3, `aliado-${i}`);
    s.addText([{ text: a, options: { bold: true, color: C.background1, fontSize: 13, breakLine: true } }, { text: r, options: { color: C.accent4, fontSize: 11 } }], { x: x + 0.15, y: y + 0.12, w: 1.75, h: 1.06, valign: 'top', margin: 0, isTextBox: true });
  });
  s.addText('Los nombres van en texto: no usamos logos de terceros sin permiso.', { x: 0.6, y: 4.5, w: 8.8, h: 0.3, fontSize: 10, color: C.accent4, margin: 0, isTextBox: true });
  s.addNotes(`Nada de esto fue en solitario. Trabajamos con el SBG de la UCEVA, Icesi, San Buenaventura, el AWS User Group Valle del Cauca, IEEE Computer Society, CENESIS, la Escuela de Policía de Tuluá y la red de SBG de Colombia.`);
}

// ------------------------------------------------------------------ 12. Watch Party
pres.addSection({ title: 'Lo que viene' });
{
  const s = contenido('Lo que viene', '# 4 de diciembre · Tuluá', 'AWS re:Invent Watch & Build Party');
  tarjeta(s, 0.6, 1.5, 5.4, 3.2, 'tarjeta-watch', '2B2418');
  s.addText([
    { text: 'Aprobada y avalada por AWS', options: { bold: true, color: C.accent2, fontSize: 13, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'Mientras re:Invent cierra en Las Vegas, Tuluá construye.', options: { fontFace: 'Arial', bold: true, fontSize: 20, color: C.background1, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'El 4 de diciembre es el último día de re:Invent. Nuestro líder estará allá con beca, y la comunidad seguirá los anuncios y construirá con ellos desde Tuluá.', options: { fontSize: 13, color: C.background2 } },
  ], { x: 0.85, y: 1.7, w: 4.9, h: 2.8, valign: 'top', margin: 0, isTextBox: true });
  s.addText('Lo que pedimos', { x: 6.3, y: 1.5, w: 3.1, h: 0.35, fontFace: 'Arial', bold: true, fontSize: 14, color: C.background1, margin: 0, isTextBox: true });
  s.addText([
    { text: 'AWS: contenido, créditos o swag para la jornada', options: { bullet: true, breakLine: true } },
    { text: 'Universidad: espacio y apoyo de la sede Tuluá', options: { bullet: true, breakLine: true } },
    { text: 'Aliados: mentores y refrigerios', options: { bullet: true, breakLine: true } },
    { text: 'Estudiantes: inscribirse en Meetup', options: { bullet: true } },
  ], { x: 6.3, y: 1.9, w: 3.1, h: 2.8, fontSize: 13, color: C.background2, paraSpaceAfter: 6, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes(`El 4 de diciembre hacemos la AWS re:Invent Watch & Build Party en Tuluá, aprobada y avalada por AWS. Es el último día de re:Invent: Juan estará en Las Vegas y la comunidad construirá con los anuncios desde Tuluá. Lugar, horario e inscripción se publicarán en Meetup. A cada audiencia le pedimos algo concreto.`);
}

// ------------------------------------------------------------------ 13. hackathon
{
  const s = contenido('Lo que viene', '# diciembre · fecha por confirmar', 'Nuestra primera hackathon de AWS');
  const cols = [
    ['Para estudiantes', 'Arma equipo y practica con los retos del grupo en GitHub.'],
    ['Para empresas', 'Propón un reto real, aporta mentores o jurados y apoya con premios en especie.'],
    ['Para la universidad', 'Espacio, difusión en todas las sedes y reconocimiento a los equipos.'],
    ['Para AWS', 'Créditos para los equipos, ponentes y vouchers como premio.'],
  ];
  cols.forEach(([t, d], i) => {
    const x = 0.6 + i * 2.2;
    tarjeta(s, x, 1.5, 2.05, 2.6, `hack-${i}`);
    s.addText([{ text: t, options: { bold: true, fontSize: 14, color: C.background1, breakLine: true } }, { text: d, options: { fontSize: 12, color: C.background2 } }], { x: x + 0.15, y: 1.65, w: 1.75, h: 2.3, valign: 'top', margin: 0, isTextBox: true, paraSpaceAfter: 4 });
  });
  s.addText('Formato, bases y sede se definirán con los aliados y se publicarán en Meetup.', { x: 0.6, y: 4.35, w: 8.8, h: 0.4, fontSize: 13, color: C.accent4, margin: 0, isTextBox: true });
  s.addNotes(`En diciembre, con fecha por confirmar, viene nuestra primera hackathon de AWS. Formato, bases y sede todavía están abiertos, y nos gustaría definirlos con los aliados. Aquí está lo que cada audiencia puede aportar.`);
}

// ------------------------------------------------------------------ 14. cierre
{
  const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: 'Lo que viene' });
  s.addText([{ text: '¿Construimos', options: { breakLine: true } }, { text: 'el segundo año juntos?', options: { color: C.accent2 } }], { placeholder: 'title' });
  s.addText(`Únete en Meetup: AWS SBG at University of the Valle · ${URL.correo} · awsunivalle.dev/recap`, { placeholder: 'body' });
  s.addText('Fuentes: Meetup, Agencia de Noticias Univalle, Sessionize, awsstudentcommunity.day y dondeaprendoaws.com, consultadas el 3 nov 2026. La metodología está en recap/investigacion/FUENTES.md.', { x: 0.6, y: 4.8, w: 8.8, h: 0.45, fontSize: 9, color: C.accent4, margin: 0, isTextBox: true });
  s.addNotes(`Gracias. Si quieren sumarse, el punto de partida es Meetup. Para alianzas, el correo del grupo. El recap completo, con metodología y fuentes, está en awsunivalle.dev/recap.`);
}

// ------------------------------------------------------------------ salida
const dir = path.join(ENTREGABLES, 'presentacion');
mkdirSync(dir, { recursive: true });
const archivo = path.join(dir, 'recap-aws-sbg-univalle.pptx');
await pres.writeFile({ fileName: archivo });
await aplicarTema(archivo, THEME);
console.log('✓', archivo);
