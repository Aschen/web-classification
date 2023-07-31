import { createWriteStream, readFileSync } from 'node:fs';

import JSONL from 'jsonl-parse-stringify';

import { splitDatasetBySites } from '../tools';
import { PROMPT_B, CATEGORIES_D } from '../classifiers';

const TRAIN_SITES = [
  'www.danielsjewelers.com',
  'www.harpercollins.com',
  'www.medievalcollectibles.com',
];
const PROMPT = PROMPT_B;
const CATEGORIES = CATEGORIES_D;

const { trainSet, testSet } = splitDatasetBySites(TRAIN_SITES);

const writeStream = createWriteStream('./train.jsonl');

for (const pageFeatures of trainSet) {
  const prompt = PROMPT.template(CATEGORIES)
    .replace('{url}', pageFeatures.url)
    .replace('{openGraph}', readFileSync(pageFeatures.openGraph, 'utf-8'))
    .replace('{contentText}', readFileSync(pageFeatures.contentText, 'utf-8'));

  const answer = new Set([
    ...pageFeatures.classification['gpt-3.5-turbo-16k-cD-pB'].answer,
    ...pageFeatures.classification['manual-cD'].answer,
  ]);

  const line = {
    prompt,
    completion: 'Answer: ' + Array.from(answer).join(','),
  };

  writeStream.write(JSON.stringify(line) + '\n');
}
writeStream.end();
writeStream.close();
