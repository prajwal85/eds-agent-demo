/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-social variant.
 * Base block: cards
 * Source: https://www.ets.org/gre.html
 * Selector: .sociallinks .cmp-socialteaser
 * Generated: 2026-05-14
 *
 * Source DOM structure (per .cmp-socialteaser):
 *   .cmp-teaser
 *     a.cmp-teaser__link[href]
 *       .cmp-teaser__content > h2.cmp-teaser__title  (platform name)
 *       .cmp-teaser__image > .cmp-image > figure > img.cmp-image__image  (icon)
 *
 * UE Model fields (per card item):
 *   - image (reference): social media icon
 *   - text (richtext): platform name as linked heading
 *
 * Target table: one row per social card
 *   Cell 1 = icon image
 *   Cell 2 = platform name heading wrapped in link
 */
export default function parse(element, { document }) {
  // The element is a single .cmp-socialteaser container.
  // Each call to this parser handles one social teaser card.
  // The importer framework calls this once per matched element.

  // Extract the link element
  const link = element.querySelector('.cmp-teaser__link, a[class*="teaser__link"]');
  const href = link ? link.getAttribute('href') : '';

  // Extract the icon image
  const img = element.querySelector('.cmp-image__image, img[class*="image__image"]');

  // Extract the platform title
  const title = element.querySelector('.cmp-teaser__title, h2[class*="teaser__title"]');

  // Build the text cell: platform name as a linked heading
  // UE model field: text (richtext) - combine heading + link
  const textCell = [];
  if (title && href) {
    // Create a linked heading: wrap the title text in a link
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = title.textContent.trim();
    const h2 = document.createElement('h2');
    h2.appendChild(a);
    textCell.push(h2);
  } else if (title) {
    textCell.push(title);
  }

  // Build cells array: each card is one row with [image, text]
  const cells = [];

  // Image cell (UE model field: image)
  if (img) {
    cells.push([img, textCell]);
  } else {
    cells.push(['', textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-social', cells });
  element.replaceWith(block);
}
