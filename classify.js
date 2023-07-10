import {
  CATEGORIES_A,
  PagesClassifier,
  GPTClassifier,
} from './classifiers/index.js';

const gptClassifier = new GPTClassifier(GPTClassifier.GPT35);

gptClassifier.usePromptTextOnly(CATEGORIES_A);

const pagesClassifier = new PagesClassifier([gptClassifier]);

await pagesClassifier.start('./sites/c64audio.com');
