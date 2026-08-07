# Documento de Requisitos — About Page

## Introducción

Página "Nosotros" (`/about`) del sitio web del AWS Student Builder Group Universidad del Valle. Esta página presenta la identidad, misión, visión, canales sociales y un CTA para unirse al grupo. Se integra con el lenguaje visual existente del sitio (tema oscuro, acentos geométricos, labels monospace, tarjetas con gradiente) y cumple WCAG 2.1 AA.

Esta iteración enriquece la calidad visual de la página manteniendo el mismo lenguaje de diseño del Home, sin modificar contenido textual, enlaces, accesibilidad, responsive ni rendimiento.

## Glosario

- **About_Page**: La ruta `/about` que muestra información de la comunidad, misión, visión, enlaces sociales y CTA.
- **Hero_Section**: Banner superior con título, code-label, párrafo introductorio y recurso visual cloud.
- **Identity_Section**: Sección "¿Quiénes somos?" con descripción de la comunidad y badges temáticos.
- **Mission_Section**: Sección que muestra la declaración de misión.
- **Vision_Section**: Sección que muestra la declaración de visión.
- **Social_Section**: Sección con enlaces a redes sociales y contacto.
- **CTA_Section**: Sección de call-to-action invitando a unirse a la comunidad.
- **Section_Divider**: Elemento separador visual entre secciones.
- **Design_System**: Conjunto de CSS custom properties, utilidades de espaciado, animaciones y patrones del sitio existente (global.css, BaseLayout, Navbar, Footer).

## Requisitos

### Requisito 1: Ruta e Integración con Layout

**Historia de usuario:** Como estudiante que visita el sitio, quiero acceder a la página About en `/about`, para poder conocer la comunidad sin salir de la experiencia establecida del sitio.

#### Criterios de Aceptación

1. CUANDO un usuario navega a `/about`, EL Renderer DEBE mostrar la About_Page usando el componente BaseLayout con título "Nosotros" y una meta description de entre 120 y 160 caracteres.
2. LA About_Page DEBE incluir los componentes Navbar y Footer proporcionados por BaseLayout.
3. CUANDO la About_Page se muestra, EL Navbar DEBE marcar el enlace "Nosotros" como página activa usando `aria-current="page"`.
4. CUANDO un usuario activa el skip link, LA About_Page DEBE mover el foco del teclado al elemento `<main>` con `id="main-content"`.

### Requisito 2: Hero Section

**Historia de usuario:** Como visitante, quiero ver un heading claro con un recurso visual cloud cuando aterrice en la página About, para entender inmediatamente el propósito de la página y sentir coherencia con el Home.

#### Criterios de Aceptación

1. LA Hero_Section DEBE mostrar un elemento code-label con el texto `# about.nosotros` usando la clase `code-label` del Design_System.
2. LA Hero_Section DEBE renderizar un `<h1>` con el texto "Nosotros" usando Space Mono y el color de heading (`#f9fafb`).
3. LA Hero_Section DEBE mostrar un párrafo introductorio de máximo 200 caracteres debajo del heading.
4. LA Hero_Section DEBE aplicar radial gradients de fondo sutiles (naranja y azul oscuro) consistentes con los del Home, usando los mismos valores de opacidad y tamaño.
5. LA Hero_Section DEBE incluir un dot grid pattern decorativo de fondo con `radial-gradient(circle, #fff 1px, transparent 1px)` y opacity de 0.025, idéntico al patrón del Home.
6. LA Hero_Section DEBE renderizar al menos 4 elementos geométricos decorativos flotantes usando las animaciones `float-triangle`, `float-circle`, `float-square` o `float-rhombus` definidas en global.css, con posicionamiento absoluto y `aria-hidden="true"`.
7. LA Hero_Section DEBE incluir un elemento SVG decorativo estático que evoque arquitectura cloud (nodos conectados por líneas) con opacity baja (0.08–0.12), posicionado al lado derecho del contenido en desktop y oculto en mobile.
8. LA Hero_Section DEBE usar las clases `hero-animate` con delays escalonados para las animaciones de entrada.
9. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Hero_Section DEBE mostrar todo el contenido inmediatamente sin animaciones.
10. SI el sistema de animación falla, LA Hero_Section DEBE mostrar todo el contenido visible en su posición final.

### Requisito 3: Sección Identidad (¿Quiénes somos?)

**Historia de usuario:** Como posible miembro, quiero leer una descripción visualmente atractiva de la comunidad con indicadores de sus áreas de enfoque, para entender rápidamente qué hace el grupo.

#### Criterios de Aceptación

1. LA Identity_Section DEBE renderizar como un `<section>` con `aria-labelledby` referenciando un `<h2>` con texto "¿Quiénes somos?" e `id="quienes-somos"`.
2. LA Identity_Section DEBE presentar el texto de descripción: "Somos una comunidad de estudiantes de la Universidad del Valle apasionados por la computación en la nube. Aprendemos tecnologías AWS, organizamos talleres y charlas, nos preparamos para certificaciones y conectamos a los estudiantes con profesionales, oportunidades y otras comunidades tecnológicas."
3. LA Identity_Section DEBE envolver el contenido en un card/panel con `rounded-xl`, `backdrop-blur`, borde usando `--sbg-border` o gradiente, y fondo `--sbg-bg-surface` o `--sbg-bg-elevated`.
4. LA Identity_Section DEBE renderizar badges decorativos debajo del texto con las siguientes etiquetas: "AWS", "Cloud", "Workshops", "Certificaciones", "Comunidad", "Networking", "Leadership". Los badges DEBEN usar estilo pill con fondo `--sbg-accent-subtle` o `--sbg-orange-subtle`, borde sutil, y tipografía Space Mono a tamaño pequeño (0.72rem–0.8rem).
5. LA Identity_Section DEBE incluir al menos una floating shape decorativa con `aria-hidden="true"`.
6. LA Identity_Section DEBE incluir un fondo con radial gradient sutil posicionado en una esquina para agregar profundidad.
7. LA Identity_Section DEBE usar `data-animate` para animaciones de entrada al scroll.
8. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Identity_Section DEBE mostrar todo el contenido inmediatamente.

### Requisito 4: Sección Misión

**Historia de usuario:** Como visitante, quiero leer la misión del grupo con una presentación visual diferenciada, para entender el propósito de la comunidad.

#### Criterios de Aceptación

1. LA Mission_Section DEBE renderizar como un `<section>` con `aria-labelledby` referenciando el `id` del heading, y DEBE mostrar "Misión" como `<h2>` con `id="mision"`.
2. LA Mission_Section DEBE presentar el texto de misión: "Impulsar el crecimiento de los estudiantes mediante aprendizaje práctico, eventos técnicos y una comunidad colaborativa que fomente el liderazgo, el trabajo en equipo y la conexión con AWS y la industria."
3. LA Mission_Section DEBE incluir un icono SVG decorativo (target/compass o similar) junto al título o en la esquina superior del card, con `aria-hidden="true"` y color `--sbg-accent` o `--sbg-orange` con opacity sutil.
4. LA Mission_Section DEBE aplicar un border-left con gradiente (desde `--sbg-accent` hasta transparente) de 3–4px de ancho en el card contenedor.
5. LA Mission_Section DEBE incluir un fondo con radial gradient muy sutil desde una esquina del card.
6. LA Mission_Section DEBE mantener `rounded-xl`, fondo `--sbg-bg-surface`, y padding consistente.
7. LA Mission_Section DEBE usar `data-animate` para animaciones de scroll.
8. MIENTRAS `prefers-reduced-motion: reduce` esté activo, LA Mission_Section DEBE mostrar contenido inmediatamente.

### Requisito 5: Sección Visión

**Historia de usuario:** Como visitante, quiero leer la visión del grupo con una presentación visual diferenciada de la misión, para entender las aspiraciones a largo plazo de la comunidad.

#### Criterios de Aceptación

1. LA Vision_Section DEBE mostrar "Visión" como `<h2>` con `id="vision"`.
2. LA Vision_Section DEBE presentar el texto de visión: "Ser la comunidad estudiantil líder en Cloud Computing y tecnologías Cloud Native de la Universidad del Valle, formando talento preparado para afrontar los retos de la industria tecnológica global."
3. LA Vision_Section DEBE incluir un icono SVG decorativo (rocket/telescope o similar) junto al título o en la esquina superior del card, con `aria-hidden="true"` y color diferente al de Misión.
4. LA Vision_Section DEBE aplicar un border-left con gradiente (desde `--sbg-orange` o `--sbg-blue` hasta transparente) de 3–4px para diferenciarse de Misión.
5. LA Vision_Section DEBE incluir un fondo con radial gradient sutil desde una esquina diferente a la de Misión.
6. LA Vision_Section DEBE usar el mismo `rounded-xl`, padding y estructura base que la Mission_Section para cohesión.
7. LA Vision_Section DEBE usar `data-animate` para animaciones de scroll.
8. MIENTRAS `prefers-reduced-motion: reduce` esté activo, LA Vision_Section DEBE mostrar contenido inmediatamente.

### Requisito 6: Sección Redes Sociales

**Historia de usuario:** Como visitante, quiero encontrar todos los canales sociales presentados como tarjetas prominentes, para seguir a la comunidad en mi plataforma preferida.

#### Criterios de Aceptación

1. LA Social_Section DEBE mostrar "Conéctate con nosotros" como `<h2>` con `id` asociado, en un `<section>` con `aria-labelledby`.
2. LA Social_Section DEBE renderizar tarjetas de enlace para: LinkedIn, WhatsApp, Instagram, YouTube y Email con las URLs exactas definidas en `ABOUT_SOCIAL_LINKS`.
3. CUANDO un usuario activa un enlace social, LA Social_Section DEBE abrir la URL en nueva pestaña con `rel="noopener noreferrer"`.
4. CUANDO un usuario activa el enlace de email, LA Social_Section DEBE abrir el cliente de correo via `mailto:`.
5. LA Social_Section DEBE proporcionar `aria-label` con nombre de plataforma y grupo en cada enlace.
6. LA Social_Section DEBE proporcionar un área táctil mínima de 44×44px para cada tarjeta.
7. CADA tarjeta de enlace DEBE mostrar: el icono de la plataforma (tamaño 28–32px), el nombre visible de la plataforma como texto, y un fondo con gradiente sutil específico por plataforma.
8. CADA tarjeta DEBE tener un efecto hover que incluya: elevación (`scale` o `translateY`), glow sutil usando `box-shadow` con color de la plataforma, y transición de borde hacia `--sbg-accent-border`. La duración del hover no DEBE exceder 300ms.
9. CUANDO una tarjeta recibe foco de teclado, LA Social_Section DEBE mostrar un focus indicator visible con ring de 2px en color `--sbg-accent`.
10. LA Social_Section DEBE organizar las tarjetas en un layout de grid responsive: 2–3 columnas en desktop (≥768px), 1–2 columnas en mobile, con gap consistente.
11. LA Social_Section DEBE incluir elementos decorativos de fondo (dot grid o floating shapes sutiles) para dar profundidad a la sección.

### Requisito 7: Sección Call To Action

**Historia de usuario:** Como potencial miembro, quiero ver una invitación visualmente impactante para unirme a la comunidad, que funcione como cierre narrativo de la página.

#### Criterios de Aceptación

1. LA CTA_Section DEBE renderizar en un `<section>` con `aria-labelledby` referenciando el heading, y mostrar "¡Únete a la comunidad!" como `<h2>`.
2. LA CTA_Section DEBE mostrar un párrafo de apoyo de máximo 150 caracteres con la propuesta de valor.
3. LA CTA_Section DEBE renderizar un botón primario con gradiente accent, sombra y hover animation que coincida con el patrón CTA del Navbar, con touch target mínimo de 44×44px.
4. LA CTA_Section DEBE vincular el botón al WhatsApp de la comunidad (via `SITE_CONFIG.social.whatsapp`), abriendo en nueva pestaña.
5. LA CTA_Section DEBE incluir un fondo con radial gradient prominente (naranja/accent sutil) similar al estilo del Hero del Home.
6. LA CTA_Section DEBE incluir al menos 3 floating shapes decorativas con animaciones `float-*` y `aria-hidden="true"`.
7. LA CTA_Section DEBE incluir un dot grid pattern decorativo de fondo.
8. LA CTA_Section DEBE tener un borde superior decorativo con gradiente horizontal (accent → transparente).
9. LA CTA_Section DEBE usar mayor padding vertical (py-24 sm:py-32) para "respirar" como cierre visual.
10. LA CTA_Section DEBE usar `data-animate` para animaciones de entrada.
11. SI el usuario tiene preferencias de reduced-motion, LA CTA_Section DEBE mostrar contenido inmediatamente.

### Requisito 8: Separadores Visuales

**Historia de usuario:** Como visitante, quiero percibir un ritmo visual claro entre secciones, para sentir que la página es un recorrido narrativo y no un bloque monótono.

#### Criterios de Aceptación

1. LA About_Page DEBE incluir un componente Section_Divider entre cada sección principal (Hero→Identity, Identity→Misión/Visión, Misión/Visión→Social, Social→CTA).
2. EL Section_Divider DEBE renderizar una línea horizontal decorativa con gradiente que va del transparente → `--sbg-accent` o `--sbg-border` → transparente.
3. EL Section_Divider DEBE tener un ancho máximo de 50–60% del contenedor, centrado horizontalmente.
4. EL Section_Divider DEBE usar `aria-hidden="true"` ya que es puramente decorativo.
5. EL Section_Divider DEBE tener margin vertical consistente (py-4 o equivalente) para no comprimir las secciones.

### Requisito 9: Diseño Responsive

**Historia de usuario:** Como usuario mobile, quiero que la página About sea usable en mi dispositivo con la misma riqueza visual adaptada al viewport.

#### Criterios de Aceptación

1. LA About_Page DEBE usar layout responsive mobile-first donde los estilos base apuntan a viewports menores a 640px.
2. MIENTRAS el viewport sea menor a 640px, LA About_Page DEBE apilar todas las secciones verticalmente con gap mínimo de 32px.
3. MIENTRAS el viewport sea ≥1024px, LA About_Page DEBE mostrar Misión y Visión en grid de 2 columnas.
4. LA About_Page DEBE usar la clase `container-sbg` para padding y max-width consistentes.
5. LA About_Page DEBE renderizar todo el body text a mínimo 16px en todos los viewports.
6. LA About_Page NO DEBE producir scrollbar horizontal en ningún viewport de 320px a 2560px.
7. MIENTRAS el viewport sea menor a 640px, todos los elementos interactivos DEBEN tener touch target mínimo de 44×44px.
8. EL SVG decorativo del Hero DEBE ocultarse en viewports < 1024px.
9. LAS floating shapes decorativas DEBEN reducir su tamaño y cantidad en mobile.

### Requisito 10: Accesibilidad

**Historia de usuario:** Como usuario de tecnología asistiva, quiero que la página About sea navegable y comprensible, para acceder a todo el contenido de forma equitativa.

#### Criterios de Aceptación

1. LA About_Page DEBE usar elementos HTML semánticos para todas las áreas de contenido.
2. LA About_Page DEBE proporcionar `aria-labelledby` en cada `<section>` referenciando el `id` de su heading.
3. LA About_Page DEBE asegurar que todos los elementos decorativos estén ocultos de tecnología asistiva con `aria-hidden="true"`.
4. LA About_Page DEBE mantener jerarquía lógica de headings (un `<h1>`, seguido de `<h2>` para cada sección).
5. LA About_Page DEBE asegurar indicadores de foco visibles en todos los elementos interactivos.
6. LA About_Page DEBE asegurar contraste de color suficiente (mínimo 4.5:1 para texto normal, 3:1 para texto grande).
7. LA About_Page DEBE ser completamente operable con navegación de teclado.
8. LA About_Page DEBE proporcionar nombres accesibles para todos los enlaces.

### Requisito 11: Consistencia Visual con el Sitio

**Historia de usuario:** Como visitante recurrente, quiero que la página About se sienta parte del mismo sitio web que el Home, con el mismo nivel de calidad visual.

#### Criterios de Aceptación

1. LA About_Page DEBE usar exclusivamente las CSS custom properties definidas en el Design_System.
2. LA About_Page DEBE usar las familias tipográficas: Space Mono para headings y code-labels, Nunito Sans para body.
3. LA About_Page DEBE incorporar al menos 6 elementos geométricos decorativos flotantes distribuidos a lo largo de la página.
4. LA About_Page DEBE aplicar animaciones scroll-triggered con `data-animate` (0.55s, `cubic-bezier(0.22, 1, 0.36, 1)`) y `hero-reveal` (0.65s) para el Hero.
5. LA About_Page DEBE reutilizar BaseLayout, Navbar y Footer sin modificación.
6. LA About_Page DEBE incluir dot grid patterns y radial gradients de fondo consistentes con los del Home.
7. LA About_Page DEBE usar los mismos patrones de hover, sombras y border-radius que el Home.

### Requisito 12: Rendimiento

**Historia de usuario:** Como usuario en conexión lenta, quiero que la página About cargue rápidamente a pesar de los enriquecimientos visuales.

#### Criterios de Aceptación

1. LA About_Page DEBE renderizar como HTML estático en build time con cero JavaScript client-side requerido para mostrar contenido.
2. LA About_Page DEBE usar SVG inline para iconos y elementos decorativos.
3. SI la About_Page incluye imágenes, EL Renderer DEBE optimizarlas con el componente `<Image />` de Astro en formato WebP.
4. LA About_Page DEBE producir un Lighthouse Performance score de 95 o superior en mobile.
5. LA About_Page DEBE tener un transfer size total no mayor a 500 KB en carga inicial.
6. LA About_Page DEBE lograr un LCP menor a 2.5 segundos en mobile.
7. TODOS los elementos decorativos adicionales (gradientes, dot grids, SVGs) DEBEN ser implementados con CSS o SVG inline, sin imágenes raster adicionales.
