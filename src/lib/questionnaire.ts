// questionnaire.ts
// Alle Fragebögen der Krümelküche-Studie
// Likert-Skala: 1–7 für alle Items (außer Demographics)

export type LikertValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Item {
  key: string;
  text: string;
  reversed: boolean; // true = vor Score-Berechnung invertieren (8 - value)
}

export interface Scale {
  id: string;
  label: string;
  instruction: string;
  anchorLow: string;
  anchorHigh: string;
  items: Item[];
  scoreKey: string; // Schlüssel im scale_scores Objekt
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MANIPULATION AWARENESS (Bongard-Blanchy et al., DIS 2021)
//    Nur Personal Beliefs
//    Score = Mittelwert MA1–MA5 (MA5 invertiert)
//    Hoher Score = hohe wahrgenommene Manipulation
// ─────────────────────────────────────────────────────────────────────────────
export const manipulationAwareness: Scale = {
  id: 'bongard',
  label: 'Wahrnehmung des Cookie-Banners',
  instruction:
    'Die folgenden Aussagen beziehen sich auf das Cookie-Banner, das Sie zu Beginn gesehen haben. ' +
    'Bitte geben Sie an, wie sehr Sie den folgenden Aussagen zustimmen.',
  anchorLow: 'Stimme überhaupt nicht zu',
  anchorHigh: 'Stimme voll und ganz zu',
  scoreKey: 'bongard_mean',
  items: [
    {
      key: 'MA1',
      text: 'Ich hatte den Eindruck, dass das Cookie-Banner mich dazu bringen wollte, bestimmte Entscheidungen zu treffen.',
      reversed: false,
    },
    {
      key: 'MA2',
      text: 'Ich hatte den Eindruck, dass das Cookie-Banner so gestaltet war, dass es meine Entscheidung beeinflusst, ohne dass dies offensichtlich ist.',
      reversed: false,
    },
    {
      key: 'MA3',
      text: 'Das Cookie-Banner wirkte auf mich so, als würde es versuchen, mich zu einer bestimmten Auswahl zu drängen.',
      reversed: false,
    },
    {
      key: 'MA4',
      text: 'Ich hatte den Eindruck, dass das Design des Cookie-Banners eine klare Absicht verfolgt, mein Verhalten zu beeinflussen.',
      reversed: false,
    },
    {
      key: 'MA5',
      text: 'Ich empfand das Cookie-Banner als fair und nicht darauf ausgerichtet, meine Entscheidung zu manipulieren.',
      reversed: true, // Reverse Item: 8 - value
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GRASSL-SKALA – Perceived Control over Personal Data
//    Score = Mittelwert GR1–GR5 (keine invertierten Items)
//    Hoher Score = hohe wahrgenommene Kontrolle
// ─────────────────────────────────────────────────────────────────────────────
export const grasslScale: Scale = {
  id: 'grassl',
  label: 'Wahrgenommene Kontrolle',
  instruction:
    'Bitte geben Sie an, inwieweit Ihnen das Cookie-Banner der zuvor besuchten ' +
    'Backrezepte-Website Kontrolle über Ihre personenbezogenen Daten vermittelt hat.',
  anchorLow: 'Überhaupt keine Kontrolle',
  anchorHigh: 'Sehr viel Kontrolle',
  scoreKey: 'grassl_mean',
  items: [
    {
      key: 'GR1',
      text: 'Wie viel Kontrolle vermittelte Ihnen das Cookie-Banner darüber, welche Menge Ihrer personenbezogenen Daten von der Website erhoben wird?',
      reversed: false,
    },
    {
      key: 'GR2',
      text: 'Wie viel Kontrolle vermittelte Ihnen das Cookie-Banner darüber, wer Zugriff auf Ihre personenbezogenen Daten erhält?',
      reversed: false,
    },
    {
      key: 'GR3',
      text: 'Wie viel Kontrolle vermittelte Ihnen das Cookie-Banner darüber, welche Ihrer personenbezogenen Daten weitergegeben werden?',
      reversed: false,
    },
    {
      key: 'GR4',
      text: 'Wie viel Kontrolle vermittelte Ihnen das Cookie-Banner darüber, wie Ihre personenbezogenen Daten von der Website verwendet werden?',
      reversed: false,
    },
    {
      key: 'GR5',
      text: 'Insgesamt betrachtet: Wie stark vermittelte Ihnen das Cookie-Banner das Gefühl, die Kontrolle über Ihre personenbezogenen Daten zu haben?',
      reversed: false,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. IUIPC-8 – Internet Users' Information Privacy Concerns
//    3 Dimensionen: Control (2), Awareness (2), Collection (4)
//    Score pro Dimension = Mittelwert der jeweiligen Items
//    Gesamtscore = Mittelwert aller 8 Items
//    Keine invertierten Items in dieser Version
//    Hoher Score = hohe Datenschutzbedenken / -sensibilität
// ─────────────────────────────────────────────────────────────────────────────
export const iuipcControl: Scale = {
  id: 'iuipc_control',
  label: 'IUIPC – Kontrolle',
  instruction:
    'Die folgenden Aussagen beziehen sich auf Ihre Wahrnehmung des Umgangs mit ' +
    'personenbezogenen Daten im Internet. Bitte antworten Sie vor dem Hintergrund ' +
    'Ihres soeben erfolgten Besuchs der Backrezepte-Website.',
  anchorLow: 'Stimme überhaupt nicht zu',
  anchorHigh: 'Stimme voll und ganz zu',
  scoreKey: 'iuipc_control_mean',
  items: [
    {
      key: 'IC1',
      text: 'Der Schutz personenbezogener Daten im Internet hängt wesentlich davon ab, dass Verbraucherinnen und Verbraucher Kontrolle und Entscheidungsfreiheit darüber besitzen, wie ihre personenbezogenen Daten erhoben, verwendet und weitergegeben werden.',
      reversed: false,
    },
    {
      key: 'IC2',
      text: 'Die Kontrolle über personenbezogene Daten bildet den Kern des Datenschutzes für Verbraucherinnen und Verbraucher.',
      reversed: false,
    },
  ],
};

export const iuipcAwareness: Scale = {
  id: 'iuipc_awareness',
  label: 'IUIPC – Bewusstsein',
  instruction: '', // Gemeinsame Instruktion mit Control, daher leer
  anchorLow: 'Stimme überhaupt nicht zu',
  anchorHigh: 'Stimme voll und ganz zu',
  scoreKey: 'iuipc_awareness_mean',
  items: [
    {
      key: 'IA1',
      text: 'Unternehmen, die personenbezogene Daten online erheben, sollten offenlegen, wie diese Daten erhoben, verarbeitet und verwendet werden.',
      reversed: false,
    },
    {
      key: 'IA2',
      text: 'Eine gute Datenschutzerklärung sollte klar, leicht erkennbar und verständlich sein.',
      reversed: false,
    },
  ],
};

export const iuipcCollection: Scale = {
  id: 'iuipc_collection',
  label: 'IUIPC – Datenerhebung',
  instruction: '',
  anchorLow: 'Stimme überhaupt nicht zu',
  anchorHigh: 'Stimme voll und ganz zu',
  scoreKey: 'iuipc_collection_mean',
  items: [
    {
      key: 'ICO1',
      text: 'Es stört mich gewöhnlich, wenn Online-Unternehmen nach meinen personenbezogenen Daten fragen.',
      reversed: false,
    },
    {
      key: 'ICO2',
      text: 'Wenn Online-Unternehmen mich nach meinen personenbezogenen Daten fragen, überlege ich manchmal zweimal, bevor ich diese angebe.',
      reversed: false,
    },
    {
      key: 'ICO3',
      text: 'Es stört mich, so vielen Online-Unternehmen personenbezogene Daten mitzuteilen.',
      reversed: false,
    },
    {
      key: 'ICO4',
      text: 'Ich bin besorgt, dass Online-Unternehmen zu viele personenbezogene Daten über mich sammeln.',
      reversed: false,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. DEMOGRAPHISCHE ABFRAGE
//    Keine Likert-Skala – eigene Typen
// ─────────────────────────────────────────────────────────────────────────────
export interface DemographicsData {
  age: number | null;
  gender: 'weiblich' | 'männlich' | 'divers' | 'keine Angabe';
  education:
    | 'Kein Schulabschluss'
    | 'Hauptschulabschluss / vergleichbar'
    | 'Realschulabschluss / Mittlere Reife'
    | '(Fach-)Abitur'
    | 'Berufsausbildung'
    | 'Bachelor'
    | 'Master / Diplom'
    | 'Promotion'
    | 'Anderes';
  educationOther?: string;
  employmentStatus:
    | 'Schüler:in'
    | 'Studierende:r'
    | 'Berufstätig (Vollzeit)'
    | 'Berufstätig (Teilzeit)'
    | 'Selbstständig'
    | 'Arbeitssuchend'
    | 'In Ausbildung'
    | 'Anderes';
  employmentOther?: string;
  internetUsage:
    | 'Mehrmals täglich'
    | 'Täglich'
    | 'Mehrmals pro Woche'
    | 'Seltener';
}

export const demographicsQuestions = [
  {
    key: 'age',
    label: 'Wie alt sind Sie?',
    type: 'number' as const,
    placeholder: 'Alter in Jahren',
  },
  {
    key: 'gender',
    label: 'Welchem Geschlecht fühlen Sie sich zugehörig?',
    type: 'select' as const,
    options: ['weiblich', 'männlich', 'divers', 'keine Angabe'],
  },
  {
    key: 'education',
    label: 'Welchen höchsten Bildungsabschluss haben Sie erreicht?',
    type: 'select' as const,
    options: [
      'Kein Schulabschluss',
      'Hauptschulabschluss / vergleichbar',
      'Realschulabschluss / Mittlere Reife',
      '(Fach-)Abitur',
      'Berufsausbildung',
      'Bachelor',
      'Master / Diplom',
      'Promotion',
      'Anderes',
    ],
    hasOther: true,
  },
  {
    key: 'employmentStatus',
    label: 'Wie ist Ihr aktueller beruflicher Status?',
    type: 'select' as const,
    options: [
      'Schüler:in',
      'Studierende:r',
      'Berufstätig (Vollzeit)',
      'Berufstätig (Teilzeit)',
      'Selbstständig',
      'Arbeitssuchend',
      'In Ausbildung',
      'Anderes',
    ],
    hasOther: true,
  },
  {
    key: 'internetUsage',
    label: 'Wie häufig nutzen Sie das Internet?',
    type: 'select' as const,
    options: [
      'Mehrmals täglich',
      'Täglich',
      'Mehrmals pro Woche',
      'Seltener',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4b. ATTENTION CHECK
//     Separat – fließt nicht in computeScore() ein.
//     Korrekte Antwort: 7 ("Stimme voll und ganz zu")
// ─────────────────────────────────────────────────────────────────────────────
export const attentionCheckItem: Item = {
  key: 'ATT1',
  text: 'Wenn du das hier liest, klicke "Stimme voll und ganz zu".',
  reversed: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SCORE-BERECHNUNG
//    Invertierung: 8 - value (bei 7-stufiger Skala)
//    Mittelwert über alle Items der jeweiligen Skala
// ─────────────────────────────────────────────────────────────────────────────
export function computeScore(
  scale: Scale,
  responses: Record<string, LikertValue>
): number | null {
  const values: number[] = [];

  for (const item of scale.items) {
    const raw = responses[item.key];
    if (raw === undefined || raw === null) return null; // fehlende Antwort
    const value = item.reversed ? 8 - raw : raw;
    values.push(value);
  }

  if (values.length === 0) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(mean * 100) / 100; // 2 Dezimalstellen
}

export function computeIuipcTotal(
  controlResponses: Record<string, LikertValue>,
  awarenessResponses: Record<string, LikertValue>,
  collectionResponses: Record<string, LikertValue>
): number | null {
  const all = {
    ...controlResponses,
    ...awarenessResponses,
    ...collectionResponses,
  };
  const allItems = [
    ...iuipcControl.items,
    ...iuipcAwareness.items,
    ...iuipcCollection.items,
  ];
  const values = allItems.map(item => {
    const raw = all[item.key];
    return item.reversed ? 8 - raw : raw;
  });
  if (values.some(v => v === undefined)) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SURVEY-REIHENFOLGE (für die App)
//    Reihenfolge ist für alle Teilnehmenden identisch (kein Counterbalancing)
//    um Reihenfolge als Variable auszuschließen
// ─────────────────────────────────────────────────────────────────────────────
export const surveyOrder = [
  { scale: grasslScale,           step: 1, label: 'Abschnitt 1 von 4' },
  { scale: manipulationAwareness, step: 2, label: 'Abschnitt 2 von 4' },
  { scale: iuipcControl,          step: 3, label: 'Abschnitt 3 von 4' },
  { scale: iuipcAwareness,        step: 3, label: 'Abschnitt 3 von 4' }, // gemeinsame Seite
  { scale: iuipcCollection,       step: 3, label: 'Abschnitt 3 von 4' }, // gemeinsame Seite
  // Demographics: step 4 – eigene Komponente
] as const;