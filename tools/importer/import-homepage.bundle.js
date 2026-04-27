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

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".homepage-hero__background img, .image-wrapper img, img");
    const headline = element.querySelector(".homepage-hero__headline, h2");
    const cells = [];
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(" field:image "));
    if (bgImg) {
      const img = bgImg.cloneNode(true);
      imgFrag.appendChild(img);
    }
    cells.push([imgFrag]);
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (headline) {
      const h1 = document.createElement("h1");
      h1.innerHTML = headline.innerHTML.replace(/<br\s*\/?>/gi, "<br>");
      textFrag.appendChild(h1);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document }) {
    const cardLinks = element.querySelectorAll(".university-stories__linked-box");
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const img = cardLink.querySelector(".image-wrapper img");
      const headline = cardLink.querySelector(".headline, .content-wrapper .headline");
      const href = cardLink.getAttribute("href");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        imgFrag.appendChild(img.cloneNode(true));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (headline) {
        const h3 = document.createElement("h3");
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = headline.textContent.trim();
          h3.appendChild(link);
        } else {
          h3.textContent = headline.textContent.trim();
        }
        textFrag.appendChild(h3);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse3(element, { document }) {
    const img = element.querySelector(".mid-page-bkgd img, .ut-copy img");
    const heading = element.querySelector("h2");
    const paragraphs = element.querySelectorAll(".mid-page-bkgd p:not(:last-child), .col-12.col-md-8 > p:not(:last-child)");
    const cta = element.querySelector("a.ut-btn, a.ut-cta-link--angle-right");
    const col1 = document.createDocumentFragment();
    if (img) {
      col1.appendChild(img.cloneNode(true));
    }
    const col2 = document.createDocumentFragment();
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col2.appendChild(h2);
    }
    paragraphs.forEach((p) => {
      if (!p.querySelector("a.ut-btn, a.ut-cta-link--angle-right")) {
        const para = document.createElement("p");
        para.textContent = p.textContent.trim();
        col2.appendChild(para);
      }
    });
    if (cta) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      p.appendChild(link);
      col2.appendChild(p);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-impact.js
  var KNOWN_STATS = {
    "The Longhorn Experience": [
      { text: "#1", label: "Public University in Texas" },
      { text: "#7", label: "Public University in the U.S." }
    ],
    "Big Ideas. Bigger Impact.": [
      { text: "1,291", label: "Patents in the Last 10 Years" },
      { text: "4,400", label: "Active Externally Funded Projects in FY25" },
      { text: "$1.37B", label: "Total Expenditures in FY25" }
    ],
    "Learning With Purpose": [
      { text: "76", label: "Undergraduate and Graduate Programs in the Top 10" },
      { text: "170+", label: "Areas of Study" }
    ]
  };
  function parse4(element, { document }) {
    const searchRoot = element.closest(".block-coresite-homepage") || element;
    const img = searchRoot.querySelector(".image-wrapper img, picture img");
    const heading = searchRoot.querySelector(".content-wrapper h2, .differentiator h2");
    const description = searchRoot.querySelector(".content-wrapper > p, .differentiator > .content-parent p");
    const cta = searchRoot.querySelector(".differentiator-link-wrapper a, .content-wrapper a.ut-btn");
    let stats = element.querySelectorAll(".stats .fade-in");
    if (stats.length === 0) {
      stats = searchRoot.querySelectorAll(".stats .fade-in");
    }
    const col1 = document.createDocumentFragment();
    if (img) {
      const cloned = img.cloneNode(true);
      if (cloned.src) {
        cloned.src = cloned.src.replace("1170x1536", "585x768");
      }
      col1.appendChild(cloned);
    }
    const col2 = document.createDocumentFragment();
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col2.appendChild(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      col2.appendChild(p);
    }
    if (cta) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      p.appendChild(link);
      col2.appendChild(p);
    }
    let statsAdded = false;
    stats.forEach((stat) => {
      const counter = stat.querySelector(".counter");
      const label = stat.querySelector("span:not(.counter):not(.sr-only)");
      if (counter && label) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        let prefix = "";
        if (counter.classList.contains("dollars") && counter.classList.contains("billions")) prefix = "$";
        if (counter.classList.contains("thousands")) {
          strong.textContent = prefix + counter.textContent.trim() + "K";
        } else if (counter.classList.contains("billions")) {
          strong.textContent = prefix + counter.textContent.trim() + "B";
        } else {
          strong.textContent = "#" + counter.textContent.trim();
        }
        p.appendChild(strong);
        p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(label.textContent.trim().replace(/\s+/g, " ")));
        col2.appendChild(p);
        statsAdded = true;
      }
    });
    if (!statsAdded && heading) {
      const headingText = heading.textContent.trim();
      const knownStats = KNOWN_STATS[headingText];
      if (knownStats) {
        knownStats.forEach((stat) => {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = stat.text;
          p.appendChild(strong);
          p.appendChild(document.createElement("br"));
          p.appendChild(document.createTextNode(stat.label));
          col2.appendChild(p);
        });
      }
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-impact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-outro.js
  function parse5(element, { document }) {
    const heading = element.querySelector(".section-title, h2");
    const description = element.querySelector(".container .row .col-md-7 > p, .utexas-ut-outro > .container p");
    const cta = element.querySelector("a.ut-btn--secondary, a.ut-cta-link--angle-right");
    const stats = element.querySelectorAll(".stats .fade-in");
    const video = element.querySelector(".ut-outro-img video, video");
    const col1 = document.createDocumentFragment();
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim().replace(/\s+/g, " ");
      col1.appendChild(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      col1.appendChild(p);
    }
    if (cta) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      p.appendChild(link);
      col1.appendChild(p);
    }
    stats.forEach((stat) => {
      const counter = stat.querySelector(".counter");
      const label = stat.querySelector(".small:last-child, span.small.text-uppercase");
      const srOnly = stat.querySelector(".sr-only");
      if (counter) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = srOnly ? srOnly.textContent.trim() : counter.textContent.trim();
        p.appendChild(strong);
        if (label) {
          p.appendChild(document.createElement("br"));
          p.appendChild(document.createTextNode(label.textContent.trim().replace(/\s+/g, " ")));
        }
        col1.appendChild(p);
      }
    });
    const col2 = document.createDocumentFragment();
    if (video) {
      const src = video.getAttribute("src");
      if (src) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = src.startsWith("/") || src.startsWith("http") ? src : `https://www.utexas.edu/${src}`;
        link.textContent = "Video";
        p.appendChild(link);
        col2.appendChild(p);
      }
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-outro", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/utexas-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#block-coretheme-search-form",
        ".video-wrapper",
        "#video-controls",
        ".block-bundle-utexas-hero-video > .video-wrapper"
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
      const styledEls = element.querySelectorAll("[data-section-style]");
      styledEls.forEach((el) => {
        const style = el.getAttribute("data-section-style");
        el.removeAttribute("data-section-style");
        if (style) {
          const metaBlock = WebImporter.Blocks.createBlock(payload.document, {
            name: "Section Metadata",
            cells: { style }
          });
          const nextHr = el.nextElementSibling && el.nextElementSibling.tagName === "HR" ? el.nextElementSibling : null;
          if (nextHr) {
            nextHr.before(metaBlock);
          } else {
            el.after(metaBlock);
          }
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

  // tools/importer/transformers/utexas-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== H2.before) return;
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;
    const document = element.ownerDocument || element.getRootNode();
    template.sections.forEach((section, idx) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) return;
      if (idx > 0) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
      if (section.style) {
        sectionEl.setAttribute("data-section-style", section.style);
      }
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "cards-article": parse2,
    "columns-promo": parse3,
    "columns-impact": parse4,
    "columns-outro": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "University homepage with hero video, news stories, impact sections, and call-to-action outro",
    urls: [
      "https://www.utexas.edu/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: [".block-coresite-homepagehero"]
      },
      {
        name: "cards-article",
        instances: [".block-coresite-stories"]
      },
      {
        name: "columns-promo",
        instances: ["#block-coretheme-homepagemidpagepromo"]
      },
      {
        name: "columns-impact",
        instances: [".block-coresite-impact-1", ".block-coresite-impact-2", ".block-coresite-impact-3"]
      },
      {
        name: "columns-outro",
        instances: [".block-homepage-outro"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Video + Headline",
        selector: ".block-coresite-homepagehero",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "University Stories / News Cards",
        selector: ".block-coresite-stories",
        style: null,
        blocks: ["cards-article"],
        defaultContent: [".action-links"]
      },
      {
        id: "section-3",
        name: "Mid-page Promo - UT Dell Campus",
        selector: "#block-coretheme-homepagemidpagepromo",
        style: "burnt-orange",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Impact Intro",
        selector: ".block-coresite-impact-0",
        style: null,
        blocks: [],
        defaultContent: [".section-title", "p"]
      },
      {
        id: "section-5",
        name: "The Longhorn Experience",
        selector: ".block-coresite-impact-1",
        style: null,
        blocks: ["columns-impact"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Big Ideas Bigger Impact",
        selector: ".block-coresite-impact-2",
        style: null,
        blocks: ["columns-impact"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Learning With Purpose",
        selector: ".block-coresite-impact-3",
        style: null,
        blocks: ["columns-impact"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "For Texas For the Future",
        selector: ".block-homepage-outro",
        style: "burnt-orange",
        blocks: ["columns-outro"],
        defaultContent: []
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
      main.querySelectorAll(".stats").forEach((el) => el.remove());
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
