/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-homepage
 * Base block: hero
 * Source: https://www.psiexams.com/
 * Selector: .elementor-element-90d1967
 * Generated: 2026-05-19
 *
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Rows: 2 (image, text)
 */
export default function parse(element, { document }) {
  // Extract background image
  // On the live page, the hero background is applied as a CSS background-image on the container element
  // rather than as an <img> tag. We extract from computed style or inline style.
  let bgImageSrc = '';
  const computedBg = window.getComputedStyle(element).backgroundImage;
  if (computedBg && computedBg !== 'none') {
    const match = computedBg.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) bgImageSrc = match[1];
  }
  // Fallback: check inline style
  if (!bgImageSrc && element.style.backgroundImage) {
    const match = element.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) bgImageSrc = match[1];
  }
  // Fallback: check for a direct <img> child (as in cached source.html)
  if (!bgImageSrc) {
    const directImg = element.querySelector(':scope > img, :scope > .e-con-inner > img');
    if (directImg && directImg.src && !directImg.src.startsWith('data:')) {
      bgImageSrc = directImg.src;
    }
  }

  // Create an img element for the background image
  let bgImage = null;
  if (bgImageSrc) {
    bgImage = document.createElement('img');
    bgImage.src = bgImageSrc;
    bgImage.alt = 'Hero background';
  }

  // Extract heading text from the animated text widget (desktop) or fallback h2 (mobile)
  // Desktop: .jet-animated-text__before-text contains "Dreams... Deserve"
  // Animated items cycle: "the best test day", "the best test partner", "PSI"
  // Mobile fallback: h2.elementor-heading-title
  const animatedBefore = element.querySelector('.jet-animated-text__before-text');
  const animatedItems = element.querySelectorAll('.jet-animated-text__animated-text-item');
  const mobileHeading = element.querySelector('.elementor-element-16257b1 h2, .elementor-hidden-desktop h2');

  // Build heading element - use first animated text variant for static import
  let heading;
  if (animatedBefore && animatedItems.length > 0) {
    heading = document.createElement('h2');
    const beforeText = animatedBefore.textContent.trim();
    const firstAnimatedText = animatedItems[0].textContent.trim().replace(/\s+/g, ' ');
    heading.textContent = `${beforeText} ${firstAnimatedText}`;
  } else if (mobileHeading) {
    heading = mobileHeading.cloneNode(true);
  }

  // Extract description paragraph
  // Source: .elementor-element-6703544 p.elementor-heading-title
  const description = element.querySelector('.elementor-element-6703544 p, .elementor-element-6703544 .elementor-heading-title');

  // Extract CTA buttons
  // Source: .sd_hero-large-btn a.jet-button__instance
  const ctaLinks = element.querySelectorAll('.sd_hero-large-btn a.jet-button__instance');
  const ctas = [];
  ctaLinks.forEach((link) => {
    const label = link.querySelector('.jet-button__state-normal .jet-button__label');
    if (label && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = label.textContent.trim();
      ctas.push(a);
    }
  });

  // Build cells array matching UE model: 2 rows (image, text)
  const cells = [];

  // Row 1: image field (background image)
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImage);
    cells.push([imgFrag]);
  }

  // Row 2: text field (richtext - heading + description + CTAs combined)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading);
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textFrag.appendChild(p);
  }
  if (ctas.length > 0) {
    const p = document.createElement('p');
    ctas.forEach((a, i) => {
      if (i > 0) p.appendChild(document.createTextNode(' '));
      p.appendChild(a);
    });
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
