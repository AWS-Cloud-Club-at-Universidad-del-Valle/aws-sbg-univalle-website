# Implementation Plan: Landing Page — AWS SBG Univalle

## Overview

Este plan implementa la Landing Page (`/`) del AWS Student Builder Group de la Universidad del Valle usando Astro 5 + TypeScript strict + TailwindCSS. Se organiza en 7 fases secuenciales: infraestructura base, layouts y SEO, componentes comunes, Navbar y Footer, secciones de la landing, ensamblado final, y verificación de calidad.

Cada tarea indica los requisitos que satisface. La rama de trabajo debe crearse como `feature/landing-page` desde `develop`.

## Task Dependency Graph

```
Fase 1 (1→2→3) → Fase 2 (4→5→6) → Fase 3 (7→8→9) → Fase 4 (10→11)
     ↓                                                       ↓
Fase 5 (12→13→14→15→16→17→18→19→20→21→22→23→24→25→26)
     ↓
Fase 6 (27→28)
     ↓
Fase 7 (29→30→31)
```

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": [1, 2, 3],
      "description": "Infraestructura base: dependencias, tipos globales y constantes"
    },
    {
      "wave": 2,
      "tasks": [4, 5, 6],
      "description": "Layouts y SEO: componente SEO, JSON-LD y BaseLayout"
    },
    {
      "wave": 3,
      "tasks": [7, 8, 9],
      "description": "Componentes comunes: Button, SectionHeader y Badge"
    },
    {
      "wave": 4,
      "tasks": [10, 11],
      "description": "Componentes de layout: Navbar y Footer"
    },
    {
      "wave": 5,
      "tasks": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
      "description": "Secciones de la landing page: Hero, QuiénesSomos, Beneficios, Estadísticas, Eventos, Equipo, Partners, Recursos, CTA"
    },
    {
      "wave": 6,
      "tasks": [27, 28],
      "description": "Ensamblado final: página index.astro y optimización de imágenes"
    },
    {
      "wave": 7,
      "tasks": [29, 30, 31],
      "description": "Verificación de calidad: TypeScript, Lighthouse y accesibilidad"
    }
  ]
}
```

## Tasks


### Fase 1: Infraestructura base y configuración

- [ ] 1. Configurar dependencias y estructura de carpetas
  - Instalar `@fontsource/inter`, `@fontsource/plus-jakarta-sans` y `lucide`
  - Crear directorios: `src/components/common/`, `src/components/layout/`, `src/components/sections/`, `src/components/seo/`, `src/layouts/`, `src/lib/`, `src/types/`, `src/assets/images/`
  - Configurar alias `@/` → `src/` en `tsconfig.json`
  - Crear `src/styles/global.css` con tokens CSS `--sbg-*`, `@font-face` de las fuentes y estilos base del skip link
  - Verificar que `tsc --noEmit` pasa sin errores
  - **Requisitos satisfechos**: 1, 13, 14, 15

- [ ] 2. Crear tipos TypeScript globales en `src/types/index.ts`
  - Definir y exportar interfaces: `IEvent`, `IMember`, `IStat`, `IPartner`, `IResource`, `ISiteConfig`
  - Tipado estricto sin uso de `any`
  - **Requisitos satisfechos**: 6, 7, 8, 9, 10

- [ ] 3. Crear constantes y datos placeholder en `src/lib/constants.ts`
  - Definir `SITE_CONFIG` (nombre, URL, descripción, logo, redes sociales)
  - Definir `NAV_LINKS` array con 5-6 links de navegación
  - Definir `STATS` array con 4 estadísticas del grupo (datos placeholder realistas)
  - Definir `UPCOMING_EVENTS` array con 3 eventos próximos placeholder
  - Definir `DIRECTIVE_MEMBERS` array con 4-6 miembros directivos placeholder
  - Definir `PARTNERS` array con 3-5 partners placeholder
  - Definir `FEATURED_RESOURCES` array con 6 recursos AWS placeholder
  - Usar tipos de `src/types/index.ts`; todos los datos deben satisfacer las reglas de validación del diseño
  - **Requisitos satisfechos**: 6, 7, 8, 9, 10


### Fase 2: Layouts y componentes SEO

- [ ] 4. Crear componente `src/components/seo/SEO.astro`
  - Props tipadas con `interface Props`: `title`, `description`, `canonical`, `ogImage`, `ogType?`, `noindex?`
  - Renderizar: `<title>`, `<meta name="description">`, `<link rel="canonical">`, etiquetas Open Graph completas, Twitter Card
  - **Requisitos satisfechos**: 1

- [ ] 5. Crear función `buildJsonLdOrganization` y componente `src/components/seo/JsonLd.astro`
  - Implementar `buildJsonLdOrganization(config: ISiteConfig): Record<string, unknown>` en `src/lib/utils.ts`
  - Output debe tener `@context: "https://schema.org"`, `@type: "Organization"`, `name`, `url`, `logo`, `sameAs`
  - `JsonLd.astro` renderiza `<script type="application/ld+json">` con el schema serializado
  - **Requisitos satisfechos**: 1

- [ ] 6. Crear layout `src/layouts/BaseLayout.astro`
  - Props tipadas: `title`, `description`, `canonical?`, `ogImage?`
  - `<head>`: integrar `SEO.astro`, preloads de fuentes críticas (Plus Jakarta Sans 700, Inter 400), estilos globales, `JsonLd.astro`
  - Primer elemento del `<body>`: skip link `<a href="#main-content" class="skip-link">Ir al contenido principal</a>`
  - Estructura: `<Navbar />` → `<main id="main-content">` → `<slot />` → `<Footer />`
  - Skip link visible solo con focus, posición absoluta en top-left, fondo `--sbg-accent`
  - **Requisitos satisfechos**: 1, 13


### Fase 3: Componentes comunes (common)

- [ ] 7. Crear componente `src/components/common/Button.astro`
  - Props: `variant: 'primary' | 'secondary' | 'ghost'`, `size?: 'sm' | 'md' | 'lg'`, `href?`, `type?`, `disabled?`, `ariaLabel?`, `class?`
  - Si `href` está presente, renderiza `<a>`; si no, `<button>`
  - Primary: fondo `#FF9900`, texto `#232F3E`, font-semibold
  - Secondary: borde `#003087`, texto `#003087`
  - Área táctil mínima 44×44px en mobile; `focus-visible:ring-2 focus-visible:ring-[--sbg-accent]` obligatorio
  - **Requisitos satisfechos**: 3, 13, 15

- [ ] 8. Crear componente `src/components/common/SectionHeader.astro`
  - Props: `title: string`, `subtitle?: string`, `id: string`
  - Renderiza `<h2 id={id}>` con Plus Jakarta Sans y párrafo de subtítulo opcional
  - Color del heading: `--sbg-primary`
  - **Requisitos satisfechos**: 4, 5, 13

- [ ] 9. Crear componente `src/components/common/Badge.astro`
  - Props: `label: string`, `variant?: 'default' | 'event-type' | 'category'`
  - Renderiza `<span>` con estilos pill (rounded-full, padding pequeño)
  - Colores con contraste ≥ 4.5:1 para cada variante
  - **Requisitos satisfechos**: 7, 10


### Fase 4: Componentes de layout (Navbar y Footer)

- [ ] 10. Crear componente `src/components/layout/Navbar.astro`
  - Usa `NAV_LINKS` de constants; props opcionales para indicar página activa
  - Desktop: logo + nav links horizontal, sticky, height 72px, z-index superior
  - Mobile: logo + botón hamburger, height 64px
  - Botón hamburger: `aria-controls="mobile-menu"`, `aria-expanded="false"`, `aria-label="Abrir menú de navegación"`, área táctil 44×44px
  - Drawer mobile: `id="mobile-menu"`, oculto con `translate-x-full`, transición 300ms ease-out
  - Script cliente para toggle (algoritmo `toggleMobileMenu` del diseño): abrir/cerrar, Escape para cerrar, gestión de foco, bloqueo de scroll en body
  - Link activo con indicador visual (borde inferior `--sbg-accent`)
  - **Requisitos satisfechos**: 2, 13

- [ ] 11. Crear componente `src/components/layout/Footer.astro`
  - Elemento raíz: `<footer role="contentinfo">`
  - Secciones: logo + descripción breve, links de navegación secundaria, links a redes sociales, copyright
  - Links de redes: `aria-label` descriptivo, `rel="noopener noreferrer"`, `target="_blank"`, iconos con `aria-hidden="true"`
  - Layout mobile: columnas apiladas; desktop: grid de 3-4 columnas
  - **Requisitos satisfechos**: 12, 13


## Notes

- La rama de trabajo debe crearse como `feature/landing-page` desde `develop`.
- Todos los commits deben seguir Conventional Commits (`feat(landing):`, `style(landing):`, etc.).
- Ejecutar `tsc --noEmit` y `astro build` antes de abrir el PR.
- Verificar Lighthouse ≥ 95 Performance, ≥ 90 Accessibility, ≥ 95 SEO antes del merge.
- Los datos placeholder deben ser realistas y representativos del AWS SBG Univalle.
- No implementar funcionalidad de Fase 2 (blog, CMS, panel admin) en este spec.
