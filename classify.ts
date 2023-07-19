import { readdirSync } from 'node:fs';

import {
  CATEGORIES_B,
  CATEGORIES_A,
  PagesClassifier,
  GPTClassifier,
  PROMPT_B,
  EmbeddingsClassifier,
  PROMPT_C,
  GPTModels,
  CATEGORIES_C,
  PROMPT_B2,
  CATEGORIES_D,
  PROMPT_A,
  FunnelClassifier,
  MockClassifier,
  GzipClassifier,
} from './classifiers';
import { getFeatures, getSitesEntries } from 'tools';

// const gpt35Classifier = new GPTClassifier(
//   GPTModels.GPT35_16K,
//   CATEGORIES_D,
//   PROMPT_B,
//   {
//     // estimateOnly: true,
//     // force: true,
//   }
// );
// await gpt35Classifier.init();
// const gpt35Classifier2 = new GPTClassifier(
//   GPTModels.GPT35_16K,
//   CATEGORIES_D,
//   PROMPT_B,
//   {
//     // estimateOnly: true,
//     // force: true,
//   }
// );
// await gpt35Classifier2.init();

// const embeddingsClassifier = new EmbeddingsClassifier(CATEGORIES_D, {
//   // estimateOnly: true,
//   // force: true,
// });
// await embeddingsClassifier.init();

// const mockClassifier = new MockClassifier(gpt35Classifier.name, CATEGORIES_D, {
// estimateOnly: true,
// force: true,
// });
// await mockClassifier.init();

// const funnelClassifier = new FunnelClassifier(
//   mockClassifier,
//   gpt35Classifier,
//   CATEGORIES_D,
//   {
//     // estimateOnly: true,
//     // force: true,
//   }
// );
// await funnelClassifier.init();

const features = getFeatures(['./sites/c64audio.com']);

const gzipClassifier = new GzipClassifier(CATEGORIES_D, features, {
  // estimateOnly: true,
  force: true,
});
await gzipClassifier.init();

const classifier = gzipClassifier;

const pagesClassifier = new PagesClassifier([classifier]);

const total = {
  [classifier.name]: {
    tokens: 0,
    cost: 0,
    time: 0,
  },
};

let pages = 0;
for (let i = 2; i < process.argv.length; i++) {
  const consumption = await pagesClassifier.start(process.argv[i]);

  if (consumption.classifiers[classifier.name]) {
    total[classifier.name].tokens +=
      consumption.classifiers[classifier.name].tokens;
    total[classifier.name].cost +=
      consumption.classifiers[classifier.name].cost;
    total[classifier.name].time +=
      consumption.classifiers[classifier.name].time;
  }
  pages += consumption.pages;
}

console.log(`${pages} pages`);
console.log(total);
