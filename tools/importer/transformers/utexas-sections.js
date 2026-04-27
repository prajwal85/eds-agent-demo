/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: utexas sections. Adds section breaks and section-metadata blocks.
 * Runs in BEFORE transform so section boundary elements still exist in DOM
 * (parsers replace them later).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.before) return;

  const { template } = payload;
  if (!template || !template.sections || template.sections.length < 2) return;

  const document = element.ownerDocument || element.getRootNode();

  // Walk sections in order. For each section after the first, insert an <hr>
  // before the matched element. For sections with style, mark the element with
  // a data attribute so we can insert section-metadata after parsers run.
  template.sections.forEach((section, idx) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }
    if (!sectionEl) return;

    // Insert section break before every section except the first
    if (idx > 0) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }

    // Mark sections that need section-metadata (applied in afterTransform)
    if (section.style) {
      sectionEl.setAttribute('data-section-style', section.style);
    }
  });
}
