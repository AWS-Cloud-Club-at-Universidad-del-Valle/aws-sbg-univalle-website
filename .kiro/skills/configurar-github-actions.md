# Skill: Configurar GitHub Actions

## Descripción

Guía para implementar los pipelines CI/CD del proyecto SBG Univalle: pipeline de integración continua (lint, type-check, build) y pipeline de despliegue a AWS S3 + CloudFront usando OIDC.

## Cuándo Utilizarla

- Al crear o actualizar el pipeline de CI.
- Al crear o actualizar el pipeline de despliegue.
- Al agregar nuevos pasos de validación (tests, Lighthouse, etc.).
- Al rotar credenciales o actualizar el rol IAM de OIDC.

---

## CI Pipeline — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    name: Type Check & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
```

---

## Deploy Pipeline — `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

permissions:
  id-token: write   # Requerido para OIDC
  contents: read

jobs:
  deploy:
    name: Build & Deploy to AWS
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync ./dist s3://${{ secrets.S3_BUCKET_NAME }} \
            --delete \
            --cache-control "no-cache, no-store, must-revalidate" \
            --exclude "_astro/*"

      - name: Deploy assets with long cache
        run: |
          aws s3 sync ./dist/_astro s3://${{ secrets.S3_BUCKET_NAME }}/_astro \
            --cache-control "public, max-age=31536000, immutable"

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## `.nvmrc`

```
20
```

---

## GitHub Secrets requeridos

| Secret | Dónde configurarlo | Ejemplo |
|--------|-------------------|---------|
| `AWS_ROLE_ARN` | GitHub → Settings → Secrets → Actions | `arn:aws:iam::123456:role/sbg-deploy` |
| `AWS_REGION` | ídem | `us-east-1` |
| `S3_BUCKET_NAME` | ídem | `aws-sbg-univalle-website` |
| `CLOUDFRONT_DISTRIBUTION_ID` | ídem | `E1ABCDEF123456` |

---

## Reglas Críticas

```
✅ Usar npm ci — nunca npm install en CI
✅ Usar OIDC (id-token: write) — nunca access keys estáticos
✅ Pinar versiones de Actions (@v4, nunca @latest)
✅ Deploy SOLO en push a main
✅ Cache separado: HTML sin cache, _astro/* con 1 año
✅ Siempre invalidar CloudFront después del sync
❌ NUNCA hardcodear IDs, ARNs o nombres de bucket en el YAML
❌ NUNCA subir .env al repositorio
```
