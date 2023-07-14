import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import Readline from 'readline';

import { CATEGORIES_A } from './classifiers/index.js';

const readLine = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question, choices) {
  return new Promise((resolve) => {
    readLine.question(question, (answer) => {
      resolve(choices[parseInt(answer) - 1]);
    });
  });
}

const input = process.argv[2];
const exclude = process.argv[3] || null;
const parts = input.split('/');

const siteDir = parts.slice(0, parts.length - 1).join('/');
const nodeName = parts[parts.length - 1];

const entries = readdirSync(siteDir, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory() && entry.name.startsWith(nodeName)) {
    console.log(path.join(siteDir, entry.name));
  }
}

let i = 0;
for (const cat of CATEGORIES_A) {
  console.log(`${++i} ${cat}`);
}

console.log();
const answer = await ask('Which category? ', CATEGORIES_A);

for (const entry of entries) {
  if (entry.isDirectory() && entry.name.startsWith(nodeName)) {
    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );
    features.classification.manual = [answer];
    writeFileSync(
      path.join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}
readLine.close();
