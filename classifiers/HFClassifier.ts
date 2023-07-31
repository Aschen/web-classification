import { HfInference } from '@huggingface/inference';

import { BaseClassifier } from './BaseClassifier';
import { Categories } from './categories';

export class HFClassifier extends BaseClassifier {
  private hf: HfInference;
  static MODEL_NAME = 'facebook/bart-large-mnli';
  static MAX_LENGTH = 1024 * 4;

  constructor(
    categories: Categories,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);
  }

  async init() {
    if (!process.env.HF_TOKEN) {
      throw new Error('Missing HuggingFace token in HF_TOKEN');
    }

    this.hf = new HfInference(process.env.HF_TOKEN);

    return this;
  }

  async execute(inputs: Record<string, any>) {
    const answer: string[] = [];
    const tokens = 0;
    const cost = 0;
    const now = Date.now();

    const text = `
    ${inputs.openGraph}
    ${inputs.url}
    ${inputs.contentText}`;

    const truncatedText = text.slice(0, HFClassifier.MAX_LENGTH);

    const result = await this.hf.zeroShotClassification({
      model: HFClassifier.MODEL_NAME,
      inputs: [truncatedText],
      parameters: { candidate_labels: this.categories.labels.slice(0, 9) },
    });

    console.log(result);

    return {
      answer,
      tokens,
      cost,
      time: Date.now() - now,
    };
  }
}
