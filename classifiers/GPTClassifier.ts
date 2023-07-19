import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { stringSimilarity } from 'string-similarity-js';
import { BaseClassifier } from './BaseClassifier';
import { Prompt } from './prompts';
import { Categories } from './categories';

class AnswerParser {
  private categories: string[];

  constructor(categories: string[]) {
    this.categories = categories;
  }

  parse(answer: string): string[] {
    const rawAnswers = answer
      .replace(/\\n/g, '')
      .replace('Answer: ', '')
      .split(',')
      .map((category) => category.trim());

    const answers: string[] = [];

    for (const rawAnswer of rawAnswers) {
      if (!this.categories.includes(rawAnswer)) {
        const matchingCategories = this.findWithCommonWords(rawAnswer);

        const bestMatch = this.findBestMatch(rawAnswer, matchingCategories);
        if (bestMatch) {
          answers.push(bestMatch);
        }
      } else {
        answers.push(rawAnswer);
      }
    }

    return answers;
  }

  findWithCommonWords(text: string): string[] {
    const words = text.split(' ');
    const result: string[] = [];

    for (const category of this.categories) {
      const categoryWords = category.split(' ');
      const commonWords = words.filter((word) => categoryWords.includes(word));

      if (commonWords.length > 0) {
        result.push(category);
      }
    }

    return result;
  }

  findBestMatch(text: string, categories: string[]): string | null {
    let max = 0;
    let category = null;

    for (const cat of categories) {
      if (stringSimilarity(text, cat) > max) {
        max = stringSimilarity(text, cat);
        category = cat;
      }
    }

    return category;
  }
}

export enum GPTModels {
  GPT35 = 'gpt-3.5-turbo',
  GPT35_16K = 'gpt-3.5-turbo-16k',
  GPT4 = 'gpt-4',
}

export class GPTClassifier extends BaseClassifier {
  static PRICES = {
    [GPTModels.GPT35]: {
      maxTokens: 4000,
      input: 0.0015,
      output: 0.002,
    },
    [GPTModels.GPT35_16K]: {
      maxTokens: 16000,
      input: 0.003,
      output: 0.004,
    },
    [GPTModels.GPT4]: {
      maxTokens: 4000,
      input: 0.03,
      output: 0.06,
    },
  };

  private model: OpenAI;
  private parser: AnswerParser;
  private promptTemplate: PromptTemplate;
  private maxPromptLength: number;
  private prompt: Prompt;

  constructor(
    modelName: GPTModels,
    categories: Categories,
    prompt: Prompt,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);

    this.model = new OpenAI({
      modelName,
      temperature: 0.0,
      maxTokens: -1,
    });
    this.parser = null;

    this.maxPromptLength = GPTClassifier.PRICES[modelName].maxTokens * 3;

    this.modelName = modelName;
    this.prompt = prompt;
    this.categories = categories;
    this.name = modelName + this.categories.suffix + this.prompt.suffix;

    console.log(`GPTClassifier: ${this.name}`);
  }

  async execute(inputs: Record<string, any>) {
    if (!this.promptTemplate) {
      throw new Error('The classifier must be initialized before execution');
    }

    const prompt = await this.promptTemplate.format(inputs);
    const truncatedPrompt = prompt.slice(0, this.maxPromptLength);

    const result = this.options.estimateOnly
      ? 'mock'
      : await this.model.call(truncatedPrompt);

    const inputTokens = await this.model.getNumTokens(truncatedPrompt);
    const outputTokens = await this.model.getNumTokens(result);

    const inputCost =
      (inputTokens / 1000) * GPTClassifier.PRICES[this.modelName].input;
    const outputCost =
      (outputTokens / 1000) * GPTClassifier.PRICES[this.modelName].output;

    return {
      answer: this.parser.parse(result),
      tokens: inputTokens + outputTokens,
      cost: inputCost + outputCost,
    };
  }

  async init() {
    const template = this.prompt.template(this.categories);

    this.parser = new AnswerParser(this.categories.labels);

    this.promptTemplate = new PromptTemplate({
      template,
      inputVariables: ['url', 'openGraph', 'contentText'],
    });

    return this;
  }
}
