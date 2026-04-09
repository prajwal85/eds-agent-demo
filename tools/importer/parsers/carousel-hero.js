/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Source: https://wknd.site/us/en.html
 * Selectors from captured DOM: .carousel.cmp-carousel--hero
 *
 * UE Model (carousel-hero-item):
 *   - media_image (reference) → image cell (collapsed: media_imageAlt)
 *   - content_text (richtext) → text content cell
 *
 * Block library structure: Each row = 1 slide with 2 columns [image | text content]
 */
export default function parse(element, { document }) {
  // Each slide is a .cmp-carousel__item
  const slides = element.querySelectorAll('.cmp-carousel__item, [class*="carousel"][class*="item"][class*="tabpanel"]');
  const cells = [];

  slides.forEach((slide) => {
    // Extract image from the teaser inside each slide
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3');
    const description = slide.querySelector('.cmp-teaser__description, .cmp-teaser__description p');
    const ctaLink = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const pic = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      pic.appendChild(newImg);
      imageCell.appendChild(pic);
    }

    // Build text content cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));
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

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
