export interface ManualSection {
  id: string;
  code: string;
  title: string;
  summary: string;
  formula: string;
  keyRules: string[];
  commonAiTraps: string[];
  sourceNote: string;
}

export const PYTHAGORAS_MANUAL: ManualSection[] = [
  {
    id: 'sec-enunciato',
    code: 'Sezione 01',
    title: 'Enunciato & Condizione Fondamentale',
    summary:
      'In ogni triangolo rettangolo, l’area del quadrato costruito sull’ipotenusa è uguale alla somma delle aree dei quadrati costruiti sui due cateti.',
    formula: 'a² + b² = c²  (solo se c’è un angolo di 90°)',
    keyRules: [
      'Il teorema vale ESCLUSIVAMENTE per i triangoli rettangoli (un angolo retto = 90°).',
      'I cateti (a, b) sono i due lati perpendicolari che formano l’angolo retto.',
      'L’ipotenusa (c) è il lato opposto all’angolo retto ed è SEMPRE il lato più lungo.',
      'La via retta (ipotenusa c) è sempre più corta del giro sui due cateti (c < a + b).',
    ],
    commonAiTraps: [
      'L’IA spesso dimentica che serve un angolo di 90° e applica Pitagora a tutti i triangoli.',
      'L’IA a volte scambia l’ipotenusa con il lato più corto o somma a + b direttamente.',
    ],
    sourceNote: 'Fonte verificata: Euclide, Elementi (Libro I, Proposizione 47) · Geometria Piana Scuola Secondaria.',
  },
  {
    id: 'sec-formula',
    code: 'Sezione 02',
    title: 'Formula Diretta: Trovare l’Ipotenusa',
    summary:
      'Quando conosci entrambi i cateti (a e b), elevi ciascuno al quadrato, li sommi e infine estrai la radice quadrata per tornare da un’area a una lunghezza.',
    formula: 'c = √(a² + b²)',
    keyRules: [
      'Passo 1: Calcola a² (a × a) e b² (b × b). Attenzione a non dimenticare nessuno dei due quadrati!',
      'Passo 2: Somma le due aree: Area_c = a² + b².',
      'Passo 3: Estrai la radice quadrata √(Area_c). La radice NON è dividere per 2!',
    ],
    commonAiTraps: [
      'Sommare i lati senza quadrati (es. 6 + 8 = 14 invece di 10).',
      'Dimenticarsi la radice quadrata finale lasciando il risultato in cm² anziché cm.',
    ],
    sourceNote: 'Fonte verificata: Scheda Operativa Formule Dirette · Laboratorio di Matematica.',
  },
  {
    id: 'sec-inverse',
    code: 'Sezione 03',
    title: 'Formule Inverse: Trovare un Cateto',
    summary:
      'Quando conosci già l’ipotenusa (c) e un cateto (a o b), il lato mancante è più piccolo dell’ipotenusa: devi SOTTRARRE dal quadrato dell’ipotenusa.',
    formula: 'a = √(c² - b²)   oppure   b = √(c² - a²)',
    keyRules: [
      'Identifica sempre prima qual è il lato opposto all’angolo retto (es. una scala appoggiata o una diagonale).',
      'Se l’ipotenusa è nota, non usare mai il segno +, altrimenti ottieni un cateto più lungo dell’ipotenusa.',
      'Non sottrarre mai le lunghezze semplici (c - b): sottrai sempre i quadrati (c² - b²) e poi fai la radice.',
    ],
    commonAiTraps: [
      'Usare √(c² + b²) quando si cerca un cateto.',
      'Fare una sottrazione lineare c - b senza elevare al quadrato.',
    ],
    sourceNote: 'Fonte verificata: Proprietà dell’equivalenza dei quadrati · Manuale di Classe 2ª.',
  },
  {
    id: 'sec-terne',
    code: 'Sezione 04',
    title: 'Terne Pitagoriche & Prova dell’Angolo Retto',
    summary:
      'Alcune terne di numeri interi rispettano esattamente a² + b² = c² e permettono controlli velocissimi anche nei cantieri reali.',
    formula: '3-4-5  ·  5-12-13  ·  8-15-17  ·  7-24-25',
    keyRules: [
      'Moltiplicando o dividendo una terna per lo stesso numero ottieni nuove terne valide (es. 3-4-5 × 2 = 6-8-10; × 100 = 300-400-500; 5-12-13 × 2 = 10-24-26).',
      'Verifica inversa: se a² + b² = c², allora l’angolo opposto a c è esattamente di 90°.',
      'Se a² + b² ≠ c², il triangolo non è rettangolo (muri non perpendicolari).',
    ],
    commonAiTraps: [
      'Confermare che un angolo è di 90° anche quando i quadrati non tornano (es. 6, 8, 11).',
      'Dimenticare un esponente ² dentro la radice.',
    ],
    sourceNote: 'Fonte verificata: Tavole delle Terne Pitagoriche Primitive e Derivate.',
  },
  {
    id: 'sec-mappe',
    code: 'Sezione 05',
    title: 'Mappe Urbane & Coordinate',
    summary:
      'Su una mappa a griglia, lo spostamento orizzontale (Δx) e quello verticale (Δy) formano un angolo di 90°: la distanza in linea d’aria è l’ipotenusa!',
    formula: 'Δx = |x₂ - x₁|   ·   Δy = |y₂ - y₁|   ·   d = √(Δx² + Δy²)',
    keyRules: [
      'Se parti da un punto (x₁, y₁) diverso da (0, 0), calcola sempre la differenza Δx e Δy prima di applicare Pitagora.',
      'Controlla sempre la scala della mappa (es. 1 quadretto = 100 metri).',
      'La distanza in linea d’aria è sempre più breve del percorso lungo le vie perpendicolari.',
    ],
    commonAiTraps: [
      'Prendere le coordinate del punto di arrivo senza sottrarre quelle di partenza.',
      'Dimenticare di moltiplicare i quadretti per la scala in metri.',
    ],
    sourceNote: 'Fonte verificata: Geometria Analitica Elementare e Cartografia Urbana.',
  },
  {
    id: 'sec-reali',
    code: 'Sezione 06',
    title: 'Applicazioni Reali: Tetti, Scale, Campi e Schermi',
    summary:
      'Nei problemi quotidiani (rampe, tetti simmetrici, diagonali di campi e TV) il primo passo è individuare dove si nasconde il triangolo rettangolo.',
    formula: 'Diagonale rettangolo = √(base² + altezza²)',
    keyRules: [
      'In un rettangolo (campo sportivo, schermo TV, tablet), base e altezza sono i cateti e la diagonale è l’ipotenusa.',
      'In un tetto simmetrico (triangolo isoscele), l’altezza divide la base ESATTAMENTE A METÀ formando due triangoli rettangoli.',
      'In una scala appoggiata, la scala è sempre l’ipotenusa.',
    ],
    commonAiTraps: [
      'Usare tutta la base di un tetto isoscele invece di metà base.',
      'Scambiare la larghezza di uno schermo TV per la sua ipotenusa.',
    ],
    sourceNote: 'Fonte verificata: Raccolta Problemi di Geometria nella Realtà Quotidiana.',
  },
];
