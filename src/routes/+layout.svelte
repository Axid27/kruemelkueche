<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		function setVH() {
			document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
		}
		setVH();
		window.addEventListener('resize', setVH);
		return () => window.removeEventListener('resize', setVH);
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta name="theme-color" content="#F5ECD7" />
</svelte:head>

{@render children()}
