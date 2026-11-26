/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function markdownFiles(root, directory = root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    const local = relative(root, path).split(sep).join('/');
    if (['.git', '.runs', 'node_modules'].includes(entry.name) || local === 'tests/fixtures') return [];
    if (entry.isDirectory()) return markdownFiles(root, path);
    return entry.isFile() && /\.md$/i.test(entry.name) ? [path] : [];
  });
}

function withoutFences(text) {
  let fence = null;
  return text.split('\n').map(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker && (!fence || (marker[1][0] === fence[0] && marker[1].length >= fence.length))) {
      fence = fence ? null : marker[1];
      return ' '.repeat(line.length);
    }
    return fence ? ' '.repeat(line.length) : line;
  }).join('\n');
}

function decodeEntities(text) {
  return text.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi, entity => {
    const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const hex = entity.toLowerCase().startsWith('&#x');
    return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10));
  });
}

function headingAnchors(text) {
  const anchors = new Set();
  for (const match of text.matchAll(/(?:^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$|^([^\n]+)\n {0,3}(?:={3,}|-{3,})\s*$)/gm)) {
    const title = decodeEntities(match[1] || match[2])
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[`*~]/g, '')
      .trim().toLowerCase()
      .replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
    let slug = title;
    let duplicate = 0;
    while (anchors.has(slug)) slug = `${title}-${++duplicate}`;
    anchors.add(slug);
  }
  for (const match of text.matchAll(/<(?:a|span)\b[^>]*\b(?:id|name)=["']([^"']+)["'][^>]*>/gi)) anchors.add(match[1]);
  return anchors;
}

function destination(value) {
  const raw = value.trim();
  return decodeEntities((raw.startsWith('<') ? raw.slice(1, raw.indexOf('>')) : raw.split(/\s/)[0]).replace(/\\([\\()[\] ])/g, '$1'));
}

function documentLinks(text) {
  const links = [];
  const references = new Map();
  const referenceName = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
  for (const match of text.matchAll(/^ {0,3}\[([^\]]+)\]:\s*(.+)$/gm)) references.set(referenceName(match[1]), destination(match[2]));
  const prose = text.replace(/`+[^`\n]*`+/g, match => ' '.repeat(match.length));
  let consumedUntil = 0;
  for (const match of prose.matchAll(/!?\[([^\]\n]+)\]/g)) {
    if (match.index < consumedUntil) continue;
    const after = match.index + match[0].length;
    if (prose[after] === ':') continue;
    let href;
    if (prose[after] === '(') {
      let depth = 1;
      let end = after + 1;
      for (; end < prose.length && depth; end++) {
        if (prose[end] === '\\') end++;
        else if (prose[end] === '(') depth++;
        else if (prose[end] === ')') depth--;
      }
      if (depth === 0) {
        href = destination(prose.slice(after + 1, end - 1));
        consumedUntil = end;
      }
    } else {
      const explicit = prose.slice(after).match(/^\[([^\]]*)\]/);
      href = references.get(referenceName(explicit ? explicit[1] || match[1] : match[1]));
      if (explicit) consumedUntil = after + explicit[0].length;
    }
    if (href) links.push({ href, line: prose.slice(0, match.index).split('\n').length });
  }
  return links;
}

export function checkMarkdownLinks(root) {
  const findings = [];
  const cache = new Map();
  const readDocument = path => {
    if (!cache.has(path)) cache.set(path, withoutFences(readFileSync(path, 'utf8')));
    return cache.get(path);
  };
  for (const file of markdownFiles(root)) {
    for (const { href, line } of documentLinks(readDocument(file))) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
      const [pathAndQuery, fragment] = href.split('#', 2);
      let target;
      let anchor;
      try {
        const path = decodeURIComponent(pathAndQuery.split('?', 1)[0]);
        target = path ? resolve(path.startsWith('/') ? root : dirname(file), path.replace(/^\//, '')) : file;
        anchor = fragment ? decodeURIComponent(fragment) : '';
      } catch {
        findings.push({ file, line, href, message: 'Invalid URL encoding' });
        continue;
      }
      const outside = relative(root, target);
      if (outside.startsWith(`..${sep}`) || outside === '..' || isAbsolute(outside) || !existsSync(target)) {
        findings.push({ file, line, href, message: 'Missing file or path outside repository' });
      } else if (anchor && extname(target).toLowerCase() === '.md' && statSync(target).isFile() && !headingAnchors(readDocument(target)).has(anchor)) {
        findings.push({ file, line, href, message: 'Missing heading or anchor' });
      }
    }
  }
  return findings;
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('..', import.meta.url));
  const findings = checkMarkdownLinks(root);
  for (const finding of findings) console.error(`${relative(root, finding.file)}:${finding.line}: ${finding.message} (${finding.href})`);
  if (!findings.length) console.log('Markdown link check passed. External URLs were not fetched.');
  process.exitCode = findings.length ? 1 : 0;
}
