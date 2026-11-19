// A small BPMN subset: BPMN.parse(text) -> model, BPMN.render(model) -> SVG.
// Layout is manual: every element names its column (and row inside its lane), so diagrams look the way a person would draw them.
//
//   pool ID "Label"              a participant; a pool with no elements is drawn as a black box
//   lane "Label"                 a lane inside the last pool
//   kind[:marker][+loop|+par|+seq] id "label" col [row]
//   boundary:timer id "label" @host        nboundary = non-interrupting boundary event
//   a -> b : label   sequence flow      a ~> b : label   message flow      a ..> b   data association
//
// kinds: start end event boundary nboundary task sub xor and or evgw data store
const BPMN = (() => {
  const ID = String.raw`[\p{L}\p{N}_]+`;
  const MARKERS = { start: ['message', 'timer', 'signal'], end: ['message', 'signal', 'error', 'terminate'], event: ['message', 'send', 'timer', 'signal'],
    boundary: ['timer', 'message', 'error'], nboundary: ['timer', 'message'],
    task: ['user', 'service', 'send', 'receive', 'manual'], sub: [], xor: [], and: [], or: [], evgw: [], data: [], store: [] };
  const LOOPS = ['loop', 'par', 'seq'], HOSTED = ['boundary', 'nboundary'];
  const EL = new RegExp(String.raw`^(${Object.keys(MARKERS).join('|')})(?::(\w+))?(?:\+(\w+))?\s+(${ID})(?:\s+"([^"]*)")?\s+(?:@(${ID})|([\d.]+)(?:\s+([\d.]+))?)$`, 'u');
  const POOL = new RegExp(String.raw`^pool\s+(${ID})(?:\s+"([^"]*)")?$`, 'u');
  const LANE = /^lane\s+"?([^"]+)"?$/u;
  const FLOW = new RegExp(String.raw`^(${ID})\s*(->|~>|\.\.>)\s*(${ID})\s*(?::\s*(.*))?$`, 'u');
  const TYPE = { '->': 'seq', '~>': 'msg', '..>': 'data' };

  function parse(text) {
    const pools = [], els = [], flows = [], errors = [], byId = {};
    const pool = () => pools[pools.length - 1] || (pools.push({ id: null, label: null, lanes: [] }), pools[0]);
    const lane = () => { const p = pool(); if (!p.lanes.length) p.lanes.push({ label: null, els: [] }); return p.lanes[p.lanes.length - 1]; };
    text.split('\n').forEach((raw, i) => {
      const line = raw.trim(), no = i + 1;
      let m;
      if (!line || line[0] === "'") return;
      if ((m = line.match(POOL))) { const p = { id: m[1], label: m[2] ?? m[1], lanes: [], isPool: true }; pools.push(p); byId[p.id] = p; return; }
      if ((m = line.match(LANE))) { if (!pools.length) errors.push({ line: no, msg: 'tor poza basenem' }); pool().lanes.push({ label: m[1], els: [] }); return; }
      if ((m = line.match(EL))) {
        const [, kind, marker, loop, id, label, host, col, row] = m;
        if (marker && !MARKERS[kind].includes(marker)) errors.push({ line: no, msg: `${kind} nie ma odmiany ${marker}` });
        if (loop && !(LOOPS.includes(loop) && (kind === 'task' || kind === 'sub'))) errors.push({ line: no, msg: `zły znacznik ${loop}` });
        if (HOSTED.includes(kind) ? !host : host) errors.push({ line: no, msg: 'tylko boundary stoi na innym elemencie (@id)' });
        if (byId[id]) errors.push({ line: no, msg: `powtórzony id ${id}` });
        const e = { kind, marker, loop, id, label: label || '', host, col: +col, row: +(row || 0) };
        if (!host) { e.lane = lane(); e.lane.els.push(e); }
        els.push(e); byId[id] = e;
        return;
      }
      if ((m = line.match(FLOW))) { flows.push({ a: m[1], b: m[3], type: TYPE[m[2]], label: (m[4] || '').trim(), line: no }); return; }
      errors.push({ line: no, msg: `nie rozumiem tej linii: ${line}` });
    });
    els.filter(e => e.host).forEach(e => { if (!byId[e.host] || byId[e.host].isPool) errors.push({ line: 0, msg: `brak elementu ${e.host}` }); });
    flows.forEach(f => [f.a, f.b].forEach(id => { if (!byId[id]) errors.push({ line: f.line, msg: `brak elementu ${id}` }); }));
    return { pools, els, flows, errors, byId };
  }

  // The two rules students break most often: sequence flow stays inside one pool, message flow always leaves it.
  function lint(m) {
    const poolOf = id => { const e = m.byId[id]; if (e.isPool) return e; const h = e.host ? m.byId[e.host] : e; return m.pools.find(p => p.lanes.includes(h.lane)); };
    return m.flows.flatMap(f => {
      const same = poolOf(f.a) === poolOf(f.b);
      if (f.type === 'seq' && !same) return [`przepływ sekwencji ${f.a} -> ${f.b} przechodzi między basenami`];
      if (f.type === 'msg' && same) return [`przepływ komunikatów ${f.a} ~> ${f.b} w jednym basenie`];
      return [];
    });
  }

  // ---------- drawing (browser; in node text width is estimated) ----------
  const INK = '#1d2330', COLW = 120, ROWH = 100, STRIP = 30, GAP = 34, BLACKBOX = 56;
  const SIZE = { task: [49, 32], sub: [49, 32], start: [17, 17], end: [17, 17], event: [17, 17], boundary: [15, 15], nboundary: [15, 15], xor: [24, 24], and: [24, 24], or: [24, 24], evgw: [24, 24], data: [15, 19], store: [21, 17] };
  const GATE = ['xor', 'and', 'or', 'evgw'];
  const f = n => n.toFixed(1);
  const x = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const width = s => typeof tw === 'function' ? tw(s) : s.length * 7; // tw comes from uml.js in the browser
  let uid = 0;

  const wrap = (s, max) => {
    const out = [];
    for (const w of s.split(' ')) {
      const t = out.length ? out[out.length - 1] + ' ' + w : w;
      if (out.length && width(t) > max) out.push(w); else out[Math.max(0, out.length - 1)] = t;
    }
    return out;
  };
  // align: 'mid' centres the block on y, 'top' hangs it below y, 'bottom' stacks it above y
  const label = (s, cx, y, max, align = 'mid', attrs = '') => {
    if (!s) return '';
    const ls = wrap(s, max), n = ls.length;
    const y0 = align === 'top' ? y + 11 : align === 'bottom' ? y - (n - 1) * 15 : y - (n - 1) * 7.5 + 4.5;
    return `<text text-anchor="middle" ${attrs}>${ls.map((l, i) => `<tspan x="${f(cx)}" y="${f(y0 + i * 15)}">${x(l)}</tspan>`).join('')}</text>`;
  };
  const envelope = (cx, cy, w, filled) => {
    const h = w * 0.68, l = cx - w / 2, t = cy - h / 2;
    return `<rect x="${f(l)}" y="${f(t)}" width="${f(w)}" height="${f(h)}" fill="${filled ? INK : '#fff'}" stroke="${INK}" stroke-width="1.1"/><path d="M${f(l)},${f(t)} L${f(cx)},${f(t + h * 0.55)} L${f(l + w)},${f(t)}" fill="none" stroke="${filled ? '#fff' : INK}" stroke-width="1.1"/>`;
  };
  const clock = (cx, cy, r) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="1.3"/><path d="M${f(cx)},${f(cy)} V${f(cy - r + 3)} M${f(cx)},${f(cy)} L${f(cx + r * 0.55)},${f(cy + 1)}" stroke="${INK}" stroke-width="1.3" fill="none"/>`;

  function render(m) {
    const mk = 'b' + ++uid + '-';
    const named = m.pools.some(p => p.label), lanesNamed = m.pools.some(p => p.lanes.some(l => l.label));
    const X0 = (named ? STRIP : 0) + (lanesNamed ? STRIP : 0) + 4;
    const placed = m.els.filter(e => !e.host);
    // message flow labels sit right of their line, so leave room for them
    const colX = id => { const e = m.byId[id]; return e.isPool ? null : X0 + ((e.host ? m.byId[e.host].col + 0.6 : e.col) + 0.5) * COLW; };
    const W = Math.max(X0 + (Math.max(0, ...placed.map(e => e.col)) + 1) * COLW + 4,
      ...m.flows.filter(fl => fl.type === 'msg' && fl.label).map(fl => (colX(fl.b) ?? colX(fl.a)) + 24 + width(fl.label)));
    const out = [];
    let y = 2, maxY = 0;

    // pools and lanes, top to bottom
    m.pools.forEach((p, pi) => {
      if (pi) y += GAP;
      p.top = y;
      p.black = !p.lanes.some(l => l.els.length);
      if (p.black) y += BLACKBOX;
      else p.lanes.forEach(l => { l.top = y; y += (Math.max(0, ...l.els.map(e => e.row)) + 1) * ROWH; });
      p.bottom = y;
      if (!p.label) return;
      const h = p.bottom - p.top;
      out.push(`<rect x="2" y="${f(p.top)}" width="${f(W - 2)}" height="${f(h)}" fill="#fff" stroke="${INK}" stroke-width="1.3"/>`);
      if (p.black) { out.push(label(p.label, W / 2, p.top + h / 2, W, 'mid', 'font-weight="bold"')); return; }
      out.push(`<line x1="${STRIP + 2}" y1="${f(p.top)}" x2="${STRIP + 2}" y2="${f(p.bottom)}" stroke="${INK}" stroke-width="1.3"/>`);
      out.push(`<g transform="translate(${f(STRIP / 2 + 2)},${f(p.top + h / 2)}) rotate(-90)">${label(p.label, 0, 0, h - 10, 'mid', 'font-weight="bold"')}</g>`);
      p.lanes.forEach((l, li) => {
        const lh = (l.els.length ? Math.max(...l.els.map(e => e.row)) + 1 : 1) * ROWH;
        if (li) out.push(`<line x1="${STRIP + 2}" y1="${f(l.top)}" x2="${f(W)}" y2="${f(l.top)}" stroke="${INK}" stroke-width="1.1"/>`);
        if (!l.label) return;
        out.push(`<line x1="${2 * STRIP + 2}" y1="${f(l.top)}" x2="${2 * STRIP + 2}" y2="${f(l.top + lh)}" stroke="${INK}" stroke-width="1.1"/>`);
        out.push(`<g transform="translate(${f(STRIP * 1.5 + 2)},${f(l.top + lh / 2)}) rotate(-90)">${label(l.label, 0, 0, lh - 10)}</g>`);
      });
    });
    maxY = y;

    // positions
    placed.forEach(e => { e.cx = X0 + e.col * COLW + COLW / 2; e.cy = e.lane.top + e.row * ROWH + ROWH / 2; [e.hw, e.hh] = SIZE[e.kind]; });
    m.els.filter(e => e.host).forEach(e => { const h = m.byId[e.host]; e.cx = h.cx + h.hw - 14; e.cy = h.cy + h.hh; [e.hw, e.hh] = SIZE[e.kind]; });
    const side = (e, d) => ({ r: [e.cx + e.hw, e.cy], l: [e.cx - e.hw, e.cy], d: [e.cx, e.cy + e.hh], u: [e.cx, e.cy - e.hh] }[d]);

    const seq = (a, b) => {
      const dx = b.cx - a.cx, dy = b.cy - a.cy, v = dy > 0 ? 'd' : 'u', vb = dy > 0 ? 'u' : 'd';
      if (Math.abs(dy) < 1) {
        if (dx > 0) return [side(a, 'r'), side(b, 'l')];
        const low = Math.max(a.cy + a.hh, b.cy + b.hh) + 24; // loop back underneath
        return [side(a, 'd'), [a.cx, low], [b.cx, low], side(b, 'd')];
      }
      if (Math.abs(dx) < 1) return [side(a, v), side(b, vb)];
      if (dx < 0) return [side(a, 'l'), [b.cx, a.cy], side(b, vb)];
      if (GATE.includes(a.kind) || HOSTED.includes(a.kind)) return [side(a, v), [a.cx, b.cy], side(b, 'l')];
      if (GATE.includes(b.kind)) return [side(a, 'r'), [b.cx, a.cy], side(b, vb)];
      const mx = (a.cx + a.hw + b.cx - b.hw) / 2;
      return [side(a, 'r'), [mx, a.cy], [mx, b.cy], side(b, 'l')];
    };
    const msg = (a, b, off) => {
      const ay = a.isPool ? (a.top + a.bottom) / 2 : a.cy, by = b.isPool ? (b.top + b.bottom) / 2 : b.cy, down = by > ay;
      if (!a.isPool && !b.isPool && Math.abs(by - ay) < 1) return b.cx > a.cx ? [side(a, 'r'), side(b, 'l')] : [side(a, 'l'), side(b, 'r')];
      const ax = (a.isPool ? b.cx : a.cx) + off, bx = (b.isPool ? a.cx : b.cx) + off;
      if (!a.isPool && down) a.under = true; // a message leaves from its bottom edge
      if (!b.isPool && !down) b.under = true;
      const pa = a.isPool ? [ax, down ? a.bottom : a.top] : [ax, a.cy + (down ? a.hh : -a.hh)];
      const pb = b.isPool ? [bx, down ? b.top : b.bottom] : [bx, b.cy + (down ? -b.hh : b.hh)];
      if (Math.abs(ax - bx) < 1) return [pa, pb];
      const pool = a.isPool ? a : m.pools.find(p => p.lanes.includes(a.lane || m.byId[a.host].lane));
      const mid = down ? pool.bottom + GAP / 2 : pool.top - GAP / 2;
      return [pa, [ax, mid], [bx, mid], pb];
    };
    const straight = (a, b) => {
      const clip = (e, o) => { const dx = o.cx - e.cx, dy = o.cy - e.cy, t = Math.min(e.hw / Math.abs(dx), (e.hh + 3) / Math.abs(dy)); return [e.cx + dx * t, e.cy + dy * t]; };
      return [clip(a, b), clip(b, a)];
    };

    m.flows.forEach(fl => {
      const a = m.byId[fl.a], b = m.byId[fl.b];
      const twin = fl.type === 'msg' && m.flows.some(g => g.type === 'msg' && g.a === fl.b && g.b === fl.a);
      const down = (b.isPool ? b.top : b.cy) > (a.isPool ? a.top : a.cy);
      const off = twin ? (down ? -12 : 12) : 0;
      const pts = fl.type === 'seq' ? seq(a, b) : fl.type === 'msg' ? msg(a, b, off) : straight(a, b);
      pts.forEach(p => { maxY = Math.max(maxY, p[1] + 4); });
      const style = { seq: `marker-end="url(#${mk}seq)"`, msg: `stroke-dasharray="7 4" marker-start="url(#${mk}dot)" marker-end="url(#${mk}hollow)"`, data: `stroke-dasharray="2 3" marker-end="url(#${mk}open)"` }[fl.type];
      out.push(`<path d="M ${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' L ')}" fill="none" stroke="${INK}" stroke-width="1.3" ${style}/>`);
      if (!fl.label) return;
      if (fl.type === 'seq') {
        const p = pts.length > 2 ? pts[1] : pts[0], vertical = pts.length === 2 && Math.abs(pts[0][0] - pts[1][0]) < 1;
        out.push(`<text x="${f(p[0] + 6)}" y="${f(vertical ? p[1] + 16 : p[1] - 6)}" font-size="12" stroke="#fff" stroke-width="4" paint-order="stroke">${x(fl.label)}</text>`);
      } else {
        const p = pts[pts.length - 2], q = pts[pts.length - 1];
        out.push(`<text x="${f(q[0] + (off < 0 ? -6 : 6))}" y="${f((p[1] + q[1]) / 2 + 4)}"${off < 0 ? ' text-anchor="end"' : ''} font-size="12" font-style="italic" stroke="#fff" stroke-width="4" paint-order="stroke">${x(fl.label)}</text>`);
      }
    });

    // shapes, hosts before the boundary events sitting on them
    [...placed, ...m.els.filter(e => e.host)].forEach(e => {
      const { cx, cy, hw, hh } = e;
      if (['start', 'end', 'event', ...HOSTED].includes(e.kind)) {
        const thick = { start: 1.4, end: 3.6 }[e.kind] || 1.3, dash = e.kind === 'nboundary' ? ' stroke-dasharray="3 2"' : '';
        const filled = e.kind === 'end' || e.marker === 'send';
        out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${hw}" fill="#fff" stroke="${INK}" stroke-width="${thick}"${dash}/>`);
        if (e.kind === 'event' || HOSTED.includes(e.kind)) out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${hw - 3}" fill="none" stroke="${INK}" stroke-width="1.1"${dash}/>`);
        if (e.marker === 'message' || e.marker === 'send') out.push(envelope(cx, cy, hw * 0.95, filled));
        if (e.marker === 'timer') out.push(clock(cx, cy, hw - 6));
        if (e.marker === 'signal') out.push(`<path d="M${f(cx)},${f(cy - 8)} L${f(cx + 7)},${f(cy + 5)} L${f(cx - 7)},${f(cy + 5)} z" fill="${filled ? INK : '#fff'}" stroke="${INK}" stroke-width="1.2"/>`);
        if (e.marker === 'error') out.push(`<path d="M${f(cx - 7)},${f(cy + 7)} L${f(cx - 3)},${f(cy - 6)} L${f(cx + 2)},${f(cy + 1)} L${f(cx + 7)},${f(cy - 7)} L${f(cx + 3)},${f(cy + 6)} L${f(cx - 2)},${f(cy - 1)} z" fill="${filled ? INK : '#fff'}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`);
        if (e.marker === 'terminate') out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${hw - 6}" fill="${INK}"/>`);
        if (HOSTED.includes(e.kind)) out.push(`<text x="${f(cx + hw + 4)}" y="${f(cy + hh + 12)}" font-size="12">${x(e.label)}</text>`);
        else if (e.under) out.push(label(e.label, cx, cy - hh - 6, 110, 'bottom', 'font-size="12"'));
        else out.push(label(e.label, cx, cy + hh, 110, 'top', 'font-size="12"'));
        maxY = Math.max(maxY, cy + hh + 12 + 15 * wrap(e.label, 110).length);
      } else if (e.kind === 'task' || e.kind === 'sub') {
        const l = cx - hw, t = cy - hh;
        out.push(`<rect x="${f(l)}" y="${f(t)}" width="${2 * hw}" height="${2 * hh}" rx="9" fill="#fff" stroke="${INK}" stroke-width="1.3"/>`);
        out.push(label(e.label, cx, cy + (e.marker || e.kind === 'sub' ? 4 : 0), 2 * hw - 10, 'mid', 'font-size="12"'));
        if (e.kind === 'sub') out.push(`<rect x="${f(cx - 6)}" y="${f(cy + hh - 13)}" width="12" height="12" fill="#fff" stroke="${INK}" stroke-width="1.1"/><path d="M${f(cx)},${f(cy + hh - 10)} v6 M${f(cx - 3)},${f(cy + hh - 7)} h6" stroke="${INK}" stroke-width="1.2"/>`);
        const lx = cx + (e.kind === 'sub' ? -16 : 0), ly = cy + hh - 8;
        if (e.loop === 'loop') out.push(`<path d="M${f(lx - 3)},${f(ly + 4)} A5,5 0 1 1 ${f(lx + 3)},${f(ly + 4)}" fill="none" stroke="${INK}" stroke-width="1.3"/><path d="M${f(lx - 3)},${f(ly + 4)} l-3,-1 M${f(lx - 3)},${f(ly + 4)} l0,-3" stroke="${INK}" stroke-width="1.3"/>`);
        if (e.loop === 'par') out.push(`<path d="M${f(lx - 4)},${f(ly - 5)} v10 M${f(lx)},${f(ly - 5)} v10 M${f(lx + 4)},${f(ly - 5)} v10" stroke="${INK}" stroke-width="1.6"/>`);
        if (e.loop === 'seq') out.push(`<path d="M${f(lx - 5)},${f(ly - 4)} h10 M${f(lx - 5)},${f(ly)} h10 M${f(lx - 5)},${f(ly + 4)} h10" stroke="${INK}" stroke-width="1.6"/>`);
        const ix = l + 11, iy = t + 10;
        if (e.marker === 'user') out.push(`<circle cx="${f(ix)}" cy="${f(iy - 1)}" r="3.3" fill="#fff" stroke="${INK}" stroke-width="1.1"/><path d="M${f(ix - 6)},${f(iy + 8)} q0,-6 6,-6 q6,0 6,6 z" fill="#fff" stroke="${INK}" stroke-width="1.1"/>`);
        if (e.marker === 'service') out.push(`<circle cx="${f(ix)}" cy="${f(iy)}" r="5" fill="#fff" stroke="${INK}" stroke-width="3.2" stroke-dasharray="2.2 1.73"/><circle cx="${f(ix)}" cy="${f(iy)}" r="3.6" fill="#fff" stroke="${INK}" stroke-width="1"/>`);
        if (e.marker === 'send' || e.marker === 'receive') out.push(envelope(ix + 1, iy, 13, e.marker === 'send'));
        if (e.marker === 'manual') out.push(`<path d="M${f(ix - 6)},${f(iy - 2)} h9 a1.5,1.5 0 0 1 0,3 h-2 h5 a1.5,1.5 0 0 1 0,3 h-5 h4 a1.5,1.5 0 0 1 0,3 h-4 h3 a1.5,1.5 0 0 1 0,3 h-10 z" fill="#fff" stroke="${INK}" stroke-width="1"/>`);
      } else if (GATE.includes(e.kind)) {
        out.push(`<path d="M${f(cx)},${f(cy - hh)} L${f(cx + hw)},${f(cy)} L${f(cx)},${f(cy + hh)} L${f(cx - hw)},${f(cy)} z" fill="#fff" stroke="${INK}" stroke-width="1.3"/>`);
        if (e.kind === 'xor') out.push(`<path d="M${f(cx - 7)},${f(cy - 7)} L${f(cx + 7)},${f(cy + 7)} M${f(cx + 7)},${f(cy - 7)} L${f(cx - 7)},${f(cy + 7)}" stroke="${INK}" stroke-width="3"/>`);
        if (e.kind === 'and') out.push(`<path d="M${f(cx)},${f(cy - 10)} V${f(cy + 10)} M${f(cx - 10)},${f(cy)} H${f(cx + 10)}" stroke="${INK}" stroke-width="3"/>`);
        if (e.kind === 'evgw') {
          const p = [0, 1, 2, 3, 4].map(k => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; return f(cx + 5.5 * Math.cos(a)) + ',' + f(cy + 5.5 * Math.sin(a)); }).join(' ');
          out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="11" fill="none" stroke="${INK}" stroke-width="1.1"/><circle cx="${f(cx)}" cy="${f(cy)}" r="8.5" fill="none" stroke="${INK}" stroke-width="1.1"/><polygon points="${p}" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
        }
        if (e.kind === 'or') out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="9" fill="none" stroke="${INK}" stroke-width="2.4"/>`);
        out.push(label(e.label, cx, cy - hh - 7, 150, 'bottom', 'font-size="12"'));
      } else if (e.kind === 'data') {
        const l = cx - hw, t = cy - hh;
        out.push(`<path d="M${f(l)},${f(t)} H${f(l + 2 * hw - 9)} L${f(l + 2 * hw)},${f(t + 9)} V${f(t + 2 * hh)} H${f(l)} z M${f(l + 2 * hw - 9)},${f(t)} V${f(t + 9)} H${f(l + 2 * hw)}" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`);
        out.push(label(e.label, cx, cy + hh, 110, 'top', 'font-size="12"'));
      } else if (e.kind === 'store') {
        const l = cx - hw, r = cx + hw, t = cy - hh, b = cy + hh;
        out.push(`<path d="M${f(l)},${f(t + 5)} V${f(b - 5)} A${hw},5 0 0 0 ${f(r)},${f(b - 5)} V${f(t + 5)} A${hw},5 0 0 0 ${f(l)},${f(t + 5)} A${hw},5 0 0 0 ${f(r)},${f(t + 5)}" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`);
        out.push(label(e.label, cx, cy + hh, 110, 'top', 'font-size="12"'));
      }
    });

    const defs = `<defs>
<marker id="${mk}seq" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${INK}"/></marker>
<marker id="${mk}hollow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1 L11,6 L1,11 z" fill="#fff" stroke="${INK}" stroke-width="1.2"/></marker>
<marker id="${mk}dot" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><circle cx="5" cy="5" r="3.6" fill="#fff" stroke="${INK}" stroke-width="1.2"/></marker>
<marker id="${mk}open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1 L11,6 L1,11" fill="none" stroke="${INK}" stroke-width="1.2"/></marker>
</defs>`;
    const H = maxY + 4;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${f(W + 4)}" height="${f(H)}" style="min-width:${f(0.7 * (W + 4))}px" viewBox="0 0 ${f(W + 4)} ${f(H)}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="${INK}">${defs}${out.join('')}</svg>`;
  }

  return { parse, lint, render };
})();

if (typeof module !== 'undefined') module.exports = { BPMN };
