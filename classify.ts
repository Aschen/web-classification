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
import {
  evaluateDataset,
  getFeatures,
  getSitesEntries,
  splitDatasetBySampling,
  splitDatasetBySites,
} from 'tools';

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

const { testSet, trainSet } = splitDatasetBySites(process.argv.slice(2));

const gzipClassifier = new GzipClassifier(CATEGORIES_D, {
  // estimateOnly: true,
  force: true,
});
await gzipClassifier.init(trainSet);

const classifier = gzipClassifier;

const pagesClassifier = new PagesClassifier([classifier]);

const report = await pagesClassifier.start(testSet);

console.log(`${report.pages} pages`);
console.log(report.classifiers);

const { total, errors, accuracy } = evaluateDataset(classifier, testSet);

console.log(' ---');
console.log(`Total: ${total}`);
console.log(`Errors: ${errors}`);
console.log(`Accuracy: ${accuracy}`);
