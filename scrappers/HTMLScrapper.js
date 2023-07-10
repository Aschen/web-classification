import { load } from 'cheerio';
import { writeFileSync } from 'fs';

export class HTMLScrapper {
  constructor() {}

  async init() {}

  async scrapePage(pageUrl, pageDir, pageName) {
    const html = await fetch(pageUrl).then((r) => r.text());

    const openGraphDescription = this.openGraphDescription(html);
    const { contentText, contentHtml } = this.pageContent(html);

    const htmlPath = `${pageDir}/${pageName}.html`;
    const contentHtmlPath = `${pageDir}/${pageName}_content.html`;
    const contentTextPath = `${pageDir}/${pageName}_content.txt`;
    const openGraphDescriptionPath = `${pageDir}/${pageName}_og.txt`;

    writeFileSync(htmlPath, html);
    writeFileSync(contentHtmlPath, contentHtml);
    writeFileSync(contentTextPath, contentText);
    writeFileSync(openGraphDescriptionPath, openGraphDescription);

    const description = {
      html: htmlPath,
      contentHtml: contentHtmlPath,
      contentText: contentTextPath,
      openGraph: openGraphDescriptionPath,
    };

    return description;
  }

  openGraphDescription(html) {
    const $ = load(html);

    let openGraphDescription = '';

    $('meta[property^="og:"]').each((index, element) => {
      const property = $(element).attr('property');
      const content = $(element).attr('content');

      openGraphDescription += `${property}: ${content}\n`;
    });

    return openGraphDescription;
  }

  pageContent(html) {
    const $ = load(html);

    // $('[class]').removeAttr('class');
    $('script, style, path, footer, header, head').remove();

    const contentHtml = $.html();

    let text = $.text();

    const lines = text.split('\n').map((line) => line.trim());

    const chunks = lines.flatMap((line) =>
      line.split('  ').map((phrase) => phrase.trim())
    );

    const contentText = chunks.filter((chunk) => chunk).join('\n');

    return { contentText, contentHtml };
  }

  async dispose() {}
}
