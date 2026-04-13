/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://wknd.site/us/en.html
 * Selectors from captured DOM: .image-list.list
 *
 * UE Model (card):
 *   - image (reference) → image cell
 *   - text (richtext) → text content cell
 *
 * Block library: Each row = 1 card with 2 columns [image | text content]
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-image-list__item, li.cmp-image-list__item');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image-list__item-image img, .cmp-image__image, img');
    const titleEl = item.querySelector('.cmp-image-list__item-title, .cmp-image-list__item-title-link span');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link, a.cmp-image-list__item-title-link');
    const descEl = item.querySelector('.cmp-image-list__item-description, span.cmp-image-list__item-description');

    // Image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const pic = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      pic.appendChild(newImg);
      imageCell.appendChild(pic);
    }

    // Text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (titleLink && titleEl) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(a);
      p.appendChild(strong);
      textCell.appendChild(p);
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
