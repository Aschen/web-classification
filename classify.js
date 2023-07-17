import { readdirSync } from 'fs';
import {
  CATEGORIES_B,
  CATEGORIES_A,
  PagesClassifier,
  GPTClassifier,
  PROMPT_B,
  EmbeddingsClassifier,
  PROMPT_C,
  CATEGORIES_A_WITH_DESCRIPTION,
} from './classifiers/index.js';

const gpt35Classifier = new GPTClassifier(GPTClassifier.GPT35_16K, {
  estimateOnly: true,
  force: true,
  suffix: '-cB-pC',
});
gpt35Classifier.usePromptTextOnly(PROMPT_B, CATEGORIES_B);

const embeddingsClassifier = new EmbeddingsClassifier({
  estimateOnly: false,
  force: true,
  suffix: '-cA-bis',
});
await embeddingsClassifier.init(CATEGORIES_A_WITH_DESCRIPTION);

const classifier = embeddingsClassifier;

const pagesClassifier = new PagesClassifier([classifier]);

const total = {
  [classifier.name]: {
    tokens: 0,
    cost: 0,
  },
};

let pages = 0;
for (let i = 2; i < process.argv.length; i++) {
  const consumption = await pagesClassifier.start(process.argv[i]);
  if (consumption[classifier.name]) {
    total[classifier.name].tokens += consumption[classifier.name].tokens;
    total[classifier.name].cost += consumption[classifier.name].cost;
  }
  pages += consumption.pages;
}

console.log(`${pages} pages`);
console.log(total);
