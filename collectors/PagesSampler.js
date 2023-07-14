import { writeFileSync } from 'fs';

export class PagesSampler {
  /**
   *
   * @param {string[]} links
   */
  constructor(links, options = {}) {
    this.links = links;
    this.sampledLinks = [];

    const defaultOptions = { leafSampleSize: 10, maxBranchSize: 30 };

    this.options = { ...defaultOptions, ...options };

    this.createTree();
  }

  sample(mainLinks = []) {
    const walkTree = (node, previousBranchSize = 0) => {
      const leafUrls = [];
      const nodes = [];

      for (const child of node.children) {
        if (child.children.length > 0) {
          nodes.push(child);
        } else {
          leafUrls.push(child.url);
        }
      }

      const sample = this.getRandomElements(
        leafUrls,
        this.options.leafSampleSize
      );
      this.sampledLinks.push(node.url);
      this.sampledLinks.push(...sample);

      const currentbranchSize = previousBranchSize + sample.length + 1;

      if (currentbranchSize < this.options.maxBranchSize) {
        for (const child of nodes) {
          walkTree(child, currentbranchSize);
        }
      }
    };

    walkTree(this.tree);

    this.sampledLinks = this.sampledLinks
      .filter((l) => l)
      .map((l) => this.sanitizeLink(l));

    for (const mainLink of mainLinks) {
      if (!this.sampledLinks.includes(mainLink)) {
        this.sampledLinks.push(mainLink);
      }
    }

    console.log(`Sampled ${this.sampledLinks.length} links`);

    return this.sampledLinks;
  }

  createTree() {
    this.tree = {
      root: true,
      name: 'root',
      children: [],
    };

    for (const link of this.links) {
      const parts = link
        .replace('https://', '')
        .split('/')
        .filter((p) => p !== '');

      let current = this.tree;

      let url = 'https://';
      for (const part of parts) {
        url += `${part}/`;

        let child = current.children.find((c) => c.name === part);

        if (child === undefined) {
          child = {
            name: part,
            url,
            children: [],
          };

          current.children.push(child);
        }

        current = child;
      }
    }
  }

  /**
   * Select random elements from an array using Fisher-Yates algorithm
   */
  getRandomElements(array, n) {
    const shuffled = array.slice();

    let currentIndex = shuffled.length;

    while (currentIndex > 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }

    return shuffled.slice(0, n);
  }

  save() {
    writeFileSync('./sample.json', JSON.stringify(this.sampledLinks, null, 2));
  }

  sanitizeLink(link) {
    return link.replace(/\n/g, '').trim().replace(/\/$/, '');
  }
}
