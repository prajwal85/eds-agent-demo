# UT Austin Full Site Migration Plan

## Source Site
**URL:** https://www.utexas.edu  
**Total Pages:** 48  
**Migration Type:** Full site migration to AEM Edge Delivery Services  
**Project Action:** Replace existing WKND project data

---

## URL Inventory (48 pages)

### Top-Level Pages (10)
| # | Page | URL |
|---|------|-----|
| 1 | Homepage | https://www.utexas.edu/ |
| 2 | Faculty & Staff Resources | https://www.utexas.edu/faculty-and-staff-resources |
| 3 | Family & Visitor Resources | https://www.utexas.edu/family-and-visitor-resources |
| 4 | Alumni Resources | https://www.utexas.edu/alumni-resources |
| 5 | Apply | https://www.utexas.edu/apply |
| 6 | About Texas | https://www.utexas.edu/about-texas |
| 7 | Contact Us | https://www.utexas.edu/contact-us |
| 8 | Jobs | https://www.utexas.edu/jobs |
| 9 | Impact on Texas | https://www.utexas.edu/impact-on-texas |
| 10 | Military | https://www.utexas.edu/military |

### Academics Section (3)
| # | Page | URL |
|---|------|-----|
| 11 | Academic Experience | https://www.utexas.edu/academics/academic-experience |
| 12 | Areas of Study | https://www.utexas.edu/academics/areas-of-study |
| 13 | Academic Integrity Statement | https://www.utexas.edu/academics/texas-statement-academic-integrity |

### Campus Life Section (9)
| # | Page | URL |
|---|------|-----|
| 14 | Arts & Culture | https://www.utexas.edu/campus-life/arts-and-culture |
| 15 | Campus Destinations | https://www.utexas.edu/campus-life/campus-destinations |
| 16 | Health & Wellbeing | https://www.utexas.edu/campus-life/health-and-wellbeing |
| 17 | Housing & Dining | https://www.utexas.edu/campus-life/housing-and-dining |
| 18 | Life in Austin | https://www.utexas.edu/campus-life/life-in-austin |
| 19 | Report Misconduct | https://www.utexas.edu/campus-life/report-misconduct |
| 20 | Safety & Security | https://www.utexas.edu/campus-life/safety-and-security |
| 21 | Student Involvement | https://www.utexas.edu/campus-life/student-involvement |
| 22 | Health & Wellness (redirect?) | https://www.utexas.edu/campus-life/health-and-wellness |

### Health & Wellbeing Sub-pages (2)
| # | Page | URL |
|---|------|-----|
| 23 | Health - Faculty & Staff | https://www.utexas.edu/campus-life/health-and-wellbeing/health-faculty-staff |
| 24 | Health - Campuswide Resources | https://www.utexas.edu/campus-life/health-and-wellbeing/health-campuswide-resources |

### Research Section (4)
| # | Page | URL |
|---|------|-----|
| 25 | Research | https://www.utexas.edu/research |
| 26 | Research Overview | https://www.utexas.edu/research/overview |
| 27 | Student Research | https://www.utexas.edu/research/student-research |
| 28 | Medical Center (Research) | https://www.utexas.edu/research/medical-center |

### Energy Section (5)
| # | Page | URL |
|---|------|-----|
| 29 | Energy | https://www.utexas.edu/energy |
| 30 | Science & Engineering | https://www.utexas.edu/energy/science-engineering |
| 31 | Business & Economy | https://www.utexas.edu/energy/business-economy |
| 32 | Law & Policy | https://www.utexas.edu/energy/law-policy |
| 33 | Education | https://www.utexas.edu/energy/education |
| 34 | Get Involved | https://www.utexas.edu/energy/get-involved |

### About Section (4)
| # | Page | URL |
|---|------|-----|
| 35 | Facts & Figures | https://www.utexas.edu/about/facts-and-figures |
| 36 | Longhorn Traditions | https://www.utexas.edu/about/longhorn-traditions |
| 37 | Leadership | https://www.utexas.edu/about/leadership |
| 38 | Mission & Values | https://www.utexas.edu/about/mission-and-values |

### Entrepreneurship & Medical (2)
| # | Page | URL |
|---|------|-----|
| 39 | Entrepreneurship | https://www.utexas.edu/entrepreneurship |
| 40 | Medical Center | https://www.utexas.edu/medical-center |

### Policy & Compliance Pages (8)
| # | Page | URL |
|---|------|-----|
| 41 | Policies & Reporting | https://www.utexas.edu/policies-and-reporting |
| 42 | Site Policies | https://www.utexas.edu/site-policies |
| 43 | State & System Resources | https://www.utexas.edu/state-and-system-resources |
| 44 | University Honor Code | https://www.utexas.edu/university-honor-code |
| 45 | Campus Carry | https://www.utexas.edu/campus-carry |
| 46 | Campus Carry - Appeals Process | https://www.utexas.edu/campus-carry/appeals-process |
| 47 | Campus Carry - FAQs | https://www.utexas.edu/campus-carry/faqs |
| 48 | Fraud, Waste, or Abuse | https://www.utexas.edu/fraud-waste-or-abuse |
| 49 | Compact with Texans | https://www.utexas.edu/compact-with-texans |

---

## Migration Strategy

### Phase 1: Site Analysis & Template Discovery
Scrape and analyze all 48 URLs to identify common page layouts and group them into reusable templates. This phase uses the `excat-site-migration` skill to orchestrate:

1. **Clear existing WKND project data** — Reset page-templates.json and migration artifacts
2. **Site-level analysis** — Crawl all 48 URLs, classify into template groups
3. **Page-level analysis** — Deep-dive into one representative page per template to map blocks and sections

### Phase 2: Block Mapping & Variant Management
For each discovered template:

1. **Identify blocks** — Map DOM sections to EDS block types (hero, cards, columns, accordion, tabs, etc.)
2. **Detect reusable patterns** — Find common components across templates (e.g., shared hero patterns, card grids)
3. **Create block variants** — Generate custom variants where UT Austin's design diverges from base blocks
4. **Update metadata.json** — Track all variant decisions for consistency

### Phase 3: Import Infrastructure
Build the import pipeline:

1. **Block parsers** — One parser per unique block mapping (extracts content from source DOM)
2. **Page transformers** — One transformer per template (orchestrates section/block assembly)
3. **Import scripts** — Bundled scripts that combine parsers + transformers for execution

### Phase 4: Content Migration
Execute the import for all 48 pages:

1. **Run imports per template** — Process pages grouped by template for consistency
2. **Generate HTML content** — Output EDS-compatible `.plain.html` files
3. **Verify content** — Preview each page locally and validate block rendering

### Phase 5: Design System & Navigation
1. **Extract design tokens** — Colors, typography, spacing from utexas.edu
2. **Map to CSS custom properties** — Adapt to EDS styles framework
3. **Build navigation** — Extract and migrate nav structure (header/footer)

---

## Expected Template Groups (preliminary estimate)

Based on URL patterns, likely templates include:

| # | Likely Template | Expected Pages | URL Pattern |
|---|----------------|----------------|-------------|
| 1 | Homepage | 1 | `/` |
| 2 | Resource Hub | 3 | `/faculty-and-staff-resources`, `/family-and-visitor-resources`, `/alumni-resources` |
| 3 | Section Landing | ~8 | `/about-texas`, `/apply`, `/research`, `/energy`, etc. |
| 4 | Content Sub-page | ~20 | `/academics/*`, `/campus-life/*`, `/about/*`, `/energy/*` |
| 5 | Policy/Text Page | ~8 | `/policies-and-reporting`, `/site-policies`, `/campus-carry/*` |
| 6 | FAQ Page | ~2 | `/campus-carry/faqs`, possibly others |
| 7 | Contact/Info Page | ~3 | `/contact-us`, `/jobs`, `/compact-with-texans` |

> **Note:** Actual template groupings will be determined during Phase 1 analysis.

---

## Checklist

### Phase 1: Site Analysis & Template Discovery
- [ ] Clear existing WKND project data (page-templates.json, reports, content)
- [ ] Run site-level analysis on all 48 URLs
- [ ] Classify URLs into template groups
- [ ] Analyze one representative page per template (deep block/section mapping)
- [ ] Finalize page-templates.json with all templates and block mappings

### Phase 2: Block Mapping & Variant Management
- [ ] Map blocks for each template
- [ ] Identify shared patterns across templates
- [ ] Create custom block variants as needed
- [ ] Update metadata.json with variant tracking

### Phase 3: Import Infrastructure
- [ ] Generate block parsers for all mapped blocks
- [ ] Generate page transformers for each template
- [ ] Bundle import scripts per template
- [ ] Test import scripts on representative pages

### Phase 4: Content Migration
- [ ] Import homepage
- [ ] Import resource hub pages (3)
- [ ] Import section landing pages (~8)
- [ ] Import content sub-pages (~20)
- [ ] Import policy/text pages (~8)
- [ ] Import FAQ pages (~2)
- [ ] Import contact/info pages (~3)
- [ ] Verify all 48 pages render correctly in local preview

### Phase 5: Design System & Navigation
- [ ] Extract design tokens from utexas.edu
- [ ] Map tokens to EDS CSS custom properties
- [ ] Migrate navigation structure (header)
- [ ] Migrate footer
- [ ] Final visual QA pass across all pages

---

> **Execution:** This plan requires exiting Plan mode. The migration will use the `excat:excat-site-migration` skill to orchestrate all phases. Switch to Execute mode to begin.
