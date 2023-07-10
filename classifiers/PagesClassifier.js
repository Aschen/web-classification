import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

export class PagesClassifier {
  constructor(classifiers = []) {
    this.classifiers = classifiers;
  }

  async start(directory) {
    console.log(`Entering ${directory}`);

    const entries = readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const entryPath = path.join(directory, entry.name);

        if (existsSync(entryPath, 'features.json')) {
          await this.classifyPage(entryPath);
        } else {
          await this.start(entryPath);
        }
      }
    }
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
    for (const classifier of this.classifiers) {
      if (features.classification[classifier.name]) {
        console.log('  Already classified');
        continue;
      }

      try {
        const result = await classifier.execute({
          url,
          openGraph,
          contentText,
        });

        features.classification[classifier.name] = result;
        console.log(`  ${classifier.name}: ${result}\n`);
      } catch (error) {
        console.error(error.message);
      }
    }

    writeFileSync(
      path.join(pageDir, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}
