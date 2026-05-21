/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsServiceParser from './parsers/cards-service.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import columnsBrandParser from './parsers/columns-brand.js';
import carouselArticleParser from './parsers/carousel-article.js';
import heroCtaParser from './parsers/hero-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/psiexams-cleanup.js';
import sectionsTransformer from './transformers/psiexams-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-service': cardsServiceParser,
  'cards-feature': cardsFeatureParser,
  'carousel-testimonial': carouselTestimonialParser,
  'columns-brand': columnsBrandParser,
  'carousel-article': carouselArticleParser,
  'hero-cta': heroCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'PSI Exams homepage with hero, services overview, and call-to-action sections',
  urls: ['https://www.psiexams.com/'],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.elementor-element-90d1967'],
    },
    {
      name: 'cards-service',
      instances: ['.elementor-element-74cb0d6'],
    },
    {
      name: 'cards-feature',
      instances: ['.elementor-element-12993d7'],
    },
    {
      name: 'carousel-testimonial',
      instances: ['.sd_testimonial-slider.elementor-widget-jet-listing-grid'],
    },
    {
      name: 'columns-brand',
      instances: ['.elementor-element-6c5b94e8'],
    },
    {
      name: 'carousel-article',
      instances: ['.sd_knowledge-slider.elementor-widget-jet-listing-grid'],
    },
    {
      name: 'hero-cta',
      instances: ['.elementor-element-9397909'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '.elementor-element-90d1967',
      style: 'dark',
      blocks: ['hero-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2-services',
      name: 'Services Section',
      selector: '.elementor-element-0548f29',
      style: 'dark',
      blocks: ['cards-service'],
      defaultContent: ['.elementor-element-fe9a6e0 h2', '.elementor-element-3d9f537 p'],
    },
    {
      id: 'section-3-features',
      name: 'Features Section',
      selector: '.elementor-element-3d6f58c',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['.elementor-element-9785255 h2'],
    },
    {
      id: 'section-4-testimonials',
      name: 'Success Stories Section',
      selector: '.elementor-element-440ffc5',
      style: 'dark',
      blocks: ['carousel-testimonial'],
      defaultContent: ['.elementor-element-bc70821 h2'],
    },
    {
      id: 'section-5-brands',
      name: 'Brands Section',
      selector: '.elementor-element-6c5b94e8',
      style: 'dark',
      blocks: ['columns-brand'],
      defaultContent: [],
    },
    {
      id: 'section-6-knowledge',
      name: 'Knowledge Hub Section',
      selector: '.elementor-element-10231a5a',
      style: null,
      blocks: ['carousel-article'],
      defaultContent: ['.elementor-element-1f75103b h2', '.elementor-element-c9c88c4 a'],
    },
    {
      id: 'section-7-cta',
      name: 'CTA Section',
      selector: '.elementor-element-9397909',
      style: 'dark',
      blocks: ['hero-cta'],
      defaultContent: [],
    },
  ],
};

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

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
