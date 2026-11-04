// Verificación del recap:
//  1. Recalcula los promedios desde eventos.json y los compara con metricas.json.
//  2. Extrae el texto de todos los entregables y de /recap (dist) y busca frases prohibidas.
//  3. Lista los números que no salen de metricas.json o de eventos.json, para revisarlos a mano.
//  4. Comprueba que todos los enlaces respondan.
// Uso: npm run build (raíz) && node recap/scripts/verificar.mjs [--sin-enlaces]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { M, EVENTOS, RECAP, REPO, ENTREGABLES } from './lib/datos.mjs';

let fallas = 0;
const falla = (msg) => { fallas++; console.log('  ✗', msg); };
const ok = (msg) => console.log('  ✓', msg);

// ---------------------------------------------------------------- 1. promedios
console.log('\n1. Promedios recalculados');
const dias = (a, b) => (new Date(b) - new Date(a)) / 86_400_000;
const mes = 365.25 / 12;
const rs = EVENTOS.map((e) => e.confirmaciones_meetup);
const prom = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const r1 = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const checks = [
  ['total eventos', EVENTOS.length, M.eventos.total],
  ['confirmaciones', rs.reduce((a, b) => a + b, 0), M.eventos.confirmaciones_total],
  ['promedio', r1(prom(rs)), M.eventos.confirmaciones_promedio],
  ['promedio virtual', r1(prom(EVENTOS.filter((e) => e.modalidad === 'Virtual').map((e) => e.confirmaciones_meetup))), M.eventos.confirmaciones_promedio_virtual],
  ['promedio presencial', r1(prom(EVENTOS.filter((e) => e.modalidad === 'Presencial').map((e) => e.confirmaciones_meetup))), M.eventos.confirmaciones_promedio_presencial],
  ['eventos/mes desde aval', r1(EVENTOS.length / (dias(M.periodo.inicio_aval, M.fecha_corte) / mes), 2), M.eventos.eventos_por_mes_desde_aval],
  ['eventos/mes desde lanzamiento', r1(EVENTOS.length / (dias(M.periodo.lanzamiento_oficial, M.fecha_corte) / mes), 2), M.eventos.eventos_por_mes_desde_lanzamiento],
  ['eventos/semana desde lanzamiento', r1(EVENTOS.length / (dias(M.periodo.lanzamiento_oficial, M.fecha_corte) / 7), 2), M.eventos.eventos_por_semana_desde_lanzamiento],
  ['presenciales en Tuluá', EVENTOS.filter((e) => e.modalidad === 'Presencial' && e.sede.startsWith('Tuluá')).length, 16],
  ['promedio reto', r1(prom(EVENTOS.filter((e) => e.tema === 'Reto Cloud Practitioner').map((e) => e.confirmaciones_meetup))), M.reto_cloud_practitioner.confirmaciones_promedio],
];
for (const [k, a, b] of checks) (a === b ? ok : falla)(`${k}: recalculado ${a} · metricas ${b}`);

// ---------------------------------------------------------------- 2. textos
console.log('\n2. Textos de los entregables');
const textos = {};
const leerDir = (d) => readdirSync(d, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? leerDir(path.join(d, f.name)) : [path.join(d, f.name)]));
for (const f of leerDir(ENTREGABLES)) {
  if (f.endsWith('.md')) textos[path.relative(RECAP, f)] = readFileSync(f, 'utf8');
  if (f.endsWith('.pdf')) textos[path.relative(RECAP, f)] = execFileSync('pdftotext', ['-layout', f, '-'], { encoding: 'utf8' });
}
const html = path.join(REPO, 'dist', 'recap', 'index.html');
if (existsSync(html)) {
  textos['dist/recap/index.html'] = readFileSync(html, 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
} else falla('No existe dist/recap/index.html: ejecuta npm run build en la raíz');

const prohibidas = [
  [/(?<!no (?:somos|decimos|afirma[a-z]* (?:que (?:sea|el grupo sea) )?)|ni )\bel (?:grupo )?m[aá]s (?:grande|activo)\b/i, 'superlativo sin datos comparables'],
  [/\basistentes\b/i, '"asistentes" (las confirmaciones no son asistencia)'],
  [/lorem|ipsum|\bTODO\b|\bTBD\b|\[insert/i, 'texto de relleno'],
  [/\bClaude\b|\bAnthropic\b/, 'mención de herramientas'],
];
for (const [archivo, txt] of Object.entries(textos)) {
  for (const [re, motivo] of prohibidas) {
    const m = txt.match(new RegExp(re.source, re.flags + 'g'));
    if (m) {
      const contexto = txt.slice(Math.max(0, txt.search(re) - 60), txt.search(re) + 60).replace(/\s+/g, ' ');
      falla(`${archivo}: ${motivo} → «…${contexto}…»`);
    }
  }
}
ok(`${Object.keys(textos).length} textos revisados`);

// ---------------------------------------------------------------- 3. números
console.log('\n3. Números que no salen de metricas.json / eventos.json');
const permitidos = new Set();
const agregar = (v) => {
  if (typeof v === 'number') {
    permitidos.add(String(v)); permitidos.add(String(v).replace('.', ','));
    permitidos.add(new Intl.NumberFormat('es-CO').format(v));
  } else if (typeof v === 'string') (v.match(/\d+(?:[.,]\d+)?/g) ?? []).forEach((x) => permitidos.add(x));
  else if (v && typeof v === 'object') Object.values(v).forEach(agregar);
};
agregar(M); agregar(EVENTOS);
// Contexto que no es una cifra del recap: fechas, horas, cupos de eventos, valores de Student Rewards y formatos.
['2025', '2026', '2027', '1080', '1350', '1920', '1200', '630', '800', '449', '579', '100', '20', '30', '26', '10', '12', '24', '14', '15', '16', '17', '18', '19', '21', '22', '25', '27', '28', '29', '31', '60', '135', '55', '101', '11', '13', '23', '9', '30,44', '248', '351', '900', '2,951', '1,408', '56', '863', '7', '8', '40', '34', '37', '1.052', '2.951', '871', '640', '305', '4,9', '5,00', '3,00', '4,92', '4,80', '4,88', '4,82', '4,91', '4,64', '4,83', '2.0', '143', '200'].forEach((x) => permitidos.add(x));
const raros = {};
for (const [archivo, txt] of Object.entries(textos)) {
  for (const x of txt.match(/(?<![\w/#.-])\d{2,}(?:[.,]\d+)?(?![\w/-])/g) ?? []) {
    if (!permitidos.has(x)) (raros[archivo] ??= new Set()).add(x);
  }
}
const totalRaros = Object.values(raros).reduce((a, s) => a + s.size, 0);
if (!totalRaros) ok('todos los números están respaldados');
for (const [a, s] of Object.entries(raros)) console.log(`  ? ${a}: ${[...s].join(', ')}`);

// ---------------------------------------------------------------- 4. enlaces
if (!process.argv.includes('--sin-enlaces')) {
  console.log('\n4. Enlaces');
  const urls = new Set();
  const fuentes = [...Object.values(textos), readFileSync(path.join(RECAP, 'investigacion', 'FUENTES.md'), 'utf8')];
  if (existsSync(html)) fuentes.push(readFileSync(html, 'utf8').match(/href="(https?:[^"]+)"/g)?.join(' ') ?? '');
  for (const txt of fuentes) for (const u of txt.match(/https?:\/\/[^\s)<>"'\]|*`]+/g) ?? []) urls.add(u.replace(/[.,;:]+$/, ''));
  const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
  const bloqueados = /linkedin\.com\/in\/|x\.com|instagram\.com|tiktok\.com|whatsapp\.com\/channel/;
  for (const u of [...urls].sort()) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': ua }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      if (r.ok) ok(`${r.status} ${u}`);
      else if (bloqueados.test(u) || [402, 403, 429, 999].includes(r.status)) console.log(`  ~ ${r.status} ${u} (bloquea robots; revisar a mano)`);
      else falla(`${r.status} ${u}`);
    } catch (e) {
      falla(`error ${u}: ${e.message}`);
    }
  }
}

console.log(fallas ? `\n${fallas} fallas` : '\nSin fallas');
process.exit(fallas ? 1 : 0);
