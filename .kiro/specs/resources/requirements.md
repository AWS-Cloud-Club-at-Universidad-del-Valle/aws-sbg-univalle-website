# Requirements Document

## Introduction

Página "Recursos" (`/resources`) del sitio web del AWS Student Builder Group Universidad del Valle. Esta página ofrece una selección curada de 5 recursos oficiales de AWS para aprender Cloud Computing, presentados como una guía visual que ayuda a estudiantes a entender qué recurso explorar según sus intereses de aprendizaje. Se integra con el lenguaje visual existente del sitio (tema oscuro, acentos geométricos, labels monospace, tarjetas con gradiente) y cumple WCAG 2.1 AA.

## Glossary

- **Resources_Page**: La ruta `/resources` que muestra una guía visual de recursos educativos de AWS.
- **Hero_Section**: Banner superior con título "Recursos", code-label y párrafo introductorio.
- **Resource_Card**: Componente reutilizable (`ResourceCard.astro`) que presenta un recurso individual con icono, nombre, descripción, tipo y enlace externo.
- **Resources_Data**: Estructura de datos tipada en TypeScript que separa la información de los recursos de su presentación visual.
- **Section_Divider**: Elemento separador visual entre secciones, reutilizado del componente existente `SectionDivider.astro`.
- **Design_System**: Conjunto de CSS custom properties, utilidades de espaciado, animaciones y patrones del sitio existente (global.css, BaseLayout, Navbar, Footer).
- **BaseLayout**: Layout raíz que provee Navbar, Footer, SEO tags y estructura HTML base.

## Requirements

### Requirement 1: Ruta, SEO e Integración con Layout

**User Story:** Como estudiante que visita el sitio, quiero acceder a la página Recursos en `/resources`, para poder explorar materiales de aprendizaje AWS sin salir de la experiencia establecida del sitio.

#### Acceptance Criteria

1. CUANDO un usuario navega a `/resources`, EL Renderer DEBE mostrar la Resources_Page usando el componente BaseLayout con título "Recursos" y una meta description de entre 120 y 160 caracteres que mencione recursos AWS para estudiantes.
2. LA Resources_Page DEBE generar el tag `<title>` con el valor exacto "Recursos | AWS SBG Univalle".
3. LA Resources_Page DEBE incluir los componentes Navbar y Footer proporcionados por BaseLayout, verificables como elementos `<nav>` y `<footer>` respectivamente en el DOM renderizado.
4. CUANDO la Resources_Page se muestra, EL Navbar DEBE marcar el enlace "Recursos" (href="/resources") como página activa usando el atributo `aria-current="page"`, y ningún otro enlace del Navbar DEBE tener dicho atributo.
5. CUANDO un usuario activa el skip link, LA Resources_Page DEBE mover el foco del teclado al elemento `<main id="main-content" tabindex="-1">`, verificable porque `document.activeElement` apunta a dicho elemento tras la activación.
6. LA Resources_Page DEBE renderizar los Open Graph tags con los siguientes valores: `og:title` igual al valor del `<title>`, `og:description` igual al contenido de la meta description, y `og:url` con la URL canónica de la página.
7. LA Resources_Page DEBE estructurar su contenido usando al menos un elemento `<section>` con un encabezado (`<h1>` o `<h2>`) como hijo directo o dentro de un contenedor inmediato, cumpliendo la semántica de landmarks ARIA.

### Requirement 2: Hero Section

**User Story:** Como visitante, quiero ver un heading claro cuando aterrice en la página de Recursos, para entender inmediatamente que encontraré materiales educativos de AWS.

#### Acceptance Criteria

1. LA Hero_Section DEBE renderizarse dentro de un elemento `<section>` con atributo `aria-labelledby` que referencia el `id` del `<h1>`, y DEBE mostrar un elemento code-label con el texto `# resources.learn_aws` usando la clase `code-label` del Design_System.
2. LA Hero_Section DEBE renderizar un `<h1>` con el texto "Recursos", un atributo `id` único, usando la fuente Space Mono bold y el color de heading (`#f9fafb`).
3. LA Hero_Section DEBE mostrar un párrafo introductorio de entre 80 y 200 caracteres debajo del heading, usando la fuente Nunito Sans y el color `var(--sbg-text-muted)`, que describa el propósito de los recursos para estudiantes.
4. LA Hero_Section DEBE aplicar radial gradients de fondo consistentes con los del About Hero: un gradiente naranja con `rgba(255,153,0,0.08)` en la zona superior y un gradiente azul oscuro con `rgba(35,47,62,0.35)` en la zona inferior derecha.
5. LA Hero_Section DEBE incluir un dot grid pattern decorativo de fondo con `radial-gradient(circle, #fff 1px, transparent 1px)` y opacity de 0.025, idéntico al patrón del Home y About.
6. LA Hero_Section DEBE renderizar entre 3 y 6 elementos geométricos decorativos flotantes con posicionamiento absoluto y `aria-hidden="true"`, usando las animaciones `float-triangle`, `float-circle`, `float-square` o `float-rhombus` definidas en global.css.
7. LA Hero_Section DEBE aplicar la clase `hero-animate` a cada elemento de contenido (code-label, heading, párrafo) con clases de delay incrementales (`hero-animate-delay-1`, `hero-animate-delay-2`, `hero-animate-delay-3`) para producir animaciones de entrada escalonadas.
8. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Hero_Section DEBE mostrar todo el contenido con `opacity: 1` y sin transformaciones ni animaciones, haciéndolo visible inmediatamente.
9. SI las animaciones CSS no se aplican (el elemento retiene `opacity: 0` por fallo en la carga de estilos o animaciones), ENTONCES LA Hero_Section DEBE garantizar que el contenido sea visible en su posición final mediante estilos de fallback que aseguren `opacity: 1` cuando la animación no se ejecuta.

### Requirement 3: Estructura de Datos de Recursos

**User Story:** Como desarrollador, quiero que los datos de los recursos estén separados de la presentación en una estructura tipada, para poder mantener y actualizar la información fácilmente.

#### Acceptance Criteria

1. LA Resources_Page DEBE definir los datos de los 5 recursos en una constante tipada con `export const` en el archivo `src/lib/constants.ts`, sin incluir estilos, clases CSS ni markup en los valores de la estructura.
2. CADA recurso en la estructura de datos DEBE contener: título (`title`: string), descripción breve (`description`: string, máximo 120 caracteres), URL exacta (`url`: string HTTPS), categoría (`category`: string descriptiva del tipo de recurso), e identificador de icono (`icon`: string).
3. LA estructura de datos DEBE incluir exactamente estos 5 recursos con sus URLs exactas:
   - AWS Skill Builder — `https://skillbuilder.aws/`
   - AWS Academy — `https://aws.amazon.com/es/training/awsacademy/`
   - AWS Certification — `https://aws.amazon.com/es/certification/`
   - AWS Workshops — `https://builder.aws.com/build/workshops?trk=aca14daf-abad-48ab-b076-80aef7f8194d&sc_channel=el&tab=discover`
   - AWS Builder Center — `https://bit.ly/45y5hpA`
4. LA estructura de datos DEBE usar una interfaz TypeScript definida en `src/types/index.ts` que tipifique cada recurso con los campos obligatorios mencionados.
5. CADA recurso DEBE asignar al campo `category` un valor descriptivo que represente la naturaleza del recurso (ejemplo: "Plataforma de aprendizaje", "Programa académico", "Certificación", "Laboratorios prácticos", "Centro de construcción").

### Requirement 4: Componente Resource Card

**User Story:** Como visitante, quiero ver cada recurso presentado en una tarjeta visual atractiva con información clara, para decidir rápidamente cuál explorar.

#### Acceptance Criteria

1. EL Resource_Card DEBE ser un componente Astro reutilizable ubicado en `src/components/common/ResourceCard.astro` con interface Props tipada que acepte las propiedades de la interfaz de recurso definida en `src/types/index.ts`.
2. EL Resource_Card DEBE renderizar: un icono SVG correspondiente al recurso, el nombre del recurso como heading (`<h3>`), una descripción breve limitada a un máximo de 120 caracteres visibles, un badge que muestre la categoría del recurso, y un enlace para visitar el recurso.
3. SI la propiedad `icon` no está definida, ENTONCES EL Resource_Card DEBE renderizar un icono genérico por defecto como elemento visual diferenciador.
4. EL Resource_Card DEBE tener un fondo usando `--sbg-bg-surface` con `rounded-xl` y borde de 1px usando `--sbg-border`.
5. CUANDO un usuario pasa el cursor sobre un Resource_Card, EL componente DEBE aplicar una transición con `translateY(-2px)` y un incremento de sombra, con duración máxima de 300ms y easing `ease-out`.
6. EL Resource_Card DEBE incluir un enlace con `target="_blank"` y `rel="noopener noreferrer"` que apunte a la URL del recurso, con un área táctil mínima de 44×44px.
7. EL Resource_Card DEBE mostrar un icono SVG de "enlace externo" (flecha diagonal) de 16px junto al texto del enlace.
8. EL Resource_Card DEBE mostrar un badge que indique la categoría del recurso usando el valor textual del campo `category`, diferenciado visualmente de los demás elementos mediante contraste de fondo.
9. EL Resource_Card DEBE usar el atributo `data-animate` para animaciones de entrada al scroll, siguiendo el patrón definido en `global.css`.
10. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, EL Resource_Card DEBE mostrar su contenido inmediatamente con `opacity: 1` y `transform: none`, sin animación de entrada ni transición de hover.

### Requirement 5: Layout de Cards de Recursos

**User Story:** Como visitante, quiero ver los 5 recursos organizados en una composición visual clara y atractiva, para tener una visión de conjunto de todas las opciones disponibles.

#### Acceptance Criteria

1. LA Resources_Page DEBE renderizar exactamente 5 instancias de Resource_Card, una por cada recurso definido en la estructura de datos del Requisito 3.
2. MIENTRAS el viewport sea ≥1024px, LA sección de cards DEBE usar un layout de grid de 3 columnas donde la primera fila muestra 3 cards y la segunda fila muestra 2 cards centradas horizontalmente en el espacio disponible.
3. MIENTRAS el viewport sea ≥640px y <1024px, LA sección de cards DEBE mostrar los recursos en un grid de 2 columnas.
4. MIENTRAS el viewport sea <640px, LA sección de cards DEBE apilar los recursos en una sola columna.
5. LA sección de cards DEBE usar un gap de 24px entre cards en todos los breakpoints.
6. LA sección de cards DEBE estar envuelta en la clase `container-sbg` para mantener el ancho máximo y padding consistentes con el resto del sitio.
7. LA sección de cards DEBE incluir un heading `<h2>` con el texto "Explora los recursos" y un `id` asociado para `aria-labelledby`, precedido de un code-label con el texto `# resources.explore` usando la clase `code-label` del Design_System.
8. LA sección de cards DEBE renderizar como un elemento `<section>` con atributo `aria-labelledby` referenciando el `id` del heading `<h2>`.

### Requirement 6: Separadores Visuales

**User Story:** Como visitante, quiero percibir un ritmo visual claro entre el Hero y las Cards, para sentir que la página tiene una estructura coherente.

#### Acceptance Criteria

1. LA Resources_Page DEBE incluir al menos un componente Section_Divider entre el Hero y la sección de cards.
2. EL Section_Divider DEBE ser el componente existente `SectionDivider.astro` reutilizado sin modificación.
3. LA Resources_Page DEBE incluir elementos decorativos de fondo entre secciones utilizando radial gradients con opacidad máxima de 0.08 y un patrón de puntos (dot grid) de 36×36px, de modo que no exista ningún bloque de fondo sin al menos un elemento decorativo visible entre el Hero y la sección de cards.
4. LA Resources_Page DEBE reutilizar los mismos elementos visuales presentes en Home y About: radial gradients posicionados con las variables CSS del proyecto (`--sbg-orange`, `--sbg-accent`), patrón de puntos con `background-size: 36px 36px`, y al menos una forma geométrica flotante animada con las keyframes existentes (`float-triangle`, `float-square`, `float-circle` o `float-rhombus`).
5. TODOS los elementos decorativos de fondo y formas geométricas DEBEN incluir los atributos `aria-hidden="true"` y la clase `pointer-events-none` para no interferir con la accesibilidad ni la interacción del usuario.

### Requirement 7: Diseño Responsive

**User Story:** Como usuario mobile, quiero que la página de Recursos sea completamente usable y visualmente atractiva en mi dispositivo.

#### Acceptance Criteria

1. LA Resources_Page DEBE usar layout responsive mobile-first donde los estilos base apuntan a viewports menores a 640px.
2. MIENTRAS el viewport sea menor a 640px, LA Resources_Page DEBE apilar todas las secciones y cards verticalmente en una sola columna con un gap vertical de 16px entre cards.
3. LA Resources_Page DEBE usar la clase `container-sbg` para aplicar max-width, centrado horizontal y padding lateral responsivo.
4. LA Resources_Page DEBE renderizar todo el body text a mínimo 16px en todos los viewports.
5. LA Resources_Page NO DEBE producir scrollbar horizontal en ningún viewport de 320px a 2560px.
6. MIENTRAS el viewport sea menor a 640px, todos los elementos interactivos DEBEN tener touch target mínimo de 44×44px.
7. MIENTRAS el viewport sea ≥1024px (Desktop), LOS Resource_Cards DEBEN disponerse en un grid de 3 columnas con gap de 24px entre cards.
8. MIENTRAS el viewport sea entre 640px y 1023px (Tablet), LOS Resource_Cards DEBEN disponerse en un grid de 2 columnas con gap de 24px entre cards.
9. SI un elemento dentro de un Resource_Card excede el ancho disponible del contenedor, ENTONCES LA Resources_Page DEBE escalar dicho elemento proporcionalmente al 100% del ancho del contenedor sin desbordamiento.

### Requirement 8: Accesibilidad

**User Story:** Como usuario de tecnología asistiva, quiero que la página de Recursos sea completamente navegable y comprensible, para acceder a todos los enlaces y descripciones de forma equitativa.

#### Acceptance Criteria

1. LA Resources_Page DEBE usar elementos HTML semánticos para todas las áreas de contenido (`<section>`, `<nav>`, `<main>`, `<h1>`–`<h3>`).
2. LA Resources_Page DEBE proporcionar `aria-labelledby` en cada `<section>` referenciando el `id` de su heading.
3. LA Resources_Page DEBE asegurar que todos los elementos decorativos estén ocultos de tecnología asistiva con `aria-hidden="true"`.
4. LA Resources_Page DEBE mantener jerarquía lógica de headings (un `<h1>`, seguido de `<h2>` para secciones, `<h3>` dentro de cards si aplica), sin saltar niveles.
5. TODOS los enlaces externos DEBEN ser accesibles por teclado con estados focus visibles usando `focus-visible` con ring de 2px en color `--sbg-accent` y outline-offset de 3px, y DEBEN tener un área táctil mínima de 44×44px.
6. TODOS los enlaces externos DEBEN tener nombres accesibles que incluyan el nombre del recurso y una indicación de que abren en nueva pestaña (vía `aria-label` o texto oculto con `sr-only`).
7. LA Resources_Page DEBE asegurar contraste de color mínimo de 4.5:1 para texto normal (menor a 18px bold o menor a 24px regular) y mínimo 3:1 para texto grande (≥18px bold o ≥24px regular), según WCAG 2.1 AA.
8. LA Resources_Page NO DEBE depender exclusivamente del color para transmitir información; los tipos de recurso DEBEN ser identificables por texto además de color.
9. TODOS los iconos informativos DEBEN tener alternativas accesibles (texto visible o `aria-label`). Los iconos puramente decorativos DEBEN tener `aria-hidden="true"`.
10. LA Resources_Page DEBE ser completamente operable con navegación de teclado, donde el orden de tabulación sigue el orden visual de lectura (arriba a abajo, izquierda a derecha) sin trampas de foco.
11. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Resources_Page DEBE mostrar todo el contenido inmediatamente sin animaciones ni transiciones.
12. SI un elemento interactivo recibe foco de teclado, LA Resources_Page DEBE mostrar un indicador de foco visible con contraste mínimo de 3:1 respecto al fondo adyacente.

### Requirement 9: Enlaces Externos

**User Story:** Como estudiante, quiero que los enlaces a los recursos abran correctamente en una nueva pestaña de forma segura, para no perder mi lugar en la página del grupo.

#### Acceptance Criteria

1. TODOS los enlaces a recursos externos DEBEN incluir `target="_blank"` y `rel="noopener noreferrer"` para abrir en nueva pestaña de forma segura. Los enlaces externos son exclusivamente los siguientes:
   - `https://skillbuilder.aws/`
   - `https://aws.amazon.com/es/training/awsacademy/`
   - `https://aws.amazon.com/es/certification/`
   - `https://builder.aws.com/build/workshops?trk=aca14daf-abad-48ab-b076-80aef7f8194d&sc_channel=el&tab=discover`
   - `https://bit.ly/45y5hpA`
2. TODOS los enlaces externos DEBEN usar las URLs exactas listadas en el criterio 1 sin modificación de caracteres, parámetros ni codificación.
3. CADA enlace externo DEBE mostrar un icono de enlace externo de 16px posicionado inmediatamente después del texto del enlace, con `aria-hidden="true"`, para comunicar visualmente que abrirá una nueva pestaña.
4. CADA enlace externo DEBE incluir un elemento `<span>` con clase `sr-only` conteniendo el texto "(abre en nueva pestaña)" al final del enlace, para que los usuarios de tecnología asistiva conozcan el comportamiento antes de activarlo.
5. CUANDO un usuario activa cualquiera de los enlaces externos, EL navegador DEBE abrir la URL en una nueva pestaña sin reemplazar ni redirigir la pestaña actual de la Resources_Page.

### Requirement 10: Interacciones y Animaciones

**User Story:** Como visitante, quiero percibir micro-interacciones sutiles al explorar la página, para sentir que es un sitio moderno y cuidado sin que las animaciones distraigan.

#### Acceptance Criteria

1. LA Resources_Page DEBE aplicar animaciones de entrada al scroll usando `data-animate` con la transición definida en global.css (0.55s, `cubic-bezier(0.22, 1, 0.36, 1)`). Los elementos DEBEN iniciar con `opacity: 0` y `translateY(24px)`, y transicionar a `opacity: 1` y `translateY(0)` cuando reciban la clase `animate-in`.
2. LA Hero_Section DEBE usar las animaciones `hero-animate` con delays escalonados (delay-1 a delay-4, correspondientes a 0.06s, 0.16s, 0.28s y 0.42s) aplicados en orden secuencial a los elementos hijos del hero.
3. CUANDO el usuario posiciona el cursor sobre una Resource_Card, LA Resource_Card DEBE transicionar en un máximo de 300ms hacia: un borde con mayor opacidad o color diferenciado del estado default, una elevación de translateY(-2px), y una sombra con mayor difusión que el estado de reposo.
4. CUANDO el usuario posiciona el cursor sobre un botón o enlace dentro de una Resource_Card, EL botón/enlace DEBE aplicar una transición de color de texto o color de fondo con una duración máxima de 300ms.
5. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Resources_Page DEBE mostrar todos los elementos en su estado final visible (`opacity: 1`, `transform: none`) sin ejecutar animaciones ni transiciones (duración efectiva de 0ms).
6. LA Resources_Page DEBE usar las clases CSS existentes para animaciones (`hero-animate`, `data-animate`, `animate-in`) sin crear nuevas `@keyframes`.
7. CUANDO un elemento con `data-animate` entra en el viewport según el IntersectionObserver, LA Resources_Page DEBE añadir la clase `animate-in` a dicho elemento. La animación DEBE ejecutarse una sola vez y no revertirse al salir del viewport.

### Requirement 11: Identidad Visual por Recurso

**User Story:** Como estudiante que descubre Cloud Computing, quiero que cada recurso tenga un elemento visual único que lo diferencie de los demás, para crear asociación visual y recordar mejor qué ofrece cada uno.

#### Acceptance Criteria

1. CADA Resource_Card DEBE tener un elemento visual diferenciador compuesto por un icono SVG inline único Y un color de acento asignado de entre los colores del Design_System.
2. LOS elementos visuales DEBEN usar exclusivamente los colores del Design_System existente (`--sbg-accent`, `--sbg-orange`, `--sbg-blue`, `--sbg-success`) sin introducir colores arbitrarios nuevos; dado que hay 5 recursos y 4 colores disponibles, un mismo color PUEDE asignarse a un máximo de 2 recursos siempre que sus iconos sean distintos.
3. LOS iconos DEBEN ser SVG inline (no imágenes externas) con `aria-hidden="true"` y un viewBox cuadrado cuyas dimensiones de renderizado (width y height) estén entre 24px y 40px.
4. CADA uno de los 5 recursos DEBE usar una forma de icono SVG visualmente distinta de las otras 4, de modo que la diferenciación NO dependa exclusivamente del color; las formas DEBEN evocar la categoría del recurso (ejemplo: birrete para aprendizaje, insignia para certificación, herramienta para laboratorios).
5. LOS elementos visuales NO DEBEN descargar ni copiar logotipos o iconos de marca de terceros; DEBEN usar iconografía genérica representativa de la categoría del recurso.

### Requirement 12: Consistencia Visual con el Sitio

**User Story:** Como visitante recurrente, quiero que la página de Recursos se sienta parte del mismo sitio web que el Home y About, con el mismo nivel de calidad visual.

#### Acceptance Criteria

1. LA Resources_Page DEBE usar exclusivamente las CSS custom properties definidas en el Design_System (`--sbg-*`) para colores, fondos y bordes, sin valores de color arbitrarios hardcodeados.
2. LA Resources_Page DEBE usar las familias tipográficas: Space Mono para headings y code-labels, Nunito Sans para body text.
3. LA Resources_Page DEBE incorporar al menos 3 elementos geométricos decorativos flotantes (triángulos, círculos, cuadrados o rombos) usando las animaciones definidas en global.css (`float-triangle`, `float-square`, `float-circle`, `float-rhombus`), distribuidos en distintas secciones de la página.
4. LA Resources_Page DEBE reutilizar BaseLayout, Navbar, Footer y SectionDivider sin modificación.
5. LA Resources_Page DEBE incluir dot grid patterns de fondo (`radial-gradient(circle,#fff 1px,transparent 1px)` con `background-size:36px 36px` y `opacity-[0.025]`) y radial gradients decorativos con los mismos colores y proporciones que el Home y About (`rgba(255,153,0,0.08)` y `rgba(35,47,62,0.35)`).
6. LA Resources_Page DEBE usar en sus cards y elementos interactivos: `rounded-xl` para border-radius, `shadow-sm` por defecto con `shadow-md` en hover, y `transition-shadow duration-200` como transición estándar.
7. LA Resources_Page DEBE integrar la ruta `/resources` en la navegación existente (el enlace "Recursos" ya existe en `NAV_LINKS`) y el Navbar DEBE mostrar el indicador de página activa cuando el usuario se encuentre en dicha ruta.
8. LA Resources_Page DEBE aplicar el atributo `data-animate` a sus secciones de contenido para activar las animaciones de entrada por scroll (fade-in con translateY) provistas por el IntersectionObserver del BaseLayout.

### Requirement 13: Rendimiento

**User Story:** Como usuario en conexión lenta, quiero que la página de Recursos cargue rápidamente sin JavaScript innecesario.

#### Acceptance Criteria

1. LA Resources_Page DEBE renderizar como HTML estático en build time con cero JavaScript client-side requerido para mostrar contenido.
2. LA Resources_Page DEBE usar SVG inline para iconos y elementos decorativos.
3. LA Resources_Page DEBE producir un Lighthouse Performance score de 95 o superior en mobile.
4. LA Resources_Page DEBE tener un transfer size total (HTML + CSS + fonts compartidos) no mayor a 300 KB en carga inicial.
5. LA Resources_Page DEBE lograr un LCP menor a 2.5 segundos en mobile.
6. TODOS los elementos decorativos (gradientes, dot grids, SVGs, floating shapes) DEBEN ser implementados con CSS o SVG inline, sin imágenes raster adicionales.
7. LA Resources_Page NO DEBE cargar fuentes, scripts o estilos adicionales más allá de los ya definidos en BaseLayout.

### Requirement 14: Arquitectura de Componentes

**User Story:** Como desarrollador, quiero que la página siga la arquitectura existente del proyecto, para mantener consistencia y facilitar el mantenimiento.

#### Acceptance Criteria

1. LA Resources_Page DEBE crearse como archivo `src/pages/resources.astro` siguiendo la estructura de routing de Astro.
2. EL componente Resource_Card DEBE ubicarse en `src/components/common/ResourceCard.astro` para ser reutilizable en otras páginas.
3. LA Resources_Page DEBE usar BaseLayout como layout raíz (el cual ya provee Navbar y Footer), y DEBE usar SectionDivider para separar secciones de contenido cuando sea necesario.
4. LA Resources_Page NO DEBE importar directamente componentes que BaseLayout ya renderiza (Navbar, Footer) ni recrear componentes con funcionalidad equivalente a los existentes en `src/components/`.
5. LOS datos de recursos DEBEN definirse como constante exportada tipada en `src/lib/constants.ts` si son reutilizables desde otras páginas, o como constante local en el frontmatter de la página si son exclusivos de la Resources_Page.
6. LA Resources_Page DEBE usar el alias `@/` para todos los imports internos, sin rutas relativas con `../`.
7. TODOS los componentes nuevos DEBEN tipar explícitamente sus Props con `interface Props` en el frontmatter, y no DEBEN exceder 150 líneas de código; si se exceden, DEBEN extraerse subcomponentes.
8. TODOS los archivos nuevos DEBEN compilar sin errores bajo TypeScript strict mode (`tsc --noEmit` sin errores).
