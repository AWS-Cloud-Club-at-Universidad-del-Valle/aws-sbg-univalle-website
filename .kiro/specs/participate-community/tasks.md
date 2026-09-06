# Tareas — Participa en la Comunidad (Frontend)

- [ ] 1. Tipos y datos
  - [ ] 1.1 Agregar tipos en `src/types/index.ts`: `ProposalType`, `ProposalModality`,
        `ProposalLevel`, `IParticipationWay`, `ITalkLevel`.
  - [ ] 1.2 Agregar en `src/lib/constants.ts`: `PARTICIPATION_WAYS`, `TALK_LEVELS`,
        `PROPOSAL_MODALITIES`, `PROPOSALS_ENDPOINT`, `COMMUNITY_EMAIL`.
  - _Requisitos: 3, 5, 9_

- [ ] 2. Navegación
  - [ ] 2.1 Agregar `{ href: '/participate', label: 'Participa' }` a `NAV_LINKS`.
  - [ ] 2.2 Agregar icono para `/participate` en el `navIcons` del `Navbar`.
  - _Requisitos: 1_

- [ ] 3. Componentes de sección
  - [ ] 3.1 `ParticipateHeroSection.astro` con `<h1>` y patrón visual del sitio.
  - [ ] 3.2 `ParticipationCard.astro` (common) con acción que preselecciona el tipo.
  - [ ] 3.3 `ParticipateWaysSection.astro` con grid de tarjetas.
  - [ ] 3.4 `ParticipateIdeaSection.astro` con CTA "Compartir mi idea".
  - _Requisitos: 2, 3, 4_

- [ ] 4. Formulario
  - [ ] 4.1 `ParticipateFormSection.astro` con todos los campos, fieldsets y labels.
  - [ ] 4.2 Validación en cliente (obligatorios + correo) con `aria-*`.
  - [ ] 4.3 Estados loading/éxito/error y protección contra duplicados.
  - [ ] 4.4 Adaptación de campos según el tipo de propuesta.
  - [ ] 4.5 Envío con `PROPOSALS_ENDPOINT` (o simulación si está vacío).
  - _Requisitos: 5, 6, 7, 9_

- [ ] 5. Página
  - [ ] 5.1 `src/pages/participate.astro` que compone las secciones dentro de `BaseLayout`.
  - _Requisitos: 1, 8_

- [ ] 6. Verificación
  - [ ] 6.1 `npx astro check` sin errores de tipos.
  - [ ] 6.2 `npm run build` exitoso.
  - _Requisitos: 8_
