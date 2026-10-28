// Checks the parser and that every diagram and quiz in the course is well formed. Run: node test.js
const assert = require('assert');
const { parse } = require('./uml.js');
const { COURSE } = require('./content.js');

const p = t => parse(t, 'class');
let r = p('A "1" *-- "0..*" B : ma').rels[0];
assert.deepStrictEqual([r.kind, r.from, r.to, r.fromMult, r.toMult, r.label], ['composition', 'b', 'a', '0..*', '1', 'ma']);
r = p('Kolo -- ostatni').rels[0];
assert.deepStrictEqual([r.kind, r.a, r.b], ['association', 'kolo', 'ostatni']);
r = p('A --o B').rels[0];
assert.deepStrictEqual([r.kind, r.from, r.to], ['aggregation', 'a', 'b']);
r = p('Child <|.. Impl').rels[0];
assert.deepStrictEqual([r.kind, r.from, r.to], ['realization', 'impl', 'child']);
assert.strictEqual(p('class A {\n + x').errors.length, 1);
assert.strictEqual(parse('rectangle S {\n(A)\n}\nX -- (A)', 'usecase').get('A').parent, 's');
assert.strictEqual(parse('(A) ..> (B) : <<extend>>', 'usecase').rels[0].kind, 'extend');

const ids = new Set();
for (const m of COURSE) for (const L of m.lessons) {
  assert(!ids.has(L.id), `duplicate lesson id ${L.id}`); ids.add(L.id);
  for (const b of L.blocks) {
    const srcs = [b.src, b.bad, b.good, ...(b.rows || []).filter(Array.isArray).map(r => r[0])].filter(s => typeof s === 'string' && b.t !== 'table');
    for (const s of srcs) {
      const k = b.t === 'lines' ? b.rows.find(r => r[0] === s)[1] : b.kind || m.kind;
      const res = parse(s, k);
      assert.deepStrictEqual(res.errors, [], `${L.id}: diagram does not parse:\n${s}`);
      assert(res.els.length, `${L.id}: empty diagram`);
    }
    if (b.t === 'quiz') assert(b.answer >= 0 && b.answer < b.options.length, `${L.id}: quiz answer out of range: ${b.q}`);
  }
}
console.log('all good');
