# Requisitos — Participa en la Comunidad

## Introducción

El módulo **Participa en la Comunidad** es el punto central para que cualquier
persona (estudiantes, profesionales, speakers y miembros) conozca las diferentes
formas de aportar a la comunidad AWS SBG Univalle y envíe propuestas.

Este documento cubre **únicamente el frontend**. El backend (API Gateway, Lambda,
DynamoDB, Amazon SES) se especifica como contexto de integración, pero no se
implementa en esta iteración. El formulario se construye preparado para conectarse
a un endpoint `POST /community/proposals` mediante una variable de configuración.

Formas de participación:

- Postular una charla (`TALK`).
- Proponer un workshop (`WORKSHOP`).
- Proponer un taller (`TALLER`).
- Ser voluntario en eventos presenciales (`VOLUNTEER`).
- Compartir una idea para mejorar la comunidad (`IDEA`).

## Requisitos

### Requisito 1 — Página y acceso desde navegación

**Historia:** Como visitante, quiero encontrar fácilmente la sección de
participación desde el menú, para conocer cómo puedo aportar.

**Criterios de aceptación:**

1. CUANDO el usuario visite `/participate`, ENTONCES el sistema DEBE mostrar la
   página "Participa en la Comunidad" usando el `BaseLayout` existente.
2. EL sistema DEBE agregar un enlace "Participa" en la navegación principal
   (`NAV_LINKS`) con un icono coherente con el resto del menú.
3. CUANDO la ruta actual empiece por `/participate`, ENTONCES el enlace del menú
   DEBE marcarse como activo (`aria-current="page"`).
4. LA página DEBE incluir metadatos SEO (título y descripción) coherentes con el
   resto del sitio.

### Requisito 2 — Sección Hero

**Historia:** Como visitante, quiero entender de inmediato el propósito de la
página, para decidir cómo participar.

**Criterios de aceptación:**

1. LA página DEBE mostrar un único `<h1>` con el texto "Participa en la Comunidad".
2. EL hero DEBE incluir un subtítulo que invite a compartir conocimiento, crear
   experiencias y ayudar a construir la comunidad.
3. EL hero DEBE seguir el lenguaje visual existente (code-label, gradientes
   decorativos, animaciones `hero-animate`).

### Requisito 3 — Formas de participación (tarjetas)

**Historia:** Como visitante, quiero ver las distintas formas de participar en
tarjetas claras, para elegir la que me interese.

**Criterios de aceptación:**

1. LA sección "¿Cómo puedes participar?" DEBE mostrar tarjetas para: Dar una
   charla, Proponer un workshop, Proponer un taller y Ser voluntario.
2. CADA tarjeta DEBE incluir icono, título, descripción y un botón de acción
   (Postular / Proponer / Participar).
3. CUANDO el usuario active la acción de una tarjeta, ENTONCES el sistema DEBE
   llevarlo al formulario con el tipo de propuesta correspondiente preseleccionado.
4. LAS tarjetas DEBEN ser responsive (1 columna en móvil, varias en desktop) y
   cumplir el área táctil mínima de 44×44px.

### Requisito 4 — Sección "¿Tienes una idea?"

**Historia:** Como visitante que no quiere dar una charla ni ser voluntario,
quiero un espacio para aportar ideas.

**Criterios de aceptación:**

1. LA página DEBE incluir una sección independiente "¿Tienes alguna idea?" con el
   texto invitacional y un botón "Compartir mi idea".
2. CUANDO el usuario active "Compartir mi idea", ENTONCES el formulario DEBE
   preseleccionar el tipo `IDEA`.

### Requisito 5 — Formulario de propuesta

**Historia:** Como proponente, quiero completar un formulario claro para enviar
mi propuesta.

**Criterios de aceptación:**

1. EL formulario DEBE solicitar datos personales obligatorios: Nombre, Apellido y
   Correo electrónico.
2. EL formulario DEBE solicitar información de la propuesta: Título (texto) y
   Descripción (área de texto amplia) con texto de ayuda.
3. EL formulario DEBE permitir seleccionar la **modalidad** (Virtual, Presencial,
   Híbrida) como campo obligatorio.
4. EL formulario DEBE permitir seleccionar el **nivel** (100, 200, 300, 400) con
   una breve descripción de cada nivel inspirada en los niveles de AWS.
5. EL formulario DEBE incluir un campo opcional de información adicional / idea.
6. EL formulario DEBE incluir un checkbox de consentimiento obligatorio.
7. EL formulario DEBE conocer el **tipo de propuesta** (`TALK`, `WORKSHOP`,
   `TALLER`, `IDEA`, `VOLUNTEER`) y adaptar textos/campos visibles según el tipo.
8. CUANDO el tipo sea `IDEA` o `VOLUNTEER`, ENTONCES los campos específicos de
   charla (título/descripción/modalidad/nivel) PUEDEN ocultarse o hacerse opcionales
   según corresponda, manteniendo el correo y consentimiento obligatorios.

### Requisito 6 — Validación

**Historia:** Como proponente, quiero recibir mensajes claros de validación, para
corregir errores antes de enviar.

**Criterios de aceptación:**

1. CUANDO un campo obligatorio esté vacío al enviar, ENTONCES el sistema DEBE
   mostrar "Este campo es obligatorio" asociado a ese campo.
2. CUANDO el correo tenga formato inválido, ENTONCES el sistema DEBE mostrar
   "Ingresa un correo electrónico válido".
3. LOS mensajes de error DEBEN vincularse al input mediante `aria-describedby` y
   marcar el campo con `aria-invalid`.
4. LA validación DEBE ejecutarse en el cliente antes de intentar el envío.

### Requisito 7 — Envío, estados y protección contra duplicados

**Historia:** Como proponente, quiero feedback durante y después del envío, para
saber qué está ocurriendo.

**Criterios de aceptación:**

1. CUANDO se envíe el formulario, ENTONCES el botón DEBE deshabilitarse y mostrar
   "Enviando propuesta..." para evitar envíos duplicados.
2. CUANDO el envío sea exitoso, ENTONCES el sistema DEBE mostrar la confirmación
   "¡Gracias por participar!" con el mensaje de seguimiento y ocultar el formulario.
3. CUANDO ocurra un error de conexión, ENTONCES el sistema DEBE mostrar "No pudimos
   enviar tu propuesta. Intenta nuevamente." y rehabilitar el botón.
4. CUANDO ocurra un error del servidor, ENTONCES el sistema DEBE mostrar "Ocurrió un
   error procesando tu propuesta. Intenta nuevamente más tarde." y rehabilitar el botón.
5. EL payload enviado DEBE seguir la estructura acordada con el backend
   (`type`, `firstName`, `lastName`, `email`, `title`, `description`, `modality`,
   `level`, `additionalIdea`).

### Requisito 8 — Accesibilidad y diseño

**Historia:** Como usuario con tecnología de asistencia o en móvil, quiero una
experiencia accesible y responsive.

**Criterios de aceptación:**

1. LA página DEBE ser completamente operable con teclado y tener foco visible en
   todos los elementos interactivos.
2. TODOS los inputs DEBEN tener un `<label>` asociado.
3. LA página DEBE ser responsive (móvil ≤ 375px y desktop ≥ 1280px).
4. LAS animaciones DEBEN respetar `prefers-reduced-motion`.
5. EL diseño DEBE usar exclusivamente los tokens del design system existente
   (variables `--sbg-*`), sin colores arbitrarios.

### Requisito 9 — Alcance (solo frontend)

**Criterios de aceptación:**

1. ESTA iteración NO implementa recursos de AWS (API Gateway, Lambda, DynamoDB, SES).
2. LA URL del endpoint DEBE definirse como constante configurable para conectar el
   backend posteriormente sin refactorizar los componentes.
3. SI el endpoint no está configurado, ENTONCES el formulario DEBE simular el envío
   de forma controlada para permitir probar la UX (sin exponer datos sensibles).
