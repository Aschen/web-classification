import { BaseClassifier, PageFeatures } from './BaseClassifier';
import { Categories } from './categories';

export class FunnelClassifier extends BaseClassifier {
  private tofuClassifier: BaseClassifier;
  private bofuClassifier: BaseClassifier;

  constructor(tofuClassifier, bofuClassifier, categories, options = {}) {
    super(categories, options);

    this.tofuClassifier = tofuClassifier;
    this.bofuClassifier = bofuClassifier;

    this.tofuClassifier.options = this.options;
    this.bofuClassifier.options = this.options;

    this.name = `${tofuClassifier.name}+${bofuClassifier.name}`;

    console.log(`FunnelClassifier: ${this.name}`);
  }

  async init() {
    return this;
  }

  async execute(
    inputs: Record<string, any>,
    features: PageFeatures
  ): Promise<{ answer: string[]; tokens: number; cost: number }> {
    const {
      answer: tofuCategories,
      tokens: tofuTokens,
      cost: tofuCost,
    } = await this.tofuClassifier.execute(inputs, features);

    const labels = tofuCategories.slice(0, 10);
    const filteredCategories: Categories = {
      labels,
      suffix: this.categories.suffix,
      descriptions: Object.fromEntries(
        Object.entries(this.categories.descriptions).filter(([category]) =>
          labels.includes(category)
        )
      ),
    };

    this.bofuClassifier.categories = filteredCategories;

    await this.bofuClassifier.init();

    const {
      answer: bofuCategories,
      tokens: bofuTokens,
      cost: bofuCost,
    } = await this.bofuClassifier.execute(inputs, features);

    return {
      answer: bofuCategories,
      tokens: tofuTokens + bofuTokens,
      cost: tofuCost + bofuCost,
    };
  }
}
