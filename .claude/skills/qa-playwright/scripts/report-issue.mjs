#!/usr/bin/env node
// Report a QA gap as a GitHub issue. DRY-RUN by default; pass --file to actually create it.
// Requires the GitHub CLI (`gh auth login`) and GH_REPO=owner/repo (or --repo).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const k = argv[i].slice(2);
    const v = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : true;
    args[k] = v;
  }
}
const repo = args.repo || process.env.GH_REPO;
const title = args.title;
const body = args['body-file'] ? fs.readFileSync(args['body-file'], 'utf8') : (args.body || '');
const labels = args.labels || 'qa,bug';
if (!title) {
  console.error('Usage: report-issue.mjs --title "…" [--body "…" | --body-file f] [--labels a,b] [--repo owner/repo] [--file]');
  process.exit(1);
}
const gh = ['issue', 'create', '--title', String(title), '--body', body, '--label', labels];
if (repo) gh.push('--repo', String(repo));

if (!args.file) {
  console.log('[dry-run] would run: gh ' + gh.map(a => /\s/.test(a) ? JSON.stringify(a) : a).join(' '));
  console.log('Pass --file to actually create the issue (filing is side-effecting — confirm first).');
  process.exit(0);
}
try {
  console.log(execFileSync('gh', gh, { encoding: 'utf8' }).trim());
} catch (e) {
  console.error('gh failed:', e.message);
  process.exit(1);
}
