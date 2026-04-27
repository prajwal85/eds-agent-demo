/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero. Source: https://www.utexas.edu/about-texas
 * Extracts hero banner with heading + text overlay on background image.
 * Selectors from captured DOM: .block-bundle-utexas-hero .ut-hero
 * xwalk fields: image (reference, collapsed imageAlt), text (richtext)
 */
export default function parse(element, { document }) {
  // Background image from hero
  const bgImg = element.querySelector('.ut-hero img, .hero--half-n-half img, picture img');

  // Text content from hero overlay
  const heading = element.querySelector('.ut-hero h2, .ut-hero h1, .hero-title');
  const description = element.querySelector('.ut-hero p, .hero-text p');

  const cells = [];

  // Row 1: Background image
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  if (bgImg) {
    imgFrag.appendChild(bgImg.cloneNode(true));
  }
  cells.push([imgFrag]);

  // Row 2: Text content
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textFrag.appendChild(h1);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
