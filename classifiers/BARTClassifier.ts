import { pipeline, env } from '@xenova/transformers';

import { BaseClassifier } from './BaseClassifier';
import { Categories } from './categories';

export class BARTClassifier extends BaseClassifier {
  private instance = null;
  private task = 'zero-shot-classification';
  static MODEL_NAME = 'Xenova/bart-large-mnli';
  static MAX_LENGTH = 1024 * 4;

  constructor(
    categories: Categories,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);

    env.cacheDir = './.cache';

    this.name = 'bart-large-mnli' + categories.suffix;

    console.log(`BARTClassifier: ${this.name}`);
  }

  async init() {
    this.instance = pipeline(this.task, BARTClassifier.MODEL_NAME, {
      quantized: false,
    });

    return this;
  }

  async execute(inputs: Record<string, any>) {
    console.log('Retrieve model..');
    const model = await this.instance;
    console.log('Model ready');

    const answer: string[] = [];
    const tokens = 0;
    const cost = 0;

    const text = `
    ${inputs.openGraph}
    ${inputs.url}
    ${inputs.contentText}`;

    const truncatedText = text.slice(0, BARTClassifier.MAX_LENGTH);

    const { scores, labels } = await model(
      truncatedText,
      this.categories.labels,
      {
        multi_label: false,
      }
    );

    console.log({ scores, labels });

    return {
      answer,
      tokens,
      cost,
    };
  }
}
