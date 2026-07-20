# Skill: Escribir Documentación Técnica

## Descripción

Guía para escribir documentación técnica clara y útil en el proyecto SBG Univalle: README, JSDoc en componentes, comentarios de código, changelogs y guías de contribución.

## Cuándo Utilizarla

- Al crear un nuevo componente o utilidad.
- Al actualizar el README con instrucciones de setup.
- Al documentar una decisión de arquitectura importante.
- Al preparar la guía de contribución para nuevos miembros del grupo.

---

## README Principal

```markdown
# AWS Student Builder Group — Universidad del Valle

Sitio web oficial del AWS Student Builder Group (SBG) de la Universidad del Valle.

## Stack

- [Astro 5](https://astro.build) — Framework de sitio estático
- [TypeScript](https://typescriptlang.org) — Lenguaje tipado (strict mode)
- [TailwindCSS](https://tailwindcss.com) — Utilidades CSS
- [Amazon S3 + CloudFront](https://aws.amazon.com) — Hosting y CDN
- [GitHub Actions](https://github.com/features/actions) — CI/CD

## Requisitos

- Node.js ≥ 20 LTS ([instalar con nvm](https://github.com/nvm-sh/nvm))
- npm ≥ 10

## Setup Local

\`\`\`bash
# 1. Clonar el repositorio
git clone https://github.com/aws-sbg-univalle/website.git
cd website

# 2. Instalar dependencias
npm ci

# 3. Iniciar servidor de desarrollo
npm run dev       # → http://localhost:4321

# 4. Verificar tipos
npm run typecheck

# 5. Build de producción
npm run build
npm run preview   # → http://localhost:4321
\`\`\`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run typecheck` | Verificar tipos TypeScript |

## Estructura del Proyecto

\`\`\`
src/
├── components/    # Componentes reutilizables
├── layouts/       # Layouts base
├── pages/         # Páginas (file-based routing)
├── content/       # Content Collections (eventos, recursos)
├── styles/        # Estilos globales
├── lib/           # Utilidades y constantes
└── types/         # Tipos TypeScript globales
\`\`\`

## Despliegue

El despliegue es automático en cada merge a `main` vía GitHub Actions.
Ver [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md).
```

---

## JSDoc en Componentes

```astro
---
/**
 * EventCard — Tarjeta para mostrar un evento del AWS SBG.
 *
 * @example
 * <EventCard
 *   title="Workshop AWS Lambda"
 *   date="2026-08-15"
 *   location="Edificio E, Sala 401"
 *   href="/events/workshop-lambda"
 *   variant="featured"
 * />
 */

interface Props {
  /** Título del evento. Máximo 80 caracteres. */
  title: string;
  /** Fecha ISO 8601. Ej: "2026-08-15" */
  date: string;
  /** Lugar del evento en la universidad. */
  location: string;
  /** URL de la página de detalle del evento. */
  href: string;
  /**
   * Variante visual.
   * - `default`: card estándar
   * - `featured`: borde naranja AWS, destacado
   */
  variant?: 'default' | 'featured';
  /** URL de la imagen del evento. Opcional. */
  imageUrl?: string;
}
---
```

---

## Comentarios de Código

```typescript
// src/lib/utils.ts

/**
 * Formatea una fecha ISO 8601 en español colombiano.
 *
 * @param dateString - Fecha en formato ISO: "2026-08-15"
 * @returns Fecha formateada: "15 de agosto de 2026"
 *
 * @example
 * formatDate("2026-08-15") // → "15 de agosto de 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`); // Noon para evitar off-by-one de timezone
  return date.toLocaleDateString('es-CO', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });
}

// ✅ Comentario útil: explica el "por qué", no el "qué"
// Usamos T12:00:00 para evitar que el parsing de fecha cambie el día
// en zonas horarias al oeste de UTC (como Colombia: UTC-5)

// ❌ Comentario inútil (el código ya lo dice):
// Crea una nueva fecha con el string
const date = new Date(dateString);
```

---

## Documentar Decisiones de Arquitectura (ADR)

```markdown
# ADR-001: Usar Astro sobre Next.js

**Fecha**: 2026-07-01
**Estado**: Aceptado

## Contexto
Necesitamos elegir un framework para el sitio SBG Univalle.

## Decisión
Usamos **Astro** en lugar de Next.js.

## Razones
- Sitio mayormente estático → Astro genera HTML puro sin JS innecesario.
- Performance nativa: 0 JS por defecto, vs. bundle de React en Next.js.
- Integración directa con S3/CloudFront (output estático).
- Curva de aprendizaje menor para estudiantes universitarios.

## Consecuencias
- Sin SSR por defecto (aceptable para el MVP).
- Interactividad limitada a Astro Islands (suficiente para nuestros casos de uso).
```

---

## Reglas de Documentación

```
✅ README actualizado con cada cambio de setup o scripts
✅ JSDoc en todos los componentes con props > 3 parámetros
✅ Comentarios explicando el "por qué", no el "qué"
✅ Ejemplos de uso en JSDoc de utilidades complejas
✅ CHANGELOG.md actualizado en cada release
✅ ADRs para decisiones de arquitectura significativas
❌ NUNCA comentar código obvio (const x = 1 // asigna 1 a x)
❌ NUNCA dejar código comentado en el repo (usar git para historia)
❌ NUNCA documentar en inglés si el equipo es hispanoparlante
```
