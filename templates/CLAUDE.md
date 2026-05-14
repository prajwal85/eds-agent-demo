# CLAUDE.md — Claude Code Configuration

## Project

{{PROJECT_NAME}} migration. {{SOURCE_CMS}} → AEM Edge Delivery Services ({{PROJECT_TYPE}}).

## Rules

### DO
- Read `Instructions.md` for technical reference (blocks, templates, DOM selectors)
- Read `CONTEXT.md` for brand colors, typography, visual rules
- Always download images locally (never leave external URLs in content)
- Always use `git add -f` for content/ files (excluded by .git/info/exclude)
- Always verify pages in preview after changes
- Reuse existing blocks (only create new if ≥70% different)
- Include metadata block as the last section in every page

### DO NOT
- Modify `styles/styles.css` — design system is frozen once complete
- Trust automated importer output without validation
- Leave external image/video URLs in content files
- Leave navigation artifacts (skip links, breadcrumbs) in output

## Commands

```bash
# Preview
aem up  # http://localhost:3000/content/{page-name}

# Import
SCRIPTS="/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts"
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-{template}.bundle.js --urls urls.txt

# Bundle after parser changes
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-{template}.js

# Lint
npm run lint
```

## Git

```bash
export HOME=/home/node
git config user.email "noreply@anthropic.com"
git config user.name "Claude"
git add -f content/
git commit -m "message"
```
