import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import * as esbuild from 'esbuild';

import { PageFeatures } from '../classifiers';
import { BaseScrapper } from './BaseScrapper';

export class PlaywrightScrapper extends BaseScrapper {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;
  private options: {
    html: boolean;
    screenshot: boolean;
  };
  private initScript: string;

  constructor(options: Partial<PlaywrightScrapper['options']> = {}) {
    super();

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

  async scrapePage(pageUrl: string, pageDir: string, pageName: string) {
    const features: Partial<PageFeatures> = {
      html: undefined,
      screenshot: undefined,
    };

    await this.page.goto(pageUrl);

    if (this.options.html) {
      const htmlPath = `${pageDir}/${pageName}.html`;

      const { html } = await this.page.evaluate(() => {
        return globalThis.scrap();
      });

      writeFileSync(htmlPath, html);

      features.html = htmlPath;
    }

    if (this.options.screenshot) {
      const screenshotPath = `${pageDir}/${pageName}.png`;

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      features.screenshot = screenshotPath;
    }

    return features;
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

    const filePath = join('./browser-script', 'index.ts');
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
