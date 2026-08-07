# Project Rules — Reglas Permanentes del Proyecto

## Idioma

Todo el proceso debe realizarse completamente en español.

Esto incluye:
- Análisis
- Preguntas
- Razonamiento
- Requirements
- Design
- Tasks
- Comentarios
- Explicaciones
- Commits
- Documentación

Los nombres de tecnologías, APIs, librerías y componentes pueden mantenerse en inglés cuando sea necesario (Astro, TailwindCSS, CloudFront, etc.), pero toda la comunicación y documentación debe realizarse en español.

## Gestión de Specs

### Un Spec por funcionalidad

Cada página o funcionalidad principal del proyecto debe tener un **único** Spec.

Ejemplos de Specs válidos:
- `landing-page`
- `about-page`
- `deployment`
- `events-page`
- `resources-page`

### Las mejoras NO crean nuevos Specs

Los siguientes tipos de cambio **siempre** deben actualizar el Spec existente:
- Mejora visual
- Refactorización
- Cambio de UX
- Optimización
- Mejora responsive
- Mejora de accesibilidad
- Optimización de rendimiento
- Actualización de componentes

### Creación de nuevos Specs

Solo debe crearse un nuevo Spec cuando realmente se incorpore una **nueva funcionalidad independiente** al proyecto.

Antes de crear un nuevo Spec:
1. Verificar si ya existe uno que represente esa funcionalidad.
2. Si existe, **reutilizarlo**.

**NUNCA** deben existir múltiples Specs para diferentes iteraciones de una misma funcionalidad.

## Flujo de Trabajo con Specs Existentes

Cuando el usuario solicite una mejora sobre una funcionalidad existente:

1. Localizar el Spec correspondiente.
2. Actualizar `requirements.md` si aparecen nuevos requisitos.
3. Actualizar `design.md` si cambia la arquitectura o composición.
4. Actualizar `tasks.md` con las nuevas tareas.
5. Continuar la implementación sobre ese mismo Spec.

**NUNCA** crear un nuevo Spec para una iteración.

## Diseño

- **SIEMPRE** analizar primero el diseño existente antes de proponer cambios.
- Mantener consistencia visual con el resto del proyecto.
- Priorizar reutilización de componentes.
- Evitar componentes duplicados.
- Mantener el Design System existente.

## Arquitectura

- Favorecer componentes reutilizables.
- No duplicar lógica.
- Mantener una estructura limpia.
- Seguir principios SOLID cuando aplique.
- Priorizar mantenibilidad.
