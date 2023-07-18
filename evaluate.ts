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

// const classifier = new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES, PROMPT);
const classifier = new EmbeddingsClassifier(CATEGORIES);

const MANUAL_NAME = 'manual' + CATEGORIES.suffix;
const CLASSIFIER_NAME = classifier.name;
const browser = CORRECTION ? await new Chromium().init() : null;

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
    const manualAnswer = features.classification[MANUAL_NAME]?.answer?.at(0);

    total++;
    if (
      !manualAnswer ||
      classifierClassification?.answer.at(0) !== manualAnswer
    ) {
      errors++;
      if (manualAnswer) {
        continue;
      }
      if (!CORRECTION) {
        continue;
      }

      console.log('\n---');
      console.log(readFileSync(features.openGraph, 'utf-8'));
      let i = 3;
      for (const cat of CATEGORIES.labels) {
        console.log(`${i++}) ${cat}`);
      }
      console.log(
        `1) GPT-3.5 classification: ${classifierClassification?.answer}`
      );
      console.log(`2) Manual classification: ${manualAnswer}`);

      browser.visit(features.url);
      const answer = await ask('Which is correct? ', [
        classifierClassification?.answer?.at(0),
        manualAnswer,
        ...CATEGORIES.labels,
      ]);
      console.log(answer);
      features.classification[MANUAL_NAME] = {
        answer: [answer],
        correct: true,
      };

      writeFileSync(
        join(siteDir, entry.name, 'features.json'),
        JSON.stringify(features, null, 2)
      );
    }
  }
}

browser && (await browser.dispose());

console.log(`Total: ${total}`);
console.log(`Errors: ${errors}`);
console.log(`Success: ${((total - errors) * 100) / total} %`);
