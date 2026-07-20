# Skill: Optimizar Lighthouse

## Descripción

Guía para analizar y mejorar las puntuaciones de Lighthouse en el sitio SBG Univalle, con estrategias concretas para Performance, Accessibility, Best Practices y SEO. Target: ≥ 95 en todas las categorías.

## Cuándo Utilizarla

- Después de implementar una nueva página o sección.
- Cuando el build de CI detecta regresiones de rendimiento.
- Al preparar un release para producción.
- Al solucionar un Core Web Vital en rojo.

---

## Cómo Medir

```bash
# Opción 1: CLI de Lighthouse (local, ambiente de producción)
npm run build
npx astro preview &
npx lighthouse http://localhost:4321 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless"

# Opción 2: Chrome DevTools
# Abrir DevTools → Pestaña Lighthouse → Analizar

# Opción 3: Online
# https://pagespeed.web.dev (datos de campo reales)
```

---

## Targets del Proyecto

| Métrica | Target | Crítico si baja de |
|---------|--------|-------------------|
| Performance | ≥ 95 | < 90 |
| Accessibility | ≥ 90 | < 85 |
| Best Practices | ≥ 95 | < 90 |
| SEO | ≥ 95 | < 90 |
| LCP | < 2.5s | > 4s |
| CLS | < 0.1 | > 0.25 |
| INP | < 200ms | > 500ms |

---

## Fixes por Categoría

### Performance — LCP Alto

```astro
<!-- Causa: imagen hero sin fetchpriority -->
<!-- ❌ Problema -->
<Image src={hero} alt="..." loading="lazy" />

<!-- ✅ Fix -->
<Image
  src={hero}
  alt="..."
  loading="eager"
  fetchpriority="high"
  width={1200}
  height={630}
  format="webp"
  quality={85}
/>
```

### Performance — CLS (Layout Shift)

```astro
<!-- Causa: imagen sin dimensiones explícitas -->
<!-- ❌ Problema -->
<img src="/event.jpg" alt="..." class="w-full" />

<!-- ✅ Fix: dimensiones explícitas previenen CLS -->
<Image src={eventImg} alt="..." width={800} height={450} class="w-full h-auto" />
```

### Performance — JS innecesario

```astro
<!-- ❌ Problema: hidratar todo -->
<Counter client:load />

<!-- ✅ Fix: hidratar solo cuando es visible -->
<Counter client:visible />

<!-- ✅ Mejor: si no necesita JS del cliente, no hidratar -->
<StaticCounter />  <!-- componente .astro puro -->
```

### Accessibility — Contraste

```astro
<!-- ❌ Problema: texto gris sobre fondo claro (#57606A en #F8F9FA) -->
<p class="text-[--sbg-text-subtle]">Descripción del evento</p>

<!-- ✅ Fix: usar text-muted que sí tiene contraste 4.5:1 -->
<p class="text-[--sbg-text-muted]">Descripción del evento</p>
```

### Accessibility — Imágenes sin alt

```astro
<!-- ❌ Problema -->
<Image src={logo} />

<!-- ✅ Fix: decorativa → alt vacío -->
<Image src={decorativeWave} alt="" aria-hidden="true" />

<!-- ✅ Fix: informativa → alt descriptivo -->
<Image src={eventPhoto} alt="Asistentes al Workshop AWS Lambda de agosto 2024" />
```

### SEO — Meta description ausente o larga

```astro
<!-- ❌ Problema: sin description o > 160 chars -->
<BaseLayout title="Eventos">

<!-- ✅ Fix: description entre 120-160 chars -->
<BaseLayout
  title="Eventos"
  description="Explora los workshops, hackathons y charlas del AWS Student Builder Group Universidad del Valle. Aprende cloud computing con expertos."
>
```

### Best Practices — Links inseguros

```astro
<!-- ❌ Problema -->
<a href="https://aws.amazon.com" target="_blank">Ver AWS</a>

<!-- ✅ Fix: rel obligatorio en _blank -->
<a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">
  Ver AWS
  <span class="sr-only">(abre en nueva pestaña)</span>
</a>
```

---

## Optimizaciones de Fuentes

```astro
<!-- src/layouts/BaseLayout.astro — en <head> -->

<!-- Preconectar a Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Precargar fuente crítica (la que se ve first) -->
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

```css
/* src/styles/global.css */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;  /* Evita FOIT — texto invisible mientras carga */
}
```

---

## Checklist Pre-Release Lighthouse

```
Performance:
[ ] Hero image: loading="eager" + fetchpriority="high"
[ ] Todas las imágenes: width y height explícitos (anti-CLS)
[ ] Directivas client:* al mínimo necesario
[ ] Bundle JS < 100KB gzipped
[ ] Fuentes con font-display: swap

Accessibility:
[ ] Contraste ≥ 4.5:1 en texto normal
[ ] Contraste ≥ 3:1 en texto grande
[ ] Todos los inputs con <label> asociado
[ ] Jerarquía de headings sin saltos
[ ] focus-visible en todos los interactivos

SEO:
[ ] <title> único y < 60 chars
[ ] <meta description> entre 120–160 chars
[ ] Un solo <h1> por página
[ ] <link rel="canonical"> presente
[ ] sitemap.xml accesible

Best Practices:
[ ] Links externos con rel="noopener noreferrer"
[ ] Sin errores en consola del browser
[ ] HTTPS en todos los recursos
[ ] Sin APIs deprecadas
```
