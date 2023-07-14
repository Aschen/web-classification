import { readdirSync } from 'fs';
import {
  CATEGORIES_B,
  CATEGORIES_A,
  PagesClassifier,
  GPTClassifier,
  PROMPT_B,
} from './classifiers/index.js';

const gpt35Classifier = new GPTClassifier(GPTClassifier.GPT35_16K, {
  estimateOnly: false,
  force: true,
  suffix: '-cA-pB',
});
gpt35Classifier.usePromptTextOnly(PROMPT_B, CATEGORIES_A);

const pagesClassifier = new PagesClassifier([gpt35Classifier]);

const total = {
  [gpt35Classifier.name]: {
    tokens: 0,
    cost: 0,
  },
};

let pages = 0;
for (let i = 2; i < process.argv.length; i++) {
  const consumption = await pagesClassifier.start(process.argv[i]);
  if (consumption[gpt35Classifier.name]) {
    total[gpt35Classifier.name].tokens +=
      consumption[gpt35Classifier.name].tokens;
    total[gpt35Classifier.name].cost += consumption[gpt35Classifier.name].cost;
  }
  pages += consumption.pages;
}

console.log(`${pages} pages`);
console.log(total);
