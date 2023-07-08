import { load } from 'cheerio';

export class LinkScrapper {
  constructor(url) {
    this.url = url;
    this.links = [];
    this.visitedLinks = new Set();

    this.links.push(this.url);
  }

  async collect() {
    while (this.links.length > 0) {
      console.log(`Links to visit: ${this.links.length}`);
      console.log(`Visited links: ${this.visitedLinks.size}`);

      await Promise.allSettled([
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
        this.visitNextPage(),
      ]);
    }

    return Array.from(this.visitedLinks);
  }

  async visitNextPage() {
    if (this.links.length === 0) {
      return null;
    }

    const link = new URL(this.links.shift());

    const html = await fetch(link).then((r) => r.text());

    this.visitedLinks.add(link.toString());

    const $ = load(html);

    const elements = $('a');

    elements.each((index, element) => {
      const href = element.attribs.href.includes(link.origin)
        ? element.attribs.href
        : `${link.origin}${element.attribs.href}`;

      try {
        const url = new URL(href);

        if (url.href.includes('.jpg') || url.href.includes('.png')) {
          return;
        }

        if (
          url.hostname === link.hostname &&
          !this.links.includes(url.toString()) &&
          !this.visitedLinks.has(url.toString())
        ) {
          this.links.push(url.toString());
        }
      } catch {}
    });
  }
}
