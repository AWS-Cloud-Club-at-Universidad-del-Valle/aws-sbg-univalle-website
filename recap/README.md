# Recap 2025–2026 · AWS SBG Univalle

Paquete de recap del primer año del AWS Student Builder Group de la Universidad del Valle: investigación, cifras, página web, presentación, informes, dossier, piezas para redes, prensa y guion de video.

**Corte de datos:** 3 de noviembre de 2026. **Única fuente de cifras:** [`metricas.json`](metricas.json).

## Estructura

```text
recap/
├── README.md                    este archivo
├── ESTRATEGIA.md                narrativa, mensajes y audiencias
├── PENDIENTES.md                datos y permisos que faltan
├── metricas.json                ÚNICA fuente de cifras (generado)
├── investigacion/
│   ├── eventos.json             los 36 eventos (generado)
│   ├── FUENTES.md               cada afirmación con URL, fecha y nivel
│   ├── HALLAZGOS.md             línea de tiempo, patrones, comparación, top 10
│   ├── CONFLICTOS.md            diferencias entre fuentes y cómo se resolvieron
│   └── instantaneas/            datos crudos de Meetup, la API y los SBG de Colombia
├── scripts/
│   ├── construir_datos.py       instantáneas → eventos.json + metricas.json
│   ├── generar_visuales.mjs     imagen para compartir, carrusel, historia y dossier (Playwright)
│   ├── generar_presentacion.mjs presentación .pptx (pptxgenjs)
│   ├── generar_informes.mjs     informes .docx (docx)
│   ├── convertir_pdf.mjs        .pptx/.docx → PDF (LibreOffice)
│   ├── verificar.mjs            revisa cifras, frases prohibidas y enlaces
│   └── lib/                     datos compartidos y tema de la presentación
└── entregables/
    ├── presentacion/            recap-aws-sbg-univalle.pptx y .pdf (14 diapositivas, con notas)
    ├── informes/                informe-ejecutivo (2 págs.) e informe-completo (9 págs.), .docx y .pdf
    ├── dossier/                 dossier-patrocinadores.pdf (5 págs.)
    ├── redes/                   carrusel-01…08.png (1080×1350), historia.png (1080×1920), publicaciones.md
    ├── prensa/                  boletin-de-prensa.md, correos.md (AWS, universidad, patrocinadores)
    ├── video/                   guion-60s.md
    └── _assets/                 logo del SBG (el mismo del CDN del sitio)
```

En el sitio:

- `src/pages/recap.astro`: la página `/recap`.
- `src/components/recap/*`: hero, línea de tiempo, gráficas, explorador, logros y "lo que viene".
- `src/lib/recap.ts`: lee `metricas.json` y `eventos.json` y define los textos editoriales.
- `src/styles/recap.css`: los estilos de la página.
- `public/og/recap.png`: la imagen para compartir (1200×630).

## Cómo actualizar los datos

1. **Actualiza las instantáneas** en `investigacion/instantaneas/`. Para los eventos, descarga de nuevo las páginas públicas de Meetup (los datos estructurados `__NEXT_DATA__` de cada evento) o consulta la API pública del sitio (`GET /events`). Para la comparación, descarga las páginas de los SBG de Colombia. Cambia la fecha en el nombre del archivo y en el campo `consultado`.
2. **Si cambian las cifras del grupo** (miembros, calificación, seguidores), edítalas en `scripts/construir_datos.py` (bloque `metricas`) junto con su fuente. Si hay un evento nuevo, agrega su clasificación en el diccionario `MANUAL`. Cambia `FECHA_CORTE`.
3. **Regenera todo:**

   ```bash
   cd recap/scripts
   npm install                 # solo la primera vez (pptxgenjs y docx)
   npm run todo                # datos → visuales → presentación → informes → PDF
   node verificar.mjs          # cifras, frases y enlaces
   ```

   Necesitas Python 3, Node 22 o superior, las dependencias del sitio instaladas en la raíz (`npm install`, para Playwright y las fuentes) y LibreOffice (`soffice`) para los PDF.
4. **Revisa la página:** `npm run build` en la raíz y abre `/recap`.
5. **Actualiza los textos** que no se generan (`entregables/redes/publicaciones.md`, `entregables/prensa/*.md` y `entregables/video/guion-60s.md`) y registra en `investigacion/FUENTES.md` y `CONFLICTOS.md` cualquier cambio de fuente.

## Reglas de veracidad

- Toda cifra pública lleva fuente y fecha de corte.
- Las confirmaciones de Meetup son RSVP, no asistencia real.
- Los datos del equipo se marcan como "confirmado por el líder".
- No se dice "el más grande" ni "el más activo" de Colombia. La comparación se hace con un universo y una fecha explícitos.
- No se usan logos de terceros sin permiso, ni fotos sin autorización. Los espacios para fotos están marcados con `[FOTO REAL]`.
- No se publican datos personales de asistentes.
