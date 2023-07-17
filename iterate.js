import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

function transform(cat) {
  if (cat === 'e-commerce product list') {
    return 'e-commerce product list/catalog';
  }

  if (cat === 'customer service/assistance/support') {
    return 'customer support and assistance/frequently asked questions';
  }

  if (cat === 'contact us/get a quote') {
    return 'contact us/get a pricing quote';
  }

  if (cat === 'legal informations') {
    return 'legal informations and terms and conditions';
  }

  return cat;
}

for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    const manualCC = features.classification['manual-cC'].answer[0];
    const manualCD = transform(manualCC);

    features.classification['manual-cD'] = {
      answer: [manualCD],
    };

    writeFileSync(
      path.join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}
