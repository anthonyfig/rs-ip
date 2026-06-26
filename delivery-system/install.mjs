#!/usr/bin/env node
// Delivery System installer — jumpstart a project from the rs-ip blueprint.
// Lays down everything a project needs to hit the ground running: the agents + the skills they use,
// the delivery-system reference docs, the Ground Truth knowledge (schema, templates, tooling, blueprint),
// a starter CLAUDE.md, the PR template, a delivery.yml, and a lockfile (which agent versions were installed).
// Re-run any time to pull in new / updated agents — it refreshes blueprint files and the lockfile, and
// keeps your delivery.yml and (unless --force-claude) your CLAUDE.md.
//
//   node delivery-system/install.mjs <target> [--agents=a,b,c] [--scaffold-gt] [--no-gt] [--force-claude]
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // rs-ip root
const args = process.argv.slice(2);
const target = args.find(a => !a.startsWith('--'));
if (!target) { console.error('usage: node delivery-system/install.mjs <target> [--agents=a,b,c] [--scaffold-gt] [--no-gt] [--force-claude]'); process.exit(1); }
const flag = n => args.includes('--' + n);
const opt = n => (args.find(a => a.startsWith('--' + n + '=')) || '').split('=')[1];
const withGT = !flag('no-gt');

const S = rel => path.join(HERE, rel);
const T = rel => path.join(target, rel);
const cp = (s, d) => { if (!fs.existsSync(s)) return; const st = fs.statSync(s); if (st.isDirectory()) { fs.mkdirSync(d, { recursive: true }); for (const e of fs.readdirSync(s)) cp(path.join(s, e), path.join(d, e)); } else { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); } };
const fm = (src, key) => (src.match(new RegExp('^' + key + ':\\s*(.+)$', 'm')) || [])[1]?.trim();
const safeCommit = () => { try { return execSync(`git -C "${HERE}" rev-parse --short HEAD`).toString().trim(); } catch { return ''; } };
const did = [];

// 1) Agents (all by default; a subset with --agents=...)
const agentsDir = S('.claude/agents');
const allAgents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
const chosen = opt('agents') ? opt('agents').split(',').map(s => s.trim() + '.md').filter(f => allAgents.includes(f)) : allAgents;
const lock = { source: 'rs-ip', source_commit: safeCommit(), installed: new Date().toISOString().slice(0, 10), agents: [] };
fs.mkdirSync(T('.claude/agents'), { recursive: true });
for (const f of chosen) {
  const src = fs.readFileSync(path.join(agentsDir, f), 'utf8');
  fs.writeFileSync(T('.claude/agents/' + f), src);
  lock.agents.push({ name: fm(src, 'name') || f.replace('.md', ''), version: fm(src, 'version') || '0.0.0', file: '.claude/agents/' + f });
}
did.push(`${lock.agents.length} agent(s)`);

// 2) Skills the agents use
cp(S('.claude/skills'), T('.claude/skills')); did.push('skills');

// 3) Delivery-system reference docs (so agents' ../../delivery-system/... links resolve)
for (const rel of ['README.md', 'provenance.md', 'delivery.schema.md', 'delivery.example.yml', 'capabilities', 'adapters', 'templates'])
  cp(S('delivery-system/' + rel), T('delivery-system/' + rel));
did.push('delivery-system docs');

// 4) PR template + 5) method docs
const prt = T('.github/PULL_REQUEST_TEMPLATE.md');
if (!fs.existsSync(prt)) { cp(S('pr/PULL_REQUEST_TEMPLATE.md'), prt); did.push('PR template'); } else did.push('PR template kept (existing)');
cp(S('docs/identifying-capabilities.md'), T('docs/identifying-capabilities.md'));
cp(S('docs/spec-and-pr-conventions.md'), T('docs/spec-and-pr-conventions.md'));
cp(S('docs/engineering-baseline.md'), T('docs/engineering-baseline.md')); did.push('method docs + engineering baseline');

// 6) Ground Truth knowledge (schema, templates, tooling, blueprint) — unless --no-gt
if (withGT) {
  cp(S('tools/ground-truth'), T('tools/ground-truth'));
  cp(S('templates/ground-truth/metadata-schema.md'), T('ground-truth/_schema/metadata-schema.md'));
  for (const f of fs.readdirSync(S('templates/ground-truth')).filter(f => f.endsWith('.template.md')))
    cp(S('templates/ground-truth/' + f), T('ground-truth/_schema/templates/' + f));
  if (!fs.existsSync(T('ground-truth/README.md'))) cp(S('templates/ground-truth/ground-truth-blueprint.md'), T('ground-truth/README.md'));
  did.push('ground-truth knowledge (schema, templates, tools, blueprint)');
  if (flag('scaffold-gt')) {
    for (const p of ['01-project-context', '02-domain-model', '03-capability-specs', '04-engineering-context', '05-integration-contracts', '06-eval-suite', '07-decision-log']) {
      const idx = T('ground-truth/' + p + '/_index.md');
      if (!fs.existsSync(idx)) { fs.mkdirSync(path.dirname(idx), { recursive: true }); fs.writeFileSync(idx, `# ${p}\n\n_Stub — fill per the blueprint (../README.md) and the schema (../_schema/metadata-schema.md)._\n`); }
    }
    did.push('scaffolded GT parts 01-07');
  }
}

// 7) Starter CLAUDE.md (kept if one already exists, unless --force-claude)
const claude = T('CLAUDE.md');
if (!fs.existsSync(claude) || flag('force-claude')) { cp(S('delivery-system/templates/CLAUDE.base.md'), claude); did.push('CLAUDE.md (starter — fill it in)'); }
else did.push('CLAUDE.md kept (existing)');

// 8) delivery.yml (kept if present) + lockfile
const dy = T('delivery.yml'); const createdManifest = !fs.existsSync(dy);
if (createdManifest) fs.copyFileSync(S('delivery-system/delivery.example.yml'), dy);
fs.writeFileSync(T('delivery-system.lock.json'), JSON.stringify(lock, null, 2) + '\n');

console.log(`Jumpstarted ${target} from rs-ip@${lock.source_commit || '(no git)'}:`);
for (const d of did) console.log('  + ' + d);
console.log('  agents: ' + lock.agents.map(a => `${a.name}@${a.version}`).join(', '));
console.log(createdManifest
  ? '\nNext: fill delivery.yml (tools / repo / environments), then build from CLAUDE.md.'
  : '\nKept your delivery.yml; refreshed agents, skills, docs + the lockfile.');
