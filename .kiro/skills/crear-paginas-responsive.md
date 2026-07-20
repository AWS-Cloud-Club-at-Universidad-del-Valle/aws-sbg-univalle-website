# Skill: Crear Páginas Responsive

## Descripción

Guía para construir páginas Astro completamente responsive usando el enfoque Mobile First de TailwindCSS, con layouts fluidos, tipografía escalable y navegación adaptable a todos los dispositivos.

## Cuándo Utilizarla

- Al crear una nueva página del sitio.
- Al agregar una sección nueva a una página existente.
- Al corregir problemas de layout en mobile o tablet.
- Al verificar que una página cumple con Mobile First.

---

## Estructura de Página Estándar

```astro
---
// src/pages/about.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageLayout from '@/layouts/PageLayout.astro';
import HeroSection from '@/components/sections/HeroSection.astro';
import TeamSection from '@/components/sections/TeamSection.astro';
---

<BaseLayout
  title="Sobre Nosotros"
  description="Conoce al AWS Student Builder Group de la Universidad del Valle: nuestra misión, visión y equipo."
>
  <PageLayout>
    <main id="main-content">
      <HeroSection
        title="Sobre el AWS SBG Univalle"
        subtitle="Somos estudiantes apasionados por la tecnología cloud."
      />
      <TeamSection />
    </main>
  </PageLayout>
</BaseLayout>
```

---

## Layout Base (BaseLayout.astro)

```astro
---
// src/layouts/BaseLayout.astro
import SEO from '@/components/seo/SEO.astro';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import '@/styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const { title, description, ogImage } = Astro.props;
---

<!doctype html>
<html lang="es" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO {title} {description} {ogImage} />
  </head>
  <body class="min-h-screen bg-[--sbg-bg] text-[--sbg-text] antialiased">
    <!-- Skip link obligatorio para accesibilidad -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[--sbg-accent] focus:px-4 focus:py-2 focus:font-semibold"
    >
      Ir al contenido principal
    </a>
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

---

## Breakpoints: Cómo Aplicarlos

```
Mobile (base):     0px    → Estilos por defecto, sin prefijo
Small:             640px  → sm:
Medium (tablet):   768px  → md:
Large (laptop):    1024px → lg:
XLarge (desktop):  1280px → xl:
2XLarge:           1536px → 2xl:
```

```astro
<!-- Ejemplo Mobile First correcto -->
<section class="py-12 sm:py-16 lg:py-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    <!-- 1 columna mobile → 2 tablet → 3 desktop -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Cards -->
    </div>

    <!-- Texto: pequeño mobile → grande desktop -->
    <h1 class="text-2xl font-bold sm:text-3xl lg:text-5xl xl:text-6xl">
      AWS Student Builder Group
    </h1>

    <!-- Flex: columna mobile → fila desktop -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
      <!-- Botones -->
    </div>

  </div>
</section>
```

---

## Navegación Responsive

```astro
---
// src/components/layout/Header.astro
const navLinks = [
  { href: '/',          label: 'Inicio' },
  { href: '/about',     label: 'Sobre Nosotros' },
  { href: '/events',    label: 'Eventos' },
  { href: '/resources', label: 'Recursos' },
  { href: '/contact',   label: 'Contacto' },
];
const currentPath = Astro.url.pathname;
---

<header class="sticky top-0 z-40 border-b border-[--sbg-border] bg-white/95 backdrop-blur">
  <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
       aria-label="Navegación principal">

    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-bold text-[--sbg-primary]"
       aria-label="AWS SBG Univalle — Página principal">
      AWS SBG Univalle
    </a>

    <!-- Links desktop (ocultos en mobile) -->
    <ul class="hidden items-center gap-1 lg:flex" role="list">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            aria-current={currentPath === href ? 'page' : undefined}
            class:list={[
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-[--sbg-bg-subtle] hover:text-[--sbg-primary]',
              'focus-visible:outline-2 focus-visible:outline-[--sbg-accent]',
              currentPath === href
                ? 'bg-[--sbg-bg-subtle] text-[--sbg-primary]'
                : 'text-[--sbg-text-muted]',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>

    <!-- Botón hamburger mobile -->
    <button
      id="mobile-menu-toggle"
      class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg lg:hidden
             focus-visible:outline-2 focus-visible:outline-[--sbg-accent]"
      aria-expanded="false"
      aria-controls="mobile-menu"
      aria-label="Abrir menú de navegación"
    >
      <span class="sr-only">Menú</span>
      <!-- Icono hamburger -->
    </button>
  </nav>

  <!-- Menú mobile -->
  <div id="mobile-menu" class="hidden border-t border-[--sbg-border] lg:hidden">
    <ul class="px-4 py-3" role="list">
      {navLinks.map(({ href, label }) => (
        <li>
          <a href={href}
             class="block rounded-lg px-3 py-2.5 text-base font-medium text-[--sbg-text] hover:bg-[--sbg-bg-subtle]">
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</header>
```

---

## Tipografía Fluida

```css
/* src/styles/global.css */
/* Tipografía que escala suavemente entre mobile y desktop */
:root {
  --sbg-h1: clamp(2rem, 5vw, 3.75rem);      /* 32px → 60px */
  --sbg-h2: clamp(1.5rem, 3.5vw, 2.25rem);  /* 24px → 36px */
  --sbg-h3: clamp(1.25rem, 2.5vw, 1.875rem); /* 20px → 30px */
}
```

---

## Checklist de Página Responsive

```
[ ] Viewport meta tag presente en <head>
[ ] lang="es" en <html>
[ ] Skip link implementado
[ ] <main id="main-content"> único
[ ] Sin overflow horizontal en 320px
[ ] Navegación funciona en mobile (hamburger) y desktop
[ ] Tipografía legible en 320px (mínimo 16px para cuerpo)
[ ] Áreas táctiles ≥ 44×44px en mobile
[ ] Imágenes no desbordan su contenedor
[ ] Formularios usables en teclado virtual
[ ] Probado en 375px, 768px y 1280px
```
