import { writable } from 'svelte/store';

interface Session {
	participantId: string | null;
	condition: 1 | 2 | 3 | null;
}

export const session = writable<Session>({
	participantId: null,
	condition: null
});
