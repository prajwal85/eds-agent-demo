# WKND Homepage Migration Plan

## Overview

Migrate the WKND Adventures and Travel homepage (`https://wknd.site/us/en.html`) to AEM Edge Delivery Services. The page features a hero carousel, featured article teasers, article/adventure card grids, and standard header/footer navigation.

## Source Page Analysis

**URL:** `https://wknd.site/us/en.html`
**Title:** WKND Adventures and Travel

### Identified Sections & Blocks

| # | Section | Block Type | Description |
|---|---------|-----------|-------------|
| 1 | Header | Header/Nav | Logo, language toggle, search, mobile hamburger nav |
| 2 | Hero | Carousel | 3-slide hero slideshow (WKND Adventures, San Diego Surf, Downhill Skiing) |
| 3 | Featured Article | Teaser (columns) | Two-column: image + text for "Camping in Western Australia" |
| 4 | Recent Articles | Cards | 4 article cards in grid layout + "All Articles" CTA |
| 5 | Separator | Default content | Horizontal rule |
| 6 | Next Adventures | Teaser (columns) | Two-column: text + image for "Climbing New Zealand" |
| 7 | Adventure Cards | Cards | 4 adventure cards + "All Trips" CTA |
| 8 | Footer | Footer | Logo, nav links, social icons, copyright |

### Existing Local Blocks Available

The workspace already contains these blocks that may be reusable: `accordion`, `cards`, `carousel`, `columns`, `embed`, `footer`, `form`, `fragment`, `header`, `hero`, `modal`, `quote`, `search`, `table`, `tabs`, `video`

## Migration Approach

This migration will use the **`excat:excat-site-migration`** skill, which provides:
- Intelligent block variant detection and reuse
- Automatic page template and metadata management
- Import script generation for content conversion
- Local preview verification

## Checklist

- [ ] **Site analysis** — Classify the URL and create a page template skeleton
- [ ] **Page analysis** — Deep-analyze the page to identify content structure, sections, and block variants
- [ ] **Block mapping** — Map DOM selectors to block variants in the page template
- [ ] **Block variant management** — Check similarity against existing blocks; create new variants only when needed
- [ ] **Import infrastructure** — Generate block parsers and page transformers for the content import
- [ ] **Import script** — Build the combined import script from parsers + transformers
- [ ] **Content import** — Execute the import to generate HTML content files
- [ ] **Design system** — Extract and adapt design tokens (colors, fonts, spacing) from the source site
- [ ] **Preview verification** — Render the migrated page locally and compare against the original
- [ ] **Visual QA & fixes** — Critique styling differences and iterate on CSS until visually accurate

## Key Considerations

- **Carousel block** already exists locally — verify it supports the 3-slide hero pattern from the source
- **Cards block** is used twice with different content (articles vs. adventures) — may need variant analysis
- **Teaser/columns sections** appear twice with mirrored layouts (image-left vs. image-right)
- **Navigation and footer** should be set up as shared fragments for reuse across future pages
- The `content/` directory is currently empty — this will be the first migrated page

## Workspace State

- **Blocks:** 16 blocks available locally
- **Content:** Empty (fresh migration)
- **Config:** No `page-templates.json` or `metadata.json` yet — will be created during migration

---

> **To begin execution:** Switch to Execute mode and the `excat:excat-site-migration` skill will orchestrate all steps automatically.
