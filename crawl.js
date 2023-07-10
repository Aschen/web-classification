import { readFileSync } from 'node:fs';

import { Crawler } from './Crawler.js';
import { SitemapReader, PagesSampler } from './collectors/index.js';
import { HTMLScrapper } from './scrappers/index.js';

const ecommerceSites = ['https://c64audio.com'];

// for (const line of readFileSync('./ecommerce.md', 'utf-8').split('\n')) {
//   if (line.startsWith('https')) {
//     ecommerceSites.push(line);
//   }
// }

for (const site of ecommerceSites) {
  const reader = new SitemapReader(site);

  const { links, mainLinks } = await reader.collect();
  reader.save();

  const sampler = new PagesSampler(links, {
    leafSampleSize: 5,
    maxBranchSize: 10,
  });

  const siteLinks = sampler.sample(mainLinks);
  sampler.save();

  const crawler = new Crawler(siteLinks, [new HTMLScrapper()]);

  await crawler.start();
}
