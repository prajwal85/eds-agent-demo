/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-adventure
 * Base block: hero
 * Source: https://wknd.site/us/en.html
 * Selectors from captured DOM: .teaser.cmp-teaser--hero.cmp-teaser--imagebottom
 *
 * UE Model (hero-adventure):
 *   - image (reference) → image row (collapsed: imageAlt)
 *   - text (richtext) → text content row
 *
 * Block library structure: 1 column, row 1 = image, row 2 = text content (heading, description, CTA)
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
  const heading = element.querySelector('.cmp-teaser__title, h2');
  const description = element.querySelector('.cmp-teaser__description');
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  // Row 1: Image with field hint
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

  // Row 2: Text content with field hint
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.appendChild(h);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCell.appendChild(p);
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }

  const cells = [[imageCell], [textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-adventure', cells });
  element.replaceWith(block);
}
