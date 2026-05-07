# Brand & Design Context — UT Austin EDS

## Brand Identity

**Institution:** The University of Texas at Austin
**Tagline:** "What Starts Here Changes the World"
**Source site:** https://www.utexas.edu
**Source CMS:** Drupal 11 with `coresite/coretheme` theme

---

## Color Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Burnt Orange | `#bf5700` | `--link-color`, `--burnt-orange` | Links, buttons, CTAs, card backgrounds, accent lines |
| Burnt Orange Hover | `#9d4700` | `--link-hover-color` | Link/button hover state |
| Charcoal | `#333f48` | `--dark-color`, `--heading-color`, `--charcoal` | Headings, dark backgrounds |
| Dark Gray | `#212529` | `--text-color` | Body text |
| Light Gray | `#f8f8f8` | `--light-color` | Section backgrounds (highlight) |
| Cream | `#ebe7e1` | `--overlay-background-color` | Overlay backgrounds |
| White | `#ffffff` | `--background-color` | Page background, button text |

### Color Rules
- Primary CTA buttons: burnt orange background, white text
- Secondary buttons: transparent background, burnt orange border + text
- Links: burnt orange, no underline (underline on hover)
- Headings: charcoal (NOT black)
- Body text: dark gray (NOT pure black)
- Never use default EDS blue (`#3b63fb`) — always override with burnt orange

---

## Typography

| Element | Font Family | CSS Variable | Weight |
|---------|-------------|-------------|--------|
| Body | Roboto | `--body-font-family` | 400 (Regular) |
| Headings | Roboto Condensed | `--heading-font-family` | 600 (SemiBold) |

### Font Sizes (Desktop / Mobile)

| Level | Desktop | Mobile | CSS Variable |
|-------|---------|--------|-------------|
| H1 | 45px | 55px | `--heading-font-size-xxl` |
| H2 | 36px | 44px | `--heading-font-size-xl` |
| H3 | 28px | 34px | `--heading-font-size-l` |
| H4 | 22px | 27px | `--heading-font-size-m` |
| H5 | 20px | 24px | `--heading-font-size-s` |
| H6 | 18px | 22px | `--heading-font-size-xs` |
| Body | 18px | 22px | `--body-font-size-m` |
| Small | 16px | 19px | `--body-font-size-s` |

### Typography Rules
- Line height: 1.6 for body, 1.25 for headings
- Heading margin: 0.8em top, 0.25em bottom
- Scroll margin: 40px (for anchor links)
- Fallback fonts: Arial-based metrics (`roboto-fallback`, `roboto-condensed-fallback`)

---

## Buttons & Links

### Primary Button
```css
background-color: var(--link-color);     /* #bf5700 */
border: 2px solid var(--link-color);
border-radius: 4px;                       /* Square corners, NOT pill */
padding: 0.5em 1.2em;
color: white;
font-weight: 500;
```

### Secondary Button
```css
background-color: transparent;
border: 2px solid currentcolor;
color: var(--text-color);
```

### Button Rules
- Border-radius: `4px` (NEVER `2.4em` pill shape)
- Hover: darker burnt orange (`#9d4700`)
- Display: inline-block, max-width: 100%
- Text: no-wrap, overflow ellipsis

---

## Layout & Spacing

| Token | Value |
|-------|-------|
| Max content width | 1200px |
| Section margin | 40px 0 |
| Content padding (mobile) | 0 24px |
| Content padding (desktop) | 0 32px |
| Nav height | 64px |
| Breadcrumbs height | 34px |

### Section Rules
- First section: no top margin (flush with header)
- `.section.light` / `.section.highlight`: light gray background, extra padding
- Section metadata with `style: burnt-orange` → dark burnt-orange background

---

## Image Rules

| Rule | Value |
|------|-------|
| Max width | 100% |
| Height | auto (maintain aspect ratio) |
| Border radius | 0 (NO circular cropping) |
| Display | block, full-width |

### Critical Fix (EDS Boilerplate Override)
The default EDS boilerplate had:
```css
main p > img:only-child { border-radius: 50%; width: 200px; height: 200px; }
```
This was changed to:
```css
main p > img:only-child { width: 100%; height: auto; display: block; }
```

---

## Block Visual Patterns

### Hero Video
- Full-viewport video background (autoplay, muted, loop)
- Large white headline overlay with text shadow
- Dark gradient overlay for readability

### Hero Banner
- Full-width background image
- White heading text on dark overlay
- Min-height: 300px

### Cards Article
- Burnt orange (`#bf5700`) card backgrounds
- White text on cards
- Desktop: 2-column grid (1 prominent right, 2 stacked left)
- Images: object-fit cover, full bleed

### Columns Resource
- Side-by-side columns (50/50) at desktop
- Stacked on mobile
- Headings + link lists per column

### Sticky Panels
- Desktop: 40% sticky image left, 60% scrolling content right
- Stats: large burnt-orange numbers (2.5-3.5rem, weight 900)
- IntersectionObserver fade-in animation on stats
- CTA: outlined button (burnt-orange border, transparent bg)

### Quote Block
- Standard blockquote styling
- Attribution on separate line

---

## Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| `< 900px` | Mobile (stacked layouts, larger font sizes) |
| `≥ 900px` | Desktop (side-by-side layouts, smaller font sizes) |
| `≥ 1200px` | Wide desktop (extra padding on sticky panels) |

---

## DO NOT Modify

The file `styles/styles.css` is frozen. All design tokens above are already implemented.
Any visual changes should be made in individual block CSS files (`blocks/{name}/{name}.css`),
not in the global stylesheet.
