// Lessons: each step has `do` (HTML shown to the student) and `check(m)`, run on the parsed diagram after every edit.
// m = parse() result: m.get(name), m.like(re, type), m.links(kind, from, to), m.mult(rel, name), m.els, m.rels (see uml.js).
// `kind` picks the default for names that appear only in relations: 'usecase' -> actor, 'class' -> class.
// Code in <code> inside a step is clickable and inserts the line into the editor at the cursor; so is a <pre> block.
const N = typeof norm !== 'undefined' ? norm : require('./uml.js').norm;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const c = s => `<code>${esc(s)}</code>`;
const pre = (s, ...v) => '<pre>' + esc(String.raw(s, ...v).trim()) + '</pre>';
// why([token, meaning], ..., 'note'): the breakdown behind a step's ? button.
const why = (...rows) => rows.map(r => typeof r === 'string' ? `<p>${r}</p>` : `<div><code>${esc(r[0])}</code> ${r[1]}</div>`).join('');
const any = (m, kind, x, y, f = () => true) => m.links(kind, x, y).some(f);
const many = v => v === '*' || v === '0..*';
const inRect = (m, e) => !!e?.parent && m.els.some(r => r.key === e.parent && r.type === 'rect');
const attr = (m, cls, name) => m.get(cls)?.attrs.find(a => N(a.name) === N(name));
const op = (m, cls, name) => m.get(cls)?.ops.find(a => N(a.name) === N(name));

const LESSONS = [
  {
    id: 'uc-basics', kind: 'usecase', title: '1.1 Aktorzy i przypadki użycia',
    intro: 'Kod piszesz w edytorze, diagram rysuje się pod nim. Panel <b>Model</b> po prawej pokazuje, jak edytor zrozumiał kod. Kliknięcie w kod w kroku wstawia go w miejscu kursora. Składnia to podzbiór <a href="https://plantuml.com/use-case-diagram" target="_blank">PlantUML</a>.',
    start: '',
    steps: [
      { do: 'Aktor: ' + c('actor Czytelnik'), why: why(['actor', 'słowo kluczowe: rola kogoś spoza systemu'], ['Czytelnik', 'nazwa jednowyrazowa nie potrzebuje cudzysłowu']), check: m => m.get('Czytelnik')?.type === 'actor' },
      { do: 'Przypadek użycia: ' + c('usecase "Wypożycz książkę" as UC1'), why: why(['usecase', 'przypadek użycia: cel, który aktor osiąga dzięki systemowi'], ['"Wypożycz książkę"', 'nazwa ze spacjami musi być w cudzysłowie'], ['as UC1', 'krótki alias, którego użyjesz w relacjach']), check: m => m.get('UC1')?.type === 'usecase' && m.get('Wypożycz książkę') === m.get('UC1') },
      { do: 'Krótszy zapis, bez aliasu: ' + c('(Przedłuż wypożyczenie)'), check: m => m.get('Przedłuż wypożyczenie')?.type === 'usecase' },
      { do: 'Połącz aktora z przypadkiem użycia: ' + c('Czytelnik -- UC1'), why: why(['--', 'linia ciągła bez strzałki: asocjacja, aktor uczestniczy w przypadku użycia']), check: m => any(m, 'association', 'Czytelnik', 'UC1') },
      { do: 'Bez aliasu podajesz pełną nazwę w nawiasach: ' + c('Czytelnik -- (Przedłuż wypożyczenie)'), check: m => any(m, 'association', 'Czytelnik', 'Przedłuż wypożyczenie') },
      { do: 'Element użyty w relacji, którego jeszcze nie ma, powstaje sam: nazwa bez nawiasów to aktor, w nawiasach to przypadek użycia.<br>' + c('Bibliotekarz -- (Dodaj książkę do katalogu)'), check: m => m.get('Bibliotekarz')?.type === 'actor' && any(m, 'association', 'Bibliotekarz', 'Dodaj książkę do katalogu') },
      { do: 'Granica systemu: przypadki użycia są w środku, aktorzy na zewnątrz. Wstaw blok w dowolnym miejscu:' + pre`
rectangle "System biblioteczny" {
  usecase "Wypożycz książkę" as UC1
  (Przedłuż wypożyczenie)
  (Dodaj książkę do katalogu)
}`, why: why(['rectangle "…" { }', 'prostokąt z nazwą systemu; wszystko, co zadeklarujesz między klamrami, jest w środku'], 'Te przypadki użycia już istnieją. Ponowna deklaracja wewnątrz bloku tylko przenosi je do granicy systemu.'), check: m => ['UC1', 'Przedłuż wypożyczenie', 'Dodaj książkę do katalogu'].every(n => inRect(m, m.get(n))) && !m.els.some(e => e.type === 'actor' && inRect(m, e)) },
      { do: '<b>Ćwiczenie.</b> Czytelnik i bibliotekarz mogą wyszukiwać książki. Dodaj ten przypadek użycia w granicy systemu i połącz go z oboma aktorami.', hint: 'Zadeklaruj go wewnątrz bloku rectangle, a relacje dopisz pod blokiem.', check: m => m.like(/wyszuk/, 'usecase').some(u => inRect(m, u) && any(m, 'association', 'Czytelnik', u) && any(m, 'association', 'Bibliotekarz', u)) },
      { do: '<b>Ćwiczenie.</b> Bibliotekarz rejestruje nowych czytelników. Dodaj to do diagramu.', check: m => m.like(/rejestr/, 'usecase').some(u => inRect(m, u) && any(m, 'association', 'Bibliotekarz', u)) },
    ],
  },
  {
    id: 'uc-roles', kind: 'usecase', title: '1.2 Co jest aktorem, a co przypadkiem użycia',
    intro: '<b>Aktor</b> to rola, nie konkretna osoba. Może nim być człowiek, organizacja albo inny system, zawsze spoza modelowanego systemu. <b>Przypadek użycia</b> to cel aktora, nazwany czasownikiem: <i>Wypożycz książkę</i>. Ekrany, przyciski i pojedyncze kliknięcia nie są przypadkami użycia. Ten diagram ma kilka takich błędów.',
    start: `actor "Jan Kowalski" as JK
actor "Formularz logowania" as FL
actor Bibliotekarz

rectangle "System biblioteczny" {
  (Wypożycz książkę)
  (Książka)
  (Kliknij przycisk Zapisz)
  (Przeglądaj katalog)
}

JK -- (Wypożycz książkę)
JK -- (Książka)
JK -- (Przeglądaj katalog)
FL -- (Wypożycz książkę)
Bibliotekarz -- (Kliknij przycisk Zapisz)
`,
    steps: [
      { do: 'Jan Kowalski to konkretna osoba. Zmień tekst w cudzysłowie na rolę: <b>Czytelnik</b>. Alias JK może zostać.', check: m => m.get('Czytelnik')?.type === 'actor' && !m.get('Jan Kowalski') },
      { do: 'Formularz logowania jest częścią systemu, a nie aktorem. Usuń go razem z jego relacją.', check: m => !m.get('FL') && !m.get('Formularz logowania') },
      { do: '<b>(Książka)</b> to rzeczownik. Czytelnik chce książkę zarezerwować: popraw nazwę w obu miejscach.', check: m => !m.get('Książka') && m.like(/zarezerw/, 'usecase').some(u => any(m, 'association', 'Czytelnik', u)) },
      { do: '<b>(Kliknij przycisk Zapisz)</b> opisuje interfejs. Bibliotekarz w ten sposób przyjmuje zwrot książki: nazwij przypadek użycia według tego celu.', check: m => !m.like(/kliknij/).length && m.like(/zwrot/, 'usecase').some(u => any(m, 'association', 'Bibliotekarz', u)) },
      { do: 'Kary za przetrzymanie przyjmuje zewnętrzny system płatności. Wpisz <b>(Zapłać karę)</b> wewnątrz bloku rectangle, a na końcu kodu:' + pre`
actor "System płatności" as Platnosci
Czytelnik -- (Zapłać karę)
(Zapłać karę) -- Platnosci`, why: why(['(Zapłać karę) -- Platnosci', 'aktor zapisany po prawej stronie relacji trafia na prawą stronę diagramu'], 'Zwyczajowo aktorzy główni (ci, którzy rozpoczynają przypadek użycia) stoją po lewej, a systemy pomocnicze po prawej.'), check: m => m.like(/platnos/, 'actor').some(a => m.like(/kar/, 'usecase').some(u => inRect(m, u) && any(m, 'association', a, u) && any(m, 'association', 'Czytelnik', u))) },
      { do: '<b>Ćwiczenie.</b> Czytelnik chce sprawdzić, jakie książki ma obecnie wypożyczone. Dodaj przypadek użycia z nazwą opisującą cel.', hint: 'Np. Sprawdź swoje wypożyczenia. Nie: Ekran konta.', check: m => m.like(/sprawdz|wyswietl|przejrzyj|zobacz|pokaz/, 'usecase').some(u => inRect(m, u) && any(m, 'association', 'Czytelnik', u)) },
    ],
  },
  {
    id: 'uc-relations', kind: 'usecase', title: '1.3 include, extend i generalizacja',
    intro: '<b>«include»</b>: przypadek bazowy <i>zawsze</i> wykonuje przypadek włączany. Strzałka od bazowego do włączanego. <b>«extend»</b>: rozszerzenie wykonuje się <i>tylko czasem</i>, pod jakimś warunkiem. Strzałka od rozszerzenia do bazowego. Obie rysujemy linią przerywaną. <b>Generalizacja</b> aktorów: aktor-dziecko może wszystko, co rodzic, i coś więcej.',
    start: `actor Czytelnik
actor Bibliotekarz

rectangle "System biblioteczny" {
  usecase "Wypożycz książkę" as WYP
  usecase "Przedłuż wypożyczenie" as PRZ
  usecase "Oddaj książkę" as ODD
  usecase "Wyszukaj książkę" as SZU
  usecase "Dodaj książkę do katalogu" as DOD
  usecase "Zaloguj się" as LOG
}

Czytelnik -- WYP
Czytelnik -- PRZ
Czytelnik -- ODD
Czytelnik -- SZU
Bibliotekarz -- SZU
Bibliotekarz -- DOD
LOG ..> DOD : <<include>>
`,
    steps: [
      { do: 'Wypożyczenie zawsze wymaga zalogowania: ' + c('WYP ..> LOG : <<include>>'), why: why(['..>', 'linia przerywana ze strzałką'], ['WYP ..> LOG', 'od przypadku bazowego do włączanego'], [': <<include>>', 'stereotyp, rysowany jako «include» nad linią']), check: m => any(m, 'include', 'WYP', 'LOG') },
      { do: '<b>Ćwiczenie.</b> Przedłużenie też zawsze wymaga zalogowania. Dopisz relację.', check: m => any(m, 'include', 'PRZ', 'LOG') },
      { do: 'Ostatnia linia startowego kodu ma odwrócony kierunek: mówi, że logowanie zawsze dodaje książkę. Popraw ją.', check: m => any(m, 'include', 'DOD', 'LOG') && !any(m, 'include', 'LOG', 'DOD') },
      { do: 'Karę płaci się tylko wtedy, gdy książka wraca po terminie. Wpisz ' + c('usecase "Zapłać karę" as KAR') + ' wewnątrz bloku rectangle, a na końcu ' + c('KAR ..> ODD : <<extend>>'), why: why(['KAR ..> ODD', 'od rozszerzenia do przypadku bazowego, odwrotnie niż include'], 'Oddanie książki jest kompletne bez płacenia kary. Kara dochodzi tylko pod warunkiem.'), check: m => m.like(/kar/, 'usecase').some(u => inRect(m, u) && any(m, 'extend', u, 'ODD')) },
      { do: '<b>Ćwiczenie.</b> Przy wyszukiwaniu czytelnik może, ale nie musi, zawęzić wyniki filtrami. Dodaj przypadek <b>Filtruj wyniki</b> i właściwą relację.', hint: 'może, ale nie musi = extend', check: m => m.like(/filtr/, 'usecase').some(u => any(m, 'extend', u, 'SZU')) },
      { do: 'Obaj aktorzy wyszukują książki. Wspólną część przenosimy do aktora-rodzica:' + pre`
actor Użytkownik
Czytelnik --|> Użytkownik
Bibliotekarz --|> Użytkownik`, why: why(['--|>', 'linia ciągła z pustym trójkątem: generalizacja'], ['Czytelnik --|> Użytkownik', 'trójkąt wskazuje rodzica']), check: m => any(m, 'generalization', 'Czytelnik', 'Użytkownik') && any(m, 'generalization', 'Bibliotekarz', 'Użytkownik') },
      { do: 'Zastąp dwie asocjacje z SZU jedną: ' + c('Użytkownik -- SZU') + '. Usuń linie <b>Czytelnik -- SZU</b> i <b>Bibliotekarz -- SZU</b>.', check: m => any(m, 'association', 'Użytkownik', 'SZU') && !any(m, 'association', 'Czytelnik', 'SZU') && !any(m, 'association', 'Bibliotekarz', 'SZU') },
      { do: '<b>Ćwiczenie.</b> Bibliotekarz może też wypożyczać i oddawać książki jak każdy czytelnik. Zamiast dopisywać mu asocjacje, zmień jego generalizację.', hint: 'Bibliotekarz jest rodzajem czytelnika.', check: m => any(m, 'generalization', 'Bibliotekarz', 'Czytelnik') && !any(m, 'generalization', 'Bibliotekarz', 'Użytkownik') },
    ],
  },
  {
    id: 'uc-hw', kind: 'usecase', title: '1.H Zadanie domowe 1',
    intro: `<b>System rezerwacji sal na wydziale.</b> Studenci i pracownicy wyszukują wolne sale i rezerwują je. Pracownik może dodatkowo założyć rezerwację cykliczną, np. co tydzień przez cały semestr. Każda rezerwacja wymaga zalogowania przez centralny system uwierzytelniania uczelni (CAS). Przy rezerwacji można, ale nie trzeba, zamówić sprzęt (rzutnik, mikrofon). Administrator zatwierdza rezerwacje i zarządza listą sal.<br><br>Gotowy diagram pobierz przyciskiem <b>Pobierz SVG</b> i wyślij. Przyciskiem <b>Kopiuj kod</b> skopiujesz kod do wklejenia na <a href="https://www.planttext.com" target="_blank">planttext.com</a>.`,
    start: "' Zadanie domowe 1: system rezerwacji sal\n",
    steps: [
      { do: 'Aktorzy: Student, Pracownik, Administrator, CAS.', check: m => ['student', 'pracownik', 'administrator', 'cas'].every(w => m.like(w, 'actor').length) },
      { do: 'Granica systemu z co najmniej pięcioma przypadkami użycia. Aktorzy na zewnątrz.', check: m => m.els.some(e => e.type === 'rect') && m.els.filter(e => e.type === 'usecase' && inRect(m, e)).length >= 5 && !m.els.some(e => e.type === 'actor' && inRect(m, e)) },
      { do: 'Student i Pracownik mają wspólne przypadki użycia. Użyj generalizacji.', hint: 'Wspólny aktor-rodzic, albo Pracownik jako rodzaj Studenta.', check: m => { const S = m.like('student', 'actor')[0], P = m.like('pracownik', 'actor')[0]; return !!S && !!P && (any(m, 'generalization', P, S) || m.links('generalization', S).some(r => any(m, 'generalization', P, r.to))); } },
      { do: 'Logowanie jako «include», a CAS połączony z przypadkiem logowania.', check: m => m.like(/log|uwierzyt/, 'usecase').some(u => m.links('include', null, u).length && m.like('cas', 'actor').some(a => any(m, 'association', a, u))) },
      { do: 'Zamówienie sprzętu jako «extend» rezerwacji.', check: m => m.like(/sprzet/, 'usecase').some(u => m.like(/rezerw/, 'usecase').some(r => any(m, 'extend', u, r))) },
      { do: 'Rezerwacja cykliczna jest dostępna tylko dla pracownika.', check: m => { const S = m.like('student', 'actor')[0], P = m.like('pracownik', 'actor')[0]; return m.like(/cykl/, 'usecase').some(u => (any(m, 'association', P, u) || m.links('extend', u).length) && !any(m, 'association', S, u)); } },
      { do: 'Przypadki użycia administratora: zatwierdzanie rezerwacji i zarządzanie salami.', check: m => m.like('administrator', 'actor').some(a => m.like(/zatwierdz/, 'usecase').some(u => any(m, 'association', a, u)) && m.like(/zarzadz/, 'usecase').some(u => any(m, 'association', a, u))) },
      { do: 'Każdy przypadek użycia jest połączony z aktorem albo relacją include/extend. Popraw błędy, jeśli pod edytorem są jakieś.', check: m => !m.errors.length && m.els.filter(e => e.type === 'usecase').every(u => m.rels.some(r => r.from === u.key || r.to === u.key)) },
    ],
  },
];

// ---------- Class 2: class diagrams ----------
LESSONS.push(
  {
    id: 'cl-class', kind: 'class', title: '2.1 Klasa: atrybuty i operacje',
    intro: 'Klasa ma trzy części: nazwę, atrybuty (dane) i operacje (zachowanie). Atrybut: <code>widoczność nazwa : Typ</code>. Operacja: <code>widoczność nazwa(parametr : Typ) : TypZwracany</code>. W nazwach klas i atrybutów nie używamy spacji ani polskich znaków. Składnia: <a href="https://plantuml.com/class-diagram" target="_blank">PlantUML</a>.',
    start: '',
    steps: [
      { do: c('class Ksiazka'), check: m => m.get('Ksiazka')?.type === 'class' },
      { do: 'Atrybuty wpisuje się w klamrach. Zastąp linię <b>class Ksiazka</b> blokiem:' + pre`
class Ksiazka {
  - tytul : String
  - rokWydania : int
}`, why: why(['-', 'prywatny: dostęp tylko z wnętrza klasy'], ['tytul : String', 'nazwa, dwukropek, typ']), check: m => !!attr(m, 'Ksiazka', 'tytul') && !!attr(m, 'Ksiazka', 'rokWydania') },
      { do: 'Ustaw kursor przed <b>}</b> i dodaj operację: ' + c('+ wypozycz() : void'), why: why(['+', 'publiczna: dostępna dla innych klas'], ['()', 'nawiasy odróżniają operację od atrybutu'], [': void', 'operacja nic nie zwraca']), check: m => !!op(m, 'Ksiazka', 'wypozycz') },
      { do: 'Operacja z parametrem: ' + c('+ przedluz(dni : int) : boolean'), why: why(['dni : int', 'parametr: nazwa i typ'], [': boolean', 'zwraca prawdę albo fałsz (np. czy przedłużenie się udało)']), check: m => /dni/.test(op(m, 'Ksiazka', 'przedluz')?.params || '') },
      { do: 'Dwa kolejne atrybuty: ' + c('# isbn : String') + ' i ' + c('{static} - liczbaKsiazek : int'), why: why(['+', 'public'], ['-', 'private'], ['#', 'protected: widoczny też w klasach dziedziczących'], ['~', 'package: widoczny w tym samym pakiecie'], ['{static}', 'atrybut wspólny dla wszystkich obiektów klasy, rysowany z podkreśleniem']), check: m => attr(m, 'Ksiazka', 'isbn')?.vis === '#' && !!attr(m, 'Ksiazka', 'liczbaKsiazek')?.static },
      { do: '<b>Ćwiczenie.</b> Klasa <b>Czytelnik</b> z prywatnymi atrybutami <i>imie</i>, <i>nazwisko</i> (String) i <i>numerKarty</i> (int) oraz publiczną operacją <i>pelneImie</i>, która zwraca String.', check: m => ['imie', 'nazwisko', 'numerKarty'].every(a => attr(m, 'Czytelnik', a)?.vis === '-') && op(m, 'Czytelnik', 'pelneImie')?.vis === '+' && /^string$/i.test(op(m, 'Czytelnik', 'pelneImie').type) },
    ],
  },
  {
    id: 'cl-assoc', kind: 'class', title: '2.2 Asocjacje i liczności',
    intro: 'Asocjacja <code>--</code> oznacza trwałe powiązanie obiektów dwóch klas. Liczność przy końcu linii mówi, z iloma obiektami <i>tej</i> klasy łączy się jeden obiekt klasy po drugiej stronie: <code>1</code>, <code>0..1</code>, <code>*</code> (dowolnie wiele, także zero), <code>1..*</code> (co najmniej jeden).',
    start: `class Czytelnik {
  - imie : String
  - numerKarty : int
}
class Wypozyczenie {
  - dataOd : Date
  - dataDo : Date
}
class Egzemplarz {
  - sygnatura : String
}
class Ksiazka {
  - tytul : String
}
`,
    steps: [
      { do: c('Czytelnik -- Wypozyczenie'), check: m => any(m, 'association', 'Czytelnik', 'Wypozyczenie') },
      { do: 'Zastąp tę linię wersją z licznościami: ' + c('Czytelnik "1" -- "*" Wypozyczenie'), why: why(['"1"', 'przy Czytelniku: każde wypożyczenie ma dokładnie jednego czytelnika'], ['"*"', 'przy Wypozyczeniu: czytelnik ma dowolnie wiele wypożyczeń, także zero'], 'Liczność czytamy od drugiego końca linii.'), check: m => m.links('association', 'Czytelnik', 'Wypozyczenie').some(r => m.mult(r, 'Czytelnik') === '1' && many(m.mult(r, 'Wypozyczenie'))) },
      { do: 'Nazwa asocjacji: dopisz na końcu tej linii <b>: dokonuje</b>', check: m => m.links('association', 'Czytelnik', 'Wypozyczenie').some(r => /dokonuje/.test(r.label)) },
      { do: 'Nawigowalność: ' + c('Wypozyczenie "*" --> "1" Egzemplarz'), why: why(['-->', 'strzałka: z wypożyczenia da się dojść do egzemplarza; w drugą stronę model tego nie wymaga']), check: m => m.links('association', 'Wypozyczenie', 'Egzemplarz').some(r => r.nav && r.to === m.get('Egzemplarz').key && m.mult(r, 'Egzemplarz') === '1') },
      { do: '<b>Ćwiczenie.</b> Każda książka ma co najmniej jeden egzemplarz, a każdy egzemplarz należy do jednej książki. Połącz Ksiazka i Egzemplarz.', check: m => m.links('association', 'Ksiazka', 'Egzemplarz').some(r => m.mult(r, 'Ksiazka') === '1' && m.mult(r, 'Egzemplarz') === '1..*') },
      { do: '<b>Ćwiczenie.</b> Dodaj klasę <b>Autor</b>. Autor napisał co najmniej jedną książkę, książka ma co najmniej jednego autora.', check: m => !!m.get('Autor') && m.links('association', 'Autor', 'Ksiazka').some(r => m.mult(r, 'Autor') === '1..*' && m.mult(r, 'Ksiazka') === '1..*') },
      { do: '<b>Ćwiczenie.</b> Czytelnik ma co najwyżej jedną kartę biblioteczną, a karta należy do dokładnie jednego czytelnika. Dodaj klasę <b>KartaBiblioteczna</b> i asocjację.', check: m => !!m.get('KartaBiblioteczna') && m.links('association', 'Czytelnik', 'KartaBiblioteczna').some(r => m.mult(r, 'KartaBiblioteczna') === '0..1' && m.mult(r, 'Czytelnik') === '1') },
    ],
  },
  {
    id: 'cl-whole', kind: 'class', title: '2.3 Agregacja i kompozycja',
    intro: 'Obie relacje znaczą „całość składa się z części”. Romb stoi przy <b>całości</b>. <b>Kompozycja</b> <code>*--</code> (pełny romb): część nie istnieje bez całości i należy tylko do jednej. Usunięcie całości usuwa części. <b>Agregacja</b> <code>o--</code> (pusty romb): część istnieje samodzielnie i może zmienić właściciela. W razie wątpliwości użyj zwykłej asocjacji.',
    start: `class Budynek
class Pokoj
Pokoj *-- Budynek

class Biblioteka {
  - nazwa : String
}
class Regal {
  - numer : int
}
class Egzemplarz {
  - sygnatura : String
}
class Ksiazka {
  - tytul : String
}
class Rozdzial {
  - numer : int
  - tytul : String
}
`,
    steps: [
      { do: 'Trzecia linia stawia romb przy pokoju, czyli mówi, że budynek jest częścią pokoju. Popraw ją.', hint: 'Zamień miejscami nazwy albo przenieś * na drugi koniec: --*', check: m => any(m, 'composition', 'Pokoj', 'Budynek') && !any(m, 'composition', 'Budynek', 'Pokoj') },
      { do: 'Rozdział nie istnieje bez książki: ' + c('Ksiazka "1" *-- "1..*" Rozdzial'), why: why(['*--', 'pełny romb przy Ksiazce: kompozycja'], ['"1"', 'rozdział należy do dokładnie jednej książki; przy kompozycji po stronie całości jest zawsze 1 albo 0..1']), check: m => any(m, 'composition', 'Rozdzial', 'Ksiazka') },
      { do: c('Biblioteka "1" *-- "*" Regal'), check: m => any(m, 'composition', 'Regal', 'Biblioteka') },
      { do: 'Egzemplarz można przenieść na inny regał albo wypożyczyć: ' + c('Regal "0..1" o-- "*" Egzemplarz'), why: why(['o--', 'pusty romb przy Regale: agregacja'], ['"0..1"', 'egzemplarz stoi na jednym regale albo na żadnym (gdy jest wypożyczony)']), check: m => any(m, 'aggregation', 'Egzemplarz', 'Regal') },
      { do: '<b>Ćwiczenie.</b> Zamówienie w sklepie internetowym składa się z pozycji. Pozycja bez zamówienia nie ma sensu. Dodaj klasy <b>Zamowienie</b>, <b>PozycjaZamowienia</b> i właściwą relację.', check: m => any(m, 'composition', 'PozycjaZamowienia', 'Zamowienie') },
      { do: '<b>Ćwiczenie.</b> Zespół projektowy składa się z pracowników. Po rozwiązaniu zespołu pracownicy dalej pracują w firmie. Dodaj klasy <b>Zespol</b>, <b>Pracownik</b> i właściwą relację.', check: m => any(m, 'aggregation', 'Pracownik', 'Zespol') },
    ],
  },
  {
    id: 'cl-inherit', kind: 'class', title: '2.4 Dziedziczenie, interfejsy, wyliczenia',
    intro: '<b>Generalizacja</b> <code>--|&gt;</code>: podklasa dziedziczy atrybuty i operacje rodzica, trójkąt wskazuje rodzica. <b>Klasa abstrakcyjna</b> nie ma własnych obiektów, jej nazwę piszemy kursywą. <b>Interfejs</b> to zestaw operacji bez implementacji; klasa, która go realizuje, łączy się z nim linią przerywaną z trójkątem <code>..|&gt;</code>. <b>Zależność</b> <code>..&gt;</code>: klasa tylko chwilowo używa innej, np. jako parametru. <b>Wyliczenie</b> (enum) to typ o zamkniętej liście wartości.',
    start: `class Ksiazka {
  - isbn : String
}
class Czasopismo {
  - numer : int
}
class Raport {
}
`,
    steps: [
      { do: 'Klasa abstrakcyjna:' + pre`
abstract class Publikacja {
  # tytul : String
  # rokWydania : int
  + {abstract} opis() : String
}`, why: why(['abstract class', 'klasa abstrakcyjna'], ['#', 'chroniony: widoczny w podklasach'], ['{abstract}', 'operacja bez implementacji; każda podklasa musi ją dostarczyć']), check: m => m.get('Publikacja')?.type === 'abstract' && !!op(m, 'Publikacja', 'opis')?.abstract },
      { do: c('Ksiazka --|> Publikacja') + ' i ' + c('Czasopismo --|> Publikacja'), why: why(['--|>', 'linia ciągła, pusty trójkąt przy rodzicu'], 'Ksiazka ma teraz tytul i rokWydania, choć ich nie wpisaliśmy w jej klasie.'), check: m => any(m, 'generalization', 'Ksiazka', 'Publikacja') && any(m, 'generalization', 'Czasopismo', 'Publikacja') },
      { do: 'Interfejs i jego realizacja:' + pre`
interface Wypozyczalne {
  + wypozycz() : void
  + zwroc() : void
}
Ksiazka ..|> Wypozyczalne`, why: why(['..|>', 'linia przerywana, pusty trójkąt: realizacja interfejsu'], 'Ksiazka obiecuje, że ma operacje wypozycz() i zwroc(). Czasopismo tego nie obiecuje.'), check: m => m.get('Wypozyczalne')?.type === 'interface' && any(m, 'realization', 'Ksiazka', 'Wypozyczalne') },
      { do: 'Wyliczenie:' + pre`
enum StatusEgzemplarza {
  DOSTEPNY
  WYPOZYCZONY
  ZAGINIONY
}`, check: m => m.get('StatusEgzemplarza')?.type === 'enum' && m.get('StatusEgzemplarza').attrs.length === 3 },
      { do: 'Użyj wyliczenia jako typu: dopisz w klasie Ksiazka ' + c('- status : StatusEgzemplarza'), check: m => attr(m, 'Ksiazka', 'status')?.type === 'StatusEgzemplarza' },
      { do: 'Raport korzysta z publikacji tylko w jednej operacji. Dopisz w klasie Raport ' + c('+ generuj(p : Publikacja) : String') + ', a na końcu ' + c('Raport ..> Publikacja'), why: why(['..>', 'linia przerywana ze strzałką: zależność; Raport nie przechowuje publikacji, tylko dostaje ją jako parametr']), check: m => !!op(m, 'Raport', 'generuj') && any(m, 'dependency', 'Raport', 'Publikacja') },
      { do: '<b>Ćwiczenie.</b> Dodaj klasę <b>Audiobook</b> z atrybutem <i>czasTrwania : int</i>. Audiobook jest publikacją i można go wypożyczyć.', check: m => !!attr(m, 'Audiobook', 'czasTrwania') && any(m, 'generalization', 'Audiobook', 'Publikacja') && any(m, 'realization', 'Audiobook', 'Wypozyczalne') },
    ],
  },
  {
    id: 'cl-hw', kind: 'class', title: '2.H Zadanie domowe 2',
    intro: `<b>Platforma kursów online.</b> Platforma oferuje kursy. Kurs ma tytuł i opis i składa się z co najmniej jednego modułu; moduł nie istnieje poza kursem. Moduł składa się z lekcji. Każda lekcja jest albo nagraniem wideo (czas trwania w minutach), albo quizem (próg zaliczenia w procentach); innych lekcji nie ma. Kurs prowadzi co najmniej jeden prowadzący, a prowadzący może prowadzić dowolnie wiele kursów. Student zapisuje się na kursy. Dla każdego zapisu przechowujemy datę zapisu i status: aktywny, ukończony albo porzucony.<br><br>Gotowy diagram pobierz przyciskiem <b>Pobierz SVG</b> i wyślij.`,
    start: "' Zadanie domowe 2: platforma kursów online\n",
    steps: [
      { do: 'Klasy: Kurs, Modul, Lekcja, LekcjaWideo, Quiz, Prowadzacy, Student, Zapis.', check: m => ['Kurs', 'Modul', 'Lekcja', 'LekcjaWideo', 'Quiz', 'Prowadzacy', 'Student', 'Zapis'].every(n => m.get(n)) },
      { do: 'Atrybuty z typami: tytul i opis w Kursie, czasTrwania w LekcjaWideo, progZaliczenia w Quizie, dataZapisu i status w Zapisie.', check: m => [['Kurs', 'tytul'], ['Kurs', 'opis'], ['LekcjaWideo', 'czasTrwania'], ['Quiz', 'progZaliczenia'], ['Zapis', 'dataZapisu'], ['Zapis', 'status']].every(([k, a]) => attr(m, k, a)?.type) },
      { do: 'Kurs, moduł i lekcja: właściwe relacje i liczności.', check: m => m.links('composition', 'Modul', 'Kurs').some(r => m.mult(r, 'Modul') === '1..*') && any(m, 'composition', 'Lekcja', 'Modul') },
      { do: 'Rodzaje lekcji. Pamiętaj, że innych lekcji nie ma.', hint: 'Lekcja nie ma własnych obiektów.', check: m => m.get('Lekcja').type === 'abstract' && any(m, 'generalization', 'LekcjaWideo', 'Lekcja') && any(m, 'generalization', 'Quiz', 'Lekcja') },
      { do: 'Prowadzący i kursy z licznościami.', check: m => m.links('association', 'Prowadzacy', 'Kurs').some(r => m.mult(r, 'Prowadzacy') === '1..*' && many(m.mult(r, 'Kurs'))) },
      { do: 'Zapis łączy studenta z kursem: student ma dowolnie wiele zapisów, każdy zapis dotyczy jednego studenta i jednego kursu.', check: m => m.links('association', 'Student', 'Zapis').some(r => m.mult(r, 'Student') === '1' && many(m.mult(r, 'Zapis'))) && m.links('association', 'Kurs', 'Zapis').some(r => m.mult(r, 'Kurs') === '1') },
      { do: 'Status jako wyliczenie z trzema wartościami, użyte jako typ atrybutu status.', check: m => m.els.some(e => e.type === 'enum' && e.attrs.length === 3 && N(e.label) === N(attr(m, 'Zapis', 'status')?.type || '')) },
    ],
  },
);

if (typeof module !== 'undefined') module.exports = { LESSONS };
