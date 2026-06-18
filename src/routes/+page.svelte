<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { session } from '$lib/stores/session';
	import CookieBanner from '$lib/components/CookieBanner.svelte';

	let bannerVisible = false;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const pidFromUrl = params.get('pid');
		const pid = pidFromUrl ?? sessionStorage.getItem('pid');

		// No pid → participant hasn't gone through intro yet
		if (!pid) {
			goto('/study/intro');
			return;
		}

		// Persist to sessionStorage if it arrived via URL
		if (pidFromUrl) {
			sessionStorage.setItem('pid', pidFromUrl);
		}

		const condition = Number(sessionStorage.getItem('condition')) as 1 | 2 | 3;
		session.set({ participantId: pid, condition });

		setTimeout(() => {
			bannerVisible = true;
		}, 1500);
	});
</script>

<svelte:head>
	<title>Krümelküche – Backrezepte mit Herz</title>
</svelte:head>

<!-- Header -->
<header class="site-header">
	<div class="logo">
		<span class="logo-icon">🍪</span>
		<span class="logo-text">Krümelküche</span>
	</div>
	<nav class="nav-pills">
		<span>Rezepte</span>
		<span>Über uns</span>
	</nav>
</header>

<!-- Hero Section -->
<section class="hero">
	<div class="hero-badge">✨ Neu diese Woche</div>
	<h1 class="hero-title">Backen mit<br /><em>Liebe & Butter</em></h1>
	<p class="hero-sub">Einfache Rezepte, große Momente – für alle die Küche lieben.</p>

	<div class="recipe-cards">
		<div class="card card--featured">
			<div class="card-img card-img--cookies">🍪</div>
			<div class="card-body">
				<span class="card-tag">Klassiker</span>
				<h2 class="card-title">Schoko-Cookies mit Meersalz</h2>
				<p class="card-meta">35 Min · Einfach · 24 Stück</p>
			</div>
		</div>

		<div class="cards-row">
			<div class="card card--small">
				<div class="card-img card-img--cake">🎂</div>
				<div class="card-body">
					<span class="card-tag">Beliebt</span>
					<h3 class="card-title-sm">Zitronenkuchen</h3>
					<p class="card-meta">50 Min</p>
				</div>
			</div>
			<div class="card card--small">
				<div class="card-img card-img--muffin">🧁</div>
				<div class="card-body">
					<span class="card-tag">Schnell</span>
					<h3 class="card-title-sm">Blaubeer-Muffins</h3>
					<p class="card-meta">25 Min</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Was ist die Krümelküche -->
<section class="about">
	<div class="about-deco">🥣</div>
	<h2 class="section-title">Was ist die Krümelküche?</h2>
	<p class="section-text">
		Wir sind ein kleines Team aus leidenschaftlichen Hobbybäckerinnen und -bäckern aus Köln. Seit
		2019 teilen wir hier unsere liebsten Rezepte – von schnellen Alltagskuchen bis zu aufwendigen
		Festtagstorten.
	</p>
	<div class="about-tags">
		<span class="tag">🌿 Saisonal</span>
		<span class="tag">💛 Hausgemacht</span>
		<span class="tag">📖 Getestet</span>
	</div>
</section>

<!-- Kontakt -->
<section class="contact">
	<h2 class="section-title">Schreib uns</h2>
	<p class="section-text">
		Hast du ein Lieblingsrezept oder eine Frage? Wir freuen uns über jede Nachricht.
	</p>
	<div class="contact-form">
		<div class="form-field">
			<label>Name</label>
			<div class="input-mock">Marie Mustermann</div>
		</div>
		<div class="form-field">
			<label>E-Mail</label>
			<div class="input-mock">marie@beispiel.de</div>
		</div>
		<div class="form-field">
			<label>Nachricht</label>
			<div class="input-mock input-mock--tall">Euer Schoko-Cookie-Rezept ist das beste!</div>
		</div>
		<div class="btn-mock">Nachricht senden</div>
	</div>
</section>

<!-- Footer -->
<footer class="site-footer">
	<p>© 2025 Krümelküche · <span>Datenschutz</span> · <span>Impressum</span></p>
</footer>

<!-- Cookie Banner (nach 1.5s) -->
{#if bannerVisible}
	<CookieBanner
		onDecision={(choice) => {
			bannerVisible = false;
			goto(`/study/survey?pid=${sessionStorage.getItem('pid')}&choice=${choice}`);
		}}
	/>
{/if}

<style>
	/* ── Header ── */
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-bg);
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.logo-icon {
		font-size: 24px;
	}
	.logo-text {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 700;
		color: var(--color-primary);
	}
	.nav-pills {
		display: flex;
		gap: 12px;
		font-size: 13px;
		color: var(--color-subtle);
		font-family: var(--font-body);
	}

	/* ── Hero ── */
	.hero {
		padding: 28px 20px 8px;
	}
	.hero-badge {
		display: inline-block;
		background: var(--color-accent);
		color: var(--color-text);
		font-size: 11px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 20px;
		margin-bottom: 12px;
		font-family: var(--font-body);
	}
	.hero-title {
		font-family: var(--font-display);
		font-size: 34px;
		line-height: 1.2;
		color: var(--color-text);
		margin-bottom: 10px;
	}
	.hero-title em {
		color: var(--color-primary);
		font-style: italic;
	}
	.hero-sub {
		font-size: 15px;
		color: var(--color-subtle);
		margin-bottom: 24px;
		line-height: 1.5;
	}

	/* ── Cards ── */
	.recipe-cards {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.card {
		background: var(--color-surface);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		overflow: hidden;
		box-shadow: var(--shadow-soft);
	}
	.card--featured {
		display: flex;
		flex-direction: column;
	}
	.card-img {
		height: 140px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 64px;
		border-radius: var(--radius-md) var(--radius-md) 0 0;
	}
	.card-img--cookies {
		background: #fde8c8;
	}
	.card-img--cake {
		background: #fce4ec;
	}
	.card-img--muffin {
		background: #e8f5e9;
	}
	.card-body {
		padding: 12px 14px;
	}
	.card-tag {
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-primary);
		background: rgba(196, 98, 45, 0.1);
		padding: 2px 8px;
		border-radius: 20px;
	}
	.card-title {
		font-family: var(--font-display);
		font-size: 18px;
		margin: 6px 0 4px;
		color: var(--color-text);
	}
	.card-title-sm {
		font-family: var(--font-display);
		font-size: 14px;
		margin: 6px 0 4px;
		color: var(--color-text);
	}
	.card-meta {
		font-size: 12px;
		color: var(--color-subtle);
	}
	.cards-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.card--small .card-img {
		height: 90px;
		font-size: 40px;
	}

	/* ── About ── */
	.about {
		margin: 32px 20px;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: 24px 20px;
		border: 1px solid var(--color-border);
		text-align: center;
	}
	.about-deco {
		font-size: 36px;
		margin-bottom: 12px;
	}
	.about-tags {
		display: flex;
		gap: 8px;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 16px;
	}
	.tag {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 20px;
		padding: 4px 12px;
		font-size: 13px;
		color: var(--color-subtle);
	}

	/* ── Contact ── */
	.contact {
		padding: 0 20px 32px;
	}
	.contact-form {
		margin-top: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.form-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.form-field label {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-subtle);
	}
	.input-mock {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 10px 14px;
		font-size: 14px;
		color: #bca98a;
		font-family: var(--font-body);
	}
	.input-mock--tall {
		min-height: 72px;
	}
	.btn-mock {
		background: var(--color-primary);
		color: white;
		text-align: center;
		padding: 14px;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: 15px;
		font-family: var(--font-body);
		margin-top: 4px;
	}

	/* ── Shared ── */
	.section-title {
		font-family: var(--font-display);
		font-size: 22px;
		color: var(--color-text);
		margin-bottom: 10px;
	}
	.section-text {
		font-size: 14px;
		color: var(--color-subtle);
		line-height: 1.6;
	}

	/* ── Footer ── */
	.site-footer {
		text-align: center;
		padding: 20px;
		font-size: 12px;
		color: var(--color-subtle);
		border-top: 1px solid var(--color-border);
	}
	.site-footer span {
		text-decoration: underline;
		cursor: pointer;
	}
</style>
