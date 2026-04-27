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

  // tools/importer/import-interior.js
  var import_interior_exports = {};
  __export(import_interior_exports, {
    default: () => import_interior_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".ut-hero img, .hero--half-n-half img, picture img");
    const heading = element.querySelector(".ut-hero h2, .ut-hero h1, .hero-title");
    const description = element.querySelector(".ut-hero p, .hero-text p");
    const cells = [];
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(" field:image "));
    if (bgImg) {
      imgFrag.appendChild(bgImg.cloneNode(true));
    }
    cells.push([imgFrag]);
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textFrag.appendChild(h1);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-resource.js
  function parse2(element, { document }) {
    const firstRegion = element.querySelector(".layout__region--first");
    const secondRegion = element.querySelector(".layout__region--second");
    if (!firstRegion && !secondRegion) return;
    function extractRegionContent(region) {
      if (!region) return document.createDocumentFragment();
      const frag = document.createDocumentFragment();
      const heading = region.querySelector(".ut-headline--xl, h2");
      if (heading && heading.textContent.trim()) {
        const h = document.createElement("h2");
        h.textContent = heading.textContent.trim();
        frag.appendChild(h);
      }
      const quickLinks = region.querySelector(".utexas-quick-links");
      if (quickLinks) {
        const qlHeading = quickLinks.querySelector(".ut-headline, h3");
        if (qlHeading && qlHeading.textContent.trim()) {
          const h3 = document.createElement("h3");
          h3.textContent = qlHeading.textContent.trim();
          frag.appendChild(h3);
        }
        const gridItems = quickLinks.querySelectorAll(".quickLinks-grid-item");
        gridItems.forEach((item) => {
          const img2 = item.querySelector("img");
          const label = item.querySelector("p");
          if (label && label.textContent.trim()) {
            const p = document.createElement("p");
            p.textContent = label.textContent.trim();
            frag.appendChild(p);
          }
        });
        const linkItems = quickLinks.querySelectorAll(".link-list li a");
        linkItems.forEach((link) => {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim();
          p.appendChild(a);
          frag.appendChild(p);
        });
        return frag;
      }
      const img = region.querySelector(".ut-img--fluid, .ut-flex-content-area img");
      if (img) {
        frag.appendChild(img.cloneNode(true));
      }
      const links = region.querySelectorAll(".link-list li a, ul li a.ut-link");
      links.forEach((link) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        frag.appendChild(p);
      });
      return frag;
    }
    const col1 = extractRegionContent(firstRegion);
    const col2 = extractRegionContent(secondRegion);
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/utexas-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#block-coretheme-search-form"
      ]);
    }
    if (hookName === H.after) {
      const blockquotes = element.querySelectorAll("blockquote");
      blockquotes.forEach((bq) => {
        const paragraphs = bq.querySelectorAll("p");
        let quoteText = "";
        let attribution = "";
        let img = null;
        paragraphs.forEach((p) => {
          const pImg = p.querySelector("img");
          if (pImg && !img) {
            img = pImg;
            return;
          }
          const text = p.textContent.trim();
          if (!text) return;
          if (text.startsWith("-") || text.startsWith("\u2014") || text.startsWith("\u2014") || p.querySelector("em")) {
            attribution += (attribution ? "\n" : "") + text;
          } else {
            quoteText += (quoteText ? "\n" : "") + text;
          }
        });
        if (quoteText) {
          const table = payload.document.createElement("table");
          const thead = payload.document.createElement("thead");
          const headerRow = payload.document.createElement("tr");
          const headerCell = payload.document.createElement("th");
          headerCell.textContent = "Quote";
          headerRow.appendChild(headerCell);
          thead.appendChild(headerRow);
          table.appendChild(thead);
          const tbody = payload.document.createElement("tbody");
          const quoteRow = payload.document.createElement("tr");
          const quoteCell = payload.document.createElement("td");
          const quoteP = payload.document.createElement("p");
          quoteP.textContent = quoteText;
          quoteCell.appendChild(quoteP);
          quoteRow.appendChild(quoteCell);
          tbody.appendChild(quoteRow);
          if (attribution) {
            const attrRow = payload.document.createElement("tr");
            const attrCell = payload.document.createElement("td");
            if (img) {
              attrCell.appendChild(img.cloneNode(true));
            }
            const attrP = payload.document.createElement("p");
            attrP.textContent = attribution;
            attrCell.appendChild(attrP);
            attrRow.appendChild(attrCell);
            tbody.appendChild(attrRow);
          }
          table.appendChild(tbody);
          bq.replaceWith(table);
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "header.mobile-menu",
        "header#coretheme-mainmenu-wrapper",
        "footer.ut-footer",
        "nav#block-coretheme-headeraudiences",
        "nav#block-coretheme-headerutilitylinks",
        "nav#coresite-accessible-main-menu",
        "#block-coretheme-headergive",
        "#block-coretheme-headerapply",
        "#addtoany",
        "#drupal-live-announce",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/import-interior.js
  var parsers = {
    "hero-banner": parse,
    "columns-resource": parse2
  };
  var PAGE_TEMPLATE = {
    name: "interior",
    description: "Generic UT Austin interior page with hero banner, two/three-column layouts, and content sections",
    blocks: [
      {
        name: "hero-banner",
        instances: [".block-bundle-utexas-hero"]
      },
      {
        name: "columns-resource",
        instances: [".utexas-layout--twocol-wrapper", ".utexas-layout--threecol-wrapper"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Content",
        selector: ".layout-content",
        style: null,
        blocks: ["hero-banner", "columns-resource"],
        defaultContent: ["h1", "h2", "p", "ul", "ol"]
      }
    ]
  };
  var transformers = [
    transform
  ];
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
  function cleanupBasicBlocks(main, document) {
    const basicBlocks = main.querySelectorAll(".block-bundle-basic .ut-copy, .block-bundle-basic .field--name-body");
    basicBlocks.forEach((block) => {
      const frag = document.createDocumentFragment();
      while (block.firstChild) {
        frag.appendChild(block.firstChild);
      }
      const parent = block.closest(".block-bundle-basic");
      if (parent) {
        parent.replaceWith(frag);
      }
    });
    const flexBlocks = main.querySelectorAll(".block-bundle-utexas-flex-content-area");
    flexBlocks.forEach((flexBlock) => {
      const frag = document.createDocumentFragment();
      const heading = flexBlock.querySelector(".ut-headline--xl, h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        frag.appendChild(h2);
      }
      const links = flexBlock.querySelectorAll(".link-list li a, ul li a.ut-link");
      links.forEach((link) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        frag.appendChild(p);
      });
      const paragraphs = flexBlock.querySelectorAll(".ut-copy p, .content-wrapper p");
      paragraphs.forEach((para) => {
        if (para.textContent.trim()) {
          const p = document.createElement("p");
          p.innerHTML = para.innerHTML;
          frag.appendChild(p);
        }
      });
      if (frag.childNodes.length > 0) {
        flexBlock.replaceWith(frag);
      }
    });
    const layoutWrappers = main.querySelectorAll(".section-wrapper, .layout, .layout__region, .layout__region--main");
    layoutWrappers.forEach((wrapper) => {
      if (wrapper.querySelector(".block-bundle-utexas-hero, .utexas-layout--twocol-wrapper, .utexas-layout--threecol-wrapper")) {
        return;
      }
    });
    const emptyDivs = main.querySelectorAll("div:empty");
    emptyDivs.forEach((div) => div.remove());
  }
  var import_interior_default = {
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
        }
      });
      cleanupBasicBlocks(main, document);
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
  return __toCommonJS(import_interior_exports);
})();
