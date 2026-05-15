# Migration Instructions

## Migration Rules

### General Rules
- Always use the `excat-site-migration` orchestrator for multi-step migrations
- Validate import infrastructure before running content imports
- Use template-specific import scripts (`import-<templateName>.js`), never generic `import.js`
- Bundle import scripts before execution using `aem-import-bundle.sh`
- All block variant names must be kebab-case
- Section-metadata blocks are only needed for sections with non-default backgrounds

### Block Usage Rules
- **hero-landing**: Full-width hero with background image, logo, headline (H1), and CTA buttons. Use for landing page hero banners with brand imagery.
- **columns-stats**: Two-column layout for displaying large statistics side-by-side. Each column contains a stat number (H2) and description paragraph.
- **cards-pathing**: Text-only navigation cards without images. Each card has a bold linked title and description. Image field left empty with field hint.
- **columns-feature**: Two-column text+image layout (ping-pong pattern). Handles both text-left/image-right and image-left/text-right orientations.
- **cards-social**: Social media icon cards with platform icon image and linked platform name heading. Used inside dark-styled sections.

### Validation Rules
- No external image/video URLs in final content (images should reference DAM paths)
- No broken media references
- Correct EDS block structure with proper table markup
- Consistent reusable blocks across templates
- Preview output should closely match source layout and content
- All parsers must pass syntax validation before import

### Coding Standards
- Parsers must export a default function: `export default function parse(element, { document, url, params })`
- Transformers must export a default function with hook pattern: `export default function transform(hookName, element, payload)`
- xwalk projects require field hint comments (`<!-- field:image -->`, `<!-- field:text -->`) in parser output
- Use `document.createDocumentFragment()` for grouping multiple elements into a single cell

## Migration Learnings

### ETS GRE Migration (2026-05-14)
1. **Chatbot cleanup**: The ETS site has a chatbot widget (Anita) that persists in the DOM. The cleanup transformer should explicitly target `.chatbot-dynamic-data` and related chatbot elements. Some chatbot elements may survive initial cleanup if they are injected after DOM load.
2. **Footer content rescue**: The newsletter signup banner (`.formBanner`) is nested inside the `<footer>` element. The cleanup transformer must rescue this content before removing the footer.
3. **Experience fragment handling**: Social media links are inside an AEM Experience Fragment (`.cmp-experiencefragment--social-following`). Selectors must target content within these fragments.
4. **Ping-pong card orientation**: The `columns-feature` parser must detect `c-ping-pong-card--left` vs `c-ping-pong-card--right` classes to determine column order (text-first vs image-first).
5. **Base64 SVG images**: Navigation icons use inline base64-encoded SVGs. These generate `atob` errors during import but don't affect content quality since they are removed by the cleanup transformer.
6. **Section boundaries**: Use AEM Grid column classes (`.aem-GridColumn`) as section boundary selectors since the source uses AEM's responsive grid system.
7. **Embed HTML containers**: `.embedOpenHtml` wrappers should be unwrapped (children moved out) rather than removed, as they contain legitimate content blocks like the stat breaker module.

## Template Mappings

| Template Name | Source URL Pattern | Blocks Used |
|---|---|---|
| gre-landing-page | /gre.html | hero-landing, columns-stats, cards-pathing, columns-feature, cards-social |

## Block Details

### New Blocks Created

| Block Name | Base Block | Description | Files |
|---|---|---|---|
| hero-landing | hero | Landing page hero with logo, H1, CTAs, and student photos | hero-landing.js, hero-landing.css, _hero-landing.json |
| columns-stats | columns | Statistics display with two large percentage numbers | columns-stats.js, columns-stats.css, _columns-stats.json |
| cards-pathing | cards | Text-only navigation cards with linked titles | cards-pathing.js, cards-pathing.css, _cards-pathing.json |
| columns-feature | columns | Text+image ping-pong layout (both orientations) | columns-feature.js, columns-feature.css, _columns-feature.json |
| cards-social | cards | Social media icon cards with platform links | cards-social.js, cards-social.css, _cards-social.json |

## Known Issues

1. **Chatbot content in Section 7**: Some chatbot widget elements (Anita virtual assistant) leak into the newsletter signup section. A more aggressive cleanup selector may be needed for the chatbot overlay.
2. **Internal AEM paths in CTAs**: Some CTA links in the columns-feature blocks use internal AEM paths (e.g., `/content/ets-org/language-master/en/home/...`) instead of clean external URLs. These need URL rewriting during or after import.
3. **Base64 image decode errors**: The importer logs `atob` errors for base64-encoded SVG icons in the navigation. These are cosmetic errors and don't affect imported content.
