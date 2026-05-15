/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-landing
 * Base block: hero
 * Source: https://www.ets.org/gre.html
 * Selector: .hero .c-mosaic
 * Generated: 2026-05-14
 *
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Rows: 2 (image, text) — simple block, single column per row
 *
 * Source structure:
 *   .c-mosaic__content
 *     h1.c-mosaic__headline (contains img.c-mosaic__logo + headline text)
 *     .c-mosaic__cta-group (contains a.c-mosaic__cta links)
 *   .c-mosaic__image-stack (student photos)
 */
export default function parse(element, { document }) {
  // --- Row 1: image field (hero imagery from image stack) ---
  // Use the first image-stack item that has a valid src attribute
  const imageStackItems = element.querySelectorAll('.c-mosaic__image-stack-item[src], .c-mosaic__image-stack img[src]');
  let heroImage = null;
  for (const img of imageStackItems) {
    if (img.getAttribute('src') && !img.getAttribute('src').startsWith('data:')) {
      heroImage = img;
      break;
    }
  }

  // Fallback: try any img in the image stack area
  if (!heroImage) {
    heroImage = element.querySelector('.c-mosaic__image-stack img[src]:not([src^="data:"])');
  }

  // Build image cell: wrap field hint + image in a single container
  const imageContainer = document.createDocumentFragment();
  imageContainer.appendChild(document.createComment(' field:image '));
  if (heroImage) {
    imageContainer.appendChild(heroImage);
  }

  // --- Row 2: text field (richtext: logo + heading + CTAs) ---
  // All text content goes in a single container so it renders as one cell
  const textContainer = document.createDocumentFragment();
  textContainer.appendChild(document.createComment(' field:text '));

  // Extract the logo image from inside the headline
  const logo = element.querySelector('.c-mosaic__logo, h1 img, .c-mosaic__headline img');
  if (logo) {
    const logoParagraph = document.createElement('p');
    logoParagraph.appendChild(logo);
    textContainer.appendChild(logoParagraph);
  }

  // Extract heading text (h1 without the logo image, which was already moved)
  const headline = element.querySelector('h1.c-mosaic__headline, .c-mosaic__headline, h1');
  if (headline) {
    const h1 = document.createElement('h1');
    h1.textContent = headline.textContent.trim();
    textContainer.appendChild(h1);
  }

  // Extract CTA links
  const ctaLinks = element.querySelectorAll('.c-mosaic__cta-group a, .c-mosaic__cta, .c-mosaic__content a.e-cta');
  ctaLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    // Use only the text content, skip any inline SVG/icon images
    a.textContent = link.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(a);
    textContainer.appendChild(p);
  });

  // --- Build cells array matching UE model: 2 rows, 1 column each ---
  // Each row is an array with a single cell (simple block layout)
  const cells = [
    [imageContainer],
    [textContainer],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
