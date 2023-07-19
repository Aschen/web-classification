import { BaseClassifier, PageFeatures } from './BaseClassifier';
import { Categories } from './categories';

export class MockClassifier extends BaseClassifier {
  constructor(
    classifierName: string,
    categories: Categories,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);

    this.name = classifierName;
  }

  async init() {
    return this;
  }

  async execute(inputs: Record<string, any>, features?: PageFeatures) {
    const result = features.classification[this.name];

    if (!result) {
      console.log(features.url);
      throw new Error(`MockClassifier: ${this.name} not found in features`);
    }

    return {
      answer: result.answer,
      tokens: 0,
      cost: 0,
    };
  }
}
