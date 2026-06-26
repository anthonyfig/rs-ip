#!/usr/bin/env node
// Delivery System installer: instantiate the blueprint into a target project repo.
// Copies the chosen agents + the delivery-system reference docs, writes a delivery.yml (if missing),
// and a delivery-system.lock.json recording which agent versions were installed (install provenance).
//
//   node delivery-system/install.mjs <target-repo-dir> [--agents=qa,design-qa,issues-fixer]
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // rs-ip root
const target = process.argv[2];
if (!target) { console.error('usage: node delivery-system/install.mjs <target-repo-dir> [--agents=a,b,c]'); process.exit(1); }
const wantArg = (process.argv.find(a => a.startsWith('--agents=')) || '').split('=')[1];

const agentsDir = path.join(HERE, '.claude/agents');
const all = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
const chosen = wantArg ? wantArg.split(',').map(s => s.trim() + '.md').filter(f => all.includes(f)) : all;

const cp = (s, d) => { const st = fs.statSync(s); if (st.isDirectory()) { fs.mkdirSync(d, { recursive: true }); for (const e of fs.readdirSync(s)) cp(path.join(s, e), path.join(d, e)); } else { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); } };
const fm = (src, key) => (src.match(new RegExp('^' + key + ':\\s*(.+)$', 'm')) || [])[1]?.trim();

let commit = ''; try { commit = execSync(`git -C "${HERE}" rev-parse --short HEAD`).toString().trim(); } catch {}
const lock = { source: 'rs-ip', source_commit: commit, installed: new Date().toISOString().slice(0, 10), agents: [] };

const tAgents = path.join(target, '.claude/agents'); fs.mkdirSync(tAgents, { recursive: true });
for (const f of chosen) {
  const src = fs.readFileSync(path.join(agentsDir, f), 'utf8');
  fs.writeFileSync(path.join(tAgents, f), src);
  lock.agents.push({ name: fm(src, 'name') || f.replace('.md', ''), version: fm(src, 'version') || '0.0.0', file: '.claude/agents/' + f });
}
// reference docs so agents' ../../delivery-system/... links resolve in the target
for (const rel of ['README.md', 'provenance.md', 'delivery.schema.md', 'capabilities', 'adapters'])
  cp(path.join(HERE, 'delivery-system', rel), path.join(target, 'delivery-system', rel));
// delivery.yml from the example, only if the project doesn't have one yet
const dy = path.join(target, 'delivery.yml'); const createdManifest = !fs.existsSync(dy);
if (createdManifest) fs.copyFileSync(path.join(HERE, 'delivery-system', 'delivery.example.yml'), dy);
fs.writeFileSync(path.join(target, 'delivery-system.lock.json'), JSON.stringify(lock, null, 2) + '\n');

console.log(`Installed ${lock.agents.length} agent(s) into ${tAgents}`);
console.log(lock.agents.map(a => `  - ${a.name}@${a.version}`).join('\n'));
console.log(createdManifest ? 'Wrote delivery.yml (from example — fill it in) + delivery-system.lock.json' : 'Kept existing delivery.yml; updated delivery-system.lock.json');
