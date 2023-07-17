import { readFileSync, writeFileSync } from 'node:fs';

import { plot } from 'nodeplotlib';

import {
  BaseClassifier,
  CATEGORIES_A,
  CATEGORIES_B,
  GPTClassifier,
  GPTModels,
  PROMPT_B,
  PageFeatures,
} from '../classifiers';
import { getSitesEntries } from '../tools';

const sites = getSitesEntries(process.argv.slice(2));

function plotAccuracy(classifier: BaseClassifier) {
  const {
    labels,
    successesByCategory,
    errorsByCategory,
    totalByCategory,
    unusedLabels,
  } = computeAccuracy(classifier);

  plot(
    [
      {
        x: labels,
        y: successesByCategory,
        name: 'Success',
        type: 'bar',
      },
      {
        x: labels,
        y: errorsByCategory,
        name: 'Error',
        type: 'bar',
      },
    ],
    {
      title: `Accuracy (${classifier.name})`,
      xaxis: {
        title: 'Category',
      },
      yaxis: {
        title: 'Accuracy',
      },
      barmode: 'stack',
    }
  );

  plot(
    [
      {
        x: labels,
        y: totalByCategory,
        name: 'Total pages',
        type: 'bar',
      },
    ],
    {
      title: `Total pages by category (${classifier.name})`,
      xaxis: {
        title: 'Category',
      },
      yaxis: {
        title: 'Total pages',
      },
    }
  );

  plot(
    [
      {
        x: unusedLabels,
        y: unusedLabels.map((_) => 100),
        name: 'Unused categories',
        type: 'bar',
      },
    ],
    {
      title: `Unused categories (${classifier.name})`,
      xaxis: {
        title: 'Category',
      },
      yaxis: {
        title: '-',
      },
    }
  );
}

function computeAccuracy(classifier: BaseClassifier) {
  const accuracy: Record<string, { total: number; success: number }> = {};
  const manualClassifier = 'manual' + classifier.categories.suffix;

  for (const category of classifier.categories.labels) {
    accuracy[category] = {
      total: 0,
      success: 0,
    };
  }

  for (const [site, entries] of Object.entries(sites)) {
    for (const entry of entries) {
      const features: PageFeatures = JSON.parse(readFileSync(entry, 'utf-8'));

      const manualAnswer = features.classification[manualClassifier].answer[0];

      accuracy[manualAnswer].total++;

      if (manualAnswer === features.classification[classifier.name].answer[0]) {
        accuracy[manualAnswer].success++;
      }
    }
  }

  const labels = [];
  const unusedLabels = [];
  const totalByCategory = [];
  const successesByCategory = [];
  const errorsByCategory = [];

  for (const [category, { total, success }] of Object.entries(accuracy)) {
    if (total !== 0) {
      labels.push(category);
      successesByCategory.push((success * 100) / total);
      errorsByCategory.push(100 - (success * 100) / total);
      totalByCategory.push(total);
    } else {
      unusedLabels.push(category);
    }
  }

  return {
    labels,
    unusedLabels,
    successesByCategory,
    errorsByCategory,
    totalByCategory,
  };
}

plotAccuracy(new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES_A, PROMPT_B));

plotAccuracy(new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES_B, PROMPT_B));
