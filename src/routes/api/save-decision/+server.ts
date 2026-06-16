import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';
import ws from 'ws';

const adminClient = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	realtime: { transport: ws }
});

export async function POST({ request }) {
	const { participantId, choice, decisionTimeMs, deliberationSwitches } = await request.json();

	const { error } = await adminClient.from('decisions').insert({
		participant_id: participantId,
		choice,
		decision_time_ms: decisionTimeMs,
		deliberation_switches: deliberationSwitches
	});

	if (error) return json({ error: error.message }, { status: 500 });
	return json({ ok: true });
}
