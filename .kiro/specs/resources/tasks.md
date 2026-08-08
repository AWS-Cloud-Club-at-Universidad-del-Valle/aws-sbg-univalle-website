# Implementation Plan: Página de Recursos

## Overview

Implementación de la página `/resources` del sitio web del AWS Student Builder Group Universidad del Valle. La página muestra 5 recursos oficiales de AWS para estudiantes con cards visuales, animaciones de scroll, y diseño responsive siguiendo el Design System existente. Se construye como HTML estático con Astro, reutilizando BaseLayout, Navbar, Footer y SectionDivider sin JavaScript client-side adicional.

## Tasks

- [x] 1. Definir datos y tipos para los recursos
  - [x] 1.1 Agregar la constante `RESOURCES` y el array `RESOURCE_ACCENT_COLORS` en `src/lib/constants.ts`
    - Definir los 5 recursos (AWS Skill Builder, AWS Academy, AWS Certification, AWS Workshops, AWS Builder Center) con sus títulos, descripciones (≤120 chars), URLs exactas, categorías descriptivas e identificadores de icono
    - Usar la interfaz `IResource` existente en `src/types/index.ts`
    - Definir `RESOURCE_ACCENT_COLORS` con los colores de acento por índice usando variables CSS del Design System (`--sbg-accent`, `--sbg-orange`, `--sbg-success`, `--sbg-blue`)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2_

- [x] 2. Crear el componente ResourceCard
  - [x] 2.1 Crear `src/components/common/ResourceCard.astro`
    - Implementar interface Props tipada que acepte `resource: IResource` y `accentColor: string`
    - Renderizar icono SVG inline único por recurso (switch basado en `resource.icon`) con fallback genérico, coloreado con `accentColor`, viewBox 0 0 24 24 renderizado a 32×32px, con `aria-hidden="true"`
    - Renderizar badge de categoría con contraste de fondo diferenciado
    - Renderizar título como `<h3>`, descripción breve, y enlace externo con `target="_blank"` y `rel="noopener noreferrer"`
    - Incluir icono SVG de enlace externo (16px) junto al texto del enlace
    - Incluir `<span class="sr-only">(abre en nueva pestaña)</span>` en el enlace
    - Incluir `aria-label` descriptivo en el enlace: `Visitar {title} (abre en nueva pestaña)`
    - Aplicar estilos: fondo `--sbg-bg-surface`, borde `--sbg-border`, `rounded-xl`, hover con `translateY(-2px)` y `shadow-md`, transición `duration-200 ease-out`
    - Aplicar `data-animate` para animaciones de entrada al scroll
    - Respetar `prefers-reduced-motion: reduce` mostrando contenido con `opacity: 1` y sin animaciones
    - Área táctil mínima de 44×44px en el enlace
    - El componente no debe exceder 150 líneas
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 9.1, 9.2, 9.3, 9.4, 11.1, 11.3, 11.4, 11.5_

- [x] 3. Crear el componente ResourcesHeroSection
  - [x] 3.1 Crear `src/components/sections/ResourcesHeroSection.astro`
    - Implementar interface Props con `class?: string`
    - Renderizar `<section aria-labelledby="resources-hero-heading">` con gradientes radiales decorativos idénticos a AboutHeroSection (naranja `rgba(255,153,0,0.08)` superior, azul oscuro `rgba(35,47,62,0.35)` inferior derecha)
    - Incluir dot grid pattern decorativo (`radial-gradient(circle,#fff 1px,transparent 1px)`, `background-size:36px 36px`, `opacity-[0.025]`)
    - Incluir 4-5 formas geométricas flotantes con `aria-hidden="true"` y `pointer-events-none` usando animaciones existentes (`float-triangle`, `float-circle`, `float-square`, `float-rhombus`)
    - Renderizar code-label `# resources.learn_aws` con clase `code-label` y `hero-animate hero-animate-delay-1`
    - Renderizar `<h1 id="resources-hero-heading">Recursos</h1>` con `hero-animate hero-animate-delay-2`, fuente Space Mono bold, color `#f9fafb`
    - Renderizar párrafo introductorio (80-200 chars) con `hero-animate hero-animate-delay-3`, fuente Nunito Sans, color `var(--sbg-text-muted)`
    - Usar contenedor `container-sbg`
    - Respetar `prefers-reduced-motion: reduce` con fallback a `opacity: 1`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 12.1, 12.2, 12.3, 12.5_

- [x] 4. Checkpoint - Verificar componentes individuales
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Crear la página principal de recursos
  - [x] 5.1 Crear `src/pages/resources.astro`
    - Importar BaseLayout, ResourcesHeroSection, ResourceCard, SectionDivider, y constantes RESOURCES y RESOURCE_ACCENT_COLORS usando alias `@/`
    - Pasar `title="Recursos"` y `description` (120-160 chars mencionando recursos AWS para estudiantes) a BaseLayout para generar `<title>Recursos | AWS SBG Univalle</title>` y Open Graph tags
    - Renderizar ResourcesHeroSection
    - Renderizar SectionDivider entre hero y sección de cards
    - Incluir elementos decorativos de fondo entre secciones (radial gradients con opacidad ≤0.08, dot grid 36×36px, al menos una forma geométrica flotante animada) con `aria-hidden="true"` y `pointer-events-none`
    - Renderizar sección de cards: `<section aria-labelledby="resources-explore-heading">` con `container-sbg`
    - Incluir code-label `# resources.explore` y `<h2 id="resources-explore-heading">Explora los recursos</h2>`
    - Implementar grid responsivo usando técnica de 6 columnas: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-6` con cada card ocupando `lg:col-span-2`, las últimas 2 cards con offset `lg:col-start-2` para centrado
    - Gap de 24px (`gap-6`) entre cards en todos los breakpoints
    - Iterar RESOURCES con `.map()` pasando cada recurso y su color de acento al ResourceCard
    - Aplicar `data-animate` a secciones de contenido
    - Mantener jerarquía de headings: h1 → h2 → h3
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3, 8.4, 8.7, 8.8, 8.10, 8.11, 10.1, 10.2, 10.5, 10.6, 10.7, 12.4, 12.5, 12.6, 12.7, 12.8, 13.1, 13.2, 13.6, 13.7, 14.1, 14.3, 14.4, 14.5, 14.6_

  - [x] 5.2 Verificar que el enlace "Recursos" en el Navbar muestra `aria-current="page"` cuando la ruta es `/resources`
    - Revisar la lógica existente en `Navbar.astro` para confirmar que el indicador de página activa funciona correctamente con la ruta `/resources`
    - Si no funciona, ajustar la lógica del Navbar para que detecte la ruta actual
    - _Requirements: 1.4, 12.7_

- [x] 6. Checkpoint - Verificar build y tipado
  - Ensure all tests pass, ask the user if questions arise.
  - Ejecutar `tsc --noEmit` para verificar que no hay errores de TypeScript
  - Ejecutar `astro build` para verificar que la página se genera correctamente como HTML estático

- [ ]* 7. Tests de estructura y accesibilidad
  - [ ]* 7.1 Escribir tests de estructura HTML para la página de recursos
    - Verificar que `/resources` renderiza exactamente 5 ResourceCard
    - Verificar que el `<title>` sea "Recursos | AWS SBG Univalle"
    - Verificar presencia de `<h1>` con texto "Recursos"
    - Verificar que cada card tiene enlace con `target="_blank"` y `rel="noopener noreferrer"`
    - Verificar URLs exactas de los 5 recursos
    - Verificar presencia de `aria-labelledby` en cada `<section>`
    - Verificar jerarquía de headings: h1 → h2 → h3
    - Verificar presencia de `sr-only` con "(abre en nueva pestaña)" en cada enlace externo
    - Verificar que todos los elementos decorativos tienen `aria-hidden="true"`
    - _Requirements: 1.2, 1.7, 2.1, 2.2, 5.1, 5.7, 5.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.9, 9.1, 9.3, 9.4, 14.8_

- [x] 8. Final checkpoint - Verificar build completo
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar `tsc --noEmit` sin errores
  - Verificar `astro build` exitoso
  - Verificar que la página genera HTML estático sin JavaScript client-side adicional

## Notes

- Tasks marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- PBT no es aplicable para esta funcionalidad (UI rendering de datos estáticos sin lógica de negocio)
- Se usan tests example-based para verificar estructura HTML y accesibilidad
- La interfaz `IResource` existente se usa sin modificaciones para mantener compatibilidad con `FEATURED_RESOURCES`
- Todos los imports deben usar el alias `@/` según las convenciones del proyecto

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["5.1"] },
    { "id": 3, "tasks": ["5.2"] },
    { "id": 4, "tasks": ["7.1"] }
  ]
}
```
