# Lessons Learned — Mistakes & Corrections

This file documents mistakes made during the UT Austin migration so they are never repeated.

---

## Mistake 1: Trusting the Automated Importer Output

**What happened:** After running `import-interior.js` on 5 pages, I reported "migration complete" without verifying the actual content quality. The output had external image URLs, missing sections, and wrong block types.

**Root cause:** Assumed the import pipeline would handle everything end-to-end. In reality, `import-interior.js` only has parsers for `hero-banner` and `columns-resource` — it ignores video heroes, news cards, image grids, and most visual content.

**Lesson:** NEVER report a page as "migrated" after just running the importer. Always:
1. Open the preview and inspect the rendered page
2. Compare against the source page to identify missing content
3. Check image counts (local vs external vs broken)
4. Only report success after manual validation passes

---

## Mistake 2: Not Downloading Images

**What happened:** All 5 pages were imported with images pointing to `https://www.utexas.edu/sites/default/files/...` — external URLs that won't work in production and weren't downloaded locally.

**Root cause:** The WebImporter's `adjustImageUrls` function only remaps images that the scraper already downloaded. Since these pages were imported directly (not scraped first), no local image mapping existed. Images either stayed as external URLs or were removed entirely.

**Lesson:** The importer does NOT download images. After every import:
1. Scrape the source page to identify ALL images
2. Download each image with `curl -sL` to `content/images/{page-name}/`
3. Update the `.plain.html` file to use relative local paths (`./images/{page-name}/...`)
4. Verify zero external URLs remain

---

## Mistake 3: Using Wrong Hero Block Type

**What happened:** Pages like `/energy` and `/medical-center` have video background heroes, but the importer mapped them as plain content (just an `<a>` link to the .mp4 file with "Pause button" text artifact). The video was never embedded properly.

**Root cause:** `import-interior.js` only registers `.block-bundle-utexas-hero` (static image hero). Pages with video heroes use a different DOM pattern (`.block-coresite-homepagehero` with video) that isn't in the parser registry.

**Lesson:** Before importing a page, check the source for video heroes:
- If the page has an `.mp4` link or `.block-coresite-homepagehero` → use `hero-video` block
- If the page has `.block-bundle-utexas-hero` with just an image → use `hero-banner` block
- Download the video file to `content/media/` and reference locally

---

## Mistake 4: Missing News/Story Card Sections

**What happened:** Section-landing pages (energy, medical-center, entrepreneurship) all have "News" sections with image cards at the bottom. These were imported as flat paragraphs without images — losing the visual card grid layout entirely.

**Root cause:** The `cards-article` parser is only registered in `import-homepage.js` — not in `import-interior.js`. The interior script has no selector for `.block-coresite-stories` or story card patterns.

**Lesson:** Most section-landing pages have a news section. After import:
1. Check source for news/story cards
2. Download thumbnail images for each story
3. Manually create `cards-article` block with proper image + headline rows
4. Don't assume the importer caught everything just because block count > 0

---

## Mistake 5: Reporting Success Prematurely

**What happened:** The first import run showed "Success: 5/5, Failures: 0" and I reported the migration as complete. But "success" only means the HTML was generated without errors — it says nothing about content quality or completeness.

**Root cause:** Conflated "importer ran without errors" with "page is properly migrated." The importer will happily output a nearly-empty page with just a heading and call it success.

**Lesson:** Import report success ≠ migration success. The metrics to check are:
- Image count (should match source page)
- Block count (should cover all visual sections)
- Content completeness (compare source vs output)
- Preview rendering (visual inspection)

---

## Mistake 6: Not Scraping Source Pages Before Import

**What happened:** Ran the importer without first understanding what content the source pages actually contained. Only discovered missing images, videos, and sections AFTER the user pointed them out.

**Root cause:** Rushed to execution without reconnaissance. Didn't independently verify what the source pages had before judging the import output.

**Lesson:** ALWAYS scrape/fetch the source page first and create a content inventory:
1. Fetch the source URL
2. List ALL images with URLs and alt text
3. Identify ALL sections (hero, cards, columns, stats, news, events)
4. Note video backgrounds
5. THEN run the importer
6. THEN compare output against inventory to identify gaps

---

## Mistake 7: Leaving Cleanup Artifacts in Content

**What happened:** Imported pages contained "Skip to main content" links, "Breadcrumb" headings with breadcrumb lists, and "Pause button" text from video controls — all Drupal artifacts that should have been stripped.

**Root cause:** The `utexas-cleanup.js` transformer removes header/footer/nav, but doesn't catch all cleanup targets. Some artifacts slip through, especially on pages with different Drupal module structures.

**Lesson:** After fixing content, scan for these common artifacts and remove them:
- `<a href="#main-content">Skip to main content</a>`
- `<h2>Breadcrumb</h2>` + breadcrumb `<ul>`
- "Pause button" text (video control artifact)
- Empty `<div class="columns-resource"><div><div></div><div></div></div></div>` blocks
- Orphaned decorative elements

---

## Mistake 8: Creating CLAUDE.md Before Checking If Instructions File Existed

**What happened:** In the first session continuation, I created a new `CLAUDE.md` file with migration rules before checking that `Instructions.md` already existed with comprehensive documentation. Had to delete it.

**Root cause:** Didn't explore existing files first. Assumed nothing existed.

**Lesson:** ALWAYS check what files already exist before creating new ones:
1. `ls *.md` at project root
2. Read existing instruction/documentation files
3. Update existing files rather than creating duplicates
4. Only create new files when there's a clear distinct purpose

---

## Mistake 9: Not Force-Adding Content Files

**What happened:** The `content/images-batch2.tar.gz` file wasn't showing in `git status` and wasn't being committed, even though it existed on disk.

**Root cause:** `.git/info/exclude` has a rule `/content` that ignores the entire content directory. Normal `git add` skips ignored files silently.

**Lesson:** Content files ALWAYS need `git add -f` (force flag):
```bash
git add -f content/images/
git add -f content/*.plain.html
git add -f content/media/
```
Always verify with `git status` that files appear as staged after adding.

---

## Meta-Lesson: The Validation Mindset

The common thread across all mistakes is **insufficient validation**. The fix is a simple discipline:

> **Never report something as done until you've independently verified the output matches expectations.**

This means:
- Don't trust tool output at face value
- Always compare against the source of truth (the original page)
- Always inspect the rendered result (preview server)
- Always count: images, blocks, sections, links
- When in doubt, scrape the source and compare side-by-side
