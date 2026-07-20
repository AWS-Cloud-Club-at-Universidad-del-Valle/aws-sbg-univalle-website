# Requirements Document

## Introduction

Este documento define los requisitos para la automatización completa del despliegue del sitio web oficial del AWS Student Builder Group de la Universidad del Valle. El sistema de despliegue utiliza GitHub Actions como plataforma de CI/CD, Amazon S3 como hosting de archivos estáticos, Amazon CloudFront como CDN y Amazon Route 53 como gestor de DNS. La autenticación con AWS se realiza exclusivamente mediante OIDC (OpenID Connect), sin claves de acceso estáticas. El pipeline diferencia entre la rama `main` (despliegue completo a producción) y la rama `develop` (solo build y validación).

## Glossary

- **CI_Pipeline**: El workflow de GitHub Actions responsable de validar el build en ramas que no sean `main`.
- **Deploy_Pipeline**: El workflow de GitHub Actions responsable de construir y desplegar el sitio a producción.
- **Build_Step**: El proceso que ejecuta `npm run build` para generar el directorio `dist/`.
- **Dist_Directory**: El directorio `dist/` generado por Astro que contiene los archivos estáticos del sitio.
- **S3_Bucket**: El bucket de Amazon S3 que almacena los archivos estáticos del sitio, accesible únicamente vía OAC de CloudFront.
- **CloudFront_Distribution**: La distribución de Amazon CloudFront que sirve el sitio como CDN global.
- **OIDC_Provider**: El proveedor de identidad OpenID Connect configurado en AWS para autenticar GitHub Actions sin claves de acceso estáticas.
- **IAM_Role**: El rol de AWS IAM asumido por GitHub Actions mediante OIDC, con permisos mínimos sobre S3 y CloudFront.
- **GitHub_Secret**: Variable cifrada almacenada en GitHub Secrets, inyectada en el pipeline en tiempo de ejecución.
- **Cache_Header**: El valor del encabezado HTTP `Cache-Control` aplicado a los archivos al sincronizarlos con S3.
- **Hashed_Asset**: Archivo estático en `dist/_astro/` cuyo nombre incluye un hash de contenido generado por Astro.
- **HTML_Page**: Archivo `.html` en `dist/` que representa una página del sitio, sin hash en el nombre.
- **Invalidation**: Operación de CloudFront que elimina archivos del caché de la CDN forzando la descarga desde el origen.
- **nvmrc**: Archivo `.nvmrc` en la raíz del repositorio que especifica la versión de Node.js utilizada por el pipeline.

---

## Requirements

### Requirement 1: Trigger de despliegue por rama

**User Story:** Como mantenedor del sitio, quiero que el pipeline de despliegue se ejecute automáticamente al hacer push a `main` y que la rama `develop` solo ejecute build y validación, para garantizar que solo el código aprobado llegue a producción.

#### Acceptance Criteria

1. WHEN un push se realiza a la rama `main`, THE Deploy_Pipeline SHALL ejecutar los pasos de build, sincronización con S3 e invalidación de CloudFront.
2. WHEN un push se realiza a la rama `develop`, THE CI_Pipeline SHALL ejecutar únicamente los pasos de instalación de dependencias y build, sin ejecutar sincronización ni invalidación.
3. WHEN un push se realiza a cualquier rama distinta de `main` y `develop`, THE CI_Pipeline SHALL ejecutar los pasos de instalación de dependencias y build.
4. THE Deploy_Pipeline SHALL ejecutarse exclusivamente en la rama `main` y en ninguna otra rama.

---

### Requirement 2: Instalación de dependencias

**User Story:** Como mantenedor del sitio, quiero que el pipeline instale dependencias de forma reproducible y limpia, para garantizar builds consistentes entre ejecuciones.

#### Acceptance Criteria

1. WHEN el pipeline inicia, THE CI_Pipeline SHALL instalar las dependencias del proyecto ejecutando `npm ci`.
2. WHEN el pipeline inicia, THE Deploy_Pipeline SHALL instalar las dependencias del proyecto ejecutando `npm ci`.
3. THE CI_Pipeline SHALL utilizar la versión de Node.js especificada en el archivo `.nvmrc` del repositorio.
4. THE Deploy_Pipeline SHALL utilizar la versión de Node.js especificada en el archivo `.nvmrc` del repositorio.
5. THE Deploy_Pipeline SHALL contener un archivo `.nvmrc` en la raíz del repositorio con la versión de Node.js `22` o superior.
6. IF el comando `npm ci` falla, THEN THE CI_Pipeline SHALL detenerse inmediatamente sin ejecutar pasos posteriores.
7. IF el comando `npm ci` falla, THEN THE Deploy_Pipeline SHALL detenerse inmediatamente sin ejecutar pasos posteriores.

---

### Requirement 3: Generación del build

**User Story:** Como mantenedor del sitio, quiero que el pipeline construya el sitio ejecutando `npm run build`, para generar los archivos estáticos en `dist/` listos para despliegue.

#### Acceptance Criteria

1. WHEN las dependencias han sido instaladas correctamente, THE Deploy_Pipeline SHALL ejecutar `npm run build` para generar el directorio `dist/`.
2. WHEN las dependencias han sido instaladas correctamente, THE CI_Pipeline SHALL ejecutar `npm run build` para generar el directorio `dist/`.
3. IF el comando `npm run build` falla, THEN THE Deploy_Pipeline SHALL detenerse inmediatamente sin ejecutar los pasos de sincronización ni invalidación.
4. IF el comando `npm run build` falla, THEN THE CI_Pipeline SHALL detenerse inmediatamente y reportar el error.

---

### Requirement 4: Verificación del directorio dist

**User Story:** Como mantenedor del sitio, quiero que el pipeline verifique que el directorio `dist/` exista y no esté vacío antes de sincronizar con S3, para evitar despliegues accidentales de builds incompletos o fallidos.

#### Acceptance Criteria

1. WHEN el build ha finalizado, THE Deploy_Pipeline SHALL verificar que el directorio `dist/` exista en el workspace antes de iniciar la sincronización.
2. WHEN el build ha finalizado, THE Deploy_Pipeline SHALL verificar que el directorio `dist/` contenga al menos un archivo antes de iniciar la sincronización.
3. IF el directorio `dist/` no existe después del build, THEN THE Deploy_Pipeline SHALL detenerse con un error descriptivo que indique la ausencia del directorio.
4. IF el directorio `dist/` existe pero está vacío, THEN THE Deploy_Pipeline SHALL detenerse con un error descriptivo que indique que el directorio está vacío.

---

### Requirement 5: Autenticación con AWS mediante OIDC

**User Story:** Como responsable de seguridad del proyecto, quiero que el pipeline se autentique con AWS usando OIDC sin claves de acceso estáticas, para eliminar el riesgo de exposición de credenciales de larga duración.

#### Acceptance Criteria

1. THE Deploy_Pipeline SHALL autenticarse con AWS asumiendo el `IAM_Role` referenciado por el `GitHub_Secret` `AWS_ROLE_ARN` mediante el proveedor OIDC de GitHub.
2. THE Deploy_Pipeline SHALL utilizar la acción `aws-actions/configure-aws-credentials` para configurar las credenciales temporales de AWS.
3. THE Deploy_Pipeline SHALL requerir el permiso `id-token: write` en el bloque de permisos del job para poder solicitar el token OIDC.
4. THE Deploy_Pipeline SHALL requerir el permiso `contents: read` en el bloque de permisos del job para poder hacer checkout del código.
5. THE Deploy_Pipeline SHALL leer la región AWS desde el `GitHub_Secret` `AWS_REGION`.
6. IF el paso de autenticación OIDC falla, THEN THE Deploy_Pipeline SHALL detenerse inmediatamente sin ejecutar los pasos de sincronización ni invalidación.
7. THE Deploy_Pipeline SHALL configurar el permiso `id-token: write` exclusivamente en el job de deploy, no a nivel de workflow completo.

---

### Requirement 6: Gestión de secrets

**User Story:** Como responsable de seguridad del proyecto, quiero que todas las credenciales y configuraciones sensibles se almacenen exclusivamente en GitHub Secrets, para que nunca aparezcan en el código fuente ni en los logs del pipeline.

#### Acceptance Criteria

1. THE Deploy_Pipeline SHALL leer el ARN del rol IAM exclusivamente desde el `GitHub_Secret` `AWS_ROLE_ARN`.
2. THE Deploy_Pipeline SHALL leer la región AWS exclusivamente desde el `GitHub_Secret` `AWS_REGION`.
3. THE Deploy_Pipeline SHALL leer el nombre del bucket S3 exclusivamente desde el `GitHub_Secret` `S3_BUCKET_NAME`.
4. THE Deploy_Pipeline SHALL leer el ID de la distribución CloudFront exclusivamente desde el `GitHub_Secret` `CLOUDFRONT_DISTRIBUTION_ID`.
5. THE Deploy_Pipeline SHALL contener cero valores de credenciales AWS hardcodeados en el archivo de workflow.
6. IF un `GitHub_Secret` requerido no está definido, THEN THE Deploy_Pipeline SHALL fallar con un error descriptivo antes de intentar ejecutar comandos AWS.

---

### Requirement 7: Sincronización con S3

**User Story:** Como mantenedor del sitio, quiero que el pipeline sincronice automáticamente el contenido de `dist/` con el bucket S3 usando `aws s3 sync --delete`, para que el bucket refleje exactamente el estado del último build sin archivos obsoletos.

#### Acceptance Criteria

1. WHEN el directorio `dist/` ha sido verificado y las credenciales AWS están configuradas, THE Deploy_Pipeline SHALL sincronizar el contenido de `dist/` con el `S3_Bucket` usando el comando `aws s3 sync`.
2. THE Deploy_Pipeline SHALL utilizar la opción `--delete` en el comando `aws s3 sync` para eliminar del bucket los archivos que ya no existan en `dist/`.
3. THE Deploy_Pipeline SHALL aplicar el `Cache_Header` `no-cache, no-store, must-revalidate` a los archivos HTML durante la sincronización con S3.
4. THE Deploy_Pipeline SHALL aplicar el `Cache_Header` `public, max-age=31536000, immutable` a los `Hashed_Asset` ubicados en `dist/_astro/` durante la sincronización con S3.
5. IF el comando `aws s3 sync` falla, THEN THE Deploy_Pipeline SHALL detenerse inmediatamente sin ejecutar el paso de invalidación de CloudFront.

---

### Requirement 8: Invalidación de CloudFront

**User Story:** Como mantenedor del sitio, quiero que el pipeline invalide la distribución de CloudFront después de cada sincronización exitosa, para que los usuarios reciban inmediatamente el contenido actualizado.

#### Acceptance Criteria

1. WHEN la sincronización con S3 ha finalizado exitosamente, THE Deploy_Pipeline SHALL crear una invalidación en la `CloudFront_Distribution` usando el comando `aws cloudfront create-invalidation`.
2. THE Deploy_Pipeline SHALL invalidar el path `/*` para forzar la actualización de todos los archivos en el caché de CloudFront.
3. THE Deploy_Pipeline SHALL leer el ID de la distribución desde el `GitHub_Secret` `CLOUDFRONT_DISTRIBUTION_ID`.
4. IF el comando `aws cloudfront create-invalidation` falla, THEN THE Deploy_Pipeline SHALL marcar el job como fallido y reportar el error.

---

### Requirement 9: Fail-fast y comportamiento ante errores

**User Story:** Como mantenedor del sitio, quiero que el pipeline se detenga inmediatamente si cualquier paso falla, para evitar que un error en un paso anterior cause daños en pasos posteriores.

#### Acceptance Criteria

1. THE Deploy_Pipeline SHALL configurar `set -e` o el equivalente en los pasos de shell para que cualquier comando fallido detenga la ejecución inmediatamente.
2. THE CI_Pipeline SHALL configurar `set -e` o el equivalente en los pasos de shell para que cualquier comando fallido detenga la ejecución inmediatamente.
3. WHEN cualquier paso del Deploy_Pipeline falla, THE Deploy_Pipeline SHALL marcar el job completo como fallido sin ejecutar los pasos subsiguientes.
4. WHEN cualquier paso del CI_Pipeline falla, THE CI_Pipeline SHALL marcar el job completo como fallido sin ejecutar los pasos subsiguientes.
5. THE Deploy_Pipeline SHALL utilizar `if: failure()` o mecanismos equivalentes para garantizar que los pasos de limpieza o notificación solo corran cuando sea apropiado.

---

### Requirement 10: Documentación del workflow

**User Story:** Como desarrollador del equipo, quiero que los archivos de workflow estén completamente documentados con comentarios, para entender el propósito de cada paso sin necesidad de consultar documentación externa.

#### Acceptance Criteria

1. THE Deploy_Pipeline SHALL incluir un comentario descriptivo al inicio del archivo que explique el propósito general del workflow.
2. THE Deploy_Pipeline SHALL incluir un comentario en cada step que describa qué hace ese paso y por qué es necesario.
3. THE CI_Pipeline SHALL incluir un comentario descriptivo al inicio del archivo que explique el propósito general del workflow.
4. THE CI_Pipeline SHALL incluir un comentario en cada step que describa qué hace ese paso y por qué es necesario.
5. THE Deploy_Pipeline SHALL documentar en comentarios los `GitHub_Secret` requeridos y su propósito antes de ser utilizados.

---

### Requirement 11: Estrategia de caché diferenciada

**User Story:** Como responsable de rendimiento del sitio, quiero que los archivos HTML no tengan caché y los assets con hash tengan caché de un año, para maximizar el rendimiento sin servir contenido obsoleto.

#### Acceptance Criteria

1. THE Deploy_Pipeline SHALL aplicar `Cache-Control: no-cache, no-store, must-revalidate` a todos los archivos con extensión `.html` durante la sincronización con S3.
2. THE Deploy_Pipeline SHALL aplicar `Cache-Control: public, max-age=31536000, immutable` a todos los archivos ubicados en `dist/_astro/` durante la sincronización con S3.
3. THE Deploy_Pipeline SHALL realizar la sincronización en múltiples pasos, separando los `Hashed_Asset` de los `HTML_Page` para poder aplicar diferentes `Cache_Header` a cada grupo.
4. WHEN los `Hashed_Asset` y los `HTML_Page` tienen diferentes `Cache_Header`, THE Deploy_Pipeline SHALL garantizar que el comando `--delete` elimine archivos obsoletos del bucket considerando todos los grupos sincronizados.

---

### Requirement 12: Archivo .nvmrc

**User Story:** Como desarrollador del equipo, quiero que exista un archivo `.nvmrc` con la versión de Node.js especificada, para que el pipeline y los desarrolladores locales usen la misma versión de Node.js.

#### Acceptance Criteria

1. THE Deploy_Pipeline SHALL leer la versión de Node.js del archivo `.nvmrc` ubicado en la raíz del repositorio.
2. THE CI_Pipeline SHALL leer la versión de Node.js del archivo `.nvmrc` ubicado en la raíz del repositorio.
3. THE nvmrc SHALL especificar una versión de Node.js igual o superior a `22.12.0`, consistente con el campo `engines` de `package.json`.
4. IF el archivo `.nvmrc` no existe en el repositorio, THEN THE CI_Pipeline SHALL fallar con un error antes de intentar instalar Node.js.
