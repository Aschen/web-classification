import { OpenAI } from 'langchain/llms/openai';
import { readFileSync, writeFileSync } from 'node:fs';

import { CATEGORIES_D } from './classifiers/index.js';

const model = new OpenAI({
  modelName: 'gpt-4',
});

const categories = {};
for (const cat of CATEGORIES_D.labels) {
  if (categories[cat]) {
    continue;
  }
  const resA = await model.call(
    `I want you to describe the potential content of a web page belongings to an ecommerce website for me.
    This description will be used to compute embeddings and then classify web pages accordingly.
    Answer directly
    The web page category is: ${cat}
    `
  );
  categories[cat] = resA;
  writeFileSync('./categories.json', JSON.stringify(categories, null, 2));
}

// // `call` is a simple string-in, string-out method for interacting with the model.

// const classi = JSON.parse(readFileSync('./acc.json', 'utf-8'));

// for (const [classifier, categories] of Object.entries(classi)) {
//   let totalPages = 0;
//   let totalSuccess = 0;

//   for (const [category, { total, success }] of Object.entries(categories)) {
//     totalPages += total;
//     totalSuccess += success;
//   }

//   console.log(`${classifier} ${totalSuccess} / ${totalPages}`);
// }
