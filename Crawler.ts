import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { PagesSampler, SitemapReader } from './collectors';
import { BaseScrapper } from './scrappers';

export class Crawler {
  private site: string;
  private inputLinks: string[];
  private links: Record<string, boolean | string>;
  private linksToVisit: string[];
  private scrappers: BaseScrapper[];

  constructor(site: string, scrappers: BaseScrapper[] = []) {
    this.site = site;
    this.inputLinks = [];
    this.links = {};
    this.linksToVisit = [];
    this.scrappers = scrappers;
  }

  get siteDir() {
    try {
      const url = new URL(this.site);

      return `./sites/${url.host}`;
    } catch (error) {
      console.log(this.site);
      throw error;
    }
  }

  get linksFile() {
    return `${this.siteDir}/links.json`;
  }

  async getLinks() {
    const reader = new SitemapReader(this.site);

    const { links, mainLinks } = await reader.collect();
    reader.save();

    const sampler = new PagesSampler(links, {
      leafSampleSize: 3,
      maxBranchSize: 10,
    });

    this.inputLinks = sampler.sample(mainLinks);
    sampler.save();
  }

  async start() {
    if (existsSync(this.linksFile)) {
      this.resumeCrawling();
    } else {
      await this.createCrawling();
    }

    try {
      for (const scrapper of this.scrappers) {
        await scrapper.init();
      }

      console.log(
        `Start scrapping ${this.linksToVisit.length} of ${
          Object.keys(this.links).length
        } links`
      );

      for (let i = 0; i < this.linksToVisit.length; i++) {
        process.stdout.write(`Process link ${i}/${this.linksToVisit.length}`);
        process.stdout.write('\r');

        const link = this.linksToVisit[i];

        let linkDescription = {
          url: link,
        };

        mkdirSync(this.pageDir(link), { recursive: true });

        try {
          for (const scrapper of this.scrappers) {
            const scrapperDescription = await scrapper.scrapePage(
              link,
              this.pageDir(link),
              this.pageName(link)
            );

            linkDescription = { ...scrapperDescription, ...linkDescription };
          }

          this.links[link] = true;
        } catch (error) {
          console.log('ERROR');
          this.links[link] = error.message;
          console.log(error);
        }

        writeFileSync(
          `${this.pageDir(link)}/features.json`,
          JSON.stringify(linkDescription, null, 2)
        );

        this.writeState();
      }
      process.stdout.write('\n');
    } catch (error) {
      console.error(`Cannot scrap: ${error.message}`);
      throw error;
    } finally {
      for (const scrapper of this.scrappers) {
        await scrapper.dispose();
      }
    }
  }

  writeState() {
    writeFileSync(this.linksFile, JSON.stringify(this.links, null, 2));
  }

  resumeCrawling() {
    console.log('Resuming crawling');

    this.links = JSON.parse(readFileSync(this.linksFile, 'utf-8'));

    for (const link of this.inputLinks) {
      if (this.links[link] === undefined) {
        this.links[link] = null;
      }
    }

    this.prepareCrawling();
  }

  async createCrawling() {
    mkdirSync(this.siteDir, { recursive: true });

    await this.getLinks();

    for (const link of this.inputLinks) {
      this.links[link] = null;
    }

    this.writeState();

    this.prepareCrawling();
  }

  prepareCrawling() {
    this.linksToVisit = Object.entries(this.links)
      .filter(([, visited]) => visited !== true)
      .map(([link]) => link);
  }

  pageName(pageUrl) {
    const url = new URL(pageUrl);

    return url.href
      .replace(url.search, '')
      .replace(`${url.protocol}//`, '')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
  }

  pageDir(pageUrl: string) {
    return `${this.siteDir}/${this.pageName(pageUrl)}`;
  }
}
