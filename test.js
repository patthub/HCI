// Plays every lesson with model answers and checks each step passes. Run: node test.js
// An action is a string (appended as a new line) or [old, new] (replace). Each item must complete exactly the next step;
// {all: [...]} groups several actions into one item.
const assert = require('assert');
const { parse } = require('./uml.js');
const { LESSONS } = require('./lessons.js');

const SOLUTIONS = {
  'uc-basics': ['actor Czytelnik', 'usecase "Wypożycz książkę" as UC1', '(Przedłuż wypożyczenie)', 'Czytelnik -- UC1', 'Czytelnik -- (Przedłuż wypożyczenie)',
    'Bibliotekarz -- (Dodaj książkę do katalogu)', 'rectangle "System biblioteczny" {\n  usecase "Wypożycz książkę" as UC1\n  (Przedłuż wypożyczenie)\n  (Dodaj książkę do katalogu)\n}',
    { all: [['(Dodaj książkę do katalogu)\n}', '(Dodaj książkę do katalogu)\n  (Wyszukaj książkę)\n}'], 'Czytelnik -- (Wyszukaj książkę)', 'Bibliotekarz -- (Wyszukaj książkę)'] },
    { all: [['(Wyszukaj książkę)\n}', '(Wyszukaj książkę)\n  (Zarejestruj czytelnika)\n}'], 'Bibliotekarz -- (Zarejestruj czytelnika)'] }],
  'uc-roles': [['"Jan Kowalski"', 'Czytelnik'], { all: [['actor "Formularz logowania" as FL\n', ''], ['FL -- (Wypożycz książkę)\n', '']] },
    { all: [['(Książka)', '(Zarezerwuj książkę)'], ['(Książka)', '(Zarezerwuj książkę)']] },
    { all: [['(Kliknij przycisk Zapisz)', '(Przyjmij zwrot książki)'], ['(Kliknij przycisk Zapisz)', '(Przyjmij zwrot książki)']] },
    { all: [['(Przeglądaj katalog)\n}', '(Przeglądaj katalog)\n  (Zapłać karę)\n}'], 'actor "System płatności" as Platnosci', 'Czytelnik -- (Zapłać karę)', '(Zapłać karę) -- Platnosci'] },
    { all: [['(Zapłać karę)\n}', '(Zapłać karę)\n  (Sprawdź swoje wypożyczenia)\n}'], 'JK -- (Sprawdź swoje wypożyczenia)'] }],
  'uc-relations': ['WYP ..> LOG : <<include>>', 'PRZ ..> LOG : <<include>>', ['LOG ..> DOD', 'DOD ..> LOG'],
    { all: [['as LOG\n', 'as LOG\n  usecase "Zapłać karę" as KAR\n'], 'KAR ..> ODD : <<extend>>'] }, '(Filtruj wyniki) ..> SZU : <<extend>>',
    'actor Użytkownik\nCzytelnik --|> Użytkownik\nBibliotekarz --|> Użytkownik', { all: ['Użytkownik -- SZU', ['Czytelnik -- SZU\n', ''], ['Bibliotekarz -- SZU\n', '']] },
    ['Bibliotekarz --|> Użytkownik', 'Bibliotekarz --|> Czytelnik']],
  'uc-hw': ['actor Student\nactor Pracownik\nactor Administrator\nactor CAS',
    'rectangle "System rezerwacji sal" {\n  (Wyszukaj salę)\n  (Zarezerwuj salę)\n  (Zaloguj się)\n  (Zamów sprzęt)\n  (Zarezerwuj cyklicznie)\n  (Zatwierdź rezerwację)\n  (Zarządzaj salami)\n}',
    'actor "Użytkownik uczelni" as U\nStudent --|> U\nPracownik --|> U', '(Zarezerwuj salę) ..> (Zaloguj się) : <<include>>\n(Zaloguj się) -- CAS',
    '(Zamów sprzęt) ..> (Zarezerwuj salę) : <<extend>>', 'Pracownik -- (Zarezerwuj cyklicznie)', 'Administrator -- (Zatwierdź rezerwację)\nAdministrator -- (Zarządzaj salami)',
    'U -- (Wyszukaj salę)\nU -- (Zarezerwuj salę)'],
  'cl-class': ['class Ksiazka', ['class Ksiazka', 'class Ksiazka {\n  - tytul : String\n  - rokWydania : int\n}'], ['int\n}', 'int\n  + wypozycz() : void\n}'],
    ['void\n}', 'void\n  + przedluz(dni : int) : boolean\n}'], ['boolean\n}', 'boolean\n  # isbn : String\n  {static} - liczbaKsiazek : int\n}'],
    'class Czytelnik {\n  - imie : String\n  - nazwisko : String\n  - numerKarty : int\n  + pelneImie() : String\n}'],
  'cl-assoc': ['Czytelnik -- Wypozyczenie', ['Czytelnik -- Wypozyczenie', 'Czytelnik "1" -- "*" Wypozyczenie'], ['"*" Wypozyczenie', '"*" Wypozyczenie : dokonuje'],
    'Wypozyczenie "*" --> "1" Egzemplarz', 'Ksiazka "1" -- "1..*" Egzemplarz', 'class Autor\nAutor "1..*" -- "1..*" Ksiazka', 'Czytelnik "1" -- "0..1" KartaBiblioteczna'],
  'cl-whole': [['Pokoj *-- Budynek', 'Budynek *-- Pokoj'], 'Ksiazka "1" *-- "1..*" Rozdzial', 'Biblioteka "1" *-- "*" Regal', 'Regal "0..1" o-- "*" Egzemplarz',
    'Zamowienie "1" *-- "1..*" PozycjaZamowienia', 'Zespol o-- Pracownik'],
  'cl-inherit': ['abstract class Publikacja {\n  # tytul : String\n  # rokWydania : int\n  + {abstract} opis() : String\n}', 'Ksiazka --|> Publikacja\nCzasopismo --|> Publikacja',
    'interface Wypozyczalne {\n  + wypozycz() : void\n  + zwroc() : void\n}\nKsiazka ..|> Wypozyczalne', 'enum StatusEgzemplarza {\n  DOSTEPNY\n  WYPOZYCZONY\n  ZAGINIONY\n}',
    ['- isbn : String', '- isbn : String\n  - status : StatusEgzemplarza'], { all: [['class Raport {', 'class Raport {\n  + generuj(p : Publikacja) : String'], 'Raport ..> Publikacja'] },
    'class Audiobook {\n  - czasTrwania : int\n}\nAudiobook --|> Publikacja\nAudiobook ..|> Wypozyczalne'],
  'cl-hw': ['class Kurs\nclass Modul\nclass Lekcja\nclass LekcjaWideo\nclass Quiz\nclass Prowadzacy\nclass Student\nclass Zapis',
    { all: [['class Kurs\n', 'class Kurs {\n  - tytul : String\n  - opis : String\n}\n'], ['class LekcjaWideo\n', 'class LekcjaWideo {\n  - czasTrwania : int\n}\n'], ['class Quiz\n', 'class Quiz {\n  - progZaliczenia : int\n}\n'], ['class Zapis', 'class Zapis {\n  - dataZapisu : Date\n  - status : StatusZapisu\n}']] },
    'Kurs "1" *-- "1..*" Modul\nModul "1" *-- "1..*" Lekcja', { all: [['class Lekcja\n', 'abstract class Lekcja\n'], 'LekcjaWideo --|> Lekcja\nQuiz --|> Lekcja'] },
    'Prowadzacy "1..*" -- "*" Kurs', 'Student "1" -- "*" Zapis\nKurs "1" -- "*" Zapis', 'enum StatusZapisu {\n  AKTYWNY\n  UKONCZONY\n  PORZUCONY\n}'],
};

const apply = (t, a) => {
  if (typeof a === 'string') return t + (t && !t.endsWith('\n') ? '\n' : '') + a + '\n';
  assert(t.includes(a[0]), `text to replace not found: ${a[0]}`);
  return t.replace(a[0], a[1]);
};

for (const L of LESSONS) {
  const sol = SOLUTIONS[L.id];
  assert(sol, `no solution for ${L.id}`);
  let text = L.start, done = 0;
  const reached = () => { const m = parse(text, L.kind); let i = done; while (i < L.steps.length && L.steps[i].check(m)) i++; return i; };
  assert.strictEqual(reached(), 0, `${L.id}: starter code already passes step 1`);
  assert.deepStrictEqual(parse(L.start, L.kind).errors, [], `${L.id}: starter code has errors`);
  sol.forEach((item, k) => {
    for (const a of item.all || [item]) text = apply(text, a);
    const i = reached();
    assert.strictEqual(i, done + 1, `${L.id}: solution ${k} reached step ${i}, expected ${done + 1}\n${text}`);
    done = i;
  });
  assert.strictEqual(done, L.steps.length, `${L.id}: not all steps covered`);
  assert.deepStrictEqual(parse(text, L.kind).errors, [], `${L.id}: final code has errors`);
}

// Parser behaviours students rely on
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
assert.strictEqual(p('to nie jest UML').errors[0].line, 1);
assert.strictEqual(parse('(Zaloguj się) as Z\nKlient -- Z', 'usecase').get('klient').type, 'actor');
assert.strictEqual(parse('rectangle S {\n(A)\n}\nX -- (A)', 'usecase').get('A').parent, 's');
const m = p('class A {\n  - imie : String\n  + {static} f(x : int) : void\n}');
assert.deepStrictEqual([m.get('A').attrs[0].type, m.get('A').ops[0].static, m.get('A').ops[0].params], ['String', true, 'x : int']);
console.log('all good');
