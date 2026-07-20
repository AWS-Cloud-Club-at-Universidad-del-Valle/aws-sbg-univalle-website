# Skill: Crear Componentes con TailwindCSS

## Descripción

Guía para aplicar TailwindCSS de forma consistente en el proyecto SBG Univalle: uso de tokens del design system, clases Mobile First, variantes de componentes y organización de clases.

## Cuándo Utilizarla

- Al estilizar cualquier componente nuevo o existente.
- Al implementar variantes visuales (primary, secondary, ghost).
- Al agregar estados interactivos (hover, focus, active, disabled).
- Al crear layouts responsive con grid y flexbox.

---

## Configuración del Proyecto

```js
// tailwind.config.mjs
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sbg: {
          primary:      '#003087',
          'primary-light': '#1A4FAF',
          accent:       '#FF9900',
          'accent-hover': '#E68A00',
          'aws-dark':   '#232F3E',
          'aws-orange': '#FF9900',
          text:         '#0D1117',
          'text-muted': '#57606A',
          border:       '#D0D7DE',
          bg:           '#FFFFFF',
          'bg-subtle':  '#F8F9FA',
          'bg-muted':   '#EEF0F3',
        },
      },
      fontFamily: {
        sans:    ['Inter', ...fontFamily.sans],
        display: ['Plus Jakarta Sans', ...fontFamily.sans],
        mono:    ['JetBrains Mono', ...fontFamily.mono],
      },
      screens: {
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
```

---

## Patrón: Botones con Variantes

```astro
---
// src/components/common/Button.astro

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}

const {
  variant = 'primary',
  size = 'md',
  href,
  disabled = false,
  type = 'button',
  class: className = '',
} = Astro.props;

const base = [
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
  'transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sbg-accent focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'min-h-[44px] min-w-[44px]',  // Área táctil mínima WCAG
].join(' ');

const variants = {
  primary:   'bg-sbg-accent text-sbg-aws-dark hover:bg-sbg-accent-hover active:scale-95',
  secondary: 'border-2 border-sbg-primary text-sbg-primary hover:bg-sbg-primary hover:text-white',
  ghost:     'text-sbg-primary underline-offset-4 hover:underline',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:scale-95',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

const Tag = href ? 'a' : 'button';
---

<Tag
  href={href}
  type={!href ? type : undefined}
  disabled={!href ? disabled : undefined}
  class:list={[base, variants[variant], sizes[size], className]}
>
  <slot />
</Tag>
```

---

## Patrón: Layout Mobile First

```astro
<!-- ✅ CORRECTO: Mobile first, escala hacia arriba -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <!-- cards -->
</div>

<!-- ❌ INCORRECTO: Desktop first -->
<div class="grid grid-cols-4 gap-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
  <!-- cards -->
</div>
```

```astro
<!-- Contenedor estándar del proyecto -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <!-- contenido -->
</div>
```

---

## Patrón: Organización de Clases (orden recomendado)

```
1. Layout:     block flex grid hidden
2. Position:   relative absolute fixed sticky
3. Box Model:  w-* h-* p-* m-* border-*
4. Tipografía: font-* text-* leading-* tracking-*
5. Color:      bg-* text-* border-*
6. Efectos:    shadow-* rounded-* opacity-*
7. Transición: transition-* duration-* ease-*
8. Responsive: sm:* md:* lg:* xl:*
9. Estado:     hover:* focus:* active:* disabled:*
10. Dark mode: dark:*
```

```astro
<!-- Ejemplo con orden correcto -->
<div class="
  flex items-center gap-3
  relative
  w-full max-w-sm p-4 border border-sbg-border
  font-sans text-sm text-sbg-text
  bg-white rounded-xl shadow-sm
  transition-shadow duration-200
  sm:max-w-md
  hover:shadow-md focus-within:ring-2 focus-within:ring-sbg-accent
">
```

---

## Reglas Obligatorias

```
✅ Siempre usar tokens sbg-* para colores del brand
✅ Estilos base para mobile, luego sm: md: lg:
✅ focus-visible:ring-2 en todos los elementos interactivos
✅ min-h-[44px] en botones y links (área táctil WCAG)
✅ Transiciones con duration-200 para micro-interacciones
✅ prefers-reduced-motion para animaciones
❌ NUNCA usar valores arbitrarios de color (#FF0000)
❌ NUNCA usar !important
❌ NUNCA hardcodear tamaños de fuente en px arbitrarios
```

---

## Animaciones con prefers-reduced-motion

```css
/* src/styles/global.css */
@media (prefers-reduced-motion: no-preference) {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out both;
  }

  .animate-slide-up {
    animation: slideUp 0.5s ease-out both;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
