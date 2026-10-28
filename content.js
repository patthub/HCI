// Course content. Each lesson is a list of blocks rendered by index.html.
// Diagrams are written in a PlantUML subset (see uml.js) and drawn as SVG; students never see this source.
// A lesson counts as done when all its quizzes are answered correctly (lessons without quizzes: when opened).
const p = html => ({ t: 'p', html });
const h = text => ({ t: 'h', text });
const fig = (src, caption, kind) => ({ t: 'fig', src, caption, kind });
const shape = o => ({ t: 'shape', ...o }); // { name, src, kind?, means, rules: [], drawio }
const note = html => ({ t: 'note', html });
const list = items => ({ t: 'list', items });
const table = (head, rows) => ({ t: 'table', head, rows });
const quiz = (q, options, answer, explain, src) => ({ t: 'quiz', q, options, answer, explain, src });
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
          p('UML ma kilkanaście rodzajów diagramów. Zaczynamy od dwóch najczęściej używanych: <b>diagramu przypadków użycia</b> (kto korzysta z systemu i po co) i <b>diagramu klas</b> (jakie informacje system przechowuje i jak są powiązane).'),
          h('Rysujemy w draw.io'),
          p('Otwórz <a href="https://app.diagrams.net" target="_blank" rel="noopener">app.diagrams.net</a>. Logowanie nie jest potrzebne. Plik zapisujesz przez <b>Plik → Zapisz jako</b> (format .drawio), obraz przez <b>Plik → Eksportuj jako → PNG</b>.'),
          list([
            '<b>Kształty UML</b> są w panelu po lewej, w grupie <i>UML</i>. Jeśli jej nie ma, kliknij <b>+ Więcej kształtów</b> na dole panelu i zaznacz UML.',
            '<b>Najszybciej</b> jest wpisać nazwę w polu wyszukiwania nad kształtami: <i>actor</i>, <i>use case</i>, <i>class</i>, <i>interface</i>.',
            '<b>Linię</b> rysujesz, przeciągając niebieską strzałkę, która pojawia się po najechaniu na kształt.',
            '<b>Wygląd linii</b> zmieniasz w panelu <b>Format</b> po prawej (Ctrl+Shift+P, gdy jest ukryty): wzór (ciągła albo przerywana) oraz zakończenia na obu końcach (grot, trójkąt, romb, pełne albo puste).',
          ]),
          note('W UML zakończenie linii zmienia znaczenie. Pusty trójkąt znaczy co innego niż otwarty grot, a linia przerywana co innego niż ciągła. Domyślna strzałka draw.io (pełny grot) nie występuje w żadnej z relacji, które poznamy, więc zawsze ją zmieniaj.'),
          p('Lekcje kończą się pytaniami kontrolnymi. Lekcja jest zaliczona, gdy odpowiesz poprawnie na wszystkie. Każdy moduł kończy się ćwiczeniem z przykładowym rozwiązaniem i zadaniem domowym.'),
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
          h('Sprawdź się'),
          quiz('Co można odczytać z diagramu przypadków użycia?', ['W jakiej kolejności czytelnik klika przyciski', 'Jakie cele mogą osiągnąć poszczególni użytkownicy systemu', 'W jakiej bazie danych zapisywane są wypożyczenia', 'Ile dni trwa wypożyczenie'], 1, 'Diagram pokazuje kto i po co. Kolejność kroków opisuje się w scenariuszu przypadku użycia albo na diagramie aktywności.'),
          quiz('Kiedy zwykle rysuje się diagram przypadków użycia?', ['Po napisaniu kodu, do dokumentacji', 'Na początku projektu, przy ustalaniu wymagań', 'Tylko w projektach aplikacji mobilnych'], 1, 'Służy do uzgodnienia zakresu systemu, zanim zacznie się go projektować.'),
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
          h('Sprawdź się'),
          quiz('Który z tych elementów może być aktorem w systemie bibliotecznym?', ['Formularz logowania', 'Baza danych katalogu, która jest częścią systemu', 'Krajowy katalog NUKAT, z którego system pobiera opisy książek', 'Przycisk Wypożycz'], 2, 'Aktor jest poza systemem. Zewnętrzny katalog to inny system, z którym nasz się komunikuje. Formularz, przycisk i własna baza danych są częściami naszego systemu.'),
          quiz('Która nazwa przypadku użycia jest poprawna?', ['Ekran wypożyczeń', 'Wypożycz książkę', 'Książka', 'Kliknij Wypożycz'], 1, 'Cel aktora, czasownik z dopełnieniem.'),
          quiz('Pani Anna pracuje w bibliotece i sama też wypożycza książki. Jak to pokazać?', ['Aktor Anna połączony ze wszystkimi przypadkami użycia', 'Dwóch aktorów, Bibliotekarz i Czytelnik; Anna gra obie role', 'Jeden aktor Bibliotekarz-Czytelnik'], 1, 'Aktor to rola. Na diagramie nie ma konkretnych osób.'),
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
          h('Sprawdź się'),
          quiz('Przy wyszukiwaniu czytelnik może, ale nie musi, zawęzić wyniki filtrami. Jak połączyć <i>Filtruj wyniki</i> i <i>Wyszukaj książkę</i>?', ['«include» od Wyszukaj do Filtruj', '«extend» od Filtruj do Wyszukaj', '«extend» od Wyszukaj do Filtruj', 'Generalizacją'], 1, 'Może, ale nie musi: extend. Grot wskazuje przypadek bazowy, czyli Wyszukaj książkę.'),
          quiz('Co jest nie tak na tym diagramie?', ['Nic, to poprawny include', 'Strzałka jest odwrócona: mówi, że logowanie zawsze obejmuje wypożyczenie', 'Powinno być extend'], 1, 'Grot include wskazuje przypadek włączany. Poprawnie: od Wypożycz książkę do Zaloguj się.', '(Zaloguj się) ..> (Wypożycz książkę) : <<include>>'),
          quiz('Pusty trójkąt od Bibliotekarza do Czytelnika oznacza, że:', ['bibliotekarz obsługuje czytelnika', 'bibliotekarz może wszystko, co czytelnik', 'czytelnik może wszystko, co bibliotekarz'], 1, 'Trójkąt wskazuje aktora ogólnego. Bibliotekarz jest szczególnym rodzajem czytelnika.', 'Bibliotekarz --|> Czytelnik'),
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
          h('Sprawdź się'),
          quiz('Ile błędów jest na tym diagramie?', ['0', '1', '2', '3'], 2, 'Dwa: <i>Formularz rejestracji</i> jest częścią systemu, a nie aktorem, a <i>Książka</i> to rzeczownik, a nie cel.', `actor "Formularz rejestracji" as F
actor Czytelnik
rectangle "System biblioteczny" {
  (Książka)
  (Wypożycz książkę)
}
Czytelnik -- (Książka)
Czytelnik -- (Wypożycz książkę)
(Wypożycz książkę) -- F`),
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
          h('Sprawdź się'),
          quiz('Co oznacza zapis <code>- tytul : String</code>?', ['Publiczną operację tytul', 'Prywatny atrybut tytul typu String', 'Że tytuł jest opcjonalny'], 1),
          quiz('Która nazwa klasy jest poprawna?', ['Ksiazki', 'ksiazka', 'Ksiazka', 'ZapiszKsiazke'], 2, 'Rzeczownik, liczba pojedyncza, wielka litera. ZapiszKsiazke to raczej nazwa operacji.'),
          quiz('Który wiersz to operacja?', ['+ rokWydania : int', '+ czyDostepna() : boolean', '# isbn : String'], 1, 'Operację poznasz po nawiasach.'),
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
          h('Sprawdź się'),
          quiz('Co mówi ten diagram?', ['Każdy autor napisał dokładnie jedną książkę', 'Książka ma co najmniej jednego autora, a autor co najmniej jedną książkę', 'Książka może nie mieć autora'], 1, null, 'Autor "1..*" -- "1..*" Ksiazka'),
          quiz('Czytelnik ma co najwyżej jedną kartę biblioteczną. Jaka liczność stoi przy klasie KartaBiblioteczna?', ['1', '0..1', '*', '1..*'], 1),
          quiz('Czy czytelnik bez żadnego wypożyczenia jest zgodny z tym diagramem?', ['Tak, bo * obejmuje zero', 'Nie, każdy czytelnik musi mieć wypożyczenie'], 0, null, 'Czytelnik "1" -- "*" Wypozyczenie'),
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
          h('Sprawdź się'),
          quiz('Co jest nie tak?', ['Nic', 'Romb stoi przy pokoju, więc diagram mówi, że budynek jest częścią pokoju', 'Powinna być agregacja'], 1, null, 'Pokoj *-- Budynek'),
          quiz('Kurs na platformie składa się z modułów. Moduł nie istnieje poza kursem. Jak to narysować?', ['Zwykła asocjacja', 'Agregacja, romb przy module', 'Kompozycja, romb przy kursie', 'Kompozycja, romb przy module'], 2),
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
          h('Sprawdź się'),
          quiz('Linia przerywana z pustym trójkątem to:', ['generalizacja', 'realizacja interfejsu', 'zależność', 'kompozycja'], 1),
          quiz('Która para nadaje się na generalizację?', ['Samochod – Kolo', 'Pracownik – Osoba', 'Zamowienie – Klient', 'Biblioteka – Ksiazka'], 1, 'Pracownik jest rodzajem osoby. Koło jest częścią samochodu, a klient i zamówienie są tylko powiązane.'),
          quiz('Czy można utworzyć obiekt klasy abstrakcyjnej?', ['Tak', 'Nie, tylko obiekty jej podklas'], 1),
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
];

if (typeof module !== 'undefined') module.exports = { COURSE };
