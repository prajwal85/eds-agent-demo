/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks.
 * Adds <hr> section separators based on template sections.
 * Selectors from captured DOM at https://wknd.site/us/en.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse to avoid shifting issues
    const reversedSections = [...sections].reverse();
    for (const section of reversedSections) {
      // Skip first section (no <hr> before first section)
      if (section.id === sections[0].id) continue;

      // Find the first element matching this section's selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (sectionEl) {
        // Insert <hr> before this section element
        const hr = (element.ownerDocument || document).createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);

        // Add section-metadata if section has a style
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(
            element.ownerDocument || document,
            { name: 'Section Metadata', cells: { style: section.style } },
          );
          // Insert section-metadata after the section's last element
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
      }
    }
  }
}
