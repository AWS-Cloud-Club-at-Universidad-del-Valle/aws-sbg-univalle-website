# Skill: Desplegar en Amazon S3

## Descripción

Guía para configurar y desplegar el sitio estático de Astro en Amazon S3 con acceso privado, versionado habilitado y headers de cache correctos por tipo de archivo.

## Cuándo Utilizarla

- Al configurar el bucket S3 por primera vez.
- Al realizar un deploy manual de emergencia.
- Al actualizar la política de cache de los archivos.
- Al hacer rollback a una versión anterior.

---

## Configuración del Bucket S3

### Crear bucket con AWS CLI

```bash
# Crear bucket (región us-east-1 para CloudFront + ACM)
aws s3api create-bucket \
  --bucket aws-sbg-univalle-website \
  --region us-east-1

# Bloquear acceso público COMPLETAMENTE
aws s3api put-public-access-block \
  --bucket aws-sbg-univalle-website \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Habilitar versionado
aws s3api put-bucket-versioning \
  --bucket aws-sbg-univalle-website \
  --versioning-configuration Status=Enabled

# Habilitar cifrado SSE-S3
aws s3api put-bucket-encryption \
  --bucket aws-sbg-univalle-website \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

---

## Política de Bucket para OAC de CloudFront

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
      "Resource": "arn:aws:s3:::aws-sbg-univalle-website/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

---

## Deploy Manual (emergencia)

```bash
# 1. Build del proyecto
npm run build

# 2. Sync HTML — sin cache
aws s3 sync ./dist s3://aws-sbg-univalle-website \
  --delete \
  --exclude "_astro/*" \
  --cache-control "no-cache, no-store, must-revalidate"

# 3. Sync assets — cache de 1 año
aws s3 sync ./dist/_astro s3://aws-sbg-univalle-website/_astro \
  --cache-control "public, max-age=31536000, immutable"

# 4. Sync imágenes — cache de 1 día
aws s3 sync ./dist/images s3://aws-sbg-univalle-website/images \
  --cache-control "public, max-age=86400"

# 5. Invalidar CloudFront
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Rollback a versión anterior

```bash
# Listar versiones de un archivo
aws s3api list-object-versions \
  --bucket aws-sbg-univalle-website \
  --prefix index.html

# Restaurar versión anterior (copiar versión específica sobre la actual)
aws s3api copy-object \
  --bucket aws-sbg-univalle-website \
  --copy-source "aws-sbg-univalle-website/index.html?versionId=VERSION_ID" \
  --key index.html

# Invalidar CloudFront para servir la versión restaurada
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Estrategia de Cache por Archivo

| Ruta | Cache-Control | Razón |
|------|--------------|-------|
| `*.html` | `no-cache, no-store` | Siempre fresco |
| `_astro/*` | `public, max-age=31536000, immutable` | Hash en nombre |
| `images/*` | `public, max-age=86400` | 1 día |
| `favicon.*` | `public, max-age=86400` | 1 día |
| `fonts/*` | `public, max-age=31536000, immutable` | Raramente cambian |

---

## Reglas Críticas

```
✅ Bucket SIEMPRE privado — BlockPublicAccess habilitado
✅ Solo CloudFront accede al bucket (política OAC)
✅ Versionado habilitado para rollbacks
✅ Cache-Control diferente para HTML vs assets
✅ Siempre usar --delete para limpiar archivos obsoletos
❌ NUNCA hacer el bucket público
❌ NUNCA almacenar secretos ni .env en S3
❌ NUNCA omitir la invalidación de CloudFront
```
