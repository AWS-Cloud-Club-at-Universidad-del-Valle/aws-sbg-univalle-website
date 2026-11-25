# Registro de equipos del Kirothon

> **Estado (2026-11-25): ya está conectado.** Hoja «Kirothon · Inscripciones de equipos» en la carpeta de Drive de la Kirothon (pestaña **Equipos**), con el script ligado «Kirothon · Registro de equipos» publicado como app web. La URL `/exec` está en la variable de repositorio `PUBLIC_KIROTHON_FORM_URL` de GitHub. Si cambias el código, publica una **nueva versión** de la misma implementación (Implementar → Gestionar implementaciones → Editar → Nueva versión) para conservar la URL.

## Montarlo desde cero

1. Crea una hoja de cálculo en Google Sheets. Copia el ID de su URL, entre `/d/` y `/edit`.
2. En la hoja, abre **Extensiones → Apps Script**. Pega el contenido de [Code.gs](Code.gs) y guarda.
3. Ejecuta una vez la función `setup` desde el editor: pide la autorización y crea la pestaña **Equipos** con sus encabezados. Si el script está ligado a la hoja no hace falta nada más; si es un proyecto independiente, agrega en **Configuración del proyecto → Propiedades de la secuencia de comandos** la propiedad `SPREADSHEET_ID` con el ID que copiaste.
4. Selecciona **Implementar → Nueva implementación → Aplicación web**. En **Ejecutar como**, selecciona **Yo**. En **Quién tiene acceso**, selecciona **Cualquiera** para permitir envíos sin iniciar sesión. Autoriza el acceso a la hoja y copia la URL de la aplicación web terminada en `/exec`.
5. En el archivo `.env` del sitio, agrega `PUBLIC_KIROTHON_FORM_URL=<URL terminada en /exec>` y reconstruye el sitio. Astro incorpora esta URL pública al generar el HTML.
6. En GitHub, ve a **Settings → Secrets and variables → Actions → Variables** (o a un Environment si quieres una URL distinta por entorno) y crea `PUBLIC_KIROTHON_FORM_URL` con la URL del Apps Script para ese entorno. En [deploy.yml](../../.github/workflows/deploy.yml), el paso **Build site** pasa `${{ vars.PUBLIC_KIROTHON_FORM_URL }}` a `npm run build` mediante `env`. Vuelve a desplegar para aplicar el cambio.
7. Prueba una inscripción con datos de prueba en el entorno de desarrollo. Verifica que aparezca una sola fila y que un segundo envío con el mismo equipo o correo muestre el mensaje de rechazo.

Mantén la hoja de respuestas con acceso restringido a la organización del evento. La columna **Fecha** usa la hora de recepción del servidor.

## Pruebas locales

```sh
npm ci
npm run build
npx playwright test e2e/kirothon.spec.ts e2e/layout.spec.ts
```

Playwright configura un endpoint de prueba e intercepta los envíos. Si necesitas ver el sitio localmente, ejecuta `npm run dev -- --background`.
