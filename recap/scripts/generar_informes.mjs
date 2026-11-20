// Genera entregables/informes/informe-ejecutivo.docx e informe-completo.docx.
// Uso: node recap/scripts/generar_informes.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { M, D, EVENTOS, n, fecha, fechaCorta, mesCorto, limpiar, URL, AVISO_RSVP, REPO, ENTREGABLES } from './lib/datos.mjs';

const require = createRequire(import.meta.url);
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, LevelFormat, ImageRun, Footer, PageNumber, BorderStyle, ExternalHyperlink, PageBreak,
} = require('docx');
const { chromium } = createRequire(path.join(REPO, 'package.json'))('@playwright/test');

const COLOR = { ink: '14171D', text: '3D4452', muted: '6B7280', violet: '6D28D9', orange: 'B25F00', soft: 'F4F2FB', line: 'E5E7EB' };
const LOGO = readFileSync(path.join(ENTREGABLES, '_assets', 'logo-sbg.png'));
const ANCHO = 9026; // A4 con márgenes de 1440 DXA

// ------------------------------------------------------------------ helpers
const t = (text, o = {}) => new TextRun({ text, ...o });
const p = (runs, o = {}) => new Paragraph({ children: (Array.isArray(runs) ? runs : [runs]).map((r) => (typeof r === 'string' ? t(r) : r)), spacing: { after: 120, line: 300 }, ...o });
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t(text)] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] });
const bullet = (runs) => new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, children: (Array.isArray(runs) ? runs : [runs]).map((r) => (typeof r === 'string' ? t(r) : r)), spacing: { after: 80, line: 290 } });
const nota = (text) => p([t(text, { size: 17, color: COLOR.muted, italics: true })]);
const link = (text, url) => new ExternalHyperlink({ link: url, children: [t(text, { style: 'Hyperlink' })] });
const borde = { style: BorderStyle.SINGLE, size: 4, color: COLOR.line };
const sinBorde = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

function tabla(cabecera, filas, anchos, { resaltar = () => false, alinear = [] } = {}) {
  const celda = (txt, i, head, hi) =>
    new TableCell({
      width: { size: anchos[i], type: WidthType.DXA },
      shading: head ? { type: ShadingType.CLEAR, color: 'auto', fill: COLOR.soft } : hi ? { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF4E5' } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      borders: { top: borde, bottom: borde, left: sinBorde, right: sinBorde },
      children: [new Paragraph({ alignment: alinear[i] === 'r' ? AlignmentType.RIGHT : AlignmentType.LEFT, children: [t(String(txt), { size: head ? 17 : 18, bold: head || hi, color: head ? COLOR.muted : COLOR.ink })] })],
    });
  return new Table({
    width: { size: anchos.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: anchos,
    rows: [
      new TableRow({ tableHeader: true, children: cabecera.map((c, i) => celda(c, i, true, false)) }),
      ...filas.map((f, j) => new TableRow({ cantSplit: true, children: f.map((c, i) => celda(c, i, false, resaltar(j))) })),
    ],
  });
}

function cifras(items) {
  const w = Math.floor(ANCHO / items.length);
  return new Table({
    width: { size: w * items.length, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    rows: [new TableRow({
      children: items.map(([v, l, s]) => new TableCell({
        width: { size: w, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: COLOR.soft },
        margins: { top: 140, bottom: 140, left: 140, right: 100 },
        borders: { top: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' }, bottom: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' }, left: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' }, right: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' } },
        children: [
          new Paragraph({ children: [t(String(v), { font: 'Arial', bold: true, size: 34, color: COLOR.ink })] }),
          new Paragraph({ spacing: { before: 40 }, children: [t(l, { bold: true, size: 17, color: COLOR.ink })] }),
          ...(s ? [new Paragraph({ children: [t(s, { size: 15, color: COLOR.muted })] })] : []),
        ],
      })),
    })],
  });
}

const imagen = (buf, w, h) => new Paragraph({ spacing: { before: 120, after: 120 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: w, height: h }, altText: { title: 'Gráfica', description: 'Gráfica del recap', name: 'grafica' } })] });

function documento(titulo, subtitulo, children) {
  return new Document({
    creator: 'AWS Student Builder Group Universidad del Valle',
    title: titulo,
    description: subtitulo,
    styles: {
      default: { document: { run: { font: 'Calibri', size: 21, color: COLOR.text } } },
      paragraphStyles: [
        { id: 'Title', name: 'Title', basedOn: 'Normal', run: { font: 'Arial', size: 44, bold: true, color: COLOR.ink }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Arial', size: 30, bold: true, color: COLOR.ink }, paragraph: { spacing: { before: 320, after: 140 }, keepNext: true, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Arial', size: 23, bold: true, color: COLOR.violet }, paragraph: { spacing: { before: 220, after: 100 }, keepNext: true, outlineLevel: 1 } },
      ],
    },
    numbering: { config: [{ reference: 'vinetas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 240 } } } }] }, { reference: 'logros', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] }] },
    sections: [{
      properties: { page: { margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [t(`AWS SBG Univalle · ${titulo} · `, { size: 15, color: COLOR.muted }), new TextRun({ children: [PageNumber.CURRENT], size: 15, color: COLOR.muted })] })] }) },
      children: [
        new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO, transformation: { width: 44, height: 44 }, altText: { title: 'Logo', description: 'Logo del AWS SBG Univalle', name: 'logo' } }), t('   AWS Student Builder Group · Universidad del Valle', { size: 17, color: COLOR.muted })], spacing: { after: 200 } }),
        new Paragraph({ heading: HeadingLevel.TITLE, children: [t(titulo)] }),
        p([t(subtitulo, { size: 22, color: COLOR.orange, bold: true })], { spacing: { after: 240 } }),
        ...children,
      ],
    }],
  });
}

// ------------------------------------------------------------------ gráficas
async function graficas() {
  const meses = M.eventos.por_mes.filter((m) => m.mes >= '2026-02' && m.mes <= '2026-10');
  const max = 12, W = 900, H = 360, L = 40, B = 40, T = 30;
  const cw = (W - L) / meses.length, bw = 46;
  const y = (v) => H - B - (v / max) * (H - B - T);
  const barras = meses.map((m, i) => {
    const cx = L + cw * i + cw / 2, x = cx - bw / 2;
    const yv = y(m.virtuales), yp = y(m.eventos);
    return `${m.virtuales ? `<rect x="${x}" y="${yv}" width="${bw}" height="${y(0) - yv}" fill="#7c3aed" rx="3"/>` : ''}${m.presenciales ? `<rect x="${x}" y="${yp}" width="${bw}" height="${yv - yp - 2}" fill="#e07b00" rx="3"/>` : ''}${m.eventos ? `<text x="${cx}" y="${yp - 8}" text-anchor="middle" font-size="17" font-weight="700" fill="#14171d">${m.eventos}</text>` : ''}<text x="${cx}" y="${H - 14}" text-anchor="middle" font-size="15" fill="#6b7280">${mesCorto(m.mes)}</text>`;
  }).join('');
  const grid = [0, 4, 8, 12].map((v) => `<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="#e5e7eb"/><text x="${L - 10}" y="${y(v) + 5}" text-anchor="end" font-size="14" fill="#6b7280">${v}</text>`).join('');
  const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + 40}" font-family="Arial">${grid}${barras}<rect x="${L}" y="${H + 12}" width="14" height="14" fill="#7c3aed" rx="2"/><text x="${L + 22}" y="${H + 24}" font-size="15" fill="#3d4452">Virtual</text><rect x="${L + 110}" y="${H + 12}" width="14" height="14" fill="#e07b00" rx="2"/><text x="${L + 132}" y="${H + 24}" font-size="15" fill="#3d4452">Presencial</text></svg>`;

  const temas = Object.entries(M.eventos.por_tema).sort((a, b) => b[1].confirmaciones - a[1].confirmaciones);
  const maxT = temas[0][1].confirmaciones;
  const filas = temas.map(([k, d], i) => `<text x="0" y="${i * 38 + 22}" font-size="16" fill="#14171d">${k}</text><rect x="260" y="${i * 38 + 8}" width="${(d.confirmaciones / maxT) * 520}" height="20" rx="4" fill="#7c3aed"/><text x="${270 + (d.confirmaciones / maxT) * 520}" y="${i * 38 + 23}" font-size="15" font-weight="700" fill="#14171d">${n(d.confirmaciones)} · ${d.eventos} ev.</text>`).join('');
  const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${temas.length * 38 + 10}" font-family="Arial">${filas}</svg>`;

  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 2 });
  const render = async (svg, w, h) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<html><body style="margin:0;background:#fff">${svg}</body></html>`);
    return page.screenshot({ clip: { x: 0, y: 0, width: w, height: h } });
  };
  const g1 = await render(svg1, W, H + 40);
  const g2 = await render(svg2, 900, temas.length * 38 + 10);
  await b.close();
  return { g1, g2, h2: temas.length * 38 + 10 };
}

// ------------------------------------------------------------------ contenido común
const LOGROS = [
  [`${D.eventos} eventos en 8 meses`, `desde el lanzamiento, ${n(D.porSemana, 2)} por semana: ${D.presenciales} presenciales y ${D.virtuales} virtuales.`, 'Meetup'],
  [`${n(D.miembros)} miembros en Meetup`, `${D.cmp.puesto_univalle_miembros}.º entre ${D.cmp.grupos.length} SBG de Colombia, y el único de los cinco primeros fuera de Bogotá y Medellín.`, 'Meetup y dondeaprendoaws.com'],
  [`${n(D.calificacion, 2)}/5 con ${D.valoraciones} valoraciones`, `el mayor número de valoraciones entre los ${D.cmp.grupos.length} grupos comparados.`, 'Meetup'],
  ['Beca All Builders Welcome para AWS re:Invent 2026', 'para el líder del grupo, Juan Manuel Hoyos Contreras.', 'Agencia de Noticias Univalle'],
  [`Reto Cloud Practitioner de ${D.reto.sesiones} sesiones con la UCEVA`, `con cupos llenos y ${n(D.reto.confirmaciones_promedio, 1)} confirmaciones de media por sesión.`, 'Meetup'],
  ['Más de 20 vouchers de certificación', 'entregados a estudiantes de Tuluá, Yumbo y otras sedes.', 'Dato del equipo'],
  [`Tuluá como centro de lo presencial`, `${D.tulua} de los ${D.presenciales} eventos presenciales.`, 'Meetup'],
  ['Ponentes invitados por AWS en el AWS Summit Bogotá 2026', 'con AWS Builder Spotlight según Sessionize.', 'Dato del equipo y Sessionize'],
  ['AWS Cloud Quest Valle del Cauca', 'con cuatro universidades y 156 confirmaciones, el récord del grupo; muchos ganadores de Univalle según el líder.', 'Meetup y dato del equipo'],
  ['Primer SBG del Valle del Cauca', 'creado el 17-nov-2025, antes que UCEVA (may 2026) e Icesi (sep 2026).', 'Meetup y dondeaprendoaws.com'],
];
const logroP = ([a, b, f]) => new Paragraph({ numbering: { reference: 'logros', level: 0 }, spacing: { after: 80, line: 290 }, children: [t(a, { bold: true, color: COLOR.ink }), t(` ${b} `), t(`(${f})`, { size: 17, color: COLOR.muted })] });

// ------------------------------------------------------------------ informe ejecutivo
function ejecutivo() {
  return documento('Informe ejecutivo', `Recap 2025–2026 · corte al ${D.corteTexto}`, [
    p([t('De Cali a Tuluá, y de Tuluá a Las Vegas. ', { bold: true, color: COLOR.ink }), t(`El AWS Student Builder Group de la Universidad del Valle recibió el aval de AWS en noviembre de 2025 y es el primer SBG del Valle del Cauca. En los 248 días desde su lanzamiento (28-feb-2026) publicó ${D.eventos} eventos, con un promedio de uno por semana. Llevó la mayor parte de su actividad presencial a la sede de Tuluá y corrió un reto de certificación con cupos llenos. El año cierra con su líder en AWS re:Invent con beca y con dos eventos en diciembre.`)]),
    cifras([[n(D.miembros), 'miembros', 'Meetup'], [D.eventos, 'eventos', `${D.presenciales} pres. · ${D.virtuales} virt.`], [n(D.confirmaciones), 'confirmaciones', 'RSVP, no asistencia'], [n(D.calificacion, 2), 'calificación', `${D.valoraciones} valoraciones`]]),
    nota(`${AVISO_RSVP} La Agencia de Noticias Univalle reporta además ${D.impactados} estudiantes impactados en todas las sedes (15-oct-2026).`),
    h2('Cinco logros que importan'),
    ...[LOGROS[3], LOGROS[1], LOGROS[4], LOGROS[6], LOGROS[5]].map(logroP),
    h2('Lo que viene en diciembre'),
    bullet([t('4 de diciembre, Tuluá · AWS re:Invent Watch & Build Party. ', { bold: true, color: COLOR.ink }), t('Aprobada y avalada por AWS. Coincide con el último día de re:Invent, cuando el líder estará en Las Vegas.')]),
    bullet([t('Diciembre, fecha por confirmar · Hackathon de AWS. ', { bold: true, color: COLOR.ink }), t('Sería la primera del grupo. Formato y bases en definición.')]),
    h2('Lo que pedimos'),
    bullet([t('A AWS: ', { bold: true, color: COLOR.ink }), t('créditos, vouchers y ponentes para la hackathon, y visibilidad del caso de Tuluá en la red de SBG.')]),
    bullet([t('A la Universidad: ', { bold: true, color: COLOR.ink }), t('espacios y logística en Tuluá, difusión en todas las sedes y reconocimiento institucional al grupo.')]),
    bullet([t('A los aliados: ', { bold: true, color: COLOR.ink }), t('mentores, jurados, retos reales y premios en especie. Sin tarifas fijas: cada alianza se conversa.')]),
    h2('El año en hitos'),
    tabla(['Fecha', 'Hito'], [
      ['Nov 2025', 'AWS da el aval: nace el primer SBG del Valle del Cauca'],
      ['28-feb-2026', 'Lanzamiento oficial "Tu Primer Paso en la Nube" (96 confirmaciones)'],
      ['11-may-2026', 'Primer evento presencial en Tuluá'],
      ['26-jun-2026', 'Coorganización del AWS Student Community Day Colombia (Bogotá)'],
      ['29/30-jul-2026', 'Ponentes invitados por AWS en el AWS Summit Bogotá'],
      ['19-sep → 29-oct', 'Reto Cloud Practitioner de 8 sesiones con la UCEVA, en Tuluá'],
      ['14-oct-2026', 'AWS Cloud Quest Valle del Cauca con 4 universidades (156 confirmaciones)'],
      ['15-oct-2026', 'La Universidad publica la beca del líder para AWS re:Invent'],
    ], [1900, 7126]),
    h2('Canales al corte'),
    tabla(['Canal', 'Cifra', 'Nota'], [
      ['Meetup', `${n(D.miembros)} miembros`, `${D.eventos} eventos, ${n(D.calificacion, 2)}/5`],
      ['LinkedIn', `${n(D.linkedin)} seguidores`, 'Página del grupo'],
      ['YouTube', `${D.youtube} suscriptores`, '7 charlas publicadas'],
      ['GitHub', `${D.repos} repos públicos`, 'Retos de práctica y el sitio'],
      ['Instagram y TikTok', 'Pendiente', 'Exigen sesión; pendiente de exportación'],
    ], [2200, 2400, 4426]),
    h2('Contexto justo'),
    p(`Entre ${D.cmp.grupos.length} SBG de Colombia revisados el ${fechaCorta(D.corte)} en Meetup, Univalle es ${D.cmp.puesto_univalle_miembros}.º en miembros (después de la U. Distrital, con 2.951), ${D.cmp.puesto_univalle_eventos}.º en eventos (después de EAN, con 37) y ${D.cmp.puesto_univalle_valoraciones}.º en valoraciones. Los grupos tienen edades distintas, así que no afirmamos ser "el más grande" ni "el más activo".`),
    nota(`Fuentes: Meetup (${URL.meetup}), Agencia de Noticias Univalle, Sessionize, awsstudentcommunity.day y dondeaprendoaws.com, consultadas el ${D.corteTexto}. Lo marcado como "dato del equipo" lo confirma el líder del grupo. Detalle completo en el informe completo y en awsunivalle.dev/recap.`),
  ]);
}

// ------------------------------------------------------------------ informe completo
function completo(g) {
  const ev = M.eventos;
  const meses = ev.por_mes.filter((m) => m.mes <= '2026-11');
  const sedes = Object.entries(ev.por_sede).sort((a, b) => b[1].eventos - a[1].eventos);
  const temas = Object.entries(ev.por_tema).sort((a, b) => b[1].confirmaciones - a[1].confirmaciones);
  const yo = (g2) => g2.url.includes('university-of-the-valle');
  const cmpFilas = D.cmp.grupos.map((x) => [x.nombre.replace('AWS SBG at ', ''), x.ciudad, x.creado, n(x.miembros), x.eventos_pasados, x.calificacion ? n(x.calificacion, 2) : '—', x.valoraciones]);

  return documento('Informe completo', `Recap 2025–2026 · metodología, resultados y fuentes · corte al ${D.corteTexto}`, [
    h1('1. Resumen'),
    p(`Este informe documenta el primer año del AWS Student Builder Group de la Universidad del Valle (AWS SBG Univalle), desde el aval de AWS en noviembre de 2025 hasta el ${D.corteTexto}. Reúne las cifras públicas verificables, explica cómo se calcularon y separa con claridad los datos públicos de los que confirma el equipo.`),
    cifras([[n(D.miembros), 'miembros en Meetup'], [D.eventos, 'eventos publicados'], [n(D.confirmaciones), 'confirmaciones'], [n(D.calificacion, 2), `calificación (${D.valoraciones})`]]),
    p([t('Hallazgo central: ', { bold: true, color: COLOR.ink }), t(`el grupo nació en Cali, pero ${D.tulua} de sus ${D.presenciales} eventos presenciales se hicieron en Tuluá. Su ritmo se aceleró en el segundo semestre (${D.sepOct} de ${D.eventos} eventos en septiembre y octubre), y su trabajo tiene reconocimiento externo: beca para AWS re:Invent, ponencia en el AWS Summit Bogotá y la coorganización del Student Community Day Colombia.`)]),

    h1('2. Contexto'),
    p('Los AWS Student Builder Groups, antes llamados AWS Cloud Clubs, son comunidades universitarias lideradas por estudiantes con apoyo de AWS. Sus líderes reciben créditos, vouchers de certificación y contacto directo con AWS. Por ese cambio de nombre, el grupo aparece en algunos canales como "AWS Cloud Club at Universidad del Valle" (GitHub, TikTok, YouTube y el evento de lanzamiento).'),
    p('El grupo recibió el aval de AWS en noviembre de 2025 (dato del líder) y se creó en Meetup el 17 de noviembre de 2025. Según la Agencia de Noticias Univalle, lo cofundó Juan Manuel Hoyos Contreras, estudiante de décimo semestre de Ingeniería de Sistemas y líder del grupo. El lanzamiento oficial, "Tu Primer Paso en la Nube", fue el sábado 28 de febrero de 2026.'),

    h1('3. Metodología'),
    h2('Fuentes y fecha de corte'),
    p(`Todas las fuentes web se consultaron el ${D.corteTexto}. La fuente principal son las páginas públicas de Meetup: la del grupo y las de cada uno de los 36 eventos, de las que se leyeron los datos estructurados que publica la página. Se contrastaron con la API pública del sitio awsunivalle.dev, que sincroniza los eventos desde Meetup y devolvió los mismos 36. Para prensa y reconocimientos se usaron la Agencia de Noticias Univalle, Sessionize y el sitio del AWS Student Community Day Colombia. Para la comparación se usaron las páginas de Meetup de los 14 SBG de Colombia listados en dondeaprendoaws.com.`),
    h2('Niveles de verificación'),
    bullet([t('Fuente oficial: ', { bold: true }), t('canal propio del grupo, de AWS, de la universidad o del evento.')]),
    bullet([t('Fuente pública: ', { bold: true }), t('tercero o perfil autodeclarado (por ejemplo, Sessionize).')]),
    bullet([t('Confirmado por el líder: ', { bold: true }), t('dato del equipo sin fuente pública al corte. Se marca así en todos los entregables.')]),
    bullet([t('Sin verificar: ', { bold: true }), t('no se presenta como hecho.')]),
    h2('Cálculos'),
    p(`Los promedios se calcularon con código (recap/scripts/construir_datos.py) y quedaron en recap/metricas.json, la única fuente de cifras de todos los entregables. Se usan dos periodos: desde la creación del grupo (17-nov-2025, ${D.diasAval} días) y desde el lanzamiento (28-feb-2026, ${D.diasLanz} días). Un mes equivale a 30,44 días.`),
    h2('Limitaciones'),
    bullet('Las confirmaciones de Meetup son respuestas "Asistiré", no asistencia real. Varios eventos presenciales se inscribieron por formulario externo, así que Meetup los subestima.'),
    bullet('Las páginas de eventos pasados, feedback y fotos de Meetup exigen inicio de sesión; no se intentó saltar esa restricción. Tampoco se pudieron leer Instagram, TikTok, X ni los perfiles personales de LinkedIn.'),
    bullet('No hay un histórico público de miembros, así que no se puede graficar su crecimiento.'),
    bullet('La comparación entre grupos usa cifras acumuladas de grupos con edades distintas.'),

    h1('4. Línea de tiempo'),
    tabla(['Fecha', 'Hito', 'Nivel'], [
      ['Nov 2025', 'Aval de AWS para crear el grupo', 'Líder'],
      ['17-nov-2025', 'Creación del grupo en Meetup', 'Oficial'],
      ['1-feb-2026', 'Organización en GitHub', 'Oficial'],
      ['28-feb-2026', 'Lanzamiento oficial (96 confirmaciones)', 'Oficial'],
      ['16-mar-2026', 'Charla con Carlos Zambrano, AWS Hero (93)', 'Oficial'],
      ['11-may-2026', 'Primer evento presencial en Tuluá', 'Oficial'],
      ['12-jun-2026', 'Primer evento en la sede Meléndez', 'Oficial'],
      ['26-jun-2026', 'AWS Student Community Day Colombia (Bogotá)', 'Oficial'],
      ['25-jul-2026', 'Evento con AWS User Group Valle, CENESIS e IEEE CS (89)', 'Oficial'],
      ['29/30-jul-2026', 'AWS Summit Bogotá: ponentes invitados por AWS', 'Líder / pública'],
      ['3-sep-2026', 'Dos charlas en la Escuela de Policía de Tuluá', 'Oficial'],
      ['19-sep → 29-oct', 'Reto Cloud Practitioner (8 sesiones, con UCEVA)', 'Oficial'],
      ['14-oct-2026', 'AWS Cloud Quest Valle del Cauca (156)', 'Oficial'],
      ['15-oct-2026', 'Nota de la Universidad sobre la beca para re:Invent', 'Oficial'],
      ['4-dic-2026', 'AWS re:Invent Watch & Build Party en Tuluá', 'Líder'],
      ['Dic 2026', 'Hackathon de AWS (fecha por confirmar)', 'Líder'],
    ], [1900, 5826, 1300]),

    h1('5. Actividad'),
    h2('Ritmo'),
    p(`Desde el lanzamiento el grupo publicó ${n(D.porMesLanz, 2)} eventos al mes (${n(D.porSemana, 2)} por semana). Desde la creación, ${n(D.porMesAval, 2)} al mes. De febrero a julio hubo 16 eventos; en septiembre y octubre, 20. Agosto no tuvo eventos publicados.`),
    imagen(g.g1, 600, 266),
    nota('Eventos por mes y modalidad, febrero a octubre de 2026. Fuente: Meetup.'),
    tabla(['Mes', 'Virtuales', 'Presenciales', 'Total', 'Confirmaciones'], meses.map((m) => [mesCorto(m.mes), m.virtuales, m.presenciales, m.eventos, n(m.confirmaciones)]), [2226, 1700, 1700, 1500, 1900], { alinear: ['l', 'r', 'r', 'r', 'r'] }),
    h2('Modalidad y sedes'),
    p(`Virtual: ${D.virtuales} eventos con ${n(D.promVirtual, 1)} confirmaciones de media. Presencial: ${D.presenciales} eventos con ${n(D.promPresencial, 1)} de media, cifra subestimada. La mediana general es ${n(D.mediana)}.`),
    tabla(['Sede', 'Eventos', 'Confirmaciones'], sedes.map(([k, v]) => [k, v.eventos, n(v.confirmaciones)]), [5026, 1800, 2200], { alinear: ['l', 'r', 'r'] }),
    h2('Temas'),
    imagen(g.g2, 600, Math.round((g.h2 / 900) * 600)),
    nota('Confirmaciones por tema (clasificación editorial del equipo de investigación). Fuente: Meetup.'),
    p('Las charlas de carrera profesional son las que más convocan en virtual (481 confirmaciones en 5 charlas). IA y datos es el tema más frecuente fuera del reto. Serverless figura con pocas confirmaciones porque sus cuatro eventos fueron presenciales con inscripción externa.'),

    h1('6. Reto AWS Certified Cloud Practitioner'),
    p(`Ocho sesiones presenciales en la sede Villa Campestre de Tuluá, organizadas con el AWS SBG de la UCEVA, del 19 de septiembre al 29 de octubre de 2026. Meetup las marca con cupos llenos y cerradas a participantes inscritos. Las confirmaciones por sesión fueron ${D.reto.confirmaciones_por_sesion.join(', ')}, con una media de ${n(D.reto.confirmaciones_promedio, 1)}. La sexta sesión igualó a la primera con 40.`),
    p('Según el líder, el grupo entregó más de 20 vouchers de certificación a estudiantes de Tuluá, Yumbo y otras sedes, y las sesiones 1 y 2 se enfocaron en cómputo. Meetup titula la sesión 1 "Introduction to the Cloud" y la 2 "Compute in AWS".'),

    h1('7. Ponentes y alianzas'),
    p(`Ponentes invitados que figuran en las publicaciones: ${ev.ponentes_invitados_publicos.join('; ')}.`),
    tabla(['Aliado', 'Qué se hizo'], [
      ['AWS SBG UCEVA', 'Reto Cloud Practitioner y Cloud Quest'],
      ['Universidad Icesi', 'Contenedores 101 y Cloud Quest'],
      ['Universidad de San Buenaventura', 'Cloud Quest Valle del Cauca'],
      ['AWS User Group Valle del Cauca, CENESIS, IEEE Computer Society', '"Construye Rápido... Despliega seguro!"'],
      ['Escuela de Policía Simón Bolívar', 'Dos charlas en Tuluá'],
      ['Red de SBG de Colombia', 'AWS Student Community Day Colombia 2026'],
    ], [4513, 4513]),

    h1('8. Reconocimientos'),
    bullet([t('Beca All Builders Welcome para AWS re:Invent 2026 ', { bold: true }), t('(Las Vegas, 30 nov – 4 dic). Cubre transporte, hospedaje, alimentación e ingreso. Fuente: '), link('Agencia de Noticias Univalle', URL.univalle), t(', 15-oct-2026.')]),
    bullet([t('AWS Summit Bogotá 2026: ', { bold: true }), t('ponentes invitados por AWS (dato del líder). Según su '), link('perfil de ponente', URL.sessionize), t(', Juan Manuel Hoyos fue seleccionado para el AWS Builder Spotlight. La página oficial del Summit no lo menciona.')]),
    bullet([t('AWS Student Community Day Colombia 2026: ', { bold: true }), t('Juan Hoyos figura entre los líderes organizadores y Universidad del Valle como SBG participante ('), link('awsstudentcommunity.day', URL.communityDay), t(').')]),
    bullet([t('Primer SBG del Valle del Cauca ', { bold: true }), t('dentro de los grupos listados en dondeaprendoaws.com.')]),
    bullet([t('Otros hitos confirmados por el líder: ', { bold: true }), t('participación virtual en el AWS Community Day Perú, sesiones para la comunidad de IEEE y muchos ganadores de Univalle en Cloud Quest.')]),

    h1('9. Comparación con SBG de Colombia'),
    p(`Universo: ${D.cmp.grupos.length} SBG de Colombia listados en dondeaprendoaws.com con página en Meetup, consultados el mismo día (${fechaCorta(D.corte)}).`),
    tabla(['Grupo', 'Ciudad', 'Creado', 'Miembros', 'Eventos', 'Calif.', 'Valor.'], cmpFilas, [2826, 1000, 1150, 1050, 950, 900, 1150], { resaltar: (j) => yo(D.cmp.grupos[j]), alinear: ['l', 'l', 'l', 'r', 'r', 'r', 'r'] }),
    p(`Univalle es ${D.cmp.puesto_univalle_miembros}.º en miembros, ${D.cmp.puesto_univalle_eventos}.º en eventos y ${D.cmp.puesto_univalle_valoraciones}.º en valoraciones. Las cifras son acumuladas y los grupos se crearon en fechas distintas. Por eso este informe no afirma que el grupo sea el más grande ni el más activo de Colombia.`),

    h1('10. Los 10 logros más fuertes'),
    ...LOGROS.map(logroP),

    h1('11. Lo que viene'),
    h2('AWS re:Invent Watch & Build Party · 4 de diciembre · Tuluá'),
    p('Aprobada y avalada por AWS (dato del líder). Coincide con el último día de re:Invent, cuando el líder estará en Las Vegas con beca: la comunidad sigue los anuncios y construye con ellos desde Tuluá. Lugar, horario e inscripción se publicarán en Meetup.'),
    h2('Hackathon de AWS · diciembre · fecha por confirmar'),
    p('Sería la primera del grupo. Formato, bases y sede están por definir, y la idea es construirlos con los aliados.'),
    h2('Recomendaciones'),
    bullet('Registrar la asistencia real en cada evento presencial, para reportar más que confirmaciones.'),
    bullet('Publicar en Meetup la Watch Party y la hackathon cuanto antes, con cupos y enlace de inscripción.'),
    bullet('Actualizar las cifras del sitio (922 miembros y 27 eventos) con las de metricas.json.'),
    bullet('Documentar con fuente pública los hitos que hoy solo confirma el líder: vouchers, Summit, Community Day Perú, IEEE y ganadores de Cloud Quest.'),
    bullet('Conseguir autorización de uso de las fotos de los eventos.'),

    h1('12. Conflictos entre fuentes'),
    bullet('Sitio web: 922 miembros y 27 eventos; Meetup: 1.408 y 36. Se usa Meetup porque es la fuente más reciente.'),
    bullet('Sesiones 5, 7 y 8 del reto: la descripción y la fecha de la página no coinciden. Se usa la fecha de la página, que sigue el ritmo semanal de los jueves.'),
    bullet('Calificación de 4,9 (redondeo) frente a 4,86 (exacto); ambas son correctas.'),
    bullet('Hay nombres y URL antiguos (Cloud Club, aws-sbg-at-universidad-del-valle-colombia, aws-cloud-club-universidad-del-valle, @awscloudclub.univalle). Se usan los actuales.'),
    nota('Detalle completo en recap/investigacion/CONFLICTOS.md.'),

    h1('13. Fuentes'),
    ...[
      ['Meetup del grupo', URL.meetup],
      ['Agencia de Noticias Univalle, 15-oct-2026', URL.univalle],
      ['Sessionize de Juan Manuel Hoyos', URL.sessionize],
      ['AWS Student Community Day Colombia', URL.communityDay],
      ['Directorio de SBG (dondeaprendoaws.com)', URL.directorio],
      ['AWS Student Builder Groups', 'https://builder.aws.com/community/student-builder-groups'],
      ['Student Rewards en Builder Center', 'https://builder.aws.com/content/3I1qkUtKhwU6K1VaGkfYRwtbz3o/introducing-student-rewards-on-aws-builder-center'],
      ['AWS Summit Bogotá', 'https://aws.amazon.com/es/events/summits/bogota'],
      ['LinkedIn del grupo', URL.linkedin],
      ['Sitio del grupo', URL.sitio],
    ].map(([a, u]) => bullet([t(`${a}: `), link(u, u)])),
    nota(`Consultadas el ${D.corteTexto}. Lista completa con nivel de verificación en recap/investigacion/FUENTES.md.`),

    new Paragraph({ children: [new PageBreak()] }),
    h1('Anexo. Los 36 eventos'),
    tabla(['Fecha', 'Evento', 'Modalidad', 'Sede', 'Conf.'], EVENTOS.map((e) => [e.fecha, limpiar(e.titulo), e.modalidad, e.sede.replace('Univalle ', ''), e.confirmaciones_meetup]), [1150, 4026, 1100, 2000, 750], { alinear: ['l', 'l', 'l', 'l', 'r'] }),
    nota(AVISO_RSVP),
  ]);
}

// ------------------------------------------------------------------ salida
const dir = path.join(ENTREGABLES, 'informes');
mkdirSync(dir, { recursive: true });
const g = await graficas();
for (const [nombre, doc] of [['informe-ejecutivo', ejecutivo()], ['informe-completo', completo(g)]]) {
  const f = path.join(dir, `${nombre}.docx`);
  writeFileSync(f, await Packer.toBuffer(doc));
  console.log('✓', path.relative(REPO, f));
}
