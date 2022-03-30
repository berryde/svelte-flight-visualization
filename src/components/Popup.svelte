<script lang="ts">
	import type { Flight } from 'src/utils/types';
	import { fly } from 'svelte/transition';

	export let selected: string;
	export let flights: Flight[];
</script>

<div
	class="absolute flex w-full items-center justify-center bottom-20 z-50"
	transition:fly={{ y: 100, x: 0, duration: 500 }}
>
	<div class="bg-slate-300 font-slate-900 p-3 rounded flex flex-col items-center justify-center">
		<p class="font-bold">{selected}</p>
		<div class="font-light text-sm text-center">
			<p>{flights.length} destinations</p>
		</div>
	</div>
</div>
