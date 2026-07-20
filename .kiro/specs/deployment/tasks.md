# Implementation Plan: Deployment — AWS SBG Univalle

## Overview

Este plan implementa el sistema de despliegue automatizado para el sitio del AWS Student Builder Group de la Universidad del Valle. Se crean dos workflows de GitHub Actions: `ci.yml` para validación de build en todas las ramas, y `deploy.yml` para despliegue a producción en AWS S3 + CloudFront mediante autenticación OIDC. Las tareas están ordenadas secuencialmente: primero la configuración base, luego el pipeline de CI, y finalmente el pipeline de despliegue step a step.

## Task Dependency Graph

```
1. .nvmrc
    │
    ├──▶ 2. ci.yml (usa .nvmrc para node-version-file)
    │
    └──▶ 3. deploy.yml — estructura base
              │
              ▼
         4. checkout + Node.js + install + build
              │
              ▼
         5. verify dist/
              │
              ▼
         6. OIDC AWS credentials
              │
              ▼
         7. sync _astro/ → S3
              │
              ▼
         8. sync rest → S3 (--delete)
              │
              ▼
         9. CloudFront invalidation
              │
              ▼
         10. revisión y validación final
              (valida tanto ci.yml como deploy.yml)
```

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": [1],
      "description": "Prerequisito base: versión de Node.js"
    },
    {
      "wave": 2,
      "tasks": [2, 3],
      "description": "Estructura base de ambos workflows (paralelo)"
    },
    {
      "wave": 3,
      "tasks": [4],
      "description": "Steps comunes de build en deploy.yml"
    },
    {
      "wave": 4,
      "tasks": [5, 6],
      "description": "Verificación de dist y autenticación AWS"
    },
    {
      "wave": 5,
      "tasks": [7, 8],
      "description": "Sincronización S3 en dos pasadas"
    },
    {
      "wave": 6,
      "tasks": [9],
      "description": "Invalidación de CloudFront"
    },
    {
      "wave": 7,
      "tasks": [10],
      "description": "Revisión y validación final de ambos workflows"
    }
  ]
}
```

## Tasks

- [ ] 1. Crear archivo `.nvmrc`
  - Crear `.nvmrc` en la raíz del repositorio con el contenido `22`
  - Verificar que sea consistente con `engines.node >= 22.12.0` de `package.json`
  - **Archivos**: `.nvmrc`

- [ ] 2. Crear el CI Pipeline (`.github/workflows/ci.yml`)
  - Crear el directorio `.github/workflows/` si no existe
  - Definir el trigger: `push` a cualquier rama y `pull_request` hacia `develop` y `main`
  - Configurar permisos: solo `contents: read`
  - Añadir comentario de cabecera explicando el propósito del workflow
  - Step 1 — Checkout: usar `actions/checkout@v4` con comentario descriptivo
  - Step 2 — Setup Node.js: usar `actions/setup-node@v4` con `node-version-file: .nvmrc` y `cache: npm`; añadir comentario
  - Step 3 — Install dependencies: ejecutar `npm ci` con comentario que explique por qué se usa `ci` y no `install`
  - Step 4 — Build: ejecutar `npm run build` con comentario que explique que valida la compilación sin desplegar
  - Verificar que el workflow sea YAML válido
  - **Archivos**: `.github/workflows/ci.yml`

- [ ] 3. Crear el Deploy Pipeline — estructura base (`.github/workflows/deploy.yml`)
  - Crear `.github/workflows/deploy.yml`
  - Definir el trigger: solo `push` a la rama `main`
  - Añadir comentario de cabecera explicando el propósito del workflow y los secrets requeridos
  - Configurar permisos a nivel de job (no de workflow): `id-token: write` y `contents: read`
  - Documentar en comentarios el motivo de cada permiso
  - Añadir `concurrency` para cancelar runs anteriores si hay un nuevo push a `main`
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 4. Añadir steps de checkout, Node.js e instalación al Deploy Pipeline
  - Step 1 — Checkout: usar `actions/checkout@v4` con comentario
  - Step 2 — Setup Node.js: usar `actions/setup-node@v4` con `node-version-file: .nvmrc` y `cache: npm`; añadir comentario
  - Step 3 — Install dependencies: ejecutar `npm ci` con comentario
  - Step 4 — Build: ejecutar `npm run build` con comentario indicando que genera `dist/`
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 5. Añadir step de verificación del directorio `dist/`
  - Añadir step "Verify dist directory" usando `run:` con script bash inline
  - El script debe verificar que `dist/` exista: `[ -d dist ]` o equivalente
  - El script debe verificar que `dist/` no esté vacío: `[ "$(ls -A dist)" ]` o equivalente
  - El script debe imprimir un mensaje de error descriptivo antes de hacer `exit 1` en cada caso de fallo
  - Añadir comentario al step explicando por qué esta verificación previene despliegues accidentales
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 6. Añadir step de autenticación OIDC con AWS
  - Añadir step "Configure AWS credentials via OIDC" usando `aws-actions/configure-aws-credentials@v4`
  - Configurar `role-to-assume: ${{ secrets.AWS_ROLE_ARN }}`
  - Configurar `aws-region: ${{ secrets.AWS_REGION }}`
  - Configurar `role-session-name: GitHubActions-Deploy-${{ github.run_id }}`
  - Añadir comentario que explique OIDC, qué es el `role-session-name` y por qué no se usan access keys
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 7. Añadir step de sincronización de assets hasheados con S3
  - Añadir step "Sync hashed assets to S3"
  - Ejecutar `aws s3 sync dist/_astro/ s3://${{ secrets.S3_BUCKET_NAME }}/_astro/` con `--cache-control "public, max-age=31536000, immutable"` y `--no-progress`
  - NO añadir `--delete` en este paso
  - Añadir comentario que explique la estrategia de caché para assets hasheados y por qué no se usa `--delete` aquí
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 8. Añadir step de sincronización del resto del sitio con S3
  - Añadir step "Sync HTML and static files to S3"
  - Ejecutar `aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }}/` con opciones:
    - `--cache-control "no-cache, no-store, must-revalidate"`
    - `--exclude "_astro/*"`
    - `--delete`
    - `--no-progress`
  - Añadir comentario que explique por qué se excluye `_astro/`, por qué se usa `--delete` aquí y la política de caché para HTML
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 9. Añadir step de invalidación de CloudFront
  - Añadir step "Invalidate CloudFront distribution"
  - Ejecutar `aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"`
  - Añadir comentario que explique qué hace la invalidación y por qué es necesaria después del sync
  - **Archivos**: `.github/workflows/deploy.yml`

- [ ] 10. Revisar y validar los workflows completos
  - Verificar que `ci.yml` tenga YAML válido (indentación correcta, sin errores de sintaxis)
  - Verificar que `deploy.yml` tenga YAML válido
  - Verificar que todos los secrets referenciados (`AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`) están usando la sintaxis correcta `${{ secrets.NOMBRE }}`
  - Verificar que el trigger de `deploy.yml` sea exclusivamente `push` a `main`
  - Verificar que los permisos OIDC (`id-token: write`) estén a nivel de job, no de workflow
  - Verificar que `npm install` no aparece en ningún archivo de workflow (solo `npm ci`)
  - Verificar que no hay credenciales AWS hardcodeadas en ningún archivo
  - **Archivos**: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

## Notes

- Los secrets `AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET_NAME` y `CLOUDFRONT_DISTRIBUTION_ID` deben estar configurados en GitHub → Settings → Secrets and variables → Actions antes de ejecutar el pipeline de deploy.
- La configuración del Identity Provider OIDC en AWS IAM y el IAM Role con trust policy son prerequisitos manuales que deben completarse antes de que el pipeline funcione (ver sección OIDC Authentication Design del documento de diseño).
- El pipeline de CI (`ci.yml`) no requiere ningún secret y puede ejecutarse desde el primer commit.
- La tarea 10 cubre ambos archivos; conviene ejecutarla después de que las tareas 2–9 estén completas.
- El directorio `.github/workflows/` debe crearse en la tarea 2 si no existe aún.
