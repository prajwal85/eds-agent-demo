/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import columnsResourceParser from './parsers/columns-resource.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/utexas-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'columns-resource': columnsResourceParser,
};

// PAGE TEMPLATE CONFIGURATION
// Covers: section-landing, about-subpage, academics-subpage, campus-life-subpage,
// energy-subpage, research-subpage, policy-page, campus-carry-subpage
const PAGE_TEMPLATE = {
  name: 'interior',
  description: 'Generic UT Austin interior page with hero banner, two/three-column layouts, and content sections',
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.block-bundle-utexas-hero'],
    },
    {
      name: 'columns-resource',
      instances: ['.utexas-layout--twocol-wrapper', '.utexas-layout--threecol-wrapper'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Content',
      selector: '.layout-content',
      style: null,
      blocks: ['hero-banner', 'columns-resource'],
      defaultContent: ['h1', 'h2', 'p', 'ul', 'ol'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Extract remaining default content from basic blocks that weren't matched
 * by any parser. These are Drupal basic blocks with headings, paragraphs, etc.
 */
function cleanupBasicBlocks(main, document) {
  // Convert basic block wrappers to simple content
  const basicBlocks = main.querySelectorAll('.block-bundle-basic .ut-copy, .block-bundle-basic .field--name-body');
  basicBlocks.forEach((block) => {
    const frag = document.createDocumentFragment();
    // Move child nodes up
    while (block.firstChild) {
      frag.appendChild(block.firstChild);
    }
    const parent = block.closest('.block-bundle-basic');
    if (parent) {
      parent.replaceWith(frag);
    }
  });

  // Clean up flex content area blocks that weren't parsed as columns
  const flexBlocks = main.querySelectorAll('.block-bundle-utexas-flex-content-area');
  flexBlocks.forEach((flexBlock) => {
    const frag = document.createDocumentFragment();
    // Extract heading if present
    const heading = flexBlock.querySelector('.ut-headline--xl, h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      frag.appendChild(h2);
    }
    // Extract link lists
    const links = flexBlock.querySelectorAll('.link-list li a, ul li a.ut-link');
    links.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      frag.appendChild(p);
    });
    // Extract any remaining text content
    const paragraphs = flexBlock.querySelectorAll('.ut-copy p, .content-wrapper p');
    paragraphs.forEach((para) => {
      if (para.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = para.innerHTML;
        frag.appendChild(p);
      }
    });
    if (frag.childNodes.length > 0) {
      flexBlock.replaceWith(frag);
    }
  });

  // Clean up Drupal layout wrappers, preserving content
  const layoutWrappers = main.querySelectorAll('.section-wrapper, .layout, .layout__region, .layout__region--main');
  layoutWrappers.forEach((wrapper) => {
    // Don't unwrap if it still has useful structure
    if (wrapper.querySelector('.block-bundle-utexas-hero, .utexas-layout--twocol-wrapper, .utexas-layout--threecol-wrapper')) {
      return;
    }
  });

  // Remove empty divs
  const emptyDivs = main.querySelectorAll('div:empty');
  emptyDivs.forEach((div) => div.remove());
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform (remove search, scripts)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find and parse structured blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 3. Clean up remaining basic blocks and flex content
    cleanupBasicBlocks(main, document);

    // 4. Execute afterTransform (remove header, footer, nav)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
