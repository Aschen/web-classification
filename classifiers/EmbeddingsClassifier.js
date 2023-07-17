import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

function repeat(text, times) {
  return new Array(times).fill(text).join('\n');
}

function findOg(openGraph, key) {
  const regex = new RegExp(`og:${key}: (.*)`);
  const match = openGraph.match(regex);
  return match && match[1];
}

export class EmbeddingsClassifier {
  static NAME = 'emb-ada-002';
  static PRICE = 0.0001;
  static MAX_LENGTH = 8191 * 4;

  constructor(options = {}) {
    const defaultOptions = { estimateOnly: false, force: false, suffix: '' };
    this.options = { ...defaultOptions, ...options };

    this.store = null;

    this.name = EmbeddingsClassifier.NAME + options.suffix;
  }

  async init(categories) {
    this.categories = categories;
    this.store = await FaissStore.fromTexts(
      Object.values(this.categories),
      Object.keys(this.categories),
      new OpenAIEmbeddings()
    );
  }

  async execute(inputs) {
    if (!this.store) {
      throw new Error('The classifier must be initialized before execution');
    }

    const text = `
    ${inputs.openGraph}
    ${repeat(findOg(inputs.openGraph, 'og:type'), 10)}
    ${repeat(inputs.url, 10)}
    `;
    const truncatedText = text.slice(0, EmbeddingsClassifier.MAX_LENGTH);

    const result = this.options.estimateOnly
      ? [{ metadata: 'mock' }]
      : await this.store.similaritySearch(truncatedText, 3);

    // approximative
    const tokens = truncatedText.length / 4;
    const cost = (tokens / 1000) * EmbeddingsClassifier.PRICE;

    return {
      answer: result.map((r) => r.metadata),
      tokens,
      cost,
    };
  }
}
