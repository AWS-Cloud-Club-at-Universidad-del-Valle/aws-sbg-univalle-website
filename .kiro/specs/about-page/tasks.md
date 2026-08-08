# Plan de Implementación — About Page (Mejora Visual)

## Resumen

Enriquecer la calidad visual de la página `/about` para igualar el nivel del Home, manteniendo el mismo lenguaje de diseño. Se agregan radial gradients, dot grids, floating shapes, SVG decorativo cloud, badges, iconografía, tarjetas sociales prominentes, CTA envolvente y separadores entre secciones. Sin cambios en contenido textual, enlaces, accesibilidad base ni rendimiento.

## Tareas

- [x] 1. Definir capa de datos (tipos y constantes)
  - [x] 1.1 Agregar interfaz `ISocialLink` a `src/types/index.ts`
  - [x] 1.2 Agregar constante `ABOUT_SOCIAL_LINKS` a `src/lib/constants.ts`
  - [x] 1.3 Actualizar `SITE_CONFIG.social` con YouTube y Email

- [x] 2. Implementar componentes Hero e Identity
  - [x] 2.1 Crear `src/components/sections/AboutHeroSection.astro`
  - [x] 2.2 Crear `src/components/sections/AboutIdentitySection.astro`

- [x] 3. Implementar componentes Misión y Visión
  - [x] 3.1 Crear `src/components/sections/AboutMissionSection.astro`
  - [x] 3.2 Crear `src/components/sections/AboutVisionSection.astro`

- [x] 4. Implementar componentes Social y CTA
  - [x] 4.1 Crear `src/components/sections/AboutSocialSection.astro`
  - [x] 4.2 Crear `src/components/sections/AboutCtaSection.astro`

- [x] 5. Crear página y conectar todo
  - [x] 5.1 Crear `src/pages/about.astro`

- [x] 6. Verificación de build
  - [x] 6.1 Verificar `tsc --noEmit` y `astro build`

- [x] 7. Crear componente SectionDivider
  - [x] 7.1 Crear `src/components/common/SectionDivider.astro`
    - Crear componente con `interface Props { class?: string; }`
    - Renderizar `<div aria-hidden="true">` contenedor con `py-4`
    - Dentro, un `<div>` con `height: 1px`, `max-width: 55%`, `margin: 0 auto`
    - Background: `linear-gradient(90deg, transparent, var(--sbg-accent-border), transparent)`
    - Opcionalmente agregar un pequeño rombo SVG centrado sobre la línea
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 8. Enriquecer Hero Section
  - [x] 8.1 Agregar radial gradients de fondo al `AboutHeroSection.astro`
    - Agregar div con gradiente naranja en esquina superior izquierda: `radial-gradient(ellipse 55% 45% at 30% 0%, rgba(255,153,0,0.08) 0%, transparent 65%)`
    - Agregar div con gradiente azul oscuro en esquina inferior derecha: `radial-gradient(ellipse at 80% 100%, rgba(35,47,62,0.35) 0%, transparent 60%)`
    - Ambos con `aria-hidden="true"`, `pointer-events-none`, posición absoluta
    - _Requisitos: 2.4_

  - [x] 8.2 Agregar dot grid pattern al Hero
    - Agregar div con `background-image: radial-gradient(circle, #fff 1px, transparent 1px)`, `background-size: 36px 36px`, `opacity: 0.025`
    - Posición absoluta, inset-0, `pointer-events-none`, `aria-hidden="true"`
    - _Requisitos: 2.5_

  - [x] 8.3 Agregar más floating shapes al Hero
    - Incrementar de 3 a al menos 5 shapes decorativas
    - Usar variedad: `float-triangle`, `float-circle`, `float-square`, `float-rhombus`
    - Distribuir en esquinas con diferentes animation-delay y duration
    - Reducir tamaño/opacidad en mobile con clases responsive (hidden en algunos)
    - _Requisitos: 2.6, 9.9_

  - [x] 8.4 Agregar SVG decorativo de arquitectura cloud
    - Crear SVG inline con patrón de nodos conectados (6–8 nodos con líneas)
    - Usar colores del Design System: `--sbg-accent`, `--sbg-orange`, `--sbg-blue` con opacity baja (0.08–0.12)
    - Posicionar a la derecha del contenido text en desktop usando grid `lg:grid-cols-2`
    - Ocultar en mobile: `hidden lg:block`
    - `aria-hidden="true"`, `pointer-events-none`
    - _Requisitos: 2.7, 9.8_

  - [x] 8.5 Ajustar padding y layout del Hero
    - Cambiar padding a `py-20 lg:py-28` para mayor presencia
    - Implementar grid de 2 columnas en lg: texto izquierda, SVG derecha
    - Mantener columna única en mobile
    - _Requisitos: 2.1, 2.2, 2.3_

- [x] 9. Enriquecer Identity Section
  - [x] 9.1 Agregar badges decorativos a `AboutIdentitySection.astro`
    - Agregar array de badges: ["AWS", "Cloud", "Workshops", "Certificaciones", "Comunidad", "Networking", "Leadership"]
    - Renderizar como `<span>` con estilo pill: `rounded-full`, borde `--sbg-border`, fondo `--sbg-accent-subtle`, tipografía Space Mono 0.72rem
    - Layout: `flex flex-wrap gap-2 mt-6`
    - Los badges son decorativos, no interactivos
    - _Requisitos: 3.4_

  - [x] 9.2 Agregar elementos decorativos a Identity
    - Agregar 1 floating shape con `float-rhombus` animation
    - Agregar radial gradient sutil en esquina inferior derecha del card: `radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.05), transparent 70%)`
    - _Requisitos: 3.5, 3.6_

- [x] 10. Enriquecer Mission Section
  - [x] 10.1 Agregar icono y border-left gradiente a `AboutMissionSection.astro`
    - Hacer el card `position: relative` y `overflow-hidden`
    - Agregar icono SVG decorativo (target/compass) en esquina superior derecha: 40×40px, color `--sbg-accent`, opacity 0.15, `aria-hidden="true"`, posición absoluta
    - Agregar div de 3px de ancho en el lado izquierdo del card con `background: linear-gradient(to bottom, var(--sbg-accent), transparent)`, posición absoluta, `top-0 left-0 bottom-0`
    - Agregar fondo radial gradient sutil: `radial-gradient(ellipse at 0% 0%, rgba(139,92,246,0.06), transparent 70%)`
    - _Requisitos: 4.3, 4.4, 4.5_

- [x] 11. Enriquecer Vision Section
  - [x] 11.1 Agregar icono y border-left gradiente a `AboutVisionSection.astro`
    - Hacer el card `position: relative` y `overflow-hidden`
    - Agregar icono SVG decorativo (rocket/stars) en esquina superior derecha: 40×40px, color `--sbg-orange`, opacity 0.15, `aria-hidden="true"`, posición absoluta
    - Agregar div de 3px en lado izquierdo con `background: linear-gradient(to bottom, var(--sbg-orange), transparent)`
    - Agregar fondo radial gradient sutil desde esquina inferior derecha: `radial-gradient(ellipse at 100% 100%, rgba(255,153,0,0.05), transparent 70%)`
    - _Requisitos: 5.3, 5.4, 5.5_

- [x] 12. Enriquecer Social Section
  - [x] 12.1 Transformar enlaces sociales en tarjetas prominentes en `AboutSocialSection.astro`
    - Agregar campo `glowColor` a cada entrada de `ABOUT_SOCIAL_LINKS` en constants.ts
    - Transformar los links de pills a tarjetas: `flex-col items-center gap-2 p-5 min-w-[100px] min-h-[100px]`
    - Mostrar nombre de la plataforma visible como `<span>` debajo del icono (Space Mono, 0.72rem)
    - Icono más grande: `w-7 h-7` (28px)
    - Cambiar layout a grid: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4`
    - Agregar hover glow con `box-shadow` usando `glowColor` de cada link
    - Mantener `aria-label`, touch target 44×44px, focus-visible ring
    - _Requisitos: 6.7, 6.8, 6.9, 6.10_

  - [x] 12.2 Agregar decoración a la sección social
    - Agregar dot grid pattern sutil de fondo
    - Agregar 1 floating shape decorativa
    - _Requisitos: 6.11_

- [x] 13. Enriquecer CTA Section
  - [x] 13.1 Agregar composición visual envolvente a `AboutCtaSection.astro`
    - Hacer la sección `position: relative` y `overflow-hidden`
    - Agregar radial gradient prominente de fondo: `radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.08) 0%, transparent 60%)`
    - Agregar dot grid pattern de fondo (misma técnica del Home)
    - Agregar 3+ floating shapes (triángulo, círculo, rombo) con `aria-hidden="true"`
    - Agregar borde superior decorativo: div de 1px con `linear-gradient(90deg, transparent, var(--sbg-accent-border), transparent)`
    - Aumentar padding a `py-24 sm:py-32`
    - _Requisitos: 7.5, 7.6, 7.7, 7.8, 7.9_

- [x] 14. Integrar separadores en la página
  - [x] 14.1 Actualizar `src/pages/about.astro`
    - Importar `SectionDivider` desde `@/components/common/SectionDivider.astro`
    - Insertar `<SectionDivider />` entre: Hero→Identity, Identity→Misión/Visión, Misión/Visión→Social, Social→CTA
    - Ajustar spacing del contenedor si es necesario para acomodar separadores
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 15. Verificación final
  - [x] 15.1 Verificar compilación y build
    - Ejecutar `tsc --noEmit` y verificar que pasa sin errores
    - Ejecutar `astro build` y verificar build exitoso
    - Verificar que no se introdujo JavaScript client-side adicional
    - _Requisitos: 12.1, 12.4_

## Notas

- Todos los enriquecimientos son puramente decorativos — CSS y SVG inline.
- No se modifica contenido textual, misión, visión ni enlaces.
- No se introduce JavaScript client-side adicional.
- `prefers-reduced-motion: reduce` se maneja globalmente en `global.css` — no requiere trabajo por componente.
- Los radial gradients usan exactamente los mismos valores del Home para coherencia.
- Los floating shapes usan las mismas keyframes existentes en `global.css`.
- El SVG decorativo cloud es inline y estático (sin animación canvas como el Home).
- El componente `SectionDivider` se crea en `common/` para reutilización en futuras páginas.

## Grafo de Dependencias

```json
{
  "waves": [
    { "id": 0, "tasks": ["7.1"] },
    { "id": 1, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5"] },
    { "id": 2, "tasks": ["9.1", "9.2", "10.1", "11.1"] },
    { "id": 3, "tasks": ["12.1", "12.2", "13.1"] },
    { "id": 4, "tasks": ["14.1"] },
    { "id": 5, "tasks": ["15.1"] }
  ]
}
```
