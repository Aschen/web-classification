import { load } from 'cheerio';

export class SitemapReader {
  constructor(url) {
    this.url = url;
    this.links = new Set();
  }

  async collect(sitemapUrl = `${this.url}/sitemap.xml`) {
    console.log(`Collect from sitemap: ${sitemapUrl}`);

    const sitemap = await fetch(sitemapUrl).then((r) => r.text());

    const $ = load(sitemap, { xmlMode: true });

    const elements = $('sitemap loc');

    const promises = [];

    elements.each((index, element) => {
      const subSitemapUrl = $(element).text();
      console.log(`Found sub sitemap: ${subSitemapUrl}`);

      promises.push(this.collect(subSitemapUrl));
    });

    await Promise.all(promises);

    await this.extractLinks($);

    return Array.from(this.links);
  }

  /**
   *
   * @param {import 'cheerio'.CheerioAPI} $
   */
  async extractLinks($) {
    const urls = $('url loc');

    urls.each((index, element) => {
      this.links.add($(element).text());
    });
  }
}
