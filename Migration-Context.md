# Migration Context — PSI Exams

## Migration Stats

| Metric | Value |
|--------|-------|
| Total pages migrated | 1 |
| Total blocks created | 7 variants |
| Total parsers | 7 |
| Total transformers | 2 |
| Import success rate | 100% (1/1) |
| Migration date | 2026-05-19 |

---

## Pages Migrated

| # | Page | URL | Template | Status |
|---|------|-----|----------|--------|
| 1 | Homepage | https://www.psiexams.com/ | homepage | Imported |

**Total: 1 page migrated**

---

## Assets Migrated

| # | Type | Count | Notes |
|---|------|-------|-------|
| 1 | Hero background image | 1 | Full-width hero (webp) |
| 2 | Service icons | 5 | 129x129 webp icons |
| 3 | Feature photos | 6 | 393x300 webp images |
| 4 | Testimonial portraits | 11 | Square portrait images |
| 5 | Brand logos | 2 | Skills for English, HiSET (blob URLs - needs resolution) |
| 6 | Article thumbnails | 10 | Knowledge Hub cards (blob URLs - needs resolution) |
| 7 | Page OG image | 1 | PSI default social sharing image |

**Total: ~36 image assets referenced (some as blob URLs needing resolution)**

---

## Block Variants Created

| Variant | Base | Files Created |
|---------|------|---------------|
| hero-homepage | hero | JS, CSS, metadata.json, _hero-homepage.json |
| hero-cta | hero | JS, CSS, metadata.json, _hero-cta.json |
| cards-service | cards | JS, CSS, metadata.json, _cards-service.json |
| cards-feature | cards | JS, CSS, metadata.json, _cards-feature.json |
| carousel-testimonial | carousel | JS, CSS, metadata.json, _carousel-testimonial.json |
| carousel-article | carousel | JS, CSS, metadata.json, _carousel-article.json |
| columns-brand | columns | JS, CSS, metadata.json, _columns-brand.json |

---

## Import Infrastructure

| File | Purpose |
|------|---------|
| tools/importer/page-templates.json | Template definitions with block mappings |
| tools/importer/import-homepage.js | Import orchestration script |
| tools/importer/import-homepage.bundle.js | Bundled import script |
| tools/importer/parsers/*.js | 7 block parsers |
| tools/importer/transformers/psiexams-cleanup.js | DOM cleanup (header, footer, scripts removal) |
| tools/importer/transformers/psiexams-sections.js | Section breaks and section-metadata insertion |
| tools/importer/urls-homepage.txt | URL list for homepage template |
| tools/importer/reports/import-homepage.report.xlsx | Import report |

---

## Known Limitations

1. **Blob URLs**: Some images (brand logos, article thumbnails) are rendered via Canvas/lazy-loading and captured as `blob:` URLs. These need manual resolution to actual CDN paths.
2. **CDN Images**: Images served via `cdn.shortpixel.ai` retain their CDN URLs — will need DAM migration separately.
3. **Animated Text**: Hero heading animation (rotating text) is simplified to first variant in static HTML output.
4. **Newsletter Form**: HubSpot form iframe in CTA section is not imported (external embed).
