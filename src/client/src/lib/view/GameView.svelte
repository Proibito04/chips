<script lang="ts">
	import { gameStore } from '$lib/stores/game';
</script>

<div class="mx-auto space-y-4">
	<!-- Messages Section -->
	<div class="rounded-xl bg-gray-800/50 p-4">
		<h2 class="mb-4 text-xl font-bold text-white">Messages</h2>
		<div class="max-h-48 space-y-2 overflow-y-auto">
			{#each $gameStore.messages as message}
				<div class="rounded bg-gray-800 p-2 text-sm break-all text-gray-300">
					{JSON.stringify(message)}
				</div>
			{/each}
		</div>
	</div>
</div>
