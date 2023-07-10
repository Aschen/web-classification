import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

export class GPTClassifier {
  static GPT35 = 'gpt-3.5-turbo';
  static GPT4 = 'gpt-4';

  constructor(modelName) {
    this.model = new OpenAI({
      modelName,
      temperature: 0.1,
      maxTokens: 1536,
    });
    this.prompt = null;
    this.parser = null;

    this.name = modelName;
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

    const chain = new LLMChain({ llm: this.model, prompt: this.prompt });

    const result = await chain.call(inputs);
    console.log(result.text);
    return await this.parser(result);
  }

  usePromptTextOnly(categories) {
    const template = `
You are a classifier for web pages.
You are given informations about a web page and you have to classify it as one of the following categories: 
${categories.join(', ')}
You will return a top 5 of the most probable categories for the given web page.
Your response should be a list of comma separated values, eg: foo, bar, baz

Here are the informations you have about the web page:
Web page url: 
{url}
Web page open graph: 
{openGraph}
Web page main content text: 
{contentText}
`;

    this.parser = (result) => {
      return result.text
        .replace(/\\n/g, '')
        .replace('Answer: ', '')
        .split(',')
        .map((category) => category.trim());
    };

    this.prompt = new PromptTemplate({
      template,
      inputVariables: ['url', 'openGraph', 'contentText'],
    });
  }
}
