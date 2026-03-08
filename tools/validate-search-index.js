import { collectIds, listHtmlFiles, readText } from './shared.js';

const htmlSet = new Set(listHtmlFiles());
const idsByFile = new Map([...htmlSet].map(file => [file, collectIds(readText(file))]));
const index = JSON.parse(readText('assets/data/search-index.json'));
const failures = [];

if (!Array.isArray(index) || index.length === 0) failures.push('assets/data/search-index.json is empty or invalid.');

for (const [i, entry] of index.entries()) {
  if (!entry?.page || !htmlSet.has(entry.page)) failures.push(`Entry ${i}: invalid page ${entry?.page}`);
  if (!entry?.title) failures.push(`Entry ${i}: missing title`);
  if (!entry?.text) failures.push(`Entry ${i}: missing text`);
  if (entry?.page && entry?.id && !idsByFile.get(entry.page)?.has(entry.id)) failures.push(`Entry ${i}: id "${entry.id}" not found in ${entry.page}`);
}

if (failures.length) {
  console.error('Search index validation failed:');
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Search index validation passed for ${index.length} entries.`);
