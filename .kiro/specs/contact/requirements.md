# Requirements Document

## Introduction

Página "Contacto" (`/contact`) del sitio web del AWS Student Builder Group Universidad del Valle. Esta página presenta al Core Team del grupo con tarjetas interactivas de formato amplio que incluyen avatar prominente (con placeholder de iniciales preparado para imágenes futuras), nombre destacado, cargo, área como badge, y enlaces sociales integrados (LinkedIn, GitHub). El layout principal del Core Team utiliza scroll horizontal con CSS scroll-snap en desktop y mobile, priorizando a las personas como protagonistas visuales. Se integra con el lenguaje visual existente del sitio (tema oscuro, acentos geométricos, labels monospace, tarjetas con gradiente) y cumple WCAG 2.1 AA.

## Glossary

- **Contact_Page**: La ruta `/contact` que presenta al Core Team del grupo estudiantil.
- **Hero_Section**: Banner superior con título "Conoce a nuestro equipo", code-label y párrafo introductorio con elementos decorativos.
- **Core_Team_Section**: Sección que muestra las 5 tarjetas de los integrantes del Core Team con scroll horizontal.
- **TeamMemberCard**: Componente reutilizable (`TeamMemberCard.astro`) que presenta un integrante con avatar grande, nombre prominente, cargo, badge de área y enlaces sociales integrados.
- **Section_Divider**: Elemento separador visual entre secciones, reutilizado del componente existente `SectionDivider.astro`.
- **Design_System**: Conjunto de CSS custom properties, utilidades de espaciado, animaciones y patrones del sitio existente (global.css, BaseLayout, Navbar, Footer).
- **BaseLayout**: Layout raíz que provee Navbar, Footer, SEO tags y estructura HTML base.
- **Core_Team_Data**: Estructura de datos tipada en TypeScript que almacena la información de los integrantes del equipo.
- **Avatar_Placeholder**: Representación visual con iniciales y fondo gradiente que se muestra cuando no existe imagen de perfil.

## Requirements

### Requirement 1: Ruta, SEO e Integración con Layout

**User Story:** Como estudiante que visita el sitio, quiero acceder a la página Contacto en `/contact`, para poder conocer al equipo sin salir de la experiencia establecida del sitio.

#### Acceptance Criteria

1. CUANDO un usuario navega a `/contact`, EL Renderer DEBE mostrar la Contact_Page usando el componente BaseLayout con título "Contacto" y una meta description de entre 120 y 160 caracteres que mencione al equipo del AWS Student Builder Group Univalle.
2. LA Contact_Page DEBE generar el tag `<title>` con el valor exacto "Contacto | AWS SBG Univalle".
3. LA Contact_Page DEBE incluir los componentes Navbar y Footer proporcionados por BaseLayout, verificables como elementos `<nav>` y `<footer>` respectivamente en el DOM renderizado.
4. CUANDO la Contact_Page se muestra, EL Navbar DEBE marcar el enlace "Contacto" (href="/contact") como página activa usando el atributo `aria-current="page"`, y ningún otro enlace del Navbar DEBE tener dicho atributo.
5. CUANDO un usuario activa el skip link, LA Contact_Page DEBE mover el foco del teclado al elemento `<main id="main-content" tabindex="-1">`.
6. LA Contact_Page DEBE renderizar los Open Graph tags con los siguientes valores: `og:title` igual al valor del `<title>`, `og:description` igual al contenido de la meta description, y `og:url` con la URL canónica de la página.
7. LA Contact_Page DEBE componer las secciones en el siguiente orden: Hero_Section → Section_Divider → Core_Team_Section, sin secciones adicionales de Networking ni CTA.

### Requirement 2: Hero Section

**User Story:** Como visitante, quiero ver un heading claro con elementos decorativos cuando aterrice en la página de Contacto, para entender inmediatamente que encontraré información del equipo.

#### Acceptance Criteria

1. LA Hero_Section DEBE renderizarse dentro de un elemento `<section>` con atributo `aria-labelledby` que referencia el `id` del `<h1>`.
2. LA Hero_Section DEBE mostrar un elemento code-label con el texto `# contact.core_team` usando la clase `code-label` del Design_System.
3. LA Hero_Section DEBE renderizar un `<h1>` con el texto "Conoce a nuestro equipo", usando la fuente Space Mono bold y el color de heading (`#f9fafb`).
4. LA Hero_Section DEBE mostrar un párrafo introductorio de entre 80 y 200 caracteres debajo del heading, usando la fuente Nunito Sans y el color `var(--sbg-text-muted)`, que describa brevemente al Core Team.
5. LA Hero_Section DEBE aplicar radial gradients de fondo consistentes con los del About Hero: un gradiente naranja con `rgba(255,153,0,0.08)` en la zona superior y un gradiente azul oscuro con `rgba(35,47,62,0.35)` en la zona inferior derecha.
6. LA Hero_Section DEBE incluir un dot grid pattern decorativo de fondo con `radial-gradient(circle, #fff 1px, transparent 1px)` y opacity de 0.025.
7. LA Hero_Section DEBE renderizar entre 3 y 6 elementos geométricos decorativos flotantes con posicionamiento absoluto y `aria-hidden="true"`, usando las animaciones `float-triangle`, `float-circle`, `float-square` o `float-rhombus` definidas en global.css.
8. LA Hero_Section DEBE incluir un elemento SVG decorativo estático que evoque nodos conectados por líneas con opacity baja (0.08–0.12), posicionado al lado derecho del contenido en desktop y oculto en viewports menores a 1024px.
9. LA Hero_Section DEBE aplicar la clase `hero-animate` a cada elemento de contenido con clases de delay incrementales (`hero-animate-delay-1`, `hero-animate-delay-2`, `hero-animate-delay-3`) para producir animaciones de entrada escalonadas.
10. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Hero_Section DEBE mostrar todo el contenido con `opacity: 1` y sin transformaciones ni animaciones.
11. LA Hero_Section DEBE usar padding vertical reducido (`py-14 lg:py-20`) para minimizar espacio vacío y mantener la composición equilibrada.

### Requirement 3: Estructura de Datos del Core Team

**User Story:** Como desarrollador, quiero que los datos de los integrantes del Core Team estén separados de la presentación en una estructura tipada, para poder mantener y actualizar la información fácilmente.

#### Acceptance Criteria

1. LA Contact_Page DEBE definir los datos del Core Team en una constante tipada con `export const` en el archivo `src/lib/constants.ts`, sin incluir estilos, clases CSS ni markup en los valores de la estructura.
2. CADA integrante en la estructura de datos DEBE contener: nombre completo (`name`: string), cargo/rol (`role`: string), área de responsabilidad (`area`: string), URL de LinkedIn (`linkedin`: string HTTPS), URL de GitHub (`github`: string HTTPS), y un campo opcional de imagen (`image?: string`) para integración futura con S3.
3. LA estructura de datos DEBE incluir exactamente estos 5 integrantes con sus URLs exactas sin modificación:
   - Miguel Ángel Sanclemente Mejía — Team Leader — Logistics & Events Lead — LinkedIn: `https://www.linkedin.com/in/miguel-sanclemente-mejia-1538073a6/` — GitHub: `https://github.com/MiguelSanclemente`
   - Pablo Nicolás Marín González — Team Leader — Partnerships & Academy Lead — LinkedIn: `https://www.linkedin.com/in/pablo-nicolas-marin-gonzalez-33b8042a1/` — GitHub: `https://github.com/Slylem0`
   - Sebastián Cifuentes Flórez — Team Leader — Marketing & Community Lead — LinkedIn: `https://www.linkedin.com/in/sebastian-cifuentes-florez-65872b187/` — GitHub: `https://github.com/SpecTr03`
   - Jann Carlo Martinez — Team Leader — Planning & Monitoring Lead — LinkedIn: `https://www.linkedin.com/in/jann-carlo-martinez-cardona-b1578a2b8/` — GitHub: `https://github.com/JannC23`
   - Aura María Peláez — Team Leader — Tech Lead — LinkedIn: `https://www.linkedin.com/in/aura-maria-pelaez-luna-a0b4a33a8` — GitHub: `https://github.com/aura2025`
4. LA estructura de datos DEBE usar una interfaz TypeScript definida en `src/types/index.ts` que tipifique cada integrante del Core Team con los campos obligatorios mencionados y el campo opcional `image?: string`.
5. CUANDO el campo `image` no esté definido en un integrante, EL componente DEBE generar un Avatar_Placeholder con las iniciales del nombre.

### Requirement 4: Componente TeamMemberCard

**User Story:** Como visitante, quiero ver cada integrante del equipo presentado en una tarjeta visual amplia y atractiva con avatar prominente y enlaces sociales integrados, para conocer quiénes lideran la comunidad y conectar con cada persona directamente.

#### Acceptance Criteria

1. EL TeamMemberCard DEBE ser un componente Astro reutilizable ubicado en `src/components/common/TeamMemberCard.astro` con interface Props tipada que acepte las propiedades de la interfaz `ICoreTeamMember` definida en `src/types/index.ts`.
2. EL TeamMemberCard DEBE renderizar un avatar circular de tamaño prominente (entre 96px y 120px de diámetro) como elemento visual principal de la tarjeta.
3. CUANDO el campo `image` del integrante no esté definido, EL TeamMemberCard DEBE mostrar un Avatar_Placeholder con las iniciales del integrante (primera letra del nombre y primera letra del apellido) sobre un fondo gradiente usando colores del Design_System (`--sbg-accent`, `--sbg-orange`), con tipografía Space Mono bold y tamaño proporcional al avatar.
4. CUANDO el campo `image` del integrante esté definido, EL TeamMemberCard DEBE renderizar la imagen con `aspect-ratio: 1/1`, `border-radius: 50%` y `object-fit: cover`, reemplazando el Avatar_Placeholder.
5. EL TeamMemberCard DEBE mostrar el nombre completo como heading (`<h3>`) con tipografía prominente (mínimo 1.15rem), el cargo ("Team Leader") como texto secundario en color `var(--sbg-text-muted)`, y el área de responsabilidad como badge con estilo pill usando color accent del Design_System.
6. EL TeamMemberCard DEBE renderizar enlaces a LinkedIn y GitHub como iconos SVG integrados visualmente dentro de la tarjeta, con `target="_blank"` y `rel="noopener noreferrer"`, cada uno con área táctil mínima de 44×44px.
7. CADA enlace social DEBE incluir `aria-label` descriptivo con el formato "LinkedIn de [nombre]" o "GitHub de [nombre]".
8. CUANDO un usuario pasa el cursor sobre un enlace social, EL enlace DEBE aplicar una transición de color y fondo con duración máxima de 200ms, mostrando feedback visual claro de interactividad.
9. EL TeamMemberCard DEBE tener un fondo usando `--sbg-bg-surface` con `rounded-xl` y borde de 1px usando `--sbg-border`, con un ancho mínimo entre 320px y 360px para garantizar amplitud visual.
10. CUANDO un usuario pasa el cursor sobre un TeamMemberCard, EL componente DEBE aplicar una transición con: `translateY(-6px)`, incremento de sombra significativo, efecto glow perimetral sutil usando `--sbg-accent-border`, y borde que transiciona a color accent, con duración máxima de 300ms y easing `ease-out`.
11. CUANDO un TeamMemberCard recibe foco de teclado (via tab en los enlaces internos), EL componente DEBE mostrar un focus indicator visible con ring de exactamente 2px en color `--sbg-accent` y outline-offset de 3px.
12. EL TeamMemberCard DEBE incluir al menos un elemento decorativo sutil (gradiente de esquina o línea) con `aria-hidden="true"` que lo diferencie de una tarjeta genérica.
13. EL TeamMemberCard DEBE usar el atributo `data-animate` para animaciones de entrada al scroll.
14. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, EL TeamMemberCard DEBE mostrar su contenido inmediatamente con `opacity: 1` y `transform: none`, sin animación de entrada ni transiciones de hover.

### Requirement 5: Layout de la Sección Core Team con Scroll Horizontal

**User Story:** Como visitante, quiero explorar los integrantes del equipo mediante un scroll horizontal fluido que me permita ver tarjetas amplias centradas en las personas, para tener una experiencia visual moderna con control total de la navegación.

#### Acceptance Criteria

1. LA Core_Team_Section DEBE renderizar exactamente 5 instancias de TeamMemberCard, una por cada integrante definido en Core_Team_Data.
2. LA Core_Team_Section DEBE renderizarse dentro de un elemento `<section>` con `aria-labelledby` referenciando un `<h2>` con texto "Core Team" y un `id` asociado.
3. LA Core_Team_Section DEBE incluir un code-label con el texto `# contact.team` usando la clase `code-label` del Design_System.
4. MIENTRAS el viewport sea ≥1024px (desktop), LA Core_Team_Section DEBE usar un layout de scroll horizontal con CSS `scroll-snap-type: x mandatory` donde las tarjetas tienen un ancho mínimo entre 320px y 360px, mostrando indicadores visuales sutiles de que hay más contenido disponible por scroll.
5. MIENTRAS el viewport sea ≥640px y <1024px (tablet), LA Core_Team_Section DEBE mostrar las tarjetas en un grid de 2 columnas con tarjetas de mayor tamaño que la versión anterior.
6. MIENTRAS el viewport sea <640px (mobile), LA Core_Team_Section DEBE usar scroll horizontal con `scroll-snap-type: x mandatory` mostrando una tarjeta completa y un peek parcial de la siguiente tarjeta para indicar contenido adicional.
7. EL contenedor de scroll DEBE usar `scroll-snap-align: start` en cada tarjeta para que el snap se alinee al inicio de cada card.
8. LA Core_Team_Section NO DEBE implementar carrusel automático ni auto-play. EL control de navegación DEBE ser exclusivamente del usuario.
9. EL contenedor de scroll horizontal DEBE ser accesible con teclado (navegable con Tab entre tarjetas), mouse (drag horizontal), touchpad (scroll horizontal nativo), y gestos touch (swipe).
10. LA Core_Team_Section DEBE usar un gap de 24px entre cards en todos los breakpoints.
11. LA Core_Team_Section DEBE estar envuelta en la clase `container-sbg` para mantener el ancho máximo y padding consistentes.
12. EL contenedor de scroll horizontal DEBE ocultar la scrollbar visualmente manteniendo la funcionalidad accesible (`scrollbar-width: none` y `::-webkit-scrollbar { display: none }`).

### Requirement 6: Preparación para Imágenes S3

**User Story:** Como desarrollador, quiero que la arquitectura del componente soporte imágenes de perfil opcionales desde S3, para poder integrar fotografías reales del equipo en el futuro sin refactorizar el componente.

#### Acceptance Criteria

1. LA interfaz `ICoreTeamMember` en `src/types/index.ts` DEBE incluir un campo opcional `image?: string` que acepte una URL HTTPS apuntando a un recurso de imagen.
2. CUANDO el campo `image` esté definido y contenga una URL válida, EL TeamMemberCard DEBE renderizar un elemento `<img>` con `aspect-ratio: 1/1`, `border-radius: 50%`, `object-fit: cover`, y el mismo tamaño que el Avatar_Placeholder (96-120px).
3. CUANDO el campo `image` no esté definido o sea una cadena vacía, EL TeamMemberCard DEBE renderizar el Avatar_Placeholder con iniciales y fondo gradiente.
4. EL Avatar_Placeholder DEBE usar las iniciales del integrante (primera letra del primer nombre y primera letra del último apellido) en mayúsculas, con fondo `linear-gradient(135deg, var(--sbg-accent), var(--sbg-orange))`, tipografía Space Mono bold, y tamaño de fuente proporcional al contenedor (mínimo 1.75rem para avatar de 96-120px).
5. LA transición entre Avatar_Placeholder e imagen DEBE ser transparente al usuario: ambos estados DEBEN ocupar el mismo espacio visual sin alterar el layout de la tarjeta.

### Requirement 7: Reducción de Espacio Vacío y Composición Visual

**User Story:** Como visitante, quiero percibir una página con composición equilibrada y sin excesos de espacio vacío, para que la experiencia se sienta moderna y compacta.

#### Acceptance Criteria

1. LA Contact_Page DEBE usar espaciados verticales reducidos entre secciones: la Hero_Section con `py-14 lg:py-20` y la Core_Team_Section con `py-12 sm:py-16`.
2. LA Contact_Page DEBE incluir un único Section_Divider entre Hero_Section y Core_Team_Section, usando el componente existente `SectionDivider.astro` sin modificación.
3. LA Contact_Page DEBE incluir elementos decorativos sutiles de fondo (radial gradients con opacidad máxima de 0.08) para estructurar visualmente las áreas de contenido sin crear separaciones vacías.
4. TODOS los elementos decorativos DEBEN incluir `aria-hidden="true"` y la clase `pointer-events-none`.
5. LA composición total de la página (Hero + Divider + Team) DEBE sentirse compacta y centrada en el contenido principal sin secciones adicionales de padding excesivo.

### Requirement 8: Diseño Responsive

**User Story:** Como usuario mobile, quiero que la página de Contacto sea completamente usable y visualmente atractiva en mi dispositivo, con scroll horizontal intuitivo para explorar el equipo.

#### Acceptance Criteria

1. LA Contact_Page DEBE usar layout responsive mobile-first donde los estilos base apuntan a viewports menores a 640px.
2. MIENTRAS el viewport sea menor a 640px, LA Core_Team_Section DEBE mostrar las tarjetas en scroll horizontal con snap, una tarjeta visible completa y un peek parcial de la siguiente (indicando contenido adicional).
3. MIENTRAS el viewport sea ≥640px y <1024px, LOS TeamMemberCards DEBEN disponerse en un grid de 2 columnas con tarjetas amplias.
4. MIENTRAS el viewport sea ≥1024px, LOS TeamMemberCards DEBEN disponerse en scroll horizontal con tarjetas de ancho mínimo 320-360px, mostrando múltiples tarjetas simultáneamente.
5. LA Contact_Page DEBE usar la clase `container-sbg` para aplicar max-width, centrado horizontal y padding lateral responsivo.
6. LA Contact_Page DEBE renderizar todo el body text a mínimo 16px en todos los viewports.
7. LA Contact_Page NO DEBE producir scrollbar horizontal a nivel de página en ningún viewport de 320px a 2560px (el scroll horizontal es exclusivamente dentro del contenedor de tarjetas).
8. MIENTRAS el viewport sea menor a 640px, todos los elementos interactivos DEBEN tener touch target mínimo de 44×44px.
9. EL SVG decorativo del Hero DEBE ocultarse en viewports < 1024px.

### Requirement 9: Accesibilidad

**User Story:** Como usuario de tecnología asistiva, quiero que la página de Contacto sea completamente navegable y comprensible, para acceder a la información del equipo y enlaces sociales de forma equitativa.

#### Acceptance Criteria

1. LA Contact_Page DEBE usar elementos HTML semánticos para todas las áreas de contenido (`<section>`, `<nav>`, `<main>`, `<h1>`–`<h3>`, `<article>`).
2. LA Contact_Page DEBE proporcionar `aria-labelledby` en cada `<section>` referenciando el `id` de su heading.
3. LA Contact_Page DEBE asegurar que todos los elementos decorativos estén ocultos de tecnología asistiva con `aria-hidden="true"`.
4. LA Contact_Page DEBE mantener jerarquía lógica de headings (un `<h1>`, seguido de `<h2>` para secciones, `<h3>` dentro de cards), sin saltar niveles.
5. TODOS los enlaces externos DEBEN ser accesibles por teclado con estados focus visibles usando `focus-visible` con ring de 2px en color `--sbg-accent` y outline-offset de 3px, y DEBEN tener un área táctil mínima de 44×44px.
6. TODOS los enlaces externos DEBEN tener nombres accesibles que incluyan el nombre del integrante y la plataforma destino (vía `aria-label`).
7. LA Contact_Page DEBE asegurar contraste de color mínimo de 4.5:1 para texto normal y mínimo 3:1 para texto grande, según WCAG 2.1 AA.
8. LOS avatares (tanto placeholder con iniciales como imágenes) DEBEN tener `aria-hidden="true"` ya que el nombre completo se presenta como texto visible en la tarjeta.
9. LA Contact_Page DEBE ser completamente operable con navegación de teclado, donde el orden de tabulación sigue el orden visual de lectura sin trampas de foco.
10. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Contact_Page DEBE mostrar todo el contenido inmediatamente sin animaciones ni transiciones.
11. EL contenedor de scroll horizontal DEBE ser navegable con teclado y DEBE exponer su contenido a lectores de pantalla en orden secuencial sin requerir scroll para acceder a la información.

### Requirement 10: Enlaces Externos

**User Story:** Como estudiante, quiero que los enlaces a LinkedIn y GitHub de cada integrante abran correctamente en una nueva pestaña de forma segura.

#### Acceptance Criteria

1. TODOS los enlaces a perfiles externos DEBEN incluir `target="_blank"` y `rel="noopener noreferrer"` para abrir en nueva pestaña de forma segura.
2. TODOS los enlaces DEBEN usar las URLs exactas proporcionadas sin modificación de caracteres, parámetros ni codificación:
   - `https://www.linkedin.com/in/miguel-sanclemente-mejia-1538073a6/`
   - `https://github.com/MiguelSanclemente`
   - `https://www.linkedin.com/in/pablo-nicolas-marin-gonzalez-33b8042a1/`
   - `https://github.com/Slylem0`
   - `https://www.linkedin.com/in/sebastian-cifuentes-florez-65872b187/`
   - `https://github.com/SpecTr03`
   - `https://www.linkedin.com/in/jann-carlo-martinez-cardona-b1578a2b8/`
   - `https://github.com/JannC23`
   - `https://www.linkedin.com/in/aura-maria-pelaez-luna-a0b4a33a8`
   - `https://github.com/aura2025`
3. CADA enlace externo DEBE incluir un elemento `<span>` con clase `sr-only` conteniendo el texto "(abre en nueva pestaña)" para usuarios de tecnología asistiva.
4. CUANDO un usuario activa cualquiera de los enlaces externos, EL navegador DEBE abrir la URL en una nueva pestaña sin reemplazar la pestaña actual.

### Requirement 11: Interacciones y Animaciones

**User Story:** Como visitante, quiero percibir micro-interacciones sutiles y profesionales al explorar la página y las tarjetas del equipo, para sentir que es un sitio moderno y cuidado.

#### Acceptance Criteria

1. LA Contact_Page DEBE aplicar animaciones de entrada al scroll usando `data-animate` con la transición definida en global.css (0.55s, `cubic-bezier(0.22, 1, 0.36, 1)`).
2. LA Hero_Section DEBE usar las animaciones `hero-animate` con delays escalonados aplicados en orden secuencial a los elementos hijos.
3. CUANDO el usuario posiciona el cursor sobre un TeamMemberCard, LA tarjeta DEBE transicionar en un máximo de 300ms hacia: elevación de `translateY(-6px)`, sombra incrementada significativamente, efecto glow perimetral sutil en el borde usando `--sbg-accent-border`, y transición de borde a color accent.
4. CUANDO el usuario posiciona el cursor sobre un enlace social dentro de un TeamMemberCard, EL enlace DEBE aplicar una transición de color y fondo con duración máxima de 200ms, mostrando feedback visual de hover interactivo.
5. MIENTRAS el usuario tenga `prefers-reduced-motion: reduce` activo, LA Contact_Page DEBE prevenir que las clases de animación sean aplicadas a los elementos, mostrando todos los elementos en su estado final visible sin ejecutar animaciones ni transiciones.
6. LA Contact_Page DEBE usar las clases CSS existentes para animaciones (`hero-animate`, `data-animate`, `animate-in`) sin crear nuevas `@keyframes`.
7. CUANDO un elemento con `data-animate` entra en el viewport según el IntersectionObserver, LA Contact_Page DEBE añadir la clase `animate-in` a dicho elemento. La animación DEBE ejecutarse una sola vez.
8. LAS transiciones del TeamMemberCard DEBEN ser suaves y profesionales: sin bouncing, sin escalas exageradas, sin delays perceptibles. EL easing DEBE ser `ease-out` para entradas.

### Requirement 12: Consistencia Visual con el Sitio

**User Story:** Como visitante recurrente, quiero que la página de Contacto se sienta parte del mismo sitio web que Home, About y Resources, con el mismo nivel de calidad visual.

#### Acceptance Criteria

1. LA Contact_Page DEBE usar exclusivamente las CSS custom properties definidas en el Design_System (`--sbg-*`) para colores, fondos y bordes, sin valores de color arbitrarios hardcodeados.
2. LA Contact_Page DEBE usar las familias tipográficas: Space Mono para headings y code-labels, Nunito Sans para body text.
3. LA Contact_Page DEBE incorporar al menos 6 elementos geométricos decorativos flotantes distribuidos a lo largo de la página usando las animaciones definidas en global.css.
4. LA Contact_Page DEBE reutilizar BaseLayout, Navbar, Footer y SectionDivider sin modificación.
5. LA Contact_Page DEBE incluir dot grid patterns de fondo y radial gradients decorativos con los mismos colores y proporciones que Home, About y Resources.
6. LA Contact_Page DEBE usar en sus cards: `rounded-xl` para border-radius, transiciones con easing `ease-out`, y bordes con `--sbg-border`.
7. LA Contact_Page DEBE aplicar el atributo `data-animate` a sus secciones de contenido para activar las animaciones de entrada por scroll.

### Requirement 13: Rendimiento

**User Story:** Como usuario en conexión lenta, quiero que la página de Contacto cargue rápidamente sin JavaScript innecesario.

#### Acceptance Criteria

1. LA Contact_Page DEBE renderizar como HTML estático en build time con cero JavaScript client-side requerido para mostrar contenido.
2. LA Contact_Page DEBE usar SVG inline para iconos y elementos decorativos.
3. LA Contact_Page NO DEBE cargar imágenes raster para avatares mientras el campo `image` no esté definido. LOS Avatar_Placeholder DEBEN generarse con CSS y texto (iniciales).
4. LA Contact_Page DEBE producir un Lighthouse Performance score de 95 o superior en mobile.
5. LA Contact_Page DEBE tener un transfer size total no mayor a 300 KB en carga inicial.
6. LA Contact_Page DEBE lograr un LCP menor a 2.5 segundos en mobile.
7. TODOS los elementos decorativos DEBEN ser implementados con CSS o SVG inline, sin imágenes raster adicionales.
8. LA Contact_Page NO DEBE cargar fuentes, scripts o estilos adicionales más allá de los ya definidos en BaseLayout.

### Requirement 14: Arquitectura de Componentes

**User Story:** Como desarrollador, quiero que la página siga la arquitectura existente del proyecto con una composición simplificada, para mantener consistencia y facilitar el mantenimiento.

#### Acceptance Criteria

1. LA Contact_Page DEBE existir como archivo `src/pages/contact.astro` siguiendo la estructura de routing de Astro.
2. EL componente TeamMemberCard DEBE ubicarse en `src/components/common/TeamMemberCard.astro` para ser reutilizable en otras páginas.
3. LA Contact_Page DEBE usar BaseLayout como layout raíz, y DEBE usar un único SectionDivider entre Hero y Team.
4. LA Contact_Page NO DEBE importar directamente componentes que BaseLayout ya renderiza (Navbar, Footer) ni recrear componentes con funcionalidad equivalente a los existentes.
5. LOS datos del Core Team DEBEN definirse como constante exportada tipada en `src/lib/constants.ts` para ser reutilizables desde otras páginas.
6. LA interfaz TypeScript para los integrantes del Core Team DEBE definirse en `src/types/index.ts` con el nombre `ICoreTeamMember`, incluyendo el campo opcional `image?: string`.
7. LA Contact_Page DEBE usar el alias `@/` para todos los imports internos, sin rutas relativas con `../`.
8. TODOS los componentes DEBEN tipar explícitamente sus Props con `interface Props` en el frontmatter, y no DEBEN exceder 150 líneas totales (incluyendo comentarios, imports y whitespace).
9. TODOS los archivos DEBEN compilar sin errores bajo TypeScript strict mode (`tsc --noEmit` sin errores).
10. EL enlace "Contacto" ya existe en `NAV_LINKS` en `src/lib/constants.ts` con href `/contact`, por lo que NO DEBE agregarse de nuevo.
11. LOS componentes `ContactNetworkingSection.astro` y `ContactCtaSection.astro` DEBEN eliminarse de la composición de la página (ya no se importan ni renderizan). Su eliminación física del repositorio es opcional pero recomendada.
