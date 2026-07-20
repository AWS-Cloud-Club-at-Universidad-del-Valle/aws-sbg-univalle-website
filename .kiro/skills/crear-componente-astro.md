# Skill: Crear Componente Astro

## Descripción

Guía paso a paso para crear componentes Astro reutilizables, correctamente tipados con TypeScript estricto, con props documentadas y siguiendo las convenciones del proyecto SBG Univalle.

## Cuándo Utilizarla

- Al crear cualquier elemento de UI nuevo que se use en más de una página.
- Al extraer una sección repetida de una página en un componente independiente.
- Al construir componentes de layout (Header, Footer, Nav).
- Al crear secciones de página (Hero, EventCard, TeamMember, CTABanner).

---

## Proceso Completo

### 1. Determinar la ubicación correcta

```
src/components/
├── common/     → Elementos atómicos reutilizables (Button, Card, Badge, Icon)
├── layout/     → Estructura de página (Header, Footer, Nav, Sidebar)
├── sections/   → Secciones completas de página (Hero, Features, Events, CTA)
└── seo/        → Componentes de metadatos (SEO, OpenGraph, JsonLd)
```

**Regla**: Si el componente es específico de una sola página, puede vivir en `src/components/sections/`. Si es genérico, va en `common/`.

### 2. Estructura base de un componente Astro

```astro
---
// src/components/common/Card.astro

interface Props {
  title: string;
  description: string;
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
  variant?: 'default' | 'featured';
  class?: string;
}

const {
  title,
  description,
  href,
  imageUrl,
  imageAlt = '',
  variant = 'default',
  class: className = '',
} = Astro.props;
---

<article
  class:list={[
    'rounded-xl border border-[--sbg-border] bg-white p-6',
    'shadow-sm transition-shadow duration-200 hover:shadow-md',
    { 'border-[--sbg-accent]': variant === 'featured' },
    className,
  ]}
>
  {imageUrl && (
    <Image
      src={imageUrl}
      alt={imageAlt}
      width={400}
      height={225}
      loading="lazy"
      class="mb-4 w-full rounded-lg object-cover"
    />
  )}
  <h3 class="text-lg font-semibold text-[--sbg-text]">{title}</h3>
  <p class="mt-2 text-sm text-[--sbg-text-muted]">{description}</p>
  {href && (
    <a
      href={href}
      class="mt-4 inline-block text-sm font-medium text-[--sbg-primary] hover:underline focus-visible:outline-2 focus-visible:outline-[--sbg-accent]"
    >
      Ver más
      <span class="sr-only"> sobre {title}</span>
    </a>
  )}
</article>
```

### 3. Reglas obligatorias

```
✅ interface Props siempre al inicio del frontmatter
✅ Todos los props con tipos explícitos (nunca any)
✅ Props opcionales con valor por defecto en la desestructuración
✅ Usar <Image /> de astro:assets — nunca <img> crudo
✅ Incluir alt text en todas las imágenes
✅ Usar class:list para clases condicionales
✅ Aceptar prop class?: string para extensibilidad
✅ Máximo 150 líneas por componente
✅ Imports con alias @/ nunca rutas relativas largas
```

### 4. Componente con slot

```astro
---
// src/components/common/Section.astro

interface Props {
  title: string;
  subtitle?: string;
  id?: string;
  background?: 'white' | 'subtle' | 'primary';
}

const {
  title,
  subtitle,
  id,
  background = 'white',
} = Astro.props;

const bgClass = {
  white:   'bg-[--sbg-bg]',
  subtle:  'bg-[--sbg-bg-subtle]',
  primary: 'bg-[--sbg-primary] text-white',
}[background];
---

<section {id} class:list={['py-16 sm:py-24', bgClass]}>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && (
        <p class="mx-auto mt-4 max-w-2xl text-lg text-[--sbg-text-muted]">
          {subtitle}
        </p>
      )}
    </div>
    <div class="mt-12">
      <slot />
    </div>
  </div>
</section>
```

### 5. Usar el componente en una página

```astro
---
// src/pages/index.astro
import Card from '@/components/common/Card.astro';
import Section from '@/components/common/Section.astro';
---

<Section title="Próximos Eventos" subtitle="No te pierdas nuestras actividades">
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <Card
      title="Workshop AWS Lambda"
      description="Aprende a construir funciones serverless con AWS Lambda y API Gateway."
      href="/events/workshop-lambda"
      variant="featured"
    />
  </div>
</Section>
```

---

## Checklist de Verificación

```
[ ] interface Props definida con tipos explícitos
[ ] Props opcionales con defaults seguros
[ ] Sin uso de any
[ ] <Image /> en lugar de <img>
[ ] Alt text en todas las imágenes
[ ] focus-visible en elementos interactivos
[ ] class:list para clases condicionales
[ ] Imports usan alias @/
[ ] tsc --noEmit pasa sin errores
[ ] Componente funciona en mobile (375px) y desktop (1280px)
```
