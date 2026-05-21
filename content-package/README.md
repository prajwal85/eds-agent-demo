# PSI Homepage Content Package

## Upload Instructions

### Organization: `prajwal85`
### Site: `eds-agent-demo`

## How to Upload

### Option 1: AEM Sidekick (Recommended)

1. Open the AEM Sidekick extension in your browser
2. Navigate to `https://main--eds-agent-demo--prajwal85.aem.page/`
3. Click "Upload content" in the Sidekick toolbar
4. Enter:
   - **Organization:** `prajwal85`
   - **Site:** `eds-agent-demo`
5. Select the `index.html` file from this directory
6. Click Upload

### Option 2: AEM Admin API

```bash
# Trigger preview (content must be in git repo first)
curl -X POST "https://admin.hlx.page/preview/prajwal85/eds-agent-demo/main/content/index"

# Trigger publish (after preview is confirmed)
curl -X POST "https://admin.hlx.page/live/prajwal85/eds-agent-demo/main/content/index"
```

### Option 3: Git Push (Automatic)

Content is already in the repository at `content/index.plain.html`. Once the PR is merged to `main`, the content will be automatically available at:

- **Preview:** https://main--eds-agent-demo--prajwal85.aem.page/content/index
- **Live:** https://main--eds-agent-demo--prajwal85.aem.live/content/index

## Content File

- `index.html` — PSI Exams homepage (migrated from https://www.psiexams.com/)

## Blocks Used

| Block | Variant | Section |
|-------|---------|---------|
| Hero | homepage | Hero (dark) |
| Cards | service | Services (dark) |
| Cards | feature | Features |
| Carousel | testimonial | Success Stories (dark) |
| Columns | brand | Brands (dark) |
| Carousel | article | Knowledge Hub |
| Hero | cta | CTA (dark) |
