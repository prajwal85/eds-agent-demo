/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ETS section breaks and section metadata.
 * Adds <hr> section dividers and Section Metadata blocks based on
 * template sections from payload.template.sections.
 *
 * Runs in afterTransform only, after cleanup transformer has removed
 * non-authorable content.
 *
 * Section selectors verified against captured DOM in migration-work/cleaned.html:
 *   section-1 (Hero Banner):           .hero.aem-GridColumn (line 1075)
 *   section-2 (Statistics):            .statBreakerModule.aem-GridColumn (line 1116)
 *   section-3 (Product Pathing):       .subProductCardPathingModule.aem-GridColumn (line 1148)
 *   section-4 (Getting Started):       .pingPongGridModule.aem-GridColumn:has(.c-ping-pong-card--left) (line 1232)
 *   section-5 (GRE Prep Feature):      .pingPongGridModule.aem-GridColumn:has(.c-ping-pong-card--right) (line 1260)
 *   section-6 (Social Connect):        .cmp-experiencefragment--social-following (line 1291)
 *   section-7 (Newsletter Signup):     .formBanner.aem-GridColumn (line 1504, rescued from footer by cleanup)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order so that DOM insertions do not shift
    // the positions of elements that have not yet been processed.
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;

      const sectionEl = element.querySelector(selector);
      if (!sectionEl) {
        continue;
      }

      // Add Section Metadata block for sections that have a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        // Insert section metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Add <hr> section break before every section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
