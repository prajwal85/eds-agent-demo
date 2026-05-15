/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-pathing
 * Base block: cards
 * Source: https://www.ets.org/gre.html
 * Selector: .subProductCardPathingModule .c-sub-product-pathing
 * Generated: 2026-05-14
 *
 * Extracts 5 text-only navigation cards from the GRE pathing section.
 * Each card has a linked title, description, and arrow CTA.
 * No images on cards -- image cell is left empty.
 *
 * UE Model: container block (cards > card items)
 *   card fields: image (reference), text (richtext)
 *   Each card = one row with [image, text] columns.
 */
export default function parse(element, { document }) {
  // Select all card items from the pathing grid
  const cards = element.querySelectorAll('.c-sub-product-pathing__card, .c-sub-product-card');
  // Deduplicate: prefer the outer .c-sub-product-pathing__card (li) elements
  const cardItems = element.querySelectorAll('.c-sub-product-pathing__card');
  const cardList = cardItems.length > 0
    ? Array.from(cardItems)
    : Array.from(element.querySelectorAll('.c-sub-product-card'));

  const cells = [];

  cardList.forEach((card) => {
    // Extract title link (h3 > a)
    const titleLink = card.querySelector('.c-sub-product-card__link, .c-sub-product-card__title a, h3 a');
    // Extract description paragraph
    const description = card.querySelector('.c-sub-product-card__description, .c-sub-product-card__text-container p');

    // Build the text cell content with field hint
    // xwalk: image field is empty (no images), text field gets title + description + link
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Add title as a bold heading element
    if (titleLink) {
      const heading = document.createElement('p');
      const strong = document.createElement('strong');
      const link = document.createElement('a');
      link.href = titleLink.href || titleLink.getAttribute('href') || '';
      link.textContent = titleLink.textContent.trim();
      strong.appendChild(link);
      heading.appendChild(strong);
      textCell.appendChild(heading);
    }

    // Add description paragraph
    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      textCell.appendChild(descP);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pathing', cells });
  element.replaceWith(block);
}
