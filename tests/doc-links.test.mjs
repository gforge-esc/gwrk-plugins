/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { checkMarkdownLinks } from '../scripts/check-doc-links.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixture = name => resolve(root, 'tests/fixtures/doc-links', name);
const checker = resolve(root, 'scripts/check-doc-links.mjs');

test('valid links resolve files, headings, duplicate headings, explicit anchors and references offline', () => {
  assert.deepEqual(checkMarkdownLinks(fixture('valid')), []);
});

test('missing relative files fail with the source line', () => {
  const findings = checkMarkdownLinks(fixture('missing-file'));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 3);
  assert.match(findings[0].message, /Missing file/);
});

test('missing same-document and cross-document anchors both fail', () => {
  const findings = checkMarkdownLinks(fixture('missing-anchor'));
  assert.equal(findings.length, 2);
  assert.ok(findings.every(finding => /Missing heading or anchor/.test(finding.message)));
});

test('CLI exits nonzero for invalid documentation', () => {
  const result = spawnSync(process.execPath, [checker, fixture('missing-anchor')], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /README.md:3/);
  assert.match(result.stderr, /README.md:4/);
});

test('repository Markdown links pass without scanning negative fixtures', () => {
  assert.equal(execFileSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' }).includes('Markdown link check passed'), true);
});
