/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video. Base: hero. Source: https://www.utexas.edu/
 * Extracts video hero with headline overlay from .block-bundle-utexas-hero-video.
 * Contains nested .block-coresite-homepagehero with headline and background image.
 * xwalk fields: image (reference, collapsed imageAlt), text (richtext)
 */
export default function parse(element, { document }) {
  // Target: .block-coresite-homepagehero which contains headline + background image
  const bgImg = element.querySelector('.homepage-hero__background img, .image-wrapper img, img');
  const headline = element.querySelector('.homepage-hero__headline, h2');

  const cells = [];

  // Row 1: Background image
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  if (bgImg) {
    const img = bgImg.cloneNode(true);
    imgFrag.appendChild(img);
  }
  cells.push([imgFrag]);

  // Row 2: Text content
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (headline) {
    const h1 = document.createElement('h1');
    // Preserve line breaks from <br> tags
    h1.innerHTML = headline.innerHTML.replace(/<br\s*\/?>/gi, '<br>');
    textFrag.appendChild(h1);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
