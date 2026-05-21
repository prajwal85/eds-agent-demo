/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-testimonial
 * Base block: carousel
 * Source: https://www.psiexams.com/
 * Generated: 2026-05-19
 *
 * Parses testimonial slider (.sd_testimonial-slider) into carousel block rows.
 * Each non-cloned slide becomes a row with image cell and content cell.
 * Content cell contains: quote text, person name (bold), title/org, and case study link.
 *
 * UE Model fields (carousel-item):
 *   - media_image: Background Image
 *   - content_text: Text (richtext)
 */
export default function parse(element, { document }) {
  // Guard: only process if this is the testimonial slider (has sd_testimonial-slider class)
  if (!element.classList.contains('sd_testimonial-slider')) return;

  // Get all slide items, excluding slick-cloned duplicates
  const slideItems = element.querySelectorAll('.jet-listing-grid__item:not(.slick-cloned)');

  const cells = [];

  slideItems.forEach((slide) => {
    // Extract client image - on live page, images are CSS background-images in a <style> tag
    // The style tag contains: background-image:url("https://...image.webp")
    let imgSrc = null;
    const styleTag = slide.querySelector('style');
    if (styleTag) {
      const bgMatch = styleTag.textContent.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/);
      if (bgMatch) {
        imgSrc = bgMatch[1];
      }
    }
    // Fallback: check for actual <img> elements (non-SVG, non-data-uri)
    if (!imgSrc) {
      const imgEl = slide.querySelector('.elementor-element-b3d55c3 img:not([src^="data:"]), .e-con-inner > .e-con:first-child img:not([src^="data:"])');
      if (imgEl) {
        imgSrc = imgEl.getAttribute('src');
      }
    }

    // Extract all dynamic field content elements within this slide
    const allDynamicFields = slide.querySelectorAll('.jet-listing-dynamic-field__content');

    // Identify testimonial content by structure:
    // - First dynamic field (outside attribution container) = quote text
    // - Dynamic fields inside attribution container = name, title
    const attributionContainer = slide.querySelector('[class*="elementor-element-ec48a37"], .e-con > .e-con > .elementor-widget-jet-listing-dynamic-field');

    // Quote: the first dynamic field content that contains quote marks or is in the main content area
    let quoteEl = null;
    let nameEl = null;
    let titleEl = null;

    if (allDynamicFields.length >= 1) {
      // First dynamic field is typically the quote
      quoteEl = allDynamicFields[0];
    }

    // Name and title from attribution area
    const nameContainer = slide.querySelector('[class*="elementor-element-ec48a37"]');
    if (nameContainer) {
      const attrFields = nameContainer.querySelectorAll('.jet-listing-dynamic-field__content');
      if (attrFields.length >= 1) nameEl = attrFields[0];
      if (attrFields.length >= 2) titleEl = attrFields[1];
    } else if (allDynamicFields.length >= 2) {
      // Fallback: second and third dynamic fields are name and title
      nameEl = allDynamicFields[1];
      if (allDynamicFields.length >= 3) titleEl = allDynamicFields[2];
    }

    // Skip slides that don't look like testimonials (no quote text starting with quotes)
    const quoteText = quoteEl ? quoteEl.textContent.trim() : '';
    if (!quoteText || (!quoteText.startsWith('"') && !quoteText.startsWith('“'))) {
      // Not a testimonial slide, skip
      return;
    }

    // Extract case study link
    const caseStudyLink = slide.querySelector('a[href*="customer-stories"], a[href*="case-study"], a[href*="case_study"]');

    // Build image cell
    const imageCell = [];
    if (imgSrc) {
      const imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      imageCell.push(imgEl);
    }

    // Build content cell with all text content
    const contentCell = [];

    // Quote text
    if (quoteEl) {
      const quoteP = document.createElement('p');
      quoteP.innerHTML = quoteEl.innerHTML;
      contentCell.push(quoteP);
    }

    // Person name (bold)
    if (nameEl) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      nameP.appendChild(strong);
      contentCell.push(nameP);
    }

    // Title/Organization
    if (titleEl) {
      const titleP = document.createElement('p');
      titleP.textContent = titleEl.textContent.trim();
      contentCell.push(titleP);
    }

    // Case study link
    if (caseStudyLink) {
      const linkP = document.createElement('p');
      const link = document.createElement('a');
      link.href = caseStudyLink.href || caseStudyLink.getAttribute('href') || '';
      link.textContent = caseStudyLink.textContent.trim() || 'View Case Study';
      linkP.appendChild(link);
      contentCell.push(linkP);
    }

    // Each slide is a row with two cells: [image, content]
    if (contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell]);
    }
  });

  // Only create block if we found testimonial content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
    element.replaceWith(block);
  }
}
