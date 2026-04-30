# UT Austin EDS — Admin Guide

**Project:** University of Texas at Austin  
**Platform:** AEM Edge Delivery Services (xwalk)  
**Organization:** prajwal85  
**Repository:** `github.com/prajwal85/eds-agent-demo`  
**Date:** April 2026

---

## Environment URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| AEM Author | `https://author-p11300-e47725.adobeaemcloud.com` | Content authoring (Universal Editor) |
| Preview | `https://main--eds-agent-demo--prajwal85.aem.page` | Preview before publish |
| Live | `https://main--eds-agent-demo--prajwal85.aem.live` | Production delivery |
| GitHub | `https://github.com/prajwal85/eds-agent-demo` | Code repository |

---

## AEM Cloud Configuration

### Instance Details

| Setting | Value |
|---------|-------|
| Program ID | p11300 |
| Environment ID | e47725 |
| Content Path | `/content/eds-agent-demo` |
| DAM Path | `/content/dam/eds-agent-demo` |
| Project Type | xwalk (Universal Editor) |

### fstab.yaml

```yaml
mountpoints:
  /: https://author-p11300-e47725.adobeaemcloud.com/bin/franklin.delivery/prajwal85/eds-agent-demo/main
```

---

## Code Sync & Deployment

### How Code Deploys

1. Developer pushes to `main` branch on GitHub
2. GitHub Actions runs lint validation (JS + CSS + xwalk model rules)
3. AEM Code Sync detects changes and updates the delivery layer
4. Preview (`.aem.page`) reflects changes immediately
5. Live (`.aem.live`) updates after publish via Sidekick

### CI/CD Pipeline

**GitHub Actions workflow (`.github/workflows/main.yaml`):**
- Trigger: Push to `main`
- Steps: checkout → setup Node.js → `npm ci` → `npm run lint`
- Lint includes: ESLint (JS + JSON) + Stylelint (CSS) + xwalk rules

### Lint Rules

| Rule | Scope | Description |
|------|-------|-------------|
| `xwalk/max-cells` | component-models.json | Max 4 cells per block model |
| `no-unused-vars` | JS files | No unused variables |
| `color-function-notation` | CSS files | Modern `rgb()` notation required |
| `alpha-value-notation` | CSS files | Percentage notation for alpha (e.g., `60%` not `0.6`) |

---

## Content Management

### Publishing Content

1. Author edits page in Universal Editor
2. Preview at `.aem.page` URL
3. Publish via AEM Sidekick chrome extension
4. Live site updates at `.aem.live`

### Bulk Operations

```bash
# Preview all paths
curl -X POST "https://admin.hlx.page/preview/prajwal85/eds-agent-demo/main/*"

# Publish all paths
curl -X POST "https://admin.hlx.page/live/prajwal85/eds-agent-demo/main/*"

# Invalidate cache for specific path
curl -X POST "https://admin.hlx.page/cache/prajwal85/eds-agent-demo/main/index"
```

### Cache Management

| Action | API Endpoint |
|--------|-------------|
| Purge page cache | `POST /cache/{org}/{repo}/{ref}/{path}` |
| Purge all cache | `POST /cache/{org}/{repo}/{ref}/*` |

Cache TTL: EDS uses aggressive edge caching. After publishing, cache updates automatically. Manual purge only needed for emergencies.

---

## Media & Assets

### DAM Structure

```
/content/dam/eds-agent-demo/
├── images/
│   └── homepage/           # Homepage images (9 files, 1.7MB)
├── media/
│   ├── dell-med-center-homepage.mp4  (24MB - hero video)
│   └── forTexas-loop.mp4            (10MB - outro video)
```

### Image Optimization

EDS automatically optimizes images via query parameters:
- `?width=2000&format=webply&optimize=medium` (desktop WebP)
- `?width=750&format=webply&optimize=medium` (mobile WebP)
- `?width=750&format=png&optimize=medium` (fallback PNG)

No manual optimization needed — the CDN handles it.

---

## Security & Access

### GitHub Repository Access

| Role | Permissions |
|------|------------|
| Admin | Full repo access, branch protection, secrets |
| Developer | Push to main, create PRs |
| Content Author | No repo access needed (uses Universal Editor) |

### AEM Cloud Access

Access managed via Adobe Admin Console:
- Content authors need AEM Author access
- Developers need GitHub repo access + AEM Developer access
- Admins need AEM Cloud Manager access

---

## Monitoring & Health

### Site Health Check

```bash
# Check if site is serving
curl -I "https://main--eds-agent-demo--prajwal85.aem.live/"

# Check specific page
curl -I "https://main--eds-agent-demo--prajwal85.aem.live/about-texas"

# Check plain HTML delivery
curl "https://main--eds-agent-demo--prajwal85.aem.live/index.plain.html" | head -5
```

### Performance

EDS delivers Lighthouse 100 by default:
- All content served from CDN edge
- Images lazy-loaded and auto-optimized
- CSS/JS loaded per-block (only what's needed)
- No render-blocking resources

---

## Migration Inventory

### Pages Migrated: 49 Total

| Section | Count |
|---------|-------|
| Homepage | 1 |
| Resource Hubs | 3 |
| Section Landing | 10 |
| About | 4 |
| Academics | 3 |
| Campus Life | 10 |
| Energy | 5 |
| Research | 3 |
| Policy | 8 |
| Campus Carry | 2 |

### Custom Blocks Created: 8

| Block | Purpose |
|-------|---------|
| hero-video | Homepage video hero |
| hero-banner | Interior page hero |
| cards-article | News story cards |
| sticky-panels | Impact sections with sticky scroll |
| columns-promo | Promotional callout |
| columns-impact | Impact stats |
| columns-outro | Outro with video |
| columns-resource | Resource link lists |

---

## Troubleshooting

### Block Not Rendering on AEM Author

**Symptom:** Block appears blank on AEM Author page
**Cause:** Block class name in authored content differs from block directory name
**Fix:** Ensure `columns.js` has auto-detection logic for the content pattern, or re-author the block with the correct block name in Universal Editor

### Video Not Playing

**Symptom:** Video shows as text link instead of playing
**Cause:** Video URL not detected by JS (path format mismatch)
**Fix:** Ensure video URL contains `.mp4` or `/media_`. Block JS checks both patterns.

### CI Build Failing

**Symptom:** Push to main fails lint check
**Common causes:**
- CSS: Using `rgba()` instead of `rgb(... / %)` notation
- CSS: Using `0.6` instead of `60%` for alpha
- JS: Unused variables
- JSON: Block model exceeds 4 cells (`xwalk/max-cells`)

**Fix:** Run `npm run lint` locally before pushing.

### Cache Not Updating

**Symptom:** Published changes not visible on live site
**Fix:** 
```bash
curl -X POST "https://admin.hlx.page/cache/prajwal85/eds-agent-demo/main/{path}"
```

---

## Backup & Recovery

### Code
- All code in Git — full history available
- Main branch protected (requires passing lint)

### Content
- AEM Author has version history for all pages
- Content can be restored via AEM Author UI
- `content/` folder in repo has exported `.plain.html` files as reference

### Media
- Videos and images committed to repo as backup
- Primary hosting: AEM DAM
- Fallback: repo `content/media/` and `content/images/`

---

## Key Contacts & References

| Resource | Location |
|----------|----------|
| Instructions.md | `/workspace/Instructions.md` — Complete migration reference |
| Block Collection | `https://www.aem.live/developer/block-collection` |
| EDS Documentation | `https://www.aem.live/docs/` |
| AEM Admin API | `https://www.aem.live/docs/admin` |
| Universal Editor | `https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor` |
