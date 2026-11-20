// Genera con Playwright (HTML → PNG/PDF):
//   public/og/recap.png                          imagen para compartir 1200×630
//   entregables/redes/carrusel-0N.png            carrusel de Instagram 1080×1350
//   entregables/redes/historia.png               historia 1080×1920
//   entregables/dossier/dossier-patrocinadores.pdf
//
// Uso: node recap/scripts/generar_visuales.mjs
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { M, D, n, fechaCorta, URL, AVISO_RSVP, REPO, ENTREGABLES } from './lib/datos.mjs';

const require = createRequire(path.join(REPO, 'package.json'));
const { chromium } = require('@playwright/test');

const fuente = (pkg, file) =>
  'data:font/woff2;base64,' + readFileSync(path.join(REPO, 'node_modules', '@fontsource', pkg, 'files', file)).toString('base64');
const LOGO = 'data:image/png;base64,' + readFileSync(path.join(ENTREGABLES, '_assets', 'logo-sbg.png')).toString('base64');

const BASE_CSS = `
@font-face { font-family: 'Space Mono'; font-weight: 400; src: url(${fuente('space-mono', 'space-mono-latin-400-normal.woff2')}); }
@font-face { font-family: 'Space Mono'; font-weight: 700; src: url(${fuente('space-mono', 'space-mono-latin-700-normal.woff2')}); }
@font-face { font-family: 'Nunito Sans'; font-weight: 400; src: url(${fuente('nunito-sans', 'nunito-sans-latin-400-normal.woff2')}); }
@font-face { font-family: 'Nunito Sans'; font-weight: 700; src: url(${fuente('nunito-sans', 'nunito-sans-latin-700-normal.woff2')}); }
@font-face { font-family: 'Nunito Sans'; font-weight: 800; src: url(${fuente('nunito-sans', 'nunito-sans-latin-800-normal.woff2')}); }
@font-face { font-family: 'Nunito Sans'; font-weight: 900; src: url(${fuente('nunito-sans', 'nunito-sans-latin-900-normal.woff2')}); }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --bg:#14171d; --surface:#21252e; --elev:#2a2f3a; --text:#e5e7eb; --muted:#a3aab6; --subtle:#8b929e; --violet:#8b5cf6; --violet-l:#a78bfa; --orange:#ff9900; --orange-d:#cf7700; }
body { font-family: 'Nunito Sans', sans-serif; color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; }
.mono { font-family: 'Space Mono', monospace; }
h1, h2, h3 { font-family: 'Space Mono', monospace; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.grad { background: linear-gradient(90deg, var(--violet-l), var(--orange)); -webkit-background-clip: text; background-clip: text; color: transparent; }
`;

// ---------------------------------------------------------------- redes
const lienzo = (w, h, cuerpo, extra = '') => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${BASE_CSS}
.slide { position: relative; width: ${w}px; height: ${h}px; overflow: hidden; padding: 88px 84px; display: flex; flex-direction: column; background: var(--bg); }
.slide::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 45% at 10% 0%, rgba(139,92,246,.30), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255,153,0,.20), transparent 60%); }
.slide::after { content: ''; position: absolute; inset: 0; opacity: .05; background-image: radial-gradient(circle, #fff 1.5px, transparent 1.5px); background-size: 44px 44px; }
.slide > * { position: relative; z-index: 1; }
.top { display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 18px; font-family: 'Space Mono'; font-size: 26px; color: var(--muted); }
.brand img { width: 64px; height: 64px; border-radius: 14px; }
.pag { font-family: 'Space Mono'; font-size: 24px; color: var(--subtle); }
.tag { font-family: 'Space Mono'; font-size: 28px; color: var(--orange); letter-spacing: .04em; }
.big { font-size: 96px; line-height: 1.02; }
.mid { font-size: 66px; line-height: 1.08; }
.lead { font-size: 38px; line-height: 1.45; color: var(--muted); }
.lead b { color: #fff; }
.foot { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; font-size: 22px; color: var(--subtle); line-height: 1.4; }
.foot .mono { color: var(--muted); }
.stat { padding: 34px 36px; border-radius: 28px; background: rgba(33,37,46,.85); border: 1.5px solid rgba(255,255,255,.07); }
.stat .v { font-family: 'Space Mono'; font-weight: 700; font-size: 92px; line-height: 1; color: #fff; }
.stat .l { margin-top: 12px; font-size: 32px; font-weight: 800; color: var(--text); }
.stat .s { margin-top: 6px; font-size: 24px; color: var(--subtle); }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.pill { display: inline-block; padding: 10px 22px; border-radius: 999px; font-weight: 900; font-size: 26px; background: var(--orange); color: #14171d; }
.pill.violeta { background: var(--violet); color: #fff; }
.photo { border: 3px dashed rgba(255,255,255,.28); border-radius: 28px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; text-align: center; color: var(--muted); background: repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0 18px, transparent 18px 36px); }
.photo b { font-family: 'Space Mono'; color: var(--orange); font-size: 26px; }
.photo span { font-size: 24px; }
${extra}
</style></head><body>${cuerpo}</body></html>`;

const marco = (pag, total, cuerpo, pie = `Fuente: Meetup y canales oficiales · corte ${fechaCorta(D.corte)}`) => `
<div class="slide">
  <div class="top"><div class="brand"><img src="${LOGO}" alt="">AWS SBG Univalle</div><div class="pag">${pag}/${total}</div></div>
  ${cuerpo}
  <div class="foot"><span>${pie}</span><span class="mono">awsunivalle.dev/recap</span></div>
</div>`;

const TOTAL = 8;
const temas = Object.entries(M.eventos.por_tema).sort((a, b) => b[1].confirmaciones - a[1].confirmaciones);
const maxT = temas[0][1].confirmaciones;

const CARRUSEL = [
  marco(1, TOTAL, `
    <div style="margin-top:auto" class="tag"># recap · nov 2025 → nov 2026</div>
    <h1 class="big" style="margin-top:34px; font-size:104px">De Cali a Tuluá,<br><span class="grad">y de Tuluá a Las Vegas.</span></h1>
    <p class="lead" style="margin-top:46px">Un año del <b>primer AWS Student Builder Group del Valle del Cauca</b>.</p>
    <div style="margin-top:56px; display:flex; gap:18px; flex-wrap:wrap"><span class="pill">${D.eventos} eventos</span><span class="pill violeta">${n(D.miembros)} miembros</span><span class="pill" style="background:#2a2f3a; color:#fff">Desliza →</span></div>
    <div style="margin-bottom:auto"></div>`,
    'Universidad del Valle · Cali y Tuluá'),
  marco(2, TOTAL, `
    <div style="margin-top:70px" class="tag"># en_cifras</div>
    <h2 class="mid" style="margin-top:22px">Un año construyendo en comunidad</h2>
    <div class="grid2" style="margin-top:56px">
      <div class="stat"><div class="v">${n(D.miembros)}</div><div class="l">miembros</div><div class="s">en Meetup</div></div>
      <div class="stat"><div class="v">${D.eventos}</div><div class="l">eventos</div><div class="s">${D.presenciales} presenciales · ${D.virtuales} virtuales</div></div>
      <div class="stat"><div class="v">${n(D.confirmaciones)}</div><div class="l">confirmaciones</div><div class="s">RSVP, no asistencia real</div></div>
      <div class="stat"><div class="v">${n(D.calificacion, 2)}</div><div class="l">de 5 estrellas</div><div class="s">${D.valoraciones} valoraciones</div></div>
    </div>`),
  marco(3, TOTAL, `
    <div style="margin-top:70px" class="tag"># tuluá</div>
    <h2 class="mid" style="margin-top:22px"><span class="grad">${D.tulua} de ${D.presenciales}</span> eventos presenciales fueron en Tuluá</h2>
    <p class="lead" style="margin-top:34px">En la sede Villa Campestre y en la Escuela de Policía Simón Bolívar. La nube no es solo para la sede principal.</p>
    <div class="photo" style="margin-top:46px; height:430px"><b>[FOTO REAL]</b><span>Reto Cloud Practitioner · Tuluá</span><span>Reemplazar con foto con permiso de uso</span></div>`),
  marco(4, TOTAL, `
    <div style="margin-top:70px" class="tag"># reto_cloud_practitioner</div>
    <h2 class="mid" style="margin-top:22px">${D.reto.sesiones} sesiones para certificarse, con cupos llenos</h2>
    <p class="lead" style="margin-top:30px">Con el <b>SBG de la UCEVA</b>, del 19 de septiembre al 29 de octubre en Tuluá.</p>
    <div style="margin-top:60px; display:flex; align-items:flex-end; gap:22px; height:330px">
      ${D.reto.confirmaciones_por_sesion.map((v, i) => `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:12px; justify-content:flex-end; height:100%"><span class="mono" style="font-size:28px; color:#fff">${v}</span><div style="width:100%; height:${(v / 40) * 230}px; background:var(--orange-d); border-radius:10px 10px 0 0"></div><span class="mono" style="font-size:22px; color:var(--subtle)">S${i + 1}</span></div>`).join('')}
    </div>
    <p style="margin-top:22px; font-size:26px; color:var(--muted)">Confirmaciones por sesión · ${n(D.reto.confirmaciones_promedio, 1)} de media. Además, <b style="color:#fff">más de 20 vouchers</b> de certificación entregados (dato del equipo).</p>`),
  marco(5, TOTAL, `
    <div style="margin-top:70px" class="tag"># reconocimientos</div>
    <h2 class="mid" style="margin-top:22px">Rumbo a <span class="grad">AWS re:Invent 2026</span></h2>
    <p class="lead" style="margin-top:30px">Juan Manuel Hoyos Contreras, líder del grupo, ganó la beca <b>All Builders Welcome</b> y estará en Las Vegas del 30 de noviembre al 4 de diciembre.</p>
    <div style="margin-top:50px; display:flex; flex-direction:column; gap:20px">
      <div class="stat" style="padding:28px 34px"><div class="l" style="margin:0">Ponentes invitados por AWS en el AWS Summit Bogotá 2026</div><div class="s">Builder Spotlight, según su perfil de ponente</div></div>
      <div class="stat" style="padding:28px 34px"><div class="l" style="margin:0">Organizador del AWS Student Community Day Colombia</div><div class="s">Bogotá, 26 de junio · más de 800 cupos</div></div>
    </div>`, 'Fuentes: Agencia de Noticias Univalle (15 oct 2026), Sessionize, awsstudentcommunity.day'),
  marco(6, TOTAL, `
    <div style="margin-top:70px" class="tag"># lo_que_mas_convoca</div>
    <h2 class="mid" style="margin-top:22px">Carrera, IA y comunidad</h2>
    <div style="margin-top:50px; display:flex; flex-direction:column; gap:26px">
      ${temas.slice(0, 6).map(([t, d]) => `<div><div style="display:flex; justify-content:space-between; font-size:30px"><span>${t}</span><span class="mono" style="color:#fff">${n(d.confirmaciones)}</span></div><div style="margin-top:10px; height:18px; border-radius:6px; background:rgba(255,255,255,.06)"><div style="height:100%; width:${(d.confirmaciones / maxT) * 100}%; background:var(--violet); border-radius:6px"></div></div></div>`).join('')}
    </div>
    <p style="margin-top:34px; font-size:24px; color:var(--subtle)">Confirmaciones en Meetup por tema. Con un AWS Hero, un Senior Solutions Architect de AWS y Community Builders como ponentes.</p>`),
  marco(7, TOTAL, `
    <div style="margin-top:70px" class="tag"># contexto</div>
    <h2 class="mid" style="margin-top:22px">${D.cmp.puesto_univalle_miembros}.º en miembros entre ${D.cmp.grupos.length} SBG de Colombia</h2>
    <p class="lead" style="margin-top:30px">Y <b>${D.cmp.puesto_univalle_valoraciones}.º en valoraciones</b> recibidas. Es el único de los cinco primeros fuera de Bogotá y Medellín.</p>
    <div style="margin-top:46px; display:flex; flex-direction:column; gap:18px">
      ${D.cmp.grupos.slice(0, 5).map((g) => { const yo = g.url.includes('university-of-the-valle'); return `<div style="display:grid; grid-template-columns: 330px 1fr 140px; align-items:center; gap:20px; font-size:27px; ${yo ? 'color:#fff; font-weight:900' : 'color:var(--muted)'}"><span>${g.nombre.replace('AWS SBG at ', '').replace('Francisco Jose de Caldas District Univ. - Bogota', 'U. Distrital').replace('University of the Valle', 'Univalle').replace('EAN University', 'EAN').replace(/National University of Colombia\s+- Bogota Campus/, 'U. Nacional').replace('University of Antioquia', 'U. de Antioquia')} · ${g.ciudad}</span><div style="height:18px; border-radius:6px; background:rgba(255,255,255,.06)"><div style="height:100%; width:${(g.miembros / D.cmp.grupos[0].miembros) * 100}%; border-radius:6px; background:${yo ? 'var(--orange)' : '#4b5263'}"></div></div><span class="mono" style="text-align:right">${n(g.miembros)}</span></div>`; }).join('')}
    </div>`, `Miembros en Meetup al ${fechaCorta(D.corte)}. Los grupos se crearon en fechas distintas.`),
  marco(8, TOTAL, `
    <div style="margin-top:60px" class="tag"># lo_que_viene</div>
    <h2 class="mid" style="margin-top:22px">Mientras re:Invent cierra en Las Vegas, <span class="grad">Tuluá construye</span></h2>
    <div class="stat" style="margin-top:46px; border-color:rgba(255,153,0,.45); background:linear-gradient(160deg, rgba(255,153,0,.18), rgba(33,37,46,.9) 60%)">
      <span class="pill">4 de diciembre · Tuluá</span>
      <div class="v" style="font-size:54px; margin-top:22px">Watch &amp; Build Party</div>
      <div class="s" style="font-size:28px; color:var(--muted)">AWS re:Invent en comunidad. Aprobada y avalada por AWS.</div>
    </div>
    <div class="stat" style="margin-top:22px; border-color:rgba(167,139,250,.4)">
      <span class="pill violeta">Diciembre · fecha por confirmar</span>
      <div class="v" style="font-size:54px; margin-top:22px">Hackathon de AWS</div>
      <div class="s" style="font-size:28px; color:var(--muted)">Arma tu equipo desde ya.</div>
    </div>`, 'Únete en Meetup: AWS SBG at University of the Valle'),
];

const HISTORIA = `
<div class="slide" style="padding:120px 90px">
  <div class="top"><div class="brand"><img src="${LOGO}" alt="">AWS SBG Univalle</div></div>
  <div style="margin-top:190px" class="tag"># 4 de diciembre · Tuluá</div>
  <h1 style="font-size:108px; line-height:1.02; margin-top:30px">AWS re:Invent<br><span class="grad">Watch &amp; Build Party</span></h1>
  <p class="lead" style="margin-top:50px; font-size:44px">Mientras re:Invent cierra en Las Vegas, <b>Tuluá construye</b>.</p>
  <div class="stat" style="margin-top:70px">
    <div class="l" style="margin:0; font-size:36px">Aprobada y avalada por AWS</div>
    <div class="s" style="font-size:30px; margin-top:12px">Lugar, horario e inscripción: pronto en Meetup.</div>
  </div>
  <div class="stat" style="margin-top:24px">
    <div class="l" style="margin:0; font-size:36px">Y en diciembre: nuestra primera hackathon</div>
    <div class="s" style="font-size:30px; margin-top:12px">Fecha por confirmar.</div>
  </div>
  <div style="margin-top:auto; text-align:center">
    <span class="pill" style="font-size:34px; padding:22px 44px">Únete en Meetup ↗</span>
    <p class="mono" style="margin-top:28px; font-size:28px; color:var(--muted)">AWS SBG at University of the Valle</p>
  </div>
</div>`;

const OG = `
<div class="slide" style="padding:64px 72px; justify-content:center">
  <div class="brand" style="font-size:22px"><img src="${LOGO}" alt="" style="width:56px;height:56px">AWS Student Builder Group · Universidad del Valle</div>
  <h1 style="font-size:72px; line-height:1.04; margin-top:36px">De Cali a Tuluá,<br><span class="grad">y de Tuluá a Las Vegas.</span></h1>
  <div style="display:flex; gap:40px; margin-top:44px; font-size:24px; color:var(--muted)">
    <span><b class="mono" style="color:#fff; font-size:40px">${n(D.miembros)}</b><br>miembros</span>
    <span><b class="mono" style="color:#fff; font-size:40px">${D.eventos}</b><br>eventos</span>
    <span><b class="mono" style="color:#fff; font-size:40px">${D.tulua}/${D.presenciales}</b><br>presenciales en Tuluá</span>
    <span><b class="mono" style="color:#fff; font-size:40px">${n(D.calificacion, 2)}</b><br>calificación</span>
  </div>
  <div class="mono" style="position:absolute; right:72px; bottom:52px; font-size:22px; color:var(--subtle)">Recap 2025–2026 · awsunivalle.dev/recap</div>
</div>`;

// ---------------------------------------------------------------- dossier
const fuentesDossier = [
  ['Miembros, eventos, confirmaciones y calificación', URL.meetup],
  ['Estudiantes impactados y beca re:Invent', URL.univalle],
  ['Comparación con SBG de Colombia', URL.directorio],
  ['AWS Student Community Day Colombia', URL.communityDay],
  ['Seguidores de LinkedIn', URL.linkedin],
];
const temasTabla = temas.map(([t, d]) => `<tr><td>${t}</td><td>${d.eventos}</td><td>${n(d.confirmaciones)}</td></tr>`).join('');

const DOSSIER = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${BASE_CSS}
@page { size: A4; margin: 0; }
body { background: #fff; color: #1f2430; }
.pg { position: relative; width: 210mm; height: 297mm; padding: 20mm 18mm 18mm; page-break-after: always; overflow: hidden; display: flex; flex-direction: column; }
.pg:last-child { page-break-after: auto; }
.pg h2 { color: #14171d; font-size: 26pt; line-height: 1.1; }
.pg h3 { color: #14171d; font-size: 13pt; }
.eyebrow { font-family: 'Space Mono'; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; color: #b25f00; }
p { font-size: 10.5pt; line-height: 1.6; color: #3d4452; }
.pie { margin-top: auto; display: flex; justify-content: space-between; font-size: 8pt; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 4mm; }
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.card { padding: 6mm; border-radius: 4mm; background: #f6f5fb; }
.card .v { font-family: 'Space Mono'; font-weight: 700; font-size: 26pt; color: #14171d; line-height: 1; }
.card .l { margin-top: 2mm; font-weight: 800; font-size: 10.5pt; color: #1f2430; }
.card .s { margin-top: 1mm; font-size: 8.5pt; color: #6b7280; }
table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
th, td { padding: 2.2mm 2mm; border-bottom: 1px solid #e5e7eb; text-align: left; }
th { font-size: 8pt; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; }
td:not(:first-child), th:not(:first-child) { text-align: right; }
.op { padding: 6mm; border-radius: 4mm; border: 1.2px solid #e5e7eb; }
.op.hot { border-color: #f0b35a; background: #fff8ee; }
.op ul { margin-top: 2mm; padding-left: 5mm; font-size: 9.5pt; line-height: 1.6; color: #3d4452; }
.badge { display: inline-block; padding: 1mm 3mm; border-radius: 99px; font-size: 8pt; font-weight: 800; background: #ff9900; color: #14171d; }
.badge.v { background: #7c3aed; color: #fff; }
.photo { border: 1.5px dashed #c4c8d0; border-radius: 4mm; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 9pt; color: #6b7280; background: repeating-linear-gradient(135deg, #fafafa 0 8px, #fff 8px 16px); }
a { color: #6d28d9; }
.cover { background: #14171d; color: #e5e7eb; }
.cover::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 40% at 0% 0%, rgba(139,92,246,.35), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255,153,0,.25), transparent 60%); }
.cover > * { position: relative; }
.cover p { color: #a3aab6; }
</style></head><body>

<section class="pg cover">
  <div style="display:flex; align-items:center; gap:4mm"><img src="${LOGO}" alt="" style="width:16mm; height:16mm; border-radius:3mm"><span class="mono" style="font-size:10pt; color:#a3aab6">AWS Student Builder Group · Universidad del Valle</span></div>
  <div style="margin-top:55mm" class="eyebrow">Dossier para aliados · diciembre de 2026</div>
  <h1 style="font-size:40pt; line-height:1.05; margin-top:6mm">Construyamos juntos<br><span style="color:#ff9900">el cierre del año en Tuluá</span></h1>
  <p style="margin-top:10mm; font-size:13pt; max-width:150mm">Somos el primer AWS Student Builder Group del Valle del Cauca. En un año organizamos ${D.eventos} eventos y reunimos a ${n(D.miembros)} miembros en Meetup. En diciembre hacemos la Watch &amp; Build Party de AWS re:Invent y nuestra primera hackathon, y buscamos aliados para ambos.</p>
  <div style="margin-top:auto; display:grid; grid-template-columns: repeat(4, 1fr); gap:4mm">
    ${[[n(D.miembros), 'miembros en Meetup'], [D.eventos, 'eventos publicados'], [`${D.tulua}/${D.presenciales}`, 'presenciales en Tuluá'], [n(D.calificacion, 2), `calificación (${D.valoraciones})`]].map(([v, l]) => `<div style="padding:5mm; border-radius:3mm; background:rgba(33,37,46,.9)"><div class="mono" style="font-weight:700; font-size:20pt; color:#fff">${v}</div><div style="font-size:8.5pt; color:#a3aab6; margin-top:1mm">${l}</div></div>`).join('')}
  </div>
  <p style="margin-top:5mm; font-size:8pt">Cifras públicas de Meetup al ${D.corteTexto}.</p>
</section>

<section class="pg">
  <div class="eyebrow">01 · Quiénes somos</div>
  <h2 style="margin-top:3mm">Una comunidad estudiantil que lleva la nube a la región</h2>
  <p style="margin-top:6mm">El AWS Student Builder Group Univalle es una comunidad de estudiantes, con aval de AWS desde noviembre de 2025, que enseña computación en la nube con práctica real: charlas, talleres, laboratorios y preparación para certificaciones. Hace parte del programa global AWS Student Builder Groups (antes AWS Cloud Clubs).</p>
  <p style="margin-top:3mm">Nacimos en Cali, pero nuestra actividad presencial vive sobre todo en la sede de Tuluá: ${D.tulua} de los ${D.presenciales} eventos presenciales se hicieron allí. También llegamos a Meléndez, a la Universidad Icesi y a la Escuela de Policía Simón Bolívar.</p>
  <div class="cards" style="margin-top:8mm">
    <div class="card"><div class="v">${D.eventos}</div><div class="l">eventos en 8 meses</div><div class="s">${n(D.porSemana, 2)} por semana desde el lanzamiento (28 feb 2026)</div></div>
    <div class="card"><div class="v">${n(D.confirmaciones)}</div><div class="l">confirmaciones en Meetup</div><div class="s">RSVP, no asistencia real</div></div>
    <div class="card"><div class="v">${D.impactados}</div><div class="l">estudiantes impactados</div><div class="s">Agencia de Noticias Univalle, 15 oct 2026</div></div>
    <div class="card"><div class="v">${D.reto.sesiones}</div><div class="l">sesiones del reto Cloud Practitioner</div><div class="s">Con el SBG de la UCEVA, cupos llenos</div></div>
  </div>
  <h3 style="margin-top:9mm">Reconocimientos</h3>
  <ul style="margin-top:2mm; padding-left:5mm; font-size:10pt; line-height:1.7; color:#3d4452">
    <li>Beca All Builders Welcome para AWS re:Invent 2026 del líder del grupo (Agencia de Noticias Univalle).</li>
    <li>Ponentes invitados por AWS en el AWS Summit Bogotá 2026 (dato del equipo; AWS Builder Spotlight según Sessionize).</li>
    <li>Líder entre los organizadores del AWS Student Community Day Colombia 2026 (awsstudentcommunity.day).</li>
    <li>Más de 20 vouchers de certificación entregados a estudiantes de varias sedes (dato del equipo).</li>
  </ul>
  <div class="photo" style="margin-top:8mm; height:45mm">[FOTO REAL] Comunidad en un evento presencial · reemplazar con foto con permiso de uso</div>
  <div class="pie"><span>AWS SBG Univalle · Dossier para aliados</span><span>2</span></div>
</section>

<section class="pg">
  <div class="eyebrow">02 · Nuestra audiencia</div>
  <h2 style="margin-top:3mm">Lo que sabemos y lo que no</h2>
  <p style="margin-top:6mm">Somos transparentes con los datos: solo reportamos cifras públicas y agregadas. No tenemos datos demográficos verificados (edad, carrera, semestre) de los miembros, así que no los presentamos.</p>
  <h3 style="margin-top:7mm">Lo que sí podemos mostrar</h3>
  <table style="margin-top:3mm">
    <thead><tr><th>Tema</th><th>Eventos</th><th>Confirmaciones</th></tr></thead>
    <tbody>${temasTabla}</tbody>
  </table>
  <div class="cards" style="margin-top:7mm">
    <div class="card"><div class="v">${n(D.promVirtual, 1)}</div><div class="l">confirmaciones promedio en virtual</div><div class="s">${D.virtuales} eventos virtuales</div></div>
    <div class="card"><div class="v">${n(D.promPresencial, 1)}</div><div class="l">confirmaciones promedio en presencial</div><div class="s">${D.presenciales} eventos; subestimado por inscripción externa</div></div>
  </div>
  <p style="margin-top:6mm; font-size:9pt">Canales: Meetup (${n(D.miembros)} miembros), LinkedIn (${n(D.linkedin)} seguidores), YouTube (${D.youtube} suscriptores), Instagram, TikTok y canal de WhatsApp. Cifras de Instagram y TikTok pendientes de verificar.</p>
  <p style="margin-top:3mm; font-size:9pt">${AVISO_RSVP}</p>
  <div class="pie"><span>AWS SBG Univalle · Dossier para aliados</span><span>3</span></div>
</section>

<section class="pg">
  <div class="eyebrow">03 · Oportunidades</div>
  <h2 style="margin-top:3mm">Dos eventos para sumarse en diciembre</h2>
  <div class="op hot" style="margin-top:7mm">
    <span class="badge">4 de diciembre de 2026 · Tuluá</span>
    <h3 style="margin-top:3mm; font-size:16pt">AWS re:Invent Watch &amp; Build Party</h3>
    <p style="margin-top:2mm">Aprobada y avalada por AWS. Coincide con el último día de re:Invent, cuando nuestro líder estará en Las Vegas con beca: la comunidad sigue los anuncios y construye con ellos desde Tuluá.</p>
    <ul><li>Mentoría técnica durante la jornada de construcción.</li><li>Apoyo con refrigerios, logística o material para los asistentes.</li><li>Una charla corta sobre un caso real en la nube.</li></ul>
  </div>
  <div class="op" style="margin-top:5mm">
    <span class="badge v">Diciembre de 2026 · fecha por confirmar</span>
    <h3 style="margin-top:3mm; font-size:16pt">Hackathon de AWS</h3>
    <p style="margin-top:2mm">La primera hackathon del grupo. Formato, bases y sede se definirán en las próximas semanas, y nos gustaría construirlos con nuestros aliados.</p>
    <ul><li>Retos propuestos por la empresa, con datos o casos reales.</li><li>Mentores y jurados.</li><li>Premios en especie o reconocimientos para los equipos.</li></ul>
  </div>
  <h3 style="margin-top:7mm">Qué ofrecemos a cambio</h3>
  <ul style="margin-top:2mm; padding-left:5mm; font-size:10pt; line-height:1.7; color:#3d4452">
    <li>Mención del aliado en las publicaciones del evento en nuestros canales.</li>
    <li>Espacio para presentar al aliado y su trabajo durante el evento.</li>
    <li>Un reporte posterior con cifras verificadas (inscritos, asistencia y fotos con permiso).</li>
  </ul>
  <p style="margin-top:4mm">No manejamos tarifas fijas: cada alianza se conversa según lo que el aliado quiera aportar y lo que la comunidad necesite.</p>
  <div class="pie"><span>AWS SBG Univalle · Dossier para aliados</span><span>4</span></div>
</section>

<section class="pg">
  <div class="eyebrow">04 · Con quién ya construimos</div>
  <h2 style="margin-top:3mm">Aliados de este año</h2>
  <table style="margin-top:6mm">
    <thead><tr><th>Aliado</th><th style="text-align:left">Qué hicimos juntos</th></tr></thead>
    <tbody>
      <tr><td>AWS SBG UCEVA</td><td style="text-align:left">Reto Cloud Practitioner de 8 sesiones y Cloud Quest</td></tr>
      <tr><td>Universidad Icesi</td><td style="text-align:left">Contenedores 101 y Cloud Quest Valle del Cauca</td></tr>
      <tr><td>Universidad de San Buenaventura</td><td style="text-align:left">Cloud Quest Valle del Cauca</td></tr>
      <tr><td>AWS User Group Valle del Cauca</td><td style="text-align:left">"Construye Rápido... Despliega seguro!" (89 confirmaciones)</td></tr>
      <tr><td>IEEE Computer Society y CENESIS</td><td style="text-align:left">Coorganización y sesiones para la comunidad de IEEE</td></tr>
      <tr><td>Escuela de Policía Simón Bolívar</td><td style="text-align:left">Dos charlas de nube en Tuluá</td></tr>
      <tr><td>Red de SBG de Colombia</td><td style="text-align:left">AWS Student Community Day Colombia 2026</td></tr>
    </tbody>
  </table>
  <h3 style="margin-top:9mm">Hablemos</h3>
  <p style="margin-top:2mm">Escríbenos a <b>${URL.correo}</b> o en LinkedIn. El recap completo, con metodología y fuentes, está en <b>awsunivalle.dev/recap</b>.</p>
  <h3 style="margin-top:9mm">Fuentes (consultadas el ${D.corteTexto})</h3>
  <ul style="margin-top:2mm; padding-left:5mm; font-size:8.5pt; line-height:1.7; color:#3d4452">${fuentesDossier.map(([t, u]) => `<li>${t}: ${u}</li>`).join('')}</ul>
  <p style="margin-top:4mm; font-size:8.5pt">Los datos marcados como «dato del equipo» los confirma el líder del grupo y aún no tienen una fuente pública. No usamos logos de terceros sin permiso.</p>
  <div class="pie"><span>AWS SBG Univalle · Dossier para aliados</span><span>5</span></div>
</section>
</body></html>`;

// ---------------------------------------------------------------- render
async function main() {
  const redes = path.join(ENTREGABLES, 'redes');
  const dossier = path.join(ENTREGABLES, 'dossier');
  const og = path.join(REPO, 'public', 'og');
  [redes, dossier, og].forEach((d) => mkdirSync(d, { recursive: true }));

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const shot = async (html, w, h, file) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } });
    console.log('✓', path.relative(REPO, file));
  };

  await shot(lienzo(1200, 630, OG), 1200, 630, path.join(og, 'recap.png'));
  for (const [i, s] of CARRUSEL.entries()) {
    await shot(lienzo(1080, 1350, s), 1080, 1350, path.join(redes, `carrusel-0${i + 1}.png`));
  }
  await shot(lienzo(1080, 1920, HISTORIA), 1080, 1920, path.join(redes, 'historia.png'));

  await page.setContent(DOSSIER, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = path.join(dossier, 'dossier-patrocinadores.pdf');
  await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('✓', path.relative(REPO, pdf));
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
