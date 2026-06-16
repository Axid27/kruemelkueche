<script lang="ts">
	import '$lib/styles/study.css';
	import { goto } from '$app/navigation';
	import LikertScale from '$lib/components/LikertScale.svelte';
	import {
		grasslScale,
		manipulationAwareness,
		iuipcControl,
		iuipcAwareness,
		iuipcCollection,
		demographicsQuestions
	} from '$lib/questionnaire';

	const steps = [
		{ id: 'grassl', scale: grasslScale, type: 'likert' as const },
		{ id: 'bongard', scale: manipulationAwareness, type: 'likert' as const },
		{ id: 'iuipc', scale: null, type: 'iuipc' as const },
		{ id: 'demo', scale: null, type: 'demo' as const }
	];

	const stepLabels = [
		'Abschnitt 1 von 4',
		'Abschnitt 2 von 4',
		'Abschnitt 3 von 4',
		'Abschnitt 4 von 4'
	];

	let currentStep = $state(0);
	let responses = $state<Record<string, number>>({});
	let demographics = $state<Record<string, string>>({});
	let submitting = $state(false);
	let error = $state('');

	let progressPct = $derived(10 + ((currentStep + 1) / steps.length) * 80);

	let currentStepComplete = $derived.by(() => {
		const step = steps[currentStep];
		if (step.type === 'likert' && step.scale) {
			return step.scale.items.every((item) => responses[item.key] !== undefined);
		}
		if (step.type === 'iuipc') {
			return [
				...iuipcControl.items,
				...iuipcAwareness.items,
				...iuipcCollection.items
			].every((item) => responses[item.key] !== undefined);
		}
		if (step.type === 'demo') {
			return (
				demographics['gender'] !== undefined &&
				demographics['education'] !== undefined &&
				demographics['employmentStatus'] !== undefined &&
				demographics['internetUsage'] !== undefined
			);
		}
		return false;
	});

	function handleLikert(key: string, val: number) {
		responses = { ...responses, [key]: val };
	}

	function handleDemo(key: string, val: string) {
		demographics = { ...demographics, [key]: val };
	}

	function nextStep() {
		if (!currentStepComplete) return;
		if (currentStep < steps.length - 1) {
			currentStep++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			submitSurvey();
		}
	}

	async function submitSurvey() {
		submitting = true;
		error = '';

		const pid =
			new URLSearchParams(window.location.search).get('pid') ??
			sessionStorage.getItem('pid') ??
			'';

		const res = await fetch('/api/submit-survey', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ participantId: pid, responses, demographics })
		});

		if (!res.ok) {
			error = 'Es gab einen Fehler beim Speichern. Bitte versuche es erneut.';
			submitting = false;
			return;
		}

		goto(`/study/outro?pid=${pid}`);
	}
</script>

<svelte:head>
	<title>Fragebogen – Studie TH Köln</title>
</svelte:head>

<div class="study-page">
	<!-- Header -->
	<header class="study-header">
		<span class="study-header-logo">TH Köln</span>
		<div class="study-header-divider"></div>
		<span class="study-header-title">Fragebogen</span>
	</header>

	<!-- Progress -->
	<div class="study-progress">
		<div class="study-progress-fill" style="width: {progressPct}%"></div>
	</div>

	<!-- Schritt-Header -->
	<div class="study-card">
		<p class="study-label">{stepLabels[currentStep]}</p>

		{#if steps[currentStep].id === 'grassl'}
			<h2 class="study-h1">{grasslScale.label}</h2>
			<p class="study-body" style="margin-top: 8px;">{grasslScale.instruction}</p>
		{:else if steps[currentStep].id === 'bongard'}
			<h2 class="study-h1">{manipulationAwareness.label}</h2>
			<p class="study-body" style="margin-top: 8px;">{manipulationAwareness.instruction}</p>
		{:else if steps[currentStep].id === 'iuipc'}
			<h2 class="study-h1">Datenschutzwahrnehmung</h2>
			<p class="study-body" style="margin-top: 8px;">
				Die folgenden Aussagen beziehen sich auf Ihre Wahrnehmung des Umgangs mit
				personenbezogenen Daten im Internet. Bitte antworten Sie vor dem Hintergrund Ihres soeben
				erfolgten Besuchs der Backrezepte-Website.
			</p>
		{:else if steps[currentStep].id === 'demo'}
			<h2 class="study-h1">Angaben zur Person</h2>
			<p class="study-body" style="margin-top: 8px;">
				Zum Abschluss bitten wir dich um einige allgemeine Angaben. Alle Antworten sind anonym.
			</p>
		{/if}
	</div>

	<!-- Likert Schritte (Graßl + Bongard) -->
	{#if steps[currentStep].type === 'likert'}
		{@const scale = steps[currentStep].scale}
		{#if scale}
			<div class="study-card" style="margin-top: 12px;">
				{#each scale.items as item}
					<LikertScale
						{item}
						value={responses[item.key] ?? null}
						anchorLow={scale.anchorLow}
						anchorHigh={scale.anchorHigh}
						onChange={handleLikert}
					/>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- IUIPC (alle 3 Subskalen) -->
	{#if steps[currentStep].type === 'iuipc'}
		<div class="study-card" style="margin-top: 12px;">
			<p class="study-label" style="margin-bottom: 16px;">Kontrolle</p>
			{#each iuipcControl.items as item}
				<LikertScale
					{item}
					value={responses[item.key] ?? null}
					anchorLow={iuipcControl.anchorLow}
					anchorHigh={iuipcControl.anchorHigh}
					onChange={handleLikert}
				/>
			{/each}
		</div>
		<div class="study-card" style="margin-top: 12px;">
			<p class="study-label" style="margin-bottom: 16px;">Bewusstsein</p>
			{#each iuipcAwareness.items as item}
				<LikertScale
					{item}
					value={responses[item.key] ?? null}
					anchorLow={iuipcAwareness.anchorLow}
					anchorHigh={iuipcAwareness.anchorHigh}
					onChange={handleLikert}
				/>
			{/each}
		</div>
		<div class="study-card" style="margin-top: 12px;">
			<p class="study-label" style="margin-bottom: 16px;">Datenerhebung</p>
			{#each iuipcCollection.items as item}
				<LikertScale
					{item}
					value={responses[item.key] ?? null}
					anchorLow={iuipcCollection.anchorLow}
					anchorHigh={iuipcCollection.anchorHigh}
					onChange={handleLikert}
				/>
			{/each}
		</div>
	{/if}

	<!-- Demographics -->
	{#if steps[currentStep].type === 'demo'}
		<div class="study-card" style="margin-top: 12px;">
			{#each demographicsQuestions as q}
				<div class="demo-field">
					<label class="demo-label" for={q.key}>{q.label}</label>

					{#if q.type === 'number'}
						<input
							id={q.key}
							type="number"
							min="16"
							max="99"
							placeholder={q.placeholder}
							class="demo-input"
							onchange={(e) => handleDemo(q.key, e.currentTarget.value)}
						/>
					{:else if q.type === 'select' && q.options}
						<div class="demo-options">
							{#each q.options as opt}
								<button
									class="demo-option"
									class:demo-option--selected={demographics[q.key] === opt}
									onclick={() => handleDemo(q.key, opt)}
								>
									{opt}
								</button>
							{/each}
						</div>
						{#if q.hasOther && demographics[q.key] === 'Anderes'}
							<input
								type="text"
								placeholder="Bitte angeben..."
								class="demo-input demo-input--other"
								oninput={(e) => handleDemo(`${q.key}Other`, e.currentTarget.value)}
							/>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Fehler -->
	{#if error}
		<div class="study-error">{error}</div>
	{/if}

	<!-- Weiter / Absenden -->
	<button
		class="study-btn"
		class:study-btn--active={currentStepComplete && !submitting}
		disabled={!currentStepComplete || submitting}
		onclick={nextStep}
	>
		{#if submitting}
			Wird gespeichert…
		{:else if currentStep < steps.length - 1}
			Weiter
		{:else}
			Fragebogen absenden
		{/if}
	</button>

	<p class="study-footnote">Alle Antworten sind anonym · TH Köln · Pit Kaldewey</p>
</div>

<style>
	.demo-field {
		margin-bottom: 24px;
	}
	.demo-label {
		display: block;
		font-size: 14px;
		font-weight: 600;
		color: var(--study-text);
		margin-bottom: 10px;
		line-height: 1.4;
	}
	.demo-input {
		width: 100%;
		padding: 10px 14px;
		border: 1.5px solid var(--study-border);
		border-radius: var(--study-radius);
		font-size: 14px;
		font-family: var(--study-font);
		color: var(--study-text);
		background: var(--study-surface);
		outline: none;
		transition: border-color 0.15s;
	}
	.demo-input:focus {
		border-color: var(--study-primary);
	}
	.demo-input--other {
		margin-top: 8px;
	}
	.demo-options {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.demo-option {
		text-align: left;
		padding: 10px 14px;
		border: 1.5px solid var(--study-border);
		border-radius: var(--study-radius);
		background: var(--study-surface);
		font-size: 14px;
		font-family: var(--study-font);
		color: var(--study-text);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}
	.demo-option--selected {
		border-color: var(--study-primary);
		background: #ebf4ff;
		color: var(--study-primary);
		font-weight: 600;
	}
	.study-error {
		margin: 12px 16px 0;
		padding: 12px 16px;
		background: #fff5f5;
		border: 1px solid #feb2b2;
		border-radius: var(--study-radius);
		font-size: 13px;
		color: #c53030;
	}
</style>
