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

    if (features.classification['manual-cA-']) {
      features.classification['manual-cA'] =
        features.classification['manual-cA-'];
      delete features.classification['manual-cA-'];
    }
    if (features.classification['manual-cB-']) {
      features.classification['manual-cB'] =
        features.classification['manual-cB-'];
      delete features.classification['manual-cB-'];
    }

    writeFileSync(
      path.join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}
