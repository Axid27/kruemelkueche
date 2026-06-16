import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';

const adminClient = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function DELETE({ request }) {
	const { participantId } = await request.json();

	if (!participantId) {
		return json({ error: 'Keine ID angegeben' }, { status: 400 });
	}

	// CASCADE löscht automatisch alle verknüpften Einträge
	// in decisions, log_events, survey_responses, scale_scores
	const { error } = await adminClient.from('participants').delete().eq('id', participantId);

	if (error) return json({ error: error.message }, { status: 500 });
	return json({ ok: true });
}
