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
  PROMPT_A,
  PROMPT_B,
  PROMPT_B2,
  PageFeatures,
} from './classifiers';
import { Chromium, ask } from './tools';

const CORRECTION = false;
const CATEGORIES = CATEGORIES_D;
const PROMPT = PROMPT_B;

const browser = new Chromium();
await browser.init();

// const classifier = new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES, PROMPT);
const classifier = new EmbeddingsClassifier(CATEGORIES);

const MANUAL_NAME = 'manual' + CATEGORIES.suffix;
const CLASSIFIER_NAME = classifier.name;

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

    const classifierAnswers =
      features.classification[CLASSIFIER_NAME]?.answer || [];
    const manualAnswer = features.classification[MANUAL_NAME]?.answer?.at(0);

    total++;
    if (!classifierAnswers.slice(0, 6).includes(manualAnswer)) {
      errors++;
      console.log(features.classification['manual-cD'].answer[0]);
      browser.visit(features.url);
      await ask('Press enter to continue', ['']);
    }
  }
}

console.log(`Total: ${total}`);
console.log(`Errors: ${errors}`);
console.log(`Success: ${((total - errors) * 100) / total} %`);
