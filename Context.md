# Brand & Design Context — ETS

## Brand Identity

**Organization:** ETS
**Source site:** [https://www.ets.org/gre.html]

---

## Color Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Primary | `#______` | `--link-color` | Links, buttons, CTAs |
| Primary Hover | `#______` | `--link-hover-color` | Hover states |
| Dark | `#______` | `--heading-color` | Headings |
| Text | `#______` | `--text-color` | Body text |
| Light BG | `#______` | `--light-color` | Section backgrounds |
| Background | `#ffffff` | `--background-color` | Page background |

---

## Typography

| Element | Font Family | CSS Variable | Weight |
|---------|-------------|-------------|--------|
| Body | | `--body-font-family` | 400 |
| Headings | | `--heading-font-family` | 600 |

---

## Buttons

```css
/* Primary */
background-color: var(--link-color);
border: 2px solid var(--link-color);
border-radius: 4px;
color: white;

/* Secondary */
background-color: transparent;
border: 2px solid currentcolor;
```

---

## Layout

| Token | Value |
|-------|-------|
| Max content width | 1200px |
| Mobile breakpoint | < 900px |
| Desktop breakpoint | ≥ 900px |
| Nav height | px |

---

## Image Rules

- Max width: 100%, height: auto
- No circular cropping (override EDS default if needed)
- Full-width display

---

## DO NOT Modify

`styles/styles.css` is frozen once design is complete.
Block-level CSS changes only: `blocks/{name}/{name}.css`
