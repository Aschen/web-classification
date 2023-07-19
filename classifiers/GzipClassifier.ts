import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

import { BaseClassifier, PageFeatures } from './BaseClassifier';
import { Categories } from './categories';

type ExtendedPageFeatures = PageFeatures & {
  gzipedLength?: number;
};

export class GzipClassifier extends BaseClassifier {
  private trainSet: ExtendedPageFeatures[];
  private manualClassification: string;

  constructor(
    categories: Categories,
    trainSet: PageFeatures[],
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);

    this.trainSet = trainSet;

    this.name = 'gzip' + this.categories.suffix;
    this.manualClassification = 'manual' + this.categories.suffix;
  }

  async init() {
    for (const trainFeatures of this.trainSet) {
      trainFeatures.gzipedLength = this.gzipedLength(
        this.featuresText(trainFeatures)
      );
    }

    return this;
  }

  async execute(inputs: Record<string, any>, features: PageFeatures) {
    const now = Date.now();

    const testLength = this.gzipedLength(this.featuresText(features));

    const distances: Array<{ ncd: number; i: number }> = [];

    for (let i = 0; i < this.trainSet.length; i++) {
      const trainFeatures = this.trainSet[i];

      const joinedLength = this.gzipedLength(
        this.featuresText(trainFeatures) + this.featuresText(features)
      );

      const ncd =
        (joinedLength - Math.min(trainFeatures.gzipedLength, testLength)) /
        Math.max(trainFeatures.gzipedLength, testLength);

      distances.push({ ncd, i });
    }

    distances.sort((a, b) => a.ncd - b.ncd);

    const answer: string[] = [];

    for (const { ncd, i } of distances.slice(0, 5)) {
      answer.push(
        this.trainSet[i].classification[this.manualClassification].answer[0]
      );
    }

    return {
      answer,
      tokens: 0,
      cost: 0,
      time: Date.now() - now,
    };
  }

  featuresText(features: PageFeatures) {
    const url = features.url;
    const contentText = readFileSync(`${features.contentText}`, 'utf-8');
    const openGraph = readFileSync(`${features.openGraph}`, 'utf-8');

    const text = `
    ${url}
    ${openGraph}
    ${contentText}
    `;

    return text;
  }

  gzipedLength(text: string) {
    return gzipSync(text).byteLength;
  }
}
