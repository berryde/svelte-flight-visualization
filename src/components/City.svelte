<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let cx: number;
	export let cy: number;
	export let r: number;

	const dispatch = createEventDispatcher();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		dispatch('click');
	}
</script>

<circle
	{cx}
	{cy}
	{r}
	opacity={0.5}
	class="hover:cursor-pointer fill-slate-300 hover:fill-yellow-400 hover:opacity-100 z-0 hover:z-50"
	on:click={handleClick}
/>
