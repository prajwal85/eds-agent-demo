# Migration Prompt — UT Austin Pages

Use this prompt when migrating additional pages from https://www.utexas.edu to AEM Edge Delivery Services.

---

## Prompt

```
Migrate the following pages from https://www.utexas.edu to AEM Edge Delivery Services:

- [PASTE URLs HERE]

## Context

This is an ONGOING migration of www.utexas.edu (Drupal 11) to AEM EDS (xwalk).
The homepage and 49 other pages are already migrated with full design.

Read these files for rules and context:
- /workspace/Instructions.md — Full rules, DOM patterns, parser reference
- /workspace/MIGRATION-CONTEXT.md — Post-import fixes checklist, lessons learned

## CRITICAL: The automated importer has known gaps

The `import-interior.js` and `import-resource-hub.js` scripts produce a FIRST PASS only.
After running the importer, you MUST perform manual validation and fixes because:

1. **Images are NOT downloaded** — The importer leaves external URLs from utexas.edu.
   You must download all images locally to `content/images/{page-name}/` and update src paths.

2. **Video heroes are NOT detected** — Pages like /energy, /medical-center have video heroes
   (`.block-coresite-homepagehero` with video), but `import-interior.js` only maps
   `.block-bundle-utexas-hero` (static image hero). These pages need hero-video blocks
   with the video file downloaded to `content/media/`.

3. **News cards are NOT captured** — Section-landing pages have story card grids
   (`.block-coresite-stories`, `.view-frontpage-stories`) that the interior parser ignores.
   These need cards-article blocks with images.

4. **Content sections with images are flattened** — Drupal blocks with images
   (flex-content-area, quick-links with icons) lose their images during import.
   You must reconstruct these with local images and proper columns-resource structure.

5. **Quote blocks render as raw blockquotes** — The EDS quote block expects
   `<div class="quote">` with row structure, not `<blockquote>`. Fix the HTML.

## Post-Import Validation Checklist (MANDATORY)

After the importer runs, for EACH page:

### Step 1: Scrape source page for complete content inventory
- Fetch the source URL and catalog ALL images (with URLs and alt text)
- Identify ALL content sections (hero, cards, columns, stats, news, events)
- Note which sections have video backgrounds

### Step 2: Download ALL images locally
- Create `content/images/{page-name}/` directory
- Download every image from the source page
- Use descriptive filenames (e.g., hero-rendering.jpg, news-article-1.jpg)

### Step 3: Download videos (if applicable)
- If the page has a video hero, download the .mp4 to `content/media/`
- Update the hero-video block to reference the local path

### Step 4: Rewrite the .plain.html with proper structure
- Replace external image URLs with local `./images/{page-name}/filename.ext` paths
- Add hero-video or hero-banner block with proper field comments
- Add cards-article blocks for news sections (with images)
- Add columns-resource blocks for two-column layouts (with images)
- Add quote blocks with proper `<div class="quote">` structure
- Ensure proper section breaks between content areas

### Step 5: Verify in preview
- Navigate to http://localhost:3000/content/{page-name}
- Confirm ALL images load (check: total, local, external, broken counts)
- Confirm blocks render with correct structure
- Confirm links work

## Existing Blocks (REUSE — do NOT create new ones unless truly novel)

| Block | When to use |
|-------|-------------|
| `hero-video` | Page has video background + headline (energy, medical-center) |
| `hero-banner` | Page has static image background + heading (about-texas, interior pages) |
| `cards-article` | News story grid with image + headline per card |
| `columns-resource` | Two-column layout with headings + links or images |
| `columns-promo` | Promotional callout (image + heading + CTA, dark bg) |
| `columns-impact` | Image + text + stat counters |
| `columns-outro` | Closing section with stats + video |
| `sticky-panels` | Sticky image left, scrolling content + stats right |
| `accordion` | Expandable FAQ/content |
| `video` | Standalone embedded video |
| `quote` | Blockquote with attribution |

## Block HTML Structure Reference

### hero-video (3 rows: image, video, text)
```html
<div class="hero-video">
  <div><div><!-- field:image --><p><img src="./images/{page}/hero.jpg" alt="..."></p></div></div>
  <div><div><!-- field:video --><p><a href="/content/media/{video}.mp4">{video}.mp4</a></p></div></div>
  <div><div><!-- field:text --><h1 id="...">Page Title</h1></div></div>
</div>
```

### hero-banner (2 rows: image, text)
```html
<div class="hero-banner">
  <div><div><!-- field:image --><p><img src="./images/{page}/hero.jpg" alt="..."></p></div></div>
  <div><div><!-- field:text --><h1 id="...">Page Title</h1></div></div>
</div>
```

### cards-article (N rows: image + text per card)
```html
<div class="cards-article">
  <div><div><!-- field:image --><p><img src="./images/{page}/card-1.jpg" alt="..."></p></div>
       <div><!-- field:text --><h3><a href="...">Card headline</a></h3></div></div>
  <div><div><!-- field:image --><p><img src="./images/{page}/card-2.jpg" alt="..."></p></div>
       <div><!-- field:text --><h3><a href="...">Card headline</a></h3></div></div>
</div>
```

### columns-resource (1 row with 2 columns)
```html
<div class="columns-resource">
  <div><div><h2>Column 1 Heading</h2><p><a href="...">Link</a></p></div>
       <div><h2>Column 2 Heading</h2><p><a href="...">Link</a></p></div></div>
</div>
```

### quote (2 rows: quote text, attribution)
```html
<div class="quote">
  <div><div>"Quote text here."</div></div>
  <div><div>Author Name, Title</div></div>
</div>
```

## Image Handling Rules

1. ALWAYS download images locally — never leave external utexas.edu URLs
2. Use relative paths: `./images/{page-name}/filename.ext`
3. Videos go to: `/content/media/{descriptive-name}.mp4`
4. Use descriptive filenames, not hashes
5. Prefer smaller image variants (585x768 over 1170x1536) when available
6. Create the image directory BEFORE writing the content file

## DO NOT modify styles/styles.css — the design system is complete.
```

---

## Why the Original Prompt Failed

The original prompt assumed the automated import pipeline would handle everything.
In reality:
1. The importer only parses blocks that have registered selectors in the import script
2. Section-landing pages had `"blocks": []` in page-templates.json — no mappings
3. The WebImporter `adjustImageUrls` function removes images it can't map locally
4. Videos are never downloaded — only referenced as links
5. News/story cards use unique homepage-only selectors not in the interior script
