import { createWriteStream } from 'node:fs';

import { stringify } from 'csv-stringify/sync';

import { getFeatures } from './getSiteEntries';

const writeStream = createWriteStream('./dataset.csv');

const dataset = getFeatures();

writeStream.write(
  stringify(['url', 'path', 'classification', 'features']) + '\n'
);

for (const pageFeatures of dataset) {
  const row = {
    url: pageFeatures.url,
    path: pageFeatures.path,
    classification: pageFeatures.classification['manual-cD'],
  };

  writeStream.write(stringify(row) + '\n');
}
