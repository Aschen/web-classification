// import { OpenAI } from 'langchain/llms/openai';
// import { writeFileSync } from 'node:fs';

// import { CATEGORIES_A } from './classifiers/index.js';

// const model = new OpenAI();

// const categories = {};
// for (const cat of CATEGORIES_A) {
//   if (categories[cat]) {
//     continue;
//   }
//   const resA = await model.call(
//     `I want you to describe the potential content of a web page belongings to an ecommerce website for me.
//     This description will be used to compute embeddings and then classify web pages accordingly.
//     Answer directly
//     The web page category is: ${cat}
//     `
//   );
//   categories[cat] = resA;
//   writeFileSync('./categories.json', JSON.stringify(categories, null, 2));
// }

// // `call` is a simple string-in, string-out method for interacting with the model.

import { stemmer } from 'stemmer';

const r = stemmer('things');

console.log(r);
