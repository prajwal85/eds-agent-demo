/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ETS site-wide cleanup.
 * Removes non-authorable content (header, footer, nav, cookie consent,
 * promotional modals, analytics widgets, AEM scaffolding) so the import
 * contains only page-level authorable content.
 *
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (OneTrust) — blocks parsing overlay
    // Found: <div id="onetrust-consent-sdk"> (line 1844)
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // HubSpot interactive widgets — modal overlays that block parsing
    // Found: <div id="hs-web-interactives-top-anchor"> (line 1787)
    // Found: <div id="hs-web-interactives-bottom-anchor"> (line 1791)
    // Found: <div id="hs-web-interactives-floating-container"> (line 1793)
    // Found: <div id="hs-web-interactives-top-push-anchor"> (line 2)
    WebImporter.DOMUtils.remove(element, [
      '[id^="hs-web-interactives"]',
    ]);

    // GRE May Prep promotional modal — overlay blocking content
    // Found: <div class="at-GreMayPrep-modal-overlay"> (line 1805)
    // Found: <div class="at-GreMayPrep-modal-escape"> (line 1807)
    // Found: <div class="at-GreMayPrep-modal-container"> (line 1809)
    WebImporter.DOMUtils.remove(element, [
      '.at-GreMayPrep-modal-overlay',
      '.at-GreMayPrep-modal-escape',
      '.at-GreMayPrep-modal-container',
    ]);

    // Signup dialog modal — overlay blocking content
    // Found: <dialog id="etsSignupDialog" class="c-modal form-banner-dialog"> (line 1522)
    WebImporter.DOMUtils.remove(element, ['#etsSignupDialog']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header — non-authorable site shell (auto-populated in EDS)
    // Found: <header class="container responsivegrid headerSection aem-GridColumn ..."> (line 22)
    WebImporter.DOMUtils.remove(element, ['header.headerSection']);

    // Rescue formBanner (section 7: Newsletter Signup) from inside footer before
    // footer removal. The formBanner at line 1504 is inside <footer> (line 1495)
    // but contains authorable content for the Newsletter Signup section.
    const footer = element.querySelector('footer');
    if (footer) {
      const formBanner = footer.querySelector('.formBanner');
      if (formBanner) {
        // Move formBanner out of footer, placing it just before the footer
        footer.parentNode.insertBefore(formBanner, footer);
      }
    }

    // Footer — non-authorable site shell (auto-populated in EDS)
    // Found: <footer class="container responsivegrid aem-GridColumn ..."> (line 1495)
    // After extracting formBanner, the footer now only contains non-authorable
    // content: globalFooter nav, signUpBreakerModule (empty), experience fragments
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Skip-to-content links — AEM shell navigation aids
    // Found: <div class="cmp-page__skiptomaincontent"> (lines 12, 16)
    WebImporter.DOMUtils.remove(element, ['.cmp-page__skiptomaincontent']);

    // Hidden brand element — non-authorable
    // Found: <span class="d-none ets-brand"> (line 6)
    WebImporter.DOMUtils.remove(element, ['.d-none.ets-brand']);

    // Unwrap embedOpenHtml containers — AEM scaffolding wrappers
    // Found: <div class="embedOpenHtml aem-GridColumn ..."> (lines 1113, 1490)
    // Line 1113 wraps the statBreakerModule (authorable content for section 2),
    // so we unwrap children rather than removing the container entirely.
    // Line 1490 is empty (only HTML comments) and will be removed after unwrap.
    const embedContainers = element.querySelectorAll('.embedOpenHtml');
    embedContainers.forEach((container) => {
      while (container.firstChild) {
        container.parentNode.insertBefore(container.firstChild, container);
      }
      container.remove();
    });

    // Chatbot dynamic data container — non-authorable widget
    // Found: <div class="chatbot-dynamic-data"> (line 1784)
    WebImporter.DOMUtils.remove(element, ['.chatbot-dynamic-data']);

    // External CSS link elements — not needed in import
    // Found: <link href="/etc.clientlibs/..."> (line 15)
    WebImporter.DOMUtils.remove(element, ['link']);

    // Remove noscript elements — not needed in import
    WebImporter.DOMUtils.remove(element, ['noscript']);
  }
}
