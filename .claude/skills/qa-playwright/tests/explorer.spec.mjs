// First use: QA the Ground Truth Explorer — the checks that would have caught our real UI bug.
// Run: EXPLORER_FILE=../../rs-site-gt/ground-truth-explorer.html npx playwright test tests/explorer.spec.mjs
import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const FILE = process.env.EXPLORER_FILE || '../../rs-site-gt/ground-truth-explorer.html';
const url = pathToFileURL(path.resolve(FILE)).href;

test.beforeEach(async ({ page }) => { await page.goto(url); });

test('EXP-AC1 nav has no escaped text (e.g. backslash-quotes)', async ({ page }) => {
  const navText = await page.locator('#nav').innerText();
  expect(navText).not.toMatch(/\\"/);
});

test('EXP-AC2 user stories nest under a capability (indented children exist)', async ({ page }) => {
  await expect(page.locator('.nav a.child').first()).toBeVisible();
});

test('EXP-AC3 internal cross-links resolve in-app (no raw .md hrefs in content)', async ({ page }) => {
  await page.goto(url + '#gt-01-goals-and-scope');
  const hrefs = await page.locator('.art.active .doc a').evaluateAll(els => els.map(e => e.getAttribute('href') || ''));
  expect(hrefs.filter(h => /^[^#].*\.md$/.test(h))).toHaveLength(0);
});

test('EXP-AC4 search filters the nav', async ({ page }) => {
  const before = await page.locator('.nav a').count();
  await page.fill('#q', 'lead capture');
  await page.waitForTimeout(150);
  expect(await page.locator('.nav a').count()).toBeLessThan(before);
});
