# UT Austin EDS — Developer Guide

**Project:** University of Texas at Austin  
**Platform:** AEM Edge Delivery Services (xwalk)  
**Repository:** `github.com/prajwal85/eds-agent-demo`  
**Date:** April 2026

---

## Architecture Overview

| Component | Technology |
|-----------|-----------|
| Project Type | xwalk (Universal Editor authoring) |
| Source CMS | Drupal 11 (migrated from utexas.edu) |
| Delivery | AEM Edge Delivery CDN |
| Author | `author-p11300-e47725.adobeaemcloud.com` |
| Preview | `main--eds-agent-demo--prajwal85.aem.page` |
| Live | `main--eds-agent-demo--prajwal85.aem.live` |

---

## Repository Structure

```
/
├── blocks/                    # Custom block implementations
│   ├── hero-video/           # Homepage video hero
│   ├── cards-article/        # News story cards grid
│   ├── columns/              # Vanilla columns (with sticky-panels + video detection)
│   ├── columns-promo/        # Promotional callout
│   ├── columns-impact/       # Impact stats sections
│   ├── columns-outro/        # Outro with video
│   ├── columns-resource/     # Resource link lists
│   ├── sticky-panels/        # Sticky scroll panels
│   ├── hero-banner/          # Interior page hero
│   ├── header/               # Site header
│   └── footer/               # Site footer
├── styles/
│   └── styles.css            # Global styles + brand tokens
├── scripts/
│   ├── scripts.js            # Core EDS scripts
│   └── delayed.js            # Deferred scripts
├── tools/importer/           # Import infrastructure
│   ├── import-homepage.js    # Homepage import script
│   ├── import-interior.js    # Interior pages import script
│   ├── import-resource-hub.js # Resource hub import script
│   ├── parsers/              # Block parsers (per-block content extraction)
│   └── transformers/         # Page transformers (cleanup, sections)
├── content/                  # Migrated content + media
│   ├── index.plain.html     # Homepage
│   ├── images/homepage/      # Homepage images
│   └── media/               # Video files
├── component-definition.json # Universal Editor block definitions
├── component-models.json     # Block field models
├── component-filters.json    # Block container filters
└── Instructions.md           # Migration reference doc
```

---

## Custom Blocks

### hero-video

**Files:** `blocks/hero-video/hero-video.js`, `.css`, `_hero-video.json`

**Behavior:**
- Detects `.mp4` link in Row 2 (video field)
- Creates `<video autoplay muted loop playsinline>` element
- Uses Row 1 image as poster fallback
- Removes video row after creating element, leaving 2 rows (background + text)

**CSS Pattern:**
- `div:first-child` — absolute positioned background (video/image)
- `div:last-child` — relative positioned text overlay with gradient

**Model (3 fields = 2 cells):**
```json
image (reference) + imageAlt (collapsed)
video (reference)
text (richtext)
```

---

### columns (enhanced)

**File:** `blocks/columns/columns.js`

The vanilla columns block has been enhanced with auto-detection:

1. **Sticky Panels Detection:** If column 1 has image AND column 2 has `<strong>` stats + `<a>` CTA → applies sticky-panels CSS classes + IntersectionObserver for fade-in
2. **Video Detection:** If any column has a link containing `.mp4` or `/media_` → creates autoplay video element
3. **Fallback:** Standard columns behavior (image-col detection)

**Why:** AEM Author delivers impact sections as `columns` blocks. The JS auto-detects content patterns and applies appropriate decoration.

---

### cards-article

**File:** `blocks/cards-article/cards-article.css`

**CSS Grid Layout (desktop):**
```
┌─────────────────────┬────────────────────────┐
│ Card 2 (secondary)  │                        │
│ [img] [headline]    │  Card 1 (prominent)    │
├─────────────────────┤  [full image]          │
│ Card 3 (secondary)  │  [headline overlay]    │
│ [img] [headline]    │                        │
└─────────────────────┴────────────────────────┘
```

- `li:first-child` — right column, spans both rows, full-height image with gradient headline overlay
- `li:nth-child(2/3)` — left column, horizontal layout (image left, headline right)

---

### sticky-panels

**Files:** `blocks/sticky-panels/sticky-panels.js`, `.css`

**Desktop Behavior:**
- Image column: `position: sticky; top: 64px; height: calc(100vh - 64px)`
- Content column: normal flow, scrolls past sticky image
- Stats: `opacity: 0 → 1` transition via IntersectionObserver

**Mobile:** Stacked layout (image on top, content below)

**Model:** 2 cells per block (image + content). Use 3 consecutive blocks for 3 panels.

---

### columns-outro

**File:** `blocks/columns-outro/columns-outro.js`

Detects `.mp4` links and creates autoplay video. Adds `.columns-outro-video-col` class for styling.

---

## Design Tokens (styles/styles.css)

```css
:root {
  /* UT Austin brand colors */
  --link-color: #bf5700;          /* Burnt orange */
  --link-hover-color: #9d4700;    /* Darker orange */
  --dark-color: #333f48;          /* Charcoal */
  --text-color: #212529;          /* Body text */
  --heading-color: #333f48;       /* Headings */
  --burnt-orange: #bf5700;        /* Brand alias */
  --charcoal: #333f48;            /* Brand alias */
  --background-color: white;
  --light-color: #f8f8f8;
  --overlay-background-color: #ebe7e1;

  /* Fonts */
  --body-font-family: roboto, roboto-fallback, sans-serif;
  --heading-font-family: roboto-condensed, roboto-condensed-fallback, sans-serif;

  /* Button style: 4px radius, orange border */
}
```

---

## Import Infrastructure

### Overview

Content was migrated from Drupal 11 (utexas.edu) using 3 import scripts:

| Script | Template | Pages |
|--------|----------|-------|
| `import-homepage.js` | Homepage | 1 |
| `import-resource-hub.js` | Resource hub | 3 |
| `import-interior.js` | All other pages | 45 |

### Parsers (`tools/importer/parsers/`)

| Parser | Block | Source Selector |
|--------|-------|-----------------|
| `hero-video.js` | hero-video | `.block-coresite-homepagehero` |
| `hero-banner.js` | hero-banner | `.block-bundle-utexas-hero` |
| `cards-article.js` | cards-article | `.block-coresite-stories` |
| `columns-impact.js` | columns-impact | `.block-coresite-impact-1/2/3` |
| `columns-promo.js` | columns-promo | `#block-coretheme-homepagemidpagepromo` |
| `columns-outro.js` | columns-outro | `.block-homepage-outro` |
| `columns-resource.js` | columns-resource | `.utexas-layout--twocol-wrapper` |

### Transformers (`tools/importer/transformers/`)

| Transformer | Purpose |
|-------------|---------|
| `utexas-cleanup.js` | Remove header/footer/nav, convert blockquotes to quote blocks, insert section-metadata |
| `utexas-sections.js` | Insert section breaks before parsing (beforeTransform) |

### Re-importing a Page

```bash
# Re-bundle after parser/transformer changes
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js

# Re-import single page
echo "https://www.utexas.edu/about-texas" > /tmp/single-url.txt
node "$SCRIPTS/run-bulk-import.js" \
  --import-script tools/importer/import-interior.bundle.js \
  --urls /tmp/single-url.txt
```

---

## Known Issues & Workarounds

### 1. Stats Not Extracted from Impact Sections
**Cause:** JSDOM displaces `.stats` elements outside parent due to `<picture>` with empty `<source>` tags breaking DOM nesting.
**Fix:** Parser uses `KNOWN_STATS` fallback keyed by heading text.

### 2. Video on AEM Cloud
**Cause:** Relative `./media/` paths don't resolve on AEM delivery.
**Fix:** Videos use `/content/media/` absolute paths. Both `hero-video.js` and `columns.js` detect `.mp4` AND `/media_` hash URLs.

### 3. Sticky Panels on AEM Author
**Cause:** AEM Author delivers as `columns` blocks, not `sticky-panels`.
**Fix:** `columns.js` auto-detects the pattern (image + stats + CTA) and applies sticky-panels decoration.

### 4. xwalk/max-cells Lint Rule
**Cause:** Maximum 4 cells per block model.
**Fix:** Sticky-panels uses 2 cells (image + content) per instance. 3 consecutive blocks for 3 panels.

---

## Development Commands

```bash
# Start local dev server
aem up

# Run linting
npm run lint

# Preview at
# http://localhost:3000/content/index

# Run only CSS lint
npm run lint:css

# Run only JS lint
npm run lint:js
```

---

## Deployment

Code deploys automatically via GitHub push → AEM Code Sync:

1. Push to `main` branch
2. GitHub Actions runs lint check
3. AEM Code Sync picks up changes
4. Preview updates at `.aem.page`
5. Publish via Sidekick to go live at `.aem.live`

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `fstab.yaml` | AEM Author mountpoint configuration |
| `.migration/project.json` | Migration project settings (type: xwalk) |
| `component-definition.json` | Block definitions for Universal Editor |
| `component-models.json` | Block field models |
| `component-filters.json` | Block container component filters |
| `Instructions.md` | Complete migration reference (DOM patterns, debugging) |
