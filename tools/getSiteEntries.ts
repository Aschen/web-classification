import { readdirSync } from 'node:fs';

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
