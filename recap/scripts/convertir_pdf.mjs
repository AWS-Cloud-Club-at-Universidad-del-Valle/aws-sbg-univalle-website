// Convierte la presentación y los informes a PDF con LibreOffice.
// Uso: node recap/scripts/convertir_pdf.mjs   (requiere `soffice` en el PATH)
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ENTREGABLES } from './lib/datos.mjs';

const archivos = [
  ['presentacion', 'recap-aws-sbg-univalle.pptx'],
  ['informes', 'informe-ejecutivo.docx'],
  ['informes', 'informe-completo.docx'],
];
for (const [dir, f] of archivos) {
  const carpeta = path.join(ENTREGABLES, dir);
  execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', carpeta, path.join(carpeta, f)], { stdio: 'inherit' });
}
