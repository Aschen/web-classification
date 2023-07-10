import { read, readFileSync, readdir, statSync } from 'fs';
import path from 'path';

const directoryPath = './sites';

let sites = 0;
let pages = 0;

readdir(directoryPath, (error, files) => {
  if (error) {
    console.error('Error reading directory:', error);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      sites++;
      const links = JSON.parse(readFileSync(`${filePath}/links.json`, 'utf-8'));
      console.log(`${filePath}: ${Object.keys(links).length}`);
      pages += Object.keys(links).length;
    }
  });

  console.log(`Sites: ${sites}`);
  console.log(`Pages: ${pages}`);
});
