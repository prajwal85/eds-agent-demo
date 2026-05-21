/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-brand
 * Base block: columns
 * Selector: .elementor-element-6c5b94e8
 * Description: Columns block for brand showcase. Two items side-by-side,
 *   each with a brand logo image (linked), heading, and description paragraph.
 * Project type: xwalk (Columns blocks do NOT require field hints per hinting rules)
 * Generated: 2026-05-19
 */
export default function parse(element, { document }) {
  // Find the two child brand containers (direct e-child containers within e-con-inner)
  const inner = element.querySelector(':scope > .e-con-inner');
  const brandContainers = inner
    ? Array.from(inner.querySelectorAll(':scope > .e-con.e-child'))
    : Array.from(element.querySelectorAll(':scope > .e-con.e-child'));

  // Build one cell per brand column
  const cellsRow = brandContainers.map((container) => {
    const cellContent = [];

    // Extract linked logo image
    const imageWidget = container.querySelector('.elementor-widget-image');
    if (imageWidget) {
      const link = imageWidget.querySelector('a');
      const img = imageWidget.querySelector('img');
      if (link && img) {
        // Clone the link with the image inside for proper link+image semantics
        const linkClone = link.cloneNode(false);
        const imgClone = img.cloneNode(false);
        linkClone.appendChild(imgClone);
        cellContent.push(linkClone);
      } else if (img) {
        cellContent.push(img.cloneNode(false));
      }
    }

    // Extract h3 heading
    const heading = container.querySelector('h3.elementor-heading-title, h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      cellContent.push(h3);
    }

    // Extract description paragraph
    const description = container.querySelector('p.elementor-heading-title, p');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      cellContent.push(p);
    }

    return cellContent;
  });

  // Build cells array: single row with N columns (one per brand)
  // Structure matches library example: | col1 content | col2 content |
  const cells = [cellsRow];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-brand', cells });
  element.replaceWith(block);
}
