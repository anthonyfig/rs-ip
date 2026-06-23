// Zero-dependency Ground Truth library: load + parse + validate + render.
// Used by check.mjs (CLI validator) and build-explorer.mjs (HTML navigator).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '..', '..');
export const GT_DIR = path.join(REPO_ROOT, 'ground-truth');

export const REQUIRED = ['id','title','part','type','owner','status','confidence','sources','updated','last_validated','applies_to'];
export const STATUS = ['draft','in-review','approved','needs-revalidation','deprecated'];
export const CONFIDENCE = ['high','medium','low'];

// ---------- file walk ----------
export function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

// ---------- frontmatter (YAML-lite, tailored to our schema) ----------
function stripQuotes(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  return s;
}
function parseInlineArray(s) {
  const inner = s.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!inner) return [];
  return inner.split(',').map(x => stripQuotes(x)).filter(Boolean);
}
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw, hasFm: false };
  const lines = m[1].split('\n');
  const meta = {};
  let key = null; // only set while we expect block-list items
  for (const line of lines) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const li = line.match(/^\s*-\s+(.*)$/);
    if (li && key) { (meta[key] ||= []).push(stripQuotes(li[1])); continue; }
    const kv = line.match(/^([A-Za-z0-9_]+):\s?(.*)$/);
    if (!kv) continue;
    const k = kv[1]; let v = kv[2];
    if (v === '') { meta[k] = []; key = k; }                 // block list follows (or empty)
    else if (v.trim().startsWith('[')) { meta[k] = parseInlineArray(v); key = null; }
    else { meta[k] = stripQuotes(v); key = null; }
  }
  return { meta, body: m[2], hasFm: true };
}

// ---------- load ----------
export function loadArtifacts() {
  const files = walk(GT_DIR).filter(p => !p.includes(path.join('_schema', 'templates')));
  return files.map(p => {
    const raw = fs.readFileSync(p, 'utf8');
    const { meta, body, hasFm } = parseFrontmatter(raw);
    const relPath = path.relative(REPO_ROOT, p);
    return {
      path: p, relPath,
      id: meta.id || relPath,
      isArtifact: hasFm && !!meta.id,   // README / schema docs have no id
      meta, body,
    };
  });
}

// ---------- checks (EV-GT-CONSISTENCY) ----------
export function runChecks(items) {
  const arts = items.filter(i => i.isArtifact);
  const ids = new Set(arts.map(a => a.id));
  const errors = [], warnings = [];
  for (const a of arts) {
    const miss = REQUIRED.filter(k => !(k in a.meta) || (Array.isArray(a.meta[k]) && a.meta[k].length === 0 && k === 'sources'));
    if (miss.length) errors.push({ id: a.id, rel: a.relPath, msg: `missing metadata: ${miss.join(', ')}` });
    if (a.meta.status && !STATUS.includes(a.meta.status)) errors.push({ id: a.id, rel: a.relPath, msg: `invalid status: ${a.meta.status}` });
    if (a.meta.confidence && !CONFIDENCE.includes(a.meta.confidence)) errors.push({ id: a.id, rel: a.relPath, msg: `invalid confidence: ${a.meta.confidence}` });
    if (a.meta.status === 'approved' && String(a.meta.last_validated).includes('pending'))
      errors.push({ id: a.id, rel: a.relPath, msg: `status=approved but last_validated is pending` });
    for (const r of (a.meta.related || [])) if (!ids.has(r)) warnings.push({ id: a.id, rel: a.relPath, msg: `related id not found: ${r}` });
  }
  return { errors, warnings, count: arts.length };
}

// ---------- stats ----------
export function stats(items) {
  const arts = items.filter(i => i.isArtifact);
  const by = (f) => arts.reduce((m, a) => (m[a.meta[f] || '—'] = (m[a.meta[f] || '—'] || 0) + 1, m), {});
  return { total: arts.length, byStatus: by('status'), byConfidence: by('confidence'), byPart: by('part') };
}

// ---------- minimal markdown -> HTML ----------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" loading="lazy">');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/(^|[^&\w])(#[0-9a-fA-F]{6})\b/g, '$1<span class="sw" style="background:$2"></span>$2');
  return s;
}
export function mdToHtml(md) {
  const lines = md.split('\n');
  let out = [], i = 0;
  const flushTable = (rows) => {
    if (rows.length < 2) { rows.forEach(r => out.push(`<p>${inline(r)}</p>`)); return; }
    const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const head = cells(rows[0]);
    let h = '<table><thead><tr>' + head.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
    for (let k = 2; k < rows.length; k++) h += '<tr>' + cells(rows[k]).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>';
    out.push(h + '</tbody></table>');
  };
  while (i < lines.length) {
    let ln = lines[i];
    if (/^```/.test(ln)) { let buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue; }
    if (/^\s*$/.test(ln)) { i++; continue; }
    if (/^#{1,6}\s+/.test(ln)) { const m = ln.match(/^(#{1,6})\s+(.*)$/); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); i++; continue; }
    if (/^(---+|\*\*\*+)\s*$/.test(ln)) { out.push('<hr>'); i++; continue; }
    if (/^\s*\|.*\|\s*$/.test(ln)) { const rows = []; while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(lines[i++].trim()); flushTable(rows); continue; }
    if (/^\s*>\s?/.test(ln)) { const buf = []; while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, '')); out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`); continue; }
    if (/^\s*[-*]\s+/.test(ln)) { const buf = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*[-*]\s+/, '')); out.push('<ul>' + buf.map(b => `<li>${inline(b)}</li>`).join('') + '</ul>'); continue; }
    if (/^\s*\d+\.\s+/.test(ln)) { const buf = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*\d+\.\s+/, '')); out.push('<ol>' + buf.map(b => `<li>${inline(b)}</li>`).join('') + '</ol>'); continue; }
    const buf = []; while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|\s*>|\s*[-*]\s|\s*\d+\.\s|\s*\|)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}
