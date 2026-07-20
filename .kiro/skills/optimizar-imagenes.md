# Skill: Optimizar Imágenes

## Descripción

Guía para optimizar imágenes en el proyecto SBG Univalle usando el componente `<Image />` de `astro:assets`, formatos modernos (WebP/AVIF), lazy loading estratégico y prevención de CLS.

## Cuándo Utilizarla

- Al agregar cualquier imagen a un componente o página.
- Al migrar `<img>` crudos a `<Image />` de Astro.
- Al optimizar imágenes que están causando LCP alto o CLS.
- Al preparar imágenes hero, thumbnails de eventos o fotos de equipo.

---

## Regla Principal

```
SIEMPRE usar <Image /> de astro:assets
NUNCA usar <img> crudo (excepto avatares externos de URLs dinámicas)
```

---

## Uso Básico de `<Image />`

```astro
---
import { Image } from 'astro:assets';
import heroImg from '@/assets/images/hero-background.jpg';
---

<!-- Imagen local optimizada -->
<Image
  src={heroImg}
  alt="Estudiantes del AWS SBG en el hackathon universitario 2024"
  width={1200}
  height={600}
  format="webp"
  quality={80}
  loading="eager"
  fetchpriority="high"
  class="w-full object-cover"
/>
```

---

## Estrategia de Loading por Posición

### Imagen Hero (LCP — Above the Fold)
```astro
<Image
  src={heroImage}
  alt="..."
  width={1200}
  height={630}
  loading="eager"
  fetchpriority="high"
  format="webp"
  quality={85}
/>
```

### Imágenes en Cards y Secciones (Below the Fold)
```astro
<Image
  src={eventImage}
  alt="..."
  width={400}
  height={225}
  loading="lazy"
  format="webp"
  quality={80}
/>
```

### Avatares de Equipo
```astro
<Image
  src={memberPhoto}
  alt="Foto de perfil de Ana García, Presidenta del AWS SBG"
  width={96}
  height={96}
  loading="lazy"
  format="webp"
  quality={90}
  class="rounded-full object-cover"
/>
```

---

## Tamaños Estándar del Proyecto

| Uso | Width | Height | Quality | Format |
|-----|-------|--------|---------|--------|
| Hero / Banner | 1200 | 630 | 85 | webp |
| OG Image | 1200 | 630 | 90 | png |
| Card thumbnail | 400 | 225 | 80 | webp |
| Avatar miembro | 96 | 96 | 90 | webp |
| Logo / Icon | — | — | 95 | svg |
| Blog cover | 800 | 450 | 82 | webp |

---

## Prevenir CLS con Dimensiones Explícitas

```astro
<!-- ✅ CORRECTO: width y height definidos — sin layout shift -->
<Image src={img} alt="..." width={400} height={225} loading="lazy" />

<!-- ❌ INCORRECTO: sin dimensiones — causa CLS -->
<img src="/image.jpg" alt="..." />
```

Para imágenes responsivas que cambian de tamaño:

```astro
<Image
  src={heroImg}
  alt="..."
  width={1200}
  height={600}
  loading="eager"
  class="w-full h-auto"   <!-- aspect ratio preservado por width/height del Image -->
/>
```

---

## Imágenes Externas (Avatares de GitHub, etc.)

Cuando la URL es dinámica y no se puede importar localmente:

```astro
---
// Usar <img> estándar solo para URLs externas dinámicas
// Agregar dominio a astro.config.mjs si es recurrente
---

<img
  src={member.avatarUrl}
  alt={`Foto de perfil de ${member.name}`}
  width={96}
  height={96}
  loading="lazy"
  decoding="async"
  class="rounded-full object-cover"
/>
```

```js
// astro.config.mjs — dominios externos permitidos
export default defineConfig({
  image: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
});
```

---

## SVGs como Componentes Astro

```astro
---
// src/components/common/icons/AwsIcon.astro
interface Props {
  size?: number;
  class?: string;
}
const { size = 24, class: className = '' } = Astro.props;
---

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden="true"
  class={className}
>
  <!-- path del SVG -->
</svg>
```

---

## Checklist de Imágenes

```
[ ] Usa <Image /> de astro:assets (no <img> crudo)
[ ] width y height definidos explícitamente
[ ] loading="eager" + fetchpriority="high" en imagen hero
[ ] loading="lazy" en imágenes below the fold
[ ] alt descriptivo en imágenes informativas
[ ] alt="" en imágenes puramente decorativas
[ ] format="webp" especificado
[ ] quality entre 80–90 según tipo
[ ] Dimensiones apropiadas (no cargar 2400px para un thumbnail de 400px)
```
