// Checks the parser and that every diagram and quiz in the course is well formed. Run: node test.js
const assert = require('assert');
const { parse } = require('./uml.js');
const { COURSE } = require('./content.js');
const { BPMN } = require('./bpmn.js');

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

let b = BPMN.parse('pool A "Klient"\ntask:send a "Wyślij" 0\npool B\nstart:message s "Otrzymane" 1\nboundary:timer t "2 dni" @s\na ~> s : zamówienie');
assert.deepStrictEqual(b.errors, []);
assert.deepStrictEqual([b.flows[0].type, b.flows[0].label, b.byId.s.col, b.pools[1].label], ['msg', 'zamówienie', 1, 'B']);
assert.strictEqual(BPMN.parse('task:timer a "x" 0').errors.length, 1);
assert.strictEqual(BPMN.parse('task a "x" 0\na -> nowhere').errors.length, 1);
assert.deepStrictEqual(BPMN.lint(b), []);
assert.strictEqual(BPMN.lint(BPMN.parse('pool A\ntask a "x" 0\npool B\ntask b "y" 0\na -> b')).length, 1);

const ids = new Set();
for (const m of COURSE) for (const L of m.lessons) {
  assert(!ids.has(L.id), `duplicate lesson id ${L.id}`); ids.add(L.id);
  for (const b of L.blocks) {
    const srcs = [b.src, b.bad, b.good, ...(b.rows || []).filter(Array.isArray).map(r => r[0])].filter(s => typeof s === 'string' && b.t !== 'table');
    for (const s of srcs) {
      const k = b.t === 'lines' ? b.rows.find(r => r[0] === s)[1] : b.kind || m.kind;
      const res = k === 'bpmn' ? BPMN.parse(s) : parse(s, k);
      assert.deepStrictEqual(res.errors, [], `${L.id}: diagram does not parse:\n${s}`);
      assert(res.els.length, `${L.id}: empty diagram`);
      if (k === 'bpmn') { // quizzes and the left side of a pair show broken diagrams on purpose
        if (s !== b.bad && b.t !== 'quiz') assert.deepStrictEqual(BPMN.lint(res), [], `${L.id}: BPMN rule broken:\n${s}`);
        assert(BPMN.render(res).startsWith('<svg'), `${L.id}: does not render`);
      }
    }
    if (b.t === 'quiz') assert(b.answer >= 0 && b.answer < b.options.length, `${L.id}: quiz answer out of range: ${b.q}`);
  }
}
console.log('all good');
