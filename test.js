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
You are a classifier for web pages.
  You are given informations about a web page and you have to classify it as one of the following categories: 
  e-commerce product list/catalog, e-commerce product details, e-commerce cart, e-commerce shipping/delivery information, e-commerce customer reviews/testimonial, e-commerce gift cards, e-commerce returns/refunds and exchanges, physical store address/location/direction, customer support and assistance/frequently asked questions, contact us/get a pricing quote, blog, legal informations and terms and conditions, information about the company, press material, career opportunities, account login/register, other, page not found
  You will return a top 3 of the most probable categories for the given web page.
  Your response should be a list of comma separated values, example: e-commerce product details, e-commerce product list/catalog, legal informations and terms and conditions
  
  Here are the informations you have about the web page:
  The web page url is the more important to classify the web page: 
  https://www.audio-technica.com/en-gb/commercial-audio/microphone-series
  The Web page open graph information provide a good insight about the web page content: 
  og:title: Commercial Audio
og:url: https://www.audio-technica.com/en-gb/commercial-audio

  The Web page main content text can contains some noise but it is still a good source of information: 
  Skip to main content
×
Support
My Account
×
Close
<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5RXLB7K"
height="0" width="0" style="display:none;visibility:hidden"></iframe>
<div class="message global noscript">
<div class="content">
<p>
<strong>JavaScript seems to be disabled in your browser.</strong>
<span>For the best experience on our site, be sure to turn on Javascript in your browser.</span>
</p>
</div>
</div>
Accessing our website tells us you agree to our use of cookies. However you can change your cookie settings at any time.
Find out more.
Free Standard Delivery on all orders over £35
Home
Commercial Audio
ES925 Modular Gooseneck Microphone System
Customised Audio for Contractors
The ES925 modular microphone system offers several dozen variations to suit the needs of commercial operators. All ES925 modular microphone components are interchangeable with each other, allowing users to configure each microphone system from a choice of three different polar patterns, four power module options, and six different gooseneck lengths — a total of 72 combinations.
Prev
Next
ES925 Modular Gooseneck Microphone System
1. Choose Power Module
3-pin XLR (XLR)
The 3-pin XLR power module version plugs into any standard XLRF-type connector or mounts to 5/8″-27 microphone stands using the included quick-mount stand adapter.
3-pin flush-mount (FM3) | 5-pin flush-mount (FM5)
The 3-pin and 5-pin flush-mount power module options mount unobtrusively in tabletops and come with isolators that provide mechanical dampening of the mounting surface. Both versions are equipped with a capacitive touch switch to enable local muting of the microphone.
5-pin desk stand (DS5)
Featuring highly visible, two-state RGB LED status indicators, the 5-pin desk stand is also equipped with a touch-sensitive capacitive-type user switch with local and remote switching options and a UniSteep® filter that provides steep low-frequency attenuation to improve sound pickup without affecting vocal reproduction quality.
See more
Prev
Next
ES925 Modular Gooseneck Microphone System
2. Choose Gooseneck Length
Choose between 6 gooseneck microphone length options (4.85”, 9.08”, 12.08”, 15.08”, 18.08”, 21.08”).
Prev
Next
ES925 Modular Gooseneck Microphone System
3. Choose Microphone Polar Pattern
Choose between 3 standard polar pattern options
Cardioid
Hypercardioid
MicroLine®
An omnidirectional polar pattern is also available.
Prev
Next
ES925 Modular Gooseneck Microphone System
Build Your Own Configuration
Build your ES925/XLR microphone
Featuring the XLR power module
Build your ES925/FM3 microphone
Featuring the 3-pin flush-mount power module
Build your ES925/FM5 microphone
Featuring the 5-pin flush-mount power module
Build your ES925/DS5 microphone
Featuring the 5-pin desk stand power module
Prev
Next

  
The most probable categories are:`;

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
    'https://api-inference.huggingface.co/models/stabilityai/StableBeluga2',
    {
      headers: {
        Authorization: 'Bearer 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',
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

const res = await query({
  inputs: input,
});

console.log(res);
