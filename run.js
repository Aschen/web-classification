import { writeFileSync } from 'node:fs';

import { Crawler } from './Crawler.js';
import { SitemapReader } from './collect-links/SitemapReader.js';
import { PlaywrightScrapper } from './PlaywrightScrapper.js';

const reader = new SitemapReader('https://c64audio.com');

const links = await reader.collect();

const crawler = new Crawler(links, [new PlaywrightScrapper()]);

await crawler.start();
