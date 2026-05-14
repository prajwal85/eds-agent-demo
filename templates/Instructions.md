# {{PROJECT_NAME}} — Technical Reference

> **Source:** {{SOURCE_SITE}} ({{SOURCE_CMS}})
> **Target:** AEM Edge Delivery Services ({{PROJECT_TYPE}})

---

## Project Configuration

| Setting | Value |
|---------|-------|
| Project type | `{{PROJECT_TYPE}}` |
| Library URL | `{{BLOCK_LIBRARY_URL}}` |
| Content host | `{{AEM_AUTHOR_HOST}}` |
| AEM site path | `{{AEM_SITE_PATH}}` |
| AEM assets folder | `{{AEM_DAM_PATH}}` |
| Source CMS | {{SOURCE_CMS}} |
| Config file | `.migration/project.json` |
| Preview URL | `https://main--{{PREVIEW_SITE}}--{{PREVIEW_ORG}}.aem.page/` |
| GitHub repo | `{{GITHUB_REPO}}` |

---

## Repository Structure

```
├── blocks/            # Block implementations (JS + CSS per block)
├── content/           # Migrated content (.plain.html + images + media)
├── styles/styles.css  # Global design tokens (FROZEN)
├── tools/importer/
│   ├── parsers/       # Block parsers
│   ├── transformers/  # DOM transformers
│   ├── import-*.js    # Import scripts
│   └── page-templates.json
├── models/            # Component model definitions
└── .migration/project.json
```

---

## Template Inventory

<!-- Fill after site analysis -->

| # | Template | Pages | Import Script |
|---|----------|-------|---------------|
| 1 | | | |

---

## Block Inventory

### Custom Blocks

<!-- Fill as blocks are created -->

| Block | Purpose | DOM Selector | Used On |
|-------|---------|--------------|---------|
| | | | |

### Standard EDS Blocks

accordion, tabs, carousel, columns, cards, hero, embed, form, modal, quote, video, table, search, fragment

---

## Import Scripts

<!-- Fill per script created -->

### import-{template}.js
- **Parsers:** 
- **Transformers:** 
- **Misses:** 

---

## Parser Reference

| Parser | File | Output Block | Selectors |
|--------|------|--------------|-----------|
| | | | |

---

## Transformer Reference

| Transformer | File | Phase | Purpose |
|-------------|------|-------|---------|
| cleanup | `transformers/{name}-cleanup.js` | before + after | Remove header, footer, nav |
| sections | `transformers/{name}-sections.js` | after | Section breaks |

---

## Source CMS DOM Patterns

<!-- Document key selectors from the source site -->

```
HEADER (removed by transformer):
  

MAIN CONTENT:
  

BLOCK TYPES:
  

FOOTER (removed by transformer):
  
```

---

## Known Issues

<!-- Document issues discovered during migration -->

1. 

---

## Debugging

```bash
# Preview
aem up  # http://localhost:3000/content/{page-name}

# Re-import single page
echo "{url}" > /tmp/url.txt
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-{template}.bundle.js --urls /tmp/url.txt

# Re-bundle
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-{template}.js
```
