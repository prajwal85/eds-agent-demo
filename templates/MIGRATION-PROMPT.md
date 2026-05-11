# Migration Prompt

```
Migrate pages from {{SOURCE_SITE}} to AEM Edge Delivery Services:

- [PASTE URLs]

## Read First
- Instructions.md — Blocks, parsers, DOM selectors
- CONTEXT.md — Brand/design rules

## Workflow (per page)

1. Run importer
2. Scrape source — catalog all images, videos, sections
3. Download images → content/images/{page-name}/
4. Download videos → content/media/
5. Fix .plain.html — local paths, correct blocks, section structure, metadata last
6. Verify preview — zero external URLs, zero broken images
7. Commit — git add -f content/ && git commit && git push

## Rules
- NEVER leave external image URLs
- ALWAYS download images locally
- ALWAYS add metadata as last section
- ALWAYS verify in preview before commit
- Use git add -f content/ (git-excluded directory)
```
