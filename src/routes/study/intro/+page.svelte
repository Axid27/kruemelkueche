<script lang="ts">
	import '$lib/styles/study.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { session } from '$lib/stores/session';

	let consented = $state(false);
	let pid = $state('');

	onMount(async () => {
		// Reload protection: don't assign twice
		const existing = sessionStorage.getItem('pid');
		if (existing) {
			const condition = Number(sessionStorage.getItem('condition')) as 1 | 2 | 3;
			session.set({ participantId: existing, condition });
			pid = existing;
			return;
		}

		const res = await fetch('/api/assign-condition', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				screenWidth: window.screen.width,
				userAgent: navigator.userAgent
			})
		});

		const { participantId, condition } = await res.json();
		sessionStorage.setItem('pid', participantId);
		sessionStorage.setItem('condition', String(condition));
		session.set({ participantId, condition });
		pid = participantId;
	});

	function proceed() {
		if (!consented || !pid) return;
		goto(`/?showBanner=true&pid=${pid}`);
	}
</script>

<svelte:head>
	<title>Studienteilnahme – TH Köln</title>
</svelte:head>

<div class="study-page">
	<!-- Header -->
	<header class="study-header">
		<span class="study-header-logo">TH Köln</span>
		<div class="study-header-divider"></div>
		<span class="study-header-title">Masterarbeit · Pit Kaldewey</span>
	</header>

	<!-- Progress -->
	<div class="study-progress">
		<div class="study-progress-fill" style="width: 10%"></div>
	</div>

	<!-- Willkommen -->
	<div class="study-card">
		<p class="study-label">Schritt 1 von 4 · Einführung</p>
		<h1 class="study-h1">Herzlich willkommen und vielen Dank für deine Teilnahme!</h1>
	</div>

	<!-- Intro Text -->
	<div class="study-card" style="margin-top: 12px;">
		<p class="study-body">
			Im Rahmen meiner Masterarbeit an der TH Köln untersuche ich, wie Menschen auf Webseiten
			navigieren und mit verschiedenen Seitenelementen interagieren. Mich interessiert dabei
			besonders, wie Nutzerinnen und Nutzer Webseiteninhalte wahrnehmen und welche Entscheidungen
			sie im Umgang damit treffen.
		</p>
		<p class="study-body">
			Die Studie besteht aus drei Teilen: einem kurzen Fragebogen vor der Aufgabe, einer kurzen
			Interaktion mit einer Webseite sowie einem abschliessenden Fragebogen. Die Teilnahme dauert
			ca. <strong>10–15 Minuten</strong>.
		</p>
	</div>

	<!-- Hinweise -->
	<div class="study-infobox">
		<p class="study-infobox-title">Bitte lies folgende Hinweise sorgfältig</p>
		<ul>
			<li>
				Deine Teilnahme ist freiwillig. Du kannst die Studie
				<strong>jederzeit ohne Angabe von Gründen</strong> abbrechen, ohne dass dir dadurch
				Nachteile entstehen.
			</li>
			<li>
				Alle erhobenen Daten werden <strong>vollständig anonymisiert</strong> und ausschliesslich
				für wissenschaftliche Zwecke dieser Masterarbeit verwendet.
			</li>
			<li>
				Es werden <strong>keine personenbezogenen Daten</strong> gespeichert, die einen
				Rückschluss auf deine Person ermöglichen.
			</li>
			<li>
				Die Daten werden nach den Vorgaben der DSGVO verarbeitet und nach Abschluss der Studie
				sicher gespeichert.
			</li>
		</ul>
	</div>

	<!-- Versuchsanweisung -->
	<div class="study-instruction">
		<p class="study-instruction-label">Versuchsanweisung</p>
		<p>
			Im Folgenden wird dir eine Webseite angezeigt. Interagiere damit ganz so, wie du es
			normalerweise tun würdest – es gibt kein richtig oder falsch. Lies und klicke, was dich
			interessiert, und reagiere so, wie du es in deinem Alltag tun würdest.
		</p>
	</div>

	<!-- Einwilligung -->
	<label class="study-consent">
		<input type="checkbox" bind:checked={consented} />
		<span class="study-consent-text">
			Ich habe die Hinweise gelesen und stimme der Teilnahme unter den genannten Bedingungen zu.
		</span>
	</label>

	<!-- CTA -->
	<button
		class="study-btn"
		class:study-btn--active={consented}
		disabled={!consented}
		onclick={proceed}
	>
		Zur Studie
	</button>

	<p class="study-footnote">TH Köln · Lehrstuhl Mobile und verteilte interaktive Systeme</p>
</div>
