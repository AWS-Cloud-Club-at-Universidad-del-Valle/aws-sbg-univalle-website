# Skill: Configurar CloudFront

## Descripción

Guía para configurar la distribución de Amazon CloudFront como CDN del sitio SBG Univalle: origen S3 con OAC, HTTPS forzado, headers de seguridad, caché por path y páginas de error personalizadas.

## Cuándo Utilizarla

- Al crear la distribución CloudFront por primera vez.
- Al actualizar la política de caché o headers de seguridad.
- Al agregar nuevos comportamientos de caché (cache behaviors).
- Al configurar páginas de error personalizadas (404).

---

## Configuración con AWS CLI

### Crear Origin Access Control (OAC)

```bash
aws cloudfront create-origin-access-control \
  --origin-access-control-config '{
    "Name": "sbg-univalle-oac",
    "Description": "OAC para AWS SBG Univalle Website",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
  }'
```

---

## Distribution Config (JSON)

```json
{
  "Origins": {
    "Items": [{
      "Id": "s3-sbg-univalle",
      "DomainName": "aws-sbg-univalle-website.s3.us-east-1.amazonaws.com",
      "S3OriginConfig": { "OriginAccessIdentity": "" },
      "OriginAccessControlId": "OAC_ID_AQUI"
    }]
  },
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "AllowedMethods": { "Items": ["GET", "HEAD"], "Quantity": 2 }
  },
  "HttpVersion": "http2and3",
  "PriceClass": "PriceClass_100",
  "Enabled": true,
  "Comment": "AWS SBG Univalle Website"
}
```

---

## Response Headers Policy (Seguridad)

```bash
aws cloudfront create-response-headers-policy \
  --response-headers-policy-config '{
    "Name": "sbg-security-headers",
    "SecurityHeadersConfig": {
      "StrictTransportSecurity": {
        "Override": true,
        "AccessControlMaxAgeSec": 31536000,
        "IncludeSubdomains": true
      },
      "ContentTypeOptions": { "Override": true },
      "FrameOptions": { "FrameOption": "DENY", "Override": true },
      "XSSProtection": {
        "Override": true, "Protection": true, "ModeBlock": true
      },
      "ReferrerPolicy": {
        "ReferrerPolicy": "strict-origin-when-cross-origin",
        "Override": true
      }
    }
  }'
```

---

## Cache Behaviors por Path

| Path Pattern | TTL | Descripción |
|-------------|-----|-------------|
| `/_astro/*` | 31536000 (1 año) | Assets con hash — immutable |
| `/images/*` | 86400 (1 día) | Imágenes |
| `/fonts/*` | 31536000 (1 año) | Fuentes |
| `*.html` / Default | 0 | HTML siempre fresco |

---

## Error Pages Personalizadas

```bash
# Configurar 404 personalizado
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --distribution-config '{
    "CustomErrorResponses": {
      "Items": [{
        "ErrorCode": 404,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 300
      }]
    }
  }'
```

---

## Verificación Post-Configuración

```bash
# Verificar headers de seguridad
curl -I https://sbg.univalle.edu.co | grep -E "(strict|x-frame|x-content|referrer)"

# Verificar compresión Brotli
curl -H "Accept-Encoding: br" -I https://sbg.univalle.edu.co | grep content-encoding

# Verificar HTTPS redirect
curl -I http://sbg.univalle.edu.co | grep -i location

# Verificar cache de assets
curl -I https://sbg.univalle.edu.co/_astro/main.abc123.css | grep cache-control
```

---

## Reglas Críticas

```
✅ Usar OAC — nunca OAI (legacy)
✅ ViewerProtocolPolicy: redirect-to-https
✅ Compress: true (Gzip + Brotli)
✅ HTTP/2 y HTTP/3 habilitados
✅ Response Headers Policy con todos los headers de seguridad
✅ CustomErrorResponse para 404 → /404.html
✅ Invalidar /* después de cada deploy
✅ Certificado ACM en us-east-1 (obligatorio para CloudFront)
❌ NUNCA usar OAI (Origin Access Identity) — es legacy
❌ NUNCA permitir HTTP sin redirección
```
