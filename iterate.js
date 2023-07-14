import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    features.classification['manual-cB'] = features.classification['manual'];

    writeFileSync(
      path.join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}
