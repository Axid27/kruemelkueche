import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';

const adminClient = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST({ request }) {
	const { participantId, eventType, target, timestampMs } = await request.json();

	const { error } = await adminClient.from('log_events').insert({
		participant_id: participantId,
		event_type: eventType,
		target: target ?? null,
		timestamp_ms: timestampMs
	});

	if (error) return json({ error: error.message }, { status: 500 });
	return json({ ok: true });
}
