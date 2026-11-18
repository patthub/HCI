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
        id: 'bp-intro', title: 'Wprowadzenie',
        blocks: [
          p('BPMN (Business Process Model and Notation) to notacja do modelowania procesów. Standard, tak jak UML, wydaje organizacja OMG. Obecna wersja to BPMN 2.0.'),
          p('Elementy wspólne z diagramem czynności UML: kroki, decyzje, przepływ sterowania. Elementy specyficzne dla BPMN: osobne obszary dla uczestników procesu, przepływ komunikatów między uczestnikami, zdarzenia czasowe i komunikatu, typy zadań.'),
          fig(`start s "Potrzebna książka" 0
task a "Wyszukaj książkę w katalogu" 1
task b "Wypożycz książkę" 2
end e "Książka wypożyczona" 3
s -> a
a -> b
b -> e`, 'Proces z dwoma zadaniami. Kierunek czytania: od lewej do prawej.'),
          h('Odpowiedniki w diagramie czynności UML'),
          table(['Diagram czynności (UML)', 'BPMN'], [
            ['węzeł początkowy (pełne koło)', 'zdarzenie początkowe (okrąg cienką linią)'],
            ['akcja (zaokrąglony prostokąt)', 'zadanie (zaokrąglony prostokąt)'],
            ['decyzja i scalenie (romb)', 'bramka wykluczająca (romb, często z X)'],
            ['rozwidlenie i złączenie (gruba kreska)', 'bramka równoległa (romb z +)'],
            ['węzeł końcowy (koło w okręgu)', 'zdarzenie końcowe (okrąg grubą linią)'],
            ['partycje (tory)', 'baseny i tory'],
            ['brak', 'przepływ komunikatów między uczestnikami, zdarzenia czasowe, typy zadań'],
          ]),
          h('BPMN w projektowaniu interakcji'),
          p('Zastosowanie: opis usługi, z której korzysta użytkownik (np. zwrot książki, rejestracja na zajęcia), z uwzględnieniem kroków oczekiwania na odpowiedź i przekazywania danych między uczestnikami.'),
          h('Narzędzia'),
          list([
            '<b>draw.io</b>: biblioteka kształtów <i>BPMN General</i>, włączana przez <b>+ Więcej kształtów</b> → <i>BPMN</i>.',
            'Wyszukiwanie kształtów po nazwach angielskich: <i>start event</i>, <i>task</i>, <i>gateway</i>, <i>pool</i>, <i>timer</i>, <i>message</i>.',
            'Linie w bibliotece BPMN General: <i>Sequence Flow</i>, <i>Message Flow</i>, <i>Association</i>.',
          ]),
          p('<a href="https://demo.bpmn.io" target="_blank" rel="noopener">demo.bpmn.io</a>: edytor BPMN w przeglądarce. Zmiana typu elementu: ikona klucza. Edytor blokuje niedozwolone połączenia. Format oddawanych zadań: draw.io.'),
        ],
      },
      {
        id: 'bp-basics', title: 'Zdarzenia, zadania, przepływ',
        blocks: [
          p('Proces w BPMN zaczyna się zdarzeniem początkowym, składa się z zadań połączonych przepływem sekwencji i kończy się zdarzeniem końcowym.'),
          shape({ name: 'Zdarzenie początkowe', src: 'start s "Potrzebna książka" 0',
            means: 'To, co uruchamia proces. Okrąg narysowany cienką linią.',
            rules: ['Nazwa opisuje, co się stało: <i>Potrzebna książka</i>, <i>Zamówienie otrzymane</i>.', 'Proces ma zwykle jedno zdarzenie początkowe. Nic do niego nie wchodzi.'],
            drawio: '<i>start event</i>. Podpis pod okręgiem.' }),
          shape({ name: 'Zadanie', src: 'task t "Wypożycz książkę" 0',
            means: 'Czynność wykonywana przez człowieka albo system.',
            rules: ['Nazwa: czasownik z dopełnieniem, np. <i>Wypożycz książkę</i>, <i>Sprawdź dostępność</i>.', 'Jedno wejście i jedno wyjście. Rozgałęzienia: bramki.'],
            drawio: '<i>task</i>.' }),
          shape({ name: 'Przepływ sekwencji', src: `task a "Wyszukaj książkę" 0
task b "Wypożycz książkę" 1
a -> b`,
            means: 'Linia ciągła z pełnym grotem. Pokazuje kolejność: <i>Wypożycz książkę</i> zaczyna się, gdy skończy się <i>Wyszukaj książkę</i>.',
            rules: ['Nie oznacza przesyłania danych ani wiadomości, tylko kolejność.', 'Łączy elementy w obrębie jednego basenu. Między basenami: przepływ komunikatów.'],
            drawio: '<i>Sequence Flow</i>.' }),
          shape({ name: 'Zdarzenie końcowe', src: 'end e "Książka wypożyczona" 0',
            means: 'Koniec ścieżki procesu. Okrąg narysowany grubą linią.',
            rules: ['Nazwa opisuje stan na końcu: <i>Książka wypożyczona</i>, <i>Rezerwacja anulowana</i>.', 'Proces może mieć kilka zdarzeń końcowych, po jednym na każdy wynik.', 'Nic z niego nie wychodzi.'],
            drawio: '<i>end event</i>. Grubość obrysu ok. 3 pt (Format → Linia).' }),
          h('Zadanie a zdarzenie'),
          table(['', 'Zadanie', 'Zdarzenie'], [
            ['Definicja', 'praca do wykonania', 'fakt, który zaszedł'],
            ['Czas trwania', 'tak', 'nie (moment)'],
            ['Forma nazwy', 'czasownik w trybie rozkazującym', 'rzeczownik z imiesłowem albo stan'],
            ['Przykład', 'Zwróć książkę', 'Książka zwrócona'],
          ]),
        ],
      },
      {
        id: 'bp-gateways', title: 'Bramki: decyzje i równoległość',
        blocks: [
          p('Bramka to romb, w którym ścieżka procesu się rozdziela albo łączy. Znak w środku określa, iloma ścieżkami proces pójdzie dalej. Bramka nie wykonuje pracy: sprawdzenie warunku to osobne zadanie przed bramką.'),
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
            means: 'Proces przechodzi <b>dokładnie jedną</b> ścieżką.',
            rules: ['Podpis bramki rozdzielającej: pytanie. Podpisy linii wychodzących: odpowiedzi.', 'Bramka XOR scalająca przepuszcza każdą ścieżkę, która do niej dotrze.', 'Romb bez znaku jest równoważny bramce XOR.'],
            drawio: '<i>exclusive gateway</i>.' }),
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
            means: 'Proces przechodzi <b>wszystkimi</b> ścieżkami równolegle. Bramka scalająca czeka na zakończenie wszystkich.',
            rules: ['Linie wychodzące bez podpisów.', 'Kolejność wykonania zadań na ścieżkach równoległych jest nieokreślona.'],
            drawio: '<i>parallel gateway</i>.' }),
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
            means: 'Proces przechodzi <b>jedną lub kilkoma</b> ścieżkami, według warunków.',
            rules: ['Bramka scalająca czeka na wszystkie uruchomione ścieżki.'],
            drawio: '<i>inclusive gateway</i>.' }),
          h('Porównanie bramek'),
          table(['Bramka', 'Przy rozdzieleniu', 'Przy scaleniu'], [
            ['XOR (X)', 'jedna ścieżka, wybrana warunkiem', 'przepuszcza każdą ścieżkę, która dotrze'],
            ['AND (+)', 'wszystkie ścieżki', 'czeka na wszystkie'],
            ['OR (O)', 'jedna lub więcej, według warunków', 'czeka na wszystkie uruchomione'],
          ]),
          p('Ścieżki scala się bramką tego samego rodzaju co bramka rozdzielająca. Połączenie XOR (rozdzielenie) z AND (scalenie) powoduje zakleszczenie: AND czeka na ścieżkę, która nie zostanie uruchomiona.'),
        ],
      },
      {
        id: 'bp-pools', title: 'Baseny, tory i komunikaty',
        blocks: [
          p('Uczestników procesu pokazuje się jako osobne baseny albo jako tory w jednym basenie, zależnie od tego, czy należą do tej samej organizacji.'),
          shape({ name: 'Basen i tory', src: `pool B "Biblioteka"
lane "Bibliotekarz"
task a "Przyjmij zwrot" 0
lane "System"
task:service b "Zaktualizuj konto czytelnika" 1
a -> b`,
            means: '<b>Basen</b> (pool): uczestnik z własnym procesem (osoba, firma, instytucja, system). <b>Tor</b> (lane): rola wewnątrz uczestnika.',
            rules: ['Bibliotekarz i system biblioteczny: tory jednego basenu (jeden proces biblioteki).', 'Przepływ sekwencji może przechodzić między torami jednego basenu.', 'Nazwy basenu i torów: pionowo, po lewej stronie.'],
            drawio: '<i>pool</i>, <i>lane</i>.' }),
          shape({ name: 'Przepływ komunikatów', src: `pool C "Czytelnik"
task:send a "Poproś o przedłużenie" 0
pool B "Biblioteka"
start:message s "Prośba otrzymana" 0
task b "Przedłuż wypożyczenie" 1
s -> b
a ~> s : prośba`,
            means: 'Linia przerywana z kółkiem na początku i pustym grotem na końcu. Wiadomość przesyłana między uczestnikami (e-mail, formularz, telefon, list).',
            rules: ['Łączy <b>wyłącznie</b> różne baseny.', 'Proces uruchamiany wiadomością zaczyna się zdarzeniem początkowym komunikatu (<i>Prośba otrzymana</i>).'],
            drawio: '<i>Message Flow</i>.' }),
          shape({ name: 'Basen jako czarna skrzynka', src: `pool B "Biblioteka"
task:service a "Pobierz opłatę za kartę" 1
pool P "System płatności"
a ~> P : żądanie zapłaty
P ~> a : potwierdzenie`,
            means: 'Basen bez zawartości: uczestnik, którego proces jest nieznany albo poza zakresem modelu. Przepływy komunikatów kończą się na jego krawędzi.',
            rules: ['Typowe zastosowanie: systemy zewnętrzne (płatności, uwierzytelnianie, poczta).'],
            drawio: '<i>pool</i> bez torów, o zmniejszonej wysokości.' }),
          h('Przykład: rezerwacja książki'),
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
w ~> n : e-mail`, 'Proces rezerwacji książki. Ikony typów zadań: lekcja 5.'),
          p('Przebieg: rezerwacja w katalogu → komunikat do biblioteki → dopisanie do kolejki → odłożenie zwróconego egzemplarza na półkę rezerwacji → e-mail do czytelnika → odbiór książki.'),
        ],
      },
      {
        id: 'bp-details', title: 'Czas, komunikaty, typy zadań, dane',
        blocks: [
          p('Zdarzenie pośrednie: podwójny okrąg, występuje w trakcie procesu. Ikona określa typ zdarzenia.'),
          shape({ name: 'Zdarzenie czasowe', src: `task:send a "Wyślij przypomnienie" 0
event:timer t "3 dni" 1
task b "Nalicz karę" 2
a -> t
t -> b`,
            means: 'Wstrzymanie procesu do upływu czasu albo do określonej daty.',
            rules: ['Podpis: czas albo termin, np. <i>3 dni</i>, <i>Każdy poniedziałek 8:00</i>.', 'Zdarzenie początkowe czasowe: start procesu o określonej porze.'],
            drawio: '<i>timer</i>, wariant pośredni.' }),
          shape({ name: 'Zdarzenia komunikatu', src: `event:send a "Zamówienie wysłane" 0
event:message b "Przesyłka dotarła" 1
end:message c "Czytelnik powiadomiony" 2
a -> b
b -> c`,
            means: 'Koperta biała: odbiór wiadomości (proces czeka). Koperta czarna: wysłanie wiadomości.',
            rules: ['Zdarzenie końcowe komunikatu: zakończenie procesu z wysłaniem wiadomości.', 'Z zdarzeniem komunikatu łączy się przepływ komunikatów z innego basenu.'],
            drawio: '<i>message</i>, odpowiedni wariant.' }),
          shape({ name: 'Zdarzenie brzegowe', src: `task:user a "Wydaj książkę" 0
boundary:timer t "3 dni" @a
end e1 "Książka wydana" 1
task b "Anuluj rezerwację" 1 1
end e2 "Rezerwacja anulowana" 2 1
a -> e1
t -> b
b -> e2`,
            means: 'Zdarzenie na krawędzi zadania. Wystąpienie zdarzenia przerywa zadanie; proces kontynuuje ścieżką wychodzącą ze zdarzenia.',
            rules: ['Zastosowania: terminy, wygasanie sesji, wygasanie linków.'],
            drawio: 'zdarzenie pośrednie umieszczone na krawędzi zadania.' }),
          h('Typy zadań'),
          p('Ikona w lewym górnym rogu określa wykonawcę zadania. Ikona jest opcjonalna.'),
          lines([
            ['task:user a "Wypełnij formularz" 0', 'bpmn', 'Zadanie użytkownika', 'wykonuje człowiek przy użyciu systemu', 'wyszukaj <i>user task</i>'],
            ['task:manual a "Odbierz książkę z półki" 0', 'bpmn', 'Zadanie ręczne', 'wykonuje człowiek bez systemu', 'wyszukaj <i>manual task</i>'],
            ['task:service a "Nalicz karę" 0', 'bpmn', 'Zadanie usługi', 'wykonuje system automatycznie', 'wyszukaj <i>service task</i>'],
            ['task:send a "Wyślij potwierdzenie" 0', 'bpmn', 'Zadanie wysłania', 'wysłanie wiadomości do innego basenu', 'wyszukaj <i>send task</i>'],
            ['task:receive a "Odbierz zgłoszenie" 0', 'bpmn', 'Zadanie odbioru', 'odbiór wiadomości z innego basenu', 'wyszukaj <i>receive task</i>'],
            ['sub a "Obsłuż płatność" 0', 'bpmn', 'Podproces', 'zadanie złożone, rozpisane na osobnym diagramie', 'zadanie z kwadratem i + na dole'],
          ]),
          p('Zadanie użytkownika odpowiada interakcji człowieka z interfejsem systemu (ekran, formularz).'),
          shape({ name: 'Dane', src: `task:user a "Wypełnij zgłoszenie" 0
data d "Zgłoszenie" 1 1
task:user b "Rozpatrz zgłoszenie" 2
store k "Katalog" 3 1
a -> b
a ..> d
d ..> b
b ..> k`,
            means: '<b>Obiekt danych</b> (kartka z zagiętym rogiem): dokument albo informacja używana w procesie. <b>Magazyn danych</b> (walec): trwałe miejsce przechowywania danych, np. baza katalogu.',
            rules: ['Połączenie z zadaniem: linia kropkowana; grot wskazuje kierunek (odczyt albo zapis).', 'Elementy opcjonalne.'],
            drawio: '<i>data object</i>, <i>data store</i>, <i>Association</i>.' }),
        ],
      },
      {
        id: 'bp-mistakes', title: 'Typowe błędy',
        blocks: [
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
s -> b`, 'Między basenami dozwolony jest wyłącznie przepływ komunikatów. Proces odbiorcy zaczyna się zdarzeniem początkowym komunikatu.'),
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
g -> c : nie`, 'Sprawdzenie jest zadaniem. Bramka wybiera ścieżkę na podstawie jego wyniku; podpis bramki: pytanie.'),
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
j -> e`, 'XOR uruchamia jedną ścieżkę, AND czeka na obie. Proces się nie kończy.'),
          pair('Brak zdarzeń', `task a "Wyszukaj książkę" 0
task b "Wypożycz książkę" 1
a -> b`, `start s "Potrzebna książka" 0
task a "Wyszukaj książkę" 1
task b "Wypożycz książkę" 2
end e "Książka wypożyczona" 3
s -> a
a -> b
b -> e`, 'Brak informacji o tym, co uruchamia proces i jakim wynikiem się kończy.'),
          pair('Osobne baseny dla ról jednej organizacji', `pool A "Bibliotekarz"
task a "Przyjmij zwrot" 0
pool S "System biblioteczny"
task:service b "Zaktualizuj konto" 1
a ~> b`, `pool B "Biblioteka"
lane "Bibliotekarz"
task a "Przyjmij zwrot" 0
lane "System"
task:service b "Zaktualizuj konto" 1
a -> b`, 'Role jednej organizacji należą do jednego procesu: tory jednego basenu, połączone przepływem sekwencji.'),
        ],
      },
      {
        id: 'bp-cheatsheet', title: 'Zestawienie symboli',
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
          h('Reguły poprawności'),
          list([
            'Każdy proces (każdy basen, który nie jest czarną skrzynką) ma zdarzenie początkowe i co najmniej jedno końcowe.',
            'Przepływ sekwencji nie przechodzi między basenami. Przepływ komunikatów zawsze między nie przechodzi.',
            'Nazwy zadań: czasownik z dopełnieniem. Nazwy zdarzeń: stan albo fakt.',
            'Bramka XOR: podpis w formie pytania, linie wychodzące podpisane odpowiedziami.',
            'Bramka scalająca tego samego rodzaju co rozdzielająca.',
          ]),
        ],
      },
      {
        id: 'bp-practice', title: 'Ćwiczenie i zadania',
        blocks: [
          task({ title: 'Ćwiczenie: zakup biletu w kinie online', html: 'Kino online z ćwiczenia do diagramu przypadków użycia. Widz wybiera seans i miejsca, podaje dane karty i zatwierdza zakup. Kino obciąża kartę przez zewnętrznego operatora płatności (proces operatora nieznany). Płatność udana: kino wysyła bilet e-mailem. Płatność nieudana: kino zwalnia zablokowane miejsca i wysyła widzowi informację o błędzie. Widz oczekuje na odpowiedź kina.',
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
          task({ title: 'Zadanie domowe 3: proces rezerwacji sali', html: 'Proces jednej rezerwacji w systemie rezerwacji sal z zadania domowego 1. Użytkownik (student albo pracownik) loguje się przez CAS, wyszukuje wolną salę i wysyła prośbę o rezerwację. System zapisuje prośbę i powiadamia administratora. Administrator zatwierdza albo odrzuca prośbę. Jeśli nie zrobi tego w ciągu 2 dni roboczych, system automatycznie ją odrzuca. W każdym przypadku użytkownik otrzymuje e-mail z wynikiem.<br><br>Forma: plik <b>.drawio</b> i eksport <b>PNG</b>.',
            check: ['Basen użytkownika, basen uczelni z torami System i Administrator, CAS jako czarna skrzynka', 'Termin 2 dni jako zdarzenie brzegowe z zegarem na zadaniu administratora', 'Bramka XOR z pytaniem i podpisanymi wyjściami', 'Między basenami tylko przepływy komunikatów', 'Typy zadań: użytkownika, usługi, wysłania'] }),
          task({ title: 'Zadanie domowe 4: z diagramu czynności do BPMN', html: 'Czynność z wybranej strony, modelowana wcześniej diagramem czynności, przedstawiona w BPMN. Użytkownik i strona: osobne baseny. Systemy zewnętrzne (płatności, poczta, logowanie przez Google): czarne skrzynki. Pod diagramem trzy zdania: co pokazuje BPMN, czego nie pokazywał diagram czynności, w którym miejscu procesu użytkownik czeka najdłużej.<br><br>Forma: plik <b>.drawio</b>, eksport <b>PNG</b>, wyjściowy diagram czynności.',
            check: ['Każdy krok z diagramu czynności ma odpowiednik w BPMN albo uzasadnienie, dlaczego go nie ma', 'Komunikaty między użytkownikiem a stroną jako przepływy komunikatów', 'Zadania użytkownika zaznaczone ikoną', 'Oczekiwanie (na e-mail, na zatwierdzenie) pokazane zdarzeniem'] }),
        ],
      },
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { COURSE };
