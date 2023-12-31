import { Categories } from './categories';

export type Prompt = {
  suffix: string;
  template: (categories: Categories) => string;
};

export const PROMPT_A: Prompt = {
  suffix: '-pA',
  template: (categories) => `
  You are a classifier for web pages.
  You are given informations about a web page and you have to classify it as one of the following categories: 
  ${categories.labels.join(', ')}
  You will return a top 5 of the most probable categories for the given web page.
  Your response should be a list of comma separated values, eg: foo, bar, baz
  
  Here are the informations you have about the web page:
  Web page url: 
  {url}
  Web page open graph: 
  {openGraph}
  Web page main content text: 
  {contentText}
  `,
};

export const PROMPT_B: Prompt = {
  suffix: '-pB',
  template: (categories) => `
  You are a classifier for web pages.
  You are given informations about a web page and you have to classify it as one of the following categories: 
  ${categories.labels.join(', ')}
  You will return a top 3 of the most probable categories for the given web page.
  Your response should be a list of comma separated values, eg: foo, bar, baz
  
  Here are the informations you have about the web page:
  The web page url is the more important to classify the web page: 
  {url}
  The Web page open graph information provide a good insight about the web page content: 
  {openGraph}
  The Web page main content text can contains some noise but it is still a good source of information: 
  {contentText}
  `,
};

export const PROMPT_B2: Prompt = {
  suffix: '-pB2',
  template: (categories) => {
    if (!categories.descriptions) {
      throw new Error('This classifier categories must have a description');
    }

    let labelsDescription = '';

    for (const [label, description] of Object.entries(
      categories.descriptions
    )) {
      labelsDescription += ` - "${label}": ${description}\n`;
    }

    const text = `
    You are a classifier for web pages.
    You are given informations about a web page and you have to classify it as one of the following categories: 
    ${labelsDescription}
    You will return a top 3 of the most probable categories for the given web page.
    Your response should be a list of comma separated values, eg: foo, bar, baz
    
    Here are the informations you have about the web page:
    The web page url is the more important to classify the web page: 
    {url}
    The Web page open graph information provide a good insight about the web page content: 
    {openGraph}
    The Web page main content text can contains some noise but it is still a good source of information: 
    {contentText}
    `;

    return text;
  },
};

export const PROMPT_C: Prompt = {
  suffix: '-pC',
  template: (categories) => `
  You are a classifier for web pages.
  You are given informations about a web page and you have to classify it as one of the following categories: 
  ${categories.labels.join(', ')}
  You will return a top 3 of the most probable categories for the given web page.
  Your response should be a list of comma separated values, eg: foo, bar, baz
  
  Here are the informations you have about the web page:
  The web page url is the more important to classify the web page: 
  {url}
  The Web page open graph information provide a good insight about the web page content: 
  {openGraph}
  `,
};
