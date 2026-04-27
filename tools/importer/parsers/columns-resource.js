/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-resource. Base: columns. Source: https://www.utexas.edu/faculty-and-staff-resources
 * Extracts two-column resource link layouts from .utexas-layout--twocol-wrapper containers.
 * Each wrapper has layout__region--first and layout__region--second with headings + link lists.
 * Columns blocks: NO field hints per xwalk rules.
 */
export default function parse(element, { document }) {
  const firstRegion = element.querySelector('.layout__region--first');
  const secondRegion = element.querySelector('.layout__region--second');

  if (!firstRegion && !secondRegion) return;

  /**
   * Extract heading and links from a region
   */
  function extractRegionContent(region) {
    if (!region) return document.createDocumentFragment();
    const frag = document.createDocumentFragment();

    // Get heading (h2)
    const heading = region.querySelector('.ut-headline--xl, h2');
    if (heading && heading.textContent.trim()) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      frag.appendChild(h);
    }

    // Check for quick-links with icon grid
    const quickLinks = region.querySelector('.utexas-quick-links');
    if (quickLinks) {
      const qlHeading = quickLinks.querySelector('.ut-headline, h3');
      if (qlHeading && qlHeading.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = qlHeading.textContent.trim();
        frag.appendChild(h3);
      }
      // Quick links grid items: .quickLinks-grid-item with img + p label
      const gridItems = quickLinks.querySelectorAll('.quickLinks-grid-item');
      gridItems.forEach((item) => {
        const img = item.querySelector('img');
        const label = item.querySelector('p');
        if (label && label.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = label.textContent.trim();
          frag.appendChild(p);
        }
      });
      // Also check for actual link-list items
      const linkItems = quickLinks.querySelectorAll('.link-list li a');
      linkItems.forEach((link) => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        frag.appendChild(p);
      });
      return frag;
    }

    // Check for hero image
    const img = region.querySelector('.ut-img--fluid, .ut-flex-content-area img');
    if (img) {
      frag.appendChild(img.cloneNode(true));
    }

    // Get standard link lists
    const links = region.querySelectorAll('.link-list li a, ul li a.ut-link');
    links.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      frag.appendChild(p);
    });

    return frag;
  }

  const col1 = extractRegionContent(firstRegion);
  const col2 = extractRegionContent(secondRegion);

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-resource', cells });
  element.replaceWith(block);
}
