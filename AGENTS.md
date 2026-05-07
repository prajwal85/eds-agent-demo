# Agent Context — UT Austin EDS Migration

## Project Summary

Migrating www.utexas.edu (Drupal 11) to AEM Edge Delivery Services (xwalk project).
54+ pages migrated across 10 templates. Homepage fully styled with custom blocks.

## File Map

| File | Purpose | When to read |
|------|---------|--------------|
| `AGENTS.md` | Primary agent context (this file) | Always — first file to read |
| `CLAUDE.md` | Claude Code compatibility rules | Always — behavioral guardrails |
| `Instructions.md` | Full project reference (DOM, parsers, templates) | When building/debugging infrastructure |
| `CONTEXT.md` | Brand/design tokens and visual rules | When styling or evaluating visuals |
| `MIGRATION-PROMPT.md` | Refined prompt template for page migration | Before migrating new pages |
| `MIGRATION-CONTEXT.md` | Post-import fixes and lessons learned | After running the importer |

## Repository Structure

```
/workspace
├── blocks/                    # EDS block implementations (35 blocks)
│   ├── hero-video/            # Custom: video background hero
│   ├── hero-banner/           # Custom: static image hero
│   ├── cards-article/         # Custom: news card grid
│   ├── columns-promo/         # Custom: promotional callout
│   ├── columns-impact/        # Custom: stats with image
│   ├── columns-outro/         # Custom: closing section
│   ├── columns-resource/      # Custom: two-col link lists
│   ├── sticky-panels/         # Custom: sticky scroll panels
│   └── ...                    # Standard + retail blocks
├── content/                   # Migrated content (.plain.html)
│   ├── images/                # Downloaded page images (per-page dirs)
│   ├── media/                 # Downloaded videos (.mp4)
│   └── *.plain.html           # Page content files
├── styles/
│   └── styles.css             # Global design tokens (DO NOT MODIFY)
├── tools/importer/            # Import infrastructure
│   ├── parsers/               # Block parsers (7 custom)
│   ├── transformers/          # DOM transformers (cleanup, sections)
│   ├── import-homepage.js     # Homepage import script
│   ├── import-resource-hub.js # Resource hub import script
│   ├── import-interior.js     # Interior pages import script
│   ├── page-templates.json    # Template definitions & block mappings
│   └── reports/               # Import reports (.json, .xlsx)
├── .migration/
│   └── project.json           # Project config (xwalk, library URL)
└── migration-work/            # Scrape artifacts (temp)
```

## Migration Workflow

### Phase 1: Automated Import (produces first pass)
1. Run `import-*.bundle.js` via `run-bulk-import.js`
2. Generates `.plain.html` files in `content/`
3. **Known gap:** Images stay as external URLs, video heroes missed, news cards missing

### Phase 2: Manual Validation & Fix (MANDATORY)
1. Scrape source page — catalog all images, sections, videos
2. Download images to `content/images/{page-name}/`
3. Download videos to `content/media/`
4. Rewrite `.plain.html` with local paths and proper block structure
5. Verify in preview (all images local, zero broken)

### Phase 3: Commit & Push
1. `git add -f content/` (content dir is in .git/info/exclude — must force)
2. Commit with descriptive message
3. Push to main

## Key Technical Facts

- **Project type:** xwalk (Universal Editor compatible)
- **Source CMS:** Drupal 11 with `coresite/coretheme` theme
- **Content exclusion:** `.git/info/exclude` has `/content` — always use `git add -f`
- **Preview server:** `http://localhost:3000/content/{page-name}`
- **Block loading:** EDS auto-loads `blocks/{name}/{name}.js` + `.css` when class detected
- **Design tokens:** All in `styles/styles.css` — NEVER modify this file

## Import Infrastructure Summary

| Script | Handles | Misses |
|--------|---------|--------|
| `import-homepage.js` | hero-video, cards-article, columns-promo/impact/outro | — |
| `import-resource-hub.js` | columns-resource | Hero images, Quick Link icons |
| `import-interior.js` | hero-banner, columns-resource | Video heroes, news cards, image grids |

## Decision Log

| Decision | Reason |
|----------|--------|
| Force-add content to git | `/content` in `.git/info/exclude` for AEM delivery reasons |
| Download images locally | External URLs break in EDS production CDN |
| Use hero-video for video pages | Distinct from hero-banner; auto-creates `<video>` element |
| Manual post-import fixes | Importer can't detect all Drupal block types |
| styles.css is frozen | Brand design complete; changes break all pages |
