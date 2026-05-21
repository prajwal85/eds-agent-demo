/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: PSI Exams sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Runs only in afterTransform hook.
 * Selectors validated against captured DOM in migration-work/cleaned.html:
 *   - .elementor-element-90d1967 (Hero Section, style: dark)
 *   - .elementor-element-0548f29 (Services Section, style: dark)
 *   - .elementor-element-3d6f58c (Features Section, style: null)
 *   - .elementor-element-440ffc5 (Success Stories Section, style: dark)
 *   - .elementor-element-6c5b94e8 (Brands Section, style: dark)
 *   - .elementor-element-10231a5a (Knowledge Hub Section, style: null)
 *   - .elementor-element-9397909 (CTA Section, style: dark)
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section, reverseIndex) => {
      const sectionIndex = sections.length - 1 - reverseIndex;
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) return;

      // Add Section Metadata block after the section element if style is defined
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before the section element if it is not the first section
      if (sectionIndex > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
