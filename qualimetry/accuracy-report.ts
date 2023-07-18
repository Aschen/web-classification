import { readFileSync, writeFileSync } from 'node:fs';

import { PlotData, plot } from 'nodeplotlib';

import {
  BaseClassifier,
  CATEGORIES_A,
  CATEGORIES_B,
  CATEGORIES_C,
  CATEGORIES_D,
  GPTClassifier,
  GPTModels,
  PROMPT_A,
  PROMPT_B,
  PageFeatures,
} from '../classifiers';
import { getSitesEntries } from '../tools';

const sites = getSitesEntries(process.argv.slice(2));

const classifiersAccuracy: {
  [classifier: string]: {
    [category: string]: {
      total: number;
      success: number;
    };
  };
} = {};

function plotClassifierAccuracy(classifier: BaseClassifier) {
  const {
    labels,
    successesByCategory,
    errorsByCategory,
    totalByCategory,
    unusedLabels,
  } = extractStats(classifier);

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

function plotMetaAccuracy(classifiers: BaseClassifier[]) {
  const classifierNames = [];
  const successSeries = [];
  const errorSeries = [];

  for (const classifier of classifiers) {
    const { successesTotal, errorsTotal } = extractStats(classifier);

    const total = successesTotal + errorsTotal;

    classifierNames.push(classifier.name);
    successSeries.push((successesTotal * 100) / total);
    errorSeries.push((errorsTotal * 100) / total);
  }

  plot(
    [
      {
        x: classifierNames,
        y: successSeries,
        name: 'Success',
        type: 'bar',
      },
      {
        x: classifierNames,
        y: errorSeries,
        name: 'Error',
        type: 'bar',
      },
    ],
    {
      title: `Accuracy`,
      xaxis: {
        title: 'Classifier',
      },
      yaxis: {
        title: 'Accuracy',
      },
      barmode: 'stack',
    }
  );
}

function computeAccuracy(classifier: BaseClassifier) {
  if (classifiersAccuracy[classifier.name]) {
    return;
  }

  classifiersAccuracy[classifier.name] = {};

  const manualClassifier = 'manual' + classifier.categories.suffix;

  for (const category of classifier.categories.labels) {
    classifiersAccuracy[classifier.name][category] = {
      total: 0,
      success: 0,
    };
  }

  for (const [site, entries] of Object.entries(sites)) {
    for (const entry of entries) {
      const features: PageFeatures = JSON.parse(readFileSync(entry, 'utf-8'));

      const category = features.classification[manualClassifier].answer[0];

      classifiersAccuracy[classifier.name][category].total++;

      if (!features.classification[classifier.name]) {
        console.log(features.classification);
        console.log(entry);
        console.log(classifier.name);
      }
      if (category === features.classification[classifier.name].answer[0]) {
        classifiersAccuracy[classifier.name][category].success++;
      }
    }
  }
}

function extractStats(classifier: BaseClassifier) {
  if (!classifiersAccuracy[classifier.name]) {
    computeAccuracy(classifier);
  }

  const labels = [];
  const unusedLabels = [];
  const totalByCategory = [];
  const successesByCategory = [];
  const errorsByCategory = [];
  let successesTotal = 0;
  let errorsTotal = 0;

  for (const [category, { total, success }] of Object.entries(
    classifiersAccuracy[classifier.name]
  )) {
    if (total !== 0) {
      successesTotal += success;
      errorsTotal += total - success;

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
    successesTotal,
    errorsTotal,
  };
}

const classifiers = [
  // new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES_A, PROMPT_B),
  // new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES_B, PROMPT_B),
  // new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES_C, PROMPT_B),
  new GPTClassifier(GPTModels.GPT35_16K, CATEGORIES_D, PROMPT_B),
];

for (const classifier of classifiers) {
  plotClassifierAccuracy(classifier);
}

plotMetaAccuracy(classifiers);
