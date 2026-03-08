import { listHtmlFiles, readText } from './shared.js';

const failures = [];
const warnings = [];

for (const file of listHtmlFiles()) {
  const html = readText(file);
  const headings = [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(match => ({
    level: Number(match[1].slice(1)),
    text: match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }));

  const h1Count = headings.filter(item => item.level === 1).length;
  if (h1Count !== 1) failures.push(`${file}: expected exactly 1 h1, found ${h1Count}.`);

  for (let i = 1; i < headings.length; i += 1) {
    const prev = headings[i - 1];
    const current = headings[i];
    if (current.level - prev.level > 1) {
      warnings.push(`${file}: heading level jumps from h${prev.level} to h${current.level} near "${current.text}".`);
    }
  }
}

if (warnings.length) {
  console.warn('Heading warnings:');
  warnings.forEach(item => console.warn(`- ${item}`));
}

if (failures.length) {
  console.error('Heading validation failed:');
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Heading validation passed for h1 requirements.');
