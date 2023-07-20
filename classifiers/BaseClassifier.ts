import { Categories } from './categories';

export type PageFeatures = {
  path: string;
  html: string;
  screenshot: string;
  contentHtml: string;
  contentText: string;
  openGraph: string;
  url: string;
  classification: Record<
    string,
    {
      answer: string[];
      tokens?: number;
      cost?: number;
      correct?: boolean;
    }
  >;
};

export abstract class BaseClassifier {
  public categories: Categories;
  public name: string;
  public modelName: string;
  public options: {
    estimateOnly: boolean;
    force: boolean;
  };

  constructor(
    categories: Categories,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    this.categories = categories;
    const defaultOptions = { estimateOnly: false, force: false };
    this.options = { ...defaultOptions, ...options };
  }

  abstract init(...args): Promise<BaseClassifier>;
  abstract execute(
    inputs: Record<string, any>,
    features: PageFeatures
  ): Promise<{
    answer: string[];
    tokens: number;
    cost: number;
    time: number;
  }>;
}
