import { Categories } from './categories';

export type PageFeatures = {
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
    }
  >;
};

export abstract class BaseClassifier {
  public categories: Categories;
  public name: string;
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

  abstract init(): Promise<BaseClassifier>;
  abstract execute(inputs: Record<string, any>): Promise<{
    answer: string[];
    tokens: number;
    cost: number;
  }>;
}
