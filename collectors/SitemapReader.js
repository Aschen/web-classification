import { load } from 'cheerio';
import { writeFileSync } from 'fs';

export class SitemapReader {
  constructor(url) {
    this.url = new URL(url);
    this.links = new Set();
    this.mainLinks = new Set();
    this.visitedSitemaps = new Set();
  }

  async collect() {
    const robotsTxt = await fetch(`${this.url.toString()}/robots.txt`).then(
      (r) => r.text()
    );

    if (robotsTxt.includes('Sitemap:')) {
      const sitemapUrl = robotsTxt
        .split('\n')
        .find((l) => l.includes('Sitemap:'))
        .replace('Sitemap:', '')
        .trim();

      await this.readSitemap(sitemapUrl);
    } else {
      await this.readSitemap();
    }

    await this.collectHomePageLinks();

    console.log(
      `Total collected links: ${this.links.size + this.mainLinks.size}`
    );

    return {
      links: Array.from(this.links),
      mainLinks: Array.from(this.mainLinks),
    };
  }

  async collectHomePageLinks() {
    const html = await fetch(this.url).then((r) => r.text());

    const $ = load(html);

    const elements = $('a');

    elements.each((index, element) => {
      if (!element.attribs.href) {
        return;
      }

      const href = element.attribs.href.includes(this.url.origin)
        ? element.attribs.href
        : `${this.url.origin}${element.attribs.href}`;

      try {
        const url = new URL(href);

        if (url.href.includes('.jpg') || url.href.includes('.png')) {
          return;
        }

        if (
          url.hostname === this.url.hostname &&
          // Avoid same url with different search params
          url.toString() === url.toString().replace(url.search, '')
        ) {
          this.mainLinks.add(this.sanitizeLink(url.toString()));
        }
      } catch {}
    });
  }

  async readSitemap(sitemapUrl = `${this.url.toString()}/sitemap.xml`) {
    if (this.excludedSitemap(sitemapUrl)) {
      return;
    }

    if (this.visitedSitemaps.has(sitemapUrl)) {
      return;
    }

    console.log(`Collect from sitemap: ${sitemapUrl}`);

    const sitemap = await fetch(sitemapUrl).then((r) => {
      if (r.ok) {
        return r.text();
      }

      throw new Error(`Failed to fetch sitemap: ${sitemapUrl}: ${r.status}`);
    });

    this.visitedSitemaps.add(sitemapUrl);

    const $ = load(sitemap, { xmlMode: true });

    const elements = $('sitemap loc');

    const promises = [];

    elements.each((index, element) => {
      const subSitemapUrl = $(element).text();

      promises.push(this.readSitemap(subSitemapUrl));
    });

    await Promise.all(promises);

    await this.extractLinks($);
  }

  /**
   *
   * @param {import 'cheerio'.CheerioAPI} $
   */
  async extractLinks($) {
    const urls = $('url loc');

    urls.each((index, element) => {
      try {
        const url = new URL($(element).text());

        if (url.href.includes('.jpg') || url.href.includes('.png')) {
          return;
        }

        if (url.toString() === url.toString().replace(url.search, '')) {
          this.links.add(this.sanitizeLink(url.toString()));
        }
      } catch {}
    });
  }

  save() {
    writeFileSync(
      './links.json',
      JSON.stringify(
        {
          links: Array.from(this.links),
          mainLinks: Array.from(this.mainLinks),
        },
        null,
        2
      )
    );
  }

  sanitizeLink(link) {
    return link.replace(/\n/g, '').trim().replace(/\/$/, '');
  }

  excludedSitemap(sitemapUrl) {
    return sitemapUrl.includes('fr-ca');
  }
}
