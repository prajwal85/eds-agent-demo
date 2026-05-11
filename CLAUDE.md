# CLAUDE.md — Claude Code Configuration

## Project

UT Austin AEM Edge Delivery Services migration. Drupal 11 → EDS (xwalk).

## Key Rules

### DO
- Read `Instructions.md` for full technical reference (blocks, parsers, templates, DOM)
- Read `CONTEXT.md` for brand colors, typography, visual rules
- Read `MIGRATION-PROMPT.md` before migrating pages
- Always download images locally (never leave external URLs in content)
- Always use `git add -f` for content/ files (excluded by .git/info/exclude)
- Always verify pages in preview after changes
- Use existing blocks — only create new ones if truly novel (≥70% different)
- Use proper EDS section structure: each top-level `<div>` = one section
- Include metadata block as the last section in every page

### DO NOT
- Modify `styles/styles.css` — design system is complete and frozen
- Trust the automated importer output without validation — it misses images and blocks
- Leave external utexas.edu image URLs in content files
- Leave "Skip to main content", "Breadcrumb" headings, or "Pause button" text in output
- Generate HTML content directly — use the import pipeline or manual post-import fixes
- Run `sudo` commands (container doesn't support privilege escalation)

## Commands

```bash
# Preview server
aem up  # serves at http://localhost:3000/content/{page-name}

# Import a page
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-interior.bundle.js --urls urls.txt

# Bundle after parser changes
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-interior.js

# Lint
npm run lint
```

## Git Workflow

```bash
export HOME=/home/node
git config user.email "noreply@anthropic.com"
git config user.name "Claude"
git add -f content/  # MUST force-add (content/ is excluded)
git commit -m "message"
# Push requires token in credential helper
```
