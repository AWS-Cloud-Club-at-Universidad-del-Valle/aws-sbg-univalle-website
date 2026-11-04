# Hallazgos — AWS Student Builder Group Universidad del Valle

Corte: **3 de noviembre de 2026**. Cifras calculadas por `recap/scripts/construir_datos.py` y guardadas en `recap/metricas.json`. Fuentes en `FUENTES.md`; diferencias entre fuentes en `CONFLICTOS.md`.

> Las "confirmaciones" son RSVP de Meetup ("Asistiré"). No son asistencia real. En varios eventos presenciales la inscripción se hizo por formulario externo, así que Meetup subestima esos eventos.

## 1. Resumen

En 351 días desde su creación (17-nov-2025) y 248 desde el lanzamiento oficial (28-feb-2026), el grupo publicó **36 eventos** en Meetup: 20 presenciales y 16 virtuales. Sumó **1.757 confirmaciones** y llegó a **1.408 miembros** con una calificación de **4,86/5 en 183 valoraciones**. El ritmo se aceleró en el segundo semestre: septiembre y octubre concentran **20 de los 36 eventos (56 %)**.

El rasgo que más lo distingue es la **regionalización**: **16 de los 20 eventos presenciales se hicieron en Tuluá**, en la sede Villa Campestre de Univalle y en la Escuela de Policía Simón Bolívar. El grupo nació en Cali, pero su actividad presencial vive en la sede regional.

## 2. Línea de tiempo

| Fecha | Hito | Nivel |
|---|---|---|
| Nov 2025 | AWS da el aval para crear el grupo | Confirmada por el líder |
| 17-nov-2025 | Se crea el grupo en Meetup | Fuente oficial |
| 1-feb-2026 | Se crea la organización en GitHub | Fuente oficial |
| 28-feb-2026 | Lanzamiento oficial "Tu Primer Paso en la Nube" (virtual, 96 confirmaciones, taller de EC2) | Fuente oficial |
| 16-mar-2026 | Charla con Carlos Zambrano, AWS Hero (93 confirmaciones) | Fuente oficial |
| 11-may-2026 | Primer evento presencial en Tuluá (certificaciones y GitOps) | Fuente oficial |
| 28-may-2026 | Nace el SBG de la UCEVA en Tuluá, futuro aliado del reto | Fuente oficial |
| 12-jun-2026 | Primer evento presencial en Cali, sede Meléndez | Fuente oficial |
| 26-jun-2026 | AWS Student Community Day Colombia en Bogotá. Juan Hoyos figura entre los líderes organizadores y Univalle como SBG participante | Fuente oficial del evento |
| 25-jul-2026 | "Construye Rápido... Despliega seguro!" con AWS User Group Valle del Cauca, CENESIS e IEEE Computer Society (89 confirmaciones, el presencial con más confirmaciones) | Fuente oficial |
| 29/30-jul-2026 | AWS Summit Bogotá 2026: ponentes invitados por AWS; Builder Spotlight según Sessionize | Confirmada por el líder / fuente pública |
| Jul 2026 | Nota de Ingeniería Informa (no se pudo abrir) | Sin verificar |
| 20-ago-2026 | AWS lanza Student Rewards; el grupo publica una guía para Univalle en su sitio | Fuente oficial |
| 3-sep-2026 | Dos charlas en la Escuela de Policía Simón Bolívar de Tuluá | Fuente oficial |
| Sep 2026 | Lanzamiento del sitio awsunivalle.dev, construido sobre AWS con CDK | Fuente oficial |
| 19-sep → 29-oct-2026 | Reto AWS Certified Cloud Practitioner: 8 sesiones presenciales con la UCEVA, cupos llenos | Fuente oficial |
| 28-sep-2026 | TryCatch.tv llega a Univalle (152 confirmaciones) | Fuente oficial |
| 6-oct-2026 | Contenedores 101 en la Universidad Icesi | Fuente oficial |
| 14-oct-2026 | Kick-off de AWS Cloud Quest Valle del Cauca con Univalle, Icesi, UCEVA y San Buenaventura (156 confirmaciones, récord del grupo) | Fuente oficial |
| 15-oct-2026 | La Agencia de Noticias Univalle publica la beca All Builders Welcome de Juan Manuel Hoyos para re:Invent | Fuente oficial |
| 19-oct-2026 | Germán Ruiz, Senior Solutions Architect de AWS, habla con la comunidad | Fuente oficial |
| 30-nov → 4-dic-2026 | AWS re:Invent en Las Vegas, con el líder del grupo becado | Fuente oficial |
| 4-dic-2026 | AWS re:Invent Watch & Build Party en Tuluá, aprobada y avalada por AWS | Confirmada por el líder |
| Dic 2026 (por confirmar) | Hackathon de AWS | Confirmada por el líder |

Sin fecha pública: más de 20 vouchers entregados, participación virtual en el AWS Community Day Perú, sesiones para IEEE y ganadores de Cloud Quest (todo confirmado por el líder).

## 3. Temas

| Tema | Eventos | Confirmaciones |
|---|---:|---:|
| Reto Cloud Practitioner | 8 | 251 |
| IA y datos | 7 | 359 |
| Carrera y empleabilidad | 5 | 481 |
| Comunidad y lanzamiento | 4 | 352 |
| Serverless y arquitectura | 4 | 38 |
| Certificación y fundamentos | 3 | 86 |
| DevOps e IaC | 3 | 123 |
| Seguridad | 2 | 67 |

Lectura: **la carrera profesional es lo que más convoca en virtual** (481 confirmaciones en 5 charlas, 96 de media). **La certificación es la columna de lo presencial**: el reto llenó cupos durante ocho semanas. Serverless figura con pocas confirmaciones porque sus cuatro eventos fueron presenciales con inscripción externa.

## 4. Patrones de asistencia (confirmaciones)

- Total: **1.757** confirmaciones en 36 eventos. Media de **48,8** y mediana de **37**.
- Virtual: **81,6** de media en 16 eventos (1.305 en total).
- Presencial: **22,6** de media en 20 eventos. Está subestimado por los formularios externos.
- Reto Cloud Practitioner: 40, 29, 24, 22, 34, 40, 34 y 28 confirmaciones, con media de **31,4**. La convocatoria se sostuvo de principio a fin: la sesión 6 igualó a la primera.
- Los cinco eventos con más confirmaciones: Cloud Quest Valle (156), TryCatch.tv (152), De AWS a LinkedIn (99), Lanzamiento (96) y Carlos Zambrano, AWS Hero (93).
- Por sede: Virtual 16 eventos; Tuluá–Villa Campestre 14; Tuluá–Escuela de Policía 2; Cali–Meléndez 2; Cali–Icesi 1; Bogotá 1 (Community Day).

## 5. Crecimiento y ritmo (calculado con código)

| Indicador | Valor |
|---|---|
| Días desde la creación (17-nov-2025) | 351 (11,53 meses) |
| Eventos por mes desde la creación | **3,12** |
| Días desde el lanzamiento (28-feb-2026) | 248 (8,15 meses) |
| Eventos por mes desde el lanzamiento | **4,42** |
| Eventos por semana desde el lanzamiento | **1,02**, en promedio uno por semana |
| Confirmaciones por mes desde el lanzamiento | **215,6** |
| Eventos por mes: feb–jul 2026 | 16 eventos en 6 meses (2,7 por mes) |
| Eventos por mes: sep–oct 2026 | 20 eventos en 2 meses (10 por mes) |

Agosto no tuvo eventos publicados (la causa no está documentada en las fuentes públicas). Noviembre aún no tiene eventos publicados.

Entre noviembre de 2025 y enero de 2026 no hay eventos publicados: el grupo ya existía en Meetup y el lanzamiento llegó el 28 de febrero. No hay un histórico público de miembros, porque Meetup no publica la serie, así que no se puede graficar la curva de miembros sin una exportación del organizador (ver PENDIENTES.md).

## 6. Personas públicas relevantes

Solo se incluyen personas que aparecen públicamente como organizadores o ponentes. No se nombran asistentes.

- **Juan Manuel Hoyos Contreras**: líder y cofundador. Estudiante de décimo semestre de Ingeniería de Sistemas. Beca All Builders Welcome para re:Invent 2026 y AWS Builder Spotlight en el Summit Bogotá 2026, según Sessionize. Figura entre los organizadores del Student Community Day Colombia 2026.
- **Equipo publicado en el sitio**: Sebastián Cifuentes Flórez, Pablo Nicolás Marín González, Aura María Peláez, Miguel Ángel Sanclemente Mejía y Jann Carlo Martínez. Varios figuran como anfitriones de eventos en Meetup. El sitio lo desarrollaron Pablo Nicolás Marín González y Gustavo Luna Sarmiento, y lo diseñó María Fernanda Betancourt, según LinkedIn.
- **Ponentes invitados**: Carlos Zambrano (AWS Hero), William Antonio Guzmán Bernal, Jhon Robert Quintero (AWS Community Builder), Raúl Alzate, Lucas Vera Toro, Carlos Fernando Chicata, Julián Darío Luna Patiño (AWS Community Builder, TryCatch.tv), José Verbel Tous, Germán Ruiz (Senior Solutions Architect, AWS) y Diana David (HR Manager LATAM).

## 7. Alianzas verificadas

- **AWS SBG UCEVA** (Tuluá): reto Cloud Practitioner de 8 sesiones y Cloud Quest.
- **Universidad Icesi, U. de San Buenaventura**: Cloud Quest Valle del Cauca. Icesi también fue sede de Contenedores 101.
- **AWS User Group Valle del Cauca, CENESIS e IEEE Computer Society**: "Construye Rápido... Despliega seguro!"
- **Escuela de Policía Simón Bolívar, Tuluá**: sede de dos charlas.
- **Red de SBG de Colombia**: Student Community Day Colombia 2026.
- **TryCatch.tv**: charla de carrera.

## 8. Comparación con grupos verificados

Universo: 14 SBG de Colombia listados en dondeaprendoaws.com con página en Meetup. Corte: 3-nov-2026. Tabla completa en FUENTES.md §6.

- **Miembros**: Univalle es **2.º de 14** (1.408). La U. Distrital es 1.ª con 2.951.
- **Eventos pasados**: Univalle es **2.º de 14** (36). EAN es 1.ª con 37.
- **Valoraciones recibidas**: Univalle es **1.º de 14** (183). La U. Distrital tiene 180.
- **Calificación promedio**: 4,86. Hay grupos con promedios más altos, pero con muchas menos valoraciones.
- **Es el único de los cinco primeros por miembros que no está en Bogotá ni en Medellín.**
- **Primer SBG del Valle del Cauca** dentro de este universo: Univalle (17-nov-2025), UCEVA (28-may-2026) e Icesi (19-sep-2026).

Advertencias: los grupos se crearon en fechas distintas (de mayo de 2025 a septiembre de 2026), así que las cifras acumuladas no miden lo mismo. El universo depende de un directorio comunitario. **No se afirma "el más grande" ni "el más activo" de Colombia.**

## 9. Los 10 logros más fuertes

1. **36 eventos en 8 meses desde el lanzamiento**, con un promedio de uno por semana (fuente oficial).
2. **1.408 miembros en Meetup, 2.º entre 14 SBG de Colombia**, y el único del top 5 fuera de Bogotá y Medellín (fuente oficial, corte 3-nov-2026).
3. **4,86/5 con 183 valoraciones**, el mayor número de valoraciones entre los 14 grupos (fuente oficial).
4. **Beca All Builders Welcome para AWS re:Invent 2026** para el líder del grupo, publicada por la Universidad del Valle (fuente oficial).
5. **Reto Cloud Practitioner de 8 sesiones con la UCEVA**: cupos llenos y 31,4 confirmaciones de media por sesión (fuente oficial).
6. **Más de 20 vouchers de certificación** para estudiantes de Tuluá, Yumbo y otras sedes (confirmado por el líder).
7. **Tuluá como polo regional**: 16 de 20 eventos presenciales fuera de Cali (fuente oficial).
8. **Ponentes invitados por AWS en el AWS Summit Bogotá 2026** (líder) y AWS Builder Spotlight (Sessionize).
9. **AWS Cloud Quest Valle del Cauca con cuatro universidades**: 156 confirmaciones, récord del grupo (fuente oficial), y muchos ganadores de Univalle (líder).
10. **Primer SBG del Valle del Cauca**, que hoy colabora con los SBG que llegaron después (UCEVA, Icesi) y con el AWS User Group regional (fuente pública).

Menciones: sitio propio construido sobre AWS con CDK; 12 repos públicos con retos de práctica; ponentes como un AWS Hero y un Senior Solutions Architect de AWS; participación en el Community Day Perú y sesiones para IEEE (líder).

## 10. Lo que viene

- **4-dic-2026: AWS re:Invent Watch & Build Party en Tuluá**, aprobada y avalada por AWS. Coincide con el último día de re:Invent, cuando el líder estará en Las Vegas: la comunidad sigue la conferencia y construye desde Tuluá.
- **Diciembre de 2026: Hackathon de AWS**, con fecha por confirmar. Sería el primer hackathon del grupo; el sitio ya lo promete como beneficio para los miembros.

Ninguno de los dos está publicado todavía en Meetup.
