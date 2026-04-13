Let me analyze the existing workspace state and the URLs to build the plan.# WKND Site Migration Plan

## Overview

Migrate 24 pages from the WKND Adventures and Travel site (`https://wknd.site`) to AEM Edge Delivery Services. The pages span 5 distinct page types: homepage, magazine listing, adventures listing, FAQ, about, magazine articles, and adventure detail pages.

## Source URLs (24 pages)

### Homepage (1)
- `https://wknd.site/us/en.html`

### Listing Pages (3)
- `https://wknd.site/us/en/magazine.html`
- `https://wknd.site/us/en/adventures.html`
- `https://wknd.site/us/en/about-us.html`

### FAQ Page (1)
- `https://wknd.site/us/en/faqs.html`

### Magazine Articles (5)
- `https://wknd.site/us/en/magazine/san-diego-surf.html`
- `https://wknd.site/us/en/magazine/western-australia.html`
- `https://wknd.site/us/en/magazine/guide-la-skateparks.html`
- `https://wknd.site/us/en/magazine/ski-touring.html`
- `https://wknd.site/us/en/magazine/arctic-surfing.html`

### Adventure Detail Pages (14)
- `https://wknd.site/us/en/adventures/downhill-skiing-wyoming.html`
- `https://wknd.site/us/en/adventures/climbing-new-zealand.html`
- `https://wknd.site/us/en/adventures/yosemite-backpacking.html`
- `https://wknd.site/us/en/adventures/whistler-mountain-biking.html`
- `https://wknd.site/us/en/adventures/west-coast-cycling.html`
- `https://wknd.site/us/en/adventures/tahoe-skiing.html`
- `https://wknd.site/us/en/adventures/bali-surf-camp.html`
- `https://wknd.site/us/en/adventures/beervana-portland.html`
- `https://wknd.site/us/en/adventures/colorado-rock-climbing.html`
- `https://wknd.site/us/en/adventures/cycling-southern-utah.html`
- `https://wknd.site/us/en/adventures/cycling-tuscany.html`
- `https://wknd.site/us/en/adventures/gastronomic-marais-tour.html`
- `https://wknd.site/us/en/adventures/napa-wine-tasting.html`
- `https://wknd.site/us/en/adventures/riverside-camping-australia.html`

## Workspace State

- **Local blocks (17):** accordion, cards, carousel, columns, embed, footer, form, fragment, header, hero, modal, quote, search, table, tabs, video
- **Content:** Only `footer.plain.html` exists — fresh migration
- **Migration config:** No `.migration/project.json` yet
- **Import infrastructure:** None yet (no parsers, transformers, or templates)

## Migration Approach

This migration uses the **URL List Mode** workflow. The 24 URLs will be grouped into templates by page type, then each template will go through the full migration pipeline: site analysis → page analysis → block mapping → import infrastructure → content import.

## Checklist

- [ ] **Step 0: Initialize Migration Plan** — Detect mode, validate URLs, create migration plan file
- [ ] **Step 1: Project Setup** — Detect project type (xwalk), configure block library URL
- [ ] **Step 2: Site Analysis** — Group 24 URLs into template types (homepage, magazine-listing, adventures-listing, about, faq, magazine-article, adventure-detail), create template skeletons in `page-templates.json`
- [ ] **Step 3: Page Analysis** — Deep-analyze one representative page per template to identify sections, blocks, and authoring decisions. Create block variants as needed.
- [ ] **Step 4: Block Mapping** — Map DOM selectors to block variants for each template in `page-templates.json`
- [ ] **Step 5: Import Infrastructure** — Generate block parsers and page transformers for all identified block variants
- [ ] **Step 6: Content Import** — Generate import scripts per template, bundle, and import all 24 pages to `content/` directory

## Key Considerations

- **Template reuse**: Adventure detail pages (14) likely share the same template, as do magazine articles (5). Efficient grouping reduces analysis work.
- **Block variant reuse**: The migration will leverage 70% similarity matching to reuse block variants across templates where styling is consistent.
- **Existing blocks**: 17 local blocks are already available — new variants will be created only when needed.
- **Previously migrated homepage**: The homepage (`us/en.html`) was migrated in a prior session with 4 block variants (carousel-hero, columns-featured, cards-article, hero-adventure). However, that infrastructure no longer exists in the workspace, so it will be recreated during this migration.

---

> **To begin execution:** Switch to Execute mode. The `excat:excat-site-migration` skill will orchestrate all steps automatically for the 24 URLs.
