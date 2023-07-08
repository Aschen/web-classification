import Path from 'node:path';
import { writeFileSync } from 'node:fs';

import { chromium } from 'playwright';
import * as esbuild from 'esbuild';

export class PlaywrightScrapper {
  constructor(options = { html: true, screenshot: true }) {
    this.browser = null;
    this.context = null;
    this.page = null;

    this.options = options;
  }

  async init() {
    this.browser = await chromium.launch({
      headless: true,
    });

    this.context = await this.browser.newContext();

    await this.context.addInitScript(await this.getInitScript());
  }

  async scrapePage(pageUrl, pageDir, pageName) {
    const page = await this.context.newPage();

    const description = {
      html: undefined,
      screenshot: undefined,
    };

    await page.goto(pageUrl);

    if (this.options.html) {
      const htmlPath = `${pageDir}/${pageName}.html`;

      const { html } = await page.evaluate(() => {
        return globalThis.scrap();
      });

      writeFileSync(htmlPath, html);

      description.html = htmlPath;
    }

    if (this.options.screenshot) {
      const screenshotPath = `${pageDir}/${pageName}.png`;

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      description.screenshot = screenshotPath;
    }

    await page.close();

    return description;
  }

  async dispose() {
    if (this.browser !== null) {
      await this.browser.close();
    }

    if (this.context !== null) {
      await this.context.close();
    }
  }

  async getInitScript() {
    if (this.initScript) {
      return this.initScript;
    }

    const filePath = Path.join('./browser-script', 'index.ts');
    const built = await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      write: false,
      sourcemap: 'inline',
    });

    this.initScript = built.outputFiles[0].text;

    return this.initScript;
  }
}
