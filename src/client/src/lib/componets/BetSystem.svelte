<script lang="ts">
	import { gameStore } from '$lib/stores/game';

	// Props con valori di default

	let { pot = 1000, playerChips = 100, minBet = 0, close = () => {} } = $props();

	// State locale
	let betAmount = $state(minBet);

	let isSliderActive = false;

	// Preset percentuali comuni
	let presets = [
		{ label: '1/2 Pot', value: pot / 2 },
		{ label: 'Pot', value: pot },
		{ label: 'All-in', value: playerChips }
	];

	// Funzione per calcolare l'incremento basato sull'importo corrente
	function getIncrement(current: number) {
		if (current < 100) return 5;
		if (current < 500) return 25;
		if (current < 1000) return 100;
		return 500;
	}

	function handleIncrement() {
		const increment = 5;
		betAmount = Math.min(betAmount + increment, playerChips);
	}

	function handleDecrement() {
		const increment = 5;
		betAmount = Math.max(betAmount - increment, minBet);
	}

	function handlePresetClick(value: number) {
		betAmount = Math.min(value, playerChips);
	}

	function onBet(betAmount: number) {
		gameStore.send({
			type: 'BET',
			payload: {
				amount: betAmount
			}
		});
		close();
	}
</script>

<div class="w-full max-w-md touch-none rounded-lg bg-gray-800 p-4 shadow-lg">
	<!-- Display del bet corrente -->
	<div class="w-full max-w-md rounded-lg bg-gray-800 p-4 shadow-lg">
		<!-- Input del bet corrente -->
		<div class="mb-6 text-center">
			<span class="text-sm text-gray-400">Bet Amount</span>
			<input
				type="number"
				max={playerChips}
				bind:value={betAmount}
				oninput={() => {
					const value = betAmount;
					if (value > playerChips) {
						betAmount = playerChips;
					}
				}}
				onblur={() => {
					const numValue = betAmount || minBet;
					betAmount = Math.min(Math.max(numValue, minBet), playerChips);
				}}
				class="w-full rounded-lg border bg-gray-900 py-1 text-center text-3xl font-bold text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
			/>
		</div>
	</div>
	<!-- Controlli + e - -->
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={handleDecrement}
			class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-yellow-500 transition-colors hover:bg-gray-600"
			disabled={betAmount <= minBet}
		>
			-
		</button>

		<!-- Slider -->
		<input
			type="range"
			min={minBet}
			max={playerChips}
			bind:value={betAmount}
			onmousedown={() => (isSliderActive = true)}
			onmouseup={() => (isSliderActive = false)}
			class="h-2 w-3/5 cursor-pointer appearance-none rounded-lg bg-gray-700
      [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8
      [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
      [&::-webkit-slider-thumb]:h-8
      [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
		/>

		<button
			onclick={handleIncrement}
			class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-yellow-500 transition-colors hover:bg-gray-600"
			disabled={betAmount >= playerChips}
		>
			+
		</button>
	</div>

	<!-- Preset buttons -->
	<div class="mb-6 grid grid-cols-3 gap-2">
		{#each presets as preset}
			<button
				onclick={() => handlePresetClick(preset.value)}
				class="rounded bg-gray-700 px-4 py-2 text-sm text-yellow-500 transition-colors hover:bg-gray-600"
			>
				{preset.label}
			</button>
		{/each}
	</div>

	<!-- Bottone di bet -->
	<button
		onclick={() => onBet(betAmount)}
		class="w-full rounded-lg bg-yellow-500 py-3 font-bold text-gray-900 transition-colors hover:bg-yellow-400"
	>
		Bet {betAmount.toLocaleString()}
	</button>

	<!-- Info chips rimaste -->
	<div class="mt-4 text-center text-sm text-gray-400">
		Chips: {playerChips.toLocaleString()}
	</div>
</div>
