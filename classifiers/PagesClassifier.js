import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

export class PagesClassifier {
  constructor(classifiers = []) {
    this.classifiers = classifiers;
  }

  async start(directory) {
    console.log(`Entering ${directory}`);

    const entries = readdirSync(directory, { withFileTypes: true });
    const totalConsumption = {
      pages: 0,
    };

    for (const entry of entries) {
      try {
        if (entry.isDirectory()) {
          const entryPath = path.join(directory, entry.name);

          if (existsSync(entryPath, 'features.json')) {
            const consumption = await this.classifyPage(entryPath);

            for (const [classifier, classifierConsumption] of Object.entries(
              consumption
            )) {
              if (!totalConsumption[classifier]) {
                totalConsumption[classifier] = {
                  tokens: 0,
                  cost: 0,
                };
              }
              totalConsumption[classifier].tokens +=
                classifierConsumption.tokens;
              totalConsumption[classifier].cost += classifierConsumption.cost;
            }
            totalConsumption.pages++;
          } else {
            await this.start(entryPath);
          }
        }
      } catch (error) {
        console.error(`Cannot classify ${entry.name}: ${error.message}`);
      }
    }

    return totalConsumption;
  }

  async classifyPage(pageDir) {
    const features = JSON.parse(
      readFileSync(path.join(pageDir, 'features.json'), 'utf-8')
    );
    const url = features.url;
    const openGraph = readFileSync(features.openGraph, 'utf-8');
    const contentText = readFileSync(features.contentText, 'utf-8');

    console.log(`Classifying ${url}`);
    features.classification ||= {};

    const consumption = {};

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
      path.join(pageDir, 'features.json'),
      JSON.stringify(features, null, 2)
    );

    return consumption;
  }

  async executeClassifier(classifier, features, inputs, consumption) {
    try {
      const result = await classifier.execute(inputs);

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
