# CLAUDE.md — Claude Code Configuration

## Project

UT Austin AEM Edge Delivery Services migration. Drupal 11 → EDS (xwalk).

## Key Rules

### DO
- Read `AGENTS.md` first for project context and file map
- Read `Instructions.md` for DOM selectors, parser details, template inventory
- Read `CONTEXT.md` for brand colors, typography, visual rules
- Read `MIGRATION-PROMPT.md` before migrating pages
- Always download images locally (never leave external URLs in content)
- Always use `git add -f` for content/ files (excluded by .git/info/exclude)
- Always verify pages in preview after changes
- Use existing blocks (hero-video, hero-banner, cards-article, columns-resource, etc.)
- Use proper EDS section structure: each top-level `<div>` = one section
- Include metadata block as the last section in every page

### DO NOT
- Modify `styles/styles.css` — design system is complete and frozen
- Create new block variants unless the content is truly novel (≥70% similarity → reuse)
- Trust the automated importer output without validation — it misses images and blocks
- Leave external utexas.edu image URLs in content files
- Leave "Skip to main content", "Breadcrumb" headings, or "Pause button" text in output
- Generate HTML content directly — use the import pipeline or manual post-import fixes
- Run `sudo` commands (container doesn't support privilege escalation)

### Git Workflow
```bash
export HOME=/home/node
git config user.email "noreply@anthropic.com"
git config user.name "Claude"
git add -f content/  # MUST force-add (content/ is excluded)
git commit -m "message"
# Push requires token in credential helper
```

## Commands

```bash
# Preview server
aem up  # or navigate to http://localhost:3000/content/{page-name}

# Import a page
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-interior.bundle.js --urls urls.txt

# Bundle after parser changes
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js

# Lint
npm run lint
```

## Architecture

- **35 blocks** in `blocks/` (8 custom UT Austin + 10 retail legacy + 17 standard)
- **3 import scripts** covering homepage, resource-hub, and interior pages
- **7 custom parsers** in `tools/importer/parsers/`
- **2 transformers** in `tools/importer/transformers/` (cleanup + sections)
- **10 templates** defined in `tools/importer/page-templates.json`

## Post-Import Checklist (every page migration)

1. Scrape source — identify ALL images and content sections
2. Download images to `content/images/{page-name}/`
3. Download videos to `content/media/`
4. Fix .plain.html — local image paths, proper blocks, section structure
5. Verify in preview — zero external URLs, zero broken images
6. Commit with `git add -f` and push
