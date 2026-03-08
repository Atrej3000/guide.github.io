import fs from 'node:fs';
import path from 'node:path';
import { rootDir, writeText } from './shared.js';

const srcDir = path.join(rootDir, 'src/pages');
const partialsDir = path.join(rootDir, 'partials');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function normalizeClass(value) {
  return value ? String(value).trim() : '';
}

function buildHeaderVars(localVars = {}) {
  const active = localVars.active ?? 'home';
  return {
    skipTarget: localVars.skipTarget ?? 'mainContent',
    skipText: localVars.skipText ?? 'Перейти до основного змісту',
    homeActive: normalizeClass(active === 'home' ? 'active' : ''),
    manualActive: normalizeClass(active === 'manual' ? 'active' : ''),
    appendicesActive: normalizeClass(active === 'appendices' ? 'active' : '')
  };
}

function interpolate(template, vars) {
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key) => {
    return key in vars ? String(vars[key]) : '';
  });
}

function renderIncludes(content, inheritedVars = {}) {
  const includePattern = /<!--\s*@include\s+([^\s]+)\s*(\{[\s\S]*?\})?\s*-->/g;
  return content.replace(includePattern, (_, relPartialPath, rawJson) => {
    const partialPath = path.join(rootDir, relPartialPath);
    const partialTemplate = read(partialPath);
    const localVars = rawJson ? JSON.parse(rawJson) : {};
    const mergedVars = { ...inheritedVars, ...localVars };
    const derivedVars = relPartialPath.endsWith('site-header.html')
      ? buildHeaderVars(mergedVars)
      : {};
    const finalVars = { ...mergedVars, ...derivedVars };
    const renderedPartial = interpolate(partialTemplate, finalVars);
    return renderIncludes(renderedPartial, finalVars);
  });
}

function buildPage(filename) {
  const srcPath = path.join(srcDir, filename);
  const source = read(srcPath);
  const rendered = renderIncludes(source).replace(/\n{3,}/g, '\n\n');
  writeText(filename, rendered);
}

const files = fs.readdirSync(srcDir).filter(name => name.endsWith('.html')).sort();
for (const file of files) {
  buildPage(file);
}

console.log(`Built ${files.length} page(s) from src/pages via partials.`);
