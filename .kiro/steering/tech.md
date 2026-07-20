# Tech — Especificaciones Técnicas

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro | ^5.x |
| Lenguaje | TypeScript | ^5.x (strict mode) |
| Estilos | TailwindCSS | ^3.x |
| Runtime | Node.js | ≥ 20 LTS |
| Package Manager | npm | ≥ 10 |
| Control de versiones | Git + GitHub | — |
| CI/CD | GitHub Actions | — |
| Hosting | Amazon S3 + CloudFront | — |
| DNS | Amazon Route 53 | — |

## Estructura de Carpetas

```
src/
├── components/         # Componentes reutilizables
│   ├── common/         # Button, Card, Badge, Icon, etc.
│   ├── layout/         # Header, Footer, Nav, Sidebar
│   ├── sections/       # Hero, Features, Events, Team, CTA
│   └── seo/            # SEO, OpenGraph, JsonLd
├── layouts/            # Layouts base de Astro
│   ├── BaseLayout.astro
│   └── PageLayout.astro
├── pages/              # Rutas del sitio (file-based routing)
│   ├── index.astro
│   ├── about.astro
│   ├── events/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── resources.astro
│   └── contact.astro
├── content/            # Colecciones de contenido (Astro Content Collections)
│   ├── events/         # Archivos .md o .mdx de eventos
│   └── resources/      # Archivos .md de recursos
├── styles/             # Estilos globales
│   └── global.css
├── lib/                # Utilidades, helpers, constantes
│   ├── constants.ts
│   └── utils.ts
└── types/              # Tipos TypeScript globales
    └── index.ts

public/                 # Assets estáticos (no procesados)
├── favicon.ico
├── favicon.svg
├── images/
└── fonts/

.kiro/
├── steering/           # Archivos de steering (este directorio)
└── specs/              # Specs de features

.github/
└── workflows/          # GitHub Actions
    ├── deploy.yml
    └── ci.yml
```

## Configuración TypeScript

- **Modo**: `strict: true` — obligatorio en todos los archivos.
- **Target**: `ES2022`.
- **Path aliases**: Usar `@/` para `src/` (configurado en `tsconfig.json`).
- **No `any`**: Prohibido usar `any`. Usar `unknown` con type guards cuando sea necesario.
- Todos los componentes Astro deben tipar explícitamente sus props con `interface Props`.

## Convenciones de Código

### Nomenclatura
- **Componentes Astro**: PascalCase (`HeroSection.astro`, `EventCard.astro`).
- **Páginas**: kebab-case (`about.astro`, `our-team.astro`).
- **Utilidades y helpers**: camelCase (`formatDate.ts`, `slugify.ts`).
- **Tipos e interfaces**: PascalCase con prefijo `I` para interfaces (`IEvent`, `IMember`).
- **Constantes**: SCREAMING_SNAKE_CASE (`SITE_URL`, `NAV_LINKS`).
- **Variables CSS**: kebab-case con prefijo `--sbg-` (`--sbg-primary`, `--sbg-spacing-md`).

### Componentes
- Cada componente en su propio archivo.
- Props siempre tipadas con `interface Props` al inicio del frontmatter.
- Preferir props explícitas sobre slots cuando el contenido sea simple.
- Documentar props complejas con comentarios JSDoc.
- Máximo 150 líneas por componente; extraer subcomponentes si se excede.

### Imports
- Orden: dependencias externas → alias `@/` → relativos.
- Siempre usar alias `@/` en lugar de rutas relativas largas (`../../../`).

## Performance

- **Imágenes**: Usar siempre el componente `<Image />` de `astro:assets` para optimización automática.
- **Fonts**: Cargar fuentes con `font-display: swap`. Precargar fuentes críticas con `<link rel="preload">`.
- **Scripts**: Usar `is:inline` solo cuando sea estrictamente necesario. Preferir scripts de Astro con `type="module"`.
- **CSS crítico**: Astro lo maneja automáticamente; no bloquear el render con CSS externo.
- **Lazy loading**: Aplicar `loading="lazy"` a todas las imágenes fuera del viewport inicial.
- **Prefetch**: Habilitar prefetch de Astro para navegación instantánea.

## Astro Content Collections

- Definir schemas en `src/content/config.ts` usando `zod`.
- Todos los campos de contenido deben estar tipados y validados.
- Slugs generados automáticamente desde el nombre del archivo.

## Reglas para Agentes

- **SIEMPRE** usar TypeScript estricto. Nunca `any`.
- **SIEMPRE** usar el alias `@/` para imports internos.
- **SIEMPRE** usar `<Image />` de `astro:assets` para imágenes, nunca `<img>` crudo a menos que sea un avatar externo.
- **NUNCA** instalar dependencias sin justificación clara. El bundle debe mantenerse mínimo.
- **NUNCA** usar `document`, `window` o APIs del navegador directamente en el frontmatter de Astro (solo en scripts de cliente).
- Antes de crear un nuevo componente, verificar si existe uno similar en `src/components/common/`.
- Todo código nuevo debe pasar `tsc --noEmit` sin errores.
- Respetar estrictamente la estructura de carpetas definida arriba.
