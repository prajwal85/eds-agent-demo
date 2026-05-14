# Prompt: Generate Author, Developer, and Admin Guides

Use this prompt with the project-management handover skills to generate comprehensive documentation for the UT Austin AEM Edge Delivery Services project.

---

## Full Prompt

```
Generate a complete project handover with Author Guide, Developer Guide, and Admin Guide for the UT Austin AEM Edge Delivery Services project.

## Project Overview

- **Project:** UT Austin (www.utexas.edu) migration from Drupal 11 to AEM Edge Delivery Services
- **Project Type:** xwalk (Universal Editor compatible)
- **Repository:** github.com/prajwal85/eds-agent-demo
- **AEM Site:** author-p11300-e47725.adobeaemcloud.com
- **AEM Site Path:** /content/eds-agent-demo
- **Preview Org/Site:** prajwal85/eds-agent-demo
- **Source CMS:** Drupal 11 with coresite/coretheme theme
- **Block Library:** https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json

---

## AUTHOR GUIDE — Include These Topics

### 1. Content Architecture
- 10 page templates covering the entire site:
  - **homepage** — Video hero, news stories, impact sections, outro (1 page)
  - **resource-hub** — Categorized links for specific audiences (3 pages: faculty, family, alumni)
  - **section-landing** — Hero + overview + featured cards + sub-navigation (10 pages: apply, about-texas, energy, research, etc.)
  - **about-subpage** — Detailed content under /about (4 pages)
  - **academics-subpage** — Educational content under /academics (3 pages)
  - **campus-life-subpage** — Topic content under /campus-life (10 pages)
  - **energy-subpage** — Energy initiative pages (5 pages)
  - **research-subpage** — Research area pages (3 pages)
  - **policy-page** — Text-heavy compliance/info pages (8 pages)
  - **campus-carry-subpage** — Policy FAQ sub-pages (2 pages)

### 2. Pages Migrated (20 content files currently live)
- index (homepage), about-texas, alumni-resources, apply, campus-carry
- compact-with-texans, contact-us, entrepreneurship, faculty-and-staff-resources
- family-and-visitor-resources, fraud-waste-or-abuse, impact-on-texas, jobs
- military, policies-and-reporting, research, site-policies
- state-and-system-resources, university-honor-code

### 3. Available Blocks (what authors can use)
- **hero-video** — Full-viewport autoplay video background + white headline overlay
- **hero-banner** — Full-width static image background + heading
- **cards-article** — News story card grid (burnt orange cards, white text, images)
- **columns-resource** — Two-column layout with headings + link lists
- **columns-promo** — Promotional callout (image + heading + CTA on dark background)
- **columns-impact** — Image + text + statistics counters
- **columns-outro** — Closing section with stats + video
- **sticky-panels** — Sticky image left, scrolling stats/content right
- **accordion** — Expandable FAQ/collapsible content sections
- **quote** — Blockquote with attribution
- **video** — Standalone embedded video
- **carousel** — Image/content carousel
- **tabs** — Tabbed content panels
- **table** — Data tables
- **embed** — External embeds (maps, social, iframe)
- **form** — Form components
- **modal** — Overlay modal dialogs

### 4. Section Styling
- Default sections (no style)
- `style: burnt-orange` — Dark burnt-orange (#bf5700) background, white text
- `style: highlight` / `style: light` — Light gray (#f8f8f8) background
- Metadata block required as last section in every page

### 5. Image & Media Handling
- All images stored in `content/images/{page-name}/` with descriptive filenames
- Videos stored in `content/media/` (3 videos: forTexas-loop.mp4, dell-med-center-homepage.mp4, texas-energy-hero-video.mp4)
- Image paths are relative: `./images/{page-name}/filename.ext`
- Video paths: `/content/media/{name}.mp4`
- Never use external URLs — all assets must be local

### 6. Content Patterns & Conventions
- Each `<div>` at the top level = one section
- Section dividers: `<p>---</p>` in the HTML
- Block tables: `<div class="block-name">` with row/cell structure
- Field hints: `<!-- field:image -->`, `<!-- field:text -->`, `<!-- field:video -->`
- Links to internal pages: relative paths (e.g., `/content/about-texas`)

---

## DEVELOPER GUIDE — Include These Topics

### 1. Architecture
- **36 total blocks** in `blocks/` directory:
  - 8 custom UT Austin blocks (hero-video, hero-banner, cards-article, columns-promo, columns-impact, columns-outro, columns-resource, sticky-panels)
  - 6 columns/carousel variants (columns-featured, carousel-hero, hero-adventure)
  - 10 retail legacy blocks (retail-cards, retail-featured, retail-hero, etc.) — unused for UT Austin
  - 12 standard EDS blocks (accordion, tabs, table, embed, form, modal, quote, video, search, fragment, header, footer)
- **Design system:** Complete in `styles/styles.css` (FROZEN — never modify)
- **Import infrastructure:**
  - 3 import scripts: import-homepage.js, import-resource-hub.js, import-interior.js
  - 10 custom parsers in `tools/importer/parsers/`
  - 4 transformers in `tools/importer/transformers/` (utexas-cleanup, utexas-sections, wknd-cleanup, wknd-sections)
  - Page template definitions: `tools/importer/page-templates.json`

### 2. Design System (styles/styles.css)
- **Brand colors:** Burnt Orange #bf5700, Charcoal #333f48, Dark Gray #212529, Light Gray #f8f8f8, Cream #ebe7e1
- **Typography:** Roboto (body, 400), Roboto Condensed (headings, 600)
- **Buttons:** 4px border-radius (NOT pill), burnt orange primary, transparent secondary
- **Layout:** Max 1200px, 900px mobile breakpoint, 64px nav height
- **Critical override:** `main p > img:only-child` uses full-width (not circular crop)

### 3. Custom Block Details

#### hero-video (blocks/hero-video/)
- Autoplay/muted/loop `<video>` with dark gradient overlay
- 3-row content model: image (poster), video (mp4 path), text (h1 headline)
- Full-viewport height on desktop

#### hero-banner (blocks/hero-banner/)
- Background image with dark overlay
- 2-row content model: image, text (h1)
- Min-height 300px

#### cards-article (blocks/cards-article/)
- Burnt orange card backgrounds, white text
- Desktop: 2-column grid (1 prominent + 2 stacked)
- Each card: image (object-fit: cover) + h3 link

#### sticky-panels (blocks/sticky-panels/)
- 40% sticky image left, 60% scrolling content right
- IntersectionObserver for stat counter animations
- Large burnt-orange stat numbers (2.5-3.5rem, weight 900)

#### columns-impact (blocks/columns-impact/)
- Image + descriptive text + stat counters
- Flexible layout for impact storytelling

#### columns-promo (blocks/columns-promo/)
- Full-width promotional callout
- Image + heading + CTA button on dark background

#### columns-outro (blocks/columns-outro/)
- Closing section with statistics and optional video
- Used in burnt-orange styled section

#### columns-resource (blocks/columns-resource/)
- 50/50 two-column at desktop, stacked on mobile
- Heading + link list per column

### 4. Import Pipeline
- **Bundle command:** `"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js`
- **Run import:** `node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-interior.bundle.js --urls urls.txt`
- **Known gaps:**
  - Images not downloaded (external URLs left in output)
  - Video heroes not detected by interior parser
  - News card grids missed
  - Quote blocks need manual restructuring
- **Post-import mandatory steps:** Download images, fix block structure, verify preview

### 5. Development Commands
- `aem up` — Start local preview server (localhost:3000)
- `npm run lint` — ESLint + Stylelint
- `npm run lint:js` — JavaScript only
- `npm run lint:css` — CSS only
- `npm run build:json` — Rebuild component models/definitions/filters

### 6. Git Workflow
- Content directory is excluded via `.git/info/exclude`
- Must use `git add -f content/` to stage content files
- Branch: main
- Remote: github.com/prajwal85/eds-agent-demo

### 7. Block Loading Mechanism
- EDS auto-loads `blocks/{name}/{name}.js` + `blocks/{name}/{name}.css` when the block class is detected in content
- No manual registration required — naming convention drives loading
- JavaScript `decorate(block)` function receives the block DOM element

---

## ADMIN GUIDE — Include These Topics

### 1. AEM Cloud Configuration
- **Author instance:** author-p11300-e47725.adobeaemcloud.com
- **Site path:** /content/eds-agent-demo
- **DAM path:** /content/dam/eds-agent-demo
- **Site name:** eds-agent-demo
- **Site title:** EDS Agent Demo

### 2. GitHub Integration
- **Repository:** github.com/prajwal85/eds-agent-demo
- **Branch:** main
- **Preview URL pattern:** https://main--eds-agent-demo--prajwal85.aem.page/
- **Live URL pattern:** https://main--eds-agent-demo--prajwal85.aem.live/

### 3. Code Sync & Deployment
- Push to main triggers automatic code sync
- Block library syncs from: https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json
- No build step required — EDS serves directly from repository

### 4. Content Delivery
- Content authored via Universal Editor (xwalk)
- .plain.html files represent page content
- Images served from repository (content/images/)
- Videos served from repository (content/media/)

### 5. Sidekick Configuration
- Preview, Edit, and Publish actions available via AEM Sidekick
- Library endpoint configured for block browsing

### 6. Cache & CDN
- AEM Edge Delivery CDN handles caching
- Preview (.aem.page) vs Live (.aem.live) environments
- Cache invalidation via Admin API or Sidekick publish action

### 7. Access Control
- GitHub repository access controls code changes
- AEM Cloud Manager manages author permissions
- Universal Editor access tied to AEM identity

### 8. Monitoring & Troubleshooting
- Check preview rendering at https://main--eds-agent-demo--prajwal85.aem.page/
- Common issues: broken images (external URLs), missing blocks (naming mismatch), CSS not loading (file path error)
- Debug locally with `aem up` at localhost:3000

---

## Additional Points to Cover

### Migration Statistics
- **Source:** 54+ pages identified across www.utexas.edu
- **Migrated:** 20 pages currently in content/
- **Remaining:** ~34 pages in templates (section-landing, about-subpage, academics, campus-life, energy, research, campus-carry sub-pages)
- **Custom blocks created:** 8 purpose-built for UT Austin content patterns
- **Import scripts:** 3 (homepage, resource-hub, interior)
- **Design system:** Complete and frozen

### Lessons Learned (document in all guides where relevant)
1. Never trust automated importer output — manual validation mandatory
2. All images must be downloaded locally (external URLs break in production CDN)
3. Video heroes need special detection (Drupal uses different classes)
4. News card grids use homepage-only selectors not in interior parser
5. Content directory requires force-add to git
6. styles.css is frozen — block-level CSS only for visual changes
7. Preview before commit — catch broken images/blocks early

### Brand Guidelines Summary
- Primary color: Burnt Orange #bf5700 (links, buttons, accents)
- Headings: Charcoal #333f48, Roboto Condensed
- Body: Dark Gray #212529, Roboto
- Buttons: Square (4px radius), never pill-shaped
- Images: Full-width, never circular crop
- Tagline: "What Starts Here Changes the World"
```

---

## How to Execute

You can generate these guides using the project-management skills:

```
/handover        — Generates all three guides together
/authoring       — Author guide only
/development     — Developer guide only  
/admin           — Admin guide only
```

Or provide this prompt directly to Claude Code with context of the repository.
