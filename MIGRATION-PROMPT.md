# Migration Prompt — UT Austin Pages

Use this prompt when migrating additional pages from https://www.utexas.edu to AEM Edge Delivery Services.

---

## Prompt

```
Migrate the following pages from https://www.utexas.edu to AEM Edge Delivery Services:

- [PASTE URLs HERE]

## Context

This is an ONGOING migration of www.utexas.edu (Drupal 11) to AEM EDS (xwalk).
20+ pages are already migrated with full design.

Read these files before starting:
- Instructions.md — Block inventory, parser reference, DOM selectors
- MIGRATION-CONTEXT.md — Post-import procedures, lessons learned, hero detection

## Workflow

### Step 1: Run the automated importer
```bash
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
echo "{url}" > /tmp/urls.txt
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-interior.bundle.js --urls /tmp/urls.txt
```

### Step 2: Scrape source page (independently)
- Fetch the source URL and catalog ALL images, videos, sections
- Don't trust the importer output — verify what's actually on the page

### Step 3: Download ALL images locally
```bash
mkdir -p content/images/{page-name}
curl -sL "{image-url}" -o content/images/{page-name}/{descriptive-name}.jpg
```

### Step 4: Download videos (if applicable)
```bash
mkdir -p content/media
curl -sL "{video-url}" -o content/media/{name}.mp4
```

### Step 5: Fix the .plain.html
- Replace external image URLs with `./images/{page-name}/filename.ext`
- Add correct hero block (hero-video if video exists, hero-banner if static image)
- Add missing sections (cards-article for news, columns-resource for links)
- Add metadata block as the LAST section
- Remove artifacts: "Skip to main content", breadcrumbs, "Pause button"

### Step 6: Verify in preview
```bash
aem up
# Navigate to http://localhost:3000/content/{page-name}
```
Check: zero external URLs, zero broken images, all sections present.

### Step 7: Commit
```bash
export HOME=/home/node
git add -f content/
git commit -m "Migrate {page-name}: {brief description}"
git push origin main
```

## Block Selection Guide

| Source Pattern | Use Block |
|----------------|-----------|
| Video background + headline | hero-video |
| Static image + heading | hero-banner |
| News story cards with images | cards-article |
| Two-column link lists | columns-resource |
| Promotional callout (dark bg) | columns-promo |
| Stats with image | columns-impact |
| Closing section with video | columns-outro |
| Expandable content/FAQ | accordion |
| Blockquote with attribution | quote |
| Standalone video | video |

## Non-Negotiable Rules

1. NEVER leave external image URLs in content
2. ALWAYS download images locally with descriptive filenames
3. ALWAYS include metadata as the last section
4. ALWAYS verify in preview before committing
5. Use `git add -f content/` (content dir is git-excluded)
```
