# Guía de Despliegue — AWS SBG Univalle

## Tabla de Contenido

1. [Arquitectura del despliegue](#arquitectura)
2. [GitHub Secrets requeridos](#secrets)
3. [Configurar el bucket S3](#s3)
4. [Configurar CloudFront](#cloudfront)
5. [Conectar Route 53](#route53)
6. [Configurar OIDC en AWS IAM](#oidc)
7. [Probar el pipeline](#testing)
8. [Realizar rollback](#rollback)

---

## 1. Arquitectura del despliegue {#arquitectura}

```
Push a main
    │
    ▼
GitHub Actions (deploy.yml)
    │
    ├─ npm ci + npm run build → dist/
    ├─ Verifica dist/ no vacío
    ├─ OIDC → credenciales AWS temporales
    ├─ aws s3 sync dist/_astro/ → S3  (Cache: 1 año)
    ├─ aws s3 sync dist/ → S3         (Cache: no-cache, --delete)
    └─ CloudFront CreateInvalidation  (paths: /*)

                    │
                    ▼
            Route 53 (DNS)
                    │
                    ▼
            CloudFront (CDN)
                    │
                    ▼
              S3 Bucket
          (archivos estáticos)
```

### Pipelines

| Archivo | Trigger | Propósito |
|---------|---------|-----------|
| `deploy.yml` | Push a `main` | Build + deploy a S3 + invalidar CloudFront |
| `validate.yml` | PR y push a `develop` | Solo build y verificación de tipos |

### Estrategia de caché

| Ruta | Cache-Control | Razón |
|------|--------------|-------|
| `/_astro/*` | `public, max-age=31536000, immutable` | Hash en el nombre → inmutable |
| `/*.html`, `/` | `no-cache, no-store, must-revalidate` | Siempre fresco |

---

## 2. GitHub Secrets requeridos {#secrets}

Configurar en: **GitHub → Settings → Secrets and variables → Actions**

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `AWS_ROLE_ARN` | ARN del IAM Role para OIDC | `arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME` |
| `AWS_REGION` | Región del bucket S3 | `us-east-1` |
| `S3_BUCKET_NAME` | Nombre del bucket S3 | `sbg-univalle-website` |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de la distribución | `EXXXXXXXXXXXX` |

> **Importante**: Nunca colocar estos valores directamente en el código fuente ni en archivos `.env` del repositorio.

---

## 3. Configurar el bucket S3 {#s3}

### Paso 1 — Crear el bucket

```bash
aws s3api create-bucket \
  --bucket YOUR_BUCKET_NAME \
  --region us-east-1
```

### Paso 2 — Bloquear acceso público (obligatorio)

```bash
aws s3api put-public-access-block \
  --bucket YOUR_BUCKET_NAME \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,\
    BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### Paso 3 — Habilitar versionado

```bash
aws s3api put-bucket-versioning \
  --bucket YOUR_BUCKET_NAME \
  --versioning-configuration Status=Enabled
```

### Paso 4 — Política de bucket para CloudFront OAC

Reemplaza `YOUR_BUCKET_NAME`, `YOUR_ACCOUNT_ID` y `YOUR_DISTRIBUTION_ID`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

---

## 4. Configurar CloudFront {#cloudfront}

### Paso 1 — Crear Origin Access Control (OAC)

```bash
aws cloudfront create-origin-access-control \
  --origin-access-control-config \
    Name=sbg-univalle-oac,\
    OriginAccessControlOriginType=s3,\
    SigningBehavior=always,\
    SigningProtocol=sigv4
```

Guarda el `Id` retornado — lo necesitas en el siguiente paso.

### Paso 2 — Configuración de la distribución

Puntos clave para la consola de AWS:

- **Origin domain**: `YOUR_BUCKET_NAME.s3.YOUR_REGION.amazonaws.com`
- **Origin access**: Origin access control (OAC) — usar el OAC del paso 1
- **Viewer protocol policy**: Redirect HTTP to HTTPS
- **Compress objects automatically**: Yes
- **HTTP version**: HTTP/2 and HTTP/3
- **Price class**: Use only North America and Europe (para MVP)

### Paso 3 — Response Headers Policy (seguridad)

Crear en la consola o CLI con estos headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Paso 4 — Página de error personalizada

En la distribución → Error pages:

| HTTP error code | Response page path | HTTP response code |
|----------------|-------------------|-------------------|
| 403 | `/404.html` | 404 |
| 404 | `/404.html` | 404 |

---

## 5. Conectar Route 53 {#route53}

### Paso 1 — Crear Hosted Zone

En la consola de Route 53, crea una Hosted Zone pública para tu dominio (ej: `sbg.univalle.edu.co`).

### Paso 2 — Crear registros DNS

| Tipo | Nombre | Valor | Alias |
|------|--------|-------|-------|
| A | `sbg.univalle.edu.co` | CloudFront domain name | Sí |
| AAAA | `sbg.univalle.edu.co` | CloudFront domain name | Sí |
| CNAME | `www.sbg.univalle.edu.co` | `sbg.univalle.edu.co` | No |

Para el registro A con Alias:
- Enable alias: Yes
- Route traffic to: Alias to CloudFront distribution
- Distribution: seleccionar tu distribución

### Paso 3 — Certificado SSL (ACM)

> El certificado **debe** crearse en la región `us-east-1` para usarse con CloudFront.

```bash
aws acm request-certificate \
  --domain-name sbg.univalle.edu.co \
  --subject-alternative-names "www.sbg.univalle.edu.co" \
  --validation-method DNS \
  --region us-east-1
```

Agrega los registros CNAME de validación en Route 53 y espera hasta que el estado sea `ISSUED`.

---

## 6. Configurar OIDC en AWS IAM {#oidc}

### Paso 1 — Crear el Identity Provider

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### Paso 2 — Trust Policy para el IAM Role

Crea un archivo `trust-policy.json`. Reemplaza `YOUR_ACCOUNT_ID` y `YOUR_ORG/YOUR_REPO`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### Paso 3 — Crear el IAM Role

```bash
aws iam create-role \
  --role-name sbg-univalle-github-deploy \
  --assume-role-policy-document file://trust-policy.json
```

### Paso 4 — Política de permisos mínimos

Crea `deploy-policy.json`. Reemplaza los placeholders:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

```bash
aws iam put-role-policy \
  --role-name sbg-univalle-github-deploy \
  --policy-name DeployPolicy \
  --policy-document file://deploy-policy.json
```

El ARN del role (formato `arn:aws:iam::YOUR_ACCOUNT_ID:role/sbg-univalle-github-deploy`) va en el secret `AWS_ROLE_ARN`.

---

## 7. Probar el pipeline {#testing}

### Verificar validate.yml

```bash
# Crear una rama y hacer push para activar el CI
git checkout -b feature/test-pipeline
git commit --allow-empty -m "ci: test validate pipeline"
git push origin feature/test-pipeline
```

Revisa en GitHub → Actions que el workflow `Validate & CI` pase todos los steps.

### Verificar deploy.yml

```bash
# Merge a main activa el deploy
git checkout main
git merge develop
git push origin main
```

Pasos a verificar en los logs de GitHub Actions:

1. ✅ Checkout repository
2. ✅ Setup Node.js
3. ✅ Install dependencies
4. ✅ Build site
5. ✅ Verify dist directory — muestra el conteo de archivos
6. ✅ Configure AWS credentials (OIDC)
7. ✅ Sync hashed assets to S3
8. ✅ Sync HTML and root files to S3
9. ✅ Invalidate CloudFront — muestra el `InvalidationId`
10. ✅ Deployment summary

### Verificar el sitio desplegado

```bash
# Verificar acceso HTTPS
curl -I https://sbg.univalle.edu.co

# Verificar redirect HTTP → HTTPS
curl -I http://sbg.univalle.edu.co

# Verificar cache de assets (debe retornar max-age=31536000)
curl -I https://sbg.univalle.edu.co/_astro/index.XXXXXXXX.css

# Verificar cache de HTML (debe retornar no-cache)
curl -I https://sbg.univalle.edu.co/index.html

# Verificar headers de seguridad
curl -I https://sbg.univalle.edu.co | grep -E "strict-transport|x-frame|x-content"
```

---

## 8. Realizar rollback {#rollback}

### Opción A — Rollback via git revert (recomendado)

```bash
# Identificar el commit a revertir
git log --oneline -5

# Crear commit de revert
git revert COMMIT_SHA --no-edit

# Push a main activa el deploy con la versión revertida
git push origin main
```

### Opción B — Rollback via S3 versioning

Si el bucket tiene versionado habilitado (requerido por el spec), puedes restaurar archivos específicos:

```bash
# Listar versiones del index.html
aws s3api list-object-versions \
  --bucket YOUR_BUCKET_NAME \
  --prefix index.html

# Restaurar versión anterior (reemplaza VERSION_ID)
aws s3api copy-object \
  --bucket YOUR_BUCKET_NAME \
  --copy-source "YOUR_BUCKET_NAME/index.html?versionId=VERSION_ID" \
  --key index.html

# Invalidar CloudFront para servir la versión restaurada
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Opción C — Rollback manual de emergencia

Para restaurar una versión completa del sitio:

```bash
# 1. Clonar el repo y hacer checkout del commit anterior
git checkout PREVIOUS_COMMIT_SHA

# 2. Instalar y buildear
npm ci && npm run build

# 3. Configurar credenciales AWS (requiere acceso manual)
export AWS_PROFILE=sbg-deploy

# 4. Sincronizar manualmente
aws s3 sync dist/_astro/ s3://YOUR_BUCKET_NAME/_astro/ \
  --cache-control "public, max-age=31536000, immutable"

aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "_astro/*" \
  --delete

# 5. Invalidar CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Checklist de configuración inicial

```
Infraestructura AWS:
[ ] Bucket S3 creado con acceso público bloqueado
[ ] Versionado del bucket habilitado
[ ] Origin Access Control (OAC) creado
[ ] Distribución CloudFront creada con OAC
[ ] Response Headers Policy con headers de seguridad aplicada
[ ] Páginas de error 403/404 configuradas en CloudFront
[ ] Certificado ACM emitido en us-east-1 y validado
[ ] Hosted Zone en Route 53 con registros A/AAAA apuntando a CloudFront

IAM y seguridad:
[ ] Identity Provider OIDC creado en IAM
[ ] IAM Role creado con trust policy para el repo correcto
[ ] Política de mínimo privilegio adjunta al rol

GitHub:
[ ] Secret AWS_ROLE_ARN configurado
[ ] Secret AWS_REGION configurado
[ ] Secret S3_BUCKET_NAME configurado
[ ] Secret CLOUDFRONT_DISTRIBUTION_ID configurado
[ ] Archivo .nvmrc existe en la raíz del repositorio

Pruebas:
[ ] validate.yml pasa en PR de prueba
[ ] deploy.yml pasa en push a main
[ ] Sitio accesible en HTTPS
[ ] Headers de seguridad presentes
[ ] Cache-Control correcto en assets y HTML
```
