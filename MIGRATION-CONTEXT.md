# Migration Context — Lessons Learned & Post-Import Procedures

This file documents hard-won knowledge from migrating 54 pages from www.utexas.edu.
Read this BEFORE running any migration and AFTER the importer finishes.

---

## The Import Pipeline Gap

The automated import pipeline (`run-bulk-import.js`) does these things well:
- Fetches source HTML via Playwright
- Runs cleanup transformer (removes header/footer/nav)
- Matches DOM selectors to registered parsers
- Creates `.plain.html` output with block tables
- Generates import reports

But it does NOT:
- Download images (leaves external URLs that break in production)
- Download videos (leaves as text links)
- Detect blocks not registered in the import script
- Handle Drupal blocks that use JavaScript rendering (maps, carousels)
- Properly structure multi-image content sections

---

## Page Type Classification — What Each Type Actually Needs

### Homepage (import-homepage.js) ✅ COMPLETE
- Hero video, cards-article, columns-promo, sticky-panels, columns-outro
- All blocks registered — importer handles structure
- Images were manually downloaded post-import

### Resource Hub (import-resource-hub.js) — PARTIAL
- Parser handles: columns-resource (two-column link lists)
- Parser MISSES: hero images, Quick Links icons, "Explore Austin" image grids
- **Post-import fix needed:** Download hero + icon images, restructure Quick Links

### Section Landing (import-interior.js) — MOST GAPS
- Parser handles: hero-banner (static `.block-bundle-utexas-hero`), columns-resource
- Parser MISSES:
  - **Video heroes** — /energy, /medical-center use `.block-coresite-homepagehero` with video
  - **News card grids** — story cards with images below the main content
  - **Stats sections** — counter elements with numbers
  - **Image-rich content** — flex content areas with images per item
  - **Events sections** — calendar listings with images
- **Post-import fix needed:** Complete page rewrite with all sections, images, videos

### Interior Sub-pages (import-interior.js) — ADEQUATE
- Most are text-heavy with one hero + columns-resource
- Importer captures structure reasonably well
- **Post-import fix:** Download hero image, check for missing content sections

---

## Drupal Page Patterns — What to Expect

### Pages WITH video heroes (use hero-video block)
- `/` (homepage) — dell-med-center-homepage.mp4
- `/energy` — texas_energy_hero_video3.mp4
- `/medical-center` — dell-med-center-loop-v07.mp4
- `/research` — likely has video
- `/impact-on-texas` — likely has video

**Detection:** Look for `<a href=".../.mp4">` inside the hero section or
`.block-coresite-homepagehero` with a video link.

### Pages WITH static hero images (use hero-banner block)
- `/about-texas` — campus/tower image
- `/entrepreneurship` — branded banner
- `/campus-carry` — campus image
- Most interior sub-pages

**Detection:** `.block-bundle-utexas-hero` with `<img>` inside `.ut-hero`.

### Pages with NO hero (just content)
- `/family-and-visitor-resources` — starts with Quick Links (but HAS a hero image above)
- Most policy pages

**Detection:** No `.block-bundle-utexas-hero` or `.block-coresite-homepagehero` found.
But check the source — some use a different hero class or inline image.

---

## Image Download Procedure

```bash
# 1. Create directory
mkdir -p content/images/{page-name}

# 2. Download with curl (use -sL to follow redirects silently)
curl -sL "https://www.utexas.edu/sites/default/files/styles/..." -o content/images/{page-name}/filename.jpg

# 3. For videos
mkdir -p content/media
curl -sL "https://www.utexas.edu/sites/default/files/hero_video/..." -o content/media/{name}.mp4

# 4. Verify (should show non-zero file size)
ls -lh content/images/{page-name}/
```

### Image URL Patterns from UT Austin Drupal

| Pattern | Size | Use for |
|---------|------|---------|
| `utexas_image_style_1600w` | 1600px wide | Hero images, full-width |
| `utexas_image_style_800w_800h` | 800x800 | Square thumbnails |
| `utexas_image_style_500w` | 500px wide | Sidebar images |
| `utexas_image_style_450w_600h` | 450x600 | Portrait cards |
| `utexas_image_style_340w_227h` | 340x227 | News card thumbnails |
| `utexas_image_style_720w_389h` | 720x389 | Hero banners (smaller) |
| `coresite_herovideo_landscape` | 1920x1080 | Video still frames |

---

## Content File Structure Best Practices

Each `.plain.html` file should follow this pattern:

```html
<!-- Section 1: Hero (hero-video or hero-banner) -->
<div><div class="hero-video">...</div></div>

<!-- Section 2: Intro content -->
<div><h2>...</h2><p>...</p></div>

<!-- Section 3: Cards/navigation -->
<div><div class="cards-article">...</div></div>

<!-- Section 4: Two-column content -->
<div><div class="columns-resource">...</div></div>

<!-- Section N: More content... -->
<div>...</div>

<!-- Final section: Metadata (ALWAYS last) -->
<div><div class="metadata">
  <div><div>Title</div><div>Page Title | University of Texas at Austin</div></div>
  <div><div>Description</div><div>SEO description text.</div></div>
</div></div>
```

Key rules:
- Each top-level `<div>` = one EDS section
- Block classes go on the first child div: `<div><div class="block-name">...</div></div>`
- Metadata is ALWAYS the last section
- Use `<!-- field:image -->` and `<!-- field:text -->` comments for xwalk field hints

---

## Verification Script

After fixing a page, verify images load locally:

```javascript
// Run in browser console at http://localhost:3000/content/{page-name}
(() => {
  const imgs = document.querySelectorAll('main img');
  const results = {
    total: imgs.length,
    local: [...imgs].filter(i => i.src.includes('/images/')).length,
    external: [...imgs].filter(i => i.src.includes('utexas.edu')).length,
    broken: [...imgs].filter(i => i.naturalWidth === 0).length
  };
  console.table(results);
  // Goal: external=0, broken=0
})();
```

---

## Common Mistakes to Avoid

1. **Trusting the importer output** — Always scrape the source page independently to see what's actually there
2. **Forgetting the metadata section** — Every page needs a metadata block at the end
3. **Using external image URLs** — ALWAYS download locally
4. **Wrong hero block type** — Check if page has video (→ hero-video) or just image (→ hero-banner)
5. **Missing news/story cards** — Section landing pages almost always have a news section at the bottom
6. **Flat content without sections** — Each logical section should be its own top-level `<div>`
7. **Leaving "Skip to main content" links** — Remove these from output
8. **Leaving "Breadcrumb" headings** — Remove these from output
9. **Leaving "Pause button" text** — Artifact of video controls, remove
10. **Not downloading videos** — Videos must be local in `content/media/`
