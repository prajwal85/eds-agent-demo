/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-service variant.
 * Base block: cards
 * Source: https://www.psiexams.com/
 * Selector: .elementor-element-74cb0d6
 * UE Model: card (fields: image, text)
 * Generated: 2026-05-19
 *
 * Extracts service card items from the source DOM. Each card is an anchor
 * element (a.sd_link-container) containing an icon image, h3 heading,
 * description span, and an arrow link. Outputs a Cards (service) block table
 * with one row per card, two columns: image and text (heading + description + link).
 */
export default function parse(element, { document }) {
  // Select all card items - each is an anchor with class sd_link-container
  const cardItems = element.querySelectorAll('a.sd_link-container');

  const cells = [];

  cardItems.forEach((card) => {
    // Extract the icon image
    const image = card.querySelector('.elementor-widget-image img');

    // Extract the heading (h3)
    const heading = card.querySelector('h3.elementor-heading-title');

    // Extract the description (span.elementor-heading-title within a separate widget)
    const description = card.querySelector('span.elementor-heading-title');

    // Extract the link href from the card anchor itself
    const href = card.getAttribute('href');

    // Build the image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) {
      const imgClone = image.cloneNode(true);
      imageCell.appendChild(imgClone);
    }

    // Build the text cell with field hint (heading + description + link)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }

    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = 'Learn more';
      const linkP = document.createElement('p');
      linkP.appendChild(link);
      textCell.appendChild(linkP);
    }

    // Each card is a row with two columns: [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
