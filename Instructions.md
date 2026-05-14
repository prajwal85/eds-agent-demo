# ETS — Technical Reference

> **Source:** ETS (https://www.ets.org/gre.html)
> **Target:** AEM Edge Delivery Services ({{PROJECT_TYPE}})

---

## Project Configuration

| Setting | Value |
|---------|-------|
| AEM site path | `/content/ets` |
| AEM assets folder | `/content/dam/ets` |


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

---

## Parser Reference

| Parser | File | Output Block | Selectors |
|--------|------|--------------|-----------|
| | | | |

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
