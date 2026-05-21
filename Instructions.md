# PSI Exams — Technical Reference

> **Source:** PSI Exams (https://www.psiexams.com/)
> **Target:** AEM Edge Delivery Services (xwalk)

---

## Project Configuration

| Setting | Value |
|---------|-------|
| AEM site path | `/content/psi` |
| AEM assets folder | `/content/dam/` |
| Project type | xwalk |

---

## Repository Structure

```
├── blocks/            # Block implementations (JS + CSS per block)
├── content/           # Migrated content (.plain.html + images + media)
├── styles/styles.css  # Global design tokens
├── tools/importer/
│   ├── parsers/       # Block parsers (one per variant)
│   ├── transformers/  # DOM transformers (cleanup, sections)
│   ├── import-*.js    # Import scripts (one per template)
│   └── page-templates.json
├── models/            # Component model definitions
└── .migration/project.json
```

---

## Template Inventory

| # | Template | Pages | Import Script |
|---|----------|-------|---------------|
| 1 | homepage | 1 | import-homepage.js |

---

## Block Inventory

### Custom Block Variants

| Block Variant | Base Block | Purpose | DOM Selector | Used On |
|---------------|-----------|---------|--------------|---------|
| hero-homepage | hero | Full-width hero with background image, animated heading, dual CTAs | `.elementor-element-90d1967` | homepage |
| hero-cta | hero | Bottom-of-page CTA banner with textured background | `.elementor-element-9397909` | homepage |
| cards-service | cards | Service listings with icons on dark background | `.elementor-element-74cb0d6` | homepage |
| cards-feature | cards | Feature grid (2x3) with photos on light background | `.elementor-element-12993d7` | homepage |
| carousel-testimonial | carousel | Customer testimonial slider with images and quotes | `.sd_testimonial-slider` | homepage |
| carousel-article | carousel | Knowledge Hub article card slider | `.sd_knowledge-slider` | homepage |
| columns-brand | columns | Side-by-side brand showcase (Skills for English, HiSET) | `.elementor-element-6c5b94e8` | homepage |

### Standard EDS Blocks

accordion, tabs, carousel, columns, cards, hero, embed, form, modal, quote, video, table, search, fragment

---

## Import Scripts

| Script | Template | Parsers | Transformers |
|--------|----------|---------|--------------|
| import-homepage.js | homepage | hero-homepage, cards-service, cards-feature, carousel-testimonial, columns-brand, carousel-article, hero-cta | psiexams-cleanup, psiexams-sections |

---

## Parser Reference

| Parser | File | Output Block | Selectors |
|--------|------|--------------|-----------|
| hero-homepage | parsers/hero-homepage.js | Hero (homepage) | `.elementor-element-90d1967` |
| cards-service | parsers/cards-service.js | Cards (service) | `.elementor-element-74cb0d6` |
| cards-feature | parsers/cards-feature.js | Cards (feature) | `.elementor-element-12993d7` |
| carousel-testimonial | parsers/carousel-testimonial.js | Carousel (testimonial) | `.sd_testimonial-slider` |
| columns-brand | parsers/columns-brand.js | Columns (brand) | `.elementor-element-6c5b94e8` |
| carousel-article | parsers/carousel-article.js | Carousel (article) | `.sd_knowledge-slider` |
| hero-cta | parsers/hero-cta.js | Hero (cta) | `.elementor-element-9397909` |

---

## Source CMS DOM Patterns

```
HEADER (removed by transformer):
  header.elementor-location-header (Elementor nav with mega menus)

MAIN CONTENT:
  main#content > .page-content > .elementor.elementor-39
  Sections identified by .elementor-element-{id} classes

BLOCK TYPES:
  Hero: Background image in parent container, jet-animated-text, jet-button CTAs
  Cards: sd_link-container anchors with icon/image, heading, description
  Carousel: jet-listing-grid with slick-slider (testimonials and articles)
  Columns: Side-by-side e-con-full containers within parent

FOOTER (removed by transformer):
  Footer with social links, copyright, legal links
```

---

## Migration Rules

1. **Section-metadata**: Add `style: dark` for dark-background sections (hero area inherits block's own styling, no section-metadata needed)
2. **Slick clones**: Always filter `.slick-cloned` items in carousel parsers to avoid duplicates
3. **Guard clauses**: Carousel parsers must check for specific class (e.g., `sd_testimonial-slider` vs `sd_knowledge-slider`) to avoid parsing wrong carousel
4. **CDN images**: Images from `cdn.shortpixel.ai` preserve full URL during import (resolved later in DAM migration)
5. **Blob images**: Some dynamically loaded images appear as `blob:` URLs — these need manual resolution
6. **Background images**: Hero background images may be CSS-based rather than `<img>` elements — parsers handle both patterns
7. **xwalk field hints**: All parsers include `<!-- field:image -->` and `<!-- field:text -->` comments for Universal Editor integration

---

## Known Issues

1. Some carousel images (testimonials, articles) render as `blob:` URLs that need manual replacement with actual image paths
2. Brand logos (Skills for English, HiSET) also appear as blob URLs due to lazy-loading/Canvas rendering
3. Hero background image extracted from CSS background-image may need path adjustment for DAM

---

## Debugging

```bash
# Preview
aem up  # http://localhost:3000/content/{page-name}

# Re-import single page
echo "https://www.psiexams.com/" > /tmp/url.txt
node "$SCRIPTS/run-bulk-import.js" --import-script tools/importer/import-homepage.bundle.js --urls /tmp/url.txt

# Re-bundle
"$SCRIPTS/aem-import-bundle.sh" --importjs tools/importer/import-homepage.js
```
