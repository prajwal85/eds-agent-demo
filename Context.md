# Brand and Style Guidelines

## ETS GRE Brand

### Brand Colors
- **Primary Purple/Magenta**: Used in hero gradient background and GRE branding
- **Dark Navy**: `#1a212b` — Used for dark sections (social connect, newsletter signup)
- **Ivory/Cream**: `#F2E9D8` — Used for text on dark backgrounds, navigation elements
- **White**: Default page background for content sections
- **Light Gray**: Subtle borders and separators

### Typography
- **Headings**: Bold, clean sans-serif font used for section headings and statistics
- **Body Text**: Regular weight sans-serif for descriptions and paragraphs
- **Statistics**: Extra-large heading treatment for percentage numbers (81%, 87%)
- **CTAs**: Mixed case for primary/secondary buttons, uppercase for tertiary links

### CTA Button Styles
- **Primary CTA** (`.e-cta--primary`): Solid filled button (e.g., "Register for GRE")
- **Secondary CTA** (`.e-cta--secondary`): Outlined/ghost button (e.g., "Buy Official GRE Prep")
- **Tertiary CTA** (`.e-cta--tertiary`): Text link with arrow icon (e.g., "Get Free GRE Sample Questions")
- All CTAs use lowercase text style (`.e-cta--lowercase`)

### Layout Patterns
- **Hero**: Full-width purple gradient with overlapping student photos on right, content on left
- **Statistics**: Centered two-column layout with large numbers and supporting text
- **Pathing Cards**: Horizontal row of 5 text-only cards with titles, descriptions, and arrow navigation
- **Ping-Pong Feature**: Alternating text+image layouts (text-left/image-right, then image-left/text-right)
- **Social Connect**: Grid of icon cards on dark background with platform names
- **Newsletter Signup**: Simple CTA banner on dark background

### Section Styling
- Sections with dark backgrounds use `style: "dark"` in section-metadata
- Hero section has its own intrinsic gradient background (no section-metadata needed)
- White/light sections use default styling (no section-metadata)

### Responsive Behavior
- Hero banner stacks vertically on mobile (content above, images below)
- Cards grid wraps to fewer columns on smaller screens
- Ping-pong sections stack vertically on mobile
- Social icons grid wraps to 2-3 columns on mobile

### Accessibility
- All images include descriptive alt text
- Skip-to-content links provided
- Heading hierarchy maintained (H1 for hero, H2 for sections, H3 for card titles)
- Semantic HTML structure with proper landmarks
