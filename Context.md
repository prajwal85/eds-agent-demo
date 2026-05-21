# Brand & Design Context — PSI Exams

## Brand Identity

**Organization:** PSI Services LLC (An ETS Company)
**Source site:** [https://www.psiexams.com/](https://www.psiexams.com/)

---

## Color Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Primary | `#4DD3FE` | `--link-color` | Links, buttons, CTAs, accents |
| Primary Hover | `#3BB8E0` | `--link-hover-color` | Hover states |
| Dark BG | `#0B1A2B` | `--dark-color` | Dark section backgrounds, navy |
| Text Light | `#F2E9D8` | `--text-color` | Body text on dark backgrounds |
| Text Dark | `#1A1A1A` | `--text-color` | Body text on light backgrounds |
| Light BG | `#FFFFFF` | `--light-color` | Light section backgrounds |
| Background | `#0B1A2B` | `--background-color` | Overall dark theme base |

---

## Typography

| Element | Font Family | CSS Variable | Weight |
|---------|-------------|-------------|--------|
| Body | Inter, sans-serif | `--body-font-family` | 400 |
| Headings | Inter, sans-serif | `--heading-font-family` | 600-700 |

---

## Buttons

```css
/* Primary CTA (teal/cyan border) */
background-color: transparent;
border: 2px solid #4DD3FE;
border-radius: 30px;
color: #4DD3FE;
padding: 12px 32px;
text-transform: uppercase;
font-weight: 600;

/* Primary CTA Hover */
background-color: #4DD3FE;
color: #0B1A2B;

/* Secondary (outline, warm tone on dark) */
background-color: transparent;
border: 2px solid #F2E9D8;
border-radius: 30px;
color: #F2E9D8;
```

---

## Layout

| Token | Value |
|-------|-------|
| Max content width | 1200px |
| Mobile breakpoint | < 768px |
| Tablet breakpoint | < 1024px |
| Desktop breakpoint | >= 1024px |
| Nav height | 80px |

---

## Section Styles

| Style | Background | Text Color | Usage |
|-------|-----------|-----------|-------|
| dark | `#0B1A2B` (navy) | `#F2E9D8` (warm white) | Hero, Services, Testimonials, Brands, CTA |
| light/default | `#FFFFFF` | `#1A1A1A` | Features, Knowledge Hub |

---

## Image Rules

- Max width: 100%, height: auto
- Card images: 393x300 aspect ratio for features
- Service icons: 129x129 (small square icons)
- Testimonial images: Square portrait photos
- Hero: Full-width background image with dark overlay
- Brand logos: Transparent PNG, constrained height

---

## Animation & Interaction

- Hero heading: Rotating/animated text ("the best test day" / "the best test partner" / "PSI")
- Carousels: Slick slider with navigation arrows
- Cards: Hover effects with subtle color transitions
- CTAs: Border and fill color transition on hover

---

## DO NOT Modify

`styles/styles.css` is frozen once design is complete.
Block-level CSS changes only: `blocks/{name}/{name}.css`
