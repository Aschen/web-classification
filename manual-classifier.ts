import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CATEGORIES_A } from './classifiers';
import { Chromium, ask } from './tools';

const siteDir = process.argv[2];
const browser = await new Chromium().init();

const entries = readdirSync(siteDir, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory()) {
    const features = JSON.parse(
      readFileSync(join(siteDir, entry.name, 'features.json'), 'utf-8')
    );
    if (features.classification.manual) {
      continue;
    }

    let i = 0;
    for (const cat of CATEGORIES_A.labels) {
      console.log(`${++i} ${cat}`);
    }
    console.log('');
    console.log(readFileSync(features.openGraph, 'utf-8'));
    if (browser) {
      await browser.visit(features.url);
    }
    const answer = await ask('Which category? ', CATEGORIES_A.labels);

    features.classification.manual = [answer];

    writeFileSync(
      join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}

await browser.dispose();
