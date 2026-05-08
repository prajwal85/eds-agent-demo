# Universal AEM Edge Delivery Services Migration Prompt

A reusable, parameterized prompt for migrating any website to AEM Edge Delivery Services. Fill in the variables below and provide this prompt to Claude Code to start migration.

---

## Variables (Fill These Before Starting)

```yaml
# ─── REQUIRED VARIABLES ───────────────────────────────────────────────
SOURCE_SITE: ""              # e.g., "https://www.utexas.edu"
SOURCE_CMS: ""               # e.g., "Drupal 11", "WordPress 6.x", "Sitecore 10", "Static HTML"
PROJECT_TYPE: ""             # "xwalk" (Universal Editor) or "doc" (Document-based) or "da" (Dark Alley)
GITHUB_REPO: ""              # e.g., "myorg/my-eds-project"
GITHUB_BRANCH: "main"        # Target branch

# ─── AEM CLOUD CONFIG ────────────────────────────────────────────────
AEM_AUTHOR_HOST: ""          # e.g., "author-p11300-e47725.adobeaemcloud.com"
AEM_SITE_PATH: ""            # e.g., "/content/my-project"
AEM_DAM_PATH: ""             # e.g., "/content/dam/my-project"
AEM_SITE_NAME: ""            # e.g., "my-project"

# ─── CONTENT PATHS ───────────────────────────────────────────────────
CONTENT_PATH: "content"      # Local path for .plain.html files
IMAGES_PATH: "content/images" # Local path for downloaded images
MEDIA_PATH: "content/media"   # Local path for videos/large media

# ─── OPTIONAL VARIABLES ──────────────────────────────────────────────
BLOCK_LIBRARY_URL: ""        # Block library endpoint (if using standard blocks)
PREVIEW_ORG: ""              # GitHub org for preview URL (e.g., "myorg")
PREVIEW_SITE: ""             # GitHub repo name for preview URL
BRAND_PRIMARY_COLOR: ""      # e.g., "#bf5700"
BRAND_FONT_HEADING: ""       # e.g., "Roboto Condensed"
BRAND_FONT_BODY: ""          # e.g., "Roboto"
URLS_TO_MIGRATE: []          # List of specific URLs, or leave empty for full site
```

---

## The Prompt

````
You are migrating {{SOURCE_SITE}} ({{SOURCE_CMS}}) to AEM Edge Delivery Services.

## Project Setup

- **Project type:** {{PROJECT_TYPE}}
- **Repository:** {{GITHUB_REPO}} (branch: {{GITHUB_BRANCH}})
- **AEM Author:** {{AEM_AUTHOR_HOST}}
- **Site path:** {{AEM_SITE_PATH}}
- **DAM path:** {{AEM_DAM_PATH}}
- **Content output:** {{CONTENT_PATH}}/
- **Images output:** {{IMAGES_PATH}}/{page-name}/
- **Media output:** {{MEDIA_PATH}}/

## URLs to Migrate

{{URLS_TO_MIGRATE}}

---

## PHASE 1: Site Discovery & Analysis

Before writing any code or content:

### 1.1 Analyze Site Structure
- Crawl {{SOURCE_SITE}} and identify all unique page templates/layouts
- Group URLs by template pattern (homepage, landing pages, detail pages, utility pages)
- Document the URL structure and hierarchy
- Note the source CMS patterns ({{SOURCE_CMS}} specific selectors, classes, layouts)

### 1.2 Identify Content Patterns
For each template type, document:
- Hero type: video background, static image, text-only, none
- Navigation: mega-menu, sidebar, breadcrumbs
- Content blocks: cards, columns, accordions, tabs, carousels, forms
- Media: images (with size variants), videos, embeds
- Footer/header: shared components (will be excluded from import)
- Metadata: title, description, OG tags, structured data

### 1.3 Map to EDS Blocks
For each content pattern found, decide:
- Can it use a standard EDS block? (columns, cards, accordion, tabs, hero, etc.)
- Does it need a custom block? (only if truly novel — ≥70% similarity to existing → reuse)
- What's the content model? (rows, columns, field types)

### 1.4 Create Page Templates
Define templates in `tools/importer/page-templates.json` with:
- Template name, matching URLs, description
- Block mappings: DOM selectors from source → EDS block names
- Section structure: order of sections, styling (background colors, etc.)

**Output:** A clear template inventory before proceeding.

---

## PHASE 2: Import Infrastructure

### 2.1 Build Transformers
Create DOM transformers in `tools/importer/transformers/`:

**Cleanup transformer** (runs first):
- Remove header, footer, navigation, breadcrumbs
- Remove skip links, accessibility shortcuts, cookie banners
- Remove CMS admin toolbars and edit buttons
- Strip inline scripts and tracking pixels
- Normalize image URLs to full absolute paths

**Sections transformer** (runs second):
- Identify section boundaries from source DOM
- Apply section styles (background colors, spacing variants)
- Ensure proper section breaks between content areas

### 2.2 Build Block Parsers
For each block mapping in page-templates.json, create a parser in `tools/importer/parsers/`:
- Parser receives the matched DOM element
- Returns EDS block table structure (block name + rows + cells)
- Include `<!-- field:image -->`, `<!-- field:text -->`, `<!-- field:video -->` hints for xwalk
- Handle edge cases: missing images, empty content, variant detection

### 2.3 Build Import Script
Create the main import script(s) in `tools/importer/`:
- Register all parsers and transformers
- Configure URL-to-template matching
- Set up the import pipeline: fetch → clean → parse → output

### 2.4 Bundle & Test
```bash
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-{template}.js
```

---

## PHASE 3: Execute Import

### 3.1 Run the Importer
```bash
node "$SCRIPTS/run-bulk-import.js" \
  --import-script tools/importer/import-{template}.bundle.js \
  --urls urls.txt
```

### 3.2 CRITICAL: Do NOT Trust the Output
The automated importer produces a FIRST PASS only. It will:
✅ Fetch source HTML and extract structure
✅ Apply cleanup transformers
✅ Match registered DOM selectors to parsers
✅ Generate .plain.html with block tables
✅ Create import reports

❌ It will NOT:
- Download images (leaves external URLs that BREAK in production)
- Download videos (leaves as text links)
- Detect blocks not registered in the import script
- Handle JavaScript-rendered content (maps, dynamic carousels)
- Properly structure multi-image content sections
- Catch all edge cases in complex layouts

---

## PHASE 4: Post-Import Validation (MANDATORY — Every Page)

This is the most important phase. Skip this and pages WILL break in production.

### Step 1: Scrape Source for Complete Content Inventory
For EACH migrated page:
- Fetch the source URL from {{SOURCE_SITE}}
- Catalog ALL images (URLs, alt text, dimensions)
- Catalog ALL videos/media
- Identify ALL content sections (hero, body, sidebar, cards, CTAs)
- Note which sections the importer missed

### Step 2: Download ALL Images Locally
```bash
mkdir -p {{IMAGES_PATH}}/{page-name}
curl -sL "{image-url}" -o {{IMAGES_PATH}}/{page-name}/{descriptive-name}.jpg
```
Rules:
- NEVER leave external URLs in content files
- Use descriptive filenames (hero-banner.jpg, card-research.jpg) not hashes
- Prefer optimized sizes (800-1600px wide) over full-resolution originals
- Verify non-zero file size after download

### Step 3: Download Videos (if applicable)
```bash
mkdir -p {{MEDIA_PATH}}
curl -sL "{video-url}" -o {{MEDIA_PATH}}/{descriptive-name}.mp4
```

### Step 4: Fix the .plain.html Content
Open each `{{CONTENT_PATH}}/{page-name}.plain.html` and verify/fix:

- [ ] All image `src` use local paths: `./images/{page-name}/filename.ext`
- [ ] All videos reference local paths: `/{{MEDIA_PATH}}/{name}.mp4`
- [ ] Hero block is correct type (hero-video vs hero-banner vs none)
- [ ] All content sections from source are present (cards, columns, quotes, etc.)
- [ ] Block structure is correct (proper rows/cells, field hints)
- [ ] Section breaks are proper (each top-level `<div>` = one section)
- [ ] Metadata block exists as the LAST section
- [ ] No artifacts: "Skip to main content", breadcrumb headings, pause buttons, cookie text
- [ ] No empty sections or orphaned elements
- [ ] All internal links use relative paths

### Step 5: Verify in Preview
```bash
# Start preview server
aem up
# Navigate to: http://localhost:3000/{{CONTENT_PATH}}/{page-name}
```

Run this verification in browser console:
```javascript
(() => {
  const imgs = document.querySelectorAll('main img');
  const results = {
    total: imgs.length,
    local: [...imgs].filter(i => !i.src.includes('://')).length,
    external: [...imgs].filter(i => i.src.includes('://')).length,
    broken: [...imgs].filter(i => i.naturalWidth === 0).length
  };
  console.table(results);
  // PASS: external=0, broken=0
})();
```

**A page is NOT done until: external=0, broken=0, all sections present.**

---

## PHASE 5: Commit & Push

```bash
export HOME=/home/node
git config user.email "noreply@anthropic.com"
git config user.name "Claude"

# Content directory may be git-excluded — always force-add
git add -f {{CONTENT_PATH}}/

git commit -m "Migrate {page-name}: {brief description of content}"
git push origin {{GITHUB_BRANCH}}
```

---

## Block HTML Structure Reference

### hero-video (3 rows: poster image, video file, headline)
```html
<div class="hero-video">
  <div><div><!-- field:image --><p><img src="./images/{page}/hero.jpg" alt="..."></p></div></div>
  <div><div><!-- field:video --><p><a href="/{{MEDIA_PATH}}/{video}.mp4">{video}.mp4</a></p></div></div>
  <div><div><!-- field:text --><h1>Page Title</h1></div></div>
</div>
```

### hero-banner (2 rows: background image, headline)
```html
<div class="hero-banner">
  <div><div><!-- field:image --><p><img src="./images/{page}/hero.jpg" alt="..."></p></div></div>
  <div><div><!-- field:text --><h1>Page Title</h1></div></div>
</div>
```

### cards (N rows: image + text per card)
```html
<div class="cards">
  <div><div><!-- field:image --><p><img src="./images/{page}/card-1.jpg" alt="..."></p></div>
       <div><!-- field:text --><h3><a href="...">Card Title</a></h3><p>Description</p></div></div>
  <!-- more rows... -->
</div>
```

### columns (1 row with N columns)
```html
<div class="columns">
  <div><div><h2>Column 1</h2><p>Content</p></div>
       <div><h2>Column 2</h2><p>Content</p></div></div>
</div>
```

### accordion (N rows: heading + content)
```html
<div class="accordion">
  <div><div><h3>Question 1</h3></div><div><p>Answer text...</p></div></div>
  <div><div><h3>Question 2</h3></div><div><p>Answer text...</p></div></div>
</div>
```

### quote (2 rows: quote text, attribution)
```html
<div class="quote">
  <div><div>"Quote text here."</div></div>
  <div><div>Author Name, Title</div></div>
</div>
```

### metadata (ALWAYS last section — key/value rows)
```html
<div class="metadata">
  <div><div>Title</div><div>Page Title | Site Name</div></div>
  <div><div>Description</div><div>SEO meta description.</div></div>
  <div><div>Image</div><div>./images/{page}/og-image.jpg</div></div>
</div>
```

### section-metadata (style a section — placed inside the section's div)
```html
<div class="section-metadata">
  <div><div>style</div><div>highlight</div></div>
</div>
```

---

## Rules — Non-Negotiable

1. **NEVER leave external image/video URLs in content files.** They break on production CDN.
2. **NEVER trust importer output without manual validation.** It misses content.
3. **NEVER skip the preview verification step.** Visual check catches what code misses.
4. **NEVER modify `styles/styles.css`** if it's marked as frozen/complete.
5. **ALWAYS download images locally** with descriptive filenames.
6. **ALWAYS include metadata block** as the last section of every page.
7. **ALWAYS use `git add -f`** for content files (they may be git-excluded).
8. **ALWAYS verify zero external URLs and zero broken images** before marking done.
9. **Reuse existing blocks** — only create new ones if content is truly novel (≥70% different).
10. **One page at a time** — complete and verify each page before moving to the next.

---

## Common Mistakes (Avoid These)

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| External image URLs left in content | Images 404 on production | Download all images locally |
| Wrong hero block type | Video doesn't play / image missing | Check source for `<video>` or `.mp4` links |
| Missing news/card sections | Incomplete page | Scrape source independently, compare sections |
| No metadata section | Page has no title/SEO | Always add metadata as last section |
| Flat content without section breaks | All content in one section | Each logical area gets its own top-level `<div>` |
| Artifacts in output | "Skip to main content" visible | Clean transformer should remove; verify manually |
| Videos not downloaded | Video link instead of playback | Download .mp4 to {{MEDIA_PATH}}/ |
| Using `git add` without `-f` | Content files not staged | Always `git add -f {{CONTENT_PATH}}/` |
| Reporting "done" without preview check | Broken pages merged | Always verify at localhost:3000 |
| Creating new blocks for similar content | Block sprawl, maintenance burden | Reuse existing blocks with variants |

---

## Checklist — Mark Complete for Each Page

```
Page: _______________  Source URL: _______________

[ ] Source page scraped — all images/videos/sections cataloged
[ ] Images downloaded to {{IMAGES_PATH}}/{page-name}/
[ ] Videos downloaded to {{MEDIA_PATH}}/ (if applicable)
[ ] .plain.html created with correct block structure
[ ] All image paths are local (./images/{page-name}/...)
[ ] All video paths are local (/{{MEDIA_PATH}}/...)
[ ] Hero block type is correct (video/banner/none)
[ ] All content sections from source are represented
[ ] Metadata block present as last section
[ ] No artifacts (skip links, breadcrumbs, pause text)
[ ] Preview verified — zero external URLs, zero broken images
[ ] Committed with git add -f and pushed
```
````

---

## How to Use This Prompt

1. **Copy the variables section** at the top
2. **Fill in your values** (source site, repo, AEM paths, etc.)
3. **Replace `{{VARIABLE}}` placeholders** throughout the prompt with your values
4. **Add your URL list** to `URLS_TO_MIGRATE`
5. **Provide the complete prompt** to Claude Code in a fresh session
6. **Let it run** — it will analyze, build infrastructure, import, and validate

### Example: Filling Variables for a WordPress Migration

```yaml
SOURCE_SITE: "https://www.example-university.edu"
SOURCE_CMS: "WordPress 6.4 with Flavor theme"
PROJECT_TYPE: "xwalk"
GITHUB_REPO: "myorg/example-university-eds"
GITHUB_BRANCH: "main"
AEM_AUTHOR_HOST: "author-p12345-e56789.adobeaemcloud.com"
AEM_SITE_PATH: "/content/example-university"
AEM_DAM_PATH: "/content/dam/example-university"
AEM_SITE_NAME: "example-university"
CONTENT_PATH: "content"
IMAGES_PATH: "content/images"
MEDIA_PATH: "content/media"
BLOCK_LIBRARY_URL: "https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json"
PREVIEW_ORG: "myorg"
PREVIEW_SITE: "example-university-eds"
BRAND_PRIMARY_COLOR: "#003366"
BRAND_FONT_HEADING: "Merriweather"
BRAND_FONT_BODY: "Open Sans"
URLS_TO_MIGRATE:
  - https://www.example-university.edu/
  - https://www.example-university.edu/about
  - https://www.example-university.edu/admissions
  - https://www.example-university.edu/academics
```

---

## Tips for Junior Developers

1. **Start small** — Migrate 1-2 simple pages first (text-heavy policy pages). Get the full workflow down before tackling complex pages with video heroes and card grids.

2. **Read the source** — Always open the source page in your browser AND view the HTML source. The visual page and the DOM often tell different stories.

3. **One template at a time** — Get all pages of one template type working before moving to the next. Patterns you learn on page 1 apply to pages 2-10.

4. **When in doubt, scrape again** — If something looks wrong in preview, go back to the source page. The answer is always in the source DOM.

5. **Preview is your friend** — `aem up` + localhost:3000 shows you exactly what will go live. If it looks wrong there, it will look wrong in production.

6. **Don't fight the importer** — If the importer misses something, fix it manually. The importer is a timesaver for 70% of the work; you do the last 30%.

7. **Images are the #1 failure point** — If you remember nothing else: download every image locally. External URLs = broken production page.

---

## Prompt 1: Project Setup

Use this prompt at the very start when setting up a brand new EDS project from scratch.

````
## AEM Edge Delivery Services — Project Setup

Set up a new AEM Edge Delivery Services project with the following configuration:

### Project Details
- **Project name:** {{AEM_SITE_NAME}}
- **Project type:** {{PROJECT_TYPE}}  (xwalk | doc | da)
- **GitHub repository:** {{GITHUB_REPO}}
- **Branch:** {{GITHUB_BRANCH}}

### AEM Cloud Configuration
- **Author host:** {{AEM_AUTHOR_HOST}}
- **Site path:** {{AEM_SITE_PATH}}
- **DAM path:** {{AEM_DAM_PATH}}
- **Block library:** {{BLOCK_LIBRARY_URL}}

### Tasks

1. **Initialize repository structure**
   - Clone or scaffold from AEM boilerplate (aem-block-collection or aem-boilerplate)
   - Set up `blocks/`, `styles/`, `tools/importer/`, `content/` directories
   - Configure `.migration/project.json` with:
     ```json
     {
       "type": "{{PROJECT_TYPE}}",
       "libraryUrl": "{{BLOCK_LIBRARY_URL}}",
       "contentHostUrl": "{{AEM_AUTHOR_HOST}}",
       "aemSitePath": "{{AEM_SITE_PATH}}",
       "aemAssetsFolderPath": "{{AEM_DAM_PATH}}",
       "aemSiteName": "{{AEM_SITE_NAME}}",
       "aemSiteTitle": "{{AEM_SITE_TITLE}}",
       "previewOrg": "{{PREVIEW_ORG}}",
       "previewSite": "{{PREVIEW_SITE}}"
     }
     ```

2. **Configure git**
   ```bash
   export HOME=/home/node
   git config user.email "noreply@anthropic.com"
   git config user.name "Claude"
   # Add content to .git/info/exclude (EDS convention)
   echo "/content" >> .git/info/exclude
   ```

3. **Set up design system**
   - Extract brand colors, typography, and spacing from {{SOURCE_SITE}}
   - Create `styles/styles.css` with CSS custom properties (design tokens)
   - Include font imports, reset styles, button styles, layout constraints
   - Set breakpoints (typically 900px mobile/desktop)

4. **Configure linting**
   - ESLint for JavaScript (blocks use vanilla JS)
   - Stylelint for CSS
   - Verify with `npm run lint`

5. **Set up import infrastructure**
   - Create `tools/importer/page-templates.json` (empty templates array initially)
   - Create transformer stubs: `tools/importer/transformers/`
   - Create parser directory: `tools/importer/parsers/`

6. **Verify local preview**
   ```bash
   aem up
   # Should serve at http://localhost:3000
   ```

7. **Create project documentation files**
   - `CLAUDE.md` — Claude Code rules, commands, architecture summary
   - `AGENTS.md` — File map, decision log, migration workflow
   - `CONTEXT.md` — Brand colors, typography, visual rules
   - `Instructions.md` — Full technical reference (templates, parsers, DOM patterns)

8. **Initial commit & push**
   ```bash
   git add -A
   git commit -m "Initial project setup: {{AEM_SITE_NAME}} EDS migration"
   git push origin {{GITHUB_BRANCH}}
   ```

### Success Criteria
- [ ] `aem up` runs without errors
- [ ] `npm run lint` passes
- [ ] `.migration/project.json` configured correctly
- [ ] Design tokens extracted and applied in styles.css
- [ ] Documentation files created (CLAUDE.md, AGENTS.md, CONTEXT.md)
- [ ] Repository pushed to {{GITHUB_REPO}}
````

---

## Prompt 2: Warm-Up Prompt (Session Bootstrap)

Use this prompt at the start of every new chat session so Claude Code loads full project context without you explaining anything.

````
Read the following project files to understand the full context of this migration project, then confirm you're ready:

1. `CLAUDE.md` — Project rules, commands, architecture, DO/DON'T lists
2. `AGENTS.md` — File map, repository structure, migration workflow, decision log
3. `Instructions.md` — Full technical reference (templates, parsers, DOM patterns, block variants)
4. `CONTEXT.md` — Brand design tokens (colors, typography, buttons, spacing, responsive rules)
5. `MIGRATION-PROMPT.md` — Migration prompt template with post-import checklist
6. `MIGRATION-CONTEXT.md` — Lessons learned, known gaps, page type classification
7. `.migration/project.json` — Project config (type, AEM paths, library URL)
8. `tools/importer/page-templates.json` — All template definitions and block mappings

After reading, respond with:
- Project name and type
- Source site and CMS
- Number of templates and pages migrated so far
- Key blocks available
- Any active warnings or rules I should know about

Then await my instructions.
````

### Shorter Version (if you want minimal):

````
Bootstrap this session: Read CLAUDE.md, AGENTS.md, Instructions.md, CONTEXT.md, MIGRATION-PROMPT.md, MIGRATION-CONTEXT.md, .migration/project.json, and tools/importer/page-templates.json. Summarize the project state and confirm you're ready.
````

---

## Prompt 3: Documentation Generation

Use this prompt to generate three handover documents — one each for Authors, Developers, and Admins. Each file has a clear scope. No overlap.

### Output Files

| File | Audience | Location |
|------|----------|----------|
| `docs/AUTHOR-GUIDE.md` | Content authors, marketers, editors | Project root `/docs/` |
| `docs/DEVELOPER-GUIDE.md` | Frontend/EDS developers, engineers | Project root `/docs/` |
| `docs/ADMIN-GUIDE.md` | DevOps, AEM admins, IT ops | Project root `/docs/` |

### Source of Truth (read these before generating)

| Reference File | What to Extract |
|----------------|-----------------|
| `CLAUDE.md` | Commands, rules, architecture summary |
| `AGENTS.md` | Repo structure, file map, decision log |
| `Instructions.md` | Templates, parsers, DOM patterns, block variants |
| `CONTEXT.md` | Brand colors, typography, spacing, visual rules |
| `MIGRATION-PROMPT.md` | Migration workflow, validation checklist |
| `MIGRATION-CONTEXT.md` | Lessons learned, known gaps, procedures |
| `.migration/project.json` | AEM config, site paths, project type |
| `tools/importer/page-templates.json` | All templates and block mappings |
| `styles/styles.css` | Design tokens (DO NOT reproduce full file — extract tokens only) |
| `blocks/` directory | Block inventory, JS/CSS per block |

---

### The Prompt

````
Generate three project handover documents by reading the project's existing reference files. Output them to the `docs/` directory.

---

## FILE 1: docs/AUTHOR-GUIDE.md

**Audience:** Content authors, marketers, editors who will create and manage pages in the Universal Editor.

### Sections to Include:

#### 1. Getting Started
- What is AEM Edge Delivery Services (1 paragraph, non-technical)
- How content authoring works (Universal Editor for xwalk projects)
- Preview vs Live environments (how to see your changes)
- Publishing workflow (edit → preview → publish)

#### 2. Page Templates
For EACH template in `page-templates.json`:
- Template name and description
- What pages use this template (list URLs)
- Screenshot description / visual structure (section layout)
- When to use this template vs another

#### 3. Available Blocks (Author's Palette)
For EACH block that authors can use, document:
- **Block name** and what it looks like
- **When to use it** (1-2 sentence guidance)
- **Content model** — what fields the author fills in:
  - Field name, field type (image, text, link, video)
  - Required vs optional
  - Character limits or image size recommendations
- **Variants** — if the block has style variants, list them with visual description
- **Example content** — show a filled-in example

Blocks to document (author-facing):
| Block | Author Sees | Fields |
|-------|-------------|--------|
| hero-video | Video background with headline | Poster image, video file (.mp4), heading text |
| hero-banner | Full-width image with headline | Background image, heading text |
| cards-article | News story card grid | Per card: image, headline (linked), description |
| columns-resource | Two-column link lists | Per column: heading, list of links |
| columns-promo | Promotional banner | Image, heading, CTA button, link |
| columns-impact | Stats with image | Image, description, stat numbers |
| columns-outro | Closing section | Stats, optional video |
| sticky-panels | Scrolling stats panel | Left image, stats (number + label), CTA |
| accordion | Expandable sections | Per item: heading (question), body (answer) |
| quote | Blockquote | Quote text, author name + title |
| video | Embedded video | Video file or embed URL |
| tabs | Tabbed content | Per tab: tab label, tab content |
| table | Data table | Headers + rows |
| embed | External content | Embed URL (YouTube, maps, social) |
| form | Form component | Form definition |
| carousel | Image/content slider | Per slide: image, text |

#### 4. Section Styling
- How to apply background styles to sections
- Available styles: default (white), `highlight` (light gray), `burnt-orange` (brand dark)
- How section-metadata block works
- Visual examples of each style

#### 5. Metadata
- What metadata is and why every page needs it
- Required fields: Title, Description
- Optional fields: Image (OG), Keywords, Tags
- Where metadata appears (last section of every page)

#### 6. Images & Media
- Supported formats (JPG, PNG, WebP, SVG, MP4)
- Recommended image dimensions per use case:
  - Hero images: 1600px wide minimum
  - Card thumbnails: 800x600px
  - Inline content images: 800-1200px wide
- Where images are stored (`content/images/{page-name}/`)
- Where videos are stored (`content/media/`)
- Naming conventions (descriptive, lowercase, hyphens)

#### 7. Content Guidelines
- Writing for web (short paragraphs, clear headings)
- Link text best practices (descriptive, not "click here")
- Heading hierarchy (H1 once per page, then H2 → H3)
- Accessibility requirements (alt text for images, link purpose)

#### 8. Common Tasks
- How to create a new page
- How to add a block to a page
- How to add images
- How to preview changes
- How to publish

#### 9. Troubleshooting (Author)
- Image not showing → check file path and format
- Block not rendering → verify block name spelling
- Page looks different from preview → cache, check publish status
- Content not updating → clear CDN cache via Sidekick

---

## FILE 2: docs/DEVELOPER-GUIDE.md

**Audience:** Frontend developers, EDS developers who will build new blocks, fix bugs, extend functionality.

### Sections to Include:

#### 1. Architecture Overview
- System diagram (text-based):
  ```
  [Source CMS] → [Import Pipeline] → [Content Files] → [EDS CDN] → [Browser]
                                            ↕
                                    [Universal Editor]
  
  Repository Structure:
  ├── blocks/          → Block JS + CSS (auto-loaded by name)
  ├── styles/          → Global design tokens (FROZEN)
  ├── content/         → .plain.html + images + media
  ├── tools/importer/  → Parsers + Transformers + Scripts
  └── docs/            → Project documentation
  ```
- Project type: {{PROJECT_TYPE}} — what this means for development
- How EDS works: content → CDN → browser, no server-side rendering
- Block loading mechanism: EDS auto-loads `blocks/{name}/{name}.js` + `.css` by class name
- No build step — push to main = deployed

#### 2. Technology Stack
- Vanilla JavaScript (no frameworks, no bundler for blocks)
- CSS (no preprocessor — plain CSS with custom properties)
- ESLint + Stylelint for linting
- AEM CLI for local development (`aem up`)
- Node.js for import scripts
- Playwright for source page fetching during import

#### 3. Local Development Setup
```bash
# Prerequisites
node >= 18, npm >= 9

# Install
npm install

# Start local preview
aem up
# → http://localhost:3000

# Lint
npm run lint

# Build component models (after modifying models/)
npm run build:json
```

#### 4. Block Inventory
For EACH block in `blocks/` directory:

| Block | Type | Files | Purpose |
|-------|------|-------|---------|
| (list all blocks with custom vs standard vs retail-legacy classification) |

#### 5. Custom Blocks — Deep Dive
For each CUSTOM block (hero-video, hero-banner, cards-article, columns-promo, columns-impact, columns-outro, columns-resource, sticky-panels):
- **Purpose** — what content pattern it solves
- **Content model** — HTML table structure (rows × cells)
- **JavaScript** — what `decorate(block)` does (DOM manipulation, event listeners, observers)
- **CSS** — key styles, responsive behavior, animations
- **Dependencies** — if it uses IntersectionObserver, video API, etc.
- **Field hints** — `<!-- field:image -->`, `<!-- field:text -->`, `<!-- field:video -->`

#### 6. Creating a New Block
Step-by-step:
1. Create `blocks/{block-name}/` directory
2. Create `{block-name}.js` with `export default function decorate(block) {}`
3. Create `{block-name}.css` with styles
4. Define content model in `models/_component-models.json`
5. Define component in `models/_component-definition.json`
6. Add to filters in `models/_component-filters.json`
7. Run `npm run build:json` to regenerate merged models
8. Test: add block to a content page, preview with `aem up`
9. When to create new vs reuse existing (≥70% similarity → reuse with variant)

#### 7. Design System & Tokens
- All tokens defined in `styles/styles.css` — reference table:
  - Colors (CSS variables → hex values)
  - Typography (font families, sizes per heading level, weights)
  - Spacing (margins, padding, max-width)
  - Breakpoints (mobile < 900px, desktop ≥ 900px, wide ≥ 1200px)
- **RULE:** Never modify `styles/styles.css` — make block-level overrides in `blocks/{name}/{name}.css`
- How to use tokens: `var(--link-color)`, `var(--heading-font-family)`, etc.

#### 8. Import Pipeline Architecture
```
Source URL
    ↓
Playwright fetch (full rendered DOM)
    ↓
Cleanup Transformer (remove header/footer/nav/scripts)
    ↓
Sections Transformer (identify section boundaries)
    ↓
Block Parsers (DOM selector → EDS block table)
    ↓
.plain.html output
    ↓
MANUAL VALIDATION (download images, fix gaps)
```

- Import scripts: what each covers and what it misses
- Parsers: one per block, matches DOM selector, returns block HTML
- Transformers: cleanup (removes chrome) + sections (adds structure)
- Bundle command and execution command
- Known gaps and post-import manual steps

#### 9. Parser Development
- How to create a new parser:
  1. Identify source DOM selector for the content pattern
  2. Create `tools/importer/parsers/{block-name}.js`
  3. Export a function that receives DOM element, returns block HTML
  4. Register in import script with selector → parser mapping
  5. Add to page-templates.json block mappings
  6. Bundle and test
- Parser receives: raw DOM element from source page
- Parser returns: EDS block table HTML (div with class + rows + cells)

#### 10. Content Model (xwalk / Universal Editor)
- Component models: `models/_component-models.json`
- Component definitions: `models/_component-definition.json`
- Component filters: `models/_component-filters.json`
- How field hints map to Universal Editor fields
- Model → Definition → Filter relationship

#### 11. Git Workflow & Deployment
- Branch: `main` (push = deploy)
- Content files need `git add -f` (excluded in .git/info/exclude)
- No CI/CD pipeline — EDS code sync handles deployment
- Preview URL: `https://main--{{PREVIEW_SITE}}--{{PREVIEW_ORG}}.aem.page/`
- Live URL: `https://main--{{PREVIEW_SITE}}--{{PREVIEW_ORG}}.aem.live/`

#### 12. Debugging & Troubleshooting
- Block not loading → check filename matches class name exactly
- CSS not applying → check specificity, inspect with DevTools
- Images broken → verify path is relative, file exists in content/images/
- Import producing empty output → check DOM selector matches source HTML
- Preview differs from live → CDN cache, wait or purge
- `aem up` errors → check Node version, port conflicts

#### 13. Code Standards
- No TypeScript, no JSX — vanilla JS only
- No CSS preprocessors — plain CSS with custom properties
- No external dependencies in blocks (no npm packages in block code)
- ESLint config: `@babel/eslint-parser`, rules in `.eslintrc.json`
- Stylelint config: rules in `.stylelintrc.json`
- Block JS pattern: single default export `decorate(block)` function
- Responsive: mobile-first, breakpoint at 900px

---

## FILE 3: docs/ADMIN-GUIDE.md

**Audience:** DevOps engineers, AEM administrators, IT operations who manage infrastructure, access, and deployment.

### Sections to Include:

#### 1. Environment Overview
- Architecture diagram (text-based):
  ```
  [GitHub Repo] ←→ [AEM Code Sync] ←→ [EDS CDN (.aem.page / .aem.live)]
       ↕                                         ↕
  [AEM Author]  ←→  [Universal Editor]    [End Users]
       ↕
  [AEM Cloud Manager]
  ```
- Environments:
  - **Author:** {{AEM_AUTHOR_HOST}} — content editing
  - **Preview:** https://main--{{PREVIEW_SITE}}--{{PREVIEW_ORG}}.aem.page/ — pre-publish verification
  - **Live:** https://main--{{PREVIEW_SITE}}--{{PREVIEW_ORG}}.aem.live/ — production CDN

#### 2. AEM Cloud Configuration
| Setting | Value |
|---------|-------|
| Author host | {{AEM_AUTHOR_HOST}} |
| Site path | {{AEM_SITE_PATH}} |
| DAM path | {{AEM_DAM_PATH}} |
| Site name | {{AEM_SITE_NAME}} |
| Project type | {{PROJECT_TYPE}} |
| Block library | {{BLOCK_LIBRARY_URL}} |

#### 3. GitHub Repository Management
- Repository: {{GITHUB_REPO}}
- Branch strategy: single `main` branch (push = deploy)
- Code sync: automatic — GitHub webhook triggers EDS CDN update
- Access control: manage via GitHub repository settings (collaborators, teams)
- Branch protection rules recommended: require PR review for production
- Secrets: no secrets in repo — credentials managed externally

#### 4. Deployment Pipeline
- **No traditional CI/CD** — EDS uses code sync:
  1. Developer pushes to `main`
  2. AEM Code Sync detects change (webhook)
  3. CDN updates within seconds
  4. Preview (.aem.page) updates immediately
  5. Live (.aem.live) updates after publish action
- No build step, no Docker, no server provisioning
- Rollback: `git revert` + push

#### 5. Content Sync & Publishing
- Content authored in Universal Editor → stored in AEM Author
- Content delivered via EDS CDN
- Publishing workflow:
  1. Author edits in Universal Editor
  2. Preview available at .aem.page
  3. Publish action (Sidekick) pushes to .aem.live
- Bulk publish: via Admin API or Sidekick bulk selection

#### 6. CDN & Cache Management
- EDS CDN caches content at edge locations globally
- Cache TTLs managed by EDS platform (not configurable per-project)
- Cache invalidation methods:
  - **Sidekick Publish** — invalidates specific page
  - **Admin API** — programmatic purge:
    ```
    POST https://admin.hlx.page/cache/{{PREVIEW_ORG}}/{{PREVIEW_SITE}}/main/{path}
    ```
  - **Bulk purge** — Admin API with path patterns
- When to purge: after content fix, after emergency rollback

#### 7. Sidekick Configuration
- Sidekick extension: installed per-user in browser
- Configuration in `tools/sidekick/config.json` (if present)
- Capabilities:
  - Preview: view content before publish
  - Publish: push preview to live
  - Edit: open page in Universal Editor
  - Delete: remove published page
  - Bulk operations: select multiple pages

#### 8. Access Control & Permissions
| Layer | Who Manages | How |
|-------|-------------|-----|
| GitHub (code) | Repo admin | Repository settings → Collaborators |
| AEM Author (content) | AEM admin | Cloud Manager → User Management |
| Universal Editor | AEM admin | Same as Author permissions |
| Sidekick | Self-service | Browser extension install |
| Admin API | Project admin | API key / service credentials |
| CDN (live) | Platform | Managed by Adobe EDS team |

#### 9. Monitoring & Health Checks
- **Preview health:** Navigate to https://main--{{PREVIEW_SITE}}--{{PREVIEW_ORG}}.aem.page/ — should load within 2s
- **Live health:** Navigate to .aem.live URL
- **Code sync status:** Check GitHub webhook deliveries (Settings → Webhooks)
- **Performance:** Lighthouse audit on .aem.live (target: 100 Performance)
- **Error detection:** Browser DevTools console on preview, check for 404s (images, blocks)

#### 10. Backup & Recovery
- **Code:** Full history in GitHub (git revert for rollback)
- **Content:** AEM Author versioning (restore previous page versions)
- **Assets:** Stored in AEM DAM with version history
- **Disaster recovery:** Re-push from GitHub restores all code; content lives in AEM cloud (Adobe-managed backup)
- **Content files in repo:** `content/` directory can be re-imported from source if needed

#### 11. Domain & DNS (if applicable)
- Custom domain setup via AEM Cloud Manager
- DNS: CNAME to EDS CDN endpoint
- SSL: Managed by Adobe (automatic provisioning)
- Redirect rules: configured via AEM redirects spreadsheet or `.redirects` file

#### 12. Security
- No secrets stored in repository
- GitHub token for push: use fine-grained personal access tokens (repo scope)
- AEM Author: SSO/SAML via Adobe IMS
- Content served read-only from CDN (no server-side execution)
- No database, no server processes — attack surface is minimal
- CSP headers: configurable via response headers sheet

#### 13. Maintenance Tasks
| Task | Frequency | How |
|------|-----------|-----|
| Review GitHub access | Monthly | Repo settings → audit collaborators |
| Check broken images | After each migration batch | Preview site, run image audit script |
| Update dependencies | Quarterly | `npm update`, run lint, test preview |
| Review cache performance | Monthly | Check CDN analytics |
| Audit content permissions | Quarterly | AEM Cloud Manager user list |
| Verify code sync webhook | After repo transfer/rename | GitHub Settings → Webhooks |

#### 14. Troubleshooting (Admin)
| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Changes not appearing on .aem.page | Code sync delay or failure | Check GitHub webhook deliveries |
| Changes not appearing on .aem.live | Not published | Use Sidekick Publish or Admin API |
| 404 on new page | Path mismatch or not published | Verify file exists in repo at correct path |
| Images returning 404 | File not committed or wrong path | Check `content/images/` with `git add -f` |
| Slow page load | Unoptimized images or render-blocking JS | Optimize images, audit block JS |
| Universal Editor not loading | Auth issue or site config | Verify AEM Author access and site path |
| Sidekick not showing options | Extension not configured for project | Re-install with correct org/site |

---

## Process

1. Read ALL reference files listed in "Source of Truth" table above
2. Read current `blocks/` directory — list every block with its JS/CSS
3. Read `styles/styles.css` — extract design tokens only (colors, fonts, spacing)
4. Read `.migration/project.json` — extract all config values
5. Read `tools/importer/page-templates.json` — extract template + block inventory
6. Check `content/` — count migrated pages, list them
7. Generate all three files with proper Markdown formatting
8. Use tables, code blocks, and clear headings
9. Replace all {{VARIABLE}} placeholders with actual project values
10. Save to `docs/` directory

## Rules
- Each file is self-contained — a reader should NOT need to read the other two
- No duplication of content across the three files
- Keep factual — only document what EXISTS in the repo right now
- Include actual values from project config, not placeholders
- Use tables for structured data
- Include code examples where helpful
- Mark frozen/locked items clearly
- Add a "Last Updated" date at the top of each file
````
