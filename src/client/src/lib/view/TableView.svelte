<script lang="ts">
	import Player from '$lib/componets/Player.svelte';
	import { gameStore } from '$lib/stores/game';
</script>

{#if $gameStore.connected}
	<div class="rounded-xl bg-gray-800/50 p-4">
		<h2 class="mb-2 text-xl font-bold text-white">Players</h2>
		<div class="space-y-2">
			{#each Object.values($gameStore.players) as player}
				<Player {player} />
			{/each}
		</div>
	</div>
{/if}
