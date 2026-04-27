/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns. Source: https://www.utexas.edu/
 * Extracts mid-page promotional callout: image left, heading + text + CTA right.
 * Selectors from captured DOM: #block-coretheme-homepagemidpagepromo .mid-page-bkgd
 * Columns blocks: NO field hints per xwalk rules.
 */
export default function parse(element, { document }) {
  // Found in DOM: .mid-page-bkgd .row with .col-12.col-md-4 (image) and .col-12.col-md-8 (content)
  const img = element.querySelector('.mid-page-bkgd img, .ut-copy img');
  const heading = element.querySelector('h2');
  const paragraphs = element.querySelectorAll('.mid-page-bkgd p:not(:last-child), .col-12.col-md-8 > p:not(:last-child)');
  const cta = element.querySelector('a.ut-btn, a.ut-cta-link--angle-right');

  // Column 1: Image
  const col1 = document.createDocumentFragment();
  if (img) {
    col1.appendChild(img.cloneNode(true));
  }

  // Column 2: Heading + paragraph + CTA
  const col2 = document.createDocumentFragment();
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col2.appendChild(h2);
  }
  paragraphs.forEach((p) => {
    if (!p.querySelector('a.ut-btn, a.ut-cta-link--angle-right')) {
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      col2.appendChild(para);
    }
  });
  if (cta) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    p.appendChild(link);
    col2.appendChild(p);
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
