import fs from 'node:fs';
import path from 'node:path';
import { collectIds, listHtmlFiles, readText } from './shared.js';

const htmlFiles = listHtmlFiles();
const htmlSet = new Set(htmlFiles);
const idsByFile = new Map(htmlFiles.map(file => [file, collectIds(readText(file))]));
const failures = [];

function fileExists(relPath) {
  return fs.existsSync(path.join(process.cwd(), relPath));
}

for (const file of htmlFiles) {
  const html = readText(file);
  const linkRegex = /<(?:a|link)\b[^>]+(?:href)=["']([^"']+)["'][^>]*>/gi;

  for (const match of html.matchAll(linkRegex)) {
    const href = match[1].trim();
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) continue;

    const [targetPathRaw, hash] = href.split('#');
    const targetPath = targetPathRaw || file;

    if (targetPath.endsWith('.html')) {
      if (!htmlSet.has(targetPath)) {
        failures.push(`${file}: missing HTML target ${href}`);
        continue;
      }
      if (hash && !idsByFile.get(targetPath)?.has(hash)) failures.push(`${file}: missing anchor ${href}`);
      continue;
    }

    if (!fileExists(targetPath)) failures.push(`${file}: missing asset ${href}`);
  }
}

if (failures.length) {
  console.error('Link validation failed:');
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Link validation passed for all local links and assets.');
