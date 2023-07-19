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

const entries = readdirSync('sites/c64audio.com', { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  const features = JSON.parse(
    readFileSync(`./sites/c64audio.com/${entry.name}/features.json`, 'utf-8')
  );
  const url = features.url;
  const contentText = readFileSync(`${features.contentText}`, 'utf-8');
  const openGraph = readFileSync(`${features.openGraph}`, 'utf-8');

  const text = `
  ${url}
  ${openGraph}
  ${contentText}
  `;

  console.time('gzip');
  const gzipped = gzipSync(text);
  console.timeEnd('gzip');
  console.log(gzipped.length);
}
