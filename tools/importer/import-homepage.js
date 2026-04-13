/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsArticleParser from './parsers/cards-article.js';
import heroAdventureParser from './parsers/hero-adventure.js';

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND homepage with hero carousel, featured teasers, and card grids',
  urls: ['https://wknd.site/us/en.html'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.carousel.cmp-carousel--hero'],
    },
    {
      name: 'columns-featured',
      instances: ['.teaser.cmp-teaser--featured'],
    },
    {
      name: 'cards-article',
      instances: ['.image-list.list'],
    },
    {
      name: 'hero-adventure',
      instances: ['.teaser.cmp-teaser--hero.cmp-teaser--imagebottom'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.carousel.cmp-carousel--hero',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Content and Recent Articles',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(1)',
      style: null,
      blocks: ['columns-featured', 'cards-article'],
      defaultContent: ['.title.cmp-title--underline', '.button.cmp-button--primary', '.separator'],
    },
    {
      id: 'section-3',
      name: 'Climbing New Zealand Teaser',
      selector: '.teaser.cmp-teaser--hero.cmp-teaser--imagebottom',
      style: null,
      blocks: ['hero-adventure'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Adventure Cards',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(2)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['.title', '.button.cmp-button--primary', '.separator'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-featured': columnsFeaturedParser,
  'cards-article': cardsArticleParser,
  'hero-adventure': heroAdventureParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

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
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
