import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'node:path';

import { BaseClassifier, PageFeatures } from './BaseClassifier';

type ClassifiersConsumption = Record<
  string,
  {
    tokens: number;
    cost: number;
  }
>;

export type ClassificationReport = {
  classifiers: {
    [classifier: string]: {
      tokens: number;
      cost: number;
    };
  };
  pages: number;
};

export class PagesClassifier {
  private classifiers: BaseClassifier[];

  constructor(classifiers: BaseClassifier[] = []) {
    this.classifiers = classifiers;
  }

  async start(directory: string): Promise<ClassificationReport> {
    console.log(`Entering ${directory}`);

    const entries = readdirSync(directory, { withFileTypes: true });
    const totalConsumption: ClassificationReport = {
      classifiers: {},
      pages: 0,
    };

    for (const entry of entries) {
      try {
        if (!entry.isDirectory()) {
          continue;
        }

        const entryPath = join(directory, entry.name);

        if (!existsSync(join(entryPath, 'features.json'))) {
          await this.start(entryPath);
          continue;
        }

        const consumption = await this.classifyPage(entryPath);

        for (const [classifier, classifierConsumption] of Object.entries(
          consumption
        )) {
          if (!totalConsumption.classifiers[classifier]) {
            totalConsumption.classifiers[classifier] = {
              tokens: 0,
              cost: 0,
            };
          }
          totalConsumption.classifiers[classifier].tokens +=
            classifierConsumption.tokens;
          totalConsumption.classifiers[classifier].cost +=
            classifierConsumption.cost;
        }
        totalConsumption.pages++;
      } catch (error) {
        console.error(`Cannot classify ${entry.name}: ${error.message}`);
      }
    }

    return totalConsumption;
  }

  async classifyPage(pageDir: string) {
    const features: PageFeatures = JSON.parse(
      readFileSync(join(pageDir, 'features.json'), 'utf-8')
    );
    const url: string = features.url;
    const openGraph = readFileSync(features.openGraph, 'utf-8');
    const contentText = readFileSync(features.contentText, 'utf-8');

    console.log(`Classifying ${url}`);
    features.classification ||= {};

    const consumption: ClassifiersConsumption = {};

    const promises = [];
    for (const classifier of this.classifiers) {
      if (
        !classifier.options.force &&
        !classifier.options.estimateOnly &&
        features.classification[classifier.name]
      ) {
        console.log('  Already classified');
        continue;
      }

      if (!consumption[classifier.name]) {
        consumption[classifier.name] = {
          tokens: 0,
          cost: 0,
        };
      }

      promises.push(
        this.executeClassifier(
          classifier,
          features,
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

    writeFileSync(
      join(pageDir, 'features.json'),
      JSON.stringify(features, null, 2)
    );

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
    } catch (error) {
      console.error(`Cannot execute classifier ${classifier.name}: ${error}`);
      console.log(error);
    }
  }
}
