<script lang="ts">
	interface Props {
		player: {
			username: string;
			chips: number;
		};
	}

	let { player }: Props = $props();
</script>

<div class="mb-2 flex items-center rounded-lg bg-gray-800 p-4 shadow-lg">
	<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
		<!-- Puoi usare un'icona SVG qui -->
		<svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
			/>
		</svg>
	</div>
	<div class="ml-3 flex-grow">
		<h3 class="text-lg font-medium text-white">{player.username}</h3>
		<div class="flex items-center text-yellow-500">
			<!-- Coins icon -->
			<svg class="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{player.chips.toLocaleString()}</span>
		</div>
	</div>
</div>
