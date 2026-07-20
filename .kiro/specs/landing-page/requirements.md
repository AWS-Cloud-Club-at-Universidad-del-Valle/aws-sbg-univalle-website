# Requirements Document

## Introduction

Este documento define los requisitos funcionales y no funcionales de la Landing Page (`/`) del sitio web oficial del AWS Student Builder Group de la Universidad del Valle. Se derivan del documento de diseño y los steering files del proyecto (`tech.md`, `ui.md`, `product.md`).

La Landing Page es el punto de entrada principal para estudiantes, profesores y empresas. Debe presentar el grupo, sus actividades y facilitar la incorporación de nuevos miembros, cumpliendo con los estándares de performance (Lighthouse ≥ 95), accesibilidad (WCAG 2.1 AA) y SEO del proyecto.

## Requirements

### Requisito 1: Layout Base y SEO

**Descripción**: La página debe tener estructura HTML semántica completa con metadatos SEO, skip link de accesibilidad y JSON-LD Organization.

**Criterios de Aceptación**:

1. DADO que se carga la página `/`, CUANDO se inspecciona el `<head>`, ENTONCES debe contener exactamente un `<title>`, un `<meta name="description">`, una URL canónica (`<link rel="canonical">`), y etiquetas Open Graph (`og:title`, `og:description`, `og:image`, `og:url`).

2. DADO que se carga la página, CUANDO se inspecciona el `<head>`, ENTONCES debe existir un bloque `<script type="application/ld+json">` con `@type: "Organization"` y los campos `name`, `url`, `logo`.

3. DADO que se carga la página, CUANDO se inspecciona el inicio del `<body>`, ENTONCES el primer elemento interactivo debe ser un skip link `<a href="#main-content">` con texto "Ir al contenido principal".

4. DADO que se carga la página, CUANDO se busca el elemento principal, ENTONCES debe existir exactamente un `<main id="main-content">` en el DOM.

5. DADO que se carga la página, CUANDO se inspeccionan los `<link rel="preload">`, ENTONCES deben existir preloads para las fuentes Plus Jakarta Sans 700 e Inter 400 con `as="font"` y `crossorigin`.


---

### Requisito 2: Navbar Responsive

**Descripción**: El Navbar debe ser visible en todo momento, funcionar en mobile con menú hamburger y ser completamente navegable por teclado.

**Criterios de Aceptación**:

1. DADO que se visualiza en desktop (≥ 1024px), CUANDO se carga la página, ENTONCES el Navbar debe mostrar el logo y todos los links de navegación en línea horizontal con altura de 72px.

2. DADO que se visualiza en mobile (< 768px), CUANDO se carga la página, ENTONCES el Navbar debe mostrar solo el logo y el botón hamburger con altura de 64px.

3. DADO que se está en mobile, CUANDO el usuario hace clic en el botón hamburger, ENTONCES debe abrirse un drawer lateral con todos los links y `aria-expanded` del botón debe cambiar a `"true"`.

4. DADO que el menú mobile está abierto, CUANDO el usuario hace clic en un link de navegación, ENTONCES el drawer debe cerrarse, `aria-expanded` vuelve a `"false"` y el foco retorna al botón hamburger.

5. DADO que el usuario hace scroll, CUANDO el Navbar está visible, ENTONCES debe permanecer sticky (`position: sticky; top: 0`) con z-index superior al contenido.

6. DADO que el menú mobile está abierto, CUANDO el usuario presiona Escape, ENTONCES el drawer debe cerrarse y el foco debe retornar al botón hamburger.

7. DADO que el Navbar está visible, CUANDO el usuario navega con Tab, ENTONCES todos los links deben recibir foco en orden lógico con `focus-visible` estilos visibles (ring naranja `#FF9900`).

---

### Requisito 3: Sección Hero

**Descripción**: La sección Hero debe comunicar la propuesta de valor del grupo y ofrecer dos CTAs claros.

**Criterios de Aceptación**:

1. DADO que se carga la página, CUANDO se visualiza el Hero, ENTONCES debe mostrar: un `<h1>` con el headline, un subtítulo, un CTA primario (botón naranja `#FF9900`) y un CTA secundario (botón con borde azul `#003087`).

2. DADO que se inspecciona la imagen del Hero, CUANDO se verifica el HTML, ENTONCES debe estar renderizada con `<Image />` de astro:assets, tener `fetchpriority="high"`, sin `loading="lazy"`, y con `alt` descriptivo no vacío.

3. DADO que se visualiza en mobile (< 768px), CUANDO se inspecciona el layout Hero, ENTONCES el texto y CTAs deben estar apilados verticalmente y ser legibles sin scroll horizontal.

4. DADO que se visualiza en desktop (≥ 1024px), CUANDO se inspecciona el layout Hero, ENTONCES imagen y texto deben estar en layout de dos columnas.

5. DADO que el usuario hace clic en el CTA primario, CUANDO se resuelve la navegación, ENTONCES debe desplazarse a la sección `#cta` de la misma página.


---

### Requisito 4: Sección Quiénes Somos

**Descripción**: Presentar el grupo con su descripción, misión y visión.

**Criterios de Aceptación**:

1. DADO que se visualiza la sección, CUANDO se inspecciona su HTML, ENTONCES debe usar `<section>` con `aria-labelledby` apuntando al `id` de su `<h2>`.

2. DADO que se visualiza la sección, CUANDO se lee el contenido, ENTONCES debe incluir descripción del grupo, un bloque de Misión y un bloque de Visión claramente diferenciados.

3. DADO que la sección entra en el viewport, CUANDO se activa el IntersectionObserver, ENTONCES los elementos con `data-animate` deben recibir la clase `animate-in` con transición `fade-in` o `slide-up`.

---

### Requisito 5: Sección Beneficios

**Descripción**: Mostrar los beneficios de unirse al grupo en un grid de cards iconográficas.

**Criterios de Aceptación**:

1. DADO que se visualiza la sección, CUANDO se cuentan los beneficios, ENTONCES deben mostrarse entre 4 y 8 beneficios.

2. DADO que se visualiza en mobile, CUANDO se inspecciona el grid, ENTONCES las cards deben estar en una columna.

3. DADO que se visualiza en desktop (≥ 1024px), CUANDO se inspecciona el grid, ENTONCES las cards deben estar en 3 columnas.

4. DADO que cada card tiene un icono, CUANDO se inspecciona el HTML, ENTONCES el icono decorativo debe tener `aria-hidden="true"` y el texto del beneficio debe ser legible por lectores de pantalla.

---

### Requisito 6: Sección Estadísticas con Contadores Animados

**Descripción**: Mostrar métricas clave del grupo con animación de conteo al entrar en el viewport.

**Criterios de Aceptación**:

1. DADO que la sección entra en el viewport, CUANDO se activa el contador, ENTONCES cada número debe animarse de 0 al valor final en aproximadamente 2 segundos con easing ease-out.

2. DADO que el usuario tiene `prefers-reduced-motion: reduce` activo, CUANDO la sección es visible, ENTONCES los números deben mostrarse directamente en su valor final sin animación.

3. DADO que un contador tiene `suffix` definido (ej: '+'), CUANDO la animación completa, ENTONCES el display final debe ser `valor + suffix` (ej: "150+").

4. DADO que se visualiza la sección, CUANDO se cuentan los estadísticos, ENTONCES deben mostrarse entre 3 y 6 métricas en grid responsivo.

5. DADO que se inspecciona el componente `StatCounter`, CUANDO se verifica la hidratación, ENTONCES debe usar `client:visible` para no bloquear el hilo principal en carga inicial.


---

### Requisito 7: Sección Próximos Eventos

**Descripción**: Mostrar cards de los próximos eventos con información relevante y CTA de registro.

**Criterios de Aceptación**:

1. DADO que existen eventos próximos, CUANDO se renderiza la sección, ENTONCES deben mostrarse máximo 3 eventos ordenados por fecha ascendente.

2. DADO que un evento tiene `registrationUrl`, CUANDO se inspecciona su card, ENTONCES debe mostrar un botón/link "Registrarse" con `target="_blank"` y `rel="noopener noreferrer"`.

3. DADO que no hay eventos próximos, CUANDO se renderiza la sección, ENTONCES debe mostrar un estado vacío con mensaje informativo y link a redes sociales, sin errores de render.

4. DADO que un evento tiene imagen, CUANDO se inspecciona el HTML, ENTONCES la imagen debe usar `<Image />` de astro:assets con `loading="lazy"` y `alt` descriptivo.

5. DADO que se visualiza en mobile, CUANDO se inspeccionan las cards, ENTONCES deben estar en 1 columna; en tablet (≥ 768px) en 2 columnas; en desktop (≥ 1024px) en 3 columnas.

---

### Requisito 8: Sección Integrantes Principales

**Descripción**: Mostrar cards del equipo directivo con foto, nombre, cargo y links de redes.

**Criterios de Aceptación**:

1. DADO que se visualiza la sección, CUANDO se cuentan las cards, ENTONCES deben mostrarse entre 3 y 8 miembros del equipo directivo.

2. DADO que un miembro tiene `photo`, CUANDO se renderiza su card, ENTONCES la foto debe usar `<Image />` con `loading="lazy"` y `alt` descriptivo (ej: "Foto de [nombre]").

3. DADO que un miembro no tiene `photo`, CUANDO se renderiza su card, ENTONCES debe mostrarse un avatar placeholder con las iniciales del nombre sobre fondo `--sbg-bg-muted`.

4. DADO que un miembro tiene `linkedin` o `github`, CUANDO se inspecciona su card, ENTONCES los links deben tener `aria-label` descriptivo (ej: "LinkedIn de [nombre]") y `rel="noopener noreferrer"`.

5. DADO que se visualiza en mobile, CUANDO se inspecciona el grid, ENTONCES cards en 1 columna; en tablet en 2 columnas; en desktop en 3-4 columnas.


---

### Requisito 9: Sección Partners

**Descripción**: Mostrar logos de partners y sponsors con enlaces opcionales.

**Criterios de Aceptación**:

1. DADO que se visualiza la sección, CUANDO se inspeccionan los logos, ENTONCES cada logo debe usar `<Image />` de astro:assets con `loading="lazy"` y `alt` que incluya el nombre del partner.

2. DADO que un partner tiene `url`, CUANDO se inspecciona su elemento, ENTONCES el logo debe estar en un `<a>` con `href`, `target="_blank"`, `rel="noopener noreferrer"`, y `aria-label="Visitar sitio de [nombre]"`.

3. DADO que un partner no tiene `url`, CUANDO se inspecciona su elemento, ENTONCES el logo debe renderizarse como imagen estática sin `<a>`.

4. DADO que se visualiza la sección en cualquier breakpoint, CUANDO se inspeccionan los logos, ENTONCES deben estar en grid/flex centrado y visualmente equilibrado.

---

### Requisito 10: Sección Recursos

**Descripción**: Mostrar links a materiales de aprendizaje AWS categorizados.

**Criterios de Aceptación**:

1. DADO que se visualiza la sección, CUANDO se cuentan los recursos, ENTONCES deben mostrarse entre 3 y 6 recursos destacados.

2. DADO que un recurso tiene `isExternal: true`, CUANDO se inspecciona su link, ENTONCES debe tener `target="_blank"` y `rel="noopener noreferrer"` con `aria-label` que incluya "(abre en nueva pestaña)".

3. DADO que se visualiza la sección, CUANDO se inspeccionan las cards, ENTONCES cada card debe mostrar visualmente la categoría del recurso (ej: "Documentación", "Curso", "Certificación").

4. DADO que se visualiza en mobile, CUANDO se inspecciona el grid, ENTONCES cards en 1 columna; en tablet en 2 columnas; en desktop en 3 columnas.

---

### Requisito 11: Sección Call To Action

**Descripción**: Sección final que invita a unirse al grupo con CTA prominente.

**Criterios de Aceptación**:

1. DADO que se visualiza la sección CTA, CUANDO se inspecciona el contenido, ENTONCES debe mostrar un heading motivacional, un párrafo de apoyo y al menos un botón CTA primario.

2. DADO que el usuario hace clic en el CTA, CUANDO se resuelve la navegación, ENTONCES debe llevar a formulario de contacto o link a WhatsApp/redes (configurado en constantes).

3. DADO que se inspecciona la sección, CUANDO se verifica el elemento, ENTONCES debe tener `id="cta"` para el anchor del Hero CTA primario.

4. DADO que se visualiza la sección, CUANDO se verifica el contraste, ENTONCES la relación texto/fondo debe ser ≥ 4.5:1 para texto normal.


---

### Requisito 12: Footer

**Descripción**: Footer con links de navegación, redes sociales y créditos.

**Criterios de Aceptación**:

1. DADO que se visualiza el Footer, CUANDO se inspecciona su HTML, ENTONCES debe usar el elemento semántico `<footer role="contentinfo">`.

2. DADO que se visualiza el Footer, CUANDO se inspecciona el contenido, ENTONCES debe incluir: logo, links de navegación secundaria, links a redes sociales, y texto de créditos/copyright.

3. DADO que el Footer tiene links a redes sociales, CUANDO se inspeccionan los links, ENTONCES cada uno debe tener `aria-label` descriptivo y `rel="noopener noreferrer"`.

4. DADO que se visualiza en mobile, CUANDO se inspecciona el Footer, ENTONCES las columnas deben estar apiladas verticalmente; en desktop en layout horizontal.

---

### Requisito 13: Accesibilidad WCAG 2.1 AA

**Descripción**: La página completa debe cumplir el nivel AA de WCAG 2.1.

**Criterios de Aceptación**:

1. DADO que se ejecuta axe-core sobre la página, CUANDO se obtienen los resultados, ENTONCES debe haber 0 violaciones de nivel crítico o serio de WCAG 2.1 AA.

2. DADO que cualquier elemento interactivo recibe foco por teclado, CUANDO se visualiza el foco, ENTONCES debe mostrar indicador visible con contraste ≥ 3:1 (ring naranja `#FF9900`).

3. DADO que cualquier texto de la página, CUANDO se verifica su contraste, ENTONCES debe tener relación ≥ 4.5:1 para texto < 18px normal, o ≥ 3:1 para texto ≥ 18px o ≥ 14px bold.

4. DADO que cualquier imagen informativa, CUANDO se inspecciona `alt`, ENTONCES debe ser descriptivo y no vacío. Imágenes decorativas deben tener `alt=""`.

5. DADO que se navega la página solo con teclado, CUANDO se interactúa con todos los componentes, ENTONCES todos deben ser completamente funcionales sin ratón.

6. DADO que se activa el skip link con Tab desde el inicio, CUANDO se presiona Enter, ENTONCES el foco debe saltar al `<main id="main-content">`.

---

### Requisito 14: Performance y Calidad

**Descripción**: La página debe cumplir las métricas de performance definidas en product.md.

**Criterios de Aceptación**:

1. DADO que se ejecuta Lighthouse en producción, CUANDO se obtienen los scores, ENTONCES Performance ≥ 95, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95.

2. DADO que se mide el LCP, CUANDO se carga en conexión 4G simulada, ENTONCES LCP < 2.5 segundos.

3. DADO que se carga la página, CUANDO se verifica el CLS, ENTONCES CLS < 0.1 (todas las imágenes con `width` y `height` explícitos).

4. DADO que se inspeccionan las imágenes, CUANDO se verifica su formato, ENTONCES todas deben estar en WebP o AVIF (procesadas por astro:assets).

5. DADO que se inspeccionan los scripts de cliente, CUANDO se verifica la estrategia de hidratación, ENTONCES solo deben existir islands con `client:visible` (no `client:load`) para componentes no críticos.

---

### Requisito 15: Tipografía y Design System

**Descripción**: La página debe usar estrictamente los tokens de color y tipografía de ui.md.

**Criterios de Aceptación**:

1. DADO que se inspeccionan los headings, CUANDO se verifica la fuente, ENTONCES `<h1>` a `<h3>` deben usar Plus Jakarta Sans; el body text debe usar Inter.

2. DADO que se inspecciona el CSS, CUANDO se verifican los valores de color, ENTONCES no deben existir colores arbitrarios fuera de los tokens `--sbg-*` o clases Tailwind configuradas.

3. DADO que se inspecciona cualquier botón CTA primario, CUANDO se verifica su estilo, ENTONCES debe tener fondo `#FF9900`, texto `#232F3E` y font-weight semibold.

4. DADO que se inspeccionan las cards, CUANDO se verifica su estilo, ENTONCES deben tener `border-radius: 12px`, sombra `shadow-sm` en reposo y `shadow-md` en hover con transición de 200ms.

## Glossary

| Término | Definición |
|---------|------------|
| **SBG** | Student Builder Group — el grupo estudiantil de AWS en la Universidad del Valle |
| **CTA** | Call To Action — elemento de interfaz que invita al usuario a realizar una acción |
| **island** | Componente de Astro con hidratación selectiva en el cliente (`client:visible`, etc.) |
| **SSG** | Static Site Generation — renderizado en build-time, sin servidor en producción |
| **OAC** | Origin Access Control — mecanismo de CloudFront para acceso privado a S3 |
| **WCAG** | Web Content Accessibility Guidelines — estándar de accesibilidad web |
| **LCP** | Largest Contentful Paint — métrica Core Web Vitals de velocidad de carga |
| **CLS** | Cumulative Layout Shift — métrica Core Web Vitals de estabilidad visual |
| **astro:assets** | Módulo de Astro para optimización automática de imágenes |
| **JSON-LD** | Formato de datos estructurados para SEO usando JSON y schema.org |
