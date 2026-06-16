<script lang="ts">
	import type { Item } from '$lib/questionnaire';

	let {
		item,
		value = null,
		anchorLow,
		anchorHigh,
		onChange
	}: {
		item: Item;
		value: number | null;
		anchorLow: string;
		anchorHigh: string;
		onChange: (key: string, val: number) => void;
	} = $props();

	const options = [1, 2, 3, 4, 5, 6, 7];
</script>

<div class="likert-item">
	<p class="likert-text">{item.text}</p>

	<div class="likert-row">
		{#each options as opt}
			<button
				class="likert-btn"
				class:likert-btn--selected={value === opt}
				onclick={() => onChange(item.key, opt)}
				aria-label="Option {opt}"
				aria-pressed={value === opt}
			>
				{opt}
			</button>
		{/each}
	</div>

	<div class="likert-anchors">
		<span>{anchorLow}</span>
		<span>{anchorHigh}</span>
	</div>
</div>

<style>
	.likert-item {
		margin-bottom: 28px;
	}
	.likert-text {
		font-size: 14px;
		line-height: 1.6;
		color: var(--study-text);
		margin-bottom: 12px;
	}
	.likert-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 4px;
	}
	.likert-btn {
		aspect-ratio: 1;
		border-radius: 6px;
		border: 1.5px solid var(--study-border);
		background: var(--study-surface);
		font-size: 13px;
		font-weight: 600;
		color: var(--study-subtle);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--study-font);
	}
	.likert-btn:active {
		transform: scale(0.93);
	}
	.likert-btn--selected {
		border-color: var(--study-primary);
		background: var(--study-primary);
		color: white;
	}
	.likert-anchors {
		display: flex;
		justify-content: space-between;
		margin-top: 6px;
		font-size: 10px;
		color: var(--study-subtle);
		line-height: 1.3;
	}
</style>
