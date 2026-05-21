/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-cta
 * Base block: hero
 * Source: https://www.psiexams.com/
 * Selector: .elementor-element-9397909
 * Generated: 2026-05-19
 *
 * Description: Hero CTA variant. Full-width call-to-action banner with
 * background image/texture, heading text, and action button.
 *
 * UE Model fields: image (reference), text (richtext)
 * Collapsed fields (skipped): imageAlt
 */
export default function parse(element, { document }) {
  // === Extract content from source DOM ===

  // Heading: h3 inside .elementor-widget-heading
  const heading = element.querySelector('h3.elementor-heading-title, h3');

  // Description: p inside .elementor-widget-heading (second widget)
  const description = element.querySelector('p.elementor-heading-title, p');

  // CTA link: the .sd_link-container anchor wrapping the content
  const ctaLink = element.querySelector('a.sd_link-container, a[href*="contact"]');

  // === Build cells array matching UE model (image + text) ===
  const cells = [];

  // Row 1: image field (optional - source may not have a background image)
  // The library example shows a background image row; leave empty if not present
  // No image in source DOM for this instance, skip empty row per hinting rules

  // Row 2: text field (richtext) - contains heading, description, and CTA link
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    textFrag.appendChild(h3);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textFrag.appendChild(p);
  }

  if (ctaLink) {
    const link = document.createElement('a');
    const href = ctaLink.getAttribute('href') || '';
    // Convert absolute URL to relative path
    link.href = href.replace(/^https?:\/\/[^/]+/, '');
    link.textContent = heading ? heading.textContent.trim() : 'Contact Us';
    textFrag.appendChild(link);
  }

  cells.push([textFrag]);

  // === Create block and replace element ===
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
