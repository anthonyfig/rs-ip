// Generic spec-driven test: runs scenarios from specs/*.specs.json against BASE_URL.
// scenario: { id, name, path, steps:[{action:goto|click|fill|wait, selector?, value?}], expect:[{type:visible|text|url|count, selector?, value?}] }
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'specs');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.specs.json')) : [];

for (const f of files) {
  const suite = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  test.describe(suite.capability || f, () => {
    for (const sc of (suite.scenarios || [])) {
      test(`${sc.id} — ${sc.name}`, async ({ page }) => {
        await page.goto(sc.path || '/');
        for (const s of (sc.steps || [])) {
          if (s.action === 'goto') await page.goto(s.value);
          else if (s.action === 'click') await page.click(s.selector);
          else if (s.action === 'fill') await page.fill(s.selector, s.value);
          else if (s.action === 'wait') await page.waitForSelector(s.selector);
        }
        for (const e of (sc.expect || [])) {
          if (e.type === 'visible') await expect(page.locator(e.selector)).toBeVisible();
          else if (e.type === 'text') await expect(page.locator(e.selector)).toContainText(e.value);
          else if (e.type === 'url') await expect(page).toHaveURL(new RegExp(e.value));
          else if (e.type === 'count') await expect(page.locator(e.selector)).toHaveCount(Number(e.value));
        }
      });
    }
  });
}
