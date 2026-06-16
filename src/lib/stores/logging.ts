import { get } from 'svelte/store';
import { session } from './session';

type EventType = 'banner_shown' | 'option_tapped' | 'option_changed' | 'submit_tapped';
type Choice = 'accept' | 'granular' | 'decline';

interface LogEntry {
	eventType: EventType;
	target: Choice | null;
	timestampMs: number;
}

let eventLog: LogEntry[] = [];
let bannerShownAt: number | null = null;
let lastChoice: Choice | null = null;
let switchCount = 0;

function now(): number {
	return Math.round(performance.now());
}

function sendEvent(entry: LogEntry) {
	const { participantId } = get(session);
	if (!participantId) return;

	fetch('/api/log-event', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ participantId, ...entry })
	}).catch(console.error);
}

export const logger = {
	bannerShown() {
		eventLog = [];
		bannerShownAt = now();
		switchCount = 0;
		lastChoice = null;

		const entry: LogEntry = { eventType: 'banner_shown', target: null, timestampMs: bannerShownAt };
		eventLog.push(entry);
		sendEvent(entry);
	},

	optionTapped(choice: Choice) {
		const entry: LogEntry = { eventType: 'option_tapped', target: choice, timestampMs: now() };
		eventLog.push(entry);
		sendEvent(entry);

		if (lastChoice !== null && lastChoice !== choice) {
			switchCount++;
			const switchEntry: LogEntry = {
				eventType: 'option_changed',
				target: choice,
				timestampMs: now()
			};
			eventLog.push(switchEntry);
			sendEvent(switchEntry);
		}
		lastChoice = choice;
	},

	async submitTapped(choice: Choice): Promise<void> {
		const submitTime = now();
		const decisionTimeMs = bannerShownAt !== null ? submitTime - bannerShownAt : 0;

		const entry: LogEntry = { eventType: 'submit_tapped', target: choice, timestampMs: submitTime };
		eventLog.push(entry);
		sendEvent(entry);

		const { participantId } = get(session);
		await fetch('/api/save-decision', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ participantId, choice, decisionTimeMs, deliberationSwitches: switchCount })
		});
	},

	reset() {
		eventLog = [];
		bannerShownAt = null;
		lastChoice = null;
		switchCount = 0;
	}
};
