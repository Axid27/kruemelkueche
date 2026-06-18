import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';
import ws from 'ws';
import {
	grasslScale,
	manipulationAwareness,
	iuipcControl,
	iuipcAwareness,
	iuipcCollection,
	computeScore,
	computeIuipcTotal,
	type LikertValue
} from '$lib/questionnaire';

const adminClient = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	realtime: { transport: ws }
});

export async function POST({ request }) {
	const { participantId, responses, demographics } = await request.json();

	// Rohe Item-Antworten speichern
	const items = Object.entries(responses as Record<string, unknown>).map(([item_key, value]) => ({
		participant_id: participantId,
		scale: getScaleId(item_key),
		item_key,
		value: String(value)
	}));

	const { error: itemError } = await adminClient.from('survey_responses').insert(items);
	if (itemError) return json({ error: itemError.message }, { status: 500 });

	// Scores berechnen
	const r = responses as Record<string, LikertValue>;
	const grasslMean = computeScore(grasslScale, r);
	const bongardMean = computeScore(manipulationAwareness, r);
	const iuipcControlMean = computeScore(iuipcControl, r);
	const iuipcAwarenessMean = computeScore(iuipcAwareness, r);
	const iuipcCollectionMean = computeScore(iuipcCollection, r);
	const iuipcTotalMean = computeIuipcTotal(r, r, r);

	// Attention Check: korrekte Antwort = 7 ("Stimme voll und ganz zu")
	const attentionPassed = r['ATT1'] === 7;

	// Scores + Demographics in DB
	const { error: scoreError } = await adminClient.from('scale_scores').insert({
		participant_id: participantId,
		grassl_mean: grasslMean,
		bongard_mean: bongardMean,
		iuipc_control_mean: iuipcControlMean,
		iuipc_awareness_mean: iuipcAwarenessMean,
		iuipc_collection_mean: iuipcCollectionMean,
		iuipc_total_mean: iuipcTotalMean,
		attention_check_passed: attentionPassed,
		age: demographics.age ? Number(demographics.age) : null,
		gender: demographics.gender ?? null,
		education: demographics.education ?? null,
		education_other: demographics.educationOther ?? null,
		employment_status: demographics.employmentStatus ?? null,
		employment_other: demographics.employmentOther ?? null,
		internet_usage: demographics.internetUsage ?? null
	});

	if (scoreError) return json({ error: scoreError.message }, { status: 500 });

	// Participant als completed markieren
	await adminClient.from('participants').update({ completed: true }).eq('id', participantId);

	return json({ ok: true });
}

function getScaleId(key: string): string {
	if (key.startsWith('GR')) return 'grassl';
	if (key.startsWith('MA')) return 'bongard';
	if (key.startsWith('IC')) return 'iuipc';
	if (key.startsWith('IA')) return 'iuipc';
	if (key.startsWith('ATT')) return 'attention';
	return 'demographics';
}
