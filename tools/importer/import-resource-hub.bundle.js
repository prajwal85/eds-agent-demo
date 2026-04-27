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

  // tools/importer/import-resource-hub.js
  var import_resource_hub_exports = {};
  __export(import_resource_hub_exports, {
    default: () => import_resource_hub_default
  });

  // tools/importer/parsers/columns-resource.js
  function parse(element, { document }) {
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

  // tools/importer/import-resource-hub.js
  var parsers = {
    "columns-resource": parse
  };
  var PAGE_TEMPLATE = {
    name: "resource-hub",
    description: "Resource hub page with categorized links and information for specific audiences",
    urls: [
      "https://www.utexas.edu/faculty-and-staff-resources",
      "https://www.utexas.edu/family-and-visitor-resources",
      "https://www.utexas.edu/alumni-resources"
    ],
    blocks: [
      {
        name: "columns-resource",
        instances: [".utexas-layout--twocol-wrapper"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Content",
        selector: ".layout-builder__region",
        style: null,
        blocks: ["columns-resource"],
        defaultContent: ["h1"]
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
  var import_resource_hub_default = {
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
  return __toCommonJS(import_resource_hub_exports);
})();
