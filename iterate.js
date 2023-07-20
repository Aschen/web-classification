import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const path = join(siteDir, entry.name, 'features.json');

    const features = JSON.parse(readFileSync(path, 'utf-8'));

    features.path = './' + path;

    writeFileSync(path, JSON.stringify(features, null, 2));
  }
}
