#!/usr/bin/env node
// Guard: rs-ip must stay PROJECT-AGNOSTIC. Fails (exit 1) if project specifics leak in.
// Run in CI for rs-ip:  node scripts/check-agnostic.mjs
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELF = ['scripts/check-agnostic.mjs', 'scripts/agnostic-denylist.txt'];
const EXT = ['.md', '.mjs', '.js', '.ts', '.json', '.txt', '.astro', '.yml', '.yaml'];
const patterns = [
  [/\bgt-\d{2}-/i, 'project Ground Truth artifact id (gt-NN-…)'],
  [/\bBR-\d+\b/, 'project business-rule id (BR-N)'],
  [/\bOQ-\d+\b/, 'project open-question id (OQ-N)'],
  [/\brs-site(-gt)?\b/i, 'a specific project repo name'],
  [/\bDecision\s+\d{3,4}\b/i, 'a specific project decision number'],
];
let deny = [];
try { deny = fs.readFileSync(path.join(ROOT, 'scripts/agnostic-denylist.txt'), 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')); } catch {}
function walk(d, acc = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.name === '.git' || e.name === 'node_modules') continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p, acc); else if (EXT.includes(path.extname(e.name))) acc.push(p); } return acc; }
const hits = [];
for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f); if (SELF.some(s => rel.endsWith(s))) continue;
  fs.readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
    for (const [re, why] of patterns) if (re.test(ln)) hits.push(`${rel}:${i + 1}  ${why}\n      ${ln.trim().slice(0, 100)}`);
    for (const t of deny) if (ln.toLowerCase().includes(t.toLowerCase())) hits.push(`${rel}:${i + 1}  denylisted term "${t}"\n      ${ln.trim().slice(0, 100)}`);
  });
}
if (hits.length) { console.error(`✗ rs-ip is NOT project-agnostic — ${hits.length} issue(s):`); hits.forEach(h => console.error('  ' + h)); process.exit(1); }
console.log('✓ rs-ip is project-agnostic (no project specifics found).');
