/* eslint-disable */
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

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    let bgImageSrc = "";
    const computedBg = window.getComputedStyle(element).backgroundImage;
    if (computedBg && computedBg !== "none") {
      const match = computedBg.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) bgImageSrc = match[1];
    }
    if (!bgImageSrc && element.style.backgroundImage) {
      const match = element.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) bgImageSrc = match[1];
    }
    if (!bgImageSrc) {
      const directImg = element.querySelector(":scope > img, :scope > .e-con-inner > img");
      if (directImg && directImg.src && !directImg.src.startsWith("data:")) {
        bgImageSrc = directImg.src;
      }
    }
    let bgImage = null;
    if (bgImageSrc) {
      bgImage = document.createElement("img");
      bgImage.src = bgImageSrc;
      bgImage.alt = "Hero background";
    }
    const animatedBefore = element.querySelector(".jet-animated-text__before-text");
    const animatedItems = element.querySelectorAll(".jet-animated-text__animated-text-item");
    const mobileHeading = element.querySelector(".elementor-element-16257b1 h2, .elementor-hidden-desktop h2");
    let heading;
    if (animatedBefore && animatedItems.length > 0) {
      heading = document.createElement("h2");
      const beforeText = animatedBefore.textContent.trim();
      const firstAnimatedText = animatedItems[0].textContent.trim().replace(/\s+/g, " ");
      heading.textContent = `${beforeText} ${firstAnimatedText}`;
    } else if (mobileHeading) {
      heading = mobileHeading.cloneNode(true);
    }
    const description = element.querySelector(".elementor-element-6703544 p, .elementor-element-6703544 .elementor-heading-title");
    const ctaLinks = element.querySelectorAll(".sd_hero-large-btn a.jet-button__instance");
    const ctas = [];
    ctaLinks.forEach((link) => {
      const label = link.querySelector(".jet-button__state-normal .jet-button__label");
      if (label && link.href) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = label.textContent.trim();
        ctas.push(a);
      }
    });
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(bgImage);
      cells.push([imgFrag]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading);
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textFrag.appendChild(p);
    }
    if (ctas.length > 0) {
      const p = document.createElement("p");
      ctas.forEach((a, i) => {
        if (i > 0) p.appendChild(document.createTextNode(" "));
        p.appendChild(a);
      });
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll("a.sd_link-container");
    const cells = [];
    cardItems.forEach((card) => {
      const image = card.querySelector(".elementor-widget-image img");
      const heading = card.querySelector("h3.elementor-heading-title");
      const description = card.querySelector("span.elementor-heading-title");
      const href = card.getAttribute("href");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) {
        const imgClone = image.cloneNode(true);
        imageCell.appendChild(imgClone);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textCell.appendChild(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = "Learn more";
        const linkP = document.createElement("p");
        linkP.appendChild(link);
        textCell.appendChild(linkP);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(":scope > .e-con.e-child");
    const cells = [];
    cardItems.forEach((card) => {
      const image = card.querySelector(".elementor-widget-image img");
      const heading = card.querySelector("h3.elementor-heading-title");
      const description = card.querySelector("p.elementor-heading-title");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) {
        imageCell.appendChild(image);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        textCell.appendChild(heading);
      }
      if (description) {
        textCell.appendChild(description);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse4(element, { document }) {
    if (!element.classList.contains("sd_testimonial-slider")) return;
    const slideItems = element.querySelectorAll(".jet-listing-grid__item:not(.slick-cloned)");
    const cells = [];
    slideItems.forEach((slide) => {
      let imgSrc = null;
      const styleTag = slide.querySelector("style");
      if (styleTag) {
        const bgMatch = styleTag.textContent.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/);
        if (bgMatch) {
          imgSrc = bgMatch[1];
        }
      }
      if (!imgSrc) {
        const imgEl = slide.querySelector('.elementor-element-b3d55c3 img:not([src^="data:"]), .e-con-inner > .e-con:first-child img:not([src^="data:"])');
        if (imgEl) {
          imgSrc = imgEl.getAttribute("src");
        }
      }
      const allDynamicFields = slide.querySelectorAll(".jet-listing-dynamic-field__content");
      const attributionContainer = slide.querySelector('[class*="elementor-element-ec48a37"], .e-con > .e-con > .elementor-widget-jet-listing-dynamic-field');
      let quoteEl = null;
      let nameEl = null;
      let titleEl = null;
      if (allDynamicFields.length >= 1) {
        quoteEl = allDynamicFields[0];
      }
      const nameContainer = slide.querySelector('[class*="elementor-element-ec48a37"]');
      if (nameContainer) {
        const attrFields = nameContainer.querySelectorAll(".jet-listing-dynamic-field__content");
        if (attrFields.length >= 1) nameEl = attrFields[0];
        if (attrFields.length >= 2) titleEl = attrFields[1];
      } else if (allDynamicFields.length >= 2) {
        nameEl = allDynamicFields[1];
        if (allDynamicFields.length >= 3) titleEl = allDynamicFields[2];
      }
      const quoteText = quoteEl ? quoteEl.textContent.trim() : "";
      if (!quoteText || !quoteText.startsWith('"') && !quoteText.startsWith("\u201C")) {
        return;
      }
      const caseStudyLink = slide.querySelector('a[href*="customer-stories"], a[href*="case-study"], a[href*="case_study"]');
      const imageCell = [];
      if (imgSrc) {
        const imgEl = document.createElement("img");
        imgEl.src = imgSrc;
        imageCell.push(imgEl);
      }
      const contentCell = [];
      if (quoteEl) {
        const quoteP = document.createElement("p");
        quoteP.innerHTML = quoteEl.innerHTML;
        contentCell.push(quoteP);
      }
      if (nameEl) {
        const nameP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = nameEl.textContent.trim();
        nameP.appendChild(strong);
        contentCell.push(nameP);
      }
      if (titleEl) {
        const titleP = document.createElement("p");
        titleP.textContent = titleEl.textContent.trim();
        contentCell.push(titleP);
      }
      if (caseStudyLink) {
        const linkP = document.createElement("p");
        const link = document.createElement("a");
        link.href = caseStudyLink.href || caseStudyLink.getAttribute("href") || "";
        link.textContent = caseStudyLink.textContent.trim() || "View Case Study";
        linkP.appendChild(link);
        contentCell.push(linkP);
      }
      if (contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-brand.js
  function parse5(element, { document }) {
    const inner = element.querySelector(":scope > .e-con-inner");
    const brandContainers = inner ? Array.from(inner.querySelectorAll(":scope > .e-con.e-child")) : Array.from(element.querySelectorAll(":scope > .e-con.e-child"));
    const cellsRow = brandContainers.map((container) => {
      const cellContent = [];
      const imageWidget = container.querySelector(".elementor-widget-image");
      if (imageWidget) {
        const link = imageWidget.querySelector("a");
        const img = imageWidget.querySelector("img");
        if (link && img) {
          const linkClone = link.cloneNode(false);
          const imgClone = img.cloneNode(false);
          linkClone.appendChild(imgClone);
          cellContent.push(linkClone);
        } else if (img) {
          cellContent.push(img.cloneNode(false));
        }
      }
      const heading = container.querySelector("h3.elementor-heading-title, h3");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        cellContent.push(h3);
      }
      const description = container.querySelector("p.elementor-heading-title, p");
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        cellContent.push(p);
      }
      return cellContent;
    });
    const cells = [cellsRow];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-article.js
  function parse6(element, { document }) {
    if (!element.classList.contains("sd_knowledge-slider")) {
      return;
    }
    const allItems = element.querySelectorAll(".jet-listing-grid__item");
    const items = Array.from(allItems).filter(
      (item) => !item.classList.contains("slick-cloned")
    );
    const cells = [];
    items.forEach((item) => {
      const anchor = item.querySelector("a[href]");
      const link = anchor ? anchor.getAttribute("href") : "";
      const categoryEl = item.querySelector(".jet-listing-dynamic-terms__link");
      const category = categoryEl ? categoryEl.textContent.trim() : "";
      const timeEl = item.querySelector("time");
      const metaDateEl = item.querySelector(".jet-listing-dynamic-meta__date");
      let dateText = "";
      if (timeEl) {
        dateText = timeEl.textContent.trim();
      } else if (metaDateEl) {
        dateText = metaDateEl.textContent.trim();
      }
      const titleEl = item.querySelector(".jet-listing-dynamic-field__content");
      const title = titleEl ? titleEl.textContent.trim() : "";
      const imgEl = item.querySelector(".jet-listing-dynamic-image img");
      let imageCell = [];
      if (imgEl) {
        const img = document.createElement("img");
        img.src = imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || "";
        img.alt = imgEl.getAttribute("alt") || title || "";
        imageCell.push(img);
      }
      const metaCell1 = document.createDocumentFragment();
      const fieldHintContent = document.createComment(" field:content_text ");
      metaCell1.appendChild(fieldHintContent);
      if (category) {
        const catSpan = document.createElement("span");
        catSpan.textContent = category;
        metaCell1.appendChild(catSpan);
      }
      const metaCell2 = document.createDocumentFragment();
      if (dateText) {
        const dateSpan = document.createElement("span");
        dateSpan.textContent = dateText;
        metaCell2.appendChild(dateSpan);
      }
      cells.push([metaCell1, metaCell2]);
      const titleCell = document.createDocumentFragment();
      if (title) {
        if (link) {
          const titleLink = document.createElement("a");
          titleLink.href = link;
          titleLink.textContent = title;
          titleCell.appendChild(titleLink);
        } else {
          const titleP = document.createElement("p");
          titleP.textContent = title;
          titleCell.appendChild(titleP);
        }
      }
      cells.push([titleCell]);
      const imageFragment = document.createDocumentFragment();
      const fieldHintMedia = document.createComment(" field:media_image ");
      imageFragment.appendChild(fieldHintMedia);
      if (imageCell.length > 0) {
        imageFragment.appendChild(imageCell[0]);
      }
      cells.push([imageFragment]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse7(element, { document }) {
    const heading = element.querySelector("h3.elementor-heading-title, h3");
    const description = element.querySelector("p.elementor-heading-title, p");
    const ctaLink = element.querySelector('a.sd_link-container, a[href*="contact"]');
    const cells = [];
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h3 = document.createElement("h3");
      h3.textContent = heading.textContent.trim();
      textFrag.appendChild(h3);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textFrag.appendChild(p);
    }
    if (ctaLink) {
      const link = document.createElement("a");
      const href = ctaLink.getAttribute("href") || "";
      link.href = href.replace(/^https?:\/\/[^/]+/, "");
      link.textContent = heading ? heading.textContent.trim() : "Contact Us";
      textFrag.appendChild(link);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/psiexams-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".skip-link.screen-reader-text"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#elementor-device-mode",
        ".elementor-screen-only"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.elementor-location-header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.elementor-location-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/psiexams-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section, reverseIndex) => {
        const sectionIndex = sections.length - 1 - reverseIndex;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (sectionIndex > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "cards-service": parse2,
    "cards-feature": parse3,
    "carousel-testimonial": parse4,
    "columns-brand": parse5,
    "carousel-article": parse6,
    "hero-cta": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "PSI Exams homepage with hero, services overview, and call-to-action sections",
    urls: ["https://www.psiexams.com/"],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".elementor-element-90d1967"]
      },
      {
        name: "cards-service",
        instances: [".elementor-element-74cb0d6"]
      },
      {
        name: "cards-feature",
        instances: [".elementor-element-12993d7"]
      },
      {
        name: "carousel-testimonial",
        instances: [".sd_testimonial-slider.elementor-widget-jet-listing-grid"]
      },
      {
        name: "columns-brand",
        instances: [".elementor-element-6c5b94e8"]
      },
      {
        name: "carousel-article",
        instances: [".sd_knowledge-slider.elementor-widget-jet-listing-grid"]
      },
      {
        name: "hero-cta",
        instances: [".elementor-element-9397909"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: ".elementor-element-90d1967",
        style: "dark",
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-2-services",
        name: "Services Section",
        selector: ".elementor-element-0548f29",
        style: "dark",
        blocks: ["cards-service"],
        defaultContent: [".elementor-element-fe9a6e0 h2", ".elementor-element-3d9f537 p"]
      },
      {
        id: "section-3-features",
        name: "Features Section",
        selector: ".elementor-element-3d6f58c",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: [".elementor-element-9785255 h2"]
      },
      {
        id: "section-4-testimonials",
        name: "Success Stories Section",
        selector: ".elementor-element-440ffc5",
        style: "dark",
        blocks: ["carousel-testimonial"],
        defaultContent: [".elementor-element-bc70821 h2"]
      },
      {
        id: "section-5-brands",
        name: "Brands Section",
        selector: ".elementor-element-6c5b94e8",
        style: "dark",
        blocks: ["columns-brand"],
        defaultContent: []
      },
      {
        id: "section-6-knowledge",
        name: "Knowledge Hub Section",
        selector: ".elementor-element-10231a5a",
        style: null,
        blocks: ["carousel-article"],
        defaultContent: [".elementor-element-1f75103b h2", ".elementor-element-c9c88c4 a"]
      },
      {
        id: "section-7-cta",
        name: "CTA Section",
        selector: ".elementor-element-9397909",
        style: "dark",
        blocks: ["hero-cta"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
      const { document, url, html, params } = payload;
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
