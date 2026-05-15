/* eslint-disable */
/* global WebImporter */

import heroLandingParser from './parsers/hero-landing.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsPathingParser from './parsers/cards-pathing.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsSocialParser from './parsers/cards-social.js';

import etsCleanupTransformer from './transformers/ets-cleanup.js';
import etsSectionsTransformer from './transformers/ets-sections.js';

const parsers = {
  'hero-landing': heroLandingParser,
  'columns-stats': columnsStatsParser,
  'cards-pathing': cardsPathingParser,
  'columns-feature': columnsFeatureParser,
  'cards-social': cardsSocialParser,
};

const PAGE_TEMPLATE = {
  name: 'gre-landing-page',
  description: 'GRE program landing page with hero, informational sections, and call-to-action areas',
  urls: [
    'https://www.ets.org/gre.html',
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: ['.hero .c-mosaic'],
    },
    {
      name: 'columns-stats',
      instances: ['.statBreakerModule .c-stat-breaker'],
    },
    {
      name: 'cards-pathing',
      instances: ['.subProductCardPathingModule .c-sub-product-pathing'],
    },
    {
      name: 'columns-feature',
      instances: ['.pingPongGridModule .c-ping-pong-card--left', '.pingPongGridModule .c-ping-pong-card--right'],
    },
    {
      name: 'cards-social',
      instances: ['.sociallinks .cmp-socialteaser'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.hero.aem-GridColumn',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Statistics',
      selector: '.statBreakerModule.aem-GridColumn',
      style: null,
      blocks: ['columns-stats'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Product Pathing',
      selector: '.subProductCardPathingModule.aem-GridColumn',
      style: null,
      blocks: ['cards-pathing'],
      defaultContent: ['.c-sub-product-pathing__title'],
    },
    {
      id: 'section-4',
      name: 'Getting Started Feature',
      selector: ['.pingPongGridModule.aem-GridColumn:has(.c-ping-pong-card--left)'],
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'GRE Prep Feature',
      selector: ['.pingPongGridModule.aem-GridColumn:has(.c-ping-pong-card--right)'],
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Social Connect',
      selector: '.cmp-experiencefragment--social-following',
      style: 'dark',
      blocks: ['cards-social'],
      defaultContent: ['.cmp-title__text'],
    },
    {
      id: 'section-7',
      name: 'Newsletter Signup',
      selector: '.formBanner.aem-GridColumn',
      style: 'dark',
      blocks: [],
      defaultContent: ['.form-banner__heading', '.form-banner__description .cmp-text p', '.form-banner__action-container button'],
    },
  ],
};

const transformers = [
  etsCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [etsSectionsTransformer] : []),
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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
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
