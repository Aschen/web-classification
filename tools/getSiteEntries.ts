import { PageFeatures } from 'classifiers';
import { readdirSync, readFileSync } from 'node:fs';

const SITES_DIR = './sites';

function getPageFeatures(siteDir: string): string[] {
  const pageEntries = readdirSync(siteDir, { withFileTypes: true });

  const pages: string[] = [];

  for (const pageEntry of pageEntries) {
    if (!pageEntry.isDirectory()) {
      continue;
    }

    pages.push(`${siteDir}/${pageEntry.name}/features.json`);
  }

  return pages;
}

export function getSitesEntries(onlySites = []): Record<string, string[]> {
  const sitesEntries = readdirSync(SITES_DIR, { withFileTypes: true });

  const sites: Record<string, string[]> = {};

  for (const siteEntry of sitesEntries) {
    if (!siteEntry.isDirectory()) {
      continue;
    }
    const siteDir = `${SITES_DIR}/${siteEntry.name}`;

    if (onlySites.length && !onlySites.find((s) => s.startsWith(siteDir))) {
      continue;
    }

    sites[siteEntry.name] = getPageFeatures(siteDir);
  }

  return sites;
}

export function getFeatures(onlySites = []): PageFeatures[] {
  const sites = getSitesEntries(onlySites);

  const features: PageFeatures[] = [];

  for (const site of Object.values(sites)) {
    for (const page of site) {
      const f = JSON.parse(readFileSync(page, 'utf-8'));
      features.push(f);
    }
  }

  return features;
}
