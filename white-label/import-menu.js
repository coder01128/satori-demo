#!/usr/bin/env node
/* ================================================================
   import-menu.js — extract a restaurant menu from a file and
   write it to menu-data.js using the Anthropic API.

   Usage:
     node import-menu.js <path-to-menu-file>

   Supported input formats:
     • PDF   (.pdf)
     • Image (.jpg / .jpeg / .png / .webp / .gif)
     • Text  (.txt / .md / plain text)

   Requirements:
     npm install          (installs @anthropic-ai/sdk)
     ANTHROPIC_API_KEY    environment variable must be set

   Output:
     Overwrites menu-data.js in the same directory as this script.
   ================================================================ */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Validate arguments ─────────────────────────────────────────
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node import-menu.js <path-to-menu-file>');
  console.error('Supported: .pdf  .jpg  .jpeg  .png  .webp  .gif  .txt  .md');
  process.exit(1);
}

const resolvedPath = resolve(inputPath);
const ext = extname(resolvedPath).toLowerCase();

// ── Determine content block type ───────────────────────────────
const IMAGE_TYPES = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
};

const TEXT_TYPES = ['.txt', '.md', '.csv'];

function buildContentBlocks(filePath, fileExt) {
  const fileBytes = readFileSync(filePath);
  const b64 = fileBytes.toString('base64');

  if (fileExt === '.pdf') {
    return [
      {
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: b64,
        },
      },
    ];
  }

  if (IMAGE_TYPES[fileExt]) {
    return [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: IMAGE_TYPES[fileExt],
          data: b64,
        },
      },
    ];
  }

  if (TEXT_TYPES.includes(fileExt) || !fileExt) {
    // Plain text — send as a text block (no binary encoding needed)
    return [
      {
        type: 'text',
        text: readFileSync(filePath, 'utf-8'),
      },
    ];
  }

  console.error(`Unsupported file type: ${fileExt}`);
  console.error('Supported: .pdf  .jpg  .jpeg  .png  .webp  .gif  .txt  .md');
  process.exit(1);
}

// ── Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a data-extraction assistant for a restaurant ordering app.
Your sole job is to read the provided menu document or image and produce a
JavaScript data file. Output ONLY valid JavaScript — no prose, no markdown
fences, no commentary before or after the code block.`;

const USER_PROMPT = `Extract every menu item from the attached menu and output a complete
\`MENU_DATA\` constant in exactly this format:

const MENU_DATA = {
  "categories": [
    {
      "id": "category-slug",
      "name": "Category Name",
      "items": [
        {
          "id": "item-slug",
          "name": "Item Name",
          "price": 00.00,
          "description": "One or two sentence description."
        }
      ]
    }
  ]
};

Rules:
- id values must be lowercase, hyphen-separated slugs (e.g. "grilled-chicken").
- price must be a plain number — no currency symbols, no quotes.
- Keep descriptions concise (1–2 sentences) and factual.
- Group items into sensible categories that reflect the original menu.
- If a price is not shown, omit that item.
- Do NOT add any code outside the \`const MENU_DATA = { … };\` block.
- The output must be immediately writable to a .js file and parseable by a browser.

Now extract the menu:`;

// ── Main ───────────────────────────────────────────────────────
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    process.exit(1);
  }

  console.log(`Reading: ${basename(resolvedPath)}`);
  const contentBlocks = buildContentBlocks(resolvedPath, ext);

  const client = new Anthropic({ apiKey });
  const outputPath = resolve(__dirname, 'menu-data.js');

  console.log('Sending to Claude… (streaming)\n');

  let fullText = '';

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          ...contentBlocks,
          { type: 'text', text: USER_PROMPT },
        ],
      },
    ],
  });

  // Stream text tokens to stdout as they arrive
  stream.on('text', (text) => {
    process.stdout.write(text);
    fullText += text;
  });

  await stream.finalMessage();

  // ── Extract just the JS block ──────────────────────────────
  // Strip any accidental markdown fences if present
  let js = fullText.trim();
  const fenceMatch = js.match(/```(?:javascript|js)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    js = fenceMatch[1].trim();
  }

  // Validate that we got a MENU_DATA constant
  if (!js.includes('const MENU_DATA')) {
    console.error('\n\nError: Claude did not return a valid MENU_DATA constant.');
    console.error('Raw output saved to menu-data-raw.txt for inspection.');
    writeFileSync(resolve(__dirname, 'menu-data-raw.txt'), fullText, 'utf-8');
    process.exit(1);
  }

  // ── Write menu-data.js ─────────────────────────────────────
  const header = `/* ================================================================
   menu-data.js — generated by import-menu.js
   Source file: ${basename(resolvedPath)}
   Generated:   ${new Date().toISOString()}
   ================================================================ */\n\n`;

  writeFileSync(outputPath, header + js + '\n', 'utf-8');

  console.log(`\n\nDone! Menu data written to: menu-data.js`);
  console.log('Review the file, then bump CACHE_NAME in service-worker.js before deploying.');
}

main().catch((err) => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
