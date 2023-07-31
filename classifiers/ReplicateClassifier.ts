import Replicate from 'replicate';

import { BaseClassifier } from './BaseClassifier';
import { Categories } from './categories';
import { Prompt } from './prompts';

export type ReplicateModel = {
  name: string;
  cost: number;
  maxTokens: number;
};

export const ReplicateModels = {
  LLAMA2_70b_CHAT: {
    name: 'replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',
    cost: 0.0032,
    maxTokens: 2048,
  },
  LLAMA2_70b: {
    name: 'replicate/llama-2-70b:14ce4448d5e7e9ed0c37745ac46eca157aab09061f0c179ac2b323b5de56552b',
    cost: 0.0032,
    maxTokens: 2048,
  },
  LLAMA2_13B_CHAT: {
    name: 'a16z-infra/llama-2-13b-chat:d5da4236b006f967ceb7da037be9cfc3924b20d21fed88e1e94f19d56e2d3111',
    cost: 0.0023,
    maxTokens: 2048,
  },
  LLAMA2_7B: {
    name: 'replicate/llama-7b:ac808388e2e9d8ed35a5bf2eaa7d83f0ad53f9e3df31a42e4eb0a0c3249b3165',
    cost: 0.0023,
    maxTokens: 2048,
  },
  LLAMA2_7B_CHAT: {
    name: 'lucataco/llama-2-7b-chat:6ab580ab4eef2c2b440f2441ec0fc0ace5470edaf2cbea50b8550aec0b3fbd38',
    cost: 0.0023,
    maxTokens: 2048,
  },
} as const;

export class ReplicateClassifier extends BaseClassifier {
  private replicate: Replicate;
  private model: ReplicateModel;
  private prompt: Prompt;

  constructor(
    model: ReplicateModel,
    categories: Categories,
    prompt: Prompt,
    options: Partial<BaseClassifier['options']> = {}
  ) {
    super(categories, options);

    this.model = model;
    this.prompt = prompt;

    this.name =
      this.model.name.slice(0, this.model.name.indexOf(':')) +
      this.categories.suffix +
      this.prompt.suffix;

    console.log(`ReplicateClassifier: ${this.name}`);
  }

  async init() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    return this;
  }

  async execute(inputs: Record<string, any>) {
    const now = Date.now();

    const prompt = this.prompt
      .template(this.categories)
      .replace('{url}', inputs.url)
      .replace('{openGraph}', inputs.openGraph)
      .replace('{contentText}', inputs.contentText);
    const maxPromptLength = this.model.maxTokens * 3;
    const truncatedPrompt = prompt.slice(0, maxPromptLength);
    console.log(truncatedPrompt.length);
    const result: any = this.options.estimateOnly
      ? ['mock']
      : await this.replicate.run(this.model.name as any, {
          input: {
            prompt: truncatedPrompt,
            temperature: 0.1,
          },
        });
    console.log(result);
    const answer = result.join('');
    const time = Date.now() - now;
    const cost = this.model.cost * (time / 1000);
    const tokens = truncatedPrompt.length / 3 + answer.length / 3;

    console.log(answer);

    return {
      answer,
      tokens,
      cost,
      time,
    };
  }
}
