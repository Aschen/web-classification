import Path from 'node:path';
import { writeFileSync } from 'node:fs';

import { chromium } from 'playwright';
import * as esbuild from 'esbuild';

export class PlaywrightScrapper {
  constructor(options = {}) {
    this.browser = null;
    this.context = null;
    this.page = null;

    const defaultOptions = { html: true, screenshot: true };
    this.options = { ...defaultOptions, ...options };
  }

  async init() {
    this.browser = await chromium.launch({
      headless: true,
    });

    this.context = await this.browser.newContext();

    await this.context.addInitScript(await this.getInitScript());

    this.page = await this.context.newPage();
  }

  async scrapePage(pageUrl, pageDir, pageName) {
    const description = {
      html: undefined,
      screenshot: undefined,
    };

    await this.page.goto(pageUrl);

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

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      description.screenshot = screenshotPath;
    }

    return description;
  }

  async dispose() {
    if (this.page !== null) {
      await this.page.close();
    }

    if (this.context !== null) {
      await this.context.close();
    }

    if (this.browser !== null) {
      await this.browser.close();
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
