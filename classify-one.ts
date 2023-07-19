import { read, readFileSync, writeFileSync } from 'node:fs';

import { load } from 'cheerio';

import { Crawler } from './Crawler';
import { HTMLScrapper } from './scrappers';
import {
  GPTClassifier,
  CATEGORIES_A,
  CATEGORIES_B,
  PROMPT_B,
  PROMPT_A,
  EmbeddingsClassifier,
  GPTModels,
  BARTClassifier,
  PROMPT_B2,
  CATEGORIES_C,
  HFClassifier,
  CATEGORIES_D,
} from './classifiers';

const dir =
  './sites/www.audio-technica.com/www_audio_technica_com_en_gb_commercial_audio_microphone_series';

const features = JSON.parse(readFileSync(`${dir}/features.json`, 'utf-8'));
const urL = features.url;
const openGraph = readFileSync(features.openGraph, 'utf-8');
const contentText = readFileSync(features.contentText, 'utf-8');

const gptClassifier = new GPTClassifier(
  GPTModels.GPT35,
  CATEGORIES_C,
  PROMPT_B2,
  {
    force: true,
  }
);
await gptClassifier.init();

const embeddingsClassifier = new EmbeddingsClassifier(CATEGORIES_D, {
  force: true,
});
await embeddingsClassifier.init();

// const bartClassifier = new BARTClassifier(CATEGORIES_B, {
//   force: true,
// });
// await bartClassifier.init();

// const hfClassifier = new HFClassifier(CATEGORIES_C, {
//   force: true,
// });
// await hfClassifier.init();

const result = await embeddingsClassifier.execute({
  url: urL,
  contentText,
  openGraph,
});

console.log(result);
