import { load } from 'cheerio';
import { read, readFileSync, writeFileSync } from 'fs';

import { Crawler } from './Crawler.js';
import { HTMLScrapper } from './scrappers/HTMLScrapper.js';

import { GPTClassifier, CATEGORIES_A } from './classifiers/index.js';

const dir = './sites/c64audio.com/c64audio_com_collections_books';

const features = JSON.parse(readFileSync(`${dir}/features.json`, 'utf-8'));
const url = features.url;
const openGraph = readFileSync(features.openGraph, 'utf-8');
const contentText = readFileSync(features.contentText, 'utf-8');

const classifier = new GPTClassifier(GPTClassifier.GPT35);

classifier.usePromptTextOnly(CATEGORIES_A);
const result = await classifier.execute({
  url,
  contentText,
  openGraph,
});

console.log(result);

// const crawler = new Crawler(
//   ['https://github.com/kuzzleio/kuzzle-device-manager'],
//   [new HTMLScrapper()]
// );

// await crawler.start();
