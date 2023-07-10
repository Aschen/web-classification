import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export class Crawler {
  constructor(inputLinks, scrappers = []) {
    this.inputLinks = inputLinks;
    this.links = {};
    this.linksToVisit = [];
    this.scrappers = scrappers;

    if (existsSync(this.linksFile)) {
      this.resumeCrawling();
    } else {
      this.createCrawling();
    }
  }

  get siteDir() {
    try {
      const url = new URL(this.inputLinks[0]);

      return `./sites/${url.host}`;
    } catch (error) {
      console.log(this.inputLinks[0]);
      throw error;
    }
  }

  get linksFile() {
    return `${this.siteDir}/links.json`;
  }

  async start() {
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

        for (const scrapper of this.scrappers) {
          const scrapperDescription = await scrapper.scrapePage(
            link,
            this.pageDir(link),
            this.pageName(link)
          );

          linkDescription = { ...scrapperDescription, ...linkDescription };
        }

        writeFileSync(
          `${this.pageDir(link)}/features.json`,
          JSON.stringify(linkDescription, null, 2)
        );

        this.links[link] = true;

        this.writeState();
      }
      process.stdout.write('\n');
    } catch (error) {
      console.error(error);
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
    this.links = JSON.parse(readFileSync(this.linksFile, 'utf-8'));

    for (const link of this.inputLinks) {
      if (this.links[link] === undefined) {
        this.links[link] = false;
      }
    }

    this.prepareCrawling();
  }

  createCrawling() {
    mkdirSync(this.siteDir, { recursive: true });

    for (const link of this.inputLinks) {
      this.links[link] = false;
    }

    this.writeState();

    this.prepareCrawling();
  }

  prepareCrawling() {
    this.linksToVisit = Object.entries(this.links)
      .filter(([, visited]) => visited === false)
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

  pageDir(pageUrl) {
    return `${this.siteDir}/${this.pageName(pageUrl)}`;
  }
}
