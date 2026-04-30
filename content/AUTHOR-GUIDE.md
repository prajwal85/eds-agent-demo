# UT Austin EDS — Content Authoring Guide

**Project:** University of Texas at Austin  
**Platform:** AEM Edge Delivery Services (xwalk)  
**Date:** April 2026

---

## Overview

This guide covers how to author and publish content for the UT Austin website using AEM Edge Delivery Services. Content is authored via the Universal Editor and published to the EDS CDN.

**Live URLs:**
- Preview: `https://main--eds-agent-demo--prajwal85.aem.page/`
- Live: `https://main--eds-agent-demo--prajwal85.aem.live/`
- Author: `https://author-p11300-e47725.adobeaemcloud.com/`

---

## Available Blocks

### Hero Video
**Purpose:** Full-width background video with headline overlay (homepage only)

| Field | Type | Description |
|-------|------|-------------|
| Poster Image | Reference | Fallback image when video can't play |
| Alt | Text | Image alt text |
| Background Video | Reference | MP4 video file (autoplay, muted, loop) |
| Text | Richtext | Headline text (displays as H1, white, uppercase) |

**Authoring Notes:**
- Video autoplays silently in a loop
- Poster image shows while video loads or on mobile
- Use short, impactful headlines with line breaks

---

### Cards Article
**Purpose:** News story cards in a grid layout (1 prominent + 2 secondary on desktop)

| Field | Type | Description |
|-------|------|-------------|
| Image | Reference | Card image |
| Text | Richtext | Card headline with link |

**Authoring Notes:**
- First card appears large on the right (prominent story)
- Cards 2 and 3 appear smaller on the left with horizontal layout
- Each card should have an image and a linked H3 headline
- Background is burnt orange

---

### Columns Promo
**Purpose:** Two-column promotional section with image and text

| Field | Type | Description |
|-------|------|-------------|
| Column 1 | Image | Promotional image |
| Column 2 | Richtext | Heading + paragraph + CTA link |

**Authoring Notes:**
- Used for mid-page callouts on burnt-orange background
- Keep text concise (1 heading + 1 paragraph + 1 CTA)
- Section-metadata with style "burnt-orange" adds the background

---

### Sticky Panels
**Purpose:** Impact/differentiator section with sticky image and scrolling content

| Field | Type | Description |
|-------|------|-------------|
| Image | Reference | Portrait-orientation image (left side) |
| Alt | Text | Image alt text |
| Content | Richtext | Heading + paragraph + CTA + stats |

**Authoring Notes:**
- On desktop, image sticks on the left while content scrolls on the right
- Use 3 consecutive sticky-panels blocks for the full impact section
- Stats format: `**#1**` followed by label text (e.g., "Public University in Texas")
- Stats animate (fade in) when scrolled into view
- Can also be authored as regular "Columns" blocks — auto-detected by pattern

---

### Columns Outro
**Purpose:** Closing section with text/stats on left and video on right

| Field | Type | Description |
|-------|------|-------------|
| Column 1 | Richtext | Heading + paragraph + CTA + stats |
| Column 2 | Link to MP4 | Video file (auto-converts to autoplay video) |

**Authoring Notes:**
- Place an MP4 link in column 2 — it auto-converts to a looping video
- Stats use bold text: `**18 billion dollars**` followed by label
- Used for the "For Texas, For the Future" outro section

---

### Columns Resource
**Purpose:** Two-column resource link lists

| Field | Type | Description |
|-------|------|-------------|
| Column 1 | Richtext | Heading + link list |
| Column 2 | Richtext | Heading + link list |

**Authoring Notes:**
- Used on resource hub pages (Faculty & Staff, Family & Visitors, Alumni)
- Each column has a heading and a list of links

---

### Hero Banner
**Purpose:** Interior page hero with background image and text overlay

| Field | Type | Description |
|-------|------|-------------|
| Image | Reference | Background image |
| Alt | Text | Image alt text |
| Text | Richtext | Heading + optional description |

**Authoring Notes:**
- Used on section landing pages (About Texas, Energy, Research, etc.)
- Text appears over the image with a dark gradient for readability

---

### Quote
**Purpose:** Testimonial or highlighted quote with attribution

**Authoring Notes:**
- Created automatically from `<blockquote>` content
- First paragraph = quote text
- Lines starting with "—" or "-" = attribution
- Can include author image

---

## Page Templates

| Template | Pages | Description |
|----------|-------|-------------|
| Homepage | 1 | Hero video, news cards, promo, sticky panels, outro |
| Resource Hub | 3 | Quick links grid + two-column resource lists |
| Section Landing | 10 | Hero banner + content sections |
| About Subpage | 4 | Content with two-column layouts |
| Academics Subpage | 3 | Educational content + listings |
| Campus Life Subpage | 10 | Topic content + resources |
| Energy Subpage | 5 | Program details |
| Research Subpage | 3 | Research highlights |
| Policy Page | 8 | Text-heavy compliance content |
| Campus Carry | 2 | Policy details + FAQ |

---

## Publishing Workflow

1. **Edit** content in Universal Editor at the AEM Author instance
2. **Preview** changes at `https://main--eds-agent-demo--prajwal85.aem.page/`
3. **Publish** via AEM Sidekick when ready to go live
4. **Live** site at `https://main--eds-agent-demo--prajwal85.aem.live/`

---

## Brand Guidelines

| Element | Value | Usage |
|---------|-------|-------|
| Primary Color | `#bf5700` (Burnt Orange) | Links, buttons, CTA borders, stats |
| Hover Color | `#9d4700` | Button/link hover states |
| Dark Color | `#333f48` (Charcoal) | Headings, header background |
| Text Color | `#212529` | Body text |
| Button Style | 4px border-radius, burnt-orange border | All CTA buttons |

---

## Metadata

Every page should have metadata configured:

| Field | Description |
|-------|-------------|
| Title | Page title (appears in browser tab) |
| Description | SEO description (appears in search results) |

Add metadata via the metadata block at the bottom of each page.

---

## Media Guidelines

- **Images:** Upload to AEM DAM at `/content/dam/eds-agent-demo/`
- **Videos:** MP4 format, upload to DAM. Reference via DAM path in content.
- **Image sizes:** The system optimizes images automatically via `?width=` parameters
- **Alt text:** Always provide descriptive alt text for accessibility
