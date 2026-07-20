# UI — Sistema de Diseño e Interfaz

## Principios de Diseño

1. **Mobile First**: Todo diseño parte del breakpoint más pequeño y escala hacia arriba.
2. **Accesibilidad AA**: Cumplimiento WCAG 2.1 nivel AA en todos los componentes.
3. **Consistencia**: Usar siempre los tokens del design system; nunca valores arbitrarios.
4. **Claridad**: La información más importante siempre visible sin scroll en mobile.
5. **Velocidad percibida**: Animaciones sutiles (< 300ms) que refuercen la interacción sin distraer.

## Paleta de Colores

Inspirada en AWS y los colores institucionales de la Universidad del Valle (azul y verde).

```css
:root {
  /* Primarios AWS */
  --sbg-aws-orange:     #FF9900;
  --sbg-aws-dark:       #232F3E;
  --sbg-aws-blue:       #1A73E8; /* Variante link/accent */

  /* Univalle */
  --sbg-univalle-blue:  #003087;
  --sbg-univalle-green: #00843D;

  /* Brand SBG (fusión) */
  --sbg-primary:        #003087;   /* Azul Univalle como base */
  --sbg-primary-light:  #1A4FAF;
  --sbg-accent:         #FF9900;   /* Naranja AWS como acento */
  --sbg-accent-hover:   #E68A00;

  /* Neutros */
  --sbg-bg:             #FFFFFF;
  --sbg-bg-subtle:      #F8F9FA;
  --sbg-bg-muted:       #EEF0F3;
  --sbg-text:           #0D1117;
  --sbg-text-muted:     #57606A;
  --sbg-text-subtle:    #8C959F;
  --sbg-border:         #D0D7DE;

  /* Semánticos */
  --sbg-success:        #1A7F37;
  --sbg-warning:        #BF8700;
  --sbg-error:          #CF222E;
  --sbg-info:           #0969DA;
}
```

## Tipografía

- **Fuente principal**: `Inter` — para texto de interfaz, cuerpo, navegación.
- **Fuente de display**: `Plus Jakarta Sans` — para headings grandes y hero.
- **Fuente monoespaciada**: `JetBrains Mono` — para código y snippets técnicos.

```css
/* Escala tipográfica (Mobile → Desktop) */
--sbg-text-xs:    0.75rem;   /* 12px */
--sbg-text-sm:    0.875rem;  /* 14px */
--sbg-text-base:  1rem;      /* 16px */
--sbg-text-lg:    1.125rem;  /* 18px */
--sbg-text-xl:    1.25rem;   /* 20px */
--sbg-text-2xl:   1.5rem;    /* 24px */
--sbg-text-3xl:   1.875rem;  /* 30px */
--sbg-text-4xl:   2.25rem;   /* 36px */
--sbg-text-5xl:   3rem;      /* 48px */
--sbg-text-6xl:   3.75rem;   /* 60px */
```

## Breakpoints (Mobile First)

```js
// tailwind.config.mjs
screens: {
  'sm':  '640px',   // Teléfonos grandes
  'md':  '768px',   // Tablets
  'lg':  '1024px',  // Laptops
  'xl':  '1280px',  // Desktops
  '2xl': '1536px',  // Pantallas grandes
}
```

## Espaciado

Usar la escala de spacing de Tailwind. Unidades base de 4px.

- `spacing-1` = 4px, `spacing-2` = 8px, `spacing-4` = 16px, `spacing-8` = 32px, etc.
- **Contenedor máximo**: `max-w-7xl` (1280px) centrado con `mx-auto px-4 sm:px-6 lg:px-8`.

## Componentes Base

### Botones
```
Variantes: primary | secondary | ghost | danger
Tamaños:   sm | md | lg
Estados:   default | hover | focus | active | disabled | loading
```
- `primary`: `bg-[--sbg-accent] text-[--sbg-aws-dark] font-semibold`
- `secondary`: `border border-[--sbg-primary] text-[--sbg-primary]`
- `ghost`: `text-[--sbg-primary] underline-offset-4 hover:underline`
- **Foco visible**: `focus-visible:ring-2 focus-visible:ring-[--sbg-accent]` — obligatorio.
- **Mínimo área táctil**: 44×44px en mobile (WCAG 2.5.5).

### Cards
- Border radius: `rounded-xl` (12px).
- Sombra default: `shadow-sm`. Sombra hover: `shadow-md`.
- Transición: `transition-shadow duration-200`.
- Fondo: `bg-white dark:bg-gray-900`.

### Navegación
- **Desktop**: Horizontal, sticky en scroll, con indicador de página activa.
- **Mobile**: Hamburger menu con drawer lateral animado.
- Logo siempre visible. Links principales máximo 6 items.
- Altura del navbar: 64px mobile / 72px desktop.

## Accesibilidad (WCAG 2.1 AA — Obligatorio)

- **Contraste de color**: Mínimo 4.5:1 para texto normal, 3:1 para texto grande (≥ 18px bold o ≥ 24px regular).
- **Foco visible**: Todos los elementos interactivos deben tener `focus-visible` estilos claros.
- **Texto alternativo**: Todas las imágenes decorativas con `alt=""`. Imágenes informativas con `alt` descriptivo.
- **Semántica HTML**: Usar elementos semánticos (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
- **Landmarks**: Cada página debe tener exactamente un `<main>` con `id="main-content"`.
- **Skip link**: Incluir `<a href="#main-content" class="skip-link">Ir al contenido principal</a>` al inicio del `<body>`.
- **ARIA**: Usar atributos ARIA solo cuando el HTML semántico no sea suficiente.
- **Formularios**: Todos los inputs deben tener `<label>` asociado. Mensajes de error vinculados con `aria-describedby`.
- **Animaciones**: Respetar `prefers-reduced-motion`. Envolver animaciones en `@media (prefers-reduced-motion: no-preference)`.

## Iconografía

- Librería: **Lucide Icons** (via `@astrojs/lucide` o importación directa de SVG).
- Tamaños estándar: 16px, 20px, 24px.
- Los iconos decorativos deben tener `aria-hidden="true"`.
- Los iconos funcionales (sin label de texto) deben tener `aria-label` descriptivo.

## Modo Oscuro

- Implementar con la clase `.dark` de Tailwind (`darkMode: 'class'`).
- Respetar `prefers-color-scheme` del sistema por defecto.
- Guardar preferencia del usuario en `localStorage`.
- **No implementar en MVP**; preparar la arquitectura de tokens para soporte futuro.

## Animaciones y Transiciones

- **Duración máxima**: 300ms para micro-interacciones, 500ms para transiciones de página.
- **Easing**: `ease-out` para entradas, `ease-in` para salidas.
- Usar `@keyframes` vía Tailwind `animate-*` o clases utilitarias personalizadas.
- **Intersection Observer**: Para animaciones de entrada al hacer scroll (fade-in, slide-up).

## Reglas para Agentes

- **NUNCA** usar valores de color arbitrarios (ej: `#FF0000`). Siempre usar los tokens definidos o clases Tailwind equivalentes.
- **NUNCA** omitir el atributo `alt` en imágenes.
- **NUNCA** crear elementos interactivos sin estado de foco visible.
- **SIEMPRE** diseñar mobile-first: estilos base para mobile, luego `sm:`, `md:`, `lg:`.
- **SIEMPRE** verificar contraste de color antes de usar una combinación nueva.
- **SIEMPRE** incluir el skip link en cada layout.
- Usar `<button>` para acciones y `<a>` para navegación — nunca al revés.
- El área táctil mínima de cualquier elemento interactivo es 44×44px.
- Todo formulario nuevo debe ser completamente accesible con teclado.
