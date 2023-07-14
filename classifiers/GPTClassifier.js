import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { stringSimilarity } from 'string-similarity-js';

class AnswerParser {
  constructor(categories) {
    this.categories = categories;
  }

  parse(answer) {
    const rawAnswers = answer
      .replace(/\\n/g, '')
      .replace('Answer: ', '')
      .split(',')
      .map((category) => category.trim());

    const answers = [];

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

  findWithCommonWords(text) {
    const words = text.split(' ');
    const result = [];

    for (const category of this.categories) {
      const categoryWords = category.split(' ');
      const commonWords = words.filter((word) => categoryWords.includes(word));

      if (commonWords.length > 0) {
        result.push(category);
      }
    }

    return result;
  }

  findBestMatch(text, categories) {
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

export class GPTClassifier {
  static GPT35 = 'gpt-3.5-turbo';
  static GPT35_16K = 'gpt-3.5-turbo-16k';
  static GPT4 = 'gpt-4';

  static PRICES = {
    [GPTClassifier.GPT35]: {
      maxTokens: 4000,
      input: 0.0015,
      output: 0.002,
    },
    [GPTClassifier.GPT35_16K]: {
      maxTokens: 16000,
      input: 0.003,
      output: 0.004,
    },
    [GPTClassifier.GPT4]: {
      maxTokens: 4000,
      input: 0.03,
      output: 0.06,
    },
  };

  constructor(modelName, options = {}) {
    this.model = new OpenAI({
      modelName,
      temperature: 0.0,
      maxTokens: -1,
    });
    this.prompt = null;
    this.parser = null;

    this.maxPromptLength =
      GPTClassifier.PRICES[GPTClassifier.GPT35_16K].maxTokens * 4;

    const defaultOptions = { estimateOnly: false, force: false, suffix: '' };
    this.options = { ...defaultOptions, ...options };

    this.modelName = modelName;
    this.name = modelName + this.options.suffix;
  }

  /**
   *
   * @param {import('langchain/prompts').PromptTemplate} prompt
   * @param {object} inputs
   */
  async execute(inputs) {
    if (!this.prompt) {
      throw new Error('A prompt must be set before executing the classifier');
    }

    const prompt = await this.prompt.format(inputs);
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

  usePromptTextOnly(promptBuilder, categories) {
    const template = promptBuilder(categories);

    this.parser = new AnswerParser(categories);

    this.prompt = new PromptTemplate({
      template,
      inputVariables: ['url', 'openGraph', 'contentText'],
    });

    return this;
  }
}

/**
 *
The web page url is the more important to classify the web page: 
{url}
The Web page open graph information provide a good insight about the web page content: 
{openGraph}
The Web page main content text can contains some noise but it is still a good source of information: 
{contentText}

 */
