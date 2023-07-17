import { PageFeatures } from 'classifiers';

export abstract class BaseScrapper {
  abstract init(): Promise<void>;
  abstract dispose(): Promise<void>;
  abstract scrapePage(
    pageUrl: string,
    pageDir: string,
    pageName: string
  ): Promise<Partial<PageFeatures>>;
}
