import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import Readline from 'readline';

import { chromium } from 'playwright';

import { CATEGORIES_A } from './classifiers/index.js';

const readLine = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question, choices) {
  return new Promise((resolve) => {
    readLine.question(question, (answer) => {
      resolve(choices[parseInt(answer) - 1]);
    });
  });
}

class Chromium {
  async init() {
    this.browser = await chromium.launch({
      headless: false,
    });

    this.context = await this.browser.newContext();

    this.page = await this.context.newPage();

    return this;
  }

  async visit(url) {
    await this.page.goto(url);
  }

  async dispose() {
    await this.browser.close();
  }
}

const siteDir = process.argv[2];
const browser = await new Chromium().init();

const entries = readdirSync(siteDir, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory()) {
    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );
    if (features.classification.manual) {
      continue;
    }

    let i = 0;
    for (const cat of CATEGORIES_A) {
      console.log(`${++i} ${cat}`);
    }
    console.log('');
    console.log(readFileSync(features.openGraph, 'utf-8'));
    if (browser) {
      await browser.visit(features.url);
    }
    const answer = await ask('Which category? ', CATEGORIES_A);

    features.classification.manual = [answer];

    writeFileSync(
      path.join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}

await browser.dispose();
readLine.close();
