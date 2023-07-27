import { readFileSync } from 'node:fs';

import { BaseClassifier, Categories, PageFeatures } from '../classifiers';
import { getFeatures, getSitesEntries } from './getSiteEntries';
import { getRandomElements } from './random';

export function datasetByCategory(
  categories: Categories,
  {
    onlySites,
  }: {
    onlySites?: string[];
  } = {}
): Record<string, PageFeatures[]> {
  const dataset = getFeatures(onlySites);

  const manualClassifier = 'manual' + categories.suffix;
  const datasetByCategory: Record<string, PageFeatures[]> = {};

  for (const pageFeatures of dataset) {
    const category =
      pageFeatures.classification[manualClassifier]?.answer?.at(0);

    if (!category) {
      throw new Error(
        `Missing manual classification for ${pageFeatures.url} in ${manualClassifier}`
      );
    }

    if (!datasetByCategory[category]) {
      datasetByCategory[category] = [];
    }

    datasetByCategory[category].push(pageFeatures);
  }

  return datasetByCategory;
}

export function splitDatasetBySites(testSites: string[]) {
  const sites = getSitesEntries();

  const trainSet: PageFeatures[] = [];
  const testSet: PageFeatures[] = [];

  for (const [site, featuresPath] of Object.entries(sites)) {
    const pageFeatures = featuresPath.map((path) =>
      JSON.parse(readFileSync(path, 'utf-8'))
    );

    if (testSites.find((testSite) => testSite.includes(site))) {
      testSet.push(...pageFeatures);
    } else {
      trainSet.push(...pageFeatures);
    }
  }

  return { trainSet, testSet };
}

export function splitDatasetBySampling(
  categories: Categories,
  {
    trainPercentage,
    onlySites,
  }: {
    trainPercentage?: number;
    onlySites?: string[];
  } = {}
) {
  if (trainPercentage && (trainPercentage < 0 || trainPercentage > 1)) {
    throw new Error(
      `Invalid trainPercentage: ${trainPercentage} (should be between 0 and 1)`
    );
  }

  const dataset = datasetByCategory(categories, { onlySites });

  const trainSet: PageFeatures[] = [];
  const testSet: PageFeatures[] = [];

  for (const features of Object.values(dataset)) {
    const trainCount = Math.round(features.length * (trainPercentage ?? 0.8));
    const testCount = features.length - trainCount;

    trainSet.push(...getRandomElements<PageFeatures>(features, trainCount));
    testSet.push(...getRandomElements<PageFeatures>(features, testCount));
  }

  return { trainSet, testSet };
}

export function evaluateDataset(
  classifier: BaseClassifier,
  dataset: PageFeatures[]
) {
  const manualClassification = 'manual' + classifier.categories.suffix;

  let total = 0;
  let errors = 0;

  for (const pageFeatures of dataset) {
    const manualAnswer =
      pageFeatures.classification[manualClassification]?.answer?.at(0);
    const classifierAnswer =
      pageFeatures.classification[classifier.name]?.answer?.at(0);

    if (!manualAnswer) {
      throw new Error(
        `Missing manual classification for ${pageFeatures.url} (${manualClassification})`
      );
    }
    if (!classifierAnswer) {
      throw new Error(
        `Missing classification for ${pageFeatures.url} (${classifier.name})`
      );
    }

    total++;

    if (manualAnswer !== classifierAnswer) {
      errors++;
    }
  }

  return {
    total,
    errors,
    accuracy: ((total - errors) * 100) / total,
  };
}
