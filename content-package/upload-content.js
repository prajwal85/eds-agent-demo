#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ORG = 'prajwal85';
const SITE = 'eds-agent-demo';
const BRANCH = 'main';

const ADMIN_API_BASE = `https://admin.hlx.page`;

const contentFiles = [
  { localPath: 'content/index.html', remotePath: '/index' },
];

async function uploadContent() {
  console.log(`\nUploading content to AEM Edge Delivery Services`);
  console.log(`Organization: ${ORG}`);
  console.log(`Site: ${SITE}`);
  console.log(`Branch: ${BRANCH}`);
  console.log('---\n');

  for (const file of contentFiles) {
    const filePath = path.join(__dirname, file.localPath);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const previewUrl = `${ADMIN_API_BASE}/preview/${ORG}/${SITE}/${BRANCH}${file.remotePath}`;

    console.log(`Uploading: ${file.remotePath}`);
    console.log(`  Preview URL: ${previewUrl}`);

    try {
      const response = await fetch(previewUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/html',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`  ✅ Success - Preview: ${result.preview?.url || 'pending'}`);
      } else {
        console.log(`  ❌ Failed: ${response.status} ${response.statusText}`);
        const body = await response.text();
        if (body) console.log(`  Response: ${body}`);
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n---');
  console.log('Upload complete.');
  console.log(`\nPreview your content at:`);
  console.log(`  https://main--${SITE}--${ORG}.aem.page/`);
  console.log(`\nLive URL (after publish):`);
  console.log(`  https://main--${SITE}--${ORG}.aem.live/`);
}

uploadContent();
