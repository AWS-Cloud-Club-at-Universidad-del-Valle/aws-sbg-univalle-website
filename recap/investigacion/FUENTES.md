# Fuentes del recap

Fecha de consulta de todas las fuentes web: **3 de noviembre de 2026**, salvo que se indique otra.

Niveles de verificación:

- **Confirmada por el líder**: dato entregado por el líder del grupo. No tiene fuente pública verificable al corte.
- **Fuente oficial**: canal propio del grupo, de AWS, de la Universidad del Valle o de la organización del evento.
- **Fuente pública**: fuente de terceros o perfil autodeclarado.
- **Sin verificar**: no se pudo comprobar. No se presenta como hecho en los entregables.

## 1. Comunidad y cifras generales

| Afirmación | Valor | Fuente | Nivel |
|---|---|---|---|
| Miembros en Meetup | 1.408 | [Meetup del grupo](https://www.meetup.com/aws-sbg-at-university-of-the-valle/) (campo `memberCounts.all`) | Fuente oficial |
| Eventos pasados en Meetup | 36 | [Meetup del grupo](https://www.meetup.com/aws-sbg-at-university-of-the-valle/) (conteo `PAST`) | Fuente oficial |
| Calificación promedio de eventos | 4,86 (se muestra como 4,9) con 183 valoraciones | [Meetup del grupo](https://www.meetup.com/aws-sbg-at-university-of-the-valle/) (`eventRatings`) | Fuente oficial |
| Fecha de creación del grupo en Meetup | 17 de noviembre de 2025 | [Meetup del grupo](https://www.meetup.com/aws-sbg-at-university-of-the-valle/) (`foundedDate`) | Fuente oficial |
| Aval de AWS para crear el grupo | Noviembre de 2025 | Líder del grupo | Confirmada por el líder |
| Miembros y eventos en el sitio web | 922+ miembros, 27+ eventos | [awsunivalle.dev](https://awsunivalle.dev/) y `src/lib/constants.ts` | Fuente oficial (desactualizada) |
| Más de 900 estudiantes impactados en 27 actividades, en todas las sedes | 900+ / 27 | [Agencia de Noticias Univalle, 15-oct-2026](https://www.univalle.edu.co/ciencia-y-tecnologia/estudiante-de-univalle-representara-a-colombia-en-aws-re-invent-2026) | Fuente oficial (dato aportado por el grupo) |
| Seguidores en LinkedIn | 863 | [LinkedIn del grupo](https://www.linkedin.com/company/aws-studentbuildergroupunivalle/) | Fuente oficial |
| Suscriptores y videos en YouTube | 56 suscriptores, 7 videos | [YouTube @awscloudunivalle](https://www.youtube.com/@awscloudunivalle) | Fuente oficial |
| Repositorios públicos en GitHub | 12 (organización creada el 1-feb-2026) | [GitHub](https://github.com/AWS-Cloud-Club-at-Universidad-del-Valle) vía API pública | Fuente oficial |
| Seguidores en Instagram | No disponible | [Instagram](https://www.instagram.com/awsbuildergroup.univalle/) exige inicio de sesión | Sin verificar |
| Seguidores en TikTok | No disponible | [TikTok](https://www.tiktok.com/@awscloudclub.univalle) no entrega datos sin JavaScript ni sesión | Sin verificar |

## 2. Eventos

| Afirmación | Fuente | Nivel |
|---|---|---|
| Lista de 36 eventos con fecha, modalidad, lugar, confirmaciones y descripción | Cada página pública `https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/{id}/` (datos estructurados de la página). Instantánea: `instantaneas/meetup_eventos_2026-11-03.json` | Fuente oficial |
| Misma lista de 36 eventos | [API pública del sitio](https://4fi9ot44ml.execute-api.us-east-1.amazonaws.com/prod/events), que sincroniza Meetup. Instantánea: `instantaneas/api_eventos_2026-11-03.json` | Fuente oficial |
| Lanzamiento oficial "Tu Primer Paso en la Nube": sábado 28 de febrero de **2026**, 5:00 p. m., virtual, 96 confirmaciones | [Evento 313397936](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/313397936/) | Fuente oficial |
| Confirmaciones citadas: "Tu próximo paso en Tech" 77, "Cada decisión es una toma" 60, reto sesión 7: 34, reto sesión 8: 28 | Eventos [317022147](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/317022147/), [316852576](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316852576/), [316375847](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316375847/), [316375885](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316375885/) | Fuente oficial (coinciden con los datos de partida) |
| Las confirmaciones de Meetup son RSVP, no asistencia real | Definición de Meetup; varios eventos presenciales usaron formularios de Google para inscribirse (ej. [314572381](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/314572381/)) | Fuente oficial |
| Reto AWS Certified Cloud Practitioner de 8 sesiones presenciales con el SBG de la UCEVA, cupos llenos | Eventos [316372017](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316372017/) a [316375885](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316375885/) | Fuente oficial |
| Sesiones 1 y 2 del reto centradas en cómputo | Líder del grupo. Meetup titula la sesión 1 "Introduction to the Cloud" y la 2 "Compute in AWS" | Confirmada por el líder (ver CONFLICTOS.md) |
| Evento "Construye Rápido... Despliega seguro!" coorganizado con AWS User Group Valle del Cauca, CENESIS e IEEE Computer Society | [Evento 315578404](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/315578404/) | Fuente oficial |
| Sesiones para la comunidad de IEEE | Líder del grupo; evento 315578404 como evidencia parcial | Confirmada por el líder |
| AWS Cloud Quest Valle del Cauca con Univalle, Icesi, UCEVA y U. de San Buenaventura: 156 confirmaciones | [Evento 316898074](https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316898074/) y [LinkedIn del grupo](https://www.linkedin.com/company/aws-studentbuildergroupunivalle/) | Fuente oficial |
| Cloud Quest con muchos ganadores de Univalle | Líder del grupo | Confirmada por el líder |
| Ponentes de DynamoDB 101 (Lucas Vera Toro) y Data Pipeline (Carlos Fernando Chicata) | [LinkedIn del grupo](https://www.linkedin.com/company/aws-studentbuildergroupunivalle/) | Fuente oficial |
| Demás ponentes invitados (Carlos Zambrano, William Antonio Guzmán Bernal, Jhon Robert Quintero, Raúl Alzate, Julián Darío Luna Patiño, José Verbel Tous, Germán Ruiz, Diana David) | Descripción pública de cada evento en Meetup | Fuente oficial |
| Sin eventos futuros publicados en Meetup ni en la agenda de la comunidad | [Meetup del grupo](https://www.meetup.com/aws-sbg-at-university-of-the-valle/) (0 activos) y [dondeaprendoaws.com](https://dondeaprendoaws.com/eventos/?community=meetup-38266319) | Fuente oficial / pública |

## 3. Hitos confirmados por el líder

| Afirmación | Nivel |
|---|---|
| Más de 20 vouchers de certificación entregados a estudiantes de Tuluá, Yumbo y otras sedes | Confirmada por el líder |
| Ponentes invitados por AWS en el AWS Summit Bogotá 2026 | Confirmada por el líder; ver Builder Spotlight abajo |
| Participación virtual en el AWS Community Day Perú | Confirmada por el líder |
| AWS re:Invent Watch & Build Party en Tuluá, 4 de diciembre de 2026, aprobada y avalada por AWS | Confirmada por el líder |
| Hackathon de AWS en diciembre de 2026, fecha por confirmar | Confirmada por el líder |

## 4. Prensa y reconocimientos

| Afirmación | Fuente | Nivel |
|---|---|---|
| Juan Manuel Hoyos Contreras, estudiante de décimo semestre de Ingeniería de Sistemas y líder del grupo, obtuvo la beca All Builders Welcome Grant para AWS re:Invent 2026 (Las Vegas, 30 nov – 4 dic). La beca cubre transporte, hospedaje, alimentación e ingreso | [Agencia de Noticias Univalle, 15-oct-2026](https://www.univalle.edu.co/ciencia-y-tecnologia/estudiante-de-univalle-representara-a-colombia-en-aws-re-invent-2026) | Fuente oficial |
| El artículo dice que Juan Manuel cofundó el grupo | Mismo artículo | Fuente oficial |
| Seleccionado para el AWS Builder Spotlight en el AWS Summit Bogotá 2026 | [Sessionize de Juan Manuel Hoyos](https://sessionize.com/juan-manuel-hoyos/) | Fuente pública (autodeclarada) |
| AWS Summit Bogotá 2026: 29 y 30 de julio de 2026 | [Página oficial de AWS](https://aws.amazon.com/es/events/summits/bogota) | Fuente oficial (no menciona el Spotlight) |
| Juan Hoyos aparece entre los líderes organizadores del AWS Student Community Day Colombia 2026 (26 de junio, Cámara de Comercio de Bogotá, 800+ cupos); Universidad del Valle figura como SBG participante | [awsstudentcommunity.day](https://awsstudentcommunity.day/en) | Fuente oficial del evento |
| Primer AWS SBG del Valle del Cauca | Meetup: Univalle creado el 17-nov-2025; UCEVA (Tuluá) el 28-may-2026; Icesi (Cali) el 19-sep-2026. Universo: grupos de Colombia en [dondeaprendoaws.com](https://dondeaprendoaws.com/comunidades/estudiantes/). Un resultado de búsqueda sobre una nota de la Facultad de Ingeniería también lo describe como "la primera comunidad de este tipo en el Valle del Cauca" | Fuente pública (válida para el universo listado) |
| Artículo de Ingeniería Informa de julio de 2026 | Enlazado desde [X de la Facultad](https://x.com/ingenieriauv?lang=es), que respondió HTTP 402. Un resultado de búsqueda menciona una nota sobre una licencia de AWS Skill Builder Premium gestionada por el grupo | Sin verificar |

## 5. Programa AWS y contexto

| Afirmación | Fuente | Nivel |
|---|---|---|
| Los AWS Student Builder Groups (antes AWS Cloud Clubs) son comunidades estudiantiles lideradas por estudiantes, con apoyo de AWS; los líderes reciben créditos, vouchers y contacto con AWS | [builder.aws.com](https://builder.aws.com/community/student-builder-groups) | Fuente oficial |
| Student Rewards (20-ago-2026): 12 meses de Skill Builder Premium (valor de 449 USD), 10 USD en créditos con 7 insignias, 20 USD con 14 y voucher de 100 USD con 21 | [Anuncio en Builder Center](https://builder.aws.com/content/3I1qkUtKhwU6K1VaGkfYRwtbz3o/introducing-student-rewards-on-aws-builder-center) | Fuente oficial |
| El sitio del grupo explica Student Rewards para estudiantes y profesores de Univalle | [awsunivalle.dev/student-rewards](https://awsunivalle.dev/student-rewards) | Fuente oficial |
| El sitio web del grupo corre en S3 + CloudFront con API Gateway, Lambda y DynamoDB definidos con AWS CDK | Repos `aws-sbg-univalle-website` y `aws-sbg-univalle-infrastructure` | Fuente oficial |

## 6. Comparación con otros grupos

Fuente: páginas públicas de Meetup de cada grupo, consultadas el 3-nov-2026. Universo: los 14 SBG de Colombia listados en [dondeaprendoaws.com](https://dondeaprendoaws.com/comunidades/estudiantes/) con página en Meetup. Instantánea: `instantaneas/sbg_colombia_2026-11-03.json`. Nivel: fuente oficial (Meetup) sobre un universo de fuente pública.

| Grupo | Ciudad | Creado | Miembros | Eventos pasados | Calificación | Valoraciones |
|---|---|---|---:|---:|---:|---:|
| [U. Distrital](https://www.meetup.com/aws-sbg-at-francisco-jose-de-caldas-district-univ-bogota/) | Bogotá | 2025-05-15 | 2.951 | 23 | 4,82 | 180 |
| [**Universidad del Valle**](https://www.meetup.com/aws-sbg-at-university-of-the-valle/) | Cali | 2025-11-17 | **1.408** | **36** | 4,86 | **183** |
| [EAN](https://www.meetup.com/aws-sbg-at-ean-university/) | Bogotá | 2025-05-23 | 1.052 | 37 | 4,91 | 86 |
| [U. Nacional Bogotá](https://www.meetup.com/aws-sbg-at-national-university-of-colombia-bogota-campus/) | Bogotá | 2025-11-17 | 871 | 8 | 4,80 | 20 |
| [U. de Antioquia](https://www.meetup.com/aws-sbg-at-university-of-antioquia/) | Medellín | 2025-05-15 | 640 | 15 | 4,88 | 32 |
| [IU Digital de Antioquia](https://www.meetup.com/aws-sbg-at-digital-university-institution-of-antioquia/) | Medellín | 2025-05-16 | 305 | 2 | 4,64 | 11 |
| [La Salle](https://www.meetup.com/aws-sbg-at-la-salle-university/) | Bogotá | 2026-05-28 | 252 | 4 | 5,00 | 8 |
| [USTA](https://www.meetup.com/aws-sbg-at-usta-saint-thomas-aquinas-university/) | Tunja | 2026-05-28 | 246 | 1 | 3,00 | 4 |
| [Sergio Arboleda](https://www.meetup.com/aws-sbg-at-sergio-arboleda-university-bogota-campus/) | Bogotá | 2026-02-16 | 199 | 6 | 4,83 | 6 |
| [UCEVA](https://www.meetup.com/aws-sbg-at-central-unit-of-valle-del-cauca-sede-principal/) | Tuluá | 2026-05-28 | 181 | 14 | 4,92 | 12 |
| [U. Nacional El Volador](https://www.meetup.com/aws-sbg-at-national-university-of-colombia-el-volador-campus/) | Medellín | 2025-11-17 | 151 | 1 | 5,00 | 3 |
| [Piloto Girardot](https://www.meetup.com/aws-sbg-at-pilot-uni-of-colombia-girardot-campus/) | Girardot | 2026-05-29 | 107 | 1 | — | 0 |
| [Uniempresarial](https://www.meetup.com/aws-sbg-at-uniempresarial-business-university-foundation-bcc/) | Bogotá | 2025-11-17 | 80 | 12 | 5,00 | 11 |
| [Icesi](https://www.meetup.com/aws-sbg-at-colombian-institute-of-higher-studies-of-incolda/) | Cali | 2026-09-19 | 53 | 1 | 5,00 | 1 |

## 7. Fuentes que no se pudieron abrir

| URL | Resultado | Alternativa usada |
|---|---|---|
| https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/past/ | Redirige a inicio de sesión | Página de cada evento + API del sitio |
| https://www.meetup.com/aws-sbg-at-university-of-the-valle/feedback-overview/ | Redirige a inicio de sesión | Calificación agregada de la página del grupo |
| https://www.meetup.com/aws-sbg-at-university-of-the-valle/photos/ | Tiempo de espera agotado; sin datos sin sesión | Ninguna. Se dejan espacios para fotos reales |
| https://x.com/ingenieriauv?lang=es | HTTP 402 | Búsqueda web (sin acceso al artículo) |
| https://co.linkedin.com/in/pablo-nicolas-marin | HTTP 999 (bloqueo de LinkedIn) | Ninguna |
| https://co.linkedin.com/in/juanhcontreras/en | HTTP 999 | Sessionize y artículo de Univalle |
| https://co.linkedin.com/in/janncarlo-devops | HTTP 999 | Anfitriones públicos en Meetup |
| https://www.instagram.com/awsbuildergroup.univalle/ | Exige inicio de sesión | Ninguna |
| https://www.tiktok.com/@awscloudclub.univalle | Sin datos sin JavaScript ni sesión | Ninguna |

El perfil https://co.linkedin.com/in/hectorocampo abrió, pero solo muestra que compartió la publicación del lanzamiento oficial. No aporta cifras.
