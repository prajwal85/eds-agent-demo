# UT Austin Migration — Instructions & Reference

> **Migration completed:** 2026-04-22 in ~2h 33m
> **Source:** https://www.utexas.edu (Drupal 11)
> **Target:** AEM Edge Delivery Services (xwalk project)
> **Pages migrated:** 54+ (ongoing)

---

## Related Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Primary agent context, file map, decision log |
| `CLAUDE.md` | Claude Code behavioral rules and commands |
| `CONTEXT.md` | Brand colors, typography, visual design tokens |
| `MIGRATION-PROMPT.md` | Refined migration prompt with post-import checklist |
| `MIGRATION-CONTEXT.md` | Lessons learned, page type gaps, procedures |
| `Instructions.md` | This file — full technical reference |

---

## Table of Contents

1. [Project Configuration](#project-configuration)
2. [Site Architecture](#site-architecture)
3. [Template Inventory](#template-inventory)
4. [Block Variants](#block-variants)
5. [Import Scripts](#import-scripts)
6. [Drupal DOM Patterns](#drupal-dom-patterns)
7. [Parser Reference](#parser-reference)
8. [Transformer Reference](#transformer-reference)
9. [Known Issues & Quirks](#known-issues--quirks)
10. [Debugging Tips](#debugging-tips)
11. [File Inventory](#file-inventory)

---

## Project Configuration

| Setting | Value |
|---------|-------|
| Project type | `xwalk` (AEM Cross-Walk / Universal Editor) |
| Library URL | `https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json` |
| Content host | `author-p11300-e47725.adobeaemcloud.com` |
| AEM site path | `/content/eds-agent-demo` |
| AEM assets folder | `/content/dam/eds-agent-demo` |
| Source CMS | Drupal 11 (`utexas-utdk-version: 3`) |
| Config file | `.migration/project.json` |

---

## Site Architecture

The UT Austin site uses a consistent Drupal theme (`coresite/coretheme`) with:

- **Layout system:** `utexas-layout--twocol` and `utexas-layout--threecol` wrappers
- **Content blocks:** `block-bundle-*` classes (basic, utexas-hero, utexas-flex-content-area, utexas-quick-links)
- **Header/Footer:** Shared across all pages, auto-removed by cleanup transformer
- **Breadcrumbs:** Present on interior pages (`<nav class="breadcrumb">`)

### URL Structure
```
/                                    → Homepage (unique layout)
/faculty-and-staff-resources         → Resource hub
/family-and-visitor-resources        → Resource hub
/alumni-resources                    → Resource hub
/about-texas                         → Section landing
/about/*                             → About sub-pages
/academics/*                         → Academics sub-pages
/campus-life/*                       → Campus life sub-pages
/energy/*                            → Energy sub-pages
/research/*                          → Research sub-pages
/campus-carry/*                      → Campus carry sub-pages
/contact-us, /jobs, /policies-*      → Policy/info pages
```

---

## Template Inventory

10 templates defined in `tools/importer/page-templates.json`:

| # | Template | Pages | Import Script |
|---|----------|-------|---------------|
| 1 | homepage | 1 | `import-homepage.js` |
| 2 | resource-hub | 3 | `import-resource-hub.js` |
| 3 | section-landing | 10 | `import-interior.js` |
| 4 | about-subpage | 4 | `import-interior.js` |
| 5 | academics-subpage | 3 | `import-interior.js` |
| 6 | campus-life-subpage | 10 | `import-interior.js` |
| 7 | energy-subpage | 5 | `import-interior.js` |
| 8 | research-subpage | 3 | `import-interior.js` |
| 9 | policy-page | 8 | `import-interior.js` |
| 10 | campus-carry-subpage | 2 | `import-interior.js` |

---

## Block Variants

7 custom block variants created in `blocks/`:

### hero-video
- **Base:** hero
- **Purpose:** Homepage video hero with headline overlay
- **Visual:** Dark, spacious, video background (no static image)
- **DOM selector:** `.block-bundle-utexas-hero-video`, `.block-coresite-homepagehero`
- **Content:** `<video>` + `<h2>` headline
- **Used on:** Homepage only

### hero-banner
- **Base:** hero
- **Purpose:** Interior page hero with background image + text overlay
- **Visual:** Dark, spacious, large background image
- **DOM selector:** `.block-bundle-utexas-hero`
- **Content:** Background `<img>` + `<h2>` heading + `<p>` description
- **Used on:** About Texas, Energy, Research, and most section landing pages
- **xwalk fields:** `image` (reference), `imageAlt` (text), `text` (richtext)

### cards-article
- **Base:** cards
- **Purpose:** News story cards grid (reused from WKND project)
- **Visual:** Light, compact, image + headline per card
- **DOM selector:** `.block-coresite-stories`
- **Content:** Grid of linked cards with `<img>` + `<span class="headline">`
- **Similarity reuse:** 82% match from WKND cards-article variant
- **Used on:** Homepage only

### columns-promo
- **Base:** columns
- **Purpose:** Promotional callout on burnt-orange background
- **Visual:** Dark/burnt-orange, compact, image + heading + CTA
- **DOM selector:** `#block-coretheme-homepagemidpagepromo`
- **Content:** Two-column: image left, heading + paragraph + button right
- **Used on:** Homepage (UT Dell Campus promo)

### columns-impact
- **Base:** columns
- **Purpose:** Impact/stats sections with image + metrics
- **Visual:** Light, spacious, portrait image + text + stat counters
- **DOM selector:** `.block-coresite-impact-1`, `.block-coresite-impact-2`, `.block-coresite-impact-3`
- **Content:** Two-column: image left, heading + paragraph + CTA + stats right
- **Used on:** Homepage (3 instances: Longhorn Experience, Big Ideas, Learning With Purpose)

### columns-outro
- **Base:** columns
- **Purpose:** Closing section with content + video on burnt-orange
- **Visual:** Dark/burnt-orange, spacious, text/stats + looping video
- **DOM selector:** `.block-homepage-outro`
- **Content:** Two-column: heading + paragraph + CTA + stats left, video right
- **Used on:** Homepage ("For Texas, For the Future")

### columns-resource
- **Base:** columns
- **Purpose:** Two-column resource link lists
- **Visual:** Light, compact, heading + links per column
- **DOM selector:** `.utexas-layout--twocol-wrapper`, `.utexas-layout--threecol-wrapper`
- **Content:** Two regions with heading + link list each
- **Used on:** Resource hub pages, interior pages (most common block)

---

## Import Scripts

### import-homepage.js
- **Template:** homepage
- **URLs:** 1 (`https://www.utexas.edu/`)
- **Parsers:** hero-video, cards-article, columns-promo, columns-impact, columns-outro
- **Transformers:** utexas-cleanup, utexas-sections
- **Notes:** Homepage has unique Drupal module classes (`block-coresite-homepage`)

### import-resource-hub.js
- **Template:** resource-hub
- **URLs:** 3
- **Parsers:** columns-resource
- **Transformers:** utexas-cleanup
- **Notes:** Quick Links grid uses `.quickLinks-grid-item` with `<p>` labels (not `<a>` links)

### import-interior.js
- **Template:** interior (covers 8 templates)
- **URLs:** 45
- **Parsers:** hero-banner, columns-resource
- **Transformers:** utexas-cleanup
- **Notes:** General-purpose script. Includes `cleanupBasicBlocks()` function to extract content from unmatched Drupal blocks. Handles `block-bundle-basic`, `block-bundle-utexas-flex-content-area` gracefully.

---

## Drupal DOM Patterns

### Key Selectors (Source HTML)

```
HEADER (removed by transformer):
  header.mobile-menu
  header#coretheme-mainmenu-wrapper
  nav#block-coretheme-headeraudiences
  nav#block-coretheme-headerutilitylinks
  nav#coresite-accessible-main-menu
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
  .layout.utexas-layout--threecol              → Three-column layout
  .utexas-layout--threecol-wrapper             → Three-column wrapper
  .layout__region.layout__region--third        → Third column

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
  a.ut-cta-link--lock                          → Authenticated link
  .ut-btn                                      → Button styled link
  .ut-img--fluid                               → Responsive image
  .quickLinks-grid-item                        → Quick links icon item

FOOTER (removed by transformer):
  footer.ut-footer
  .block-bundle-utexas-quick-links (in footer)
  .block__ut-social-links
  .text--copyright
```

### Content Extraction Patterns

**Two-column wrapper → columns-resource block:**
```
.utexas-layout--twocol-wrapper
  └── .layout__region--first  → Column 1 (heading + links)
  └── .layout__region--second → Column 2 (heading + links)
```

**Hero banner → hero-banner block:**
```
.block-bundle-utexas-hero
  └── .ut-hero.hero--half-n-half
      └── img                 → Background image
      └── h2                  → Heading
      └── p                   → Description text
```

**Basic block → default content:**
```
.block-bundle-basic
  └── .ut-copy / .field--name-body
      └── h2, p, ul, a       → Extracted as default content
```

---

## Parser Reference

| Parser | File | Block | Selectors |
|--------|------|-------|-----------|
| hero-video | `parsers/hero-video.js` | hero-video | `.block-bundle-utexas-hero-video`, `.block-coresite-homepagehero` |
| hero-banner | `parsers/hero-banner.js` | hero-banner | `.block-bundle-utexas-hero` |
| cards-article | `parsers/cards-article.js` | cards-article | `.block-coresite-stories` |
| columns-promo | `parsers/columns-promo.js` | columns-promo | `#block-coretheme-homepagemidpagepromo` |
| columns-impact | `parsers/columns-impact.js` | columns-impact | `.block-coresite-impact-1/2/3` |
| columns-outro | `parsers/columns-outro.js` | columns-outro | `.block-homepage-outro` |
| columns-resource | `parsers/columns-resource.js` | columns-resource | `.utexas-layout--twocol-wrapper`, `.utexas-layout--threecol-wrapper` |

---

## Transformer Reference

| Transformer | File | Hook | Purpose |
|-------------|------|------|---------|
| utexas-cleanup | `transformers/utexas-cleanup.js` | before + after | Removes header, footer, nav, search, social widgets, iframes |
| utexas-sections | `transformers/utexas-sections.js` | after | Adds section breaks and section-metadata for homepage |

### utexas-cleanup removes:
- `#block-coretheme-search-form` (beforeTransform)
- `header.mobile-menu`, `header#coretheme-mainmenu-wrapper` (afterTransform)
- `footer.ut-footer` (afterTransform)
- All nav elements, CTA header buttons, iframes, noscript (afterTransform)

---

## Critical Migration Rules & Fixes

Rules identified during homepage migration that MUST be followed for all future imports:

### Rule 1: Duplicate Hero Block Prevention
**Problem:** Import script matched both `.block-bundle-utexas-hero-video` AND `.block-coresite-homepagehero` as sibling elements, creating two separate (often empty) hero blocks.
**Rule:** When the source page has sibling hero elements, target ONLY the container that holds both video background and headline text (`.block-coresite-homepagehero`). Never match sibling elements independently.

### Rule 2: Blockquote-to-Quote Conversion
**Problem:** Raw `<blockquote>` tags from Drupal appeared unprocessed in output.
**Rule:** The cleanup transformer must convert `<blockquote>` to EDS quote blocks. Extract quote text and attribution, create `<div class="quote">` with proper row structure. Affected 4 pages; all re-imported successfully.

### Rule 3: Image URL Variant Mapping
**Problem:** Images referenced `1170x1536` URLs not in scraper's local mapping. WebImporter's `adjustImageUrls` removed them entirely.
**Rule:** Parsers must rewrite image URLs from `1170x1536` to `585x768` variant (which matches the scraper's downloaded mapping). Without this fix, images disappear.

### Rule 4: Stats Fallback for JSDOM Parsing Quirks
**Problem:** JSDOM's HTML parsing of `<picture>` elements with empty `<source>` tags displaces `.stats` divs outside their parent containers, making DOM queries fail. Stats elements completely absent from output.
**Rule:** Add a `KNOWN_STATS` fallback object in parsers (e.g., `columns-impact.js`). When dynamic extraction fails, match stats by heading text and inject directly. Guarantees stats appear even if DOM nesting is broken.

### Rule 5: Circular Image Fix (EDS Boilerplate CSS)
**Problem:** All images displayed as 200x200 circles due to default EDS CSS: `main p > img:only-child { border-radius: 50%; width: 200px; height: 200px; }`
**Rule:** Change `border-radius: 50%` to `border-radius: 0px` in `styles/styles.css`. Images then display at full width with natural aspect ratio.

### Rule 6: Brand Color Override (Blue → Burnt Orange)
**Problem:** All buttons, links, and headings rendered in default EDS blue (`#3b63fb`) instead of UT Austin burnt orange (`#bf5700`).
**Rule:** Update CSS custom properties in `styles/styles.css`:
```css
--link-color: #bf5700        /* burnt orange */
--button-bg: #bf5700
--button-border: #bf5700
--heading-color: #333f48     /* charcoal */
--body-color: #212529        /* dark gray */
```
Button `border-radius: 4px` (square corners, not `2.4em` pill shape).

### Rule 7: Section Break Ordering (beforeTransform)
**Problem:** Sections transformer ran in `afterTransform` phase after parsers had already replaced target DOM elements, so section breaks never inserted.
**Rule:** Section break insertion MUST happen in `beforeTransform` phase, BEFORE any parser modifications. Move section break logic to execute first.

### Rule 8: Video Block Embedding
**Problem:** Video in "For Texas" section rendered as text link instead of embedded video.
**Rule:** Video URLs (`.mp4`) must be wrapped in a proper Video block (`<div class="video">`) — not left as plain `<a>` links. The Video block auto-decorates with `autoplay` controls. Note: Cross-origin videos may not load in local preview due to CORS but will work in production.

---

## Known Issues & Quirks

### 1. Quick Links Grid Items Are NOT Links
The Quick Links section on resource-hub pages uses `.quickLinks-grid-item` with `<img>` + `<p>` text. These are **not wrapped in `<a>` tags** in the source HTML, so they render as plain text items. The actual navigation happens via JavaScript. The parser extracts them as text labels.

### 2. Homepage Uses Custom Drupal Modules
The homepage uses `block-coresite-homepage` module classes that are unique to the homepage — they don't appear on any other page. The `import-homepage.js` script targets these specifically.

### 3. ArcGIS Map Embeds on Health Resources Page
`campus-life/health-and-wellbeing/health-campuswide-resources` loads ArcGIS map components that generate many console errors during import. The page imports successfully despite these errors — the map is simply not captured (expected).

### 4. Some Pages Have Zero Block Matches
Pages like `/apply`, `/about/leadership`, `/policies-and-reporting`, `/state-and-system-resources`, and `/compact-with-texans` matched 0 block instances. These pages either:
- Use different Drupal block structures not covered by our selectors
- Are purely text-based content without layout blocks
- Content is still extracted via the `cleanupBasicBlocks()` fallback

### 5. Stat Counters Use Special CSS Classes
Homepage impact sections use `.counter`, `.counter.large`, `.counter.billions.dollars`, `.counter.thousands` for animated stat numbers. These are extracted as plain text in the columns-impact parser.

### 6. Videos Not Captured
Background videos on homepage (hero + outro) and some section landing pages reference `.mp4` files. These are noted in the HTML but not downloaded. Video URLs:
- `/sites/default/files/hero_video/dell-med-center-homepage-v01.mp4`
- `/modules/coresite/coresite_homepage/assets/forTexas-loop.mp4`

### 7. Image Format Conversions
The scraper converts AVIF, WebP, and SVG images to PNG. Some SVG icons (social media, logo) lose vector quality. Original URLs are preserved in `migration-work/metadata.json` image mappings.

### 8. Breadcrumbs Present in Interior Pages
Interior pages include a breadcrumb `<nav>` that is not explicitly removed. It may appear in content output as residual navigation text. Consider adding breadcrumb removal to the cleanup transformer if this causes rendering issues.

---

## Debugging Tips

### Preview a Page Locally
```bash
# Start the dev server (if not running)
aem up

# Preview at:
# http://localhost:3000/content/about-texas
# http://localhost:3000/content/campus-life/arts-and-culture
```

### Check Block Rendering
```bash
# Verify a block variant has all required files
ls -la blocks/hero-banner/
# Expected: hero-banner.js, hero-banner.css, _hero-banner.json, metadata.json

# Check if block is loaded in page
curl -s http://localhost:3000/content/about-texas.plain.html | grep "hero-banner"
```

### Re-import a Single Page
```bash
# Re-run import for one URL
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
echo "https://www.utexas.edu/about-texas" > /tmp/single-url.txt
node "$SCRIPTS/run-bulk-import.js" \
  --import-script tools/importer/import-interior.bundle.js \
  --urls /tmp/single-url.txt
```

### Re-bundle After Parser Changes
```bash
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js
```

### Check What Blocks Were Found on a Page
Look at the import report:
```bash
# Reports are in Excel format
ls tools/importer/reports/*.xlsx
```
Or check browser console output during import — each page logs "Found N block instances on page".

### Common Content Issues and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Missing hero image | Selector not matching `.ut-hero img` | Update `hero-banner.js` parser selector |
| Empty columns block | Two-col wrapper has no `.layout__region` children | Add null check in `columns-resource.js` |
| Drupal markup in output | Unmatched `block-bundle-*` wrapper | Add selector to `cleanupBasicBlocks()` in `import-interior.js` |
| Breadcrumb text showing | `<nav class="breadcrumb">` not removed | Add to `utexas-cleanup.js` afterTransform removals |
| Broken images | Source uses AVIF/WebP not captured | Check `migration-work/metadata.json` image stats |

---

## File Inventory

### Block Variants (blocks/)
```
blocks/hero-video/          — Homepage video hero
blocks/hero-banner/         — Interior page hero
blocks/cards-article/       — News story cards (reused)
blocks/columns-promo/       — Burnt-orange promotional callout
blocks/columns-impact/      — Impact stats with image
blocks/columns-outro/       — Closing section with video
blocks/columns-resource/    — Two-column resource links
```

### Import Infrastructure (tools/importer/)
```
import-homepage.js          — Homepage import script
import-homepage.bundle.js   — Bundled version
import-resource-hub.js      — Resource hub import script
import-resource-hub.bundle.js
import-interior.js          — Interior pages import script
import-interior.bundle.js
urls-homepage.txt           — 1 URL
urls-resource-hub.txt       — 3 URLs
urls-interior.txt           — 45 URLs
page-templates.json         — 10 template definitions
```

### Parsers (tools/importer/parsers/)
```
hero-video.js               — Homepage video hero parser
hero-banner.js              — Interior hero banner parser
cards-article.js            — News cards parser
columns-promo.js            — Promo callout parser
columns-impact.js           — Impact stats parser
columns-outro.js            — Outro section parser
columns-resource.js         — Resource links parser
carousel-hero.js            — Legacy WKND parser
columns-featured.js         — Legacy WKND parser
hero-adventure.js           — Legacy WKND parser
```

### Transformers (tools/importer/transformers/)
```
utexas-cleanup.js           — UT Austin header/footer/nav removal
utexas-sections.js          — UT Austin section breaks
wknd-cleanup.js             — Legacy WKND cleanup
wknd-sections.js            — Legacy WKND sections
```

### Content (content/)
```
49 .plain.html files across:
  /content/                  — Top-level pages (index, apply, energy, etc.)
  /content/about/            — About sub-pages (4 files)
  /content/academics/        — Academics sub-pages (3 files)
  /content/campus-life/      — Campus life sub-pages (9 files)
  /content/campus-carry/     — Campus carry sub-pages (2 files)
  /content/energy/           — Energy sub-pages (5 files)
  /content/research/         — Research sub-pages (3 files)
```

### Migration Work (migration-work/)
```
migration-plan.md           — Migration status and progress
metadata.json               — Last scraped page metadata
screenshot.png              — Last scraped page screenshot
cleaned.html                — Last scraped page HTML
page-structure.json         — Last analyzed page structure
authoring-analysis.json     — Last authoring decisions
images/                     — Downloaded images from scrapes
```
