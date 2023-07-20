import { readFileSync, writeFileSync } from 'node:fs';

import { BaseClassifier, PageFeatures } from './BaseClassifier';

type ClassifiersConsumption = Record<
  string,
  {
    tokens: number;
    cost: number;
    time: number;
  }
>;

export type ClassificationReport = {
  classifiers: {
    [classifier: string]: {
      tokens: number;
      cost: number;
      time: number;
    };
  };
  pages: number;
};

export class PagesClassifier {
  private classifiers: BaseClassifier[];

  constructor(classifiers: BaseClassifier[] = []) {
    this.classifiers = classifiers;
  }

  async start(dataset: PageFeatures[]): Promise<ClassificationReport> {
    console.log(`Start classifying ${dataset.length} pages`);

    const report: ClassificationReport = {
      classifiers: {},
      pages: 0,
    };

    for (const pageFeatures of dataset) {
      try {
        const consumption = await this.classifyPage(pageFeatures);

        for (const [classifier, classifierConsumption] of Object.entries(
          consumption
        )) {
          if (!report.classifiers[classifier]) {
            report.classifiers[classifier] = {
              tokens: 0,
              cost: 0,
              time: 0,
            };
          }
          report.classifiers[classifier].tokens += classifierConsumption.tokens;
          report.classifiers[classifier].cost += classifierConsumption.cost;
          report.classifiers[classifier].time += classifierConsumption.time;
        }

        report.pages++;
      } catch (error) {
        console.error(`Cannot classify ${pageFeatures.url}: ${error.message}`);
      }
    }

    return report;
  }

  async classifyPage(pageFeatures: PageFeatures) {
    const url: string = pageFeatures.url;
    const openGraph = readFileSync(pageFeatures.openGraph, 'utf-8');
    const contentText = readFileSync(pageFeatures.contentText, 'utf-8');

    console.log(`Classifying ${url}`);
    pageFeatures.classification ||= {};

    const consumption: ClassifiersConsumption = {};

    const promises = [];
    for (const classifier of this.classifiers) {
      if (
        !classifier.options.force &&
        !classifier.options.estimateOnly &&
        pageFeatures.classification[classifier.name]
      ) {
        console.log('  Already classified');
        continue;
      }

      if (!consumption[classifier.name]) {
        consumption[classifier.name] = {
          tokens: 0,
          cost: 0,
          time: 0,
        };
      }

      promises.push(
        this.executeClassifier(
          classifier,
          pageFeatures,
          {
            url,
            openGraph,
            contentText,
          },
          consumption
        )
      );
    }
    await Promise.all(promises);

    writeFileSync(pageFeatures.path, JSON.stringify(pageFeatures, null, 2));

    return consumption;
  }

  async executeClassifier(
    classifier: BaseClassifier,
    features: PageFeatures,
    inputs: Record<string, any>,
    consumption: ClassifiersConsumption
  ) {
    try {
      const result = await classifier.execute(inputs, features);

      if (!classifier.options.estimateOnly) {
        features.classification[classifier.name] = result;
      }

      console.log(
        `  ${classifier.name}: ${result.answer[0]} (${result.cost} $)\n`
      );

      consumption[classifier.name].tokens += result.tokens;
      consumption[classifier.name].cost += result.cost;
      consumption[classifier.name].time += result.time;
    } catch (error) {
      console.error(`Cannot execute classifier ${classifier.name}: ${error}`);
      console.log(error);
    }
  }
}
