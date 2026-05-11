# UT Austin Migration — Technical Reference

> **Source:** https://www.utexas.edu (Drupal 11)
> **Target:** AEM Edge Delivery Services (xwalk project)
> **Pages migrated:** 20 of 54+ identified

---

## Table of Contents

1. [Project Configuration](#project-configuration)
2. [Repository Structure](#repository-structure)
3. [Template Inventory](#template-inventory)
4. [Block Inventory](#block-inventory)
5. [Import Scripts](#import-scripts)
6. [Parser Reference](#parser-reference)
7. [Transformer Reference](#transformer-reference)
8. [Drupal DOM Patterns](#drupal-dom-patterns)
9. [Critical Migration Rules](#critical-migration-rules)
10. [Known Issues](#known-issues)
11. [Debugging Tips](#debugging-tips)

---

## Project Configuration

| Setting | Value |
|---------|-------|
| Project type | `xwalk` (Universal Editor) |
| Library URL | `https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json` |
| Content host | `author-p11300-e47725.adobeaemcloud.com` |
| AEM site path | `/content/eds-agent-demo` |
| AEM assets folder | `/content/dam/eds-agent-demo` |
| Source CMS | Drupal 11 (`utexas-utdk-version: 3`) |
| Config file | `.migration/project.json` |
| Preview URL | `https://main--eds-agent-demo--prajwal85.aem.page/` |
| GitHub repo | `prajwal85/eds-agent-demo` |

---

## Repository Structure

```
/workspace
├── blocks/                    # 36 block implementations
│   ├── hero-video/            # Custom: video background hero
│   ├── hero-banner/           # Custom: static image hero
│   ├── cards-article/         # Custom: news card grid
│   ├── columns-promo/         # Custom: promotional callout
│   ├── columns-impact/        # Custom: stats with image
│   ├── columns-outro/         # Custom: closing section
│   ├── columns-resource/      # Custom: two-col link lists
│   ├── sticky-panels/         # Custom: sticky scroll panels
│   ├── accordion/             # Standard EDS
│   ├── tabs/                  # Standard EDS
│   ├── carousel/              # Standard EDS
│   ├── embed/                 # Standard EDS
│   ├── form/                  # Standard EDS
│   ├── modal/                 # Standard EDS
│   ├── quote/                 # Standard EDS
│   ├── video/                 # Standard EDS
│   ├── table/                 # Standard EDS
│   ├── search/                # Standard EDS
│   ├── fragment/              # Standard EDS
│   ├── header/                # Standard EDS
│   ├── footer/                # Standard EDS
│   ├── columns/               # Standard EDS (base)
│   ├── cards/                 # Standard EDS (base)
│   ├── hero/                  # Standard EDS (base)
│   ├── columns-featured/      # Extended variant
│   ├── carousel-hero/         # Extended variant
│   ├── hero-adventure/        # Extended variant
│   └── retail-*/              # 10 retail legacy blocks (unused)
├── content/                   # Migrated content
│   ├── images/                # Per-page image directories
│   ├── media/                 # Videos (.mp4)
│   └── *.plain.html           # Page content files
├── styles/
│   └── styles.css             # Global design tokens (FROZEN)
├── tools/importer/
│   ├── parsers/               # 10 block parsers
│   ├── transformers/          # 4 transformers
│   ├── import-homepage.js     # Homepage import script
│   ├── import-resource-hub.js # Resource hub import script
│   ├── import-interior.js     # Interior pages import script
│   ├── page-templates.json    # Template definitions
│   └── reports/               # Import reports
├── models/                    # Component model definitions
├── .migration/
│   └── project.json           # Project config
└── docs/                      # Project documentation (handover guides)
```

---

## Template Inventory

10 templates in `tools/importer/page-templates.json`:

| # | Template | Pages | Import Script | Status |
|---|----------|-------|---------------|--------|
| 1 | homepage | 1 | `import-homepage.js` | ✅ Complete |
| 2 | resource-hub | 3 | `import-resource-hub.js` | Partial |
| 3 | section-landing | 10 | `import-interior.js` | Partial |
| 4 | about-subpage | 4 | `import-interior.js` | Partial |
| 5 | academics-subpage | 3 | `import-interior.js` | Pending |
| 6 | campus-life-subpage | 10 | `import-interior.js` | Pending |
| 7 | energy-subpage | 5 | `import-interior.js` | Pending |
| 8 | research-subpage | 3 | `import-interior.js` | Pending |
| 9 | policy-page | 8 | `import-interior.js` | Partial |
| 10 | campus-carry-subpage | 2 | `import-interior.js` | Pending |

### URL Structure
```
/                                    → homepage
/faculty-and-staff-resources         → resource-hub
/family-and-visitor-resources        → resource-hub
/alumni-resources                    → resource-hub
/about-texas                         → section-landing
/about/*                             → about-subpage
/academics/*                         → academics-subpage
/campus-life/*                       → campus-life-subpage
/energy/*                            → energy-subpage
/research/*                          → research-subpage
/campus-carry/*                      → campus-carry-subpage
/contact-us, /jobs, /policies-*      → policy-page
```

---

## Block Inventory

### Custom Blocks (8) — Built for UT Austin

| Block | Purpose | DOM Selector | Used On |
|-------|---------|--------------|---------|
| hero-video | Video background + headline overlay | `.block-coresite-homepagehero` | Homepage |
| hero-banner | Static image background + heading | `.block-bundle-utexas-hero` | Section landing, interior |
| cards-article | News story card grid | `.block-coresite-stories` | Homepage |
| columns-promo | Promotional callout (burnt-orange bg) | `#block-coretheme-homepagemidpagepromo` | Homepage |
| columns-impact | Image + text + stat counters | `.block-coresite-impact-1/2/3` | Homepage |
| columns-outro | Closing section with stats + video | `.block-homepage-outro` | Homepage |
| columns-resource | Two-column link lists | `.utexas-layout--twocol-wrapper` | Resource hub, interior |
| sticky-panels | Sticky image + scrolling stats | — | Homepage |

### Standard EDS Blocks (12)

accordion, tabs, carousel, embed, form, modal, quote, video, table, search, fragment, columns

### Extended Variants (3)

columns-featured, carousel-hero, hero-adventure

### Retail Legacy (10) — Unused, from boilerplate

retail-cards, retail-featured, retail-hero, retail-home-featured, retail-home-flash-sales, retail-newsletter, retail-product, retail-store, retail-testimonials, retail-tips

---

## Import Scripts

### import-homepage.js
- **Parsers:** hero-video, cards-article, columns-promo, columns-impact, columns-outro
- **Transformers:** utexas-cleanup, utexas-sections
- **Coverage:** Complete — all homepage blocks registered

### import-resource-hub.js
- **Parsers:** columns-resource
- **Transformers:** utexas-cleanup
- **Misses:** Hero images, Quick Links icons

### import-interior.js
- **Parsers:** hero-banner, columns-resource
- **Transformers:** utexas-cleanup
- **Misses:** Video heroes, news cards, stats sections, image grids, events
- **Note:** Includes `cleanupBasicBlocks()` fallback for unmatched Drupal blocks

---

## Parser Reference

| Parser | File | Output Block | Selectors |
|--------|------|--------------|-----------|
| hero-video | `parsers/hero-video.js` | hero-video | `.block-bundle-utexas-hero-video`, `.block-coresite-homepagehero` |
| hero-banner | `parsers/hero-banner.js` | hero-banner | `.block-bundle-utexas-hero` |
| cards-article | `parsers/cards-article.js` | cards-article | `.block-coresite-stories` |
| columns-promo | `parsers/columns-promo.js` | columns-promo | `#block-coretheme-homepagemidpagepromo` |
| columns-impact | `parsers/columns-impact.js` | columns-impact | `.block-coresite-impact-1/2/3` |
| columns-outro | `parsers/columns-outro.js` | columns-outro | `.block-homepage-outro` |
| columns-resource | `parsers/columns-resource.js` | columns-resource | `.utexas-layout--twocol-wrapper`, `.utexas-layout--threecol-wrapper` |
| carousel-hero | `parsers/carousel-hero.js` | carousel-hero | Legacy WKND |
| columns-featured | `parsers/columns-featured.js` | columns-featured | Legacy WKND |
| hero-adventure | `parsers/hero-adventure.js` | hero-adventure | Legacy WKND |

---

## Transformer Reference

| Transformer | File | Phase | Purpose |
|-------------|------|-------|---------|
| utexas-cleanup | `transformers/utexas-cleanup.js` | before + after | Remove header, footer, nav, search, widgets |
| utexas-sections | `transformers/utexas-sections.js` | after | Add section breaks for homepage |
| wknd-cleanup | `transformers/wknd-cleanup.js` | — | Legacy WKND |
| wknd-sections | `transformers/wknd-sections.js` | — | Legacy WKND |

### utexas-cleanup removes:
- `#block-coretheme-search-form` (beforeTransform)
- `header.mobile-menu`, `header#coretheme-mainmenu-wrapper` (afterTransform)
- `footer.ut-footer` (afterTransform)
- All `<nav>` elements, CTA header buttons, iframes, noscript (afterTransform)

---

## Drupal DOM Patterns

### Source HTML Selectors

```
HEADER (removed by transformer):
  header.mobile-menu
  header#coretheme-mainmenu-wrapper
  nav#block-coretheme-headeraudiences
  nav#block-coretheme-headerutilitylinks
  #block-coretheme-headergive
  #block-coretheme-headerapply

MAIN CONTENT:
  main.layout-content                          → Main content area
  .layout-builder__region                      → Layout builder region
  .section-wrapper                             → Section container
  .layout.utexas-layout--twocol                → Two-column layout
  .utexas-layout--twocol-wrapper               → Two-column wrapper (parser target)
  .layout__region.layout__region--first        → Left column
  .layout__region.layout__region--second       → Right column
  .utexas-layout--threecol-wrapper             → Three-column wrapper

BLOCK TYPES:
  .block-bundle-utexas-hero                    → Hero banner
  .block-bundle-basic                          → Basic content (heading, text, image)
  .block-bundle-utexas-flex-content-area       → Flex content (links, cards)
  .block-bundle-utexas-quick-links             → Quick links grid
  .block-bundle-call-to-action                 → CTA button
  .block-bundle-social-links                   → Social media links

HOMEPAGE-SPECIFIC:
  .block-coresite-homepagehero                 → Homepage hero
  .block-coresite-stories                      → University stories cards
  .block-coresite-impact-0 through -3          → Impact sections
  .block-homepage-outro                        → Outro section
  #block-coretheme-homepagemidpagepromo        → Mid-page promo

CONTENT ELEMENTS:
  .ut-headline--xl                             → H2 heading
  .ut-headline                                 → H3 heading
  .ut-copy                                     → Rich text content
  .link-list                                   → Link list (ul)
  a.ut-link                                    → Styled link
  a.ut-cta-link--external                      → External link
  a.ut-cta-link--angle-right                   → CTA with arrow
  .ut-btn                                      → Button styled link
  .ut-img--fluid                               → Responsive image
  .quickLinks-grid-item                        → Quick links icon item

FOOTER (removed by transformer):
  footer.ut-footer
```

### Content Extraction Patterns

**Two-column → columns-resource:**
```
.utexas-layout--twocol-wrapper
  └── .layout__region--first  → Column 1 (heading + links)
  └── .layout__region--second → Column 2 (heading + links)
```

**Hero → hero-banner:**
```
.block-bundle-utexas-hero
  └── .ut-hero.hero--half-n-half
      └── img → Background image
      └── h2  → Heading
      └── p   → Description
```

**Basic block → default content:**
```
.block-bundle-basic
  └── .ut-copy / .field--name-body
      └── h2, p, ul, a → Extracted as-is
```

---

## Critical Migration Rules

### Rule 1: Duplicate Hero Block Prevention
When source has sibling hero elements, target ONLY the container with both video and headline (`.block-coresite-homepagehero`). Never match siblings independently.

### Rule 2: Blockquote-to-Quote Conversion
Raw `<blockquote>` must become `<div class="quote">` with proper row structure (quote text row + attribution row).

### Rule 3: Image URL Variant Mapping
Rewrite `1170x1536` image URLs to `585x768` variant. WebImporter's `adjustImageUrls` removes unmapped URLs entirely.

### Rule 4: Stats Fallback (JSDOM Quirks)
JSDOM misparses `<picture>` with empty `<source>`, displacing `.stats` divs. Use `KNOWN_STATS` fallback object in parsers (e.g., columns-impact.js).

### Rule 5: Circular Image Fix
EDS boilerplate default: `main p > img:only-child { border-radius: 50% }`. Override to `border-radius: 0; width: 100%; height: auto`.

### Rule 6: Brand Color Override
Replace EDS blue (`#3b63fb`) with burnt orange (`#bf5700`) in all CSS custom properties. Button `border-radius: 4px` (not pill).

### Rule 7: Section Break Ordering
Section breaks must insert in `beforeTransform` phase, BEFORE parsers modify the DOM.

### Rule 8: Video Block Embedding
Video URLs (`.mp4`) must be wrapped in `<div class="video">` — not left as plain `<a>` links.

---

## Known Issues

1. **Quick Links are not links** — `.quickLinks-grid-item` uses `<img>` + `<p>`, no `<a>` tags. Navigation is JS-driven.
2. **Homepage uses unique modules** — `block-coresite-homepage*` classes exist only on homepage.
3. **ArcGIS map embeds** — Generate console errors during import but page imports fine without map.
4. **Zero-match pages** — Some pages (`/apply`, `/leadership`) use Drupal blocks not covered by selectors. Content extracted via `cleanupBasicBlocks()` fallback.
5. **Stat counters** — Use `.counter`, `.counter.large`, `.counter.billions.dollars` classes. Extracted as plain text.
6. **Videos not auto-downloaded** — Must manually download `.mp4` files to `content/media/`.
7. **Image format conversions** — Scraper converts AVIF/WebP/SVG to PNG. Originals in `migration-work/metadata.json`.
8. **Breadcrumbs in output** — Interior page `<nav class="breadcrumb">` may leak into content. Cleanup transformer should remove.

---

## Debugging Tips

### Preview locally
```bash
aem up
# http://localhost:3000/content/{page-name}
```

### Check block files exist
```bash
ls blocks/hero-banner/
# Expected: hero-banner.js, hero-banner.css
```

### Re-import a single page
```bash
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
echo "https://www.utexas.edu/about-texas" > /tmp/single-url.txt
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-interior.bundle.js --urls /tmp/single-url.txt
```

### Re-bundle after changes
```bash
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js
```

### Common fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Missing hero image | Selector not matching `.ut-hero img` | Update parser selector |
| Empty columns block | No `.layout__region` children | Add null check in parser |
| Drupal markup in output | Unmatched `block-bundle-*` | Add to `cleanupBasicBlocks()` |
| Breadcrumb text showing | `<nav class="breadcrumb">` not removed | Add to cleanup transformer |
| Broken images | AVIF/WebP not captured | Check metadata.json mappings |
