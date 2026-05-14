# AEM EDS Migration Prompts

Concise, reusable prompts for migrating any website to AEM Edge Delivery Services.
Fill the variables, paste the prompt, let the agent handle the rest.

---

## Variables

```yaml
SOURCE_SITE: ""          # https://www.example.com
SOURCE_CMS: ""           # Drupal 11, WordPress 6.x, Sitecore, etc.
PROJECT_TYPE: ""         # xwalk | doc | da
GITHUB_REPO: ""          # org/repo-name
AEM_SITE_NAME: ""        # my-project
AEM_AUTHOR_HOST: ""      # author-pXXXXX-eXXXXX.adobeaemcloud.com
AEM_SITE_PATH: ""        # /content/my-project
AEM_DAM_PATH: ""         # /content/dam/my-project
```

---

## 1. Project Setup

```
Set up AEM EDS project:
- Source: {{SOURCE_SITE}} ({{SOURCE_CMS}})
- Type: {{PROJECT_TYPE}}, Repo: {{GITHUB_REPO}}
- AEM: {{AEM_AUTHOR_HOST}}, Site: {{AEM_SITE_PATH}}, DAM: {{AEM_DAM_PATH}}

Scaffold project, extract brand design, configure .migration/project.json, verify aem up works. Create CLAUDE.md, Instructions.md, CONTEXT.md. Commit and push.
```

---

## 2. Session Warm-Up

```
Read CLAUDE.md, Instructions.md, CONTEXT.md, .migration/project.json.
Summarize project state and await instructions.
```

---

## 3. Migration

```
Migrate {{SOURCE_SITE}} ({{SOURCE_CMS}}) to AEM EDS ({{PROJECT_TYPE}}):
- Repo: {{GITHUB_REPO}}
- AEM: {{AEM_SITE_PATH}}, DAM: {{AEM_DAM_PATH}}

URLs:
- [paste URLs here]

Analyze site → build import infrastructure → run import → validate & fix → commit.
Download all images/videos locally. Verify preview before commit.
```

---

## 4. Post-Migration Validation

```
Validate these migrated pages against source — fix any issues:
- [URLs]

Check: all images local, all sections present, hero type correct, metadata last, no artifacts.
Fix issues, verify preview (external=0, broken=0), commit.
```

---

## 5. Generate Documentation

```
Generate docs/AUTHOR-GUIDE.md, docs/DEVELOPER-GUIDE.md, docs/ADMIN-GUIDE.md from the project's current state.
Read all MD files, blocks/, styles/, tools/importer/, .migration/project.json.
Each guide self-contained, no duplication.
```
