// Course content. Each lesson is a list of blocks rendered by index.html.
// Diagrams are written in a PlantUML subset (see uml.js) and drawn as SVG; students never see this source.
// A lesson counts as done once it has been opened.
const p = html => ({ t: 'p', html });
const h = text => ({ t: 'h', text });
const fig = (src, caption, kind) => ({ t: 'fig', src, caption, kind });
const shape = o => ({ t: 'shape', ...o }); // { name, src, kind?, means, rules: [], drawio }
const note = html => ({ t: 'note', html });
const list = items => ({ t: 'list', items });
const table = (head, rows) => ({ t: 'table', head, rows });
const pair = (title, bad, good, why) => ({ t: 'pair', title, bad, good, why });
const task = o => ({ t: 'task', ...o }); // { title, html, check: [], src? (model solution) }
const lines = rows => ({ t: 'lines', rows }); // rows: [src, kind, name, meaning, drawio]

const COURSE = [
  {
    title: 'Start', kind: 'usecase',
    lessons: [
      {
        id: 'start', title: 'UML i draw.io',
        blocks: [
          p('UML (Unified Modeling Language) to standardowy zestaw kształtów do opisywania systemów. Każdy kształt i każdy rodzaj linii ma jedno ustalone znaczenie, więc dwie osoby czytają ten sam diagram tak samo.'),
          p('UML ma kilkanaście rodzajów diagramów. Zaczynamy od dwóch najczęściej używanych: <b>diagramu przypadków użycia</b> (kto korzysta z systemu i po co) i <b>diagramu klas</b> (jakie informacje system przechowuje i jak są powiązane). Ostatni moduł dotyczy <b>BPMN</b>, notacji do opisywania procesów: kto co robi, w jakiej kolejności i na co czeka.'),
          h('Rysujemy w draw.io'),
          p('Otwórz <a href="https://app.diagrams.net" target="_blank" rel="noopener">app.diagrams.net</a>. Logowanie nie jest potrzebne. Plik zapisujesz przez <b>Plik → Zapisz jako</b> (format .drawio), obraz przez <b>Plik → Eksportuj jako → PNG</b>.'),
          list([
            '<b>Kształty UML</b> są w panelu po lewej, w grupie <i>UML</i>. Jeśli jej nie ma, kliknij <b>+ Więcej kształtów</b> na dole panelu i zaznacz UML.',
            '<b>Najszybciej</b> jest wpisać nazwę w polu wyszukiwania nad kształtami: <i>actor</i>, <i>use case</i>, <i>class</i>, <i>interface</i>.',
            '<b>Linię</b> rysujesz, przeciągając niebieską strzałkę, która pojawia się po najechaniu na kształt.',
            '<b>Wygląd linii</b> zmieniasz w panelu <b>Format</b> po prawej (Ctrl+Shift+P, gdy jest ukryty): wzór (ciągła albo przerywana) oraz zakończenia na obu końcach (grot, trójkąt, romb, pełne albo puste).',
          ]),
          note('W UML zakończenie linii zmienia znaczenie. Pusty trójkąt znaczy co innego niż otwarty grot, a linia przerywana co innego niż ciągła. Domyślna strzałka draw.io (pełny grot) nie występuje w żadnej z relacji, które poznamy, więc zawsze ją zmieniaj.'),
          p('Każdy moduł kończy się ćwiczeniem z przykładowym rozwiązaniem i zadaniem domowym.'),
        ],
      },
    ],
  },
  {
    title: 'Diagram przypadków użycia', kind: 'usecase',
    lessons: [
      {
        id: 'uc-intro', title: 'Co pokazuje ten diagram',
        blocks: [
          p('Diagram przypadków użycia odpowiada na dwa pytania: <b>kto</b> korzysta z systemu i <b>po co</b>. Nie pokazuje, jak system działa w środku, w jakiej kolejności coś się dzieje ani jak wygląda interfejs.'),
          fig(`actor Czytelnik
actor Bibliotekarz
rectangle "System biblioteczny" {
  (Wyszukaj książkę)
  (Wypożycz książkę)
  (Przedłuż wypożyczenie)
  (Dodaj książkę do katalogu)
}
Czytelnik -- (Wyszukaj książkę)
Czytelnik -- (Wypożycz książkę)
Czytelnik -- (Przedłuż wypożyczenie)
Bibliotekarz -- (Wyszukaj książkę)
Bibliotekarz -- (Dodaj książkę do katalogu)`, 'Dwóch aktorów, cztery przypadki użycia, jedna granica systemu.'),
          p('Czytamy go tak: czytelnik może wyszukać książkę, wypożyczyć ją i przedłużyć wypożyczenie. Bibliotekarz może wyszukać książkę i dodać ją do katalogu.'),
          p('Ten diagram rysuje się na początku projektu, często razem z klientem albo przyszłymi użytkownikami. Jest na tyle prosty, że osoba bez przygotowania technicznego może na niego spojrzeć i powiedzieć „tego brakuje” albo „tego nikt nie robi”.'),
          note('W projektowaniu interakcji przypadki użycia to lista zadań, które użytkownicy chcą wykonać. Z tej listy wybierasz potem zadania do testów użyteczności i do scenariuszy projektowych.'),
        ],
      },
      {
        id: 'uc-shapes', title: 'Aktor, przypadek użycia, granica systemu',
        blocks: [
          shape({ name: 'Aktor', src: 'actor Czytelnik',
            means: 'Rola, w której ktoś albo coś korzysta z systemu. Aktor jest zawsze <b>poza</b> systemem. Może to być człowiek (Czytelnik), organizacja (Hurtownia) albo inny system (System płatności).',
            rules: ['Nazwa to rola, nie osoba: <i>Czytelnik</i>, a nie <i>Jan Kowalski</i>.', 'Jedna osoba może grać kilka ról. Bibliotekarka, która sama wypożycza książki, występuje raz jako Bibliotekarz, raz jako Czytelnik.', 'Część naszego systemu (formularz, baza danych, serwer) nie jest aktorem.'],
            drawio: 'Wyszukaj <i>actor</i>. Podpis zmieniasz po dwukrotnym kliknięciu.' }),
          shape({ name: 'Przypadek użycia', src: '(Wypożycz książkę)',
            means: 'Cel, który aktor osiąga dzięki systemowi i który daje mu konkretny wynik.',
            rules: ['Nazwa to czasownik z dopełnieniem, z perspektywy aktora: <i>Wypożycz książkę</i>, <i>Zapłać karę</i>.', 'Nie nazywaj tak ekranów (<i>Ekran konta</i>), przycisków (<i>Kliknij Zapisz</i>) ani rzeczy (<i>Książka</i>).', 'Nie rozpisuj kroków. <i>Zeskanuj kartę</i> to krok wypożyczenia, a nie osobny cel.'],
            drawio: 'Wyszukaj <i>use case</i> (elipsa) albo użyj zwykłej elipsy z grupy General.' }),
          shape({ name: 'Granica systemu', src: `rectangle "System biblioteczny" {
  (Wyszukaj książkę)
  (Wypożycz książkę)
}`,
            means: 'Prostokąt z nazwą systemu. Przypadki użycia są w środku, aktorzy na zewnątrz. Pokazuje, co należy do zakresu projektu.',
            rules: ['Nazwę systemu pisze się u góry prostokąta.', 'Jeśli coś jest poza granicą, nie budujemy tego w tym projekcie.'],
            drawio: 'Zwykły prostokąt. Tekst przesuń do góry w Format → Tekst. Przesuń go pod elipsy: Uporządkuj → Na spód (Ctrl+Shift+B).' }),
          shape({ name: 'Asocjacja', src: 'Czytelnik -- (Wypożycz książkę)',
            means: 'Linia ciągła bez zakończeń między aktorem a przypadkiem użycia. Znaczy: ten aktor bierze udział w tym przypadku użycia.',
            rules: ['Łączy aktora z przypadkiem użycia. Nie łączy dwóch aktorów i nie pokazuje przepływu danych.', 'Grot nie jest potrzebny. Niektóre narzędzia go dodają, ale nie zmienia to znaczenia.'],
            drawio: 'Format → zakończenie linii: brak (po obu stronach).' }),
          h('Aktorzy po obu stronach'),
          p('Aktora, który rozpoczyna przypadek użycia, rysuje się zwykle po lewej. Systemy zewnętrzne, z których nasz system korzysta, po prawej.'),
          fig(`actor Czytelnik
actor "System płatności" as P
rectangle "System biblioteczny" {
  (Zapłać karę)
}
Czytelnik -- (Zapłać karę)
(Zapłać karę) -- P`, 'Czytelnik rozpoczyna płatność, system płatności ją realizuje.'),
        ],
      },
      {
        id: 'uc-relations', title: 'include, extend, generalizacja',
        blocks: [
          p('Między przypadkami użycia i między aktorami rysuje się trzy rodzaje relacji. Różnią się wzorem linii, zakończeniem i podpisem, więc łatwo je pomylić.'),
          shape({ name: '«include»', src: '(Wypożycz książkę) ..> (Zaloguj się) : <<include>>',
            means: 'Przypadek bazowy <b>zawsze</b> wykonuje przypadek włączany. Używa się go, gdy ten sam fragment powtarza się w kilku przypadkach użycia.',
            rules: ['Linia przerywana, otwarty grot, podpis «include».', 'Grot wskazuje przypadek włączany: od <i>Wypożycz książkę</i> do <i>Zaloguj się</i>.', 'Czytaj: wypożyczenie książki zawsze obejmuje zalogowanie.'],
            drawio: 'Format: wzór przerywany, zakończenie: otwarty grot. Podpis: dwukrotne kliknięcie na linii, wpisz «include» albo &lt;&lt;include&gt;&gt;.' }),
          shape({ name: '«extend»', src: '(Zapłać karę) ..> (Oddaj książkę) : <<extend>>',
            means: 'Przypadek rozszerzający wykonuje się <b>tylko czasem</b>, pod jakimś warunkiem. Przypadek bazowy jest kompletny bez niego.',
            rules: ['Linia przerywana, otwarty grot, podpis «extend».', 'Grot wskazuje przypadek bazowy: od <i>Zapłać karę</i> do <i>Oddaj książkę</i>. To odwrotnie niż przy include.', 'Czytaj: przy oddawaniu książki czasem płaci się karę (gdy książka jest przetrzymana).'],
            drawio: 'Tak samo jak include, tylko inny podpis i kierunek.' }),
          shape({ name: 'Generalizacja', src: `actor Użytkownik
Czytelnik --|> Użytkownik
Bibliotekarz --|> Użytkownik
Użytkownik -- (Wyszukaj książkę)`,
            means: 'Aktor szczegółowy może wszystko, co aktor ogólny, i coś więcej. Tutaj obaj mogą wyszukać książkę, bo obaj są użytkownikami.',
            rules: ['Linia ciągła, pusty trójkąt przy aktorze ogólnym.', 'Oszczędza linie: łączysz z przypadkiem użycia tylko aktora ogólnego.', 'Rzadziej stosuje się ją między przypadkami użycia, np. <i>Zapłać kartą</i> jako odmiana <i>Zapłać</i>.'],
            drawio: 'Format: linia ciągła, zakończenie: pusty trójkąt.' }),
          h('include czy extend?'),
          table(['', '«include»', '«extend»'], [
            ['Czy wykonuje się zawsze?', 'tak', 'nie, tylko pod warunkiem'],
            ['Grot wskazuje', 'przypadek włączany', 'przypadek bazowy'],
            ['Czy przypadek bazowy ma sens bez niego?', 'nie', 'tak'],
            ['Przykład', 'Wypożycz książkę → Zaloguj się', 'Zapłać karę → Oddaj książkę'],
          ]),
          note('Nie używaj include do rozpisywania kroków (Wypożycz → Zeskanuj kartę → Zeskanuj książkę). Diagram przypadków użycia nie jest schematem blokowym. Kroki opisuje się w scenariuszu przypadku użycia.'),
        ],
      },
      {
        id: 'uc-mistakes', title: 'Typowe błędy',
        blocks: [
          p('Te błędy pojawiają się w pracach studentów najczęściej. Po lewej wersja błędna, po prawej poprawiona.'),
          pair('Konkretna osoba zamiast roli', `actor "Jan Kowalski" as J
J -- (Wypożycz książkę)`, 'Czytelnik -- (Wypożycz książkę)', 'Aktor to rola. Jan Kowalski jest tylko jednym z czytelników.'),
          pair('Element interfejsu jako przypadek użycia', `Czytelnik -- (Ekran konta)
Czytelnik -- (Kliknij Przedłuż)`, 'Czytelnik -- (Przedłuż wypożyczenie)', 'Ekran i kliknięcie to sposób, a nie cel. Przypadek użycia nazywa to, co aktor chce osiągnąć.'),
          pair('Część systemu jako aktor', `actor Czytelnik
actor "Baza danych" as DB
rectangle "System biblioteczny" {
  (Wypożycz książkę)
}
Czytelnik -- (Wypożycz książkę)
(Wypożycz książkę) -- DB`, `actor Czytelnik
rectangle "System biblioteczny" {
  (Wypożycz książkę)
}
Czytelnik -- (Wypożycz książkę)`, 'Własna baza danych jest w środku systemu. Aktorem byłby tylko zewnętrzny system, którego nie budujemy.'),
          pair('Kroki zamiast celów', `Bibliotekarz -- (Wypożycz książkę)
(Wypożycz książkę) ..> (Zeskanuj kartę) : <<include>>
(Zeskanuj kartę) ..> (Zeskanuj książkę) : <<include>>`, 'Bibliotekarz -- (Wypożycz książkę)', 'Skanowanie to kroki jednego przypadku użycia. Opisuje się je w scenariuszu, nie na diagramie.'),
          pair('Odwrócony extend', '(Oddaj książkę) ..> (Zapłać karę) : <<extend>>', '(Zapłać karę) ..> (Oddaj książkę) : <<extend>>', 'Grot extend wskazuje przypadek bazowy, czyli ten, który działa także bez rozszerzenia.'),
          pair('Aktor wewnątrz granicy systemu', `rectangle "System biblioteczny" {
  actor Czytelnik
  (Wypożycz książkę)
}
Czytelnik -- (Wypożycz książkę)`, `actor Czytelnik
rectangle "System biblioteczny" {
  (Wypożycz książkę)
}
Czytelnik -- (Wypożycz książkę)`, 'Aktor korzysta z systemu z zewnątrz.'),
        ],
      },
      {
        id: 'uc-practice', title: 'Ćwiczenie i zadanie domowe',
        blocks: [
          task({ title: 'Ćwiczenie: kino online', html: 'Widz przegląda repertuar i kupuje bilet. Zakup biletu zawsze wymaga zalogowania. Przy zakupie widz może, ale nie musi, użyć kodu rabatowego. Płatność obsługuje zewnętrzny operator płatności. Pracownik kina dodaje seanse do repertuaru i też musi być zalogowany.',
            check: ['Trzech aktorów, w tym operator płatności po prawej stronie', 'Logowanie połączone z zakupem i dodawaniem seansu przez «include»', 'Kod rabatowy jako «extend» zakupu, grot przy zakupie'],
            src: `actor Widz
actor "Pracownik kina" as P
actor "Operator płatności" as OP
rectangle "Kino online" {
  (Przeglądaj repertuar)
  (Kup bilet)
  (Użyj kodu rabatowego)
  (Dodaj seans)
  (Zaloguj się)
}
Widz -- (Przeglądaj repertuar)
Widz -- (Kup bilet)
P -- (Dodaj seans)
(Kup bilet) ..> (Zaloguj się) : <<include>>
(Dodaj seans) ..> (Zaloguj się) : <<include>>
(Użyj kodu rabatowego) ..> (Kup bilet) : <<extend>>
(Kup bilet) -- OP` }),
          task({ title: 'Zadanie domowe 1: rezerwacja sal', html: 'Studenci i pracownicy wyszukują wolne sale na wydziale i rezerwują je. Pracownik może dodatkowo założyć rezerwację cykliczną, np. co tydzień przez semestr. Każda rezerwacja wymaga zalogowania przez centralny system uwierzytelniania uczelni (CAS). Przy rezerwacji można, ale nie trzeba, zamówić sprzęt (rzutnik, mikrofon). Administrator zatwierdza rezerwacje i zarządza listą sal.<br><br>Oddaj plik <b>.drawio</b> i eksport <b>PNG</b>.',
            check: ['Aktorzy to role, CAS jest aktorem zewnętrznym', 'Granica systemu z nazwą, aktorzy na zewnątrz', 'Wspólne przypadki studenta i pracownika pokazane przez generalizację', 'Logowanie jako «include», zamówienie sprzętu jako «extend», groty we właściwą stronę', 'Nazwy przypadków użycia to cele (czasownik + dopełnienie)'] }),
        ],
      },
    ],
  },
  {
    title: 'Diagram klas', kind: 'class',
    lessons: [
      {
        id: 'cl-class', title: 'Klasa',
        blocks: [
          p('Diagram klas pokazuje, z jakich rodzajów obiektów składa się system, jakie dane przechowują i jak są ze sobą powiązane. Przypadki użycia mówią, co system robi. Diagram klas mówi, jakie informacje system musi przechowywać, żeby to robić.'),
          p('<b>Klasa</b> opisuje grupę podobnych obiektów. Klasa Ksiazka opisuje wszystkie książki w bibliotece. Konkretna <i>Lalka</i> Prusa to jeden obiekt tej klasy.'),
          shape({ name: 'Klasa', src: `class Ksiazka {
  - tytul : String
  - rokWydania : int
  + wypozycz() : void
  + przedluz(dni : int) : boolean
}`,
            means: 'Prostokąt w trzech częściach: nazwa, atrybuty (dane, które obiekt przechowuje) i operacje (co obiekt potrafi zrobić).',
            rules: ['Nazwa: rzeczownik w liczbie pojedynczej, wielką literą. <i>Ksiazka</i>, a nie <i>Ksiazki</i>.', 'Atrybut: <code>widoczność nazwa : Typ</code>, np. <code>- tytul : String</code>.', 'Operacja: <code>widoczność nazwa(parametr : Typ) : TypWyniku</code>. Nawiasy odróżniają ją od atrybutu.', 'Części z atrybutami i operacjami mogą być puste, gdy na danym etapie nie są ważne.'],
            drawio: 'Wyszukaj <i>class</i>. Kształt ma gotowe części. Nowy wiersz: zaznacz istniejący i wciśnij Ctrl+Enter (duplikuj).' }),
          h('Widoczność'),
          table(['Znak', 'Nazwa', 'Kto ma dostęp'], [
            ['<code>+</code>', 'publiczna', 'wszystkie klasy'],
            ['<code>-</code>', 'prywatna', 'tylko ta klasa'],
            ['<code>#</code>', 'chroniona', 'ta klasa i klasy, które po niej dziedziczą'],
            ['<code>~</code>', 'pakietowa', 'klasy z tego samego pakietu'],
          ]),
          note('Zwykle atrybuty są prywatne, a operacje publiczne. Obiekt sam pilnuje swoich danych, a inne klasy proszą go o coś przez operacje.'),
          shape({ name: 'Atrybut statyczny', src: `class Ksiazka {
  - tytul : String
  {static} - liczbaKsiazek : int
}`,
            means: 'Podkreślony atrybut ma jedną wartość wspólną dla wszystkich obiektów klasy, np. łączną liczbę książek. Zwykły atrybut każdy obiekt ma własny.',
            rules: [], drawio: 'Zaznacz wiersz i podkreśl tekst (Ctrl+U).' }),
        ],
      },
      {
        id: 'cl-assoc', title: 'Asocjacja i liczności',
        blocks: [
          shape({ name: 'Asocjacja', src: 'Czytelnik "1" -- "*" Wypozyczenie : dokonuje',
            means: 'Linia ciągła: obiekty tych klas są ze sobą trwale powiązane. System pamięta, który czytelnik dokonał którego wypożyczenia.',
            rules: ['Nazwa asocjacji przy środku linii (zwykle czasownik) jest opcjonalna, ale ułatwia czytanie.', 'Czytaj w obie strony: czytelnik dokonuje dowolnie wielu wypożyczeń; każdego wypożyczenia dokonuje dokładnie jeden czytelnik.'],
            drawio: 'Linia ciągła bez zakończeń. Liczności wpisz jako osobne pola tekstowe przy końcach linii.' }),
          h('Liczności'),
          table(['Zapis', 'Znaczenie'], [
            ['<code>1</code>', 'dokładnie jeden'],
            ['<code>0..1</code>', 'zero albo jeden'],
            ['<code>*</code> albo <code>0..*</code>', 'dowolnie wiele, także zero'],
            ['<code>1..*</code>', 'co najmniej jeden'],
            ['<code>2..4</code>', 'od dwóch do czterech'],
          ]),
          note('Liczność stoi przy klasie, której dotyczy, i odpowiada na pytanie: ile obiektów <b>tej</b> klasy łączy się z jednym obiektem klasy po drugiej stronie?'),
          fig('Ksiazka "1" -- "1..*" Egzemplarz', 'Książka ma co najmniej jeden egzemplarz. Egzemplarz należy do dokładnie jednej książki.'),
          shape({ name: 'Nawigowalność', src: 'Wypozyczenie "*" --> "1" Egzemplarz',
            means: 'Otwarty grot pokazuje, w którą stronę da się przejść. Wypożyczenie wie, którego egzemplarza dotyczy. Egzemplarz nie musi znać swoich wypożyczeń.',
            rules: ['Na wczesnym etapie projektu grotów zwykle się nie rysuje.'],
            drawio: 'Zakończenie przy klasie docelowej: otwarty grot.' }),
        ],
      },
      {
        id: 'cl-whole', title: 'Agregacja i kompozycja',
        blocks: [
          p('Obie relacje są szczególnym rodzajem asocjacji: <b>całość składa się z części</b>. Romb rysuje się zawsze przy całości.'),
          shape({ name: 'Kompozycja', src: 'Ksiazka "1" *-- "1..*" Rozdzial',
            means: 'Pełny romb. Część nie istnieje bez całości i należy tylko do jednej całości. Usunięcie książki usuwa jej rozdziały.',
            rules: ['Po stronie całości liczność to 1 albo 0..1.', 'Test: czy część ma sens po usunięciu całości? Jeśli nie, to kompozycja.'],
            drawio: 'Zakończenie przy całości: pełny romb.' }),
          shape({ name: 'Agregacja', src: 'Regal "0..1" o-- "*" Egzemplarz',
            means: 'Pusty romb. Część istnieje samodzielnie i może zmienić całość: egzemplarz można przenieść na inny regał albo wypożyczyć.',
            rules: [], drawio: 'Zakończenie przy całości: pusty romb.' }),
          note('Agregacja niesie niewiele więcej informacji niż zwykła asocjacja. Jeśli nie masz pewności, narysuj zwykłą linię. Kompozycję warto rysować, bo mówi coś konkretnego: części znikają razem z całością.'),
          table(['Całość – część', 'Relacja', 'Dlaczego'], [
            ['Zamowienie – PozycjaZamowienia', 'kompozycja', 'pozycja bez zamówienia nie istnieje'],
            ['Budynek – Pokoj', 'kompozycja', 'pokój nie istnieje bez budynku'],
            ['Zespol – Pracownik', 'agregacja', 'po rozwiązaniu zespołu pracownik dalej pracuje w firmie'],
            ['Playlista – Utwor', 'agregacja', 'utwór zostaje po usunięciu playlisty'],
          ]),
        ],
      },
      {
        id: 'cl-inherit', title: 'Dziedziczenie, interfejsy, wyliczenia',
        blocks: [
          shape({ name: 'Generalizacja', src: `abstract class Publikacja {
  # tytul : String
  # rokWydania : int
}
class Ksiazka {
  - isbn : String
}
class Czasopismo {
  - numer : int
}
Ksiazka --|> Publikacja
Czasopismo --|> Publikacja`,
            means: 'Klasa szczegółowa dziedziczy atrybuty i operacje klasy ogólnej. Książka jest publikacją, więc ma tytuł i rok wydania, choć nie wpisujemy ich w jej prostokącie.',
            rules: ['Linia ciągła, pusty trójkąt przy klasie ogólnej.', 'Test: czy zdanie „X jest rodzajem Y” jest prawdziwe? Książka jest rodzajem publikacji: tak. Rozdział jest rodzajem książki: nie, to kompozycja.'],
            drawio: 'Linia ciągła, zakończenie przy klasie ogólnej: pusty trójkąt.' }),
          shape({ name: 'Klasa abstrakcyjna', src: `abstract class Publikacja {
  # tytul : String
  + {abstract} opis() : String
}`,
            means: 'Klasa, która nie ma własnych obiektów, tylko podklasy. Każda publikacja w bibliotece jest książką albo czasopismem.',
            rules: ['Nazwę pisze się kursywą.', 'Operacja abstrakcyjna, też kursywą, nie ma implementacji. Musi ją dostarczyć każda podklasa.'],
            drawio: 'Zaznacz nazwę i ustaw kursywę (Ctrl+I).' }),
          shape({ name: 'Interfejs i realizacja', src: `interface Wypozyczalne {
  + wypozycz() : void
  + zwroc() : void
}
class Ksiazka
class Laptop
Ksiazka ..|> Wypozyczalne
Laptop ..|> Wypozyczalne`,
            means: 'Interfejs to lista operacji bez implementacji. Klasa, która go realizuje, musi mieć te operacje.',
            rules: ['Nad nazwą stereotyp «interface».', 'Realizacja: linia przerywana, pusty trójkąt przy interfejsie.', 'Klasy bez wspólnego rodzica mogą realizować ten sam interfejs. Książka i laptop to różne rzeczy, ale oba da się wypożyczyć.'],
            drawio: 'Wyszukaj <i>interface</i>. Linia przerywana, zakończenie: pusty trójkąt.' }),
          shape({ name: 'Zależność', src: `class Raport {
  + generuj(p : Publikacja) : String
}
class Publikacja
Raport ..> Publikacja`,
            means: 'Linia przerywana z otwartym grotem: klasa korzysta z innej tylko chwilowo, np. dostaje ją jako parametr operacji. Nie przechowuje trwałego powiązania.',
            rules: [], drawio: 'Linia przerywana, zakończenie: otwarty grot.' }),
          shape({ name: 'Wyliczenie', src: `enum StatusEgzemplarza {
  DOSTEPNY
  WYPOZYCZONY
  ZAGINIONY
}
class Egzemplarz {
  - sygnatura : String
  - status : StatusEgzemplarza
}`,
            means: 'Typ o zamkniętej liście wartości, ze stereotypem «enumeration». Używa się go jako typu atrybutu.',
            rules: [], drawio: 'Kształt <i>class</i>, nad nazwą dopisz «enumeration», usuń część operacji.' }),
        ],
      },
      {
        id: 'cl-cheatsheet', title: 'Ściąga: wszystkie linie',
        blocks: [
          p('Wszystkie linie z obu diagramów w jednym miejscu. Ostatnia kolumna mówi, co ustawić w panelu Format w draw.io.'),
          h('Diagram przypadków użycia'),
          lines([
            ['Czytelnik -- (Wypożycz książkę)', 'usecase', 'Asocjacja', 'aktor bierze udział w przypadku użycia', 'ciągła, bez zakończeń'],
            ['(Wypożycz książkę) ..> (Zaloguj się) : <<include>>', 'usecase', '«include»', 'zawsze obejmuje; grot do włączanego', 'przerywana, otwarty grot, podpis'],
            ['(Zapłać karę) ..> (Oddaj książkę) : <<extend>>', 'usecase', '«extend»', 'czasem rozszerza; grot do bazowego', 'przerywana, otwarty grot, podpis'],
            ['Bibliotekarz --|> Czytelnik', 'usecase', 'Generalizacja', 'jest rodzajem; trójkąt do ogólnego', 'ciągła, pusty trójkąt'],
          ]),
          h('Diagram klas'),
          lines([
            ['A -- B', 'class', 'Asocjacja', 'obiekty są trwale powiązane', 'ciągła, bez zakończeń'],
            ['A --> B', 'class', 'Asocjacja nawigowalna', 'A zna B, B nie musi znać A', 'ciągła, otwarty grot'],
            ['A o-- B', 'class', 'Agregacja', 'A składa się z B; B istnieje samodzielnie', 'ciągła, pusty romb przy całości'],
            ['A *-- B', 'class', 'Kompozycja', 'A składa się z B; B znika razem z A', 'ciągła, pełny romb przy całości'],
            ['B --|> A', 'class', 'Generalizacja', 'B jest rodzajem A', 'ciągła, pusty trójkąt'],
            ['B ..|> A', 'class', 'Realizacja', 'B realizuje interfejs A', 'przerywana, pusty trójkąt'],
            ['B ..> A', 'class', 'Zależność', 'B chwilowo używa A', 'przerywana, otwarty grot'],
          ]),
        ],
      },
      {
        id: 'cl-practice', title: 'Ćwiczenie i zadanie domowe',
        blocks: [
          task({ title: 'Ćwiczenie: rowery miejskie', html: 'Stacja ma nazwę i adres oraz od 5 do 30 stojaków; stojak nie istnieje bez stacji. W stojaku stoi co najwyżej jeden rower. Rower ma numer i stan: sprawny, w naprawie albo wycofany. Rowery są zwykłe albo elektryczne; elektryczny ma dodatkowo poziom baterii. Klient ma dowolnie wiele wypożyczeń. Wypożyczenie dotyczy jednego roweru i ma czas rozpoczęcia i zakończenia.',
            check: ['Kompozycja stacja–stojak z licznością 5..30', 'Rower jako klasa abstrakcyjna z dwiema podklasami', 'Stan roweru jako wyliczenie użyte jako typ atrybutu', 'Liczności przy wszystkich asocjacjach'],
            src: `class Stacja {
  - nazwa : String
  - adres : String
}
class Stojak {
  - numer : int
}
abstract class Rower {
  - numer : int
  - stan : StanRoweru
}
class RowerZwykly
class RowerElektryczny {
  - poziomBaterii : int
}
enum StanRoweru {
  SPRAWNY
  W_NAPRAWIE
  WYCOFANY
}
class Klient {
  - imie : String
}
class Wypozyczenie {
  - start : DateTime
  - koniec : DateTime
}
Stacja "1" *-- "5..30" Stojak
Stojak "0..1" -- "0..1" Rower
RowerZwykly --|> Rower
RowerElektryczny --|> Rower
Klient "1" -- "*" Wypozyczenie
Wypozyczenie "*" -- "1" Rower` }),
          task({ title: 'Zadanie domowe 2: platforma kursów online', html: 'Platforma oferuje kursy. Kurs ma tytuł i opis i składa się z co najmniej jednego modułu; moduł nie istnieje poza kursem. Moduł składa się z lekcji. Każda lekcja jest albo nagraniem wideo (czas trwania w minutach), albo quizem (próg zaliczenia w procentach); innych lekcji nie ma. Kurs prowadzi co najmniej jeden prowadzący, a prowadzący może prowadzić dowolnie wiele kursów. Student zapisuje się na kursy. Dla każdego zapisu przechowujemy datę zapisu i status: aktywny, ukończony albo porzucony.<br><br>Oddaj plik <b>.drawio</b> i eksport <b>PNG</b>.',
            check: ['Atrybuty z typami, nazwy klas w liczbie pojedynczej', 'Kompozycje kurs–moduł i moduł–lekcja, romb przy całości', 'Lekcja jako klasa abstrakcyjna', 'Zapis jako osobna klasa między studentem a kursem', 'Status jako wyliczenie', 'Liczności przy wszystkich asocjacjach'] }),
        ],
      },
    ],
  },
  {
    title: 'BPMN', kind: 'bpmn',
    lessons: [
      {
        id: 'bp-intro', title: 'Po co BPMN',
        blocks: [
          p('BPMN (Business Process Model and Notation) to notacja do opisywania <b>procesów</b>: kto co robi, w jakiej kolejności, na co czeka i jakie wiadomości wymienia z innymi. Standard prowadzi ta sama organizacja co UML (OMG). Używamy wersji 2.0.'),
          p('Diagram czynności z UML też pokazuje kroki. BPMN idzie dalej w dwóch kierunkach: pokazuje <b>kilku uczestników</b>, z których każdy ma własny proces (czytelnik, biblioteka, system płatności), i <b>czas</b>: czekanie na odpowiedź, terminy, przypomnienia.'),
          fig(`start s "Potrzebna książka" 0
task a "Wyszukaj książkę w katalogu" 1
task b "Wypożycz książkę" 2
end e "Książka wypożyczona" 3
s -> a
a -> b
b -> e`, 'Najprostszy proces: zdarzenie początkowe, dwa zadania, zdarzenie końcowe. Czytamy od lewej do prawej.'),
          h('Co już znasz z diagramu czynności'),
          table(['Diagram czynności (UML)', 'BPMN'], [
            ['węzeł początkowy (pełne koło)', 'zdarzenie początkowe (okrąg cienką linią)'],
            ['akcja (zaokrąglony prostokąt)', 'zadanie (zaokrąglony prostokąt)'],
            ['decyzja i scalenie (romb)', 'bramka wykluczająca (romb, często z X)'],
            ['rozwidlenie i złączenie (gruba kreska)', 'bramka równoległa (romb z +)'],
            ['węzeł końcowy (koło w okręgu)', 'zdarzenie końcowe (okrąg grubą linią)'],
            ['partycje (tory)', 'baseny i tory'],
            ['brak', 'przepływ komunikatów między uczestnikami, zdarzenia czasowe, typy zadań'],
          ]),
          h('Po co to w HCI'),
          p('Użytkownik rzadko przechodzi przez jeden ekran. Oddanie książki, reklamacja czy rejestracja na zajęcia to proces, w którym ktoś czeka na e-mail, ktoś zatwierdza wniosek, a coś dzieje się w zewnętrznym systemie. Na diagramie procesu widać miejsca, w których użytkownik czeka, wypełnia te same dane drugi raz albo nie wie, co się dzieje. Tych problemów nie znajdziesz, oglądając pojedyncze ekrany.'),
          note('Pod koniec modułu weźmiesz czynność, którą modelowaliście diagramem czynności na wybranej stronie, i narysujesz ją w BPMN.'),
          h('Rysujemy w draw.io'),
          list([
            '<b>Kształty BPMN</b>: kliknij <b>+ Więcej kształtów</b> na dole lewego panelu i zaznacz <i>BPMN</i>. Pojawi się grupa <i>BPMN General</i>.',
            '<b>Najszybciej</b> jest wyszukać kształt po angielskiej nazwie: <i>start event</i>, <i>task</i>, <i>gateway</i>, <i>pool</i>, <i>timer</i>, <i>message</i>.',
            '<b>Linie</b> są na końcu grupy BPMN General: <i>Sequence Flow</i>, <i>Message Flow</i>, <i>Association</i>. Przeciągnij gotową linię zamiast zmieniać domyślną strzałkę.',
          ]),
          note('Alternatywa: <a href="https://demo.bpmn.io" target="_blank" rel="noopener">demo.bpmn.io</a>, darmowy edytor tylko do BPMN. Typ elementu zmieniasz ikoną klucza, a edytor nie pozwoli połączyć elementów niedozwoloną linią. Do oddania zadań używamy jednak draw.io.'),
        ],
      },
      {
        id: 'bp-basics', title: 'Zdarzenia, zadania, przepływ',
        blocks: [
          p('Każdy proces w BPMN zaczyna się zdarzeniem, składa się z zadań połączonych przepływem sekwencji i kończy się zdarzeniem. Tych czterech elementów używa się na każdym diagramie.'),
          shape({ name: 'Zdarzenie początkowe', src: 'start s "Potrzebna książka" 0',
            means: 'To, co uruchamia proces. Okrąg narysowany cienką linią.',
            rules: ['Nazwa opisuje, co się stało: <i>Potrzebna książka</i>, <i>Zamówienie otrzymane</i>.', 'Proces ma zwykle jedno zdarzenie początkowe. Nic do niego nie wchodzi.'],
            drawio: 'Wyszukaj <i>start event</i>. Podpis wpisz pod okręgiem, nie w środku.' }),
          shape({ name: 'Zadanie', src: 'task t "Wypożycz książkę" 0',
            means: 'Jedna jednostka pracy, którą ktoś albo coś wykonuje.',
            rules: ['Nazwa jak przy przypadkach użycia: czasownik z dopełnieniem, <i>Wypożycz książkę</i>, <i>Sprawdź dostępność</i>.', 'Zadanie ma jedno wejście i jedno wyjście. Rozgałęzienia robi się bramkami (następna lekcja).'],
            drawio: 'Wyszukaj <i>task</i>. Zaokrąglony prostokąt, tekst w środku.' }),
          shape({ name: 'Przepływ sekwencji', src: `task a "Wyszukaj książkę" 0
task b "Wypożycz książkę" 1
a -> b`,
            means: 'Linia ciągła z pełnym grotem. Pokazuje kolejność: <i>Wypożycz książkę</i> zaczyna się, gdy skończy się <i>Wyszukaj książkę</i>.',
            rules: ['Nie oznacza przesyłania danych ani wiadomości, tylko kolejność.', 'Łączy elementy w obrębie jednego uczestnika (basenu). Między uczestnikami rysuje się inną linię, poznasz ją w lekcji 4.'],
            drawio: 'Linia <i>Sequence Flow</i> z grupy BPMN General.' }),
          shape({ name: 'Zdarzenie końcowe', src: 'end e "Książka wypożyczona" 0',
            means: 'Koniec ścieżki procesu. Okrąg narysowany grubą linią.',
            rules: ['Nazwa opisuje stan na końcu: <i>Książka wypożyczona</i>, <i>Rezerwacja anulowana</i>.', 'Proces może mieć kilka zdarzeń końcowych, po jednym na każdy wynik.', 'Nic z niego nie wychodzi.'],
            drawio: 'Wyszukaj <i>end event</i>. Jeśli kształt ma cienką linię, zwiększ grubość w Format → Linia (ok. 3 pt).' }),
          h('Zdarzenie czy zadanie?'),
          table(['', 'Zadanie', 'Zdarzenie'], [
            ['Co to jest', 'praca do wykonania', 'coś, co się stało'],
            ['Czy trwa', 'tak', 'nie, to chwila'],
            ['Forma nazwy', 'czasownik w trybie rozkazującym', 'rzeczownik z imiesłowem albo stan'],
            ['Przykład', 'Zwróć książkę', 'Książka zwrócona'],
          ]),
        ],
      },
      {
        id: 'bp-gateways', title: 'Bramki: decyzje i równoległość',
        blocks: [
          p('Bramka to romb, w którym ścieżka procesu się rozdziela albo łączy. Znak w środku mówi, ile ścieżek pójdzie dalej. Bramka sama nic nie robi: nie sprawdza, nie liczy i nie decyduje. Informację, na podstawie której wybiera się ścieżkę, zbiera zadanie przed nią.'),
          shape({ name: 'Bramka wykluczająca (XOR)', src: `start s "Potrzebna książka" 0
task a "Sprawdź dostępność" 1
xor g "Dostępna?" 2
task b "Wypożycz książkę" 3
task c "Zarezerwuj książkę" 3 1
xor j "" 4
end e "Sprawa załatwiona" 5
s -> a
a -> g
g -> b : tak
g -> c : nie
b -> j
c -> j
j -> e`,
            means: 'Proces idzie <b>dokładnie jedną</b> ścieżką. Książka jest dostępna albo nie.',
            rules: ['Bramkę rozdzielającą podpisz pytaniem, a wychodzące linie odpowiedziami.', 'Druga bramka XOR scala ścieżki: przepuszcza tę jedną, która do niej dotrze.', 'Romb bez znaku też oznacza XOR, ale z X diagram jest czytelniejszy.'],
            drawio: 'Wyszukaj <i>exclusive gateway</i>. Podpis linii: dwukrotne kliknięcie na linii.' }),
          shape({ name: 'Bramka równoległa (AND)', src: `task a "Przyjmij zwrot" 0
and p "" 1
task b "Sprawdź stan książki" 2
task c "Zaktualizuj konto czytelnika" 2 1
and q "" 3
task d "Odłóż książkę na półkę" 4
a -> p
p -> b
p -> c
b -> q
c -> q
q -> d`,
            means: 'Proces idzie <b>wszystkimi</b> ścieżkami naraz. Bramka scalająca czeka, aż skończą się wszystkie.',
            rules: ['Linii nie podpisuje się, bo nie ma tu wyboru.', 'Kolejność zadań na równoległych ścieżkach nie ma znaczenia. Mogą dziać się jednocześnie.'],
            drawio: 'Wyszukaj <i>parallel gateway</i>.' }),
          shape({ name: 'Bramka inkluzywna (OR)', src: `task a "Sprawdź ustawienia czytelnika" 0
or p "Jakie kanały?" 1
task:send b "Wyślij e-mail" 2
task:send c "Wyślij SMS" 2 1
or q "" 3
end e "Czytelnik powiadomiony" 4
a -> p
p -> b : e-mail
p -> c : SMS
b -> q
c -> q
q -> e`,
            means: 'Proces idzie <b>jedną albo kilkoma</b> ścieżkami, zależnie od warunków. Czytelnik mógł wybrać e-mail, SMS albo oba.',
            rules: ['Bramka scalająca czeka na wszystkie ścieżki, które zostały uruchomione.', 'Stosuj ją rzadko. Jeśli da się to wyrazić przez XOR albo AND, wybierz XOR albo AND.'],
            drawio: 'Wyszukaj <i>inclusive gateway</i>.' }),
          h('Trzy bramki obok siebie'),
          table(['Bramka', 'Przy rozdzieleniu', 'Przy scaleniu'], [
            ['XOR (X)', 'jedna ścieżka, wybrana warunkiem', 'przepuszcza każdą ścieżkę, która dotrze'],
            ['AND (+)', 'wszystkie ścieżki', 'czeka na wszystkie'],
            ['OR (O)', 'jedna lub więcej, według warunków', 'czeka na wszystkie uruchomione'],
          ]),
          note('Scalaj ścieżki bramką tego samego rodzaju, którą je rozdzieliłeś. Ścieżki rozdzielone przez XOR scalone bramką AND blokują proces: AND czeka na ścieżkę, która nigdy nie nadejdzie.'),
        ],
      },
      {
        id: 'bp-pools', title: 'Baseny, tory i komunikaty',
        blocks: [
          p('Do tej pory był jeden proces bez informacji, kto go wykonuje. W BPMN uczestników pokazuje się na dwa sposoby, zależnie od tego, czy należą do tej samej organizacji.'),
          shape({ name: 'Basen i tory', src: `pool B "Biblioteka"
lane "Bibliotekarz"
task a "Przyjmij zwrot" 0
lane "System"
task:service b "Zaktualizuj konto czytelnika" 1
a -> b`,
            means: '<b>Basen</b> (pool) to jeden uczestnik z własnym procesem: osoba, firma, instytucja. <b>Tory</b> (lanes) dzielą basen według ról wewnątrz tego uczestnika.',
            rules: ['Bibliotekarz i system biblioteczny działają w jednym procesie biblioteki, więc są torami jednego basenu.', 'Przepływ sekwencji może przechodzić między torami tego samego basenu.', 'Nazwa basenu i torów stoi pionowo po lewej stronie.'],
            drawio: 'Wyszukaj <i>pool</i>. Tor dodasz, przeciągając kształt <i>lane</i> na basen.' }),
          shape({ name: 'Przepływ komunikatów', src: `pool C "Czytelnik"
task:send a "Poproś o przedłużenie" 0
pool B "Biblioteka"
start:message s "Prośba otrzymana" 0
task b "Przedłuż wypożyczenie" 1
s -> b
a ~> s : prośba`,
            means: 'Linia przerywana z kółkiem na początku i pustym grotem na końcu. Pokazuje wiadomość, którą jeden uczestnik wysyła drugiemu: e-mail, formularz, telefon, list.',
            rules: ['Łączy <b>tylko</b> różne baseny. Przepływ sekwencji nigdy nie przechodzi między basenami.', 'Proces biblioteki zaczyna się od zdarzenia z kopertą: <i>Prośba otrzymana</i>. Biblioteka nie wie, co czytelnik robił wcześniej. Wie tylko, że dostała wiadomość.'],
            drawio: 'Linia <i>Message Flow</i> z grupy BPMN General.' }),
          shape({ name: 'Basen jako czarna skrzynka', src: `pool B "Biblioteka"
task:service a "Pobierz opłatę za kartę" 1
pool P "System płatności"
a ~> P : żądanie zapłaty
P ~> a : potwierdzenie`,
            means: 'Pusty basen: uczestnik, z którym się komunikujemy, ale którego procesu nie znamy albo nie projektujemy. Komunikaty dochodzą do jego krawędzi.',
            rules: ['Przydaje się dla systemów zewnętrznych: płatności, logowania przez uczelnię, poczty.'],
            drawio: 'Basen bez torów, zmniejszony do wąskiego paska.' }),
          h('Cały proces: rezerwacja książki'),
          fig(`pool C "Czytelnik"
start s "Potrzebna książka" 0
task:user a "Zarezerwuj książkę w katalogu" 1
event:message n "Powiadomienie otrzymane" 4
task:manual o "Odbierz książkę" 5
end e "Książka odebrana" 6
s -> a
a -> n
n -> o
o -> e
pool B "Biblioteka"
lane "System biblioteczny"
start:message r "Rezerwacja otrzymana" 1
task:service q "Dopisz do kolejki" 2
task:send w "Wyślij powiadomienie" 4
end k "Czytelnik powiadomiony" 5
lane "Bibliotekarz"
task:user t "Odłóż książkę na półkę rezerwacji" 3
r -> q
q -> t
t -> w
w -> k
a ~> r : rezerwacja
w ~> n : e-mail`, 'Czytelnik czeka między rezerwacją a powiadomieniem. Na diagramie to długi odcinek bez zadań w jego basenie. Ikony w rogach zadań poznasz w następnej lekcji.'),
          p('Przeczytaj ten diagram na głos: czytelnik rezerwuje książkę w katalogu, co wysyła rezerwację do biblioteki. System dopisuje ją do kolejki. Gdy egzemplarz wróci, bibliotekarz odkłada go na półkę rezerwacji, a system wysyła e-mail. Czytelnik, który czekał na tę wiadomość, idzie po książkę.'),
        ],
      },
      {
        id: 'bp-details', title: 'Czas, komunikaty, typy zadań, dane',
        blocks: [
          p('Zdarzenia pośrednie (podwójny okrąg) dzieją się w trakcie procesu. Ikona w środku mówi, na co proces czeka albo co wysyła.'),
          shape({ name: 'Zdarzenie czasowe', src: `task:send a "Wyślij przypomnienie" 0
event:timer t "3 dni" 1
task b "Nalicz karę" 2
a -> t
t -> b`,
            means: 'Proces stoi, aż minie czas albo nadejdzie data. Tu: trzy dni po przypomnieniu biblioteka nalicza karę.',
            rules: ['Podpisz, ile czasu albo do kiedy: <i>3 dni</i>, <i>Każdy poniedziałek 8:00</i>.', 'Zegar może też być w zdarzeniu początkowym: proces startuje o określonej porze, np. codzienne sprawdzanie przetrzymanych książek.'],
            drawio: 'Wyszukaj <i>timer</i> i wybierz wariant z podwójnym okręgiem.' }),
          shape({ name: 'Zdarzenia komunikatu', src: `event:send a "Zamówienie wysłane" 0
event:message b "Przesyłka dotarła" 1
end:message c "Czytelnik powiadomiony" 2
a -> b
b -> c`,
            means: 'Koperta oznacza wiadomość. <b>Biała</b> koperta: proces czeka na wiadomość. <b>Czarna</b>: proces wysyła wiadomość.',
            rules: ['Zdarzenie końcowe z czarną kopertą kończy proces wysłaniem wiadomości.', 'Przy basenach do zdarzenia z kopertą dochodzi albo z niego wychodzi przepływ komunikatów.'],
            drawio: 'Wyszukaj <i>message</i> i wybierz wariant (początkowy, pośredni, końcowy, biała albo czarna koperta).' }),
          shape({ name: 'Zdarzenie brzegowe', src: `task:user a "Wydaj książkę" 0
boundary:timer t "3 dni" @a
end e1 "Książka wydana" 1
task b "Anuluj rezerwację" 1 1
end e2 "Rezerwacja anulowana" 2 1
a -> e1
t -> b
b -> e2`,
            means: 'Zdarzenie przyczepione do krawędzi zadania. Gdy nastąpi, zadanie zostaje przerwane i proces idzie ścieżką wychodzącą ze zdarzenia. Tu: jeśli czytelnik nie odbierze książki w 3 dni, rezerwacja przepada.',
            rules: ['Normalne zakończenie zadania prowadzi zwykłym wyjściem w prawo, przekroczenie czasu ścieżką w dół.', 'Tak modeluje się terminy, limity czasu sesji i wygasające linki.'],
            drawio: 'Przeciągnij zdarzenie pośrednie na dolną krawędź zadania.' }),
          h('Typy zadań'),
          p('Ikona w lewym górnym rogu mówi, kto albo co wykonuje zadanie. Zadanie bez ikony też jest poprawne.'),
          lines([
            ['task:user a "Wypełnij formularz" 0', 'bpmn', 'Zadanie użytkownika', 'człowiek wykonuje je za pomocą systemu', 'wyszukaj <i>user task</i>'],
            ['task:manual a "Odbierz książkę z półki" 0', 'bpmn', 'Zadanie ręczne', 'człowiek wykonuje je bez systemu', 'wyszukaj <i>manual task</i>'],
            ['task:service a "Nalicz karę" 0', 'bpmn', 'Zadanie usługi', 'system wykonuje je sam, bez człowieka', 'wyszukaj <i>service task</i>'],
            ['task:send a "Wyślij potwierdzenie" 0', 'bpmn', 'Zadanie wysłania', 'wysyła wiadomość do innego basenu', 'wyszukaj <i>send task</i>'],
            ['task:receive a "Odbierz zgłoszenie" 0', 'bpmn', 'Zadanie odbioru', 'czeka na wiadomość z innego basenu', 'wyszukaj <i>receive task</i>'],
            ['sub a "Obsłuż płatność" 0', 'bpmn', 'Podproces', 'zadanie złożone z kilku kroków, rozpisanych na osobnym diagramie', 'zadanie z kwadratem i + na dole'],
          ]),
          note('Zadania użytkownika to miejsca, w których potrzebny jest interfejs. Jeśli policzysz je na diagramie, dostaniesz listę ekranów albo formularzy do zaprojektowania. Zadania usługi dzieją się bez użytkownika, ale często musi on się o ich wyniku dowiedzieć.'),
          shape({ name: 'Dane', src: `task:user a "Wypełnij zgłoszenie" 0
data d "Zgłoszenie" 1 1
task:user b "Rozpatrz zgłoszenie" 2
store k "Katalog" 3 1
a -> b
a ..> d
d ..> b
b ..> k`,
            means: '<b>Obiekt danych</b> (kartka z zagiętym rogiem) to dokument albo informacja, która powstaje lub jest potrzebna w procesie. <b>Magazyn danych</b> (walec) to miejsce, gdzie dane zostają na dłużej, np. baza katalogu.',
            rules: ['Łączy się je z zadaniami kropkowaną linią z grotem, który pokazuje, czy zadanie dane czyta, czy zapisuje.', 'Dane są dodatkiem. Rysuj je, gdy coś wyjaśniają, nie przy każdym zadaniu.'],
            drawio: 'Wyszukaj <i>data object</i> i <i>data store</i>. Linia <i>Association</i>.' }),
        ],
      },
      {
        id: 'bp-mistakes', title: 'Typowe błędy',
        blocks: [
          p('Po lewej wersja błędna, po prawej poprawiona.'),
          pair('Przepływ sekwencji między basenami', `pool C "Czytelnik"
task a "Poproś o przedłużenie" 0
pool B "Biblioteka"
task b "Przedłuż wypożyczenie" 1
a -> b`, `pool C "Czytelnik"
task:send a "Poproś o przedłużenie" 0
pool B "Biblioteka"
start:message s "Prośba otrzymana" 0
task b "Przedłuż wypożyczenie" 1
a ~> s
s -> b`, 'Każdy basen ma własny proces. Biblioteka nie przejmuje sterowania od czytelnika, tylko dostaje od niego wiadomość i sama zaczyna działać.'),
          pair('Bramka, która wykonuje pracę', `xor g "Sprawdź dostępność" 0
task b "Wypożycz książkę" 1
task c "Zarezerwuj książkę" 1 1
g -> b : tak
g -> c : nie`, `task a "Sprawdź dostępność" 0
xor g "Dostępna?" 1
task b "Wypożycz książkę" 2
task c "Zarezerwuj książkę" 2 1
a -> g
g -> b : tak
g -> c : nie`, 'Sprawdzenie to zadanie. Bramka tylko wybiera ścieżkę na podstawie jego wyniku, więc jej podpis to pytanie.'),
          pair('XOR scalony bramką AND', `xor g "Dostępna?" 0
task b "Wypożycz książkę" 1
task c "Zarezerwuj książkę" 1 1
and j "" 2
end e "Gotowe" 3
g -> b : tak
g -> c : nie
b -> j
c -> j
j -> e`, `xor g "Dostępna?" 0
task b "Wypożycz książkę" 1
task c "Zarezerwuj książkę" 1 1
xor j "" 2
end e "Gotowe" 3
g -> b : tak
g -> c : nie
b -> j
c -> j
j -> e`, 'Wykona się tylko jedna ścieżka, a AND czeka na obie. Proces nigdy nie dojdzie do końca.'),
          pair('Brak zdarzeń', `task a "Wyszukaj książkę" 0
task b "Wypożycz książkę" 1
a -> b`, `start s "Potrzebna książka" 0
task a "Wyszukaj książkę" 1
task b "Wypożycz książkę" 2
end e "Książka wypożyczona" 3
s -> a
a -> b
b -> e`, 'Bez zdarzeń nie wiadomo, co uruchamia proces ani jakim wynikiem się kończy.'),
          pair('Osobne baseny dla ról jednej organizacji', `pool A "Bibliotekarz"
task a "Przyjmij zwrot" 0
pool S "System biblioteczny"
task:service b "Zaktualizuj konto" 1
a ~> b`, `pool B "Biblioteka"
lane "Bibliotekarz"
task a "Przyjmij zwrot" 0
lane "System"
task:service b "Zaktualizuj konto" 1
a -> b`, 'Bibliotekarz nie wysyła wiadomości do systemu, z którego korzysta. Oba pracują w jednym procesie biblioteki, więc są torami jednego basenu.'),
        ],
      },
      {
        id: 'bp-cheatsheet', title: 'Ściąga BPMN',
        blocks: [
          h('Zdarzenia'),
          lines([
            ['start s "" 0', 'bpmn', 'Zdarzenie początkowe', 'uruchamia proces', '<i>start event</i>'],
            ['start:message s "" 0', 'bpmn', 'Początkowe komunikatu', 'proces startuje, gdy przyjdzie wiadomość', '<i>message start event</i>'],
            ['start:timer s "" 0', 'bpmn', 'Początkowe czasowe', 'proces startuje o określonej porze', '<i>timer start event</i>'],
            ['event:message s "" 0', 'bpmn', 'Pośrednie, odbiór komunikatu', 'proces czeka na wiadomość', '<i>message intermediate</i>, biała koperta'],
            ['event:send s "" 0', 'bpmn', 'Pośrednie, wysłanie komunikatu', 'proces wysyła wiadomość i idzie dalej', 'czarna koperta'],
            ['event:timer s "" 0', 'bpmn', 'Pośrednie czasowe', 'proces czeka określony czas', '<i>timer intermediate</i>'],
            ['task a "" 0\nboundary:timer t "" @a', 'bpmn', 'Brzegowe czasowe', 'termin, który przerywa zadanie', 'zdarzenie pośrednie na krawędzi zadania'],
            ['end e "" 0', 'bpmn', 'Zdarzenie końcowe', 'kończy ścieżkę procesu', '<i>end event</i>, gruba linia'],
            ['end:message e "" 0', 'bpmn', 'Końcowe komunikatu', 'kończy proces wysłaniem wiadomości', '<i>message end event</i>'],
          ]),
          h('Bramki'),
          lines([
            ['xor g "" 0', 'bpmn', 'XOR', 'dokładnie jedna ścieżka', '<i>exclusive gateway</i>'],
            ['and g "" 0', 'bpmn', 'AND', 'wszystkie ścieżki; scalenie czeka na wszystkie', '<i>parallel gateway</i>'],
            ['or g "" 0', 'bpmn', 'OR', 'jedna lub więcej ścieżek', '<i>inclusive gateway</i>'],
          ]),
          h('Linie'),
          lines([
            ['task a "A" 0\ntask b "B" 1\na -> b', 'bpmn', 'Przepływ sekwencji', 'kolejność w obrębie jednego basenu', '<i>Sequence Flow</i>: ciągła, pełny grot'],
            ['pool K "Klient"\ntask:send a "Wyślij" 0\npool S "Sklep"\na ~> S', 'bpmn', 'Przepływ komunikatów', 'wiadomość między basenami', '<i>Message Flow</i>: przerywana, kółko, pusty grot'],
            ['data d "Dane" 0\ntask b "Zadanie" 1\nd ..> b', 'bpmn', 'Powiązanie danych', 'zadanie czyta albo zapisuje dane', '<i>Association</i>: kropkowana, otwarty grot'],
          ]),
          h('Pięć zasad do sprawdzenia przed oddaniem'),
          list([
            'Każdy proces (każdy basen, który nie jest czarną skrzynką) ma zdarzenie początkowe i co najmniej jedno końcowe.',
            'Przepływ sekwencji nie przechodzi między basenami. Przepływ komunikatów zawsze między nie przechodzi.',
            'Zadania nazwane czasownikiem z dopełnieniem, zdarzenia nazwane tym, co się stało.',
            'Bramka XOR ma podpis-pytanie, a wychodzące linie odpowiedzi.',
            'Ścieżki scalone bramką tego samego rodzaju, którą je rozdzielono.',
          ]),
        ],
      },
      {
        id: 'bp-practice', title: 'Ćwiczenie i zadania domowe',
        blocks: [
          task({ title: 'Ćwiczenie: zakup biletu w kinie online', html: 'To samo kino, co w ćwiczeniu z przypadków użycia. Widz wybiera seans i miejsca, podaje dane karty i zatwierdza zakup. Kino online obciąża kartę przez zewnętrznego operatora płatności, którego procesu nie znamy. Jeśli płatność się uda, kino wysyła bilet e-mailem. Jeśli nie, zwalnia zablokowane miejsca i wysyła widzowi informację o błędzie. Widz czeka na odpowiedź kina.',
            check: ['Trzy baseny: Widz, Kino online, Operator płatności jako czarna skrzynka', 'Proces kina zaczyna się zdarzeniem komunikatu', 'Między basenami tylko przepływy komunikatów', 'Bramka XOR z pytaniem i podpisanymi wyjściami, osobne zdarzenia końcowe dla obu wyników', 'Zadania widza oznaczone jako zadania użytkownika'],
            src: `pool W "Widz"
start s "Chcę iść do kina" 0
task:user a "Wybierz miejsca i zapłać" 1
event:message c "Odpowiedź kina otrzymana" 4
xor g2 "Bilet przyszedł?" 5
end e1 "Bilet kupiony" 6
end e2 "Zakup nieudany" 6 1
s -> a
a -> c
c -> g2
g2 -> e1 : tak
g2 -> e2 : nie
pool K "Kino online"
start:message s2 "Zamówienie otrzymane" 1
task:service p "Obciąż kartę" 2
xor g "Płatność udana?" 3
task:send t "Wyślij bilet" 4
end k1 "Bilet wysłany" 5
task:send z "Zwolnij miejsca, zgłoś błąd" 5.5 1
end k2 "Sprzedaż anulowana" 6.5 1
s2 -> p
p -> g
g -> t : tak
g -> z : nie
t -> k1
z -> k2
pool OP "Operator płatności"
a ~> s2 : zamówienie
p ~> OP : obciążenie
OP ~> p : wynik
t ~> c
z ~> c` }),
          task({ title: 'Zadanie domowe 3: proces rezerwacji sali', html: 'Wróć do systemu rezerwacji sal z zadania domowego 1 i narysuj proces jednej rezerwacji. Użytkownik (student albo pracownik) loguje się przez CAS, wyszukuje wolną salę i wysyła prośbę o rezerwację. System zapisuje prośbę i powiadamia administratora. Administrator zatwierdza albo odrzuca prośbę. Jeśli nie zrobi tego w ciągu 2 dni roboczych, system automatycznie ją odrzuca. W każdym przypadku użytkownik dostaje e-mail z wynikiem.<br><br>Oddaj plik <b>.drawio</b> i eksport <b>PNG</b>.',
            check: ['Basen użytkownika, basen uczelni z torami System i Administrator, CAS jako czarna skrzynka', 'Termin 2 dni jako zdarzenie brzegowe z zegarem na zadaniu administratora', 'Bramka XOR z pytaniem i podpisanymi wyjściami', 'Między basenami tylko przepływy komunikatów', 'Typy zadań: użytkownika, usługi, wysłania'] }),
          task({ title: 'Zadanie domowe 4: z diagramu czynności do BPMN', html: 'Weź czynność, którą modelowaliście diagramem czynności na wybranej stronie, i narysuj ją w BPMN. Użytkownik i strona to osobne baseny. Jeśli w czynności biorą udział inne systemy (płatności, poczta, logowanie przez Google), dodaj je jako czarne skrzynki. Pod diagramem napisz trzy zdania: co BPMN pokazał, czego nie było widać na diagramie czynności, i w którym miejscu procesu użytkownik czeka najdłużej.<br><br>Oddaj plik <b>.drawio</b>, eksport <b>PNG</b> i diagram czynności, od którego zaczynasz.',
            check: ['Każdy krok z diagramu czynności ma odpowiednik w BPMN albo uzasadnienie, dlaczego go nie ma', 'Komunikaty między użytkownikiem a stroną jako przepływy komunikatów', 'Zadania użytkownika zaznaczone ikoną', 'Oczekiwanie (na e-mail, na zatwierdzenie) pokazane zdarzeniem'] }),
        ],
      },
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { COURSE };
