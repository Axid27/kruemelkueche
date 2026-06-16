export type LikertValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Item {
	key: string;
	text: string;
	reversed?: boolean;
}

export interface Scale {
	label: string;
	instruction: string;
	anchorLow: string;
	anchorHigh: string;
	items: Item[];
}

export interface DemographicsQuestion {
	key: string;
	label: string;
	type: 'number' | 'select';
	placeholder?: string;
	options?: string[];
	hasOther?: boolean;
}

// ── Graßl – Perceived Control over Personal Data (5 Items, kein Reverse) ──
export const grasslScale: Scale = {
	label: 'Wahrgenommene Kontrolle',
	instruction:
		'Die folgenden Aussagen beziehen sich auf deinen soeben erfolgten Besuch der Backrezepte-Website. Bitte gib an, inwieweit du den folgenden Aussagen zustimmst.',
	anchorLow: 'Stimme überhaupt nicht zu',
	anchorHigh: 'Stimme voll zu',
	items: [
		{
			key: 'GR1',
			text: 'Ich hatte die Kontrolle darüber, welche Informationen diese Website über mich sammelt.'
		},
		{
			key: 'GR2',
			text: 'Ich konnte selbst entscheiden, welche Cookies auf meinem Gerät gesetzt werden.'
		},
		{
			key: 'GR3',
			text: 'Ich war in der Lage, meine Datenschutzpräferenzen auf dieser Website zu kontrollieren.'
		},
		{
			key: 'GR4',
			text: 'Ich fühlte mich bei meinen Datenschutzentscheidungen auf dieser Website kompetent.'
		},
		{
			key: 'GR5',
			text: 'Ich hatte ausreichend Kontrolle über meine persönlichen Daten auf dieser Website.'
		}
	]
};

// ── Manipulation Awareness – Bongard-Blanchy et al. (5 Items, MA5 reversed) ──
export const manipulationAwareness: Scale = {
	label: 'Wahrnehmung von Beeinflussung',
	instruction:
		'Bitte gib an, inwieweit die folgenden Aussagen auf dich zutreffen, wenn du an deinen Besuch der Backrezepte-Website denkst.',
	anchorLow: 'Stimme überhaupt nicht zu',
	anchorHigh: 'Stimme voll zu',
	items: [
		{
			key: 'MA1',
			text: 'Mir ist bewusst, dass Websites versuchen können, mein Verhalten zu beeinflussen.'
		},
		{
			key: 'MA2',
			text: 'Ich erkenne, wenn eine Website meine Entscheidungen in eine bestimmte Richtung lenken möchte.'
		},
		{
			key: 'MA3',
			text: 'Ich bin mir bewusst, dass Online-Anbieter psychologische Techniken einsetzen können, um mein Verhalten zu steuern.'
		},
		{
			key: 'MA4',
			text: 'Ich merke, wenn ein Webdesign mich in eine bestimmte Richtung drängen soll.'
		},
		{
			key: 'MA5',
			text: 'Mir fällt es schwer zu erkennen, wenn ich durch ein Website-Design beeinflusst werde.',
			reversed: true
		}
	]
};

// ── IUIPC-8 – Internet Users' Information Privacy Concerns ──

export const iuipcControl: Scale = {
	label: 'IUIPC – Kontrolle',
	instruction: '',
	anchorLow: 'Stimme überhaupt nicht zu',
	anchorHigh: 'Stimme voll zu',
	items: [
		{
			key: 'IC1',
			text: 'Es ist mir wichtig, die Kontrolle darüber zu haben, welche persönlichen Informationen über mich im Internet gesammelt werden.'
		},
		{
			key: 'IC2',
			text: 'Es ist mir wichtig, selbst zu bestimmen, wer meine persönlichen Daten im Internet verwenden darf.'
		}
	]
};

export const iuipcAwareness: Scale = {
	label: 'IUIPC – Bewusstsein',
	instruction: '',
	anchorLow: 'Stimme überhaupt nicht zu',
	anchorHigh: 'Stimme voll zu',
	items: [
		{
			key: 'IA1',
			text: 'Mir ist bewusst, dass persönliche Informationen, die ich online eingebe, von Unternehmen gesammelt und gespeichert werden können.'
		},
		{
			key: 'IA2',
			text: 'Ich achte darauf, welche persönlichen Informationen ich im Internet preisgebe.'
		}
	]
};

export const iuipcCollection: Scale = {
	label: 'IUIPC – Datenerhebung',
	instruction: '',
	anchorLow: 'Stimme überhaupt nicht zu',
	anchorHigh: 'Stimme voll zu',
	items: [
		{
			key: 'ICO1',
			text: 'Es stört mich, wenn Online-Anbieter persönliche Informationen von mir sammeln, ohne dass ich davon weiß.'
		},
		{
			key: 'ICO2',
			text: 'Es bereitet mir Unbehagen, wenn Unternehmen über das Internet Informationen über mein Verhalten sammeln.'
		},
		{
			key: 'ICO3',
			text: 'Ich mache mir Sorgen darüber, dass Online-Anbieter zu viele persönliche Informationen über mich besitzen.'
		},
		{
			key: 'ICO4',
			text: 'Mir ist unangenehm, wenn persönliche Informationen über mich ohne meine Zustimmung an andere weitergegeben werden.'
		}
	]
};

// ── Demographics ──
export const demographicsQuestions: DemographicsQuestion[] = [
	{
		key: 'age',
		label: 'Wie alt bist du? (Jahre)',
		type: 'number',
		placeholder: 'z.B. 25'
	},
	{
		key: 'gender',
		label: 'Geschlecht',
		type: 'select',
		options: ['Männlich', 'Weiblich', 'Divers', 'Keine Angabe']
	},
	{
		key: 'education',
		label: 'Höchster Bildungsabschluss',
		type: 'select',
		options: [
			'Kein Schulabschluss',
			'Hauptschulabschluss',
			'Realschulabschluss',
			'Abitur / Fachabitur',
			'Bachelor',
			'Master / Diplom / Magister',
			'Promotion',
			'Anderes'
		],
		hasOther: true
	},
	{
		key: 'employmentStatus',
		label: 'Aktueller Beschäftigungsstatus',
		type: 'select',
		options: [
			'Schüler/in',
			'Student/in',
			'Berufstätig (Vollzeit)',
			'Berufstätig (Teilzeit)',
			'Selbstständig',
			'Nicht erwerbstätig',
			'Rentner/in',
			'Anderes'
		],
		hasOther: true
	},
	{
		key: 'internetUsage',
		label: 'Wie häufig nutzt du das Internet?',
		type: 'select',
		options: [
			'Mehrmals täglich',
			'Einmal täglich',
			'Mehrmals wöchentlich',
			'Einmal wöchentlich',
			'Seltener'
		]
	}
];

// ── Score Berechnung ──

export function computeScore(scale: Scale, responses: Record<string, LikertValue>): number {
	const values = scale.items
		.map((item) => {
			const val = responses[item.key];
			if (val === undefined) return null;
			return item.reversed ? ((8 - val) as LikertValue) : val;
		})
		.filter((v): v is number => v !== null);

	if (values.length === 0) return 0;
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	return Math.round(mean * 100) / 100;
}

export function computeIuipcTotal(
	controlR: Record<string, LikertValue>,
	awarenessR: Record<string, LikertValue>,
	collectionR: Record<string, LikertValue>
): number {
	const allValues = [
		...iuipcControl.items.map((item) => {
			const v = controlR[item.key];
			return v !== undefined ? (item.reversed ? 8 - v : v) : null;
		}),
		...iuipcAwareness.items.map((item) => {
			const v = awarenessR[item.key];
			return v !== undefined ? (item.reversed ? 8 - v : v) : null;
		}),
		...iuipcCollection.items.map((item) => {
			const v = collectionR[item.key];
			return v !== undefined ? (item.reversed ? 8 - v : v) : null;
		})
	].filter((v): v is number => v !== null);

	if (allValues.length === 0) return 0;
	const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
	return Math.round(mean * 100) / 100;
}
