import { readFileSync } from 'node:fs';

import { Crawler } from './Crawler.js';
import { SitemapReader, PagesSampler } from './collectors/index.js';
import { HTMLScrapper, PlaywrightScrapper } from './scrappers/index.js';

const ecommerceSites = [];

for (const line of readFileSync('./ecommerce.md', 'utf-8').split('\n')) {
  if (line.startsWith('https')) {
    ecommerceSites.push(line);
  }
}

for (const site of ecommerceSites) {
  const crawler = new Crawler(site, [new HTMLScrapper()]);

  await crawler.start();
}
