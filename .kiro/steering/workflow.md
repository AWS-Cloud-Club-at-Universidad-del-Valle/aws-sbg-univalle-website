# Workflow — Git, CI/CD y Proceso de Desarrollo

## Estrategia de Ramas (Git Flow simplificado)

```
main          ← Producción. Solo recibe merges desde develop via PR aprobado.
develop       ← Integración. Branch base para features.
feature/*     ← Nuevas funcionalidades. Ej: feature/hero-section
fix/*         ← Correcciones de bugs. Ej: fix/nav-mobile-overflow
chore/*       ← Tareas de mantenimiento. Ej: chore/update-dependencies
docs/*        ← Documentación. Ej: docs/update-readme
```

### Reglas de Ramas

- **NUNCA** hacer push directamente a `main` o `develop`.
- Toda rama parte desde `develop` (excepto hotfixes urgentes desde `main`).
- Nombre de rama: kebab-case con prefijo de tipo (`feature/`, `fix/`, `chore/`, `docs/`).
- Eliminar la rama remota después de merge aprobado.

## Convención de Commits (Conventional Commits)

Formato: `<tipo>(<scope opcional>): <descripción corta en imperativo>`

### Tipos válidos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad para el usuario |
| `fix` | Corrección de bug |
| `style` | Cambios de estilos/CSS (sin lógica) |
| `refactor` | Refactorización sin cambio de comportamiento |
| `perf` | Mejora de rendimiento |
| `test` | Agregar o modificar tests |
| `docs` | Solo documentación |
| `chore` | Build, dependencias, configuración |
| `ci` | Cambios en GitHub Actions |
| `revert` | Reverción de un commit anterior |

### Ejemplos

```
feat(hero): add animated CTA button with AWS orange accent
fix(nav): resolve mobile menu overflow on small screens
style(cards): apply rounded-xl and shadow-sm to event cards
chore(deps): update astro to 5.2.1
ci(deploy): add CloudFront invalidation step after S3 sync
docs(readme): add local development setup instructions
```

### Reglas

- Descripción en inglés, en minúsculas, imperativo presente ("add" no "added").
- Máximo 72 caracteres en la línea del subject.
- Body del commit en español si se necesita contexto adicional.
- **NUNCA** hacer commits con mensajes vagos como "fix", "update", "changes", "wip".

## Pull Requests

### Proceso

1. Crear rama desde `develop`.
2. Desarrollar y hacer commits con la convención definida.
3. Abrir PR hacia `develop` con template completo.
4. Al menos 1 revisión aprobada antes de merge.
5. CI debe pasar (build + lint + type-check).
6. Merge con **Squash and Merge** para mantener historial limpio en `develop`.

### Template del PR

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] feat: Nueva funcionalidad
- [ ] fix: Corrección de bug
- [ ] style: Cambios de estilos
- [ ] chore: Mantenimiento

## Checklist
- [ ] El código sigue las convenciones de `tech.md`
- [ ] Los estilos siguen las reglas de `ui.md`
- [ ] TypeScript compila sin errores (`tsc --noEmit`)
- [ ] Build de Astro exitoso (`astro build`)
- [ ] Probado en mobile (≤ 375px) y desktop (≥ 1280px)
- [ ] Accesibilidad verificada (teclado, contraste, alt texts)
- [ ] No hay `console.log` residuales en producción
```

## GitHub Actions — Pipelines

### CI Pipeline (`.github/workflows/ci.yml`)

**Trigger**: Push a cualquier rama + Pull Requests hacia `develop` o `main`.

```yaml
Pasos:
1. Checkout del código
2. Setup Node.js (versión LTS definida en .nvmrc)
3. npm ci (instalación limpia desde package-lock.json)
4. tsc --noEmit (verificación de tipos)
5. astro build (build de producción)
6. (Futuro) npx playwright test (tests E2E)
```

### Deploy Pipeline (`.github/workflows/deploy.yml`)

**Trigger**: Push a `main` (merge de PR aprobado).

```yaml
Pasos:
1. Checkout del código
2. Setup Node.js
3. npm ci
4. astro build (genera /dist)
5. Configure AWS credentials via OIDC (aws-actions/configure-aws-credentials)
6. aws s3 sync ./dist s3://$S3_BUCKET_NAME --delete
7. aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
```

**Variables requeridas** (GitHub Secrets):
- `AWS_ROLE_ARN`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`

### Reglas de Pipelines

- **NUNCA** usar `npm install` en CI. Siempre `npm ci`.
- El pipeline de deploy solo corre en `main` — nunca en `develop` o feature branches.
- Un fallo en CI bloquea el merge del PR automáticamente.
- Las credenciales AWS se inyectan vía OIDC, nunca como secrets estáticos de larga duración.

## Entornos

| Entorno | Branch | URL | Deploy |
|---------|--------|-----|--------|
| Desarrollo local | `feature/*` | `localhost:4321` | Manual (`astro dev`) |
| Preview (futuro) | `develop` | `preview.sbg-univalle.com` | Automático |
| Producción | `main` | `sbg.univalle.edu.co` | Automático vía GitHub Actions |

## Versionado del Proyecto

Usar **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- `MAJOR`: Cambio de arquitectura o rediseño completo.
- `MINOR`: Nueva página, sección o funcionalidad.
- `PATCH`: Bug fix, ajuste de contenido, mejora de rendimiento.

Los releases se crean con GitHub Releases y tags: `v1.0.0`, `v1.1.0`, etc.

## Proceso de Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/[org]/aws-sbg-univalle.git
cd aws-sbg-univalle

# 2. Instalar dependencias
npm ci

# 3. Iniciar servidor de desarrollo
astro dev

# 4. Verificar tipos
npx tsc --noEmit

# 5. Build de producción local
astro build
astro preview
```

## Reglas para Agentes

- **SIEMPRE** crear ramas con el prefijo de tipo correcto (`feature/`, `fix/`, `chore/`, `docs/`).
- **SIEMPRE** usar mensajes de commit en formato Conventional Commits.
- **NUNCA** hacer commits directamente a `main` o `develop`.
- **NUNCA** incluir archivos generados (`dist/`, `.astro/`, `node_modules/`) en commits.
- **NUNCA** usar `npm install` en pipelines CI. Solo `npm ci`.
- Los secrets de AWS nunca deben aparecer en logs, código o mensajes de commit.
- Antes de abrir un PR, verificar que `tsc --noEmit` y `astro build` pasen sin errores.
- Mantener el `package-lock.json` actualizado y commiteado.
