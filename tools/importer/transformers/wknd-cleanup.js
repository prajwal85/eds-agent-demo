/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site cleanup.
 * Selectors from captured DOM at https://wknd.site/us/en.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/tracking elements (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.wknd-sign-in-buttons',
      '.cmp-languagenavigation',
      '[id*="CybotCookiebotDialog"]',
      'noscript',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment.cmp-experiencefragment--header',
      'footer.experiencefragment.cmp-experiencefragment--footer',
      '.cmp-search',
      'iframe',
      'link',
    ]);

    // Clean up tracking attributes
    element.querySelectorAll('[data-cmp-data-layer-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-cmp-data-layer-name');
      el.removeAttribute('data-cmp-link-accessibility-enabled');
      el.removeAttribute('data-cmp-link-accessibility-text');
    });
  }
}
