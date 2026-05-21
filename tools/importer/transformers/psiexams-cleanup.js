/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: PSI Exams cleanup.
 * Removes non-authorable content (header, footer, cookie consent, skip links, etc.)
 * Selectors validated against captured DOM in migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove OneTrust cookie consent SDK (blocks parsing, overlays page)
    // Found in captured HTML: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
    ]);

    // Remove skip link (non-authorable accessibility helper)
    // Found in captured HTML: <a class="skip-link screen-reader-text" href="#content">
    WebImporter.DOMUtils.remove(element, [
      '.skip-link.screen-reader-text',
    ]);

    // Remove Elementor screen-only device mode indicators
    // Found in captured HTML: <span id="elementor-device-mode" class="elementor-screen-only">
    WebImporter.DOMUtils.remove(element, [
      '#elementor-device-mode',
      '.elementor-screen-only',
    ]);
  }

  if (hookName === H.after) {
    // Remove header/navigation (non-authorable site shell)
    // Found in captured HTML: <header class="elementor elementor-63482 elementor-location-header">
    WebImporter.DOMUtils.remove(element, [
      'header.elementor-location-header',
    ]);

    // Remove footer (non-authorable site shell)
    // Found in captured HTML: <footer class="elementor elementor-22194 elementor-location-footer">
    WebImporter.DOMUtils.remove(element, [
      'footer.elementor-location-footer',
    ]);

    // Remove link elements (stylesheets leftover from source)
    // Found in captured HTML: <link id="elementor-post-22036-css" ...>
    WebImporter.DOMUtils.remove(element, [
      'link',
    ]);

    // Remove noscript elements (tracking pixels, GTM)
    // Found in captured HTML: <!-- Google Tag Manager (noscript) -->
    WebImporter.DOMUtils.remove(element, [
      'noscript',
    ]);
  }
}
