import { readFileSync, readdirSync, write, writeFileSync } from 'fs';
import path from 'path';

import { stemmer } from 'stemmer';

function countWordFrequency(frequency, text) {
  // Remove punctuation and convert text to lowercase
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');

  // Split the text into an array of words
  const words = cleanedText.split(/\s+/);

  // Iterate over the words and count their frequencies
  for (const word of words) {
    if (frequency[word]) {
      frequency[word]++;
    } else {
      frequency[word] = 1;
    }
  }
}

const frequency = {};

for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    const textContent = readFileSync(features.contentText, 'utf-8');
    countWordFrequency(frequency, textContent);
  }
}

const arr = Object.entries(frequency);

arr.sort((a, b) => b[1] - a[1]);

console.log(arr);
const sortedObj = Object.fromEntries(arr);

writeFileSync(
  path.join(process.cwd(), 'frequency.json'),
  JSON.stringify(sortedObj, null, 2)
);
