import {
  read,
  readFileSync,
  readdir,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import path from 'path';
import Readline from 'readline';

import { chromium } from 'playwright';

import {
  CATEGORIES_A,
  CATEGORIES_B,
  EmbeddingsClassifier,
  GPTClassifier,
} from './classifiers/index.js';

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

const CORRECTION = false;
const CLASSIFIER_NAME = EmbeddingsClassifier.NAME + '-cA-bis';
const MANUAL_NAME = 'manual' + '';
const CATEGORIES = CATEGORIES_B;

const browser = CORRECTION ? await new Chromium().init() : null;

const readLine = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question, choices) {
  return new Promise((resolve) => {
    readLine.question(question, (answer) => {
      resolve(choices[parseInt(answer, 10) - 1]);
    });
  });
}

let total = 0;
let errors = 0;
for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    const classifierClassification = features.classification[CLASSIFIER_NAME];
    const manualClassification = features.classification[MANUAL_NAME];

    total++;
    if (classifierClassification.answer[0] !== manualClassification[0]) {
      errors++;
      if (!CORRECTION) {
        continue;
      }
      console.log('\n---');
      console.log(readFileSync(features.openGraph, 'utf-8'));
      let i = 3;
      for (const cat of CATEGORIES) {
        console.log(`${i++}) ${cat}`);
      }
      console.log(
        `1) GPT-3.5 classification: ${classifierClassification.answer}`
      );
      console.log(`2) Manual classification: ${manualClassification}`);

      await browser.visit(features.url);
      const answer = await ask('Which is correct? ', [
        classifierClassification.answer[0],
        manualClassification[0],
        ...CATEGORIES,
      ]);
      console.log(answer);
      features.classification[MANUAL_NAME] = [answer];

      writeFileSync(
        path.join(siteDir, entry.name, 'features.json'),
        JSON.stringify(features, null, 2)
      );
    }
  }
}

readLine.close();
browser && (await browser.dispose());

console.log(`Total: ${total}`);
console.log(`Errors: ${errors}`);
console.log(`Success: ${((total - errors) * 100) / total} %`);
