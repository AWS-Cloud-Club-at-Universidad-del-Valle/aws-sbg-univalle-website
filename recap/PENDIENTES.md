# Pendientes

Lo que falta para cerrar el recap con datos completos. Ninguno bloquea los entregables: donde falta un dato, se usó la mejor opción honesta y está marcada.

## Datos que necesito del equipo

1. **Exportación de Meetup del organizador** (asistencia real marcada, histórico de miembros por mes y comentarios de feedback). Las páginas `/events/past/`, `/feedback-overview/` y `/photos/` exigen inicio de sesión y no se intentó saltar la restricción. Con la exportación se puede reemplazar "confirmaciones" por asistencia real y graficar el crecimiento de miembros.
2. **Inscritos por formulario externo** en los eventos presenciales de Tuluá de mayo y junio (formularios de Google). Meetup muestra entre 2 y 8 confirmaciones, pero la asistencia real probablemente fue mayor.
3. **Fotos con permiso de uso** de: lanzamiento, reto Cloud Practitioner (Tuluá), "Construye Rápido... Despliega seguro!" (Meléndez), Escuela de Policía, Cloud Quest y Summit Bogotá. Hay espacios marcados para fotos en /recap, la presentación, el dossier y el carrusel (`[FOTO REAL: …]`). No se generaron fotos.
4. **Captura o exportación de Instagram y TikTok** (seguidores y alcance). Ambos exigen sesión.
5. **Enlace al artículo de Ingeniería Informa de julio de 2026**. X respondió HTTP 402. Hace falta el URL o un PDF para citarlo.
6. **Evidencia de los hitos confirmados por el líder**, para poder citarlos con fuente pública: número exacto de vouchers y sedes; agenda del AWS Summit Bogotá con la sesión del grupo; publicación del AWS Community Day Perú; sesiones de IEEE (fechas); resultados de Cloud Quest (número de ganadores de Univalle); correo o aval de AWS para la Watch Party.
7. **Fecha, sede y enlace de inscripción de la hackathon** de diciembre.
8. **Enlace de inscripción y lugar exacto de la Watch & Build Party** (4-dic, Tuluá). Por ahora los botones llevan a la página de Meetup del grupo.
9. **Confirmar las fechas reales de las sesiones 5, 7 y 8 del reto** (ver CONFLICTOS.md #5–7). Se usaron las fechas de la página de Meetup.
10. **Datos de contacto para prensa y patrocinio**. Se usó el correo público del grupo (aws.cloud.club@correounivalle.edu.co).
11. **Permiso para usar logos** de AWS, Universidad del Valle, UCEVA, Icesi, IEEE y demás aliados. Los entregables usan solo el logo del SBG y nombres en texto.

## Mejoras sugeridas para el sitio (fuera de este PR)

- Actualizar `STATS` en `src/lib/constants.ts` (922 miembros y 27 eventos) o leer las cifras de `recap/metricas.json`.
- La API de eventos no actualiza el estado: los eventos pasados de septiembre y octubre siguen como `UPCOMING`.
- La descripción de Meetup todavía enlaza a la URL antigua de LinkedIn (`aws-cloud-club-universidad-del-valle`).
- `UPCOMING_EVENTS` en `constants.ts` tiene eventos de ejemplo con formularios `forms.gle/ejemplo-*`. Si se usan en alguna página, conviene reemplazarlos.
- Corregir las fechas en las descripciones de las sesiones 5, 7 y 8 del reto en Meetup.

## Antes de publicar

- Revisar el PR hacia `develop` y fusionarlo manualmente. Hacer push a `develop` despliega al entorno de desarrollo.
- Validar con el líder los textos de prensa y los correos antes de enviarlos.
- Generar la imagen para compartir en el CDN, si se prefiere servirla desde ahí y no desde `public/`.
