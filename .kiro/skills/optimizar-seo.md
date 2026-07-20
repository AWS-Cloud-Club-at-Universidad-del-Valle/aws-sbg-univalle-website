# Skill: Optimizar SEO

## Descripción

Guía para implementar SEO técnico completo en el sitio SBG Univalle: meta tags, Open Graph, datos estructurados JSON-LD, sitemap, robots.txt y buenas prácticas de contenido.

## Cuándo Utilizarla

- Al crear una nueva página.
- Al revisar el SEO de páginas existentes.
- Al agregar datos estructurados para eventos u organización.
- Al configurar Open Graph para compartir en redes sociales.

---

## Componente SEO Reutilizable

```astro
---
// src/components/seo/SEO.astro

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'event';
  noindex?: boolean;
}

const {
  title,
  description,
  canonical,
  ogImage = '/images/og-default.png',
  ogType = 'website',
  noindex = false,
} = Astro.props;

const SITE_URL = 'https://sbg.univalle.edu.co';
const SITE_NAME = 'AWS Student Builder Group - Universidad del Valle';
const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
const canonicalURL = canonical ?? new URL(Astro.url.pathname, SITE_URL).href;
const ogImageURL = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
---

<!-- Primarios -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph -->
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content={ogType} />
<meta property="og:site_name" content={SITE_NAME} />
<meta property="og:locale" content="es_CO" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />
```

---

## Uso en BaseLayout

```astro
---
// src/layouts/BaseLayout.astro
import SEO from '@/components/seo/SEO.astro';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'event';
}

const { title, description, ogImage, ogType } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO {title} {description} {ogImage} {ogType} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <a href="#main-content" class="skip-link sr-only focus:not-sr-only">
      Ir al contenido principal
    </a>
    <slot />
  </body>
</html>
```

---

## JSON-LD: Organización

```astro
---
// src/components/seo/JsonLdOrganization.astro
---
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AWS Student Builder Group Universidad del Valle",
  "url": "https://sbg.univalle.edu.co",
  "logo": "https://sbg.univalle.edu.co/images/logo.png",
  "description": "Grupo estudiantil de tecnología cloud AWS en la Universidad del Valle, Colombia.",
  "parentOrganization": {
    "@type": "EducationalOrganization",
    "name": "Universidad del Valle",
    "url": "https://www.univalle.edu.co"
  },
  "sameAs": [
    "https://www.instagram.com/awssbgunivalle",
    "https://www.linkedin.com/company/awssbgunivalle",
    "https://github.com/aws-sbg-univalle"
  ]
}
</script>
```

---

## JSON-LD: Evento

```astro
---
// src/components/seo/JsonLdEvent.astro
interface Props {
  name: string;
  description: string;
  startDate: string; // ISO 8601: "2026-08-15T10:00:00-05:00"
  endDate: string;
  location: string;
  imageUrl: string;
  url: string;
}
const { name, description, startDate, endDate, location, imageUrl, url } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  name,
  description,
  startDate,
  endDate,
  location: { "@type": "Place", name: location },
  image: imageUrl,
  url,
  organizer: {
    "@type": "Organization",
    name: "AWS Student Builder Group Universidad del Valle",
    url: "https://sbg.univalle.edu.co"
  }
})} />
```

---

## Configurar Sitemap

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sbg.univalle.edu.co',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

---

## Checklist SEO por Página

```
[ ] <title> único, 50–60 caracteres
[ ] <meta description> entre 120–160 caracteres
[ ] <link rel="canonical"> presente
[ ] og:title, og:description, og:image definidos
[ ] og:image en 1200×630px
[ ] lang="es" en <html>
[ ] Un único <h1> por página
[ ] Jerarquía de headings sin saltos (h1→h2→h3)
[ ] JSON-LD de organización en la home
[ ] JSON-LD de evento en páginas de eventos
[ ] sitemap.xml generado y accesible
[ ] robots.txt permite indexación
```
