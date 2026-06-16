import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';

const adminClient = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST({ request }) {
	const { screenWidth, userAgent } = await request.json();

	const { data: counts } = await adminClient.from('participants').select('condition');

	const tally = [0, 0, 0];
	counts?.forEach((p) => tally[p.condition - 1]++);

	const minCount = Math.min(...tally);
	const candidates = [1, 2, 3].filter((c) => tally[c - 1] === minCount) as (1 | 2 | 3)[];
	const condition = candidates[Math.floor(Math.random() * candidates.length)];

	const { data, error } = await adminClient
		.from('participants')
		.insert({ condition, screen_width: screenWidth, user_agent: userAgent })
		.select('id')
		.single();

	if (error || !data) {
		return json({ error: 'DB error' }, { status: 500 });
	}

	return json({ participantId: data.id, condition });
}
