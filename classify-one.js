import { load } from 'cheerio';
import { read, readFileSync, writeFileSync } from 'fs';

import { Crawler } from './Crawler.js';
import { HTMLScrapper } from './scrappers/HTMLScrapper.js';

import {
  GPTClassifier,
  CATEGORIES_A,
  CATEGORIES_B,
  PROMPT_B,
  PROMPT_A,
  EmbeddingsClassifier,
} from './classifiers/index.js';

const dir =
  './sites/www.audio-technica.com/www_audio_technica_com_en_gb_cartridges_best_for';

const features = JSON.parse(readFileSync(`${dir}/features.json`, 'utf-8'));
const url = features.url;
const openGraph = readFileSync(features.openGraph, 'utf-8');
const contentText = readFileSync(features.contentText, 'utf-8');

const gptClassifier = new GPTClassifier(GPTClassifier.GPT35, {
  force: true,
});
gptClassifier.usePromptTextOnly(PROMPT_B, CATEGORIES_B);

const embeddingsClassifier = new EmbeddingsClassifier({
  suffix: '-cB',
});
await embeddingsClassifier.init(CATEGORIES_B);

const result = await embeddingsClassifier.execute({
  url,
  contentText,
  openGraph,
});

console.log(result);
