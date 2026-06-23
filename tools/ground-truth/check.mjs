#!/usr/bin/env node
// Ground Truth consistency checker (EV-GT-CONSISTENCY).
// Usage: node tools/ground-truth/check.mjs   (exit 1 if any errors)
import { loadArtifacts, runChecks, stats, STATUS } from './lib.mjs';

const items = loadArtifacts();
const { errors, warnings, count } = runChecks(items);
const s = stats(items);

const c = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', b: '\x1b[34m', d: '\x1b[2m', x: '\x1b[0m' };
console.log(`\n${c.b}Ground Truth — consistency check${c.x}`);
console.log(`${c.d}Artifacts: ${count}  |  by status: ${Object.entries(s.byStatus).map(([k,v])=>`${k} ${v}`).join(', ')}${c.x}\n`);

if (errors.length) { console.log(`${c.r}✗ ${errors.length} error(s):${c.x}`); for (const e of errors) console.log(`  ${c.r}•${c.x} ${e.rel}: ${e.msg}`); }
else console.log(`${c.g}✓ EV-GT-CONSISTENCY PASS — every artifact is metadata-complete with valid status.${c.x}`);

if (warnings.length) { console.log(`\n${c.y}⚠ ${warnings.length} warning(s):${c.x}`); for (const w of warnings) console.log(`  ${c.y}•${c.x} ${w.rel}: ${w.msg}`); }

console.log('');
process.exit(errors.length ? 1 : 0);
