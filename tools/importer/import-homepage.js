/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsImpactParser from './parsers/columns-impact.js';
import columnsOutroParser from './parsers/columns-outro.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/utexas-cleanup.js';
import sectionsTransformer from './transformers/utexas-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'cards-article': cardsArticleParser,
  'columns-promo': columnsPromoParser,
  'columns-impact': columnsImpactParser,
  'columns-outro': columnsOutroParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'University homepage with hero video, news stories, impact sections, and call-to-action outro',
  urls: [
    'https://www.utexas.edu/',
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['.block-coresite-homepagehero'],
    },
    {
      name: 'cards-article',
      instances: ['.block-coresite-stories'],
    },
    {
      name: 'columns-promo',
      instances: ['#block-coretheme-homepagemidpagepromo'],
    },
    {
      name: 'columns-impact',
      instances: ['.block-coresite-impact-1', '.block-coresite-impact-2', '.block-coresite-impact-3'],
    },
    {
      name: 'columns-outro',
      instances: ['.block-homepage-outro'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Video + Headline',
      selector: '.block-coresite-homepagehero',
      style: null,
      blocks: ['hero-video'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'University Stories / News Cards',
      selector: '.block-coresite-stories',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['.action-links'],
    },
    {
      id: 'section-3',
      name: 'Mid-page Promo - UT Dell Campus',
      selector: '#block-coretheme-homepagemidpagepromo',
      style: 'burnt-orange',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Impact Intro',
      selector: '.block-coresite-impact-0',
      style: null,
      blocks: [],
      defaultContent: ['.section-title', 'p'],
    },
    {
      id: 'section-5',
      name: 'The Longhorn Experience',
      selector: '.block-coresite-impact-1',
      style: null,
      blocks: ['columns-impact'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Big Ideas Bigger Impact',
      selector: '.block-coresite-impact-2',
      style: null,
      blocks: ['columns-impact'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Learning With Purpose',
      selector: '.block-coresite-impact-3',
      style: null,
      blocks: ['columns-impact'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'For Texas For the Future',
      selector: '.block-homepage-outro',
      style: 'burnt-orange',
      blocks: ['columns-outro'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 3b. Clean up orphaned .stats elements (stats injected by parser fallback)
    main.querySelectorAll('.stats').forEach((el) => el.remove());

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
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
