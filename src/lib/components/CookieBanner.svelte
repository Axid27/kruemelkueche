<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { session } from '$lib/stores/session';
	import { logger } from '$lib/stores/logging';
	import lottie, { type AnimationItem } from 'lottie-web';

	let {
		onDecision
	}: { onDecision: (choice: 'accept' | 'granular' | 'decline') => void } = $props();

	let choice = $state<'accept' | 'granular' | 'decline' | null>(null);
	let pulseActive = $state(false);

	let animationContainer: HTMLDivElement;
	let anim: AnimationItem | null = null;
	let condition: 1 | 2 | 3 = 1;
	let pulseInterval: ReturnType<typeof setInterval> | null = null;

	const frames = {
		accept:   { start: 0,  end: 10 },
		granular: { start: 11, end: 21 },
		decline:  { start: 22, end: 54 }
	};

	const unsubscribe = session.subscribe((s) => {
		condition = s.condition ?? 1;
	});

	onMount(async () => {
		const animData = await fetch('/Cookie.json').then((r) => r.json());

		anim = lottie.loadAnimation({
			container: animationContainer,
			renderer: 'svg',
			loop: false,
			autoplay: false,
			animationData: animData
		});

		anim.goToAndStop(0, true);

		if (condition === 1) {
			startPulse();
		}

		logger.bannerShown();
	});

	onDestroy(() => {
		anim?.destroy();
		if (pulseInterval) clearInterval(pulseInterval);
		unsubscribe();
	});

	function startPulse() {
		pulseInterval = setInterval(() => {
			pulseActive = true;
			setTimeout(() => {
				pulseActive = false;
			}, 600);
		}, 2000);
	}

	function selectChoice(c: 'accept' | 'granular' | 'decline') {
		logger.optionTapped(c);
		choice = c;

		if (condition === 1) {
			pulseActive = true;
			setTimeout(() => {
				pulseActive = false;
			}, 400);
			return;
		}

		const range = frames[c];
		anim?.playSegments([range.start, range.end], true);
	}

	async function submit() {
		if (!choice) return;
		await logger.submitTapped(choice);
		onDecision(choice);
	}
</script>

<!-- Overlay -->
<div class="overlay" role="dialog" aria-modal="true" aria-label="Cookie-Einstellungen">
	<!-- Sheet -->
	<div class="sheet">
		<!-- Handle -->
		<div class="handle"></div>

		<!-- Animation -->
		<div class="lottie-wrap" class:pulse={pulseActive}>
			<div bind:this={animationContainer} class="lottie-container"></div>
		</div>

		<!-- Titel -->
		<div class="banner-text">
			<h2 class="banner-title">Dürfen wir Cookies verwenden?</h2>
			<p class="banner-sub">
				Wir nutzen Cookies, um dir passende Rezepte zu zeigen und unsere Seite zu verbessern.
			</p>
		</div>

		<!-- Tab-Auswahl -->
		<div class="tab-row" role="group" aria-label="Cookie-Optionen">
			<button
				class="tab"
				class:tab--active={choice === 'accept'}
				onclick={() => selectChoice('accept')}
				aria-pressed={choice === 'accept'}
			>
				<span class="tab-icon">✅</span>
				<span class="tab-label">Alle akzeptieren</span>
			</button>

			<button
				class="tab"
				class:tab--active={choice === 'granular'}
				onclick={() => selectChoice('granular')}
				aria-pressed={choice === 'granular'}
			>
				<span class="tab-icon">⚙️</span>
				<span class="tab-label">Auswahl treffen</span>
			</button>

			<button
				class="tab"
				class:tab--active={choice === 'decline'}
				onclick={() => selectChoice('decline')}
				aria-pressed={choice === 'decline'}
			>
				<span class="tab-icon">❌</span>
				<span class="tab-label">Ablehnen</span>
			</button>
		</div>

		<!-- Submit -->
		<button
			class="submit-btn"
			class:submit-btn--active={choice !== null}
			disabled={choice === null}
			onclick={submit}
			aria-disabled={choice === null}
		>
			{choice === null ? 'Bitte wählen' : 'Auswahl bestätigen'}
		</button>

		<!-- Datenschutz-Link (Dummy) -->
		<p class="privacy-hint">
			Mehr erfahren in unserer <span class="privacy-link">Datenschutzerklärung</span>
		</p>
	</div>
</div>

<style>
	/* ── Overlay ── */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(44, 26, 14, 0.45);
		z-index: 100;
		display: flex;
		align-items: flex-end;
		animation: fadeIn 0.3s ease;
	}
	@keyframes fadeIn {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	/* ── Sheet ── */
	.sheet {
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		background: var(--color-bg);
		border-radius: 24px 24px 0 0;
		padding: 12px 20px 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: 0 -8px 40px rgba(44, 26, 14, 0.15);
	}
	@keyframes slideUp {
		from { transform: translateY(100%); }
		to   { transform: translateY(0); }
	}

	/* ── Handle ── */
	.handle {
		width: 40px;
		height: 4px;
		background: var(--color-border);
		border-radius: 2px;
		margin-bottom: 4px;
	}

	/* ── Lottie ── */
	.lottie-wrap {
		width: 160px;
		height: 160px;
	}
	.lottie-wrap.pulse {
		animation: pulse 0.6s ease;
	}
	@keyframes pulse {
		0%   { transform: scale(1); }
		40%  { transform: scale(1.08); }
		70%  { transform: scale(0.97); }
		100% { transform: scale(1); }
	}
	.lottie-container {
		width: 100%;
		height: 100%;
	}

	/* ── Text ── */
	.banner-text { text-align: center; }
	.banner-title {
		font-family: var(--font-display);
		font-size: 20px;
		color: var(--color-text);
		margin-bottom: 6px;
	}
	.banner-sub {
		font-size: 13px;
		color: var(--color-subtle);
		line-height: 1.5;
	}

	/* ── Tabs ── */
	.tab-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 8px;
		width: 100%;
	}
	.tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 10px 6px;
		border-radius: var(--radius-sm);
		border: 2px solid var(--color-border);
		background: var(--color-surface);
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s, transform 0.15s;
		font-family: var(--font-body);
	}
	.tab:active { transform: scale(0.96); }
	.tab--active {
		border-color: var(--color-primary);
		background: rgba(196, 98, 45, 0.08);
	}
	.tab-icon { font-size: 20px; }
	.tab-label {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-text);
		text-align: center;
		line-height: 1.2;
	}

	/* ── Submit ── */
	.submit-btn {
		width: 100%;
		padding: 14px;
		border-radius: var(--radius-sm);
		border: none;
		font-size: 15px;
		font-weight: 600;
		font-family: var(--font-body);
		cursor: not-allowed;
		background: var(--color-border);
		color: var(--color-subtle);
		transition: background 0.25s, color 0.25s, transform 0.15s;
	}
	.submit-btn--active {
		background: var(--color-primary);
		color: white;
		cursor: pointer;
	}
	.submit-btn--active:active { transform: scale(0.98); }

	/* ── Privacy ── */
	.privacy-hint {
		font-size: 11px;
		color: var(--color-subtle);
		text-align: center;
	}
	.privacy-link {
		text-decoration: underline;
		cursor: pointer;
	}
</style>
