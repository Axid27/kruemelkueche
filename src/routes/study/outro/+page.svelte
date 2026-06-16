<script lang="ts">
	import '$lib/styles/study.css';
	import { onMount } from 'svelte';

	let deleteState = $state<'idle' | 'confirm' | 'deleting' | 'done' | 'error'>('idle');
	let pid = $state('');

	onMount(() => {
		pid =
			new URLSearchParams(window.location.search).get('pid') ??
			sessionStorage.getItem('pid') ??
			'';
	});

	async function deleteData() {
		if (!pid) {
			deleteState = 'error';
			return;
		}

		deleteState = 'deleting';

		const res = await fetch('/api/delete-participant', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ participantId: pid })
		});

		if (res.ok) {
			sessionStorage.clear();
			deleteState = 'done';
		} else {
			deleteState = 'error';
		}
	}
</script>

<svelte:head>
	<title>Abschluss – Studie TH Köln</title>
</svelte:head>

<div class="study-page">
	<!-- Header -->
	<header class="study-header">
		<span class="study-header-logo">TH Köln</span>
		<div class="study-header-divider"></div>
		<span class="study-header-title">Abschluss der Studie</span>
	</header>

	<!-- Progress: 100% -->
	<div class="study-progress">
		<div class="study-progress-fill" style="width: 100%"></div>
	</div>

	<!-- Danke -->
	<div class="study-card">
		<p class="study-label">Studie abgeschlossen</p>
		<h1 class="study-h1">Vielen Dank für deine Teilnahme!</h1>
		<p class="study-body" style="margin-top: 8px;">
			Du hast die Studie erfolgreich abgeschlossen. Deine Antworten wurden anonym gespeichert und
			helfen mir dabei, meine Forschungsfrage im Rahmen meiner Masterarbeit zu beantworten.
		</p>
	</div>

	<!-- Aufklärung -->
	<div
		class="study-infobox"
		style="border-left-color: #276749; background: #F0FFF4; border-color: #9AE6B4;"
	>
		<p class="study-infobox-title" style="color: #276749;">
			Worum ging es in dieser Studie wirklich?
		</p>
		<p style="font-size: 13px; color: var(--study-text); line-height: 1.65; margin: 0;">
			Im Briefing haben wir das genaue Ziel der Studie zunächst offengelassen, um deine Antworten
			nicht zu beeinflussen. Tatsächlich untersuche ich, wie die
			<strong>Gestaltung von Cookie-Consent-Bannern</strong> – insbesondere der Einsatz von
			Animationen und visuellen Rückmeldungen – die Entscheidungen von Nutzerinnen und Nutzern
			sowie ihr Gefühl von Kontrolle über ihre Daten beeinflusst.
		</p>
	</div>

	<!-- Kontakt -->
	<div class="study-card" style="margin-top: 12px;">
		<p class="study-label">Kontakt & Fragen</p>
		<p class="study-body">
			Falls du Fragen zur Studie hast, Bedenken bezüglich deiner Daten äussern oder deine
			Einwilligung nachträglich widerrufen möchtest, kannst du dich jederzeit bei mir melden:
		</p>
		<div class="contact-block">
			<p class="contact-name">Pit Kaldewey</p>
			<p class="contact-inst">TH Köln · Lehrstuhl Mobile und verteilte interaktive Systeme</p>
			<a href="mailto:pit_tristan.kaldewey@smail.th-koeln.de" class="contact-mail">
				pit_tristan.kaldewey@smail.th-koeln.de
			</a>
		</div>
	</div>

	<!-- Löschoption -->
	<div class="study-card" style="margin-top: 12px;">
		<p class="study-label">Datenrückzug</p>
		<p class="study-body">
			Du kannst deine Teilnahmedaten jederzeit vollständig löschen lassen. Dies umfasst alle
			Antworten, Zeitstempel und Interaktionsdaten.
		</p>

		{#if deleteState === 'idle'}
			<button class="delete-btn" onclick={() => (deleteState = 'confirm')}>
				Meine Daten löschen
			</button>
		{:else if deleteState === 'confirm'}
			<div class="confirm-box">
				<p class="confirm-text">
					Bist du sicher? Alle deine Antworten und Interaktionsdaten werden unwiderruflich gelöscht.
				</p>
				<div class="confirm-row">
					<button
						class="confirm-btn confirm-btn--cancel"
						onclick={() => (deleteState = 'idle')}
					>
						Abbrechen
					</button>
					<button class="confirm-btn confirm-btn--delete" onclick={deleteData}>
						Ja, löschen
					</button>
				</div>
			</div>
		{:else if deleteState === 'deleting'}
			<p class="status-msg--loading">Daten werden gelöscht…</p>
		{:else if deleteState === 'done'}
			<div class="status-box status-box--success">
				<p class="status-box-title">Daten erfolgreich gelöscht</p>
				<p class="status-box-text">
					Alle deine Teilnahmedaten wurden vollständig aus unserer Datenbank entfernt.
				</p>
			</div>
		{:else if deleteState === 'error'}
			<div class="status-box status-box--error">
				<p class="status-box-title">Fehler beim Löschen</p>
				<p class="status-box-text">
					Bitte wende dich direkt per E-Mail an pit_tristan.kaldewey@smail.th-koeln.de mit dem
					Hinweis, dass du deine Daten löschen möchtest.
				</p>
			</div>
		{/if}
	</div>

	<!-- Abschluss -->
	<p class="study-footnote" style="margin-top: 24px; font-size: 13px;">
		Du kannst dieses Fenster jetzt schliessen.<br />
		Nochmals herzlichen Dank für deine Zeit und Unterstützung!
	</p>

	<p class="study-footnote" style="margin-top: 8px;">
		TH Köln · Lehrstuhl Mobile und verteilte interaktive Systeme
	</p>
</div>

<style>
	.contact-block {
		margin-top: 12px;
		padding: 14px 16px;
		background: var(--study-bg);
		border: 1px solid var(--study-border);
		border-radius: var(--study-radius);
	}
	.contact-name {
		font-size: 14px;
		font-weight: 700;
		color: var(--study-text);
		margin-bottom: 2px;
	}
	.contact-inst {
		font-size: 12px;
		color: var(--study-subtle);
		margin-bottom: 6px;
	}
	.contact-mail {
		font-size: 13px;
		color: var(--study-primary);
		text-decoration: underline;
		word-break: break-all;
	}

	.delete-btn {
		width: 100%;
		padding: 11px;
		border-radius: var(--study-radius);
		border: 1.5px solid #fc8181;
		background: white;
		color: #c53030;
		font-size: 14px;
		font-weight: 600;
		font-family: var(--study-font);
		cursor: pointer;
		transition: background 0.15s;
		margin-top: 4px;
	}
	.delete-btn:active {
		background: #fff5f5;
	}

	.confirm-box {
		margin-top: 8px;
		padding: 14px;
		background: #fff5f5;
		border: 1px solid #feb2b2;
		border-radius: var(--study-radius);
	}
	.confirm-text {
		font-size: 13px;
		color: var(--study-text);
		line-height: 1.5;
		margin-bottom: 12px;
	}
	.confirm-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.confirm-btn {
		padding: 10px;
		border-radius: var(--study-radius);
		font-size: 14px;
		font-weight: 600;
		font-family: var(--study-font);
		cursor: pointer;
		border: none;
	}
	.confirm-btn--cancel {
		background: var(--study-border);
		color: var(--study-text);
	}
	.confirm-btn--delete {
		background: #c53030;
		color: white;
	}

	.status-msg--loading {
		font-size: 13px;
		color: var(--study-subtle);
		text-align: center;
		padding: 12px 0;
	}

	.status-box {
		margin-top: 8px;
		padding: 14px;
		border-radius: var(--study-radius);
	}
	.status-box--success {
		background: #f0fff4;
		border: 1px solid #9ae6b4;
	}
	.status-box--error {
		background: #fff5f5;
		border: 1px solid #feb2b2;
	}
	.status-box-title {
		font-size: 14px;
		font-weight: 700;
		margin-bottom: 6px;
		color: var(--study-text);
	}
	.status-box-text {
		font-size: 13px;
		color: var(--study-subtle);
		line-height: 1.5;
	}
</style>
