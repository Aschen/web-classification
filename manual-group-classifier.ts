import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CATEGORIES_A, CATEGORIES_D } from './classifiers';
import { ask } from './tools';

const input = process.argv[2];
const exclude = process.argv[3] || null;
const parts = input.split('/');
const CATEGORIES = CATEGORIES_D;

const siteDir = parts.slice(0, parts.length - 1).join('/');
const nodeName = parts[parts.length - 1];

const entries = readdirSync(siteDir, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory() && entry.name.startsWith(nodeName)) {
    console.log(join(siteDir, entry.name));
  }
}

let i = 0;
for (const cat of CATEGORIES.labels) {
  console.log(`${++i} ${cat}`);
}

console.log();
const answer = await ask('Which category? ', CATEGORIES.labels);

for (const entry of entries) {
  if (entry.isDirectory() && entry.name.startsWith(nodeName)) {
    const features = JSON.parse(
      readFileSync(join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    features.classification.manual = {
      answer: [answer],
    };

    writeFileSync(
      join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}
