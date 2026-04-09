/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-featured
 * Base block: columns
 * Source: https://wknd.site/us/en.html
 * Selectors from captured DOM: .teaser.cmp-teaser--featured
 *
 * Columns blocks do NOT require field hints (per xwalk hinting rules).
 *
 * Block library structure: 1 row with 2 columns [image | text content]
 */
export default function parse(element, { document }) {
  // Extract image from featured teaser
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const heading = element.querySelector('.cmp-teaser__title, h2');
  const description = element.querySelector('.cmp-teaser__description');
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  // Build image column
  const imageCol = document.createDocumentFragment();
  if (img) {
    const pic = document.createElement('picture');
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    pic.appendChild(newImg);
    imageCol.appendChild(pic);
  }

  // Build text column
  const textCol = document.createDocumentFragment();
  if (pretitle) {
    const p = document.createElement('p');
    p.textContent = pretitle.textContent.trim();
    textCol.appendChild(p);
  }
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCol.appendChild(h);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCol.appendChild(p);
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textCol.appendChild(p);
  }

  const cells = [[imageCol, textCol]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
