/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Base block: cards
 * Source: https://www.psiexams.com/
 * Selector: .elementor-element-12993d7
 * Description: Cards block for feature grid. Displays items in a 2x3 grid,
 *   each with photo, heading, and description.
 * Generated: 2026-05-19
 */
export default function parse(element, { document }) {
  // Each direct child of the e-grid container is a card item
  const cardItems = element.querySelectorAll(':scope > .e-con.e-child');

  const cells = [];

  cardItems.forEach((card) => {
    // Extract image from the image widget
    const image = card.querySelector('.elementor-widget-image img');

    // Extract heading (h3) and description (p) from the text container
    const heading = card.querySelector('h3.elementor-heading-title');
    const description = card.querySelector('p.elementor-heading-title');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) {
      imageCell.appendChild(image);
    }

    // Build text cell with field hint (heading + description combined)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (heading) {
      textCell.appendChild(heading);
    }
    if (description) {
      textCell.appendChild(description);
    }

    // Each card is one row with two columns: image, text
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
