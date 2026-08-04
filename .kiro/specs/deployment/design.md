# Design Document

## Feature: Deployment

## Overview

Este documento describe el diseño técnico del sistema de despliegue automatizado para el sitio web del AWS Student Builder Group de la Universidad del Valle. La solución consiste en dos workflows de GitHub Actions:

- **`ci.yml`**: Validación de build en todas las ramas (especialmente `develop` y feature branches).
- **`deploy.yml`**: Despliegue completo a producción, ejecutado exclusivamente en `main`.

La autenticación con AWS se realiza mediante OIDC, eliminando el uso de access keys estáticos. La estrategia de caché diferencia entre HTML (sin caché) y assets hasheados (caché de 1 año), maximizando el rendimiento del CDN sin riesgo de servir contenido obsoleto.

---

## Architecture

### Flujo general

```
Push a main
    │
    ▼
GitHub Actions — deploy.yml
    │
    ├─ 1. Checkout código
    ├─ 2. Setup Node.js (versión desde .nvmrc)
    ├─ 3. npm ci
    ├─ 4. npm run build  →  dist/
    ├─ 5. Verificar dist/ (existe y no vacío)
    ├─ 6. Configurar credenciales AWS via OIDC
    │       └─ Asume IAM_Role desde AWS_ROLE_ARN
    ├─ 7. aws s3 sync dist/_astro/ → S3 (Cache: 1 año, immutable)
    ├─ 8. aws s3 sync dist/ → S3 (Cache: no-cache, excluye _astro/, --delete)
    └─ 9. aws cloudfront create-invalidation (paths /*)

Push a develop / feature/*
    │
    ▼
GitHub Actions — ci.yml
    │
    ├─ 1. Checkout código
    ├─ 2. Setup Node.js (versión desde .nvmrc)
    ├─ 3. npm ci
    └─ 4. npm run build
```

### Arquitectura AWS

```
GitHub Actions (OIDC Token)
        │
        ▼ AssumeRoleWithWebIdentity
IAM Role (mínimo privilegio)
        │
        ├──▶ S3 Bucket (aws-sbg-univalle-website)
        │        └─ PutObject, DeleteObject, ListBucket, GetObject
        │
        └──▶ CloudFront Distribution
                 └─ CreateInvalidation
```

---

## Components and Interfaces

### Componente: `ci.yml` — Pipeline de Validación

**Descripción**: Workflow de GitHub Actions que valida la compilación del sitio en cualquier rama.

**Interfaces de entrada**:
- **Trigger**: Evento `push` a cualquier rama o `pull_request` hacia `develop` o `main`
- **Secrets requeridos**: Ninguno (no accede a AWS)
- **Archivos de configuración**: `.nvmrc` (versión de Node.js), `package-lock.json` (dependencias)

**Interfaces de salida**:
- **Exit code 0**: Build exitoso — indica que el código compila sin errores
- **Exit code ≠ 0**: Build fallido — bloquea el merge del PR en GitHub

**Contrato**: Si `npm run build` retorna 0, el workflow reporta `success`. Cualquier fallo en pasos anteriores (checkout, setup, `npm ci`) produce `failure` inmediata por fail-fast implícito de GitHub Actions.

---

### Componente: `deploy.yml` — Pipeline de Despliegue

**Descripción**: Workflow de GitHub Actions que construye y despliega el sitio a producción en AWS.

**Interfaces de entrada**:
- **Trigger**: Evento `push` exclusivamente a la rama `main`
- **Secrets requeridos**:
  - `AWS_ROLE_ARN` — ARN del IAM Role para asumir vía OIDC
  - `AWS_REGION` — Región AWS del bucket S3
  - `S3_BUCKET_NAME` — Nombre del bucket S3 destino
  - `CLOUDFRONT_DISTRIBUTION_ID` — ID de la distribución CloudFront
- **Archivos de configuración**: `.nvmrc`, `package-lock.json`
- **Permisos OIDC**: `id-token: write` (declarado a nivel de job), `contents: read`

**Interfaces de salida**:
- **Sitio desplegado**: Archivos estáticos sincronizados en S3 con estrategia de caché diferenciada
- **Caché invalidada**: Invalidación `/*` ejecutada en CloudFront, garantizando contenido fresco
- **Concurrencia controlada**: Runs anteriores cancelados si llega un nuevo push a `main`

**Contrato**: El sync S3 solo se ejecuta si el directorio `dist/` existe y no está vacío. La invalidación CloudFront solo se ejecuta si el sync completó exitosamente.

---

## Data Models

### GitHub Secrets Schema

Conjunto de variables de entorno cifradas inyectadas por GitHub Actions en tiempo de ejecución:

```typescript
interface GitHubSecrets {
  AWS_ROLE_ARN: string;              // ARN completo del IAM Role OIDC
                                     // Formato: "arn:aws:iam::123456789012:role/nombre-rol"
  AWS_REGION: string;                // Región AWS
                                     // Formato: "us-east-1"
  S3_BUCKET_NAME: string;            // Nombre del bucket S3 (sin prefijo "s3://")
                                     // Ejemplo: "aws-sbg-univalle-website"
  CLOUDFRONT_DISTRIBUTION_ID: string; // ID alfanumérico de la distribución
                                      // Ejemplo: "E1ABCDEF2GHIJK"
}
```

Ninguno de estos valores aparece en texto plano en los logs (GitHub Actions los enmascara automáticamente).

---

### S3 Sync Parameters

Parámetros de los dos comandos `aws s3 sync` que ejecuta el pipeline:

```typescript
interface S3SyncPassOne {
  source: "dist/_astro/";                              // Solo assets hasheados
  destination: `s3://${S3_BUCKET_NAME}/_astro/`;
  cacheControl: "public, max-age=31536000, immutable"; // Caché de 1 año
  delete: false;                                        // No eliminar en esta pasada
  noProgress: true;                                     // Logs limpios en CI
}

interface S3SyncPassTwo {
  source: "dist/";                                      // Todo el sitio
  destination: `s3://${S3_BUCKET_NAME}/`;
  cacheControl: "no-cache, no-store, must-revalidate"; // Sin caché para HTML
  exclude: "_astro/*";                                  // Excluir lo ya sincronizado
  delete: true;                                         // Eliminar archivos obsoletos
  noProgress: true;
}
```

---

### CloudFront Invalidation Request

Estructura de la solicitud de invalidación enviada a CloudFront tras el sync:

```typescript
interface CloudFrontInvalidationRequest {
  distributionId: string;  // Valor de secrets.CLOUDFRONT_DISTRIBUTION_ID
  paths: ["/*"];            // Invalida todos los archivos del CDN
}
```

La respuesta de AWS incluye un `InvalidationId` y estado `InProgress`. El pipeline no espera a que la invalidación complete (`InCompleted`) — CloudFront propaga la invalidación de forma asíncrona en segundos.

---

## File Structure

Los archivos generados por esta feature son:

```
.nvmrc                                  # Versión de Node.js (22)
.github/
└── workflows/
    ├── ci.yml                          # Pipeline de validación (build only)
    └── deploy.yml                      # Pipeline de despliegue a producción
```

---

## Component Details

### `.nvmrc`

```
22
```

Especifica Node.js 22 (LTS), alineado con el campo `engines.node >= 22.12.0` de `package.json`. Usado por `actions/setup-node` en ambos workflows mediante `node-version-file: .nvmrc`.

---

### `ci.yml` — Pipeline de Validación

**Trigger**: Push a cualquier rama + Pull Requests hacia `develop` o `main`.

**Permisos**: Solo `contents: read` (sin `id-token` ya que no accede a AWS).

**Pasos**:

| Step | Acción | Propósito |
|------|--------|-----------|
| Checkout | `actions/checkout@v4` | Obtener el código fuente |
| Setup Node.js | `actions/setup-node@v4` | Instalar Node.js desde `.nvmrc` con caché de npm |
| Install dependencies | `npm ci` | Instalación limpia y reproducible |
| Build | `npm run build` | Verificar que el build compile sin errores |

**Comportamiento fail-fast**: `set -e` implícito por GitHub Actions. Si cualquier paso falla, el job se detiene.

---

### `deploy.yml` — Pipeline de Despliegue

**Trigger**: Solo `push` a la rama `main`.

**Permisos** (declarados a nivel de job, no de workflow):
- `id-token: write` — requerido para solicitar el token OIDC de GitHub
- `contents: read` — requerido para hacer checkout del código

**Pasos**:

| Step | Acción / Comando | Propósito |
|------|-----------------|-----------|
| Checkout | `actions/checkout@v4` | Obtener el código fuente |
| Setup Node.js | `actions/setup-node@v4` | Instalar Node.js desde `.nvmrc` con caché de npm |
| Install dependencies | `npm ci` | Instalación limpia y reproducible |
| Build | `npm run build` | Generar `dist/` con los archivos estáticos |
| Verify dist | Script bash inline | Verificar que `dist/` exista y no esté vacío |
| Configure AWS credentials | `aws-actions/configure-aws-credentials@v4` | Asumir IAM Role via OIDC |
| Sync hashed assets | `aws s3 sync` | Subir `_astro/` con `Cache-Control: public, max-age=31536000, immutable` |
| Sync HTML and root files | `aws s3 sync --delete` | Subir resto del sitio con `Cache-Control: no-cache, no-store, must-revalidate`, eliminar obsoletos |
| Invalidate CloudFront | `aws cloudfront create-invalidation` | Limpiar caché CDN con paths `/*` |

---

## Cache Strategy Design

La sincronización se realiza en **dos pasadas** para aplicar distintos `Cache-Control` según el tipo de archivo:

### Pasada 1 — Assets hasheados (`dist/_astro/`)

```bash
aws s3 sync dist/_astro/ s3://$S3_BUCKET_NAME/_astro/ \
  --cache-control "public, max-age=31536000, immutable" \
  --no-progress
```

- Solo sincroniza el subdirectorio `_astro/`.
- No usa `--delete` aquí para evitar borrar assets aún referenciados por versiones anteriores del HTML.
- `max-age=31536000` = 1 año en segundos.
- `immutable` indica al navegador que el archivo no cambia mientras el hash sea el mismo.

### Pasada 2 — HTML y archivos raíz (`dist/`)

```bash
aws s3 sync dist/ s3://$S3_BUCKET_NAME/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "_astro/*" \
  --delete \
  --no-progress
```

- Sincroniza todo `dist/` **excluyendo** `_astro/` (ya sincronizado en pasada 1).
- Usa `--delete` para eliminar archivos obsoletos del bucket que ya no existen en `dist/`.
- `no-cache, no-store, must-revalidate` garantiza que los HTML siempre se descarguen frescos.

> **Nota**: El `--delete` en la pasada 2 solo elimina archivos fuera de `_astro/`. Los assets hasheados obsoletos de `_astro/` se acumulan mínimamente pero no causan problemas funcionales (los HTML nuevos referencian solo los assets con los hashes actuales). Si se requiere limpieza periódica, se puede añadir un step separado de limpieza de `_astro/` con otro `aws s3 sync --delete` dirigido solo a ese prefix.

---

## OIDC Authentication Design

### Configuración en AWS (prerequisito manual)

Antes de que el pipeline funcione, un administrador AWS debe configurar:

1. **Identity Provider OIDC** en IAM:
   - URL del proveedor: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. **IAM Role** con trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ORG/aws-sbg-univalle:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

3. **Política IAM** adjunta al rol (mínimo privilegio):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket", "s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::aws-sbg-univalle-website",
        "arn:aws:s3:::aws-sbg-univalle-website/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

### En el workflow

```yaml
- name: Configure AWS credentials via OIDC
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: ${{ secrets.AWS_REGION }}
    role-session-name: GitHubActions-Deploy-${{ github.run_id }}
```

---

## GitHub Secrets Required

| Secret | Valor esperado | Ejemplo |
|--------|---------------|---------|
| `AWS_ROLE_ARN` | ARN del IAM Role OIDC | `arn:aws:iam::123456789:role/github-deploy-role` |
| `AWS_REGION` | Región AWS del bucket | `us-east-1` |
| `S3_BUCKET_NAME` | Nombre del bucket S3 | `aws-sbg-univalle-website` |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de la distribución | `E1ABCDEF2GHIJK` |

---

## Error Handling

| Escenario | Comportamiento |
|-----------|---------------|
| `npm ci` falla | Job falla inmediatamente, no ejecuta build |
| `npm run build` falla | Job falla inmediatamente, no sincroniza |
| `dist/` no existe o vacío | Script bash emite `exit 1` con mensaje descriptivo |
| OIDC falla (rol mal configurado) | AWS CLI devuelve error 403, job falla |
| `aws s3 sync` falla | Job falla, no ejecuta invalidación |
| `aws cloudfront create-invalidation` falla | Job falla, se reporta el error |

GitHub Actions detiene el job al primer comando con exit code distinto de 0 cuando se usa `run:` estándar.

---

## Testing Strategy

### Enfoque General

Esta feature implementa pipelines de CI/CD — infraestructura declarativa de GitHub Actions que orquesta comandos de shell y servicios externos (AWS S3, CloudFront). Property-based testing no aplica aquí: los workflows no son funciones puras con espacio de entrada amplio, sino secuencias de pasos con comportamiento determinístico.

La estrategia se divide en tres niveles:

### 1. Validación estática (antes del merge)

Verificar que los archivos YAML sean sintácticamente válidos:

```bash
# Validar sintaxis YAML de ambos workflows
npx js-yaml .github/workflows/ci.yml
npx js-yaml .github/workflows/deploy.yml
```

Checklist manual de revisión:
- [ ] `npm install` no aparece en ningún workflow (solo `npm ci`)
- [ ] Secrets referenciados con sintaxis correcta `${{ secrets.NOMBRE }}`
- [ ] Permisos `id-token: write` declarados a nivel de job, no de workflow
- [ ] Trigger de `deploy.yml` es exclusivamente `push` a `main`
- [ ] No hay credenciales AWS hardcodeadas en ningún archivo

### 2. Tests de integración (post-deploy)

Verificaciones ejecutables después de un despliegue real:

| Verificación | Comando / Herramienta | Criterio de éxito |
|---|---|---|
| Sitio accesible | `curl -I https://sbg.univalle.edu.co` | HTTP 200 |
| HTTPS forzado | `curl -I http://sbg.univalle.edu.co` | HTTP 301 → HTTPS |
| Caché assets | Inspeccionar `Cache-Control` header de `/_astro/*.js` | `public, max-age=31536000, immutable` |
| Caché HTML | Inspeccionar `Cache-Control` header de `/index.html` | `no-cache, no-store, must-revalidate` |
| Invalidación efectiva | Verificar que el HTML sirve la versión más reciente tras deploy | Contenido actualizado |

### 3. Smoke tests del pipeline

Verificaciones ejecutadas observando los logs de GitHub Actions tras un push a `main`:

- El job muestra todos los 9 steps en verde (`✓`)
- El step "Verify dist directory" no emite `exit 1`
- El step "Configure AWS credentials via OIDC" obtiene credenciales temporales (sin mostrar valores)
- El step de invalidación retorna un `InvalidationId` válido en los logs

### Notas

- No se implementan property-based tests porque los workflows son IaC/CI declarativo
- Las pruebas de integración requieren que los secrets AWS estén configurados en el repositorio
- El CI pipeline (`ci.yml`) actúa como test de regresión del build en cada PR

---

## Correctness Properties

### Property 1: Idempotencia del despliegue

El comando `aws s3 sync` con `--delete` es idempotente: ejecutar el pipeline dos veces seguidas con el mismo commit produce el mismo estado en el bucket S3. El segundo sync no sube nada nuevo (los archivos ya existen con el mismo ETag) y no elimina nada (todos los archivos del bucket corresponden al `dist/` actual).

**Validates: Requirements 7.1, 7.2**

### Property 2: Invariante de caché

Para todo archivo sincronizado con S3, se cumple:
- Si el archivo está en `dist/_astro/` → `Cache-Control = public, max-age=31536000, immutable`
- Si el archivo NO está en `dist/_astro/` → `Cache-Control = no-cache, no-store, must-revalidate`

Estos dos conjuntos son disjuntos y su unión cubre todos los archivos del sitio.

**Validates: Requirements 11.1, 11.2, 11.3**

### Property 3: Invariante de seguridad de credenciales

En ningún momento durante la ejecución del pipeline aparece en texto plano ninguno de los valores de `AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET_NAME` o `CLOUDFRONT_DISTRIBUTION_ID`. GitHub Actions enmascara automáticamente los valores de secrets en los logs.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 4: Precondición de despliegue

El paso de sincronización con S3 solo se ejecuta si y solo si:
- El build completó con exit code 0, Y
- El directorio `dist/` existe, Y
- El directorio `dist/` contiene al menos un archivo, Y
- Las credenciales AWS fueron configuradas exitosamente.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 5: Consistencia del caché diferenciado

La suma de archivos sincronizados en la Pasada 1 (`_astro/`) más los archivos sincronizados en la Pasada 2 (excluyendo `_astro/`) equivale a la totalidad de archivos en `dist/`. No se omite ni duplica ningún archivo.

**Validates: Requirements 11.3, 11.4**
