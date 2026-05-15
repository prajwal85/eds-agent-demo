/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature variant.
 * Base block: columns
 * Source: https://www.ets.org/gre.html
 * Generated: 2026-05-14
 *
 * Handles two orientations of the ping-pong card layout:
 * - c-ping-pong-card--left: text content on left, image on right
 * - c-ping-pong-card--right: image on left, text content on right
 *
 * Target structure (from block library):
 *   | Columns |
 *   |---|---|
 *   | Text content with CTA | Image |
 *
 * xwalk note: Columns blocks do NOT require field hint comments.
 */
export default function parse(element, { document }) {
  // Determine orientation: --left means text is on the left, --right means text is on the right
  const isTextLeft = element.classList.contains('c-ping-pong-card--left');

  // Extract text content elements
  const heading = element.querySelector('.c-ping-pong-card__content h2, .c-ping-pong-card__content h3');
  const description = element.querySelector('.c-ping-pong-card__description p, .c-ping-pong-card__description');
  const ctaLinks = Array.from(element.querySelectorAll('.c-ping-pong-card__cta-group a.e-cta, .c-ping-pong-card__cta-group a'));

  // Build text content cell
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  if (ctaLinks.length > 0) textCell.push(...ctaLinks);

  // Extract image
  const image = element.querySelector('.c-ping-pong-card__media-wrapper img');

  // Build image cell
  const imageCell = [];
  if (image) imageCell.push(image);

  // Arrange columns based on orientation (left visual first, right visual second)
  let cells;
  if (isTextLeft) {
    // Text left, image right
    cells = [[textCell, imageCell]];
  } else {
    // Image left, text right
    cells = [[imageCell, textCell]];
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
