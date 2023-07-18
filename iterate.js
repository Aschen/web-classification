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
const sites = [];
for (const siteDir of process.argv.slice(2)) {
  const entries = readdirSync(siteDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    sites.push('./sites/' + entry.name);
    continue;
    const features = JSON.parse(
      readFileSync(path.join(siteDir, entry.name, 'features.json'), 'utf-8')
    );

    if (features.classification.manual) {
      features.classification['manual-cD'] = features.classification.manual;
    }

    writeFileSync(
      path.join(siteDir, entry.name, 'features.json'),
      JSON.stringify(features, null, 2)
    );
  }
}

console.log(sites.join(' '));
