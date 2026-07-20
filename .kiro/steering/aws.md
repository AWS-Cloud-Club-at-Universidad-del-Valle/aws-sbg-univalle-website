# AWS — Infraestructura y Servicios Cloud

## Arquitectura de Despliegue

```
Usuario
  │
  ▼
Route 53 (DNS)
  │  Registro A/AAAA → Alias a CloudFront
  ▼
CloudFront (CDN global)
  │  HTTPS, caché, compresión, headers de seguridad
  ▼
S3 Bucket (Origin)
  │  Archivos estáticos del build de Astro
  └─ Bucket privado (solo acceso vía OAC desde CloudFront)
```

## Amazon S3

### Configuración del Bucket

- **Nombre**: `aws-sbg-univalle-website` (o según convenio del proyecto).
- **Región**: `us-east-1` (requerido para CloudFront + ACM).
- **Acceso público**: **BLOQUEADO** — el bucket NO es público. Solo CloudFront accede vía OAC.
- **Versionado**: Habilitado para poder hacer rollback rápido.
- **Cifrado**: SSE-S3 habilitado por defecto.

### Estructura del Bucket

```
/                        # Raíz del sitio (index.html del build)
├── index.html
├── about/index.html
├── events/index.html
├── resources/index.html
├── contact/index.html
├── _astro/              # Assets con hash (CSS, JS, fonts)
│   ├── *.css
│   └── *.js
└── images/              # Imágenes optimizadas
```

### Política de Cache en S3

- Archivos en `_astro/`: cache largo (1 año) — tienen hash en el nombre.
- `index.html` y páginas HTML: `Cache-Control: no-cache, no-store` o `max-age=0`.
- Imágenes: `Cache-Control: public, max-age=86400` (1 día).

## Amazon CloudFront

### Configuración de Distribución

- **Origin**: S3 bucket vía **Origin Access Control (OAC)** — nunca OAI (legacy).
- **Protocolo**: Redirigir HTTP → HTTPS siempre (`Redirect HTTP to HTTPS`).
- **Versión HTTP**: HTTP/2 y HTTP/3 habilitados.
- **Compresión**: Gzip y Brotli habilitados automáticamente.
- **Price Class**: `PriceClass_100` (USA, Europa) para MVP. Escalar a `All` cuando crezca el tráfico internacional.

### Certificado SSL

- Usar **AWS Certificate Manager (ACM)** — región `us-east-1` obligatoria para CloudFront.
- Certificado para: `sbg.univalle.edu.co` y `www.sbg.univalle.edu.co` (o el dominio oficial).
- Renovación automática habilitada.

### Caché y TTL

```
/index.html             → TTL: 0   (siempre fresco)
/*/index.html           → TTL: 0
/_astro/*               → TTL: 31536000 (1 año, immutable)
/images/*               → TTL: 86400 (1 día)
/favicon.*              → TTL: 86400 (1 día)
```

### Headers de Seguridad (Response Headers Policy)

```
Strict-Transport-Security:    max-age=31536000; includeSubDomains
X-Content-Type-Options:       nosniff
X-Frame-Options:              DENY
X-XSS-Protection:             1; mode=block
Referrer-Policy:              strict-origin-when-cross-origin
Permissions-Policy:           camera=(), microphone=(), geolocation=()
Content-Security-Policy:      default-src 'self'; (ajustar según necesidades)
```

### Invalidaciones

- Después de cada deploy, invalidar: `/*` (todos los archivos).
- Usar `aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"`.

## Amazon Route 53

### Configuración DNS

- **Hosted Zone**: Zona pública para el dominio del sitio.
- **Registros**:
  - `A` (Alias) → CloudFront distribution domain name.
  - `AAAA` (Alias) → CloudFront distribution domain name (IPv6).
  - `www` CNAME → dominio raíz (o Alias a CloudFront).
- **TTL**: 300 segundos para registros A/AAAA durante cambios; 3600 en estado estable.

## Seguridad AWS

- **Principio de mínimo privilegio**: El rol de GitHub Actions solo tiene permisos para S3 y CloudFront.
- **OIDC para GitHub Actions**: Usar OpenID Connect en lugar de claves de acceso estáticas.
- **No hardcodear credenciales**: Nunca poner `AWS_ACCESS_KEY_ID` o `AWS_SECRET_ACCESS_KEY` en el código.
- **Secrets en GitHub**: Usar GitHub Secrets para todas las variables sensibles.

### Política IAM mínima para el rol de deploy

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
        "arn:aws:s3:::aws-sbg-univalle-website",
        "arn:aws:s3:::aws-sbg-univalle-website/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::*:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

## Variables de Entorno y Secrets (GitHub Secrets)

| Secret | Descripción |
|--------|-------------|
| `AWS_ROLE_ARN` | ARN del rol IAM para OIDC |
| `AWS_REGION` | Región AWS (ej: `us-east-1`) |
| `S3_BUCKET_NAME` | Nombre del bucket S3 |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de la distribución CloudFront |

## Costos Estimados (Referencia)

- S3: ~$0.023/GB almacenado + $0.0004/1000 solicitudes GET.
- CloudFront: Primeros 1TB/mes gratuitos (Free Tier). Luego ~$0.0085/GB.
- Route 53: $0.50/mes por hosted zone + $0.40/millón de queries.
- ACM: **Gratuito** para certificados usados con CloudFront.
- **Costo estimado total MVP**: < $5 USD/mes para tráfico estudiantil universitario.

## Reglas para Agentes

- **NUNCA** hacer el bucket S3 público. Siempre usar OAC de CloudFront.
- **NUNCA** hardcodear credenciales AWS en código, variables de entorno locales o commits.
- **SIEMPRE** usar OIDC para autenticar GitHub Actions con AWS (sin access keys estáticos).
- **SIEMPRE** invalidar CloudFront después de cada deploy.
- **SIEMPRE** verificar que el certificado ACM esté en `us-east-1` para usarlo con CloudFront.
- Toda infraestructura nueva debe seguir el principio de mínimo privilegio.
- Los cambios en infraestructura (IAM, S3, CloudFront) deben documentarse en el PR correspondiente.
