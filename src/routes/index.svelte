<script lang="ts">
	import { onMount } from 'svelte';
	import type { Datapoint, Arc, Flight } from '../utils/types';

	import City from '../components/City.svelte';
	import Popup from '../components/Popup.svelte';
	import Path from '../components/Path.svelte';

	const DATAPOINTS = 3000;
	const MIN_DISTANCE = 1000;
	const LONG_RANGE = 180;
	const LAT_RANGE = 90;

	/**
	 * A map of [City, Country] ID to flight data
	 */
	let flights: Record<string, Flight[]> = {};

	/**
	 * The flight paths to show
	 */
	let arcs: Arc[] = [];

	/**
	 * The [City, Country] ID of the selected city
	 */
	let selected: string;

	/**
	 * The width of the viewport
	 */
	let width: number;

	/**
	 * The height of the viewport
	 */
	let height: number;

	/***
	 * The maximum number of outbound flights from any city
	 */
	let maxFlights: number;
	/**
	 * The maximum distance of any flight
	 */
	let maxDistance = 0;

	/**
	 * Load flights from the dataset
	 */
	async function loadData() {
		const data = await fetch('flights.json')
			.then((res) => res.json())
			.then((data) => filter(data))
			.then((data) => data.slice(1, DATAPOINTS));

		for (const entry of data) {
			if (!(`${entry.from_city}, ${entry.from_country}` in flights)) {
				flights[`${entry.from_city}, ${entry.from_country}`] = [];
			}
			if (entry.distance > maxDistance) {
				maxDistance = entry.distance;
			}
			flights[`${entry.from_city}, ${entry.from_country}`].push({
				distance: entry.distance,
				from: extractFlightNode(entry, 'from'),
				to: extractFlightNode(entry, 'to')
			});
		}

		flights = flights;
		maxFlights = Math.max(...Object.values(flights).map((l) => l.length));
	}

	/**
	 * Extract a to or from flight node from a single datapoint
	 * @param datapoint The datapoint containing the flight data
	 * @param prefix Whether the 'to' or 'from' data should be extracted
	 */
	function extractFlightNode(datapoint: Datapoint, prefix: 'from' | 'to' = 'from') {
		return {
			airport: datapoint[`${prefix}_airport`],
			city: datapoint[`${prefix}_city`],
			country: datapoint[`${prefix}_country`],
			lat: datapoint[`${prefix}_lat`],
			long: datapoint[`${prefix}_long`]
		};
	}

	/**
	 * Filter datapoints based on the minumum distance threshold
	 * @param data The loaded datapoints
	 */
	function filter(data: Datapoint[]): Datapoint[] {
		return data.filter((point) => point.distance > MIN_DISTANCE);
	}

	/**
	 * Generic function to map data from a domain to a range
	 * @param x The data to map
	 * @param dmin The minimum of the domain
	 * @param dmax The maximum of the domain
	 * @param rmin The minimum of the range
	 * @param rmax The maximum of the range
	 */
	function rescale(x: number, dmin: number, dmax: number, rmin: number, rmax: number) {
		return ((rmax - rmin) * (x - dmin)) / (dmax - dmin) + rmin;
	}

	/**
	 * Render the flight paths whenever a city is clicked
	 */
	function handleClick(e: CustomEvent, flights: Flight[]) {
		e.stopPropagation();

		if (selected == `${flights[0].from.city}, ${flights[0].from.country}`) return;

		selected = `${flights[0].from.city}, ${flights[0].from.country}`;

		arcs = [];
		for (const flight of flights) {
			arcs.push({
				distance: flight.distance,
				x1: rescale(flight.from.long, -LONG_RANGE, LONG_RANGE, 0, width),
				x2: rescale(flight.to.long, -LONG_RANGE, LONG_RANGE, 0, width),
				y1: rescale(flight.from.lat, -LAT_RANGE, LAT_RANGE, height, 0),
				y2: rescale(flight.to.lat, -LAT_RANGE, LAT_RANGE, height, 0)
			});
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<div
	class="relative w-screen h-screen overflow-hidden bg-slate-900"
	id="container"
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<svg {width} {height} class="relative z-20">
		{#each Object.keys(flights) as city}
			<City
				on:click={(e) => handleClick(e, flights[city])}
				cx={rescale(flights[city][0].from.long, -180, 180, 0, width)}
				cy={rescale(flights[city][0].from.lat, -90, 90, height, 0)}
				r={rescale(flights[city].length, 1, maxFlights, 3, 10)}
			/>
		{/each}
		{#each arcs as arc}
			{#key arc}
				<Path {arc} {maxDistance} />
			{/key}
		{/each}
	</svg>
	{#if selected}
		{#key selected}
			<Popup {selected} flights={flights[selected]} />
		{/key}
	{/if}
</div>

<style>
	#container {
		background-image: url('world.png');
		background-position: center;
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>
