// import { OpenAI } from 'langchain/llms/openai';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

// import { CATEGORIES_D } from './classifiers/index.js';
import { gzipSync } from 'node:zlib';

// const model = new OpenAI({
//   modelName: 'gpt-4',
// });

// const categories = {};
// for (const cat of CATEGORIES_D.labels) {
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

import { splitDatasetBySites } from './tools';

const { testSet, trainSet } = splitDatasetBySites(process.argv.slice(2));

console.log('testSet', testSet.length);
console.log('trainSet', trainSet.length);
