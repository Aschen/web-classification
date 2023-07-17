import { readFileSync, writeFileSync } from 'node:fs';

import { plot } from 'nodeplotlib';

import {
  CATEGORIES_A,
  CATEGORIES_B,
  GPTClassifier,
} from '../classifiers/index.js';
import { getSitesEntries } from '../data-set-tools/index.js';

const MANUAL = 'manual' + '-cB';
const CLASSIFIER = GPTClassifier.GPT35_16K + '-cB-pB';

const sites = getSitesEntries(process.argv.slice(2));

function plotAccuracy(title, { labels, successes, errors }) {
  plot(
    [
      {
        x: labels,
        y: successes,
        name: 'Success',
        type: 'bar',
      },
      {
        x: labels,
        y: errors,
        name: 'Error',
        type: 'bar',
      },
    ],
    {
      title,
      xaxis: {
        title: 'Category',
      },
      yaxis: {
        title: 'Accuracy',
      },
      barmode: 'stack',
    }
  );
}

function computeAccuracy(categories) {
  const accuracy = {};

  for (const category of categories) {
    accuracy[category] = {
      total: 0,
      success: 0,
    };
  }

  for (const [site, entries] of Object.entries(sites)) {
    for (const entry of entries) {
      const features = JSON.parse(readFileSync(entry, 'utf-8'));

      console.log(entry, features.classification[MANUAL][0]);
      accuracy[features.classification[MANUAL][0]].total++;
      if (
        features.classification[MANUAL][0] ===
        features.classification[CLASSIFIER].answer[0]
      ) {
        accuracy[features.classification[MANUAL][0]].success++;
      }
    }
  }

  const labels = [];
  const successes = [];
  const errors = [];

  for (const [category, { total, success }] of Object.entries(accuracy)) {
    if (total !== 0) {
      labels.push(category);
      successes.push((success * 100) / total);
      errors.push(100 - (success * 100) / total);
    }
  }

  return { labels, successes, errors };
}

plotAccuracy('Accuracy (Categories A)');

// plotAccuracy('Accuracy (Categories B)', computeAccuracy(CATEGORIES_B));
