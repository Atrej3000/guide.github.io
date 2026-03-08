import fs from 'node:fs';
import path from 'node:path';

export const rootDir = process.cwd();

export function readText(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
}

export function writeText(relPath, text) {
  fs.writeFileSync(path.join(rootDir, relPath), text, 'utf8');
}

export function listHtmlFiles() {
  return fs.readdirSync(rootDir)
    .filter(name => name.endsWith('.html'))
    .sort();
}

export function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function collectIds(html) {
  const ids = new Set();
  const regex = /\sid=["']([^"']+)["']/gi;
  for (const match of html.matchAll(regex)) ids.add(match[1]);
  return ids;
}

export function getBodyPage(html) {
  const match = html.match(/<body[^>]*data-page=["']([^"']+)["']/i);
  return match?.[1] ?? 'default';
}
