/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: utexas cleanup. Selectors from captured DOM of https://www.utexas.edu/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove search form that may interfere with block parsing
    // Found in captured HTML: <div class="search-block-form" id="block-coretheme-search-form">
    WebImporter.DOMUtils.remove(element, [
      '#block-coretheme-search-form',
      '.video-wrapper',
      '#video-controls',
      '.block-bundle-utexas-hero-video > .video-wrapper',
    ]);
  }
  if (hookName === H.after) {
    // Convert blockquotes to EDS quote blocks
    const blockquotes = element.querySelectorAll('blockquote');
    blockquotes.forEach((bq) => {
      // Extract quote text and attribution
      const paragraphs = bq.querySelectorAll('p');
      let quoteText = '';
      let attribution = '';
      let img = null;

      paragraphs.forEach((p) => {
        const pImg = p.querySelector('img');
        if (pImg && !img) {
          img = pImg;
          return;
        }
        const text = p.textContent.trim();
        if (!text) return;
        // Attribution lines typically start with - or — or em dash
        if (text.startsWith('-') || text.startsWith('—') || text.startsWith('\u2014') || p.querySelector('em')) {
          attribution += (attribution ? '\n' : '') + text;
        } else {
          quoteText += (quoteText ? '\n' : '') + text;
        }
      });

      if (quoteText) {
        // Build a quote block table
        const table = payload.document.createElement('table');
        const thead = payload.document.createElement('thead');
        const headerRow = payload.document.createElement('tr');
        const headerCell = payload.document.createElement('th');
        headerCell.textContent = 'Quote';
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = payload.document.createElement('tbody');

        // Row 1: quote text
        const quoteRow = payload.document.createElement('tr');
        const quoteCell = payload.document.createElement('td');
        const quoteP = payload.document.createElement('p');
        quoteP.textContent = quoteText;
        quoteCell.appendChild(quoteP);
        quoteRow.appendChild(quoteCell);
        tbody.appendChild(quoteRow);

        // Row 2: attribution (if present)
        if (attribution) {
          const attrRow = payload.document.createElement('tr');
          const attrCell = payload.document.createElement('td');
          if (img) {
            attrCell.appendChild(img.cloneNode(true));
          }
          const attrP = payload.document.createElement('p');
          attrP.textContent = attribution;
          attrCell.appendChild(attrP);
          attrRow.appendChild(attrCell);
          tbody.appendChild(attrRow);
        }

        table.appendChild(tbody);
        bq.replaceWith(table);
      }
    });

    // Insert section-metadata blocks for elements marked by utexas-sections transformer
    const styledEls = element.querySelectorAll('[data-section-style]');
    styledEls.forEach((el) => {
      const style = el.getAttribute('data-section-style');
      el.removeAttribute('data-section-style');
      if (style) {
        const metaBlock = WebImporter.Blocks.createBlock(payload.document, {
          name: 'Section Metadata',
          cells: { style },
        });
        // Insert after the element (or after its replacement block table)
        const nextHr = el.nextElementSibling && el.nextElementSibling.tagName === 'HR'
          ? el.nextElementSibling : null;
        if (nextHr) {
          nextHr.before(metaBlock);
        } else {
          el.after(metaBlock);
        }
      }
    });

    // Remove non-authorable content: headers, footers, navigation, social widgets
    // Found in captured HTML: <header class="mobile-menu">, <header id="coretheme-mainmenu-wrapper">,
    // <footer class="ut-footer">, <nav id="block-coretheme-headeraudiences">,
    // <nav id="coresite-accessible-main-menu">, <div id="addtoany">, <div id="drupal-live-announce">
    WebImporter.DOMUtils.remove(element, [
      'header.mobile-menu',
      'header#coretheme-mainmenu-wrapper',
      'footer.ut-footer',
      'nav#block-coretheme-headeraudiences',
      'nav#block-coretheme-headerutilitylinks',
      'nav#coresite-accessible-main-menu',
      '#block-coretheme-headergive',
      '#block-coretheme-headerapply',
      '#addtoany',
      '#drupal-live-announce',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
