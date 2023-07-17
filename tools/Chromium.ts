import { Browser, BrowserContext, Page, chromium } from 'playwright';

export class Chromium {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;

  async init() {
    this.browser = await chromium.launch({
      headless: false,
    });

    this.context = await this.browser.newContext();

    this.page = await this.context.newPage();

    return this;
  }

  async visit(url: string) {
    await this.page.goto(url);
  }

  async dispose() {
    await this.browser.close();
  }
}
