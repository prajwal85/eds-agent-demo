/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards. Source: https://www.utexas.edu/
 * Extracts news story cards from university-stories section.
 * Selectors from captured DOM: .block-coresite-stories .university-stories
 * xwalk fields per card: image (reference, collapsed imageAlt), text (richtext)
 * Container block: each card = 1 row with 2 columns (image | text)
 */
export default function parse(element, { document }) {
  // Find all story card links
  // Found in DOM: .university-stories__linked-box containing .card elements
  const cardLinks = element.querySelectorAll('.university-stories__linked-box');

  const cells = [];

  cardLinks.forEach((cardLink) => {
    const img = cardLink.querySelector('.image-wrapper img');
    const headline = cardLink.querySelector('.headline, .content-wrapper .headline');
    const href = cardLink.getAttribute('href');

    // Column 1: Image (with field hint)
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      imgFrag.appendChild(img.cloneNode(true));
    }

    // Column 2: Text content (with field hint)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (headline) {
      const h3 = document.createElement('h3');
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = headline.textContent.trim();
        h3.appendChild(link);
      } else {
        h3.textContent = headline.textContent.trim();
      }
      textFrag.appendChild(h3);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
