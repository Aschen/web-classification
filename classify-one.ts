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
} from './classifiers';

const dir =
  './sites/www.audio-technica.com/www_audio_technica_com_en_gb_cartridges_best_for';

const features = JSON.parse(readFileSync(`${dir}/features.json`, 'utf-8'));
const url = features.url;
const openGraph = readFileSync(features.openGraph, 'utf-8');
const contentText = readFileSync(features.contentText, 'utf-8');

const gptClassifier = new GPTClassifier(
  GPTModels.GPT35,
  CATEGORIES_B,
  PROMPT_B,
  {
    force: true,
  }
);
await gptClassifier.init();

const embeddingsClassifier = new EmbeddingsClassifier(CATEGORIES_B, {
  force: true,
});
await embeddingsClassifier.init();

const result = await embeddingsClassifier.execute({
  url,
  contentText,
  openGraph,
});

console.log(result);
