// A PlantUML subset for use case and class diagrams: parse(text, kind) -> model, render(model) -> SVG (layout by dagre).
// The syntax is kept PlantUML-compatible so students can paste their code into planttext.com.
const norm = s => s.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const NAME = String.raw`"[^"]+"|\([^)]+\)|[\p{L}\p{N}_]+`;
const DECL = new RegExp(String.raw`^(actor|usecase|abstract\s+class|abstract|class|interface|enum|rectangle|package)\s+(${NAME})(?:\s+as\s+([\p{L}\p{N}_]+))?\s*(\{)?\s*(\})?$`, 'iu');
const SHORT = new RegExp(String.raw`^(\([^)]+\))(?:\s+as\s+([\p{L}\p{N}_]+))?$`, 'u');
// A "1" <|-- "*" B : label. The `o` diamond only counts when it touches the line, so names like "Kolo" stay names.
const REL = new RegExp(String.raw`^(${NAME})\s*(?:"([^"]*)"\s*)?(<\||<|\*|o(?=[-.]))?(-+|\.+)(\|>|>|\*|o(?=[\s"]|$))?\s*(?:"([^"]*)"\s*)?(${NAME})\s*(?::\s*(.*))?$`, 'u');
const TYPES = { actor: 'actor', usecase: 'usecase', class: 'class', abstract: 'abstract', 'abstract class': 'abstract', interface: 'interface', enum: 'enum', rectangle: 'rect', package: 'rect' };
const HEAD_L = { '<|': 'tri', '<': 'arrow', '*': 'diamondF', o: 'diamond' }, HEAD_R = { '|>': 'tri', '>': 'arrow', '*': 'diamondF', o: 'diamond' };
const strip = tok => tok.replace(/^["(]|[")]$/g, '').trim();

function parse(text, kind) {
  const list = [], index = {}, rels = [], errors = [], stack = [];
  const get = n => index[norm(n)];
  const add = (tok, type, alias, implicit) => {
    const label = strip(tok);
    let e = get(alias || label) || (alias && get(label));
    const rect = stack.findLast(s => s.type === 'rect');
    if (!e) { e = { key: norm(alias || label), type, label, attrs: [], ops: [], parent: rect?.key || null }; list.push(e); }
    else if (!implicit) { e.type = type; if (rect && rect !== e) e.parent = rect.key; }
    index[norm(alias || label)] = e;
    index[norm(label)] ??= e;
    return e;
  };
  const ref = tok => get(strip(tok)) || add(tok, tok[0] === '(' ? 'usecase' : kind === 'usecase' ? 'actor' : 'class', null, true);

  const member = (e, line) => {
    const st = /\{static\}/i.test(line), ab = /\{abstract\}/i.test(line);
    const t = line.replace(/\{(static|abstract)\}/gi, '').trim();
    if (!t) return;
    if (e.type === 'enum') { t.split(/[\s,]+/).filter(Boolean).forEach(v => e.attrs.push({ text: v, name: v, vis: '', type: '' })); return; }
    const vis = '+-#~'.includes(t[0]) ? t[0] : '', rest = t.slice(vis.length).trim();
    const p = rest.match(/^([\p{L}\p{N}_]+)\s*(\(([^)]*)\))?\s*(?::\s*(.+))?$/u);
    const isOp = p ? !!p[2] : rest.includes('(');
    (isOp ? e.ops : e.attrs).push({ text: t, vis, name: p ? p[1] : rest, type: p?.[4]?.trim() || '', params: p?.[3]?.trim() ?? '', static: st, abstract: ab });
  };

  const relation = ([, ta, am, lh, line, rh, bm, tb, label], no) => {
    const a = ref(ta), b = ref(tb), dashed = line[0] === '.', lab = (label || '').trim();
    const L = HEAD_L[lh], R = HEAD_R[rh], head = R || L, rev = !R && !!L;
    const kind = head === 'tri' ? (dashed ? 'realization' : 'generalization')
      : head === 'diamondF' ? 'composition' : head === 'diamond' ? 'aggregation'
      : dashed ? (/include/i.test(lab) ? 'include' : /extend/i.test(lab) ? 'extend' : 'dependency') : 'association';
    rels.push({ a: a.key, b: b.key, lh: L, rh: R, dashed, kind, nav: kind === 'association' && !!head, label: lab, line: no,
      from: (rev ? b : a).key, to: (rev ? a : b).key, fromMult: (rev ? bm : am)?.trim(), toMult: (rev ? am : bm)?.trim(), aMult: am?.trim(), bMult: bm?.trim() });
  };

  const lines = text.split('\n');
  lines.forEach((raw, i) => {
    const line = raw.trim(), no = i + 1, top = stack[stack.length - 1];
    if (!line || line[0] === "'" || /^(@startuml|@enduml|left to right|top to bottom|skinparam|hide|show|title)\b/i.test(line)) return;
    if (line === '}') { if (!stack.pop()) errors.push({ line: no, msg: 'nawias } bez pasującego {' }); return; }
    if (top && top.type !== 'rect') return member(top, line);
    let m;
    if ((m = line.match(DECL))) { const e = add(m[2], TYPES[m[1].toLowerCase().replace(/\s+/, ' ')], m[3]); if (m[4] && !m[5]) stack.push(e); return; }
    if ((m = line.match(SHORT))) { add(m[1], 'usecase', m[2]); return; }
    if ((m = line.match(REL))) return relation(m, no);
    errors.push({ line: no, msg: `nie rozumiem tej linii: ${line}` });
  });
  if (stack.length) errors.push({ line: lines.length, msg: `brakuje } zamykającego „${stack[stack.length - 1].label}”` });

  const key = v => v == null ? null : typeof v === 'string' ? (get(v)?.key ?? '\0') : v.key;
  return {
    kind, els: list, rels, errors, get,
    // like(/regex/ or 'substring', type): elements whose label matches, lowercase and without Polish letters
    like: (re, type) => list.filter(e => (!type || e.type === type) && (re instanceof RegExp ? re.test(norm(e.label)) : norm(e.label).includes(norm(re)))),
    // links(kind, from, to): relations of that kind; null matches anything; associations match in both directions
    links(k, x, y) {
      const X = key(x), Y = key(y);
      return rels.filter(r => (!k || r.kind === k) && (((X == null || r.from === X) && (Y == null || r.to === Y)) || (r.kind === 'association' && (X == null || r.to === X) && (Y == null || r.from === Y))));
    },
    mult: (r, n) => { const k = key(n); return r.from === k ? r.fromMult : r.to === k ? r.toMult : undefined; },
  };
}

// ---------- drawing (browser only) ----------
const FONT = '13px system-ui, -apple-system, "Segoe UI", sans-serif', INK = '#1d2330', LH = 18;
const STEREO = { interface: '«interface»', enum: '«enumeration»' };
let ctx;
const tw = (s, bold) => { ctx ??= document.createElement('canvas').getContext('2d'); ctx.font = (bold ? 'bold ' : '') + FONT; return ctx.measureText(s).width; };
const x = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const guil = s => s.replace(/<<\s*/g, '«').replace(/\s*>>/g, '»');
const f = n => n.toFixed(1);

function size(e) {
  if (e.type === 'actor') return { width: Math.max(44, tw(e.label) + 12), height: 72 };
  if (e.type === 'usecase') return { width: tw(e.label) + 44, height: 44 };
  if (e.type === 'rect') return { width: tw(e.label, true) + 40, height: 60 };
  const parts = e.type === 'enum' ? [e.attrs.length] : [e.attrs.length, e.ops.length];
  const widths = [...e.attrs, ...e.ops].map(m => tw(m.text) + 20);
  return { width: Math.max(100, tw(e.label, true) + 24, tw(STEREO[e.type] || '') + 24, ...widths), height: (STEREO[e.type] ? 2 : 1) * LH + 10 + parts.reduce((s, n) => s + n * LH + 8, 0) };
}

const DEFS = `<defs>
<marker id="arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11" fill="none" stroke="${INK}" stroke-width="1.3"/></marker>
<marker id="tri" viewBox="0 0 16 16" refX="15" refY="8" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1,1 L15,8 L1,15 z" fill="#fff" stroke="${INK}" stroke-width="1.3"/></marker>
<marker id="diamond" viewBox="0 0 20 12" refX="19" refY="6" markerWidth="20" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1,6 L10,1 L19,6 L10,11 z" fill="#fff" stroke="${INK}" stroke-width="1.3"/></marker>
<marker id="diamondF" viewBox="0 0 20 12" refX="19" refY="6" markerWidth="20" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1,6 L10,1 L19,6 L10,11 z" fill="${INK}" stroke="${INK}" stroke-width="1.3"/></marker>
</defs>`;

function render(m) {
  const uc = m.kind === 'usecase', byKey = Object.fromEntries(m.els.map(e => [e.key, e]));
  const g = new dagre.graphlib.Graph({ compound: true, multigraph: true });
  g.setGraph({ rankdir: uc ? 'LR' : 'TB', nodesep: uc ? 24 : 50, ranksep: uc ? 80 : 70, edgesep: 20, marginx: 30, marginy: 40 });
  m.els.forEach(e => g.setNode(e.key, size(e)));
  m.els.forEach(e => { if (e.parent && byKey[e.parent] && e.parent !== e.key) g.setParent(e.key, e.parent); });
  // Layout direction: parents, wholes and base use cases come first (top in class diagrams, left in use case diagrams).
  const first = ['generalization', 'realization', 'composition', 'aggregation', 'extend'];
  m.rels.filter(r => r.a !== r.b && byKey[r.a].type !== 'rect' && byKey[r.b].type !== 'rect').forEach((r, i) => {
    const [s, t] = r.kind === 'association' ? [r.a, r.b] : first.includes(r.kind) ? [r.to, r.from] : [r.from, r.to];
    const lab = guil(r.label);
    g.setEdge(s, t, { width: lab ? tw(lab) + 10 : 0, height: lab ? 18 : 0, labelpos: 'c', r, s, lab }, 'e' + i);
  });
  dagre.layout(g);

  const out = [];
  m.els.filter(e => e.type === 'rect').forEach(e => {
    const n = g.node(e.key), top = n.y - n.height / 2 - 26;
    out.push(`<rect x="${f(n.x - n.width / 2)}" y="${f(top)}" width="${f(n.width)}" height="${f(n.height + 26)}" fill="#fafbfc" stroke="${INK}" stroke-width="1.2"/><text x="${f(n.x - n.width / 2 + 10)}" y="${f(top + 18)}" font-weight="bold">${x(e.label)}</text>`);
  });

  g.edges().forEach(id => {
    const ed = g.edge(id), r = ed.r, pts = ed.points.map(p => ({ ...p }));
    if (ed.s !== r.a) pts.reverse(); // now drawn from a to b, so marker-start belongs to a
    for (const [i, j, k] of [[0, 1, r.a], [pts.length - 1, pts.length - 2, r.b]]) {
      // dagre clips to the node's box; ellipses and stick figures (narrower than their label) need their own clip
      const type = byKey[k].type, n = g.node(k);
      if (type !== 'usecase' && type !== 'actor') continue;
      const cy = type === 'actor' ? n.y - 8 : n.y, dx = pts[j].x - n.x, dy = pts[j].y - cy;
      const t = type === 'actor' ? Math.min(18 / Math.abs(dx), 28 / Math.abs(dy)) : 1 / Math.hypot(dx / (n.width / 2), dy / (n.height / 2));
      if (isFinite(t) && t < 1) pts[i] = { x: n.x + dx * t, y: cy + dy * t };
    }
    out.push(`<path d="M ${pts.map(p => f(p.x) + ',' + f(p.y)).join(' L ')}" fill="none" stroke="${INK}" stroke-width="1.2"${r.dashed ? ' stroke-dasharray="6 4"' : ''}${r.lh ? ` marker-start="url(#${r.lh})"` : ''}${r.rh ? ` marker-end="url(#${r.rh})"` : ''}/>`);
    for (const [i, j, t] of [[0, 1, r.aMult], [pts.length - 1, pts.length - 2, r.bMult]]) {
      if (!t) continue;
      const p = pts[i], q = pts[j], d = Math.hypot(q.x - p.x, q.y - p.y) || 1, ux = (q.x - p.x) / d, uy = (q.y - p.y) / d;
      out.push(`<text x="${f(p.x + ux * 18 - uy * 11)}" y="${f(p.y + uy * 18 + ux * 11 + 4)}" text-anchor="middle" font-size="12">${x(t)}</text>`);
    }
    if (ed.lab) out.push(`<text x="${f(ed.x)}" y="${f(ed.y + 4)}" text-anchor="middle" font-size="12" stroke="#fff" stroke-width="4" paint-order="stroke">${x(ed.lab)}</text>`);
  });

  m.els.forEach(e => {
    if (e.type === 'rect') return;
    const n = g.node(e.key), x0 = n.x - n.width / 2, y0 = n.y - n.height / 2;
    if (e.type === 'actor') {
      const cx = n.x, t = y0;
      out.push(`<g fill="#fff" stroke="${INK}" stroke-width="1.4"><circle cx="${f(cx)}" cy="${f(t + 9)}" r="8"/><path d="M${f(cx)},${f(t + 17)} V${f(t + 36)} M${f(cx - 14)},${f(t + 24)} H${f(cx + 14)} M${f(cx - 12)},${f(t + 50)} L${f(cx)},${f(t + 36)} L${f(cx + 12)},${f(t + 50)}" fill="none"/></g><text x="${f(cx)}" y="${f(t + 66)}" text-anchor="middle">${x(e.label)}</text>`);
    } else if (e.type === 'usecase') {
      out.push(`<ellipse cx="${f(n.x)}" cy="${f(n.y)}" rx="${f(n.width / 2)}" ry="${f(n.height / 2)}" fill="#fff" stroke="${INK}" stroke-width="1.2"/><text x="${f(n.x)}" y="${f(n.y + 4.5)}" text-anchor="middle">${x(e.label)}</text>`);
    } else {
      let y = y0;
      out.push(`<rect x="${f(x0)}" y="${f(y0)}" width="${f(n.width)}" height="${f(n.height)}" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`);
      if (STEREO[e.type]) { y += LH; out.push(`<text x="${f(n.x)}" y="${f(y + 2)}" text-anchor="middle" font-size="12">${STEREO[e.type]}</text>`); }
      y += LH;
      out.push(`<text x="${f(n.x)}" y="${f(y + 2)}" text-anchor="middle" font-weight="bold"${e.type === 'abstract' ? ' font-style="italic"' : ''}>${x(e.label)}</text>`);
      y += 10;
      (e.type === 'enum' ? [e.attrs] : [e.attrs, e.ops]).forEach(part => {
        out.push(`<line x1="${f(x0)}" y1="${f(y)}" x2="${f(x0 + n.width)}" y2="${f(y)}" stroke="${INK}" stroke-width="1.2"/>`);
        part.forEach((mb, k) => out.push(`<text x="${f(x0 + 8)}" y="${f(y + 4 + LH * (k + 1) - 5)}"${mb.static ? ' text-decoration="underline"' : ''}${mb.abstract ? ' font-style="italic"' : ''}>${x(mb.text)}</text>`));
        y += part.length * LH + 8;
      });
    }
  });

  const { width: W, height: H } = g.graph();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${f(W)}" height="${f(H)}" viewBox="0 0 ${f(W)} ${f(H)}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="13" fill="${INK}">${DEFS}<rect width="100%" height="100%" fill="#fff"/>${out.join('')}</svg>`;
}

if (typeof module !== 'undefined') module.exports = { parse, norm };
