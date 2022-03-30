<script lang="ts">
	import type { Arc } from '../utils/types';

	import { draw } from 'svelte/transition';

	const ANIMATION_DURATION = 2000;
	const ARC_WIDTH = 30;

	export let arc: Arc;
	export let maxDistance: number;
</script>

<path
	transition:draw={{ duration: ANIMATION_DURATION }}
	d="M {arc.x1} {arc.y1} C {arc.x1 + ARC_WIDTH} {arc.y1 - ARC_WIDTH}, {arc.x2 - ARC_WIDTH} {arc.y2 -
		ARC_WIDTH}, {arc.x2} {arc.y2}"
	fill="transparent"
	stroke="rgb(255, {255 - (arc.distance / maxDistance) * 255}, 0)"
	class="stroke-2 pointer-events-none"
/>
