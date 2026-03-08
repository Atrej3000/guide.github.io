import { decodeEntities, listHtmlFiles, readText, stripTags, writeText } from './shared.js';

function extractEntries(file) {
  const html = readText(file);
  const entries = [];
  const headingRegex = /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi;

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const [, tag, attrs, rawInner] = match;
    const title = decodeEntities(stripTags(rawInner));
    if (!title) continue;

    const level = Number(tag.slice(1));
    const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
    const id = idMatch?.[1] ?? '';
    const after = html.slice(match.index + match[0].length, match.index + match[0].length + 2500);
    const text = decodeEntities(stripTags(after)).slice(0, 700);

    entries.push({
      page: file,
      title,
      level,
      id,
      href: id ? `${file}#${id}` : file,
      url: id ? `${file}#${id}` : file,
      text
    });
  }

  return entries;
}

const allEntries = listHtmlFiles()
  .filter(file => file !== '404.html')
  .flatMap(extractEntries);

writeText('assets/data/search-index.json', `${JSON.stringify(allEntries, null, 2)}\n`);
console.log(`Built assets/data/search-index.json with ${allEntries.length} entries.`);
