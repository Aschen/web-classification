import {
  read,
  readFileSync,
  readdir,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import {
  CATEGORIES_A,
  CATEGORIES_B,
  CATEGORIES_C,
  CATEGORIES_D,
  EmbeddingsClassifier,
  GPTClassifier,
  GPTModels,
  PROMPT_B,
  PROMPT_B2,
  PageFeatures,
} from './classifiers';
import { Chromium, ask } from './tools';

const CATEGORIES = CATEGORIES_D;
const PROMPT = PROMPT_B;
const CATEGORY = 'account login/register';

const classifier = new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES, PROMPT);
// const classifier = new EmbeddingsClassifier(CATEGORIES);

const MANUAL_NAME = 'manual' + CATEGORIES.suffix;
const CLASSIFIER_NAME = classifier.name;
const browser = await new Chromium().init();

let total = 0;
let errors = 0;
for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const features: PageFeatures = JSON.parse(
      readFileSync(join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    const classifierClassification = features.classification[CLASSIFIER_NAME];
    const manualClassification = features.classification[MANUAL_NAME];
    if (manualClassification.answer[0] === CATEGORY) {
      console.log(
        `1) GPT-3.5 classification: ${classifierClassification.answer}`
      );
      console.log(`2) Manual classification: ${manualClassification.answer}`);

      await browser.visit(features.url);
      await ask('Press 1 to continue', ['']);
    }
  }
}

browser && (await browser.dispose());

console.log(`Total: ${total}`);
console.log(`Errors: ${errors}`);
console.log(`Success: ${((total - errors) * 100) / total} %`);
