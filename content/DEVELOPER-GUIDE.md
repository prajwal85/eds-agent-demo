---
title: "UT Austin EDS — Developer Guide"
subtitle: "Complete Architecture, All Blocks, Import Infrastructure, and Operations"
date: "April 2026"
---

# UT Austin EDS — Developer Guide

**Project:** University of Texas at Austin  
**Platform:** AEM Edge Delivery Services (xwalk)  
**Repository:** `github.com/prajwal85/eds-agent-demo`  
**Total Blocks:** 35 (8 custom UT Austin + 10 retail legacy + 17 standard)  
**Date:** April 2026

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         CONTENT AUTHORING LAYER                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────┐         ┌──────────────────────────┐              │
│   │   Universal Editor   │────────▶│   AEM Author Instance     │              │
│   │   (Browser-based)    │         │   author-p11300-e47725    │              │
│   └─────────────────────┘         │   /content/eds-agent-demo │              │
│                                    │   /content/dam/...        │              │
│                                    └────────────┬─────────────┘              │
│                                                 │                            │
└─────────────────────────────────────────────────┼────────────────────────────┘
                                                  │
                                                  │ Franklin Delivery API
                                                  │ (/bin/franklin.delivery/)
                                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         CODE & DELIVERY LAYER                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────┐         ┌──────────────────────────┐              │
│   │   GitHub Repository  │────────▶│   AEM Code Sync           │              │
│   │   prajwal85/         │         │   (Auto-deploys on push)  │              │
│   │   eds-agent-demo     │         └────────────┬─────────────┘              │
│   │                      │                      │                            │
│   │   ├── blocks/        │                      │                            │
│   │   ├── styles/        │                      ▼                            │
│   │   ├── scripts/       │         ┌──────────────────────────┐              │
│   │   └── content/       │         │   EDS CDN Edge Network    │              │
│   └─────────────────────┘         │                            │              │
│                                    │   .aem.page (preview)     │              │
│                                    │   .aem.live (production)  │              │
│                                    └──────────────────────────┘              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Browser Request                                                            │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────┐       │
│   │  CDN    │────▶│  EDS     │────▶│  Code    │────▶│  Rendered    │       │
│   │  Edge   │     │  Delivery│     │  (JS/CSS)│     │  Page        │       │
│   └─────────┘     └──────────┘     └──────────┘     └──────────────┘       │
│                                                                              │
│   1. CDN serves      2. Fetches       3. Loads block    4. Decorated        │
│      cached page        .plain.html      JS/CSS per        HTML rendered    │
│      or fetches         from Author      block class       to user          │
│      fresh              instance                                             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Block Loading Flow

```
Page Load
    │
    ▼
┌─────────────────────────────────────────────────┐
│  1. Fetch {path}.plain.html from delivery       │
│     (content from AEM Author JCR)               │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  2. Parse HTML sections (<div> wrappers)        │
│     Each top-level <div> = one section          │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  3. Detect blocks (class="block-name")          │
│     Load blocks/{name}/{name}.js + .css         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  4. Call decorate(block) for each block         │
│     JS modifies DOM, adds classes, behavior     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  5. Page fully rendered and interactive         │
└─────────────────────────────────────────────────┘
```

---

## Homepage Block Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ SECTION 1: Hero Video                                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  hero-video block                                            │ │
│ │  ┌─────────────────────────────────────────────────────┐    │ │
│ │  │ Row 1: <video autoplay muted loop> (background)     │    │ │
│ │  │ Row 2: <h1> THE FUTURE OF HEALTH...  (overlay)      │    │ │
│ │  └─────────────────────────────────────────────────────┘    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SECTION 2: News Cards                                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  cards-article block                                         │ │
│ │  ┌──────────────────┬───────────────────────────────────┐   │ │
│ │  │ Card 2 [img|txt] │                                   │   │ │
│ │  ├──────────────────┤  Card 1 (prominent)               │   │ │
│ │  │ Card 3 [img|txt] │  [full image + headline overlay]  │   │ │
│ │  └──────────────────┴───────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SECTION 3: Promo (burnt-orange background)                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  columns-promo block                                         │ │
│ │  ┌─────────────────┬───────────────────────────────────┐    │ │
│ │  │ Image           │ Heading + Text + CTA              │    │ │
│ │  └─────────────────┴───────────────────────────────────┘    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SECTION 4: Impact Intro (default content)                        │
│ │  <h2> Boundless Ambition With Texas Roots                     │
│ │  <p> At The University of Texas...                            │
├─────────────────────────────────────────────────────────────────┤
│ SECTION 5-7: Sticky Panels (×3 consecutive blocks)               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  sticky-panels block (or columns with auto-detection)        │ │
│ │  ┌─────────────┬───────────────────────────────────────┐    │ │
│ │  │ Image       │ Heading + Text + CTA                  │    │ │
│ │  │ (sticky)    │ Stats: #1, #7 / 1,291 / 76           │    │ │
│ │  │             │ (fade-in animation)                   │    │ │
│ │  └─────────────┴───────────────────────────────────────┘    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SECTION 8: Outro (For Texas, For the Future)                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  columns-outro block                                         │ │
│ │  ┌───────────────────────────────────┬─────────────────┐    │ │
│ │  │ Heading + Text + CTA + Stats      │ <video autoplay> │    │ │
│ │  │ $18B, 122K                         │ (looping)       │    │ │
│ │  └───────────────────────────────────┴─────────────────┘    │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interior Page Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ SECTION 1: Hero Banner                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  hero-banner block                                           │ │
│ │  [Background image with heading overlay]                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SECTION 2+: Content                                              │
│ │  Default content: H2, paragraphs, lists, links                │
│ │  + columns-resource blocks for two-column layouts:            │
│ │  ┌─────────────────────────────────────────────────────────┐ │
│ │  │  columns-resource                                        │ │
│ │  │  ┌──────────────────┬──────────────────┐                │ │
│ │  │  │ H3 + Link List   │ H3 + Link List   │                │ │
│ │  │  └──────────────────┴──────────────────┘                │ │
│ │  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ METADATA                                                         │
│ │  Title: "Page Title | University of Texas at Austin"           │
│ │  Description: "SEO description..."                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Import Pipeline Architecture

```
Source (utexas.edu)          Import Scripts              Output (EDS content)
─────────────────          ──────────────              ────────────────────

┌───────────────┐    ┌─────────────────────────┐    ┌──────────────────┐
│ Drupal 11     │    │  1. Scrape Webpage       │    │ content/         │
│ HTML Pages    │───▶│     (Playwright)         │───▶│ index.plain.html │
│               │    │                          │    │ about-texas.html │
│ .block-bundle │    │  2. Cleanup Transformer  │    │ energy.html      │
│ .utexas-layout│    │     (remove nav/footer)  │    │ ...49 files      │
│ .ut-hero      │    │                          │    └──────────────────┘
└───────────────┘    │  3. Section Transformer  │
                     │     (insert <hr> breaks) │    ┌──────────────────┐
                     │                          │    │ content/images/  │
                     │  4. Block Parsers        │    │ content/media/   │
                     │     (extract per-block)  │    │ (downloaded)     │
                     │                          │    └──────────────────┘
                     │  5. WebImporter Rules    │
                     │     (metadata, paths)    │    ┌──────────────────┐
                     └─────────────────────────┘    │ reports/         │
                                                     │ *.report.json    │
                                                     │ *.report.xlsx    │
                                                     └──────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Browser)                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │
│  │ scripts/  │  │ styles/   │  │ blocks/   │  │ lib-franklin  │   │
│  │ scripts.js│  │ styles.css│  │ *.js *.css│  │ (EDS runtime) │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                        DELIVERY (CDN Edge)                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ AEM Edge Delivery Services                                     │  │
│  │ - Serves .plain.html from Author                               │  │
│  │ - Serves JS/CSS from GitHub (code sync)                        │  │
│  │ - Image optimization (WebP, responsive)                        │  │
│  │ - Edge caching (instant global delivery)                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        BACKEND (AEM Cloud)                            │
│  ┌───────────────────┐  ┌────────────────────────────────────────┐  │
│  │ AEM Author        │  │ GitHub Repository                       │  │
│  │ - JCR content     │  │ - blocks/ (35 blocks)                   │  │
│  │ - DAM assets      │  │ - styles/ (brand tokens)                │  │
│  │ - Universal Editor│  │ - tools/importer/ (migration infra)     │  │
│  └───────────────────┘  │ - component-*.json (xwalk models)       │  │
│                          └────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        CI/CD                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ GitHub Actions: lint (ESLint + Stylelint + xwalk rules)        │  │
│  │ AEM Code Sync: auto-deploy on push to main                    │  │
│  │ AEM Sidekick: preview → publish workflow                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Custom Blocks (8) — Detailed Reference

### hero-video

**Files:** `blocks/hero-video/hero-video.js`, `.css`, `_hero-video.json`  
**Used on:** Homepage only  
**Selector:** `.block-coresite-homepagehero`

**Model (3 fields, 2 cells after imageAlt collapse):**

| Field | Type | Maps to |
|-------|------|---------|
| image | reference | Row 1 — poster/fallback image |
| imageAlt | text (collapsed) | — |
| video | reference | Row 2 — .mp4 link |
| text | richtext | Row 3 — headline (H1) |

**JS Behavior:**

1. `isVideoUrl()` — checks `.mp4` in path OR `/media_` hash URLs
2. Creates `<video autoplay muted loop playsinline>` with poster
3. Removes video row → 2 rows remain (background + text)

**CSS:** Absolute background + gradient text overlay

---

### hero-banner

**Files:** `blocks/hero-banner/hero-banner.js`, `.css`, `_hero-banner.json`  
**Used on:** 30+ interior pages  
**Selector:** `.block-bundle-utexas-hero`

Standard hero with background image + text overlay. No video.

---

### cards-article

**Files:** `blocks/cards-article/cards-article.js`, `.css`, `_cards-article.json`  
**Used on:** Homepage  

**Desktop grid:** `li:first-child` → right col spans 2 rows; `li:nth-child(2,3)` → left col stacked.  
Background: `var(--burnt-orange)`. Prominent card has gradient headline overlay.

---

### sticky-panels

**Files:** `blocks/sticky-panels/sticky-panels.js`, `.css`, `_sticky-panels.json`  
**Used on:** Homepage (3 instances)  

Desktop: `position: sticky` on image (40% width, viewport height).  
IntersectionObserver fade-in for stats. Model: 2 cells (image + content) per block.

---

### columns (enhanced)

**File:** `blocks/columns/columns.js`, `.css`  
**Used on:** AEM Author pages (auto-detects patterns)

Three behaviors:
1. **Sticky panels** — image + stats + CTA detected → applies sticky decoration
2. **Video** — `.mp4` link detected → creates autoplay video  
3. **Standard** — picture-only columns get `.columns-img-col`

---

### columns-promo / columns-impact / columns-outro / columns-resource

Specialized column variants for homepage promo, impact stats, outro video, and resource link lists respectively. Each has its own CSS but shares the columns base structure.

---

## Standard Blocks (17)

| Block | Description |
|-------|-------------|
| hero | Standard hero (text + image) |
| cards | Standard card grid |
| accordion | Expandable Q&A |
| tabs | Tabbed content |
| carousel | Rotating slideshow |
| quote | Testimonial/pullquote |
| embed | External embed |
| video | Video player (YouTube, Vimeo, MP4) |
| table | Data table |
| modal | Modal overlay |
| form | Form inputs |
| fragment | Reusable content |
| search | Search |
| header | Site header |
| footer | Site footer |
| carousel-hero | Hero carousel (WKND legacy) |
| columns-featured | Featured columns (WKND legacy) |

---

## Design Tokens

```css
:root {
  --link-color: #bf5700;           /* Burnt orange */
  --link-hover-color: #9d4700;     /* Darker orange */
  --dark-color: #333f48;           /* Charcoal */
  --text-color: #212529;           /* Body text */
  --heading-color: #333f48;        /* Headings */
  --burnt-orange: #bf5700;
  --charcoal: #333f48;
  --background-color: white;
  --light-color: #f8f8f8;
  --overlay-background-color: #ebe7e1;
  --body-font-family: roboto, roboto-fallback, sans-serif;
  --heading-font-family: roboto-condensed, roboto-condensed-fallback, sans-serif;
}
```

---

## Import Infrastructure

### Scripts & Parsers

| Import Script | Pages | Parsers Used |
|---------------|-------|-------------|
| `import-homepage.js` | 1 | hero-video, cards-article, columns-promo, columns-impact, columns-outro |
| `import-resource-hub.js` | 3 | columns-resource |
| `import-interior.js` | 45 | hero-banner, columns-resource |

### Transformers

| Transformer | Hook | Purpose |
|-------------|------|---------|
| `utexas-cleanup.js` | before + after | Remove nav, convert blockquotes, section-metadata |
| `utexas-sections.js` | before | Insert `<hr>` section breaks |

### Re-import Commands

```bash
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"

# Bundle
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js

# Import single URL
echo "https://www.utexas.edu/about-texas" > /tmp/url.txt
node "$SCRIPTS/run-bulk-import.js" \
  --import-script tools/importer/import-interior.bundle.js --urls /tmp/url.txt
```

---

## Known Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Stats missing from impact | JSDOM breaks `<picture>` nesting | `KNOWN_STATS` fallback in parser |
| Video not playing on AEM | Relative paths, URL format | `isVideoUrl()` checks `.mp4` + `/media_` |
| Sticky panels blank on Author | Delivered as `columns` class | `columns.js` auto-detects pattern |
| Max-cells lint error | >4 cells per model | 2 cells per block, 3 instances |
| Circular images | Boilerplate CSS `border-radius: 50%` | Removed, replaced with `width: 100%` |
| Blockquotes raw HTML | Drupal blockquotes unhandled | Transformer converts to quote blocks |

---

## Development & Deployment

```bash
aem up                    # Local dev server
npm run lint              # Full lint (JS + CSS + xwalk)
npm run lint:css          # CSS only
npm run lint:js           # JS only
```

**Deploy:** Push to `main` → GitHub Actions lint → AEM Code Sync → Preview → Publish via Sidekick

**Lint rules:** `xwalk/max-cells` (≤4), `no-unused-vars`, `color-function-notation` (modern rgb), `alpha-value-notation` (%)
