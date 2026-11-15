import { AchievementBadge, Scenario } from '../types/game';

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'precision_defuser',
    title: 'Artificiere Preciso',
    description: 'Hai disinnescato tutti e 4 i moduli di uno scenario senza perdere vite.',
    criteria: '4/4 moduli con 3 vite intatte',
  },
  {
    id: 'pythagoras_master',
    title: "Maestro dell'Ipotenusa",
    description: 'Hai risolto con successo le sfide teoriche sull’enunciato e le formule inverse.',
    criteria: 'Completa lo scenario Enunciato',
  },
  {
    id: 'urban_navigator',
    title: 'Navigatore Pitagorico',
    description: 'Hai calcolato correttamente le scorciatoie in linea d’aria sulla mappa cittadina.',
    criteria: 'Completa lo scenario Mappa Urbana',
  },
  {
    id: 'team_swap',
    title: 'Coppia Affiatata',
    description: 'Avete completato lo scambio di ruolo tra Round 1 e Round 2 collaborando insieme.',
    criteria: 'Completa il cambio ruolo a 5 minuti',
  },
  {
    id: 'speed_thinker',
    title: 'Mente Rapida',
    description: 'Hai disinnescato tutti e 4 gli errori con più di 2 minuti di anticipo sul timer.',
    criteria: 'Tempo rimasto > 02:00',
  },
];

export const CURATED_SCENARIOS: Scenario[] = [
  {
    id: 'scenario-enunciato',
    title: 'Il Cantiere di Pitagora',
    subtitle: 'Enunciato del teorema, cateti, ipotenusa e formule inverse',
    context: 'enunciato',
    difficulty: 'Base',
    briefingForPlayer1:
      'L’assistente IA ha scritto un riassunto per la verifica di geometria, ma ha inserito 4 errori concettuali o di calcolo. Leggi un modulo alla volta al tuo compagno!',
    briefingForPlayer2:
      'Usa il Manuale Ufficiale e il Laboratorio Geometrico per verificare le affermazioni lette dal Giocatore 1 e disinnescare i 4 errori prima dello scadere dei 5 minuti.',
    diagramConfig: {
      type: 'triangle',
      caption: 'Triangolo rettangolo di riferimento con i quadrati costruiti sui lati',
      sampleA: 6,
      sampleB: 8,
      unit: 'cm',
    },
    modules: [
      {
        id: 'en-mod-1',
        index: 1,
        title: 'Modulo 1 · Quando vale il Teorema',
        aiParagraph:
          'Secondo il mio riassunto, il Teorema di Pitagora è una regola universale fantastica: puoi applicarla esattamente nello stesso modo a tutti i triangoli esistenti, compresi i triangoli acutangoli ed ottusangoli, senza bisogno che abbiano un angolo di 90 gradi.',
        suspiciousSnippets: [
          'il Teorema di Pitagora è una regola universale',
          'a tutti i triangoli esistenti, compresi i triangoli acutangoli ed ottusangoli',
          'senza bisogno che abbiano un angolo di 90 gradi',
        ],
        errorClaimOptions: [
          { id: 'ec-1a', text: 'Afferma che il teorema vale per tutti i triangoli senza angolo retto' },
          { id: 'ec-1b', text: 'Afferma che il teorema è stato inventato in Grecia' },
          { id: 'ec-1c', text: 'Cita i triangoli invece dei quadrati' },
          { id: 'ec-1d', text: 'Parla di geometria piana invece che solida' },
        ],
        correctErrorClaimId: 'ec-1a',
        correctionOptions: [
          {
            id: 'co-1a',
            text: 'Il Teorema di Pitagora vale solo nei triangoli rettangoli, cioè quelli con un angolo retto (90°).',
          },
          {
            id: 'co-1b',
            text: 'Il Teorema di Pitagora vale solo nei triangoli equilateri con tre lati uguali.',
          },
          {
            id: 'co-1c',
            text: 'Il Teorema di Pitagora vale solo quando tutti gli angoli sono maggiori di 90°.',
          },
        ],
        correctCorrectionId: 'co-1a',
        manualRefId: 'sec-enunciato',
        positiveHint:
          'Ottima osservazione! Controlla nella Sezione 1 del Manuale quale condizione sull’angolo è indispensabile affinché esistano cateti e ipotenusa.',
        encouragementOnMiss:
          'Ci sei quasi! Riascolta bene cosa dice il testo sugli angoli del triangolo: il teorema funziona solo con un tipo speciale di triangolo.',
        explanationOnDefuse:
          'Perfetto! Il Teorema di Pitagora si applica esclusivamente ai triangoli rettangoli, perché solo in essi distinguiamo i due cateti perpendicolari e l’ipotenusa.',
        presetLabValues: {
          a: 3,
          b: 4,
          unit: 'cm',
          labelA: 'Cateto a',
          labelB: 'Cateto b',
          labelC: 'Ipotenusa c',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'en-mod-2',
        index: 2,
        title: 'Modulo 2 · Riconoscere i Lati',
        aiParagraph:
          'Per impostare bene la formula, ricorda i nomi dei lati: i due lati che formano l’angolo retto si chiamano cateti, mentre l’ipotenusa è sempre il lato più corto del triangolo rettangolo ed è adiacente all’angolo di 90°.',
        suspiciousSnippets: [
          'i due lati che formano l’angolo retto si chiamano cateti',
          'l’ipotenusa è sempre il lato più corto del triangolo rettangolo',
          'ed è adiacente all’angolo di 90°',
        ],
        errorClaimOptions: [
          { id: 'ec-2a', text: 'Chiama cateti i lati che formano l’angolo retto' },
          { id: 'ec-2b', text: 'Dice che l’ipotenusa è il lato più corto e adiacente all’angolo retto' },
          { id: 'ec-2c', text: 'Dice che il triangolo rettangolo ha tre lati' },
          { id: 'ec-2d', text: 'Indica che l’angolo retto misura 90°' },
        ],
        correctErrorClaimId: 'ec-2b',
        correctionOptions: [
          {
            id: 'co-2a',
            text: 'L’ipotenusa è il lato opposto all’angolo retto ed è sempre il lato più lungo del triangolo.',
          },
          {
            id: 'co-2b',
            text: 'I cateti sono sempre più lunghi dell’ipotenusa.',
          },
          {
            id: 'co-2c',
            text: 'L’ipotenusa tocca sempre l’angolo retto con entrambe le estremità.',
          },
        ],
        correctCorrectionId: 'co-2a',
        manualRefId: 'sec-enunciato',
        positiveHint:
          'Guarda il triangolo nel Laboratorio Geometrico: dove si trova il lato arancione (c) rispetto al quadratino dell’angolo retto?',
        encouragementOnMiss:
          'Buon tentativo! Nel Laboratorio prova a muovere i cursori: noterai che il lato opposto all’angolo di 90° resta sempre il più lungo di tutti.',
        explanationOnDefuse:
          'Esatto! L’ipotenusa sta sempre di fronte all’angolo retto (90°) e la sua lunghezza è sempre maggiore di ciascun cateto.',
        presetLabValues: {
          a: 5,
          b: 12,
          unit: 'cm',
          labelA: 'Cateto a',
          labelB: 'Cateto b',
          labelC: 'Ipotenusa c',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'en-mod-3',
        index: 3,
        title: 'Modulo 3 · Calcolare l’Ipotenusa',
        aiParagraph:
          'Facciamo un esempio numerico veloce: se i due cateti di un triangolo rettangolo misurano 6 cm e 8 cm, per trovare l’ipotenusa basta sommare direttamente le due lunghezze, ottenendo 6 + 8 = 14 cm.',
        suspiciousSnippets: [
          'se i due cateti di un triangolo rettangolo misurano 6 cm e 8 cm',
          'basta sommare direttamente le due lunghezze',
          'ottenendo 6 + 8 = 14 cm',
        ],
        errorClaimOptions: [
          { id: 'ec-3a', text: 'Somma direttamente i cateti (6 + 8 = 14) invece di usare i quadrati' },
          { id: 'ec-3b', text: 'Usa i centimetri come unità di misura' },
          { id: 'ec-3c', text: 'Assegna due cateti diversi (6 cm e 8 cm)' },
          { id: 'ec-3d', text: 'Calcola l’ipotenusa conoscendo i cateti' },
        ],
        correctErrorClaimId: 'ec-3a',
        correctionOptions: [
          {
            id: 'co-3a',
            text: 'Si sommano i quadrati dei cateti (6² + 8² = 36 + 64 = 100) e poi si estrae la radice: √100 = 10 cm.',
          },
          {
            id: 'co-3b',
            text: 'Si moltiplicano i cateti tra loro: 6 × 8 = 48 cm.',
          },
          {
            id: 'co-3c',
            text: 'Si sommano i quadrati senza radice finale: l’ipotenusa misura 100 cm.',
          },
        ],
        correctCorrectionId: 'co-3a',
        manualRefId: 'sec-formula',
        positiveHint:
          'Carica 6 e 8 nel Laboratorio Geometrico! Vedrai che 6² = 36 e 8² = 64 formano un quadrato di area 100.',
        encouragementOnMiss:
          'Attenzione: Pitagora riguarda le aree dei quadrati costruiti sui lati! Non si sommano le lunghezze semplici, ma i loro quadrati prima della radice.',
        explanationOnDefuse:
          'Bravissimo! 6² + 8² = 36 + 64 = 100, e la radice quadrata di 100 è 10 cm (la famosa terna 6-8-10, doppia della 3-4-5).',
        presetLabValues: {
          a: 6,
          b: 8,
          unit: 'cm',
          labelA: 'Cateto 1',
          labelB: 'Cateto 2',
          labelC: 'Ipotenusa',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'en-mod-4',
        index: 4,
        title: 'Modulo 4 · La Formula Inversa',
        aiParagraph:
          'E se conosciamo già l’ipotenusa (13 cm) e un cateto (5 cm)? Nessun problema: per trovare il cateto mancante si usa comunque la somma, calcolando √(13² + 5²), perché in Pitagora si somma sempre!',
        suspiciousSnippets: [
          'conosciamo già l’ipotenusa (13 cm) e un cateto (5 cm)',
          'per trovare il cateto mancante si usa comunque la somma',
          'calcolando √(13² + 5²)',
        ],
        errorClaimOptions: [
          { id: 'ec-4a', text: 'Somma i quadrati (13² + 5²) anche per trovare un cateto' },
          { id: 'ec-4b', text: 'Usa 13 cm come ipotenusa' },
          { id: 'ec-4c', text: 'Usa la radice quadrata alla fine del calcolo' },
          { id: 'ec-4d', text: 'Cerca il cateto mancante partendo da ipotenusa e cateto' },
        ],
        correctErrorClaimId: 'ec-4a',
        correctionOptions: [
          {
            id: 'co-4a',
            text: 'Per trovare un cateto si sottrae: √(13² - 5²) = √(169 - 25) = √144 = 12 cm.',
          },
          {
            id: 'co-4b',
            text: 'Si divide l’ipotenusa per il cateto: 13 / 5 = 2,6 cm.',
          },
          {
            id: 'co-4c',
            text: 'Si sottraggono i lati senza quadrati: 13 - 5 = 8 cm.',
          },
        ],
        correctCorrectionId: 'co-4a',
        manualRefId: 'sec-inverse',
        positiveHint:
          'Ricorda: l’ipotenusa è il quadrato più grande (c² = a² + b²). Se vuoi trovare uno dei due pezzi più piccoli (a²), devi fare una sottrazione!',
        encouragementOnMiss:
          'Quasi! Se sommassi 13² + 5², otterresti un cateto più lungo dell’ipotenusa, e questo è impossibile.',
        explanationOnDefuse:
          'Colpito e disinnescato! Con la formula inversa a = √(c² - b²) otteniamo √(169 - 25) = √144 = 12 cm.',
        presetLabValues: {
          a: 5,
          b: 12,
          unit: 'cm',
          labelA: 'Cateto noto',
          labelB: 'Cateto cercato',
          labelC: 'Ipotenusa',
          mode: 'leg',
        },
      },
    ],
  },
  {
    id: 'scenario-mappa',
    title: 'Scorciatoia in Città',
    subtitle: 'Calcolare distanze reali e percorsi diagonali su una mappa urbana',
    context: 'mappa',
    difficulty: 'Intermedio',
    briefingForPlayer1:
      'Una app di navigazione IA ha calcolato i percorsi tra Scuola, Parco, Biblioteca e Stazione, commettendo 4 errori geometrici. Leggi il bollettino al tuo compagno!',
    briefingForPlayer2:
      'Usa il Manuale e la Mappa Urbana Interattiva per misurare le vere distanze in linea d’aria e correggere i 4 bug del navigatore IA.',
    diagramConfig: {
      type: 'city_map',
      caption: 'Mappa cittadina a griglia ortogonale con sentiero diagonale nel parco',
      sampleA: 300,
      sampleB: 400,
      unit: 'm',
    },
    modules: [
      {
        id: 'mp-mod-1',
        index: 1,
        title: 'Modulo 1 · Da Scuola a Biblioteca',
        aiParagraph:
          'Per andare dalla Scuola alla Biblioteca passando lungo i marciapiedi bisogna camminare 300 m verso Est e poi 400 m verso Nord. Se invece tagliamo in linea d’aria attraversando la piazza diagonale, percorreremo esattamente la stessa distanza: 700 m.',
        suspiciousSnippets: [
          '300 m verso Est e poi 400 m verso Nord',
          'tagliamo in linea d’aria attraversando la piazza diagonale',
          'percorreremo esattamente la stessa distanza: 700 m',
        ],
        errorClaimOptions: [
          { id: 'ec-m1a', text: 'Sostiene che la diagonale in linea d’aria è lunga 700 m come i due marciapiedi' },
          { id: 'ec-m1b', text: 'Indica 300 m verso Est e 400 m verso Nord' },
          { id: 'ec-m1c', text: 'Collega la Scuola alla Biblioteca' },
          { id: 'ec-m1d', text: 'Usa i metri per le distanze urbane' },
        ],
        correctErrorClaimId: 'ec-m1a',
        correctionOptions: [
          {
            id: 'co-m1a',
            text: 'La diagonale è l’ipotenusa: √(300² + 400²) = √250000 = 500 m (si risparmiano 200 m!).',
          },
          {
            id: 'co-m1b',
            text: 'La diagonale misura √(400² - 300²) = 100 m.',
          },
          {
            id: 'co-m1c',
            text: 'La diagonale è più lunga dei marciapiedi e misura 800 m.',
          },
        ],
        correctCorrectionId: 'co-m1a',
        manualRefId: 'sec-mappe',
        positiveHint:
          'Prova sulla Mappa Interattiva a impostare Δx = 3 unità (300 m) e Δy = 4 unità (400 m): ricorda la terna 3-4-5 moltiplicata per 100!',
        encouragementOnMiss:
          'Pensa a quando attraversi un parco in diagonale: fai meno strada rispetto a girare intorno all’angolo! Controlla con 300² + 400².',
        explanationOnDefuse:
          'Ottimo! I due tratti lungo le strade formano un angolo di 90°. La scorciatoia in linea d’aria è l’ipotenusa: √(300² + 400²) = 500 m, risparmiando ben 200 m.',
        presetLabValues: {
          a: 3,
          b: 4,
          unit: '×100 m',
          labelA: 'Tratto Est',
          labelB: 'Tratto Nord',
          labelC: 'Linea d’aria',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'mp-mod-2',
        index: 2,
        title: 'Modulo 2 · Il Sentiero nel Parco',
        aiParagraph:
          'Il sentiero diagonale che attraversa il Parco Centrale misura 130 m. Sappiamo che il lato Sud del parco è lungo 50 m. Per trovare la lunghezza del lato Est del parco ho calcolato √(130² + 50²) ≈ 139,3 m.',
        suspiciousSnippets: [
          'Il sentiero diagonale che attraversa il Parco Centrale misura 130 m',
          'il lato Sud del parco è lungo 50 m',
          'ho calcolato √(130² + 50²) ≈ 139,3 m',
        ],
        errorClaimOptions: [
          { id: 'ec-m2a', text: 'Somma i quadrati anche se 130 m è già la diagonale (ipotenusa)' },
          { id: 'ec-m2b', text: 'Misura il sentiero del parco in metri' },
          { id: 'ec-m2c', text: 'Dice che il parco ha un lato Sud e un lato Est' },
          { id: 'ec-m2d', text: 'Estrae la radice quadrata alla fine' },
        ],
        correctErrorClaimId: 'ec-m2a',
        correctionOptions: [
          {
            id: 'co-m2a',
            text: 'Il sentiero diagonale è l’ipotenusa, quindi il lato Est è un cateto: √(130² - 50²) = √14400 = 120 m.',
          },
          {
            id: 'co-m2b',
            text: 'Il lato Est misura semplicemente 130 - 50 = 80 m.',
          },
          {
            id: 'co-m2c',
            text: 'Il lato Est deve essere più lungo della diagonale: 180 m.',
          },
        ],
        correctCorrectionId: 'co-m2a',
        manualRefId: 'sec-inverse',
        positiveHint:
          'Fai attenzione a quale lato è noto! Il sentiero diagonale è l’ipotenusa (130 m). Qui riconosciamo la terna 5-12-13 moltiplicata per 10!',
        encouragementOnMiss:
          'Quasi! Un lato rettilineo del parco non può essere più lungo della sua diagonale (139,3 > 130). Prova la formula inversa con la sottrazione.',
        explanationOnDefuse:
          'Esatto! Usiamo la formula inversa: √(130² - 50²) = √(16900 - 2500) = √14400 = 120 m.',
        presetLabValues: {
          a: 5,
          b: 12,
          unit: '×10 m',
          labelA: 'Lato Sud',
          labelB: 'Lato Est',
          labelC: 'Sentiero diagonale',
          mode: 'leg',
        },
      },
      {
        id: 'mp-mod-3',
        index: 3,
        title: 'Modulo 3 · Coordinate sulla Griglia',
        aiParagraph:
          'Sulla griglia della mappa (1 quadretto = 100 m), la Piazza si trova alle coordinate (2, 1) e la Stazione si trova in (10, 7). Quindi gli spostamenti sui due assi sono uguali alle coordinate della Stazione: 10 quadretti in orizzontale e 7 in verticale.',
        suspiciousSnippets: [
          'la Piazza si trova alle coordinate (2, 1) e la Stazione si trova in (10, 7)',
          'gli spostamenti sui due assi sono uguali alle coordinate della Stazione',
          '10 quadretti in orizzontale e 7 in verticale',
        ],
        errorClaimOptions: [
          { id: 'ec-m3a', text: 'Usa le coordinate di arrivo (10 e 7) invece della differenza tra i due punti' },
          { id: 'ec-m3b', text: 'Imposta una scala dove 1 quadretto vale 100 m' },
          { id: 'ec-m3c', text: 'Posiziona la Piazza in (2, 1)' },
          { id: 'ec-m3d', text: 'Divide il piano in asse orizzontale e verticale' },
        ],
        correctErrorClaimId: 'ec-m3a',
        correctionOptions: [
          {
            id: 'co-m3a',
            text: 'Bisogna sottrarre le coordinate: Δx = 10 - 2 = 8 e Δy = 7 - 1 = 6; la distanza è √(8² + 6²) = 10 quadretti (1000 m).',
          },
          {
            id: 'co-m3b',
            text: 'Bisogna sommare le coordinate: 10 + 2 = 12 e 7 + 1 = 8.',
          },
          {
            id: 'co-m3c',
            text: 'La distanza tra due punti su griglia si misura sempre partendo da (0, 0).',
          },
        ],
        correctCorrectionId: 'co-m3a',
        manualRefId: 'sec-mappe',
        positiveHint:
          'Controlla la Mappa Interattiva! Se parti dal punto x=2 e arrivi a x=10, quanti passi orizzontali hai fatto davvero?',
        encouragementOnMiss:
          'Ricorda: la Piazza non è all’origine (0, 0), ma parte da (2, 1)! Calcola la differenza Δx e Δy prima di applicare Pitagora.',
        explanationOnDefuse:
          'Grande lavoro! Δx = 10 - 2 = 8 e Δy = 7 - 1 = 6. Con la terna 6-8-10 otteniamo 10 quadretti, cioè 1000 metri in linea d’aria.',
        presetLabValues: {
          a: 8,
          b: 6,
          unit: 'quadretti',
          labelA: 'Δx (10 - 2)',
          labelB: 'Δy (7 - 1)',
          labelC: 'Distanza',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'mp-mod-4',
        index: 4,
        title: 'Modulo 4 · Il Paradosso della Scorciatoia',
        aiParagraph:
          'Attenzione studenti! Siccome nel Teorema di Pitagora eleviamo i numeri al quadrato, la strada diagonale (ipotenusa) risulta sempre più lunga della somma delle due strade perpendicolari (cateto + cateto). Quindi conviene fare il giro largo!',
        suspiciousSnippets: [
          'Siccome nel Teorema di Pitagora eleviamo i numeri al quadrato',
          'la strada diagonale (ipotenusa) risulta sempre più lunga della somma',
          'Quindi conviene fare il giro largo!',
        ],
        errorClaimOptions: [
          { id: 'ec-m4a', text: 'Afferma che l’ipotenusa è più lunga della somma dei due cateti' },
          { id: 'ec-m4b', text: 'Ricorda che nella formula si elevano i cateti al quadrato' },
          { id: 'ec-m4c', text: 'Confronta il percorso diagonale con le strade perpendicolari' },
          { id: 'ec-m4d', text: 'Usa i termini ipotenusa e cateto' },
        ],
        correctErrorClaimId: 'ec-m4a',
        correctionOptions: [
          {
            id: 'co-m4a',
            text: 'La radice quadrata finale riporta alla lunghezza lineare: l’ipotenusa è sempre più corta della somma dei due cateti (c < a + b).',
          },
          {
            id: 'co-m4b',
            text: 'La diagonale è uguale alla somma dei cateti solo nei parchi quadrati.',
          },
          {
            id: 'co-m4c',
            text: 'Non si deve mai fare la radice quadrata quando si calcola una strada.',
          },
        ],
        correctCorrectionId: 'co-m4a',
        manualRefId: 'sec-enunciato',
        positiveHint:
          'Pensa al percorso minimo tra due punti: la linea retta è sempre più breve! Verificalo anche con 3 + 4 = 7 rispetto a c = 5.',
        encouragementOnMiss:
          'Verifica con numeri semplici: 3 + 4 fa 7, mentre l’ipotenusa è 5. Chi è più corto?',
        explanationOnDefuse:
          'Bravissimi! Per la disuguaglianza triangolare, in ogni triangolo un lato è sempre minore della somma degli altri due: la linea retta è sempre la via più breve.',
        presetLabValues: {
          a: 3,
          b: 4,
          unit: 'km',
          labelA: 'Via Est',
          labelB: 'Via Nord',
          labelC: 'Scorciatoia',
          mode: 'hypotenuse',
        },
      },
    ],
  },
  {
    id: 'scenario-architettura',
    title: 'Architetti a Scuola',
    subtitle: 'Scale appoggiate, rampe accessibili, tetti e verifica degli angoli retti',
    context: 'architettura',
    difficulty: 'Intermedio',
    briefingForPlayer1:
      'Un tecnico IA ha redatto la scheda di sicurezza per i lavori nel cortile della scuola, ma ci sono 4 errori di calcolo molto pericolosi! Leggi attentamente ogni modulo.',
    briefingForPlayer2:
      'Verifica i calcoli di scala, rampa, tetto e squadratura usando il Manuale e il Laboratorio Geometrico.',
    diagramConfig: {
      type: 'ladder_ramp',
      caption: 'Scala appoggiata alla parete in mattoni e rampa di accesso laterale',
      sampleA: 3,
      sampleB: 4,
      unit: 'm',
    },
    modules: [
      {
        id: 'ar-mod-1',
        index: 1,
        title: 'Modulo 1 · La Scala Appoggiata al Muro',
        aiParagraph:
          'Il custode appoggia una scala lunga 5 m al muro verticale della scuola, tenendo la base della scala a 3 m di distanza dalla parete. Per sapere a che altezza arriva sul muro, basta fare la sottrazione semplice: 5 - 3 = 2 m di altezza.',
        suspiciousSnippets: [
          'appoggia una scala lunga 5 m al muro verticale',
          'tenendo la base della scala a 3 m di distanza dalla parete',
          'basta fare la sottrazione semplice: 5 - 3 = 2 m di altezza',
        ],
        errorClaimOptions: [
          { id: 'ec-a1a', text: 'Sottrae direttamente 5 - 3 = 2 m invece di applicare Pitagora inverso' },
          { id: 'ec-a1b', text: 'Considera il muro verticale e il pavimento perpendicolari' },
          { id: 'ec-a1c', text: 'Usa una scala lunga 5 m' },
          { id: 'ec-a1d', text: 'Posiziona la base a 3 m dal muro' },
        ],
        correctErrorClaimId: 'ec-a1a',
        correctionOptions: [
          {
            id: 'co-a1a',
            text: 'La scala è l’ipotenusa (5 m), quindi l’altezza è h = √(5² - 3²) = √(25 - 9) = √16 = 4 m.',
          },
          {
            id: 'co-a1b',
            text: 'L’altezza è h = √(5² + 3²) = √34 ≈ 5,8 m.',
          },
          {
            id: 'co-a1c',
            text: 'La scala arriva a 5 m perché la distanza dal muro non conta.',
          },
        ],
        correctCorrectionId: 'co-a1a',
        manualRefId: 'sec-inverse',
        positiveHint:
          'La scala inclinata è l’ipotenusa (5 m), mentre pavimento e muro formano l’angolo retto! Usa il Laboratorio con la terna 3-4-5.',
        encouragementOnMiss:
          'Attenzione: non si possono sottrarre direttamente le lunghezze dei lati di un triangolo rettangolo! Devi passare attraverso i loro quadrati.',
        explanationOnDefuse:
          'Perfetto! La scala è l’ipotenusa da 5 m e la distanza a terra è il cateto da 3 m: sul muro raggiunge √(25 - 9) = 4 m.',
        presetLabValues: {
          a: 3,
          b: 4,
          unit: 'm',
          labelA: 'Distanza dal muro',
          labelB: 'Altezza sul muro',
          labelC: 'Lunghezza scala',
          mode: 'leg',
        },
      },
      {
        id: 'ar-mod-2',
        index: 2,
        title: 'Modulo 2 · La Rampa Accessibile',
        aiParagraph:
          'Costruiamo una rampa per superare un gradino alto 90 cm (0,9 m), con una base orizzontale lunga 120 cm (1,2 m). Calcoliamo la lunghezza della rampa inclinata: 90² + 120² = 8100 + 14400 = 22500 cm, cioè una rampa lunga 225 metri!',
        suspiciousSnippets: [
          'gradino alto 90 cm (0,9 m), con una base orizzontale lunga 120 cm',
          '90² + 120² = 8100 + 14400 = 22500 cm',
          'cioè una rampa lunga 225 metri!',
        ],
        errorClaimOptions: [
          { id: 'ec-a2a', text: 'Dimentica di estrarre la radice quadrata da 22500 (che indica l’area del quadrato!)' },
          { id: 'ec-a2b', text: 'Converte 90 cm in 0,9 m' },
          { id: 'ec-a2c', text: 'Eleva 90 e 120 al quadrato' },
          { id: 'ec-a2d', text: 'Tratta la rampa inclinata come ipotenusa' },
        ],
        correctErrorClaimId: 'ec-a2a',
        correctionOptions: [
          {
            id: 'co-a2a',
            text: 'Bisogna fare la radice quadrata: √22500 = 150 cm, cioè 1,5 metri di rampa.',
          },
          {
            id: 'co-a2b',
            text: 'Bisogna dividere 22500 per 2 ottenendo 112,5 metri.',
          },
          {
            id: 'co-a2c',
            text: 'La rampa misura 90 + 120 = 210 metri.',
          },
        ],
        correctCorrectionId: 'co-a2a',
        manualRefId: 'sec-formula',
        positiveHint:
          'Una rampa di 225 metri per salire un gradino di 90 cm ti sembra sensata? Ricorda l’ultimo passaggio fondamentale della formula!',
        encouragementOnMiss:
          '22500 cm² è l’area del quadrato costruito sulla rampa, non la lunghezza della rampa! Cosa manca alla fine?',
        explanationOnDefuse:
          'Esatto! √22500 = 150 cm = 1,5 m (è la terna 3-4-5 moltiplicata per 30 cm!).',
        presetLabValues: {
          a: 9,
          b: 12,
          unit: 'dm',
          labelA: 'Altezza gradino',
          labelB: 'Base rampa',
          labelC: 'Rampa inclinata',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'ar-mod-3',
        index: 3,
        title: 'Modulo 3 · Il Tetto a Capanna',
        aiParagraph:
          'Il tetto simmetrico della palestra è largo in totale 16 m alla base e alto 6 m al centro. Per calcolare la lunghezza di uno spiovente laterale ho applicato Pitagora usando l’intera larghezza di 16 m e l’altezza di 6 m: √(16² + 6²).',
        suspiciousSnippets: [
          'largo in totale 16 m alla base e alto 6 m al centro',
          'applicato Pitagora usando l’intera larghezza di 16 m e l’altezza di 6 m',
          '√(16² + 6²)',
        ],
        errorClaimOptions: [
          { id: 'ec-a3a', text: 'Usa tutta la base (16 m) invece di dividerla a metà (8 m) per formare il triangolo rettangolo' },
          { id: 'ec-a3b', text: 'Usa 6 m come altezza al centro del tetto' },
          { id: 'ec-a3c', text: 'Cerca la lunghezza dello spiovente inclinato' },
          { id: 'ec-a3d', text: 'Usa il simbolo di radice quadrata' },
        ],
        correctErrorClaimId: 'ec-a3a',
        correctionOptions: [
          {
            id: 'co-a3a',
            text: 'L’altezza divide il tetto isoscele in due triangoli rettangoli uguali di base 16 / 2 = 8 m: lo spiovente è √(8² + 6²) = 10 m.',
          },
          {
            id: 'co-a3b',
            text: 'Bisogna raddoppiare anche l’altezza a 12 m.',
          },
          {
            id: 'co-a3c',
            text: 'Il tetto non ha angoli retti quindi Pitagora non si può proprio usare.',
          },
        ],
        correctCorrectionId: 'co-a3a',
        manualRefId: 'sec-reali',
        positiveHint:
          'Disegna mentalmente un tetto simmetrico a triangolo isoscele: l’altezza scende al centro e taglia la base a metà!',
        encouragementOnMiss:
          'Guarda bene: il triangolo rettangolo formato dall’altezza e dallo spiovente usa solo metà della larghezza totale del tetto!',
        explanationOnDefuse:
          'Geniale! Dividendo la base 16 m a metà otteniamo il cateto da 8 m; con l’altezza 6 m abbiamo √(8² + 6²) = √100 = 10 m.',
        presetLabValues: {
          a: 8,
          b: 6,
          unit: 'm',
          labelA: 'Metà base tetto',
          labelB: 'Altezza al colmo',
          labelC: 'Spiovente',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'ar-mod-4',
        index: 4,
        title: 'Modulo 4 · Controllo dell’Angolo Retto',
        aiParagraph:
          'Per verificare se l’angolo tra due muri dell’aula è perfettamente retto (90°), misuro 6 m lungo un muro, 8 m lungo l’altro e la diagonale tra i due segni: ottengo 11 m. Siccome i lati sono grandi, confermo che l’angolo è perfettamente di 90 gradi!',
        suspiciousSnippets: [
          'misuro 6 m lungo un muro, 8 m lungo l’altro e la diagonale tra i due segni: ottengo 11 m',
          'confermo che l’angolo è perfettamente di 90 gradi!',
        ],
        errorClaimOptions: [
          { id: 'ec-a4a', text: 'Dichiara che l’angolo è di 90° anche se 6² + 8² = 100 è diverso da 11² = 121' },
          { id: 'ec-a4b', text: 'Misura tre lati per controllare l’angolo' },
          { id: 'ec-a4c', text: 'Sceglie 6 m e 8 m sui due muri' },
          { id: 'ec-a4d', text: 'Cerca un angolo di 90 gradi' },
        ],
        correctErrorClaimId: 'ec-a4a',
        correctionOptions: [
          {
            id: 'co-a4a',
            text: '6² + 8² = 100 mentre 11² = 121: l’angolo non è retto (è ottuso); per essere 90° la diagonale deve essere √100 = 10 m.',
          },
          {
            id: 'co-a4b',
            text: 'Per avere 90° la diagonale deve essere 6 + 8 = 14 m.',
          },
          {
            id: 'co-a4c',
            text: 'Con 11 m di diagonale l’angolo è retto perché 11 è vicino a 10.',
          },
        ],
        correctCorrectionId: 'co-a4a',
        manualRefId: 'sec-terne',
        positiveHint:
          'I muratori usano il Teorema Inverso di Pitagora! Se a² + b² = c², allora l’angolo è davvero retto. Controlla quanto fa 6² + 8² rispetto a 11².',
        encouragementOnMiss:
          'Controlla i quadrati: 6² + 8² = 36 + 64 = 100. Quanto fa invece 11²? Se non sono uguali, il triangolo non è rettangolo!',
        explanationOnDefuse:
          'Bravissimo! È la regola usata davvero in edilizia: 6² + 8² = 100 = 10², quindi con 11 m i muri sono leggermente fuori squadra!',
        presetLabValues: {
          a: 6,
          b: 8,
          unit: 'm',
          labelA: 'Muro 1',
          labelB: 'Muro 2',
          labelC: 'Diagonale esatta',
          mode: 'hypotenuse',
        },
      },
    ],
  },
  {
    id: 'scenario-sport',
    title: 'Campi Sportivi & Schermi',
    subtitle: 'Diagonali di campi da calcio, basket, schermi TV e reti da volley',
    context: 'sport',
    difficulty: 'Sfida',
    briefingForPlayer1:
      'La redazione sportiva IA ha pubblicato un articolo sulle misure di campi e schermi TV pieno di svarioni matematici. Leggi con attenzione per aiutare il compagno!',
    briefingForPlayer2:
      'Individua i 4 errori tra quadrati dimenticati, cateti scambiati con ipotenuse e radici errate usando Manuale e Laboratorio.',
    diagramConfig: {
      type: 'sports_screen',
      caption: 'Campo sportivo rettangolare e monitor widescreen con diagonali in evidenza',
      sampleA: 80,
      sampleB: 60,
      unit: 'cm',
    },
    modules: [
      {
        id: 'sp-mod-1',
        index: 1,
        title: 'Modulo 1 · Scatto sul Campo da Basket',
        aiParagraph:
          'Una metà del campo da basket è un rettangolo di 15 m per 8 m. Durante l’allenamento i ragazzi corrono lungo la diagonale: l’IA calcola √(15² + 8) = √(225 + 8) = √233 ≈ 15,26 m dimenticando un piccolo dettaglio.',
        suspiciousSnippets: [
          'rettangolo di 15 m per 8 m',
          'l’IA calcola √(15² + 8) = √(225 + 8)',
          '√233 ≈ 15,26 m',
        ],
        errorClaimOptions: [
          { id: 'ec-s1a', text: 'Eleva al quadrato solo il 15 e lascia l’8 senza quadrato (15² + 8)' },
          { id: 'ec-s1b', text: 'Usa la radice quadrata sull’addizione' },
          { id: 'ec-s1c', text: 'Descrive il campo come rettangolo 15 m per 8 m' },
          { id: 'ec-s1d', text: 'Calcola una diagonale in metri' },
        ],
        correctErrorClaimId: 'ec-s1a',
        correctionOptions: [
          {
            id: 'co-s1a',
            text: 'Entrambi i cateti vanno elevati al quadrato: √(15² + 8²) = √(225 + 64) = √289 = 17 m.',
          },
          {
            id: 'co-s1b',
            text: 'Non serve il quadrato su nessuno dei due: √(15 + 8) ≈ 4,8 m.',
          },
          {
            id: 'co-s1c',
            text: 'Bisogna fare 15² - 8² = 161 m.',
          },
        ],
        correctCorrectionId: 'co-s1a',
        manualRefId: 'sec-terne',
        positiveHint:
          'Guarda bene dentro la radice scritta dall’IA: 225 è 15², ma 8 non è stato elevato alla seconda! Prova 8 e 15 nel Laboratorio.',
        encouragementOnMiss:
          'Controlla con attenzione ogni singolo numero nella formula √(15² + 8): manca un esponente ² fondamentale!',
        explanationOnDefuse:
          'Occhio di falco! Elevando entrambi i cateti otteniamo √(225 + 64) = √289 = 17 m (la terna pitagorica 8-15-17).',
        presetLabValues: {
          a: 8,
          b: 15,
          unit: 'm',
          labelA: 'Lato corto',
          labelB: 'Lato lungo',
          labelC: 'Diagonale campo',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'sp-mod-2',
        index: 2,
        title: 'Modulo 2 · La Diagonale della Smart TV',
        aiParagraph:
          'La dimensione commerciale delle TV si misura lungo la diagonale dello schermo rettangolare. Per una TV larga 80 cm e alta 60 cm, ho preso la larghezza di 80 cm come ipotenusa e ho calcolato √(80² - 60²) = √2800 ≈ 52,9 cm.',
        suspiciousSnippets: [
          'TV larga 80 cm e alta 60 cm',
          'ho preso la larghezza di 80 cm come ipotenusa',
          'calcolato √(80² - 60²) ≈ 52,9 cm',
        ],
        errorClaimOptions: [
          { id: 'ec-s2a', text: 'Scambia la larghezza (80 cm, un cateto) per l’ipotenusa e sottrae' },
          { id: 'ec-s2b', text: 'Afferma che le TV si misurano dalla diagonale' },
          { id: 'ec-s2c', text: 'Esprime i lati dello schermo in centimetri' },
          { id: 'ec-s2d', text: 'Usa uno schermo rettangolare 80 × 60 cm' },
        ],
        correctErrorClaimId: 'ec-s2a',
        correctionOptions: [
          {
            id: 'co-s2a',
            text: 'Larghezza (80 cm) e altezza (60 cm) formano l’angolo retto: sono i cateti! La diagonale è √(80² + 60²) = 100 cm.',
          },
          {
            id: 'co-s2b',
            text: 'La diagonale misura sempre quanto la larghezza, quindi 80 cm.',
          },
          {
            id: 'co-s2c',
            text: 'La diagonale misura 80 + 60 = 140 cm.',
          },
        ],
        correctCorrectionId: 'co-s2a',
        manualRefId: 'sec-reali',
        positiveHint:
          'I bordi di una TV rettangolare formano un angolo di 90° agli angoli! Quindi larghezza e altezza sono i due cateti, non l’ipotenusa.',
        encouragementOnMiss:
          'Com’è possibile che la diagonale (52,9 cm) sia più corta del lato largo 80 cm? Riconosci i due cateti sul rettangolo!',
        explanationOnDefuse:
          'Esatto! Con cateti 60 cm e 80 cm, la diagonale è √(3600 + 6400) = √10000 = 100 cm (circa 39,4 pollici).',
        presetLabValues: {
          a: 6,
          b: 8,
          unit: 'dm',
          labelA: 'Altezza TV (60 cm)',
          labelB: 'Larghezza TV (80 cm)',
          labelC: 'Diagonale TV',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'sp-mod-3',
        index: 3,
        title: 'Modulo 3 · Passaggio in Area di Rigore',
        aiParagraph:
          'Un calciatore avanza 24 m lungo la linea laterale e poi passa la palla 10 m verso il centro. Per calcolare il tiro diretto, sommo i quadrati 24² + 10² = 576 + 100 = 676 e poi, invece della radice quadrata, divido a metà: 676 / 2 = 338 m!',
        suspiciousSnippets: [
          'avanza 24 m lungo la linea laterale e poi passa la palla 10 m',
          '576 + 100 = 676',
          'invece della radice quadrata, divido a metà: 676 / 2 = 338 m',
        ],
        errorClaimOptions: [
          { id: 'ec-s3a', text: 'Divide per 2 (676 / 2 = 338 m) invece di fare la radice quadrata √676' },
          { id: 'ec-s3b', text: 'Calcola 24² = 576 e 10² = 100' },
          { id: 'ec-s3c', text: 'Somma 576 + 100 = 676' },
          { id: 'ec-s3d', text: 'Immagina un passaggio ortogonale di 24 m e 10 m' },
        ],
        correctErrorClaimId: 'ec-s3a',
        correctionOptions: [
          {
            id: 'co-s3a',
            text: 'La radice quadrata cerca il numero che moltiplicato per se stesso dà 676: √676 = 26 m (non diviso 2!).',
          },
          {
            id: 'co-s3b',
            text: 'Bisogna dividere 676 per 10, quindi 67,6 m.',
          },
          {
            id: 'co-s3c',
            text: 'Il risultato esatto è 676 m senza nessuna divisione o radice.',
          },
        ],
        correctCorrectionId: 'co-s3a',
        manualRefId: 'sec-formula',
        positiveHint:
          'Un campo da calcio intero è lungo circa 100 m: un passaggio di 338 m uscirebbe fuori dallo stadio! Ricorda la differenza tra ÷ 2 e √.',
        encouragementOnMiss:
          'Ricorda: fare la radice quadrata di un numero non significa mai dividerlo per 2! Che numero moltiplicato per se stesso fa 676?',
        explanationOnDefuse:
          'Perfetto! 26 × 26 = 676, quindi √676 = 26 m (è la terna 5-12-13 raddoppiata: 10-24-26).',
        presetLabValues: {
          a: 10,
          b: 24,
          unit: 'm',
          labelA: 'Passaggio interno',
          labelB: 'Corsa laterale',
          labelC: 'Tiro diretto',
          mode: 'hypotenuse',
        },
      },
      {
        id: 'sp-mod-4',
        index: 4,
        title: 'Modulo 4 · Il Cavo della Rete da Volley',
        aiParagraph:
          'Il palo della rete da pallavolo è alto 2,4 m (24 dm) ed è fissato a terra con un cavo tirante ancorato a 1,0 m (10 dm) dalla base del palo. Il cavo tirante è lungo 2,1 m, cioè più corto del palo stesso!',
        suspiciousSnippets: [
          'palo della rete da pallavolo è alto 2,4 m (24 dm)',
          'ancorato a 1,0 m (10 dm) dalla base del palo',
          'Il cavo tirante è lungo 2,1 m, cioè più corto del palo stesso!',
        ],
        errorClaimOptions: [
          { id: 'ec-s4a', text: 'Indica 2,1 m: l’ipotenusa non può mai essere più corta di un cateto (2,4 m)' },
          { id: 'ec-s4b', text: 'Trasforma 2,4 m in 24 dm e 1,0 m in 10 dm' },
          { id: 'ec-s4c', text: 'Fissa il palo verticalmente rispetto al terreno' },
          { id: 'ec-s4d', text: 'Usa un cavo inclinato fino a terra' },
        ],
        correctErrorClaimId: 'ec-s4a',
        correctionOptions: [
          {
            id: 'co-s4a',
            text: 'Il cavo è l’ipotenusa, quindi supera entrambi i cateti: √(2,4² + 1,0²) = √(5,76 + 1,00) = √6,76 = 2,6 m.',
          },
          {
            id: 'co-s4b',
            text: 'Il cavo deve misurare 2,4 - 1,0 = 1,4 m.',
          },
          {
            id: 'co-s4c',
            text: 'Il cavo misura 2,4 + 1,0 = 3,4 m.',
          },
        ],
        correctCorrectionId: 'co-s4a',
        manualRefId: 'sec-terne',
        positiveHint:
          'Trasforma in decimetri per fare conti facili: 24 dm e 10 dm... è la stessa terna 10-24-26 di prima divisa per 10!',
        encouragementOnMiss:
          'Un cavo che va dalla cima del palo (2,4 m) fino a terra non può essere lungo solo 2,1 m, non toccherebbe neppure il suolo!',
        explanationOnDefuse:
          'Missione compiuta! 24² + 10² = 576 + 100 = 676 dm², quindi √676 = 26 dm = 2,6 m.',
        presetLabValues: {
          a: 10,
          b: 24,
          unit: 'dm',
          labelA: 'Base a terra (1,0 m)',
          labelB: 'Palo (2,4 m)',
          labelC: 'Cavo tirante',
          mode: 'hypotenuse',
        },
      },
    ],
  },
];
