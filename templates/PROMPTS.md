# Reusable Prompts for AEM EDS Migration

---

## Variables (fill once, use everywhere)

```yaml
SOURCE_SITE: ""          # https://www.example.com
SOURCE_CMS: ""           # Drupal 11, WordPress 6.x, Sitecore, etc.
PROJECT_TYPE: ""         # xwalk | doc | da
GITHUB_REPO: ""          # org/repo-name
AEM_AUTHOR_HOST: ""      # author-pXXXXX-eXXXXX.adobeaemcloud.com
AEM_SITE_PATH: ""        # /content/my-project
AEM_DAM_PATH: ""         # /content/dam/my-project
AEM_SITE_NAME: ""        # my-project
PREVIEW_ORG: ""          # github org
PREVIEW_SITE: ""         # github repo name
BLOCK_LIBRARY_URL: ""    # library.json endpoint
```

---

## 1. Setup Prompt

```
Set up a new AEM EDS project:
- Project: {{AEM_SITE_NAME}}, type: {{PROJECT_TYPE}}
- Repo: {{GITHUB_REPO}}, branch: main
- AEM: {{AEM_AUTHOR_HOST}}, site: {{AEM_SITE_PATH}}, DAM: {{AEM_DAM_PATH}}

Tasks:
1. Scaffold from AEM boilerplate (blocks/, styles/, tools/importer/, content/)
2. Configure .migration/project.json with above values
3. Extract brand design from {{SOURCE_SITE}} → styles/styles.css
4. Set up linting (npm run lint)
5. Create documentation: CLAUDE.md, Instructions.md, CONTEXT.md
6. Verify: aem up works at localhost:3000
7. Commit and push
```

---

## 2. Warm-Up Prompt (session start)

```
Read CLAUDE.md, Instructions.md, CONTEXT.md, and .migration/project.json.
Summarize: project name, source site, templates, blocks available, key rules.
Then await instructions.
```

---

## 3. Migration Prompt

```
Migrate these pages from {{SOURCE_SITE}} to AEM EDS:
- [URLs]

Read Instructions.md for blocks and DOM selectors.

Per page:
1. Run importer → tools/importer/import-{template}.bundle.js
2. Scrape source — catalog ALL images, videos, sections
3. Download images → content/images/{page-name}/
4. Download videos → content/media/
5. Fix .plain.html — local paths, correct blocks, metadata last
6. Preview — zero external URLs, zero broken images
7. git add -f content/ && commit && push

Rules: Never leave external URLs. Always verify preview. Always metadata last.
```

---

## 4. Validation Prompt (post-migration audit)

```
Validate these migrated pages against their source:
- [URLs]

Per page:
1. Scrape source fresh — list all images, videos, sections
2. Read content/{page-name}.plain.html
3. Audit:
   - All images present and LOCAL? (no external URLs)
   - All image files exist on disk and non-empty?
   - All sections from source represented?
   - Hero type correct? (video vs image vs none)
   - Metadata block present as last section?
   - No artifacts? (skip links, breadcrumbs, cookie text)
4. Fix all issues found
5. Verify in preview: external=0, broken=0
6. git add -f content/ && commit

Report: table of page | images (local/external/broken) | sections | status
```

---

## 5. Documentation Prompt (generate guides)

```
Generate three handover docs in docs/ by reading the project's current state:

docs/AUTHOR-GUIDE.md — For content editors:
- Page templates (what to use when)
- Block palette (each block's fields and when to use)
- Section styles, metadata, image guidelines
- How to preview and publish

docs/DEVELOPER-GUIDE.md — For developers:
- Architecture (repo structure, how EDS works)
- Block inventory (custom vs standard, content models)
- How to create a new block (step-by-step)
- Import pipeline (parsers, transformers, known gaps)
- Design tokens, code standards, debugging

docs/ADMIN-GUIDE.md — For DevOps/admins:
- Environment config (author, preview, live URLs)
- Deployment (push = deploy, no CI/CD)
- CDN/cache management
- Access control, monitoring, troubleshooting

Source of truth: CLAUDE.md, Instructions.md, CONTEXT.md, styles/styles.css, blocks/, tools/importer/, .migration/project.json
Each file self-contained. No duplication across files.
```
