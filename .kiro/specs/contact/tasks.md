# Implementation Plan: Evolución Visual — Página Contact

## Overview

Actualización de la página `/contact` del sitio AWS SBG Univalle para reflejar la nueva composición visual simplificada. Los cambios principales son: soporte condicional de imagen en `ICoreTeamMember`, rediseño del `TeamMemberCard` con avatar prominente (96-120px) y hover mejorado (translateY -6px con glow), reducción de padding en Hero, reescritura de `ContactTeamSection` con layout vertical centrado, y eliminación de secciones Networking y CTA. La composición final queda: Hero → SectionDivider → TeamSection (tarjetas apiladas verticalmente).

## Tasks

- [x] 1. Actualizar interfaz ICoreTeamMember
  - [x] 1.1 Agregar campo `image?: string` en `src/types/index.ts`
    - Agregar el campo opcional `image?: string` a la interfaz `ICoreTeamMember` existente
    - Incluir comentario JSDoc: `/** URL de imagen de perfil opcional (HTTPS, futuro S3) */`
    - Mantener todos los campos existentes sin modificación (`name`, `role`, `area`, `linkedin`, `github`)
    - Verificar que el tipo compila sin errores (`tsc --noEmit`)
    - _Requirements: 3.4, 6.1_

- [x] 2. Reescribir componente TeamMemberCard
  - [x] 2.1 Reescribir `src/components/common/TeamMemberCard.astro`
    - Redefinir `interface Props` con `member: ICoreTeamMember` y `class?: string`
    - Implementar función `getInitials(name: string): string` que extrae primera letra del primer nombre y primera letra del último apellido, en mayúsculas
    - Implementar lógica condicional: `const hasImage = member.image && member.image.trim().length > 0`
    - **Avatar prominente (96-120px):**
      - Si `hasImage`: renderizar `<img>` con `aspect-ratio: 1/1`, `border-radius: 50%`, `object-fit: cover`, `aria-hidden="true"`, `loading="lazy"`
      - Si no: renderizar placeholder con iniciales sobre fondo `linear-gradient(135deg, var(--sbg-accent), var(--sbg-orange))`, tipografía Space Mono bold, font-size mínimo 1.75rem
    - **Información del integrante:**
      - `<h3>` con nombre prominente (mínimo 1.15rem)
      - Texto secundario con cargo en `var(--sbg-text-muted)`
      - Badge pill con área usando `--sbg-accent-subtle` como fondo, fuente Space Mono, border-radius 9999px
    - **Enlaces sociales integrados:**
      - SVG inline para LinkedIn y GitHub (20×20)
      - `target="_blank"`, `rel="noopener noreferrer"`
      - `aria-label="LinkedIn de [nombre]"` / `aria-label="GitHub de [nombre]"`
      - `<span class="sr-only">(abre en nueva pestaña)</span>` en cada enlace
      - Área táctil mínima 44×44px
      - Transición de color y fondo en hover con duración máxima 200ms
    - **Estilos de la tarjeta:**
      - Fondo `--sbg-bg-surface`, `rounded-xl`, borde 1px `--sbg-border`
      - `min-width: 320px`, `max-width: 360px`
      - Elemento decorativo de esquina (gradiente) con `aria-hidden="true"` y `pointer-events: none`
      - `data-animate` para animación de entrada al scroll
    - **Interacciones:**
      - Hover: `translateY(-6px)`, sombra incrementada significativa, glow perimetral sutil con `--sbg-accent-border`, borde transiciona a color accent, duración 300ms ease-out
      - Focus-within: ring 2px `--sbg-accent`, outline-offset 3px
    - **Accesibilidad:**
      - `prefers-reduced-motion: reduce` → `opacity: 1`, `transform: none`, sin transiciones
      - Avatares con `aria-hidden="true"`
    - Mantener componente dentro de 150 líneas máximo
    - _Requirements: 4.1–4.14, 6.2–6.5, 9.3, 9.5, 9.8, 11.3, 11.4, 11.8, 12.6_

- [x] 3. Ajustar ContactHeroSection
  - [x] 3.1 Reducir padding en `src/components/sections/ContactHeroSection.astro`
    - Cambiar padding vertical de `py-20 lg:py-28` a `py-14 lg:py-20`
    - No modificar ningún otro aspecto del componente (gradients, floating shapes, SVG, hero-animate)
    - Verificar que el atributo de clase en el `<section>` raíz refleja el nuevo padding
    - _Requirements: 2.11, 7.1_

- [x] 4. Reescribir ContactTeamSection con layout vertical
  - [x] 4.1 Reescribir `src/components/sections/ContactTeamSection.astro`
    - `<section>` con `aria-labelledby="core-team-heading"` y padding `py-12 sm:py-16`
    - Code-label con texto `# contact.team` usando clase `code-label`
    - `<h2 id="core-team-heading">` con texto "Core Team"
    - Envolver contenido en `container-sbg`
    - Importar `CORE_TEAM_MEMBERS` de `@/lib/constants` y `TeamMemberCard` de `@/components/common/TeamMemberCard.astro`
    - Renderizar exactamente 5 instancias de `TeamMemberCard` con `.map()`
    - **Layout vertical centrado:**
      - Contenedor flex con `flex-direction: column` y `align-items: center`
      - Gap de 24px entre tarjetas
      - Sin overflow-x, sin scroll-snap, sin carrusel
      - Tarjetas con `width: 100%` y `max-width: 480px`
      - Scroll vertical normal de la página
    - **Accesibilidad:**
      - Navegable con teclado (Tab entre tarjetas)
      - Contenido accesible a lectores de pantalla en orden secuencial
    - Usar `data-animate` en las tarjetas
    - _Requirements: 5.1–5.9, 7.1, 8.2–8.3, 9.2, 9.11_

- [x] 5. Simplificar composición de contact.astro
  - [x] 5.1 Simplificar `src/pages/contact.astro`
    - Eliminar imports de `ContactNetworkingSection` y `ContactCtaSection`
    - Eliminar renderizado de dichos componentes y SectionDividers extra
    - Dejar composición final: `ContactHeroSection` → `SectionDivider` → `ContactTeamSection`
    - Mantener imports de `BaseLayout`, `ContactHeroSection`, `ContactTeamSection`, `SectionDivider`
    - Mantener `title="Contacto"` y meta description (120-160 chars) que mencione al equipo
    - Verificar que el title genera "Contacto | AWS SBG Univalle"
    - Verificar Open Graph tags correctos
    - Todos los imports con alias `@/`
    - _Requirements: 1.1, 1.2, 1.6, 1.7, 14.1, 14.3, 14.4, 14.7, 14.11_

- [x] 6. Eliminar componentes obsoletos
  - [x] 6.1 Eliminar `src/components/sections/ContactNetworkingSection.astro`
    - Borrar el archivo completamente del repositorio
    - Verificar que no quedan referencias a este componente en ningún otro archivo
    - _Requirements: 1.7, 14.11_
  - [x] 6.2 Eliminar `src/components/sections/ContactCtaSection.astro`
    - Borrar el archivo completamente del repositorio
    - Verificar que no quedan referencias a este componente en ningún otro archivo
    - _Requirements: 1.7, 14.11_

- [x] 7. Verificación final - Build y tipos
  - [x] 7.1 Ejecutar verificación completa de compilación
    - Ejecutar `npx tsc --noEmit` — debe pasar sin errores
    - Ejecutar `npx astro build` — debe generar HTML estático sin errores
    - Verificar que no quedan imports rotos a componentes eliminados
    - Verificar que `TeamMemberCard.astro` no excede 150 líneas
    - Verificar que no hay scroll horizontal a nivel de página en viewports 320px-2560px
    - Confirmar composición final: Hero → SectionDivider → TeamSection (sin Networking ni CTA)
    - _Requirements: 7.5, 8.7, 13.1, 14.8, 14.9_

## Notes

- No se incluyen property-based tests porque la feature no tiene Correctness Properties (UI estática con datos fijos)
- Se usa validación de tipos en compile-time (`tsc --noEmit`) y build validation (`astro build`) como estrategia de testing
- Cada tarea referencia requisitos específicos para trazabilidad
- El enlace "Contacto" ya existe en `NAV_LINKS` — no debe agregarse de nuevo
- Los datos en `CORE_TEAM_MEMBERS` no requieren modificación (el campo `image` queda como `undefined`)
- Todos los componentes deben usar exclusivamente CSS custom properties `--sbg-*`
- Las animaciones reutilizan `hero-animate`, `data-animate`, `animate-in` sin crear nuevas `@keyframes`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["5.1", "6.1", "6.2"] },
    { "id": 4, "tasks": ["7.1"] }
  ]
}
```
