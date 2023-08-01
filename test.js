// import { OpenAI } from 'langchain/llms/openai';
import { HfInference } from '@huggingface/inference';
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

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

let input = `
### Human:
You are a classifier for web pages.
  You are given informations about a web page and you have to classify it as one of the following categories: 
  e-commerce product list/catalog, e-commerce product details, e-commerce cart, e-commerce shipping/delivery information, e-commerce customer reviews/testimonial, e-commerce gift cards, e-commerce returns/refunds and exchanges, physical store address/location/direction, customer support and assistance/frequently asked questions, contact us/get a pricing quote, blog, legal informations and terms and conditions, information about the company, press material, career opportunities, account login/register, other, page not found
  You will return a top 3 of the most probable categories for the given web page.
  Your response should be a list of comma separated values, example: e-commerce product details, e-commerce product list/catalog, legal informations and terms and conditions
  
  Here are the informations you have about the web page:
  The web page url is the more important to classify the web page: 
  https://c64audio.com/collections/8-bit-symphony

  The Web page open graph information provide a good insight about the web page content: 
  og:site_name: C64Audio.com
  og:url: https://c64audio.com/collections/8-bit-symphony
  og:title: 8-Bit Symphony
  og:type: product.group
  og:description: Imagine hearing your favourite C64 tunes as stunning, emotional orchestral masterpieces bursting from your player. Imagine yourself sitting in a concert hall overwhelmed with emotion, a tear in the corner of your eye welling up with pride that your C64 music has come this far. That's what this is about. Look below the 
  og:image: http://c64audio.com/cdn/shop/collections/symphony64_5332597f-a487-4fda-9d30-63d6a3002ddb_1200x1200.jpg?v=1542278865
  og:image:secure_url: https://c64audio.com/cdn/shop/collections/symphony64_5332597f-a487-4fda-9d30-63d6a3002ddb_1200x1200.jpg?v=1542278865
  

  The Web page main content text can contains some noise but it is still a good source of information: 
  -
  8-Bit Symphony
  Rob Hubbard
  FastLoaders
  Project Sidologie
  Back in Time
  Uncle and the Bacon
  About C64Audio.com

  1
  8-Bit Symphony
  2
  <a href="/products/8-bit-symphony-pro-first-half" class="product__image-wrapper" title="8-Bit Symphony Pro: First Half">
  <img src="//c64audio.com/cdn/shop/products/IMG_2576_grande.jpg?v=1606566955" alt="8-Bit Symphony Pro: First Half">
  </a>
  8-Bit Symphony Pro: First Half
  From £22.00
  <a href="/products/8-bit-symphony-pro-second-half-cd-digital-double-album" class="product__image-wrapper" title="8-Bit Symphony Pro: Second Half: CD preorder with immediate digital delivery">
  <img src="//c64audio.com/cdn/shop/products/8-BitSymphonyPro2_grande.png?v=1607122703" alt="8-Bit Symphony Pro: Second Half: CD preorder with immediate digital delivery">
  </a>
  8-Bit Symphony Pro: Second Half: CD preorder with immediate digital delivery
  From £22.00
  <a href="/products/8-bit-symphony-pro-first-half-blu-ray" class="product__image-wrapper" title="8-Bit Symphony Pro: First Half Surround-sound Blu-ray">
  <img src="//c64audio.com/cdn/shop/products/IMG_2564_grande.jpg?v=1606306879" alt="8-Bit Symphony Pro: First Half Surround-sound Blu-ray">
  </a>
  8-Bit Symphony Pro: First Half Surround-sound Blu-ray
  Regular price
  £28.99
  <a href="/products/8-bit-symphony-pro-second-half-surround-sound-blu-ray" class="product__image-wrapper" title="8-Bit Symphony Pro: Second Half Surround-sound Blu-ray (Pre-order)">
  <img src="//c64audio.com/cdn/shop/products/8-BitSymphonyPro2_f47816be-b9f4-4f88-b907-f3066e2b1d95_grande.png?v=1607193061" alt="8-Bit Symphony Pro: Second Half Surround-sound Blu-ray (Pre-order)">
  </a>
  8-Bit Symphony Pro: Second Half Surround-sound Blu-ray (Pre-order)
  Regular price
  £28.99
  <a href="/products/8-bit-symphony-pro-second-half-vip-package" class="product__image-wrapper" title="8-Bit Symphony Pro: VIP Packages">
  <img src="//c64audio.com/cdn/shop/products/8-BitSymphonyPro2_grande.jpg?v=1608309616" alt="8-Bit Symphony Pro: VIP Packages">
  </a>
  8-Bit Symphony Pro: VIP Packages
  From £99.00
  Choosing a selection results in a full page refresh.
  Press the space key then arrow keys to make a selection.
`;

// console.time('replicate');
// const output = await replicate.run(
//   'replicate/llama-7b:ac808388e2e9d8ed35a5bf2eaa7d83f0ad53f9e3df31a42e4eb0a0c3249b3165',
//   {
//     input: {
//       prompt: input,
//       temperature: 0.3,
//     },
//   }
// );
// console.timeEnd('replicate');
// console.log(output);
// console.log(output.join(''));

async function query(data) {
  const response = await fetch(
    'https://vt0ys9rme7ce175o.us-east-1.aws.endpoints.huggingface.cloud',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
const MAX_LENGTH = 1024 * 2;

const res = await query({
  inputs: input.slice(0, MAX_LENGTH) + '### Assistant:',
  temperature: 0.1,
});

console.log(res);
