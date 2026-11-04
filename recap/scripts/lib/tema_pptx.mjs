// Escribe la paleta del tema en ppt/theme/theme1.xml. pptxgenjs deja la paleta
// por defecto de Office, así que sin este paso los colores de esquema no coinciden.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));

const SLOTS = ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];

export async function aplicarTema(archivo, tema) {
  for (const k of SLOTS) {
    if (!/^[0-9A-F]{6}$/i.test(tema.colors[k] ?? '')) throw new Error(`Color inválido en ${k}`);
  }
  const zip = await JSZip.loadAsync(readFileSync(archivo));
  const ruta = 'ppt/theme/theme1.xml';
  let xml = await zip.file(ruta).async('string');
  const slot = (k) => `<a:${k}><a:srgbClr val="${tema.colors[k]}"/></a:${k}>`;
  const esquema = `<a:clrScheme name="${tema.name}">${SLOTS.map(slot).join('')}</a:clrScheme>`;
  xml = xml.replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, esquema);
  xml = xml.replace(/(<a:theme[^>]*\sname=")[^"]*(")/, `$1${tema.name}$2`);
  zip.file(ruta, xml);
  writeFileSync(archivo, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}
