# Migration Context — Lessons Learned & Post-Import Procedures

Hard-won knowledge from migrating pages from www.utexas.edu.
Read this AFTER running the importer, before doing manual fixes.

---

## Import Pipeline: What It Does vs What It Misses

**Does well:**
- Fetches source HTML via Playwright
- Runs cleanup transformer (removes header/footer/nav)
- Matches registered DOM selectors to parsers
- Creates `.plain.html` with block tables
- Generates import reports

**Does NOT do:**
- Download images (leaves external URLs — breaks in production)
- Download videos (leaves as text links)
- Detect unregistered blocks
- Handle JS-rendered content (maps, carousels)
- Properly structure multi-image sections

---

## Page Type: What Each Needs Post-Import

### Homepage — COMPLETE
All blocks registered. Images manually downloaded post-import.

### Resource Hub — Download hero images, icons, restructure Quick Links

### Section Landing — MOST GAPS
Needs: video hero detection, news cards, stats sections, image-rich content, events. Often requires complete page rewrite.

### Interior Sub-pages — ADEQUATE
Mostly text-heavy. Fix: download hero image, check for missing content sections.

---

## Hero Type Detection

| Type | Use Block | Detection |
|------|-----------|-----------|
| Video | hero-video | `<a href=".../.mp4">` inside hero, or `.block-coresite-homepagehero` with video link |
| Static image | hero-banner | `.block-bundle-utexas-hero` with `<img>` inside `.ut-hero` |
| None | skip | No hero selector found (policy pages) |

### Pages with video heroes
- `/` — dell-med-center-homepage.mp4
- `/energy` — texas-energy-hero-video.mp4
- `/medical-center` — dell-med-center loop

### Pages with static image heroes
- `/about-texas`, `/entrepreneurship`, `/campus-carry`, most interior pages

---

## Image Download Procedure

```bash
mkdir -p content/images/{page-name}
curl -sL "{image-url}" -o content/images/{page-name}/{descriptive-name}.jpg

mkdir -p content/media
curl -sL "{video-url}" -o content/media/{name}.mp4

# Verify non-zero
ls -lh content/images/{page-name}/
```

### Drupal Image URL Sizes

| Pattern | Size | Use for |
|---------|------|---------|
| `utexas_image_style_1600w` | 1600px wide | Hero, full-width |
| `utexas_image_style_800w_800h` | 800x800 | Square thumbnails |
| `utexas_image_style_500w` | 500px wide | Sidebar |
| `utexas_image_style_450w_600h` | 450x600 | Portrait cards |
| `utexas_image_style_340w_227h` | 340x227 | News card thumbnails |
| `utexas_image_style_720w_389h` | 720x389 | Hero banners (smaller) |
| `coresite_herovideo_landscape` | 1920x1080 | Video still frames |

---

## Content File Structure

```html
<!-- Section 1: Hero -->
<div><div class="hero-video">...</div></div>

<!-- Section 2: Intro -->
<div><h2>...</h2><p>...</p></div>

<!-- Section 3: Cards -->
<div><div class="cards-article">...</div></div>

<!-- Section N: More content... -->
<div>...</div>

<!-- LAST section: Metadata (ALWAYS) -->
<div><div class="metadata">
  <div><div>Title</div><div>Page Title | University of Texas at Austin</div></div>
  <div><div>Description</div><div>SEO description text.</div></div>
</div></div>
```

Rules:
- Each top-level `<div>` = one EDS section
- Block class on first child: `<div><div class="block-name">...</div></div>`
- Metadata is ALWAYS the last section
- Use `<!-- field:image -->` and `<!-- field:text -->` for xwalk hints

---

## Verification Script

```javascript
// Run in browser console at localhost:3000/content/{page-name}
(() => {
  const imgs = document.querySelectorAll('main img');
  const results = {
    total: imgs.length,
    local: [...imgs].filter(i => i.src.includes('/images/')).length,
    external: [...imgs].filter(i => i.src.includes('utexas.edu')).length,
    broken: [...imgs].filter(i => i.naturalWidth === 0).length
  };
  console.table(results);
  // PASS: external=0, broken=0
})();
```

---

## Common Mistakes

1. **Trusting importer output** — Always scrape source independently
2. **Forgetting metadata section** — Every page needs it as the last section
3. **External image URLs** — ALWAYS download locally
4. **Wrong hero type** — Check for video vs static image
5. **Missing news/story cards** — Section landing pages almost always have these
6. **Flat content without sections** — Each logical area = its own top-level `<div>`
7. **"Skip to main content" left in** — Remove
8. **"Breadcrumb" headings left in** — Remove
9. **"Pause button" text left in** — Remove (video control artifact)
10. **Videos not downloaded** — Must be local in `content/media/`
