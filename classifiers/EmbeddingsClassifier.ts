import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { Categories } from './categories';
import { BaseClassifier } from './BaseClassifier';

function repeat(text, times) {
  return new Array(times).fill(text).join('\n');
}

function findOg(openGraph, key) {
  const regex = new RegExp(`og:${key}: (.*)`);
  const match = openGraph.match(regex);
  return match && match[1];
}

export class EmbeddingsClassifier extends BaseClassifier {
  static MODEL_NAME = 'emb-ada-002';
  static PRICE = 0.0001;
  static MAX_LENGTH = 8191 * 3;

  private store: FaissStore;

  constructor(
    categories: Categories,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);

    this.store = null;

    this.modelName = EmbeddingsClassifier.MODEL_NAME;
    this.name = this.modelName + categories.suffix;
    console.log(`EmbeddingsClassifier: ${this.name}`);
  }

  async init() {
    if (!this.categories.descriptions) {
      throw new Error('This classifier categories must have a description');
    }

    // This cost embeddings calls
    this.store = await FaissStore.fromTexts(
      Object.values(this.categories.descriptions),
      Object.keys(this.categories.descriptions),
      new OpenAIEmbeddings()
    );

    return this;
  }

  async execute(inputs: Record<string, any>) {
    if (!this.store) {
      throw new Error('The classifier must be initialized before execution');
    }

    const now = Date.now();

    const text = `
    ${inputs.openGraph}
    ${repeat(findOg(inputs.openGraph, 'og:type'), 10)}
    ${repeat(inputs.url, 10)}
    `;
    const truncatedText = text.slice(0, EmbeddingsClassifier.MAX_LENGTH);

    const result = this.options.estimateOnly
      ? [{ metadata: 'mock' }]
      : await this.store.similaritySearch(truncatedText, 10);

    // approximative
    const tokens = truncatedText.length / 3;
    const cost = (tokens / 1000) * EmbeddingsClassifier.PRICE;

    return {
      answer: result.map((r) => r.metadata),
      tokens,
      cost,
      time: Date.now() - now,
    };
  }
}
