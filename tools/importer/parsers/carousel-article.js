/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-article
 * Base block: carousel
 * Source: https://www.psiexams.com/
 * Description: Carousel block for Knowledge Hub article cards with category, date, title, and thumbnail.
 * Generated: 2026-05-19
 */
export default function parse(element, { document }) {
  // Guard: only parse if element has the sd_knowledge-slider class
  if (!element.classList.contains('sd_knowledge-slider')) {
    return;
  }

  // Get all non-cloned slide items to avoid duplicates
  const allItems = element.querySelectorAll('.jet-listing-grid__item');
  const items = Array.from(allItems).filter(
    (item) => !item.classList.contains('slick-cloned')
  );

  const cells = [];

  items.forEach((item) => {
    // Extract link URL from the wrapping anchor
    const anchor = item.querySelector('a[href]');
    const link = anchor ? anchor.getAttribute('href') : '';

    // Extract category from dynamic terms
    const categoryEl = item.querySelector('.jet-listing-dynamic-terms__link');
    const category = categoryEl ? categoryEl.textContent.trim() : '';

    // Extract date from dynamic meta (time element or text within meta date)
    const timeEl = item.querySelector('time');
    const metaDateEl = item.querySelector('.jet-listing-dynamic-meta__date');
    let dateText = '';
    if (timeEl) {
      dateText = timeEl.textContent.trim();
    } else if (metaDateEl) {
      dateText = metaDateEl.textContent.trim();
    }

    // Extract title from dynamic field content
    const titleEl = item.querySelector('.jet-listing-dynamic-field__content');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Extract thumbnail image
    const imgEl = item.querySelector('.jet-listing-dynamic-image img');
    let imageCell = [];
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
      img.alt = imgEl.getAttribute('alt') || title || '';
      imageCell.push(img);
    }

    // Build cells for this carousel item following library example structure:
    // Row 1: category | date
    // Row 2: title (with link)
    // Row 3: image

    // Row 1: Category and Date
    const metaCell1 = document.createDocumentFragment();
    const fieldHintContent = document.createComment(' field:content_text ');
    metaCell1.appendChild(fieldHintContent);
    if (category) {
      const catSpan = document.createElement('span');
      catSpan.textContent = category;
      metaCell1.appendChild(catSpan);
    }

    const metaCell2 = document.createDocumentFragment();
    if (dateText) {
      const dateSpan = document.createElement('span');
      dateSpan.textContent = dateText;
      metaCell2.appendChild(dateSpan);
    }

    cells.push([metaCell1, metaCell2]);

    // Row 2: Title with link
    const titleCell = document.createDocumentFragment();
    if (title) {
      if (link) {
        const titleLink = document.createElement('a');
        titleLink.href = link;
        titleLink.textContent = title;
        titleCell.appendChild(titleLink);
      } else {
        const titleP = document.createElement('p');
        titleP.textContent = title;
        titleCell.appendChild(titleP);
      }
    }
    cells.push([titleCell]);

    // Row 3: Image
    const imageFragment = document.createDocumentFragment();
    const fieldHintMedia = document.createComment(' field:media_image ');
    imageFragment.appendChild(fieldHintMedia);
    if (imageCell.length > 0) {
      imageFragment.appendChild(imageCell[0]);
    }
    cells.push([imageFragment]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-article', cells });
  element.replaceWith(block);
}
