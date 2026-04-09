var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll('.cmp-carousel__item, [class*="carousel"][class*="item"][class*="tabpanel"]');
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const heading = slide.querySelector(".cmp-teaser__title, h1, h2, h3");
      const description = slide.querySelector(".cmp-teaser__description, .cmp-teaser__description p");
      const ctaLink = slide.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const pic = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        pic.appendChild(newImg);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      if (heading) {
        const h = document.createElement("h2");
        h.textContent = heading.textContent.trim();
        textCell.appendChild(h);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector(".cmp-teaser__title, h2");
    const description = element.querySelector(".cmp-teaser__description");
    const ctaLink = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const imageCol = document.createDocumentFragment();
    if (img) {
      const pic = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      pic.appendChild(newImg);
      imageCol.appendChild(pic);
    }
    const textCol = document.createDocumentFragment();
    if (pretitle) {
      const p = document.createElement("p");
      p.textContent = pretitle.textContent.trim();
      textCol.appendChild(p);
    }
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCol.appendChild(h);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCol.appendChild(p);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCol.appendChild(p);
    }
    const cells = [[imageCol, textCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".cmp-image-list__item, li.cmp-image-list__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, .cmp-image__image, img");
      const titleEl = item.querySelector(".cmp-image-list__item-title, .cmp-image-list__item-title-link span");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link, a.cmp-image-list__item-title-link");
      const descEl = item.querySelector(".cmp-image-list__item-description, span.cmp-image-list__item-description");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        pic.appendChild(newImg);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (titleLink && titleEl) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = titleLink.href;
        a.textContent = titleEl.textContent.trim();
        const strong = document.createElement("strong");
        strong.appendChild(a);
        p.appendChild(strong);
        textCell.appendChild(p);
      }
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-adventure.js
  function parse4(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const heading = element.querySelector(".cmp-teaser__title, h2");
    const description = element.querySelector(".cmp-teaser__description");
    const ctaLink = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (img) {
      const pic = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      pic.appendChild(newImg);
      imageCell.appendChild(pic);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.appendChild(h);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }
    const cells = [[imageCell], [textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".wknd-sign-in-buttons",
        ".cmp-languagenavigation",
        '[id*="CybotCookiebotDialog"]',
        "noscript"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment.cmp-experiencefragment--header",
        "footer.experiencefragment.cmp-experiencefragment--footer",
        ".cmp-search",
        "iframe",
        "link"
      ]);
      element.querySelectorAll("[data-cmp-data-layer-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("data-cmp-data-layer-name");
        el.removeAttribute("data-cmp-link-accessibility-enabled");
        el.removeAttribute("data-cmp-link-accessibility-text");
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        if (section.id === sections[0].id) continue;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (sectionEl) {
          const hr = (element.ownerDocument || document).createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
          if (section.style) {
            const sectionMetadata = WebImporter.Blocks.createBlock(
              element.ownerDocument || document,
              { name: "Section Metadata", cells: { style: section.style } }
            );
            if (sectionEl.nextSibling) {
              sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
            } else {
              sectionEl.parentNode.appendChild(sectionMetadata);
            }
          }
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "columns-featured": parse2,
    "cards-article": parse3,
    "hero-adventure": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Adventures homepage with hero carousel, featured article teasers, article and adventure card grids",
    urls: ["https://wknd.site/us/en.html"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".carousel.cmp-carousel--hero"]
      },
      {
        name: "columns-featured",
        instances: [".teaser.cmp-teaser--featured"]
      },
      {
        name: "cards-article",
        instances: [".image-list.list"]
      },
      {
        name: "hero-adventure",
        instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".carousel.cmp-carousel--hero",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Content and Recent Articles",
        selector: "main.cmp-layout-container--fixed:nth-of-type(1)",
        style: null,
        blocks: ["columns-featured", "cards-article"],
        defaultContent: [".title.cmp-title--underline", ".button.cmp-button--primary", ".separator"]
      },
      {
        id: "section-3",
        name: "Climbing New Zealand Teaser",
        selector: ".teaser.cmp-teaser--hero.cmp-teaser--imagebottom",
        style: null,
        blocks: ["hero-adventure"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Adventure Cards",
        selector: "main.cmp-layout-container--fixed:nth-of-type(2)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: [".title:has(.cmp-title__text)", ".button.cmp-button--primary", ".separator"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
