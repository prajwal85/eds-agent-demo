/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-outro. Base: columns. Source: https://www.utexas.edu/
 * Extracts outro section: heading + text + CTA + stats left, video right.
 * Selectors from captured DOM: .block-homepage-outro .utexas-ut-outro
 * Columns blocks: NO field hints per xwalk rules.
 */
export default function parse(element, { document }) {
  // Found in DOM: .utexas-ut-outro with .col-md-7 (content) and .col-md-5 (video)
  const heading = element.querySelector('.section-title, h2');
  const description = element.querySelector('.container .row .col-md-7 > p, .utexas-ut-outro > .container p');
  const cta = element.querySelector('a.ut-btn--secondary, a.ut-cta-link--angle-right');
  const stats = element.querySelectorAll('.stats .fade-in');
  const video = element.querySelector('.ut-outro-img video, video');

  // Column 1: Content (heading + paragraph + CTA + stats)
  const col1 = document.createDocumentFragment();
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim().replace(/\s+/g, ' ');
    col1.appendChild(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    col1.appendChild(p);
  }
  if (cta) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    p.appendChild(link);
    col1.appendChild(p);
  }
  stats.forEach((stat) => {
    const counter = stat.querySelector('.counter');
    const label = stat.querySelector('.small:last-child, span.small.text-uppercase');
    const srOnly = stat.querySelector('.sr-only');
    if (counter) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = srOnly ? srOnly.textContent.trim() : counter.textContent.trim();
      p.appendChild(strong);
      if (label) {
        p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(label.textContent.trim().replace(/\s+/g, ' ')));
      }
      col1.appendChild(p);
    }
  });

  // Column 2: Video (as link to source)
  const col2 = document.createDocumentFragment();
  if (video) {
    const src = video.getAttribute('src');
    if (src) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = src.startsWith('/') || src.startsWith('http') ? src : `https://www.utexas.edu/${src}`;
      link.textContent = 'Video';
      p.appendChild(link);
      col2.appendChild(p);
    }
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-outro', cells });
  element.replaceWith(block);
}
