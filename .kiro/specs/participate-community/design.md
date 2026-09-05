# Diseño — Participa en la Comunidad (Frontend)

## Visión general

Se implementa una nueva página `/participate` compuesta por secciones reutilizables,
siguiendo el mismo patrón de `resources.astro` y `contact.astro`: una página delgada
que importa `BaseLayout` y compone componentes de sección.

El módulo es **solo frontend**. El formulario envía un `POST` a un endpoint
configurable (`PROPOSALS_ENDPOINT`). Si no está configurado, se simula el envío en el
cliente para permitir probar toda la UX (loading, éxito, error).

## Arquitectura de archivos

```
src/
├── pages/
│   └── participate.astro                      # Página, compone secciones
├── components/
│   ├── sections/
│   │   ├── ParticipateHeroSection.astro        # Hero con <h1>
│   │   ├── ParticipateWaysSection.astro        # Tarjetas de formas de participar
│   │   ├── ParticipateIdeaSection.astro        # Sección "¿Tienes una idea?"
│   │   └── ParticipateFormSection.astro        # Formulario + estados (client script)
│   └── common/
│       └── ParticipationCard.astro             # Tarjeta de una forma de participar
├── lib/
│   └── constants.ts                            # + PARTICIPATION_WAYS, TALK_LEVELS, etc.
└── types/
    └── index.ts                                # + IParticipationWay, ITalkLevel, tipos de propuesta
```

## Tipos (types/index.ts)

```ts
export type ProposalType = 'TALK' | 'WORKSHOP' | 'TALLER' | 'IDEA' | 'VOLUNTEER';
export type ProposalModality = 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDA';
export type ProposalLevel = 100 | 200 | 300 | 400;

export interface IParticipationWay {
  key: ProposalType;      // Tipo que se preselecciona en el formulario
  icon: string;           // Emoji o clave de icono
  title: string;          // "Dar una charla"
  description: string;
  actionLabel: string;    // "Postular" | "Proponer" | "Participar"
  glowColor?: string;
}

export interface ITalkLevel {
  value: ProposalLevel;   // 100..400
  label: string;          // "100 — Introductorio"
  description: string;
}
```

## Datos (constants.ts)

- `PARTICIPATION_WAYS: IParticipationWay[]` — Dar una charla (TALK), Proponer un
  workshop (WORKSHOP), Proponer un taller (TALLER), Ser voluntario (VOLUNTEER).
- `TALK_LEVELS: ITalkLevel[]` — niveles 100/200/300/400 con descripción.
- `PROPOSAL_MODALITIES` — Virtual, Presencial, Híbrida.
- `PROPOSALS_ENDPOINT: string` — URL del `POST /community/proposals` (vacío por ahora).
- `COMMUNITY_EMAIL` — reutiliza `aws.cloud.club@correounivalle.edu.co`.

## Componentes

### ParticipateHeroSection
Mismo patrón visual que `ResourcesHeroSection`: fondos radiales, dot-grid, formas
flotantes decorativas (`aria-hidden`), `code-label` `# participate.join_us`, `<h1>`
"Participa en la Comunidad" y párrafo introductorio. Animaciones `hero-animate`.

### ParticipationCard (common)
Tarjeta con estética de `ResourceCard`: fondo `--sbg-bg-surface`, borde, hover con
elevación y glow que sigue el cursor. Contiene icono (emoji grande), título,
descripción y un `<button>` de acción. El botón NO navega a otra página: dispara un
evento para abrir/enfocar el formulario con el tipo preseleccionado
(`data-proposal-type`), haciendo scroll suave a la sección del formulario.

### ParticipateWaysSection
Encabezado `# participate.ways` + grid responsive (1 col móvil, 2 col `sm`, 4 col
`lg`) de `ParticipationCard` a partir de `PARTICIPATION_WAYS`.

### ParticipateIdeaSection
Bloque centrado (patrón `AboutCtaSection` / `ContactSection`): tarjeta con borde
redondeado, título "¿Tienes alguna idea?", texto y botón "Compartir mi idea" que
preselecciona `IDEA` y enfoca el formulario.

### ParticipateFormSection
Formulario accesible con:
- Fieldset "Datos personales": Nombre*, Apellido*, Correo*.
- Fieldset "Sobre tu propuesta": Título*, Descripción* (textarea) con texto de ayuda.
- Modalidad*: grupo de radios (Virtual/Presencial/Híbrida).
- Nivel*: grupo de radios con descripción por nivel.
- Campo opcional "¿Tienes alguna idea o algo más que quieras contarnos?".
- Checkbox de consentimiento* .
- Campo oculto `type` que refleja el tipo seleccionado (por defecto `TALK`).
- Botón "Enviar propuesta".

Comportamiento por tipo:
- `IDEA` y `VOLUNTEER` ocultan/relajan los campos específicos de charla
  (título/descripción/modalidad/nivel dejan de ser obligatorios y se ocultan los de
  charla). Correo + consentimiento siempre obligatorios.
- Un selector de tipo (radios/segmented) permite cambiar el tipo dentro del formulario
  y se sincroniza con los botones de las tarjetas.

Estados (manejados con un `<script is:inline>` vanilla, siguiendo el estilo del repo):
- Validación en cliente: campos obligatorios + formato de correo. Mensajes con
  `aria-describedby` y `aria-invalid`.
- Loading: botón `disabled`, texto "Enviando propuesta...".
- Éxito: se oculta el formulario y se muestra el bloque de confirmación
  "¡Gracias por participar!".
- Error de conexión / servidor: mensaje en un `role="alert"` y botón rehabilitado.

Envío:
- Construye el payload `{ type, firstName, lastName, email, title, description,
  modality, level, additionalIdea }`.
- Si `PROPOSALS_ENDPOINT` está vacío → simula el envío con un `setTimeout` y resuelve
  como éxito (permite probar la UX). Si está configurado → `fetch` real con manejo de
  errores de red (`catch`) y de estado (`!res.ok`).

## Accesibilidad
- Un solo `<h1>` (hero). Secciones con `aria-labelledby`.
- Inputs con `<label>`; grupos de radio dentro de `<fieldset><legend>`.
- Foco visible (heredado del `:focus-visible` global).
- Área táctil ≥ 44px en botones y controles.
- `role="alert"` para errores de envío; `aria-live="polite"` para la confirmación.
- Respeta `prefers-reduced-motion` (animaciones ya condicionadas globalmente).

## Diseño visual
- Tokens `--sbg-*` exclusivamente. Acentos: naranja `--sbg-orange` y morado
  `--sbg-accent`, coherentes con el resto del sitio.
- Tipografías: `Space Mono` para headings/labels, `Nunito Sans` para cuerpo/UI.
- Reutiliza clases utilitarias: `.container-sbg`, `.code-label`, `hero-animate`,
  `data-animate` y las animaciones `float-*`.

## Estrategia de pruebas
- Verificación de build (`astro build`) y type-check (`astro check` / `tsc --noEmit`).
- Prueba manual de UX: validación, loading, éxito y error simulados; navegación por
  teclado; responsive a 375px y 1280px.
